import type { SvgIconComponent } from '@mui/icons-material';
import GavelIcon from '@mui/icons-material/Gavel';
import HelpIcon from '@mui/icons-material/Help';
import HomeIcon from '@mui/icons-material/Home';

export const mainCats = ['Home'] as const;
export const moreCats = ['About'] as const;
export const personalCats = ['Admin'] as const;

export type allCats =
  | (typeof mainCats)[number]
  | (typeof moreCats)[number]
  | (typeof personalCats)[number];
export const IconMap: {
  [key in allCats[number]]: SvgIconComponent;
} = {
  Home: HomeIcon,
  About: HelpIcon,
  Admin: GavelIcon,
};

export const routeMap: {
  [key in allCats[number]]: string;
} = {
  Home: '/',
  About: 'https://www.utdnebula.com/projects/notebook',
  Admin: '/admin',
};
