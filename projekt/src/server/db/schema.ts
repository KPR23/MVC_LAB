import { relations } from 'drizzle-orm';
import {
  date,
  integer,
  pgTable,
  primaryKey,
  text,
  time,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
});

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  organizer: text('organizer').notNull(),
  category: text('category').notNull(),
  city: text('city').notNull(),
  location: text('location').notNull(),
  imageUrl: text('image_url').notNull(),
  dateFrom: date('date_from').notNull(),
  dateTo: date('date_to').notNull(),
  time: time('time').notNull(),
  capacity: integer('capacity').notNull(),
  availableSeats: integer('available_seats').notNull(),
  price: integer('price').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const artists = pgTable('artists', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const eventArtists = pgTable(
  'event_artists',
  {
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    artistId: uuid('artist_id')
      .notNull()
      .references(() => artists.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.eventId, table.artistId] }),
    };
  }
);

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id),
  stripeSessionId: text('stripe_session_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  event: one(events, {
    fields: [bookings.eventId],
    references: [events.id],
  }),
}));

export type DB_EventType = typeof events.$inferSelect;
export type DB_ArtistType = typeof artists.$inferSelect;
export type DB_EventArtistType = typeof eventArtists.$inferSelect;
export type DB_UserType = typeof users.$inferSelect;
export type DB_BookingType = typeof bookings.$inferSelect;
