import EmptyStateCard from '../_components/EmptyStateCard';
import LinkCard from '../_components/LinkCard';
import SectionHeader from '../_components/SectionHeader';
import { getSectionNumbersByPrefix } from '../_data/sections';

type PrefixPageProps = {
  params: Promise<{ prefix: string }>;
};

export default async function PrefixPage({ params }: PrefixPageProps) {
  const { prefix } = await params;
  const normalizedPrefix = prefix.toUpperCase();
  const numbers = await getSectionNumbersByPrefix(normalizedPrefix);

  return (
    <>
      <SectionHeader
        eyebrow="Prefix"
        title={normalizedPrefix}
        description="Choose a course number to explore available sections."
        metaLabel={`${numbers.length} courses${
          numbers.length === 1 ? '' : 's'
        }`}
        breadcrumbs={[
          { label: 'Sections' },
          { label: normalizedPrefix },
        ]}
      />

      {numbers.length === 0 ? (
        <EmptyStateCard
          title="No sections found"
          description="We could not find any sections under this prefix yet."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {numbers.map((item) => (
            <LinkCard
              key={item.number}
              href={`/sections/${normalizedPrefix}/${item.number}`}
              title={`${normalizedPrefix} ${item.number}`}
              subtitle={`Latest: ${item.latestTerm} ${item.latestYear}`}
              meta={`${item.sectionCount} section${
                item.sectionCount === 1 ? '' : 's'
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}
