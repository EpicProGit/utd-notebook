'use server';

import SearchBar from '@src/app/search/SearchBar/SearchBar';
import Sidebar from '@src/components/nav/Sidebar';
import { BaseHeader, BaseHeaderProps } from './BaseHeader';

const DefaultHeaderItems = () => <></>;

const Header = async (props: BaseHeaderProps) => {
  return (
    <BaseHeader
      menu={<Sidebar homepage={props.shadow} hamburgerColor={props.color} />}
      searchBar={<SearchBar />}
      {...props}
    >
      {props.children}
      <DefaultHeaderItems />
    </BaseHeader>
  );
};

export const NotesHeader = async (props: BaseHeaderProps) => {
  return (
    <Header
      searchBar={
        <SearchBar
          className="w-full max-w-xs md:max-w-sm lg:max-w-md"
          input_className="[&_.MuiOutlinedInput-root]:rounded-full [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:dark:bg-neutral-800"
          manageQuery="onSelect"
        />
      }
      {...props}
    />
  );
};

export default Header;
