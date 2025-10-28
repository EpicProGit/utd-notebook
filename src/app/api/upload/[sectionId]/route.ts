import { NextResponse } from 'next/server';
import { db } from '@src/server/db/index';
import { file } from '@src/server/db/schema/file';
import { section } from '@src/server/db/schema/section';
import { eq } from 'drizzle-orm';
import { getServerAuthSession } from '@src/server/auth';

import fs from 'fs';
import path from 'path';

const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];

export async function POST(
  req: Request,
  { params }: { params: { sectionId: string }}
) {
  const session = await getServerAuthSession();

  if(!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Local file upload
  const formData = await req.formData();
  const newFile = formData.get('file') as File;

  const { sectionId } = await params;

  let sectionName = await db.query.section.findFirst({
    where: (sec) => eq(sec.id, sectionId)
  })

  if(!sectionName) {
    return NextResponse.json(
      { message: 'error', data: 'Section does not exist'},
      { status: 400 }
    )
  }
  
  if(!newFile || newFile.size === 0) {
    return NextResponse.json(
      { message: 'error', data: 'No file attached' },
      { status: 400 }
    );
  }

  if(!allowedTypes.includes(newFile.type)) {
    return NextResponse.json(
      { message: 'error', data: 'Must be png, jpeg, or pdf'},
      { status: 400 }
    )
  }

  const buffer = Buffer.from(await newFile.arrayBuffer());
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  if(!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, newFile.name);
  await fs.promises.writeFile(filePath, buffer);

  const fileMetadata = {
    id: "test_file_2",
    authorId: session.user.id,
    sectionId: sectionId,
    file_name: newFile.name
  }

  try {
    const result = await db.insert(file).values(fileMetadata).returning();
  } catch (err) {
    console.log(err);
  }
  

  return NextResponse.json(
    { message: 'success', data: `File ${newFile.name} uploaded successfully` },
    { status: 200 }
  )
}
