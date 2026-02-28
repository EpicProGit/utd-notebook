import { and, eq, ilike } from 'drizzle-orm';
import { z } from 'zod';
import {
  type SectionWithFiles,
  type SelectSection,
} from '@src/server/db/models';
import { section } from '@src/server/db/schema/section';
import {
  normalizePrefix,
  pickLatestSection,
  type SectionCodeSummary,
  type SectionNumberSummary,
} from '@src/utils/section';
import { createTRPCRouter, publicProcedure } from '../trpc';

export type { SectionCodeSummary, SectionNumberSummary };

const byPrefixSchema = z.object({
  prefix: z.string(),
});

const byNumberSchema = z.object({
  prefix: z.string(),
  number: z.string(),
});

const byCodeSchema = z.object({
  prefix: z.string(),
  number: z.string(),
  sectionCode: z.string(),
});

const byIdSchema = z.object({
  id: z.string(),
});

const byCourseSchema = z.object({
  prefix: z.string(),
  number: z.string(),
});

const byProfessorSchema = z.object({
  profFirst: z.string(),
  profLast: z.string(),
});

const byCourseAndProfessorSchema = z.object({
  prefix: z.string(),
  number: z.string(),
  profFirst: z.string(),
  profLast: z.string(),
});

function groupBy<T, K extends string>(items: T[], keyFn: (item: T) => K) {
  const map = new Map<K, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const bucket = map.get(key) ?? [];
    bucket.push(item);
    map.set(key, bucket);
  }
  return map;
}

function toNumberSummaries(rows: SelectSection[]): SectionNumberSummary[] {
  const byNumber = groupBy(rows, (r) => r.number);

  return Array.from(byNumber.entries())
    .map(([number, entries]) => {
      const latest = pickLatestSection(entries);
      return {
        number,
        sectionCount: entries.length,
        latestTerm: latest?.term ?? 'Fall',
        latestYear: latest?.year ?? new Date().getFullYear(),
      };
    })
    .sort((a, b) => a.number.localeCompare(b.number));
}

function toCodeSummaries(rows: SectionWithFiles[]): SectionCodeSummary[] {
  return rows.map((row) => ({
    id: row.id,
    sectionCode: row.sectionCode,
    term: row.term,
    year: row.year,
    profFirst: row.profFirst,
    profLast: row.profLast,
    fileCount: row.files.length,
  }));
}

export const sectionRouter = createTRPCRouter({
  getSectionNumbersByPrefix: publicProcedure
    .input(byPrefixSchema)
    .query(async ({ input, ctx }) => {
      const normalizedPrefix = normalizePrefix(input.prefix);

      const rows = await ctx.db.query.section.findMany({
        where: eq(section.prefix, normalizedPrefix),
      });

      return toNumberSummaries(rows);
    }),

  getSectionCodesByNumber: publicProcedure
    .input(byNumberSchema)
    .query(async ({ input, ctx }) => {
      const normalizedPrefix = normalizePrefix(input.prefix);

      const rows = await ctx.db.query.section.findMany({
        where: and(
          eq(section.prefix, normalizedPrefix),
          eq(section.number, input.number),
        ),
        with: { files: true },
        orderBy: (sections, { asc, desc }) => [
          asc(sections.sectionCode),
          desc(sections.year),
          desc(sections.term),
        ],
      });

      return toCodeSummaries(rows);
    }),

  getSectionsByCode: publicProcedure
    .input(byCodeSchema)
    .query(async ({ input, ctx }) => {
      const normalizedPrefix = normalizePrefix(input.prefix);

      const rows = await ctx.db.query.section.findMany({
        where: and(
          eq(section.prefix, normalizedPrefix),
          eq(section.number, input.number),
          eq(section.sectionCode, input.sectionCode),
        ),
        with: { files: true },
        orderBy: (sections, { desc }) => [
          desc(sections.year),
          desc(sections.term),
        ],
      });

      return toCodeSummaries(rows);
    }),

  getSectionById: publicProcedure.input(byIdSchema).query(({ input, ctx }) =>
    ctx.db.query.section.findFirst({
      where: eq(section.id, input.id),
      with: { files: true },
    }),
  ),

  getNotesByCourse: publicProcedure
    .input(byCourseSchema)
    .query(async ({ input, ctx }) => {
      const normalizedPrefix = normalizePrefix(input.prefix);

      return ctx.db.query.section.findMany({
        where: and(
          eq(section.prefix, normalizedPrefix),
          eq(section.number, input.number),
        ),
        with: { files: true },
        orderBy: (sections, { desc }) => [
          desc(sections.year),
          desc(sections.term),
        ],
      });
    }),

  getNotesByProfessor: publicProcedure
    .input(byProfessorSchema)
    .query(async ({ input, ctx }) => {
      return ctx.db.query.section.findMany({
        where: and(
          ilike(section.profFirst, input.profFirst),
          ilike(section.profLast, input.profLast),
        ),
        with: { files: true },
        orderBy: (sections, { desc }) => [
          desc(sections.year),
          desc(sections.term),
        ],
      });
    }),

  getNotesByCourseAndProfessor: publicProcedure
    .input(byCourseAndProfessorSchema)
    .query(async ({ input, ctx }) => {
      const normalizedPrefix = normalizePrefix(input.prefix);

      return ctx.db.query.section.findMany({
        where: and(
          eq(section.prefix, normalizedPrefix),
          eq(section.number, input.number),
          ilike(section.profFirst, input.profFirst),
          ilike(section.profLast, input.profLast),
        ),
        with: { files: true },
        orderBy: (sections, { desc }) => [
          desc(sections.year),
          desc(sections.term),
        ],
      });
    }),
});
