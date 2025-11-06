import type { Metadata } from 'next';
import NavBar from '@components/NavBar';
import UploadNotes from '@components/uploadnotes';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://notebook.utdnebula.com',
  },
};

const Home = () => {
  return (
    <>
      <NavBar />
      <UploadNotes />
    </>
  );
};

export default Home;
