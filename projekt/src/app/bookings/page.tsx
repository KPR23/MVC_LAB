import { verifySession } from '@/src/server/db/dal';
import { redirect } from 'next/navigation';

export default async function TicketsPage() {
  const session = await verifySession();
  if (!session) {
    redirect('/login');
  }
  return <h1>tickets</h1>;
}
