'use client';

import React, { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
];

export default function Navbar() {
  const [active, setActive] = useState<string>('about');
  const [open, setOpen] = useState(false);
  const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return;
  }, [open]);

  // Close on ESC and manage initial focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    if (open) {
      document.addEventListener('keydown', onKey);
      // focus the close button shortly after opening
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    }

    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    };

    const io = new IntersectionObserver(callback, { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 });

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <nav className="w-full flex items-center justify-center lg:justify-start py-2">
      {/* Desktop links */}
      <ul className="hidden lg:flex gap-4">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`text-sm transition px-2 py-1 rounded ${active === s.id ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'}`}
              aria-current={active === s.id ? 'true' : undefined}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile hamburger */}
      <div className="lg:hidden">
        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-300"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {open ? (
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>

        {/* Backdrop (no heavy blur) */}
        <div
          className={`fixed inset-0 bg-black/40 transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setOpen(false)}
          aria-hidden
        />

        {/* Drawer */}
        <aside
          className={`fixed top-0 right-0 h-full w-64 bg-primary shadow-2xl p-4 transform transition-transform duration-300 ease-in-out z-60 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-white font-semibold">Menu</div>
            <button
              ref={closeButtonRef}
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="p-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-300"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <nav>
            <ul className="flex flex-col gap-3">
              {SECTIONS.map((s, idx) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={handleLinkClick}
                    className={`block text-sm px-2 py-2 rounded ${
                      active === s.id ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white'
                    }`}
                    style={{ transitionDelay: `${idx * 35}ms` }}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </nav>
  );
}
