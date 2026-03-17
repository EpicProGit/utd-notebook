import { NextResponse } from 'next/server';
import autocompleteGraph from 'src/data/autocomplete_graph.json';
import type { GenericFetchedData } from 'src/types/GenericFetchedData';
import { type SearchQuery } from 'src/types/SearchQuery';
import {
  getGraph,
  searchAutocomplete,
} from '@src/modules/autocomplete/autocomplete';

const graph = getGraph(autocompleteGraph as object);

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get('input');
  if (typeof input !== 'string') {
    return NextResponse.json(
      { message: 'error', data: 'Incorrect query parameters' },
      { status: 400 },
    );
  }

  let searchBy: 'any' | 'professor' | 'course' = 'any';
  const searchByParam = searchParams.get('searchBy');
  if (searchByParam === 'professor' || searchByParam === 'course') {
    searchBy = searchByParam;
  }

  let limit = 20;
  const limitParam = searchParams.get('limit');
  if (typeof limitParam === 'string' && !isNaN(Number(limitParam))) {
    limit = Number(limitParam);
  }

  const results = searchAutocomplete(graph, input, limit, searchBy);

  return NextResponse.json(
    {
      message: 'success',
      data: results,
    } satisfies GenericFetchedData<SearchQuery[]>,
    { status: 200 },
  );
}
