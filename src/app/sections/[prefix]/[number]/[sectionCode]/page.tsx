import EmptyStateCard from '@src/components/sections/EmptyStateCard';
import FilesGrid from '@src/components/sections/FilesGrid';
import SectionHeader from '@src/components/sections/SectionHeader';
import { getSectionDetail } from '@src/utils/section';

type SectionCodePageProps = {
  params: Promise<{ prefix: string; number: string; sectionCode: string }>;
};

export default async function SectionCodePage({
  params,
}: SectionCodePageProps) {
  const { prefix, number, sectionCode } = await params;
  const normalizedPrefix = prefix.toUpperCase();
  const section = await getSectionDetail(normalizedPrefix, number, sectionCode);

  if (!section) {
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
        title={`${section.prefix} ${section.number}.${section.sectionCode}`}
        detailBreadcrumbs={[
          `${section.term} ${section.year}`,
          `${section.profFirst} ${section.profLast}`,
        ]}
        metaLabel={`${section.files.length} file${
          section.files.length === 1 ? '' : 's'
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
      <FilesGrid files={section.files} />
    </>
  );
}
