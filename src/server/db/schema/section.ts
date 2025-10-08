import { relations, sql } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { file } from './file';

// IDEA: Section is just an ID for now, NEEDS to be expanded, similar to ./file.ts
export const section = pgTable('section', {
  id: text('id')
    .default(sql`nanoid(20)`)
    .primaryKey(),
});

export const sectionRelations = relations(section, ({ many }) => ({
  files: many(file),
}));
