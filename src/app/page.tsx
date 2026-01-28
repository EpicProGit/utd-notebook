import { BaseHeader } from '@components/header/BaseHeader';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://notebook.utdnebula.com',
  },
};

export default function Home() {
  return (
    <>
      {}
      <BaseHeader transparent />

      <main
        className="
          relative min-h-screen w-full
          bg-[linear-gradient(135deg,#C0C2FF_0%,#DDBBF3_50%,#FFC6C1_100%)]
          font-[var(--font-bai-jamjuree)]
        "
      >
        {/* Top-right auth buttons */}
        <div className="absolute top-[33px] right-[33px] flex gap-3">
          <Link
            href="/login"
            className="
              h-[60px] px-6 rounded-[15px]
              border-[3px] border-[#7C60BF]
              text-[#7C60BF] font-semibold text-[18px]
              flex items-center justify-center
              hover:bg-[#7C60BF] hover:text-white
              transition
            "
          >
            Log In
          </Link>

          <Link
            href="/signup"
            className="
              h-[60px] px-6 rounded-[15px]
              bg-[#7C60BF] text-white
              font-semibold text-[18px]
              flex items-center justify-center
              hover:opacity-90
              transition
            "
          >
            Sign Up For Free
          </Link>
        </div>

        {/* Center hero content */}
        <section className="flex min-h-screen flex-col items-center justify-center text-center px-6">
          <h1 className="max-w-4xl text-[48px] md:text-[64px] font-bold leading-tight text-black">
            Your notes.
            <br />
            Organized. Searchable. Shared.
          </h1>

          <p className="mt-6 max-w-xl text-[18px] md:text-[20px] text-black/70">
            Notebook helps UTD students upload, organize, and find class notes —
            all in one place.
          </p>

          <div className="mt-10 flex gap-4">
            <Link
              href="/signup"
              className="
                h-[60px] px-8 rounded-[18px]
                bg-black text-white
                text-[18px] font-semibold
                flex items-center justify-center
                hover:opacity-90 transition
              "
            >
              Get Started
            </Link>

            <Link
              href="/get-started"
              className="
                h-[60px] px-8 rounded-[18px]
                border border-black
                text-black text-[18px] font-semibold
                flex items-center justify-center
                hover:bg-black hover:text-white transition
              "
            >
              Learn More
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
