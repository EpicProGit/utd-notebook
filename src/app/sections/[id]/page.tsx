import { db } from '@src/server/db/client';
import { section } from '@src/server/db/schema';
import { eq } from 'drizzle-orm';
import { sectionWithFiles } from '@src/server/db/models';
import SectionHeader from "./_components/SectionHeader";
import FilesGrid from "./_components/FilesGrid";

export default async function SectionPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await db.query.section.findFirst({
    where: eq(section.id, id),
    with: { files: true },
  });

  if (!data) {
    return <div className="p-6">Section not found.</div>;
  }

  const s = sectionWithFiles.parse(data);

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <SectionHeader title={s.id} fileCount={s.files.length} />
      <FilesGrid files={s.files} />
    </main>
  );
}
