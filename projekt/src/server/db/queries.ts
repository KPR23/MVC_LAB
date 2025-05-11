import 'server-only';

import db from './drizzle';
import { eq } from 'drizzle-orm';
import { events } from './schema';

export const Queries = {
  getEvents: function () {
    return db.select().from(events);
  },
  getEventbyId: function (id: string) {
    return db.select().from(events).where(eq(events.id, id));
  },
  getEventbyTitle: function (title: string) {
    return db
      .select()
      .from(events)
      .where(eq(events.title, encodeURIComponent(title)));
  },
};

export const Mutations = {
  createEvent: async function (input: {
    event: {
      title: string;
      description: string;
      artists: string;
      organizer: string;
      category: string;
      city: string;
      location: string;
      imageUrl: string;
      dateTo: string;
      dateFrom: string;
      time: string;
      capacity: number;
      availableSeats: number;
      price: number;
    };
  }) {
    try {
      console.log('Attempting database insertion...');
      const result = await db.insert(events).values({
        ...input.event,
        dateFrom: input.event.dateFrom,
        dateTo: input.event.dateTo,
        time: input.event.time,
      });
      console.log('Database insertion successful:', result);
      return result;
    } catch (dbError) {
      console.error('Database insertion error:', dbError);
      throw new Error('Failed to save event to the database.');
    }
  },
};
