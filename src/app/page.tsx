import NavBar from '@components/NavBar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://notebook.utdnebula.com',
  },
};

const Home = () => {
  return (
    <>
      <NavBar />
    </>
  );
};

export default Home;
