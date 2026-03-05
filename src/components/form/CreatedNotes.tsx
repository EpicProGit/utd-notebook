'use client';

import Panel from '@src/components/common/Panel';
import FileCard from '@src/components/sections/FileCard';
import type { SelectFile } from '@src/server/db/models';

type CreatedNotesProps = {
  createdNotes: SelectFile[];
};

export default function CreatedNotes({ createdNotes }: CreatedNotesProps) {
  return (
    <Panel heading="Created Notes">
      {createdNotes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {createdNotes.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      ) : (
        <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-md font-medium text-slate-600 dark:text-slate-400">
        You haven&apos;t created any notes yet.
        </div>
      )}
    </Panel>
  );
}