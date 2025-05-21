import {
  date,
  integer,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
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

export type DB_EventType = typeof events.$inferSelect;
export type DB_ArtistType = typeof artists.$inferSelect;
export type DB_EventArtistType = typeof eventArtists.$inferSelect;
