import { db } from '@src/server/db';
import { section } from '@src/server/db/schema';
import {
  type SectionWithFiles,
  type SelectSection,
  sectionWithFiles,
} from '@src/server/db/models';
import { and, eq } from 'drizzle-orm';

const useMockData = true;

const termOrder: Record<SelectSection['term'], number> = {
  Spring: 1,
  Summer: 2,
  Fall: 3,
};

const normalizePrefix = (prefix: string) => prefix.toUpperCase();

const compareLatest = (a: SelectSection, b: SelectSection) => {
  if (a.year !== b.year) {
    return b.year - a.year;
  }
  return (termOrder[b.term] ?? 0) - (termOrder[a.term] ?? 0);
};

const pickLatestSection = <T extends SelectSection>(sections: T[]) => {
  return sections.slice().sort(compareLatest)[0] ?? null;
};

const mockSections: SectionWithFiles[] = [
  {
    id: 'mock-ce-1337-001',
    prefix: 'CE',
    number: '1337',
    sectionCode: '001',
    term: 'Fall',
    year: 2025,
    profFirst: 'Ada',
    profLast: 'Lovelace',
    files: [
      {
        id: 'mock-file-ce-01',
        authorId: 'Temoc',
        sectionId: 'mock-ce-1337-001',
        name: 'Lecture 01 - Signals',
        description: 'Intro notes on signals and systems.',
        publicUrl: 'https://www.utdallas.edu/',
        updatedAt: new Date('2025-09-10T18:12:00Z'),
      },
      {
        id: 'mock-file-ce-02',
        authorId: 'Temoc',
        sectionId: 'mock-ce-1337-001',
        name: 'Homework 1 Solutions',
        description: 'Worked solutions and extra exercises.',
        publicUrl: 'https://www.utdallas.edu/',
        updatedAt: new Date('2025-09-18T16:40:00Z'),
      },
    ],
  },
  {
    id: 'mock-ce-1337-002',
    prefix: 'CE',
    number: '1337',
    sectionCode: '002',
    term: 'Fall',
    year: 2025,
    profFirst: 'Grace',
    profLast: 'Hopper',
    files: [
      {
        id: 'mock-file-ce-03',
        authorId: 'Student-42',
        sectionId: 'mock-ce-1337-002',
        name: 'Lab 2 Checklist',
        description: 'Checklist and tips for lab submissions.',
        publicUrl: 'https://www.utdallas.edu/',
        updatedAt: new Date('2025-09-26T09:10:00Z'),
      },
    ],
  },
  {
    id: 'mock-ce-2426-001',
    prefix: 'CE',
    number: '2426',
    sectionCode: '001',
    term: 'Spring',
    year: 2025,
    profFirst: 'Alan',
    profLast: 'Turing',
    files: [],
  },
  {
    id: 'mock-ee-1200-001',
    prefix: 'EE',
    number: '1200',
    sectionCode: '001',
    term: 'Fall',
    year: 2024,
    profFirst: 'Katherine',
    profLast: 'Johnson',
    files: [
      {
        id: 'mock-file-ee-01',
        authorId: 'Temoc',
        sectionId: 'mock-ee-1200-001',
        name: 'Exam 1 Review',
        description: 'Key formulas and practice problems.',
        publicUrl: 'https://www.utdallas.edu/',
        updatedAt: new Date('2024-10-02T12:00:00Z'),
      },
    ],
  },
  {
    id: 'mock-ee-2301-001',
    prefix: 'EE',
    number: '2301',
    sectionCode: '001',
    term: 'Summer',
    year: 2025,
    profFirst: 'Nikola',
    profLast: 'Tesla',
    files: [],
  },
];

export type SectionNumberSummary = {
  number: SelectSection['number'];
  sectionCount: number;
  latestTerm: SelectSection['term'];
  latestYear: SelectSection['year'];
};

export type SectionCodeSummary = {
  id: SelectSection['id'];
  sectionCode: SelectSection['sectionCode'];
  term: SelectSection['term'];
  year: SelectSection['year'];
  profFirst: SelectSection['profFirst'];
  profLast: SelectSection['profLast'];
  fileCount: number;
};

export async function getSectionNumbersByPrefix(
  prefix: string,
): Promise<SectionNumberSummary[]> {
  const normalizedPrefix = normalizePrefix(prefix);

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

  const rows = await db.query.section.findMany({
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
}

export async function getSectionCodesByNumber(
  prefix: string,
  number: string,
): Promise<SectionCodeSummary[]> {
  const normalizedPrefix = normalizePrefix(prefix);

  if (useMockData) {
    const filtered = mockSections.filter(
      (entry) => entry.prefix === normalizedPrefix && entry.number === number,
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

  const rows = await db.query.section.findMany({
    where: and(
      eq(section.prefix, normalizedPrefix),
      eq(section.number, number),
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
}

export async function getSectionDetail(
  prefix: string,
  number: string,
  sectionCode: string,
): Promise<SectionWithFiles | null> {
  const normalizedPrefix = normalizePrefix(prefix);

  if (useMockData) {
    const matches = mockSections.filter(
      (entry) =>
        entry.prefix === normalizedPrefix &&
        entry.number === number &&
        entry.sectionCode === sectionCode,
    );
    return pickLatestSection(matches);
  }

  const rows = await db.query.section.findMany({
    where: and(
      eq(section.prefix, normalizedPrefix),
      eq(section.number, number),
      eq(section.sectionCode, sectionCode),
    ),
    with: { files: true },
  });
  const parsed = rows.map((row) => sectionWithFiles.parse(row));
  return pickLatestSection(parsed);
}
