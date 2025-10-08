import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {

  const formData = await req.formData();
  const file = formData.get('file') as File;

  if(!file || file.size === 0) {
    return NextResponse.json(
      { message: 'error', data: 'No file attached' },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  if(!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, file.name);

  await fs.promises.writeFile(filePath, buffer);

  return NextResponse.json(
    { message: 'success', data: `File ${file.name} uploaded successfully` },
    { status: 200 }
  )
}
