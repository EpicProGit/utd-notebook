import type { Metadata } from 'next';
//gonna look in hte currentn directory
import SectionPage from './SectionPage';
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://notebook.utdnebula.com',
  },
};

const Home = () => {
  return (
    <div>
      
      <SectionPage />
    </div>
  );
};

export default Home;
