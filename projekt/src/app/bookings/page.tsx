import { EventListPage, TitleBox } from '@/src/components';
import { verifySession } from '@/src/server/db/dal';
import { Queries } from '@/src/server/db/queries';
import { redirect } from 'next/navigation';

export default async function TicketsPage() {
  const session = await verifySession();
  if (!session) {
    redirect('/login');
  }

  const userBookings = await Queries.getUserBookings(session.userId);

  return (
    <div className="flex flex-col gap-4">
      <TitleBox
        action="Zakupione"
        featuredTitle="bilety"
        description="Zarządzaj swoimi zakupionymi biletami"
        button={false}
      />
      <div className="w-full xl:px-60 2xl:px-80">
        <EventListPage events={userBookings.map((booking) => booking.event)} />
      </div>
    </div>
  );
}
