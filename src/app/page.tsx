import { BaseHeader } from '@components/header/BaseHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://notebook.utdnebula.com',
  },
};

const Home = () => {
  return (
    <>
      <BaseHeader transparent />
    </>
  );
};

export default Home;
