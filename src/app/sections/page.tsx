import SectionHeader from './_components/SectionHeader';

export default function SectionsIndexPage() {
  return (
    <SectionHeader
      eyebrow="Sections"
      title="Browse Sections"
      description="Enter a prefix to view notes, for example: /sections/CE"
      breadcrumbs={[{ label: 'Sections' }]}
    />
  );
}
