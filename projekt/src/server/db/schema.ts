import {
  date,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(),
  imageUrl: text('image_url').notNull(),
  date: date('date').notNull(),
  capacity: integer('capacity').notNull(),
  price: integer('price').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
