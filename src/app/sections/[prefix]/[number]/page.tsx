import EmptyStateCard from '@src/components/sections/EmptyStateCard';
import LinkCard from '@src/components/sections/LinkCard';
import SectionHeader from '@src/components/sections/SectionHeader';
import { getSectionCodesByNumber } from '@src/utils/section';

type NumberPageProps = {
  params: Promise<{ prefix: string; number: string }>;
};

export default async function NumberPage({ params }: NumberPageProps) {
  const { prefix, number } = await params;
  const normalizedPrefix = prefix.toUpperCase();
  const sections = await getSectionCodesByNumber(normalizedPrefix, number);

  return (
    <>
      <SectionHeader
        eyebrow="Course"
        title={`${normalizedPrefix} ${number}`}
        description="Choose a section code to view files, professor info, and term details."
        metaLabel={`${sections.length} section${
          sections.length === 1 ? '' : 's'
        }`}
        breadcrumbs={[
          { label: 'Sections' },
          { label: normalizedPrefix, href: `/sections/${normalizedPrefix}` },
          { label: number },
        ]}
      />

      {sections.length === 0 ? (
        <EmptyStateCard
          title="No sections yet"
          description="We could not find any section codes for this course number."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((item) => (
            <LinkCard
              key={item.id}
              href={`/sections/${normalizedPrefix}/${number}/${item.sectionCode}`}
              title={`Section ${item.sectionCode}`}
              subtitle={`${item.profFirst} ${item.profLast}`}
              description={`${item.term} ${item.year}`}
              meta={`${item.fileCount} file${item.fileCount === 1 ? '' : 's'}`}
            />
          ))}
        </div>
      )}
    </>
  );
}
