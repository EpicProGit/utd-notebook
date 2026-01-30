import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://notebook.utdnebula.com",
  },
};

export default function Home() {
  return (
    <main className="relative min-h-screen w-full">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(106deg,#C0C2FF_13.64%,#DDBBF3_48.08%,#FFC6C1_83.43%)]" />

      {/* Optional: Add decorative elements like the reference has */}
      {/* You could add star doodles or other SVG decorations here if desired */}

      {/* Top-right actions */}
      <div className="absolute top-[33px] right-[33px] flex gap-3 z-10">
        {/* If you don't have login/signup pages yet, you can change these to buttons */}
        <Link
          href="/login"
          className="rounded-[15px] bg-[#7C60BF] px-8 py-3.5 text-white font-bold text-base flex items-center justify-center min-w-[106px]"
        >
          Log In
        </Link>

        <Link
          href="/signup"
          className="rounded-[15px] border-[3px] border-[#7C60BF] px-6 py-3 text-[#7C60BF] font-bold text-base bg-white flex items-center justify-center whitespace-nowrap"
        >
          Sign Up For Free
        </Link>
      </div>

      {/* Center content */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="flex flex-col items-center text-center">
          
          {/* Title */}
          <h1 className="text-[80px] font-extrabold text-white mb-6 leading-none tracking-tight">
            UTD NOTEBOOK
          </h1>

          {/* Subtitle */}
          <p className="mb-12 text-white text-[20px] font-medium max-w-2xl">
            Share and access course notes. By students, for students.
          </p>

          {/* Search bar */}
          <div className="flex w-full max-w-[600px] items-center gap-3 rounded-[15px] border-[4px] border-[#7C60BF] bg-white px-5 py-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 31 31" 
              fill="none"
              className="flex-shrink-0"
            >
              <path d="M30.0411 26.3794L22.6976 20.1349C21.9381 19.4509 21.1262 19.139 20.4713 19.1681C22.4203 16.8829 23.4091 13.9321 23.2306 10.9341C23.0522 7.93603 21.7202 5.12341 19.5139 3.08555C17.3076 1.04769 14.3981 -0.0572359 11.3952 0.00228574C8.39225 0.0618074 5.52888 1.28116 3.40506 3.40485C1.28124 5.52853 0.0618112 8.39173 0.00228588 11.3945C-0.0572395 14.3972 1.04776 17.3065 3.08574 19.5127C5.12373 21.7189 7.93653 23.0507 10.9348 23.2292C13.933 23.4077 16.8839 22.4189 19.1693 20.4701C19.1383 21.1249 19.4522 21.9367 20.1361 22.6962L26.381 30.0393C27.4506 31.2269 29.1963 31.3277 30.262 30.2621C31.3277 29.1965 31.2269 27.4489 30.0392 26.3813L30.0411 26.3794ZM11.6262 19.3734C9.57067 19.3734 7.59933 18.5569 6.14585 17.1036C4.69237 15.6502 3.87581 13.6789 3.87581 11.6235C3.87581 9.56814 4.69237 7.59692 6.14585 6.14353C7.59933 4.69014 9.57067 3.87363 11.6262 3.87363C13.6817 3.87363 15.6531 4.69014 17.1066 6.14353C18.56 7.59692 19.3766 9.56814 19.3766 11.6235C19.3766 13.6789 18.56 15.6502 17.1066 17.1036C15.6531 18.5569 13.6817 19.3734 11.6262 19.3734Z" fill="#AC99DB"/>
            </svg>

            <input
              disabled
              placeholder="Search for a course, e.g., CS 1200"
              className="w-full bg-transparent outline-none text-[#7C60BF] placeholder-[#9B8AB8] font-medium text-base"
            />
          </div>
        </div>
      </section>

      {/* Bottom-left footer */}
      <div className="absolute bottom-[31px] left-[31px] z-10 text-white font-bold tracking-widest text-base">
        POWERED BY NEBULA LABS
      </div>
    </main>
  );
}git commit -m "feat(homepage): polish layout and footer"git commit -m "feat(homepage): polish layout and footer"