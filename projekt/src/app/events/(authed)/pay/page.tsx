'use client';

import Checkout from '@/src/components/StripeCheckout';
import { verifySession } from '@/src/server/db/dal';
import { redirect, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default async function Page() {
  const session = await verifySession();
  if (!session) {
    toast.error('Zaloguj się, aby kontynuować.');
    redirect('/login');
  }

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
