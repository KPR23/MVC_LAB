import 'server-only';

import db from './drizzle';
import { events } from './schema';
import { eq } from 'drizzle-orm';
import { get } from 'http';

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
