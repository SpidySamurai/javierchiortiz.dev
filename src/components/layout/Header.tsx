'use client';

import Link from 'next/link';
import Navbar from './Navbar';

const Header = () => {
  return (
  <header className="sticky top-0 z-40 w-full px-4 py-2 shadow-md bg-primary/95 flex items-center">
      {/* Left: logo */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="48"
            height="48"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M17 3v10a4 4 0 0 1-8 0" />
          </svg>
        </Link>
      </div>

      {/* Middle spacer */}
      <div className="flex-1" />

      {/* Right: navbar */}
      <div className="flex items-center justify-end">
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
