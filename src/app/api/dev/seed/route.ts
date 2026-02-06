// API route to seed the database with demo data made by ChatGPT for testing

import { NextResponse } from 'next/server';
import { db } from '@src/server/db';
import { section } from '@src/server/db/schema/section';
import { file } from '@src/server/db/schema/file';
import { user } from '@src/server/db/schema/user';

export const dynamic = 'force-dynamic';

export async function POST() {
  const demoUserId = 'Temoc';
  const demoSectionId = 'CS1200.001';

  try {
    await db
      .insert(user)
      .values({ id: demoUserId, name: 'Temoc', email: 'ter676767@utdallas.edu'})
      .onConflictDoNothing?.();
  } catch { }

  try {
    await db.insert(section).values({ id: demoSectionId }).onConflictDoNothing?.();
  } catch { }

  try {
    await db.insert(file).values([
      {
        id: 'Lecture 41 - Graph Theory',
        authorId: demoUserId,
        sectionId: demoSectionId,
        file_url: 'https://catalog.utdallas.edu/2017/undergraduate/courses/cs1200',
      },
    ])
    .onConflictDoNothing?.();
  } catch { }

  return NextResponse.json({
    ok: true,
    sectionId: demoSectionId,
    visit: `/sections/${demoSectionId}`,
  });
}
