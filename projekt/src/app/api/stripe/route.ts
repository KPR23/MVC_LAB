import { getEventDateInfo } from '@/src/utils/eventUtils';
import { stripe } from '@/src/utils/stripe';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const eventId = searchParams.get('eventId');

  if (eventId) {
    try {
      const existingProducts = await stripe.products.search({
        query: `metadata["type"]:"ticket_${eventId}"`,
      });

      if (existingProducts.data.length > 0) {
        const product = existingProducts.data[0];

        const prices = await stripe.prices.list({
          product: product.id,
          limit: 1,
          active: true,
        });

        const passProducts = await stripe.products.search({
          query: `metadata["type"]:"pass_${eventId}"`,
        });

        let passPriceId = null;
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

        if (prices.data.length > 0) {
          return new Response(
            JSON.stringify({
              productId: product.id,
              priceId: prices.data[0].id,
              passPriceId,
              exists: true,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
      }

      return new Response(JSON.stringify({ exists: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error searching for product:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to search for product' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response(JSON.stringify({ error: 'EventId is required' }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event } = body;

    console.log('Received event data:', JSON.stringify(event, null, 2));

    // Check for event.id from the request body
    let eventId = event?.id;

    // If no event ID in the request body, check URL parameters
    if (!eventId) {
      const searchParams = request.nextUrl.searchParams;
      eventId = searchParams.get('eventId');
      console.log('Using eventId from URL params:', eventId);
    }

    // Still no event ID? Return error
    if (!eventId) {
      return new Response(
        JSON.stringify({ error: 'Invalid event data: missing ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Add ID to event object if missing
    if (!event.id) {
      event.id = eventId;
    }

    const product = await stripe.products.create({
      name: `${event.title}`,
      description: `Bilet na wydarzenie ${event.title} - jednodniowy`,
      images: [event.image || event.imageUrl],
      metadata: {
        type: `ticket_${eventId}`,
      },
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: event.price,
      currency: 'pln',
    });

    let passProduct = undefined;
    let passPrice = undefined;

    if (event.dateFrom !== event.dateTo) {
      const { passPriceInPLN } = getEventDateInfo(event);

      passProduct = await stripe.products.create({
        name: `${event.title} - Karnet`,
        description: `Karnet na całe wydarzenie ${event.title}`,
        images: [event.image || event.imageUrl],
        metadata: {
          type: `pass_${eventId}`,
        },
      });

      passPrice = await stripe.prices.create({
        product: passProduct.id,
        unit_amount: passPriceInPLN,
        currency: 'pln',
      });
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
    return new Response(
      JSON.stringify({ error: 'Failed to create Stripe product and price' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
