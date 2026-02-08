import {
  type SectionWithFiles,
  type SelectSection,
} from '@src/server/db/models';

export const useMockData = true;

const termOrder: Record<SelectSection['term'], number> = {
  Spring: 1,
  Summer: 2,
  Fall: 3,
};

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

export const normalizePrefix = (prefix: string) => prefix.toUpperCase();

const compareLatest = (a: SelectSection, b: SelectSection) => {
  if (a.year !== b.year) {
    return b.year - a.year;
  }
  return (termOrder[b.term] ?? 0) - (termOrder[a.term] ?? 0);
};

export const pickLatestSection = <T extends SelectSection>(sections: T[]) =>
  sections.reduce<T | null>((latest, current) => {
    if (!latest) return current;
    return compareLatest(current, latest) < 0 ? latest : current;
  }, null);

export const mockSections: SectionWithFiles[] = [
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
        publicUrl: 'https://egrcc.github.io/docs/math/all-of-statistics.pdf',
        updatedAt: new Date('2025-09-10T18:12:00Z'),
      },
      {
        id: 'mock-file-ce-02',
        authorId: 'Temoc',
        sectionId: 'mock-ce-1337-001',
        name: 'Homework 1 Solutions',
        description: 'Worked solutions and extra exercises.',
        publicUrl:
          'https://statsthinking21.github.io/statsthinking21-core-site/StatsThinking21.pdf',
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
        publicUrl:
          'https://storage.googleapis.com/utdnebula_notebook/07DzAU_BKTQzN5NiX_nc',
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
        publicUrl:
          'https://storage.googleapis.com/utdnebula_notebook/07DzAU_BKTQzN5NiX_nc',
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
