import { relations, sql } from 'drizzle-orm';
import {
  index,
  pgEnum,
  pgTable,
  smallint,
  text,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { file } from './file';

export const termEnum = pgEnum('term', ['Spring', 'Summer', 'Fall']);

export const section = pgTable(
  'section',
  {
    id: varchar('id')
      .default(sql`nanoid(20)`)
      .primaryKey(),
    prefix: varchar('prefix', { length: 4 }).notNull(),
    number: varchar('number', { length: 4 }).notNull(),
    sectionCode: varchar('section_code', { length: 3 }).notNull(),
    term: termEnum('term').notNull(),
    year: smallint('year').notNull(),

    profFirst: text('prof_first').notNull(),
    profLast: text('prof_last').notNull(),
  },
  (t) => [
    uniqueIndex('section_unique_idx').on(
      t.prefix,
      t.number,
      t.sectionCode,
      t.term,
      t.year,
    ),
    index('section_by_course_idx').on(t.prefix, t.number),
    index('section_by_professor_idx').on(t.profFirst, t.profLast),
    index('section_by_semester_idx').on(t.term, t.year),
  ],
);

export const sectionRelations = relations(section, ({ many }) => ({
  files: many(file),
}));
