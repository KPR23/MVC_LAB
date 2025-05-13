import { EventFilter, EventListPage, TitleBox } from '@/src/components';
import { EventController } from '@/src/controllers/EventController';

export default async function EventsPage() {
  const events = await EventController.listEvents();

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <TitleBox
        action="Przeglądaj"
        featuredTitle="wydarzenia"
        description="Odkryj i zakup bilety na nadchodzące wydarzenia"
        button={true}
      />
      <div className="w-full xl:px-60 2xl:px-80 mb-4">
        <EventFilter />
      </div>
      <div className="w-full xl:px-60 2xl:px-80">
        <EventListPage events={events} />
      </div>
    </div>
  );
}
