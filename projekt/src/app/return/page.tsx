import TitleBox from '@/src/components/TitleBox';
import { verifySession } from '@/src/server/db/dal';
import { Queries } from '@/src/server/db/queries';
import db from '@/src/server/db/drizzle';
import { events as eventsTable } from '@/src/server/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Stripe } from 'stripe';
import { stripe } from '../../utils/stripe';

export default async function Return({
  searchParams,
}: {
  searchParams: { session_id: string };
}) {
  const { session_id } = await searchParams;
  const session = await verifySession();

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)');

  const { status, line_items } = await stripe.checkout.sessions.retrieve(
    session_id,
    {
      expand: ['line_items', 'line_items.data.price.product', 'payment_intent'],
    }
  );

  console.log('Stripe session details:', {
    status,
    session_id,
    line_items: line_items?.data.map((item) => ({
      price: item.price,
      product: item.price?.product,
      metadata: (item.price?.product as Stripe.Product)?.metadata,
    })),
  });

  if (status === 'open') {
    return redirect('/');
  }

  if (status === 'complete' && session?.userId) {
    const product = line_items?.data[0]?.price?.product as Stripe.Product;
    const eventId = product?.metadata?.eventId;

    console.log('Product details:', {
      productId: product?.id,
      metadata: product?.metadata,
      eventId,
    });

    if (eventId) {
      try {
        const eventResults = await db
          .select()
          .from(eventsTable)
          .where(eq(eventsTable.id, eventId));

        if (eventResults.length > 0) {
          const event = eventResults[0];
          if (event.availableSeats > 0) {
            await db
              .update(eventsTable)
              .set({
                availableSeats: event.availableSeats - 1,
              })
              .where(eq(eventsTable.id, eventId));
          }
        }

        await Queries.createBooking(session.userId, eventId, session_id);
        console.log('Booking created successfully');
      } catch (error) {
        console.error('Failed to create booking:', error);
      }
    } else {
      console.error('No eventId found in product metadata');
    }

    return (
      <section id="success">
        <TitleBox
          action="Zakup zakończony"
          featuredTitle="pomyślnie"
          description={
            <>
              Zakupione bilety możesz zobaczyć w zakładce{' '}
              <Link href="/bookings" className="underline">
                Moje bilety
              </Link>
              .
            </>
          }
          button={false}
        />
      </section>
    );
  }
}
