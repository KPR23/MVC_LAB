import 'server-only';

import db from './drizzle';
import { events } from './schema';
import { eq } from 'drizzle-orm';

export const Queries = {
  getEventbyId: function (id: string) {
    return db.select().from(events).where(eq(events.id, id));
  },
  getEvents: function () {
    return db.select().from(events);
  },
};

export const Mutations = {
  createEvent: async function (input: {
    event: {
      title: string;
      description: string;
      location: string;
      imageUrl: string;
      date: string;
      capacity: number;
      price: number;
    };
  }) {
    return await db.insert(events).values({ ...input.event });
  },
};
