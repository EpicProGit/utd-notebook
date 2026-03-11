'use server';
/*
Header for Search Results page. Differs from the default header 
this one has the search bar. - primitive solution for now
should change this later for a smarter solution.
*/
import Sidebar from '@src/components/nav/Sidebar';
import { BaseHeader, BaseHeaderProps } from './BaseHeader';
import SearchBar from '@src/app/search/SearchBar/SearchBar';

const DefaultHeaderItems = () => <></>;

const Header = async (props: BaseHeaderProps) => {
  return (
    <BaseHeader
      menu={<Sidebar homepage={props.shadow} hamburgerColor={props.color} />}
      {...props}
    >
      {props.children}
      <DefaultHeaderItems />
      <SearchBar
          className="w-full max-w-xs md:max-w-sm lg:max-w-md"
          input_className="[&_.MuiOutlinedInput-root]:rounded-full [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:dark:bg-neutral-800"
          manageQuery="onSelect"
        />
    </BaseHeader>
  );
};

export default Header;
