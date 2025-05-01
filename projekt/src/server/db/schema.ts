import {
  date,
  integer,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  location: text('location').notNull(),
  imageUrl: text('image_url').notNull(),
  date: date('date').notNull(),
  time: time('time').notNull(),
  capacity: integer('capacity').notNull(),
  availableSeats: integer('available_seats').notNull(),
  price: integer('price').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type DB_EventType = typeof events.$inferSelect;
