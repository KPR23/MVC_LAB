'use server';

import { headers } from 'next/headers';
import { stripe } from '../utils/stripe';

export async function fetchClientSecret(priceId?: string) {
  const origin = (await headers()).get('origin');

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.client_secret) {
    throw new Error('Failed to create checkout session');
  }

  return session.client_secret;
}
