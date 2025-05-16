'use client';

import Checkout from '@/src/components/StripeCheckout';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const priceId = searchParams.get('priceId');

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Płatność za bilet</h1>
      <div className="bg-card p-8 rounded-lg shadow-md">
        <Checkout priceId={priceId || undefined} />
      </div>
    </div>
  );
}
