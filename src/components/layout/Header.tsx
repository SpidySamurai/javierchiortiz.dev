'use client';

import Link from 'next/link';
import Navbar from './Navbar';

const Header = () => {
  return (
  <header className="sticky top-0 z-40 w-full px-4 py-2 shadow-md bg-primary">
      <div className="w-full max-w-screen-xl mx-auto flex items-center justify-between">
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
              className="text-default"
            >
              <path d="M17 3v10a4 4 0 0 1-8 0" />
            </svg>
          </Link>
        </div>

        {/* Right: navbar */}
        <div className="flex items-center justify-end">
          <Navbar />
        </div>
      </div>
    </header>
  );
};

export default Header;
