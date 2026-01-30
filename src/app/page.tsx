import Header from '@components/header/Header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://notebook.utdnebula.com',
  },
};

const Home = () => {
  return (
    <>
      <Header transparent />
    </>
  );
};

export default Home;
