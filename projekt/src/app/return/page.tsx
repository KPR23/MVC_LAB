import { redirect } from 'next/navigation';

import { stripe } from '../../utils/stripe';
import TitleBox from '@/src/components/TitleBox';

export default async function Return({
  searchParams,
}: {
  searchParams: { session_id: string };
}) {
  const { session_id } = await searchParams;

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)');

  const { status, customer_details } = await stripe.checkout.sessions.retrieve(
    session_id,
    {
      expand: ['line_items', 'payment_intent'],
    }
  );

  const customerEmail = customer_details?.email;

  if (status === 'open') {
    return redirect('/');
  }

  if (status === 'complete') {
    return (
      <section id="success">
        <TitleBox
          action="Zakup zakończony"
          featuredTitle="pomyślnie"
          description="Na Twój adres email zostały wysłane zakupione bilety."
          button={false}
        />
      </section>
    );
  }
}
