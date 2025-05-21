'use server';

import { headers } from 'next/headers';
import { stripe } from '../utils/stripe';
import { verifySession } from '@/src/server/db/dal';
import db from '@/src/server/db/drizzle';
import { users } from '@/src/server/db/schema';
import { eq } from 'drizzle-orm';

export async function fetchClientSecret(priceId?: string) {
  const origin = (await headers()).get('origin');
  const session = await verifySession();

  let customerEmail;
  if (session?.userId) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
    });
    customerEmail = user?.email;
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
    customer_email: customerEmail,
  });

  if (!checkoutSession.client_secret) {
    throw new Error('Failed to create checkout session');
  }

  return checkoutSession.client_secret;
}
