import 'server-only';
import { api } from '@src/trpc/server';
import {
  type SectionCodeSummary,
  type SectionNumberSummary,
} from '@src/utils/sectionCore';

export type { SectionCodeSummary, SectionNumberSummary };
export * from '@src/utils/sectionCore';

export async function getSectionNumbersByPrefix(prefix: string) {
  return api.section.getSectionNumbersByPrefix({ prefix });
}

export async function getSectionCodesByNumber(prefix: string, number: string) {
  return api.section.getSectionCodesByNumber({ prefix, number });
}

export async function getSectionDetail(
  prefix: string,
  number: string,
  sectionCode: string,
) {
  return api.section.getSectionDetail({ prefix, number, sectionCode });
}
