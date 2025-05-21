'use client';

import { Ticket } from 'lucide-react';
import { createSlug } from '../utils/eventUtils';
import EventCard from './EventCard';

export type EventData = {
  id: string;
  title: string;
  description: string;
  organizer: string;
  category: string;
  city: string;
  location: string;
  imageUrl: string;
  dateFrom: string;
  dateTo: string;
  time: string;
  capacity: number;
  availableSeats: number;
  price: number;
  createdAt: Date;
  artistsData?: Array<{ id: string; name: string }>;
};

function getSlug(event: EventData) {
  return {
    category: createSlug(event.category),
    title: createSlug(event.title),
  };
}

export default function EventListPage(props: { events: EventData[] }) {
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
            <h2 className="text-lg font-bold">Nie znaleziono wydarzeń</h2>
            <p className="text-muted-foreground text-md">
              Obecnie nie ma dostępnych wydarzeń spełniających Twoje kryteria.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
