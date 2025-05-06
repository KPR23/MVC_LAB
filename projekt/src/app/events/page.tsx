import EventCard from '@/src/components/EventCard';
import { Queries } from '@/src/server/db/queries';

export default async function EventsPage() {
  const events = await Queries.getEvents();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Events</h1>
      <p className="mt-4 text-lg">Welcome to the events page!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
        {events.length > 0 ? (
          events.map((event) => <EventCard key={event.id} event={event} />)
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
