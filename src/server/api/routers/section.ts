import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import {
  sectionWithFiles,
  type SectionWithFiles,
  type SelectSection,
} from '@src/server/db/models';
import { section } from '@src/server/db/schema/section';
import {
  mockSections,
  normalizePrefix,
  pickLatestSection,
  useMockData,
  type SectionCodeSummary,
  type SectionNumberSummary,
} from '@src/utils/sectionCore';
import { createTRPCRouter, publicProcedure } from '../trpc';

export type { SectionCodeSummary, SectionNumberSummary };

const byPrefixSchema = z.object({
  prefix: z.string().default(''),
});

const byNumberSchema = z.object({
  prefix: z.string().default(''),
  number: z.string().default(''),
});

const detailSchema = z.object({
  prefix: z.string().default(''),
  number: z.string().default(''),
  sectionCode: z.string().default(''),
});

export const sectionRouter = createTRPCRouter({
  getSectionNumbersByPrefix: publicProcedure
    .input(byPrefixSchema)
    .query(async ({ input, ctx }) => {
      const normalizedPrefix = normalizePrefix(input.prefix);

      if (useMockData) {
        const filtered = mockSections.filter(
          (entry) => entry.prefix === normalizedPrefix,
        );
        const byNumber = new Map<string, SectionWithFiles[]>();
        filtered.forEach((entry) => {
          const bucket = byNumber.get(entry.number) ?? [];
          bucket.push(entry);
          byNumber.set(entry.number, bucket);
        });

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

      const rows = await ctx.db.query.section.findMany({
        where: eq(section.prefix, normalizedPrefix),
      });

      const byNumber = new Map<string, SelectSection[]>();
      rows.forEach((entry) => {
        const bucket = byNumber.get(entry.number) ?? [];
        bucket.push(entry);
        byNumber.set(entry.number, bucket);
      });

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
    }),
  getSectionCodesByNumber: publicProcedure
    .input(byNumberSchema)
    .query(async ({ input, ctx }) => {
      const normalizedPrefix = normalizePrefix(input.prefix);

      if (useMockData) {
        const filtered = mockSections.filter(
          (entry) =>
            entry.prefix === normalizedPrefix && entry.number === input.number,
        );
        const byCode = new Map<string, SectionWithFiles[]>();
        filtered.forEach((entry) => {
          const bucket = byCode.get(entry.sectionCode) ?? [];
          bucket.push(entry);
          byCode.set(entry.sectionCode, bucket);
        });

        return Array.from(byCode.values())
          .map((entries) => {
            const latest = pickLatestSection(entries);
            return latest
              ? {
                  id: latest.id,
                  sectionCode: latest.sectionCode,
                  term: latest.term,
                  year: latest.year,
                  profFirst: latest.profFirst,
                  profLast: latest.profLast,
                  fileCount: latest.files.length,
                }
              : null;
          })
          .filter((entry): entry is SectionCodeSummary => Boolean(entry))
          .sort((a, b) => a.sectionCode.localeCompare(b.sectionCode));
      }

      const rows = await ctx.db.query.section.findMany({
        where: and(
          eq(section.prefix, normalizedPrefix),
          eq(section.number, input.number),
        ),
        with: { files: true },
      });
      const parsed = rows.map((row) => sectionWithFiles.parse(row));

      const byCode = new Map<string, SectionWithFiles[]>();
      parsed.forEach((entry) => {
        const bucket = byCode.get(entry.sectionCode) ?? [];
        bucket.push(entry);
        byCode.set(entry.sectionCode, bucket);
      });

      return Array.from(byCode.values())
        .map((entries) => {
          const latest = pickLatestSection(entries);
          return latest
            ? {
                id: latest.id,
                sectionCode: latest.sectionCode,
                term: latest.term,
                year: latest.year,
                profFirst: latest.profFirst,
                profLast: latest.profLast,
                fileCount: latest.files.length,
              }
            : null;
        })
        .filter((entry): entry is SectionCodeSummary => Boolean(entry))
        .sort((a, b) => a.sectionCode.localeCompare(b.sectionCode));
    }),
  getSectionDetail: publicProcedure
    .input(detailSchema)
    .query(async ({ input, ctx }) => {
      const normalizedPrefix = normalizePrefix(input.prefix);

      if (useMockData) {
        const matches = mockSections.filter(
          (entry) =>
            entry.prefix === normalizedPrefix &&
            entry.number === input.number &&
            entry.sectionCode === input.sectionCode,
        );
        return pickLatestSection(matches);
      }

      const rows = await ctx.db.query.section.findMany({
        where: and(
          eq(section.prefix, normalizedPrefix),
          eq(section.number, input.number),
          eq(section.sectionCode, input.sectionCode),
        ),
        with: { files: true },
      });
      const parsed = rows.map((row) => sectionWithFiles.parse(row));
      return pickLatestSection(parsed);
    }),
});
