import 'server-only';

import { eq } from 'drizzle-orm';
import db from './drizzle';
import { artists, bookings, eventArtists, events } from './schema';

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
  getArtistsByEventId: function (eventId: string) {
    return db
      .select({
        id: artists.id,
        name: artists.name,
      })
      .from(artists)
      .innerJoin(eventArtists, eq(eventArtists.artistId, artists.id))
      .where(eq(eventArtists.eventId, eventId));
  },

  async createBooking(
    userId: string,
    eventId: string,
    stripeSessionId: string
  ) {
    return db.insert(bookings).values({
      userId,
      eventId,
      stripeSessionId,
    });
  },
  async getUserBookings(userId: string) {
    return db.query.bookings.findMany({
      where: eq(bookings.userId, userId),
      with: {
        event: true,
      },
    });
  },
};

export const Mutations = {
  createEvent: async function (input: {
    event: {
      title: string;
      description: string;
      artists: Array<{ id: string; name: string }>;
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
    };
  }) {
    try {
      const eventResult = await db
        .insert(events)
        .values({
          title: input.event.title,
          description: input.event.description,
          organizer: input.event.organizer,
          category: input.event.category,
          city: input.event.city,
          location: input.event.location,
          imageUrl: input.event.imageUrl,
          dateFrom: input.event.dateFrom,
          dateTo: input.event.dateTo,
          time: input.event.time,
          capacity: input.event.capacity,
          availableSeats: input.event.availableSeats,
          price: input.event.price,
        })
        .returning({ id: events.id });

      const eventId = eventResult[0].id;

      for (const artist of input.event.artists) {
        let artistId;

        const existingArtistByName = await db
          .select({ id: artists.id })
          .from(artists)
          .where(eq(artists.name, artist.name));

        if (existingArtistByName.length > 0) {
          artistId = existingArtistByName[0].id;
        } else if (artist.id) {
          const existingArtistById = await db
            .select({ id: artists.id })
            .from(artists)
            .where(eq(artists.id, artist.id));

          if (existingArtistById.length > 0) {
            artistId = existingArtistById[0].id;
          } else {
            const newArtist = await db
              .insert(artists)
              .values({
                id: artist.id,
                name: artist.name,
              })
              .returning({ id: artists.id });
            artistId = newArtist[0].id;
          }
        } else {
          const newArtist = await db
            .insert(artists)
            .values({
              name: artist.name,
            })
            .returning({ id: artists.id });
          artistId = newArtist[0].id;
        }

        await db.insert(eventArtists).values({
          eventId: eventId,
          artistId: artistId,
        });
      }

      return { eventId };
    } catch (dbError) {
      throw new Error('Failed to save event to the database.', {
        cause: dbError,
      });
    }
  },

  updateEvent: async function (input: {
    event: {
      id: string;
      title: string;
      description: string;
      artists: Array<{ id?: string; name: string }>;
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
    };
  }) {
    try {
      console.log('Updating event with data:', input.event);
      if (!input.event.id) {
        throw new Error('Event ID is required for update');
      }

      const updateResult = await db
        .update(events)
        .set({
          title: input.event.title,
          description: input.event.description,
          organizer: input.event.organizer,
          category: input.event.category,
          city: input.event.city,
          location: input.event.location,
          imageUrl: input.event.imageUrl,
          dateFrom: input.event.dateFrom,
          dateTo: input.event.dateTo,
          time: input.event.time,
          capacity: input.event.capacity,
          availableSeats: input.event.availableSeats,
          price: input.event.price,
        })
        .where(eq(events.id, input.event.id));

      console.log('Event update result:', updateResult);

      await db
        .delete(eventArtists)
        .where(eq(eventArtists.eventId, input.event.id));

      console.log('Processing artists:', input.event.artists);
      for (const artist of input.event.artists) {
        let artistId;

        const existingArtistByName = await db
          .select({ id: artists.id })
          .from(artists)
          .where(eq(artists.name, artist.name));

        if (existingArtistByName.length > 0) {
          artistId = existingArtistByName[0].id;
        } else if (artist.id) {
          const existingArtistById = await db
            .select({ id: artists.id })
            .from(artists)
            .where(eq(artists.id, artist.id));

          if (existingArtistById.length > 0) {
            artistId = existingArtistById[0].id;
          } else {
            const newArtist = await db
              .insert(artists)
              .values({
                id: artist.id,
                name: artist.name,
              })
              .returning({ id: artists.id });
            artistId = newArtist[0].id;
          }
        } else {
          const newArtist = await db
            .insert(artists)
            .values({
              name: artist.name,
            })
            .returning({ id: artists.id });
          artistId = newArtist[0].id;
        }

        await db.insert(eventArtists).values({
          eventId: input.event.id,
          artistId: artistId,
        });
      }

      return { eventId: input.event.id };
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to update event in the database.', {
        cause: dbError,
      });
    }
  },
  deleteEvent: async function (input: { event: { id: string } }) {
    try {
      const existingBookings = await db.query.bookings.findMany({
        where: eq(bookings.eventId, input.event.id),
      });

      if (existingBookings.length > 0) {
        await db.delete(bookings).where(eq(bookings.eventId, input.event.id));
      }

      await db.delete(events).where(eq(events.id, input.event.id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error(`Failed to delete event: ${(error as Error).message}`);
    }
  },
};
