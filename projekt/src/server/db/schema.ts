import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const waitingList = pgTable('table', {
  id: uuid('id').primaryKey().defaultRandom(),
});
