'use client';

import { Ticket } from 'lucide-react';
import EventCard from './EventCard';
import { EventData } from './EventListPage';

function getSlug(event: EventData) {
  return {
    category: event.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  };
}

export default function BookingListPage(props: { events: EventData[] }) {
  const events = props.events;

  const eventsWithSlug = events.map((event) => ({
    ...event,
    getSlug: () => getSlug(event),
  }));

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-6 py-4 max-w-screen-xl mx-auto">
      {eventsWithSlug.length > 0 ? (
        eventsWithSlug.map((event) => (
          <div key={event.id} className="w-full max-w-[290px] flex-shrink-0">
            <EventCard event={event} />
          </div>
        ))
      ) : (
        <div className="col-span-full row-span-full flex flex-col space-y-2 items-center justify-center h-128 w-full">
          <Ticket size={42} className="text-muted-foreground" />
          <div className="text-center space-y-2">
            <h2 className="text-lg font-bold">
              Nie znaleziono żadnych biletów
            </h2>
            <p className="text-muted-foreground text-md">
              Obecnie nie masz żadnych zakupionych biletów.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
