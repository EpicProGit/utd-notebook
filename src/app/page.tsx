import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Header from '@src/components/header/Header';
import NebulaLogo from '@src/icons/NebulaLogo';
'use client';

import NavBar from '@components/NavBar';
import { useEffect, useState } from 'react';
import {
  type SearchQuery,
  decodeSearchQueryLabel,
  searchQueryLabel,
  searchQueryEqual,
  convertToProfOnly,
} from '@src/modules/SearchQuery/SearchQuery';
import fetchWithCache, {
  cacheIndexNebula,
  expireTime,
} from '@src/modules/fetchWithCache/fetchWithCache';
import { useSearchParams } from 'next/navigation';
import type { GenericFetchedData } from '@src/modules/GenericFetchedData/GenericFetchedData';

interface ComboResponse {
  message: string;
  data: SearchQuery[];
}

function getSearchTerms(searchTermInput: string | undefined) {
  if (!searchTermInput) return { courseSearchTerms: [], professorSearchTerms: [] };
  
  const searchTerms = searchTermInput.split(',').map(decodeSearchQueryLabel);
  const courseSearchTerms: SearchQuery[] = [];
  const professorSearchTerms: SearchQuery[] = [];

  for (const term of searchTerms) {
    if (term.profLast) professorSearchTerms.push(term);
    if (term.prefix) courseSearchTerms.push(term);
  }

  return { courseSearchTerms, professorSearchTerms };
}

function combosSearchResultsFetch(
  searchTerm: SearchQuery,
  controller: AbortController,
): Promise<SearchQuery[]> {
  return fetchWithCache(
    '/api/combo?input=' + searchQueryLabel(searchTerm),
    cacheIndexNebula,
    expireTime,
    {
      signal: controller.signal,
      method: 'GET',
      headers: { Accept: 'application/json' },
    },
  ).then((response: ComboResponse) => {
    if (response.message !== 'success') throw new Error(response.message);
    return [searchTerm].concat(
      response.data.map((obj: SearchQuery) => ({ ...searchTerm, ...obj })),
    );
  });
}

function fetchSearchResults(
  searchTerms: SearchQuery[],
  filterTerms: SearchQuery[],
  controller: AbortController,
) {
  return Promise.all(
    searchTerms.map((term) => 
      combosSearchResultsFetch(term, controller)),
  ).then((allResults) => {
    const results: SearchQuery[] = [];
    for (const termResults of allResults) {
      for (const result of termResults) {
        if (filterTerms.length > 0) {
          for (const filter of filterTerms) {
            if (
              (filter.profFirst === result.profFirst &&
                filter.profLast === result.profLast) ||
              (filter.prefix === result.prefix &&
                filter.number === result.number)
            ) {
              results.push(result);
            }
          }
        } else {
          results.push(result);
        }
      }
    }
    return results;
  });
}

const Home = () => {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<SearchQuery[]>([]);
  const [professors, setProfessors] = useState<SearchQuery[]>([]);
  const [results, setResults] = useState<GenericFetchedData<SearchQuery[]>>({
    state: 'loading',
  });

  useEffect(() => {
    const { courseSearchTerms, professorSearchTerms } = getSearchTerms(
      searchParams.get('searchTerms') ?? undefined,
    );
    setCourses(courseSearchTerms);
    setProfessors(professorSearchTerms);
    setResults({ state: 'loading' });

    const controller = new AbortController();

    let searchTerms: [SearchQuery[], SearchQuery[]] = [[], []];
    if (courseSearchTerms.length > 0) {
      searchTerms = [courseSearchTerms, professorSearchTerms];
    } else if (professorSearchTerms.length > 0) {
      searchTerms = [professorSearchTerms, courseSearchTerms];
    }

    if (courseSearchTerms.length > 0 || professorSearchTerms.length > 0) {
      fetchSearchResults(...searchTerms, controller)
        .then((res) => setResults({ state: 'done', data: res }))
        .catch((error) => {
          if (!(error instanceof DOMException && error.name === 'AbortError')) {
            setResults({ state: 'error' });
          }
        });
    } else {
      setResults({ state: 'error' });
    }

    return () => controller.abort();
  }, [searchParams]);

  return (
    <main className="relative">
      <div className="absolute inset-0 z-0">
        <div className="relative h-screen">
          <div className="absolute inset-0 bg-[linear-gradient(106deg,#C0C2FF_13.64%,#DDBBF3_48.08%,#FFC6C1_83.43%)]" />
          <div className="absolute inset-0 dark:bg-slightly-darken" />
        </div>
      </div>

      <div className="relative inset-0 z-20 bg-transparent">
        <Header
          transparent
          shadow
          disableSticky
          className="lg:fixed"
          itemVisibility={{ search: false }}
          color="light"
        />

        <section className="h-screen">
          <div className="flex h-full w-full flex-col items-center justify-center overflow-visible">
            <h2 className="mb-3 flex items-center gap-1 text-sm font-semibold tracking-wider text-white text-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]">
              <span className="leading-none">POWERED BY</span>
              <a
                href="https://www.utdnebula.com/"
                target="_blank"
                rel="noopener"
                className="group flex items-center gap-1"
              >
                <NebulaLogo className="h-4 w-auto fill-white drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]" />
                <span className="border-y-2 border-transparent leading-none transition group-hover:border-b-inherit group-hover:underline">
                  NEBULA LABS
                </span>
              </a>
            </h2>

            <h1 className="font-display mb-4 max-w-3xl px-5 text-center text-6xl font-extrabold text-white text-shadow-[0_0_16px_rgb(0_0_0_/_0.4)]">
              UTD NOTEBOOK
            </h1>

            <p className="mb-10 text-center text-white text-base md:text-lg text-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]">
              Share and access course notes. By students, for students.
            </p>

            <TextField
              placeholder="Search for courses or professors"
              variant="outlined"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end" key="search-icon">
                      <SearchIcon className="text-royal dark:text-cornflower-300" />
                    </InputAdornment>
                  ),
                  className: 'rounded-full bg-white dark:bg-neutral-800',
                },
              }}
              className="w-full max-w-xs md:max-w-sm lg:max-w-md"
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;