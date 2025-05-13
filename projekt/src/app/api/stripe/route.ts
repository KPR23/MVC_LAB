import { stripe } from '@/src/utils/stripe';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const eventId = searchParams.get('eventId');

  if (eventId) {
    try {
      const existingProducts = await stripe.products.search({
        query: `metadata['eventId']:'${eventId}'`,
      });

      if (existingProducts.data.length > 0) {
        const product = existingProducts.data[0];

        const prices = await stripe.prices.list({
          product: product.id,
          limit: 1,
          active: true,
        });

        if (prices.data.length > 0) {
          return new Response(
            JSON.stringify({
              productId: product.id,
              priceId: prices.data[0].id,
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

    const product = await stripe.products.create({
      name: `${event.title}`,
      description: `Bilet na wydarzenie ${event.title}`,
      images: [event.image],
      metadata: {
        eventId: event.id,
      },
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: event.price,
      currency: 'pln',
    });

    return new Response(
      JSON.stringify({
        productId: product.id,
        priceId: price.id,
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
