'use client';

import { useEffect, useState } from 'react';
import ThemeToggle from '@/components/2026/ui/ThemeToggle';
import LanguageSwitcher from '@/components/2026/ui/LanguageSwitcher';

const NAV_LINKS = [
  { href: '#projects', label: 'Projects' },
  { href: '#stack', label: 'Stack' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

const SECTION_IDS = ['projects', 'stack', 'about', 'contact'];

export default function Header() {
  const [active, setActive] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header
      className="fixed top-0 w-full flex justify-between items-center px-8 py-4 z-50"
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
        Javier Chi Ortíz
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map(({ href, label }) => {
          const id = href.replace('#', '');
          const isActive = active === id;
          return (
            <a
              key={href}
              href={href}
              className="text-sm transition-colors pb-0.5"
              style={{
                color: isActive ? '#c7d2fe' : '#94a3b8',
                borderBottom: isActive ? '2px solid #818cf8' : '2px solid transparent',
                fontFamily: 'var(--font-manrope), sans-serif',
                letterSpacing: '-0.025em',
                fontWeight: 700,
              }}
            >
              {label}
            </a>
          );
        })}
      </nav>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded"
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

        <nav className="flex flex-col gap-4">
          {NAV_LINKS.map(({ href, label }) => {
            const id = href.replace('#', '');
            const isActive = active === id;
            return (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium py-2 transition-colors"
                style={{ color: isActive ? '#c0c1ff' : '#c7c4d7' }}
              >
                {label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 pt-2 border-t" style={{ borderColor: 'rgba(70,69,84,0.4)' }}>
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </aside>
    </header>
  );
}
