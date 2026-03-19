'use client';

import { Autocomplete, Button, TextField, Tooltip } from '@mui/material';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState, type Key } from 'react';
import {
  searchQueryLabel,
  type SearchQuery,
} from '@src/modules/SearchQuery/SearchQuery';

/**
 * api response type for autocomplete endpoint
 */
interface AutocompleteResponse {
  state: string;
  data: SearchQuery[];
}
/**
 * Props type used by the SearchBar component
 */
interface SearchProps {
  className?: string;
  input_className?: string;
  autoFocus?: boolean;
}

/**
 * This component returns a custom search bar component that makes use of the Material UI autocomplete component
 * Sends a new search value to the parent component when the user selects it from the options list
 *
 * Styled for the splash page
 */
const SearchBar = ({ className, input_className, autoFocus }: SearchProps) => {
  //what you can choose from
  const [options, setOptions] = useState<SearchQuery[]>([]);
  //initial loading prop for first load
  const [loading, setLoading] = useState(false);
  const [openErrorTooltip, setErrorTooltip] = React.useState(false);

  //text in search
  const [inputValue, _setInputValue] = useState('');
  //quick input updates for fetch (state is slow)
  const quickInputValue = useRef('');
  function setInputValue(newValue: string) {
    quickInputValue.current = newValue;
    _setInputValue(newValue);
  }
  //chosen value (single, was previously an array for multi-select)
  const [value, setValue] = useState<SearchQuery | null>(null);

  //set value from query
  const router = useRouter();
  // updateValue -> onSelect_internal -> updateQueries - clicking enter on an autocomplete suggestion in TopMenu Searchbar
  // updateValue -> onSelect_internal -> onSelect (custom function) - clicking enter on an autocomplete suggestion in home page SearchBar
  // params.inputProps.onKeyDown -> handleKeyDown -> onSelect_internal -> updateQueries/onSelect - clicking enter in the SearchBar
  // Button onClick -> onSelect_internal -> updateQueries/onSelect - Pressing the "Search" Button

  //change all values
  function updateValue(newValue: SearchQuery | null) {
    setValue(newValue);
    onSelect_internal(newValue); // clicking enter to select a autocomplete suggestion triggers a new search (it also 'Enters' for the searchbar)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && inputValue === '') {
      event.preventDefault();
      event.stopPropagation();
      onSelect_internal(value);
    }
  }

  //update parent and queries
  function onSelect_internal(newValue: SearchQuery | null) {
    setErrorTooltip(!newValue);
    if (newValue) {
      void updateQueries(newValue);
    }
  }

  function updateQueries(term: SearchQuery) {
    // Navigate to notes page based on search term
    if (term.prefix && term.number) {
      router.push(`/notes/${term.prefix.toLowerCase()}/${term.number}`);
    } else if (term.profFirst && term.profLast) {
      router.push(
        `/notes//${term.profFirst.toLowerCase()}/${term.profLast.toLowerCase()}`,
      );
    }
  }

  //fetch new options, add tags if valid
  function loadNewOptions(newInputValue: string) {
    setLoading(true);
    if (newInputValue.trim() === '') {
      setOptions([]);
      setLoading(false);
      return;
    }
    fetch(
      '/api/autocomplete?input=' +
        encodeURIComponent(newInputValue) +
        '&searchBy=both',
      {
        method: 'GET',
      },
    )
      .then((response) => response.json() as Promise<AutocompleteResponse>)
      .then((data) => {
        if (data.state !== 'done') {
          console.error('Autocomplete API error:', data.state, data);
          throw new Error(data.state);
        }
        if (quickInputValue.current === newInputValue) {
          //still valid options
          setOptions(data.data);
        }
      })
      .catch((error) => {
        // ignore aborts
        if (!(error instanceof DOMException)) {
          console.error('Autocomplete', error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    void fetch('/api/autocomplete?input=someSearchTerm');
  }, []);

  return (
    <div className={'flex items-center gap-2 ' + (className ?? '')}>
      <Autocomplete
        freeSolo
        loading={loading}
        //highlight first option to add with enter
        autoHighlight={true}
        clearOnBlur={false}
        className="grow"
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          }
          return searchQueryLabel(option);
        }}
        options={options}
        //don't filter options, done in fetch
        filterOptions={(options) => options}
        value={value}
        onChange={(
          event: React.SyntheticEvent,
          newValue: string | SearchQuery | null,
        ) => {
          //should never happen
          if (typeof newValue === 'string' || newValue === null) {
            return;
          }
          updateValue(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
          loadNewOptions(newInputValue);
        }}
        renderInput={(params) => {
          params.inputProps.onKeyDown = handleKeyDown;
          return (
            <TextField
              {...params}
              variant="outlined"
              className={input_className}
              placeholder="ex. GOVT 2306"
              autoFocus={autoFocus}
            />
          );
        }}
        renderOption={(props: { key: Key }, option, { inputValue }) => {
          const text =
            typeof option === 'string' ? option : searchQueryLabel(option);
          //add spaces between prefix and course number
          const matches = match(
            text,
            inputValue
              .replace(/([a-zA-Z]{2,4})([0-9][0-9V]?[0-9]{0,2})/, '$1 $2')
              .replace(/([0-9][0-9V][0-9]{2})([a-zA-Z]{1,4})/, '$1 $2'),
          );

          const parts = parse(text, matches);
          const { key, ...otherProps } = props;
          return (
            <li key={key} {...otherProps}>
              {parts.map((part, index) => (
                <span
                  key={index}
                  className={
                    'whitespace-pre-wrap' + (part.highlight ? ' font-bold' : '')
                  }
                >
                  {part.text}
                </span>
              ))}
            </li>
          );
        }}
      />
      <Tooltip
        title="Select a course or professor before searching"
        placement="top"
        open={openErrorTooltip}
        onOpen={() => setErrorTooltip(true)}
        onClose={() => setErrorTooltip(false)}
        disableFocusListener
        disableHoverListener
        disableTouchListener
      >
        <Button
          variant="contained"
          disableElevation
          size="large"
          className={
            'h-11 w-[5.5rem] shrink-0 normal-case' +
            (value === null
              ? ' text-cornflower-200 dark:text-cornflower-700'
              : '')
          } //darkens the text when no valid search terms are entered (pseudo-disables the search button)
          onClick={() => onSelect_internal(value)}
        >
          Search
        </Button>
      </Tooltip>
    </div>
  );
};

export default SearchBar;
