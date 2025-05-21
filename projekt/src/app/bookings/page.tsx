import { BookingListPage, TitleBox } from '@/src/components';
import { BookingController } from '@/src/controllers/BookingController';
import { verifySession } from '@/src/server/db/dal';
import { redirect } from 'next/navigation';

export default async function TicketsPage() {
  const session = await verifySession();
  if (!session) {
    redirect('/login');
  }

  const { events } = await BookingController.getUserBookingsWithEventModels(
    session.userId
  );

  return (
    <div className="flex flex-col gap-4">
      <TitleBox
        action="Zakupione"
        featuredTitle="bilety"
        description="Zarządzaj swoimi zakupionymi biletami"
        button={false}
      />
      <div className="w-full xl:px-60 2xl:px-80">
        <BookingListPage events={events} />
      </div>
    </div>
  );
}
