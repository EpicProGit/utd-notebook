"use client"
import { useEffect, useMemo, useState } from 'react';
import { BaseCard } from '@src/components/common/BaseCard';
import type { SelectFile } from '@src/server/db/models';
import { type FileData, useThumbnails } from '@mkholt/pdf-thumbnail';

type FileCardProps = {
  file: SelectFile;
};

const formatUpdatedAt = (updatedAt: SelectFile['updatedAt']) => {
  const date =
    updatedAt instanceof Date ? updatedAt : new Date(updatedAt ?? Date.now());
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export default function FileCard({ file }: FileCardProps) {
  const thumbnailUrl = file.publicUrl;
  const files = useMemo<FileData[]>(
    () => [{ file: thumbnailUrl, name: file.name }],
    [file.name, thumbnailUrl],
  );
  const thumbnails = useThumbnails(files) as Array<{ thumbData?: string }>;
  const thumbData = thumbnails[0]?.thumbData;
  const [showUnavailable, setShowUnavailable] = useState(false);

  useEffect(() => {
    if (thumbData) {
      setShowUnavailable(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      setShowUnavailable(true);
    }, 1500);

    return () => window.clearTimeout(timeout);
  }, [thumbData]);

  return (
    <BaseCard
      variant="interactive"
      className="group h-full border border-white/40 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-neutral-900/90"
    >
      <a
        href={file.publicUrl}
        target="_blank"
        rel="noreferrer"
        className="flex h-full flex-col gap-3 p-4"
      >
        <div
          className="overflow-hidden rounded-md border border-slate-200/70 bg-slate-50 shadow-sm dark:border-white/10 dark:bg-white/5"
        >
          {thumbData ? (
            <img
              src={thumbData}
              alt={`${file.name} preview`}
              className="aspect-[3/4] w-full object-cover"
            />
          ) : showUnavailable ? (
            <div className="flex aspect-[3/4] w-full items-center justify-center text-xs font-medium text-slate-500 dark:text-slate-400">
              Unable to preview
            </div>
          ) : (
            <div className="aspect-[3/4] w-full animate-pulse bg-slate-200/70 dark:bg-slate-800/70" />
          )}
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className="truncate text-lg font-semibold text-haiti dark:text-white"
              title={file.name}
            >
              {file.name}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Uploaded by {file.authorId}
            </p>
          </div>
        </div>

        {file.description && (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {file.description}
          </p>
        )}

        <div className="mt-auto text-xs text-slate-500 dark:text-slate-400">
          Updated {formatUpdatedAt(file.updatedAt)}
        </div>
      </a>
    </BaseCard>
  );
}
