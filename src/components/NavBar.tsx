import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@mui/material';

export default function NavBar() {
  return (
    <>
      <div className="relative flex flex-wrap items-center gap-x-2 gap-y-0 overflow-hidden border-b-1 px-4 py-1 sm:flex-nowrap md:gap-x-4 md:px-8 md:py-4 lg:gap-x-8 lg:px-16">
        <Image
          src={"/background.png"}
          alt="backgroundd"
          className="-z-10"
          fill
        />
        <Link
          href="/"
          className="font-display flex items-center gap-2 text-lg font-medium md:text-xl md:font-bold"
        >
          UTD Notebook
        </Link>
        <div className="ml-auto flex gap-x-2 md:gap-x-4">
          <Button href="/dashboard" className="shrink-0 text-white normal-case">
            Dashboard
          </Button>
          <Button href="/courses" className="shrink-0 text-white normal-case">
            Courses
          </Button>
          <Button href="/notes" className="shrink-0 text-white normal-case">
            Notes
          </Button>
          <Button href="/resources" className="shrink-0 text-white normal-case">
            Resources
          </Button>
          <Button href="/profile" className="shrink-0 text-white normal-case">
            Profile
          </Button>
        </div>
      </div>
    </>
  );
}
