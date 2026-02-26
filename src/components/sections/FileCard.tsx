'use client';

import { useThumbnails, type FileData } from '@mkholt/pdf-thumbnail';
import { Skeleton } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { BaseCard } from '@src/components/common/BaseCard';
import type { SelectFile } from '@src/server/db/models';

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

  /*
    !isLoading does not mean thumbData is not null.
    Even with no errors and isLoading, takes a few rerenders to populate thumbData.
    On mount, isLoading is false and thumbData is null. 
    So we want to wait for the first fetch to trigger (indicated by isLoading turning true)
    before showing "Unable to preview".
    useThumbnails.error has always been null in testing,
    so we won't rely on that for error handling.
  */
  const { thumbnails, isLoading, error } = useThumbnails(files);
  const thumbData = thumbnails[0]?.thumbData;

  return (
    <BaseCard variant="interactive" className="h-full">
      <Link
        href={file.publicUrl}
        target="_blank"
        rel="noreferrer"
        className="flex h-full flex-col gap-3 p-4"
      >
        <div className="overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 bg-slate-50 shadow-sm">
          {thumbData ? (
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={thumbData}
                alt={`${file.name} preview`}
                fill
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (!isLoading && !thumbData && thumbnails.length > 0) || error ? (
            <div className="flex aspect-[3/4] w-full items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-400">
              Unable to preview
            </div>
          ) : (
            <div className="relative aspect-[3/4] w-full">
              <Skeleton variant="rounded" className="h-full w-full" />
            </div>
          )}
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className="line-clamp-1 text-lg font-semibold" // line-clamp-2 looks slightly too full, might want to restructure the card.
              title={file.name}
            >
              {file.name}
            </h3>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Uploaded by {file.authorId}
            </p>
          </div>
        </div>

        {file.description && (
          <p className="line-clamp-2 text-sm text-slate-800 dark:text-slate-200">
            {file.description}
          </p>
        )}

        <div className="mt-auto text-xs text-slate-600 dark:text-slate-400">
          Updated {formatUpdatedAt(file.updatedAt)}
        </div>
      </Link>
    </BaseCard>
  );
}
