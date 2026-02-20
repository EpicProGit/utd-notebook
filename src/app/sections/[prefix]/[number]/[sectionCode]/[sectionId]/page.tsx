import EmptyStateCard from '@src/components/sections/EmptyStateCard';
import FilesGrid from '@src/components/sections/FilesGrid';
import SectionHeader from '@src/components/sections/SectionHeader';
import { api } from '@src/trpc/server';

type SectionDetailPageProps = {
  params: Promise<{
    prefix: string;
    number: string;
    sectionCode: string;
    sectionId: string;
  }>;
};

export default async function SectionDetailPage({
  params,
}: SectionDetailPageProps) {
  const { prefix, number, sectionCode, sectionId } = await params;
  const normalizedPrefix = prefix.toUpperCase();
  const section = await api.section.getSectionById({ id: sectionId });

  if (
    !section ||
    section.prefix !== normalizedPrefix ||
    section.number !== number ||
    section.sectionCode !== sectionCode
  ) {
    return (
      <EmptyStateCard
        title="Section not found"
        description="Double-check the prefix, course number, section code, and section id."
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
          { label: number, href: `/sections/${normalizedPrefix}/${number}` },
          {
            label: sectionCode,
            href: `/sections/${normalizedPrefix}/${number}/${sectionCode}`,
          },
          { label: `${section.term} ${section.year}` },
        ]}
      />
      <FilesGrid files={section.files} />
    </>
  );
}
