import Header from '@src/components/header/Header';
import type { ReactNode } from 'react';

type SectionsLayoutProps = {
  children: ReactNode;
};

export default function SectionsLayout({ children }: SectionsLayoutProps) {
  return (
    <main className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <div className="relative min-h-screen">
          <div className="absolute inset-0 bg-[linear-gradient(106deg,#C0C2FF_13.64%,#DDBBF3_48.08%,#FFC6C1_83.43%)]" />
          <div className="absolute inset-0 dark:bg-slightly-darken" />
        </div>
      </div>

      <div className="relative z-20">
        <Header
          transparent
          shadow
          disableSticky
          className="lg:fixed"
          itemVisibility={{ search: false }}
          color="light"
        />

        <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 pb-16 pt-24 lg:pt-28">
          {children}
        </section>
      </div>
    </main>
  );
}
