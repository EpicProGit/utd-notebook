import { BaseCard } from '@src/components/common/BaseCard';
import Breadcrumbs, { type BreadcrumbItem } from './Breadcrumbs';

type SectionHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  details?: string[];
  metaLabel?: string;
  breadcrumbs?: BreadcrumbItem[];
};

export default function SectionHeader({
  title,
  eyebrow,
  description,
  details,
  metaLabel,
  breadcrumbs = [],
}: SectionHeaderProps) {
  const detailItems = (details ?? []).filter(Boolean);

  return (
    <div className="flex flex-row justify-between items-center gap-4">
      <div className="flex flex-col gap-2 text-white text-shadow-[0_0_8px_rgb(0_0_0_/_0.35)]">
        {breadcrumbs.length > 0 ? (
          <Breadcrumbs items={breadcrumbs} />
        ) : (
          <span className="text-xs font-semibold tracking-[0.25em] uppercase">
            {eyebrow}
          </span>
        )}

        <h1 className="font-display text-4xl font-extrabold md:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-sm text-slate-800 dark:text-slate-200 md:text-base">
            {description}
          </p>
        )}
        {detailItems.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm md:text-base">
            {detailItems.map((item, index) => (
              <span key={`${item}-${index}`} className="flex items-center">
                {item}
                {index < detailItems.length - 1 && (
                  <span className="ml-3 text-white/60">/</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      {metaLabel && (
        <BaseCard className="w-fit bg-white/85 dark:bg-neutral-900/85 backdrop-blur px-4 py-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="h-2 w-2 rounded-full bg-royal dark:bg-cornflower-300" />
            <span>{metaLabel}</span>
          </div>
        </BaseCard>
      )}
    </div>
  );
}
