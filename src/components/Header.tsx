'use client';

import Link from 'next/link';

const Header = () => {
  return (
    <header className="w-full px-6 py-4 shadow-md bg-primary flex items-center justify-between">
      {/* Logo estilo J moderna */}
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

      {/* <nav className="hidden md:flex gap-6">
        <Link href="/about" className="text-gray-700 hover:text-primary transition">About</Link>
        <Link href="/contact" className="text-gray-700 hover:text-primary transition">Contact</Link>
      </nav> */}
    </header>
  );
};

export default Header;
