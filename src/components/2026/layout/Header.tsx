'use client';

import { useEffect, useState } from 'react';
import ThemeToggle from '@/components/2026/ui/ThemeToggle';
import LanguageSwitcher from '@/components/2026/ui/LanguageSwitcher';

const DESKTOP_NAV = [
  { href: '#projects', label: 'Projects' },
  { href: '#stack', label: 'Stack' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 w-full lg:left-64 lg:w-[calc(100%-16rem)] flex justify-between items-center px-8 py-4 z-50"
      style={{
        backgroundColor: 'rgba(11, 19, 38, 0.6)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)',
      }}
    >
      {/* Logo */}
      <div
        className="text-xl font-bold tracking-tighter"
        style={{ color: '#e0e7ff', fontFamily: 'var(--font-manrope), sans-serif' }}
      >
        {/* Javier Chi Ortíz */}
      </div>

      {/* Desktop controls — right */}
      <div className="hidden md:flex items-center gap-3">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      {/* Mobile hamburger */}
      <div className="md:hidden flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
        <button
          className="p-2 rounded"
          style={{ color: '#dae2fd' }}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            {mobileOpen ? (
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          aria-hidden
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(11,19,38,0.8)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed top-0 right-0 h-full w-64 p-6 z-50 flex flex-col gap-6 transition-transform duration-300 md:hidden"
        style={{
          backgroundColor: '#060e20',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <button
          className="self-end p-1.5 rounded"
          style={{ color: '#c7c4d7' }}
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 18L18 6M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <nav className="flex flex-col gap-1">
          {DESKTOP_NAV.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200"
              style={{
                color: '#64748b',
                backgroundColor: 'transparent',
                fontFamily: 'var(--font-manrope), sans-serif',
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t" style={{ borderColor: 'rgba(70,69,84,0.4)' }}>
          <a
            href="/cv-javier-chi.pdf"
            download
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-bold uppercase tracking-widest text-xs transition-opacity hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #c0c1ff, #8083ff)',
              color: '#1000a9',
              fontFamily: 'var(--font-manrope), sans-serif',
            }}
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Download CV
          </a>
        </div>
      </aside>
    </header>
  );
}
