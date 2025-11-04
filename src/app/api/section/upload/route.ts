import { NextResponse } from 'next/server';
import { db } from '@src/server/db';
import { file } from '@src/server/db/schema/file';
import { and, eq } from 'drizzle-orm';
import { getServerAuthSession } from '@src/server/auth';
import fs from 'fs';
import path from 'path';

const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];

const jsonResponse = (message: string, data: any, status = 200) =>
  NextResponse.json({ message, data }, { status });

export async function POST(req: Request) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();

  // File metadata
  const newFile = formData.get('file') as File;
  const fileTitle = formData.get('title') as string;

  // Section metadata
  const prefix = formData.get('prefix') as string;
  const courseNumber = formData.get('courseNumber') as string;
  const sectionCode = formData.get('sectionCode') as string;
  const professor = formData.get('professor') as string;
  const term = formData.get('term') as string;
  const year = Number(formData.get('year'));

  // Check for missing fields
  if (
    !newFile ||
    !fileTitle ||
    !prefix ||
    !courseNumber ||
    !sectionCode ||
    !professor ||
    !term ||
    !year
  ) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 },
    );
  }

  if (newFile.size === 0) {
    return NextResponse.json(
      { error: 'File is empty' },
      { status: 400 },
    );
  }

  if (!allowedTypes.includes(newFile.type)) {
    return NextResponse.json(
      { error: 'Unsupported file type' },
      { status: 400 },
    );
  }

  // Find section
  const sectionData = await db.query.section.findFirst({
    where: (sec) =>
      and(
        eq(sec.prefix, prefix),
        eq(sec.number, courseNumber),
        eq(sec.sectionCode, sectionCode),
        eq(sec.professor, professor),
        eq(sec.term, term),
        eq(sec.year, year),
      ),
  });

  if (!sectionData) {
    return NextResponse.json(
      { error: 'Section not found' },
      { status: 404 },
    );
  }

  try {
    // Local file upload
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.promises.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, newFile.name);

    const buffer = Buffer.from(await newFile.arrayBuffer());
    await fs.promises.writeFile(filePath, buffer);

    // File metadata
    const fileMetadata = {
      authorId: session.user.id,
      sectionId: sectionData.id,
      file_name: newFile.name,
      file_title: fileTitle,
      file_path: `/uploads/${newFile.name}`,
      mime_type: newFile.type,
      uploaded_at: new Date(),
    };

    const result = await db.insert(file).values(fileMetadata).returning();

    return NextResponse.json(
      { message: 'File uploaded successfully', data: result },
      { status: 201 },
    );
  } catch (err) {
    console.error('File upload error:', err);
    return NextResponse.json(
      { error: 'File upload failed' },
      { status: 500 },
    );
  }
}
