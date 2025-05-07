import EventCard from '@/src/components/EventCard';
import { Button } from '@/src/components/ui/button';
import { Queries } from '@/src/server/db/queries';
import { Plus, Ticket } from 'lucide-react';

export default async function EventsPage() {
  const events = await Queries.getEvents();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex justify-between items-center bg-card py-8 px-[165px] mb-8 w-full">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Przeglądaj wydarzenia</h1>
          <p className="text-muted-foreground">
            Odkryj i zakup bilety na nadchodzące wydarzenia
          </p>
        </div>
        <div>
          <Button className="gap-1" variant="outline">
            <Plus />
            Dodaj wydarzenie
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 justify-items-center w-full px-40">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="w-full max-w-[380px] flex-shrink-0">
              <EventCard event={event} />
            </div>
          ))
        ) : (
          <div className="col-span-full row-span-full flex flex-col space-y-2 items-center justify-center h-screen w-full">
            <Ticket size={42} className="text-muted-foreground" />
            <div className="text-center space-y-2">
              <h2 className="text-lg font-bold">Nie znaleziono wydarzeń</h2>
              <p className="text-muted-foreground text-md">
                Obecnie nie ma dostępnych wydarzeń spełniających Twoje kryteria.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
