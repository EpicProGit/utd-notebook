import Header from '@src/components/header/Header';
import SearchHome from './SearchHome';

const Home = () => {
  return (
    <main className="relative">
      <div className="absolute inset-0 z-0">
        <div className="relative h-screen">
          <div className="absolute inset-0 bg-[linear-gradient(106deg,#C0C2FF_13.64%,#DDBBF3_48.08%,#FFC6C1_83.43%)]" />
          <div className="absolute inset-0 dark:bg-slightly-darken" />
        </div>
      </div>

      <div className="relative inset-0 z-20 bg-transparent">
        <Header
          transparent
          shadow
          disableSticky
          className="lg:fixed"
          itemVisibility={{ search: false }}
          color="light"
        />
        <SearchHome />
      </div>
    </main>
  );
};

export default Home;
