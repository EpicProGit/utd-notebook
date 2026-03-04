// autosuggest-highlight.d.ts
declare module 'autosuggest-highlight/match' {
  function match(text: string, query: string): [number, number][];
  export = match;
}

declare module 'autosuggest-highlight/parse' {
  function parse(
    text: string,
    matches: [number, number][],
  ): { text: string; highlight: boolean }[];
  export = parse;
}