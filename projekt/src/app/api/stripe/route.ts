import { BookingController } from '@/src/controllers/BookingController';
import { verifyApiSession } from '@/src/server/db/dal';
import { getEventDateInfo } from '@/src/utils/eventUtils';
import { stripe } from '@/src/utils/stripe';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const session = await verifyApiSession(request);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const searchParams = request.nextUrl.searchParams;
  const eventId = searchParams.get('eventId');

  if (!eventId) {
    return new Response(JSON.stringify({ error: 'EventId is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const ticketProducts = await stripe.products.search({
      query: `metadata["type"]:"ticket_${eventId}"`,
    });

    if (ticketProducts.data.length === 0) {
      return new Response(JSON.stringify({ exists: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const ticketProduct = ticketProducts.data[0];

    const ticketPrices = await stripe.prices.list({
      product: ticketProduct.id,
      limit: 1,
      active: true,
    });

    if (ticketPrices.data.length === 0) {
      return new Response(JSON.stringify({ exists: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { events } = await BookingController.getUserBookingsWithEventModels(
      session.userId as string
    );
    console.log(session.userId);

    const userBookedEvent = events.some((e) => e.id === eventId);

    if (userBookedEvent) {
      return new Response(
        JSON.stringify({
          error: 'Nie możesz ponownie kupić biletu na to wydarzenie.',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    const ticketPriceId = ticketPrices.data[0].id;

    let passPriceId = null;
    const passProducts = await stripe.products.search({
      query: `metadata["type"]:"pass_${eventId}"`,
    });

    if (passProducts.data.length > 0) {
      const passProduct = passProducts.data[0];
      const passPrices = await stripe.prices.list({
        product: passProduct.id,
        limit: 1,
        active: true,
      });
      if (passPrices.data.length > 0) {
        passPriceId = passPrices.data[0].id;
      }
    }

    return new Response(
      JSON.stringify({
        productId: ticketProduct.id,
        priceId: ticketPriceId,
        passPriceId,
        exists: true,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error searching for Stripe product:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to search for Stripe product' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await verifyApiSession(request);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const body = await request.json();
    const searchParams = request.nextUrl.searchParams;

    let eventDetails = body.event?.event;
    const eventId = eventDetails?.eventId || searchParams.get('eventId');

    if (!eventId) {
      return new Response(
        JSON.stringify({ error: 'Invalid event data: missing ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (eventDetails) {
      if (!eventDetails.id) {
        eventDetails.id = eventId;
      }
    } else {
      eventDetails = { id: eventId };
    }

    const eventData = eventDetails;

    if (eventId && searchParams.get('eventId') && !body.event?.event?.eventId) {
      console.log(
        'Stripe API: Using eventId from URL params for POST:',
        eventId
      );
    }

    if (
      !eventData ||
      !eventData.title ||
      typeof eventData.price === 'undefined'
    ) {
      console.error(
        'Stripe API: Essential event data (title, price) missing for product creation.',
        eventData
      );
      return new Response(
        JSON.stringify({
          error: 'Essential event data for Stripe product creation is missing.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating Stripe product with data:', {
      title: eventData.title,
      eventId: eventData.id,
      metadata: {
        type: `ticket_${eventData.id}`,
        eventId: eventData.id,
      },
    });

    const product = await stripe.products.create({
      name: `${eventData.title}`,
      description: `Bilet na wydarzenie ${eventData.title} - jednodniowy`,
      images: [eventData.imageUrl],
      metadata: {
        type: `ticket_${eventData.id}`,
        eventId: eventData.id,
      },
    });

    console.log('Created Stripe product:', {
      id: product.id,
      name: product.name,
      metadata: product.metadata,
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: eventData.price,
      currency: 'pln',
    });

    let passProduct = undefined;
    let passPrice = undefined;

    if (eventData.dateFrom !== eventData.dateTo) {
      const { passPriceInPLN } = getEventDateInfo(eventData);
      if (typeof passPriceInPLN !== 'undefined') {
        passProduct = await stripe.products.create({
          name: `${eventData.title} - Karnet`,
          description: `Karnet na całe wydarzenie ${eventData.title}`,
          images: [eventData.imageUrl],
          metadata: {
            type: `pass_${eventData.id}`,
            eventId: eventData.id,
          },
        });

        passPrice = await stripe.prices.create({
          product: passProduct.id,
          unit_amount: passPriceInPLN,
          currency: 'pln',
        });
      } else {
        console.warn(
          'Stripe API: passPriceInPLN could not be determined, skipping pass creation.'
        );
      }
    }

    return new Response(
      JSON.stringify({
        productId: product.id,
        priceId: price.id,
        ...(passProduct && { passProductId: passProduct.id }),
        ...(passPrice && { passPriceId: passPrice.id }),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating Stripe product and price:', error);
    const errorMessage =
      error instanceof Error && error.message
        ? error.message
        : 'Failed to create Stripe product and price';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
