import { pgTable, uuid } from 'drizzle-orm/pg-core';

export const testTable = pgTable('test_table', {
  id: uuid('id').primaryKey().defaultRandom(),
});
