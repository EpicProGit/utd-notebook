import EmptyStateCard from '@src/components/sections/EmptyStateCard';
import LinkCard from '@src/components/sections/LinkCard';
import SectionHeader from '@src/components/sections/SectionHeader';
import { api } from '@src/trpc/server';

type SectionCodePageProps = {
  params: Promise<{ prefix: string; number: string; sectionCode: string }>;
};

export default async function SectionCodePage({
  params,
}: SectionCodePageProps) {
  const { prefix, number, sectionCode } = await params;
  const normalizedPrefix = prefix.toUpperCase();
  const sections = await api.section.getSectionsByCode({
    prefix: normalizedPrefix,
    number,
    sectionCode,
  });

  if (sections.length === 0) {
    return (
      <EmptyStateCard
        title="Section not found"
        description="Double-check the prefix, course number, and section code."
      />
    );
  }

  return (
    <>
      <SectionHeader
        eyebrow="Section"
        title={`${normalizedPrefix} ${number}.${sectionCode}`}
        description="Choose a term and year to view files for this section code."
        metaLabel={`${sections.length} section${
          sections.length === 1 ? '' : 's'
        }`}
        breadcrumbs={[
          { label: 'Sections' },
          { label: normalizedPrefix, href: `/sections/${normalizedPrefix}` },
          {
            label: number,
            href: `/sections/${normalizedPrefix}/${number}`,
          },
          { label: sectionCode },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((item) => (
          <LinkCard
            key={item.id}
            href={`/sections/${normalizedPrefix}/${number}/${sectionCode}/${item.id}`}
            title={`${item.term} ${item.year}`}
            subtitle={`${item.profFirst} ${item.profLast}`}
            meta={`${item.fileCount} file${item.fileCount === 1 ? '' : 's'}`}
          />
        ))}
      </div>
    </>
  );
}
