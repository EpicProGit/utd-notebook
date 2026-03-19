'use client';

import { Autocomplete, Button, TextField, Tooltip } from '@mui/material';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState, type Key } from 'react';
import {
  searchQueryEqual,
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
  //chosen value (single)
  const [value, setValue] = useState<SearchQuery | null>(null);

  //set value from query
  const router = useRouter();

  //change value
  function updateValue(newValue: SearchQuery | null) {
    setValue(newValue);
    onSelect_internal(newValue);
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
    if (term.prefix && term.number) {
      router.push(`/notes/${term.prefix.toLowerCase()}/${term.number}`);
    } else if (term.profFirst && term.profLast) {
      router.push(
        `/notes/${term.profFirst.toLowerCase()}/${term.profLast.toLowerCase()}`,
      );
    }
  }

  //fetch new options
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
        //remove currently chosen value
        const filtered = data.data.filter(
          (item: SearchQuery) => !(value && searchQueryEqual(value, item)),
        );
        //auto-select if only one option and space typed
        const noSections = filtered.filter(
          (el: SearchQuery) => !('sectionNumber' in el),
        );
        if (
          (filtered.length === 1 || noSections.length === 1) &&
          quickInputValue.current.charAt(newInputValue.length) === ' '
        ) {
          const selected =
            filtered.length === 1 ? filtered[0]! : noSections[0]!;
          setValue(selected);
          const rest = quickInputValue.current
            .slice(newInputValue.length)
            .trimStart();
          setInputValue(rest);
          loadNewOptions(rest.trimEnd());
        } else if (quickInputValue.current === newInputValue) {
          setOptions(filtered);
        }
      })
      .catch((error) => {
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
        filterOptions={(options) => options}
        value={value}
        onChange={(
          event: React.SyntheticEvent,
          newValue: string | SearchQuery | null,
        ) => {
          if (typeof newValue === 'string' || newValue === null) {
            return;
          }
          //remove from options
          setOptions((old) =>
            old.filter((item) => !searchQueryEqual(newValue, item)),
          );
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
        onInput={(event) => {
          const inputVal = (event.target as HTMLInputElement).value;
          if (
            inputVal[inputVal.length - 1] === ' ' &&
            (event.nativeEvent as InputEvent).inputType === 'insertText'
          ) {
            const noSections = options.filter(
              (el: SearchQuery) => !('sectionNumber' in el),
            );
            if (
              inputVal.length > 0 &&
              (options.length === 1 || noSections.length === 1)
            ) {
              event.preventDefault();
              event.stopPropagation();
              setValue(options.length === 1 ? options[0]! : noSections[0]!);
              setOptions([]);
              (event.target as HTMLInputElement).value = '';
            }
          }
        }}
        renderOption={(props: { key: Key }, option, { inputValue }) => {
          const text =
            typeof option === 'string' ? option : searchQueryLabel(option);
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
          }
          onClick={() => onSelect_internal(value)}
        >
          Search
        </Button>
      </Tooltip>
    </div>
  );
};

export default SearchBar;
