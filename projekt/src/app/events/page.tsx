import { Queries } from '@/src/server/db/queries';
import Image from 'next/image';
import Link from 'next/link';

export default async function EventsPage() {
  const events = await Queries.getEvents();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Events</h1>
      <p className="mt-4 text-lg">Welcome to the events page!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {events.length > 0 ? (
          events.map((event) => (
            <Link
              href={`/events/${encodeURIComponent(event.title)}`}
              key={event.id}
              className="p-4 border rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-semibold">{event.title}</h2>
              <p className="mt-2 text-gray-700">{event.description}</p>
              <p className="mt-2 text-gray-700">Location: {event.location}</p>
              <p className="mt-2 text-gray-700">Date: {event.date}</p>
              <p className="mt-2 text-gray-700">Capacity: {event.capacity}</p>
              <p className="mt-2 text-gray-700">Price: ${event.price}</p>
              <img
                src={event.imageUrl}
                alt={event.title}
                className="mt-4 rounded-lg"
                //   width={500}
                //   height={300}
              />
            </Link>
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
