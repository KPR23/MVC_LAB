import EventCard from '@/src/components/EventCard';
import { Button } from '@/src/components/ui/button';
import { Queries } from '@/src/server/db/queries';
import { Plus } from 'lucide-react';

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
          <Button className="gap-1" variant={'outline'}>
            <Plus />
            Dodaj wydarzenie
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 justify-items-center w-full px-20">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="w-full max-w-[380px] flex-shrink-0">
              <EventCard event={event} />
            </div>
          ))
        ) : (
          <div className="p-4 border rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold">No events found</h2>
            <p className="mt-2 text-gray-700">Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
