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
    <>
      <NavBar />
      {/* Render your results here — notes from Neon, not grades */}
    </>
  );
};

export default Home;