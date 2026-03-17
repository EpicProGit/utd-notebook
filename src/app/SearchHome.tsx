'use client';

import NebulaLogo from '@src/icons/NebulaLogo';
import SearchBar from './search/SearchBar/SearchBar';

const SearchHome = () => {
  return (
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
        <SearchBar
          className="w-full max-w-xs md:max-w-sm lg:max-w-md"
          input_className="[&_.MuiOutlinedInput-root]:rounded-full [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:dark:bg-neutral-800"
          manageQuery="onSelect"
        />
      </div>
    </section>
  );
};

export default SearchHome;
