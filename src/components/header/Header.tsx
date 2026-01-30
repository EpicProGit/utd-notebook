'use server';

import Sidebar from '@src/components/nav/Sidebar';
import { BaseHeader, BaseHeaderProps } from './BaseHeader';

const DefaultHeaderItems = () => <></>;

const Header = async (props: BaseHeaderProps) => {
  return (
    <BaseHeader
      menu={<Sidebar homepage={props.shadow} hamburgerColor={props.color} />}
      {...props}
    >
      {props.children}
      <DefaultHeaderItems />
    </BaseHeader>
  );
};

export default Header;
