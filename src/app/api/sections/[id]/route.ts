// NOTE: API route that isn't required for the section page, however, useful for fetching section data if needed

import { NextResponse } from 'next/server';
import { db } from '@src/server/db/client';
import { section } from '@src/server/db/schema/section';
import { eq } from 'drizzle-orm';
import { sectionWithFiles } from '@src/server/db/models';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const data = await db.query.section.findFirst({
    where: eq(section.id, params.id),
    with: { files: true },
  });

  const payload = data ? sectionWithFiles.parse(data) : null;
  return NextResponse.json(payload);
}
