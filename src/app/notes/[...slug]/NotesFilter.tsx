'use client';

import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import FilesGrid from '@src/components/sections/FilesGrid';
import type { SectionWithFiles } from '@src/server/db/models';

export default function NoteFilter({
  sections,
}: {
  sections: SectionWithFiles[];
}) {
  const [search, setSearch] = useState('');

  const query = search.toLowerCase();

  const filteredSections = sections
    .map((s) => ({
      ...s,
      files: s.files.filter(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          `${s.profFirst} ${s.profLast}`.toLowerCase().includes(query) ||
          `${s.term} ${s.year}`.toLowerCase().includes(query) ||
          `${s.prefix} ${s.number}`.toLowerCase().includes(query) ||
          `${s.sectionCode}`.toLowerCase().includes(query),
      ),
    }))
    .filter((s) => s.files.length > 0);

  return (
    <>
      <TextField
        placeholder="Filter notes by title or professor"
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-md"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="text-slate-400" />
              </InputAdornment>
            ),
          },
        }}
      />

      {filteredSections.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">
          No notes match &quot;{search}&quot;
        </p>
      ) : (
        filteredSections.map((s) => (
          <div key={s.id} className="col-span-full">
            <h2 className="mb-3 text-lg font-semibold">
              {s.prefix} {s.number}.{s.sectionCode} — {s.term} {s.year}
              <span className="ml-2 text-sm font-normal text-slate-600 dark:text-slate-400">
                {s.profFirst} {s.profLast}
              </span>
            </h2>
            <FilesGrid files={s.files} />
          </div>
        ))
      )}
    </>
  );
}
