'use client';

import React, { useEffect, useState } from 'react';
import ThemeToggle from '../ui/ThemeToggle';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useGamerCard } from '@/components/providers/GamerCardContext';

const SECTIONS = [
  { id: 'about', labelKey: 'about' },
  { id: 'experience', labelKey: 'experience' },
  { id: 'projects', labelKey: 'projects' },
];

function Navbar() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { isUnlocked, openCard } = useGamerCard();

  const languages = ['en', 'es'];
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as 'en' | 'es' });
    setShowDropdown(false);
  };

  // Cerrar el dropdown al hacer click fuera
  useEffect(() => {
    if (!showDropdown) return;
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);
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

    const io = new IntersectionObserver(callback, {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    });

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
              className={`text-sm transition px-2 py-1 rounded ${
                active === s.id
                  ? 'text-default bg-secondary/30 font-semibold'
                  : 'text-muted hover:text-default hover:bg-surface/10'
              }`}
              aria-current={active === s.id ? 'true' : undefined}
            >
              {t(s.labelKey)}
            </a>
          </li>
        ))}
      </ul>
      {/* Theme toggle + language selector (desktop) */}
      <div className="hidden lg:flex items-center gap-2 ml-6">
        {isUnlocked && (
          <button
            onClick={openCard}
            className="p-2 rounded-md hover:bg-surface/10 transition-transform hover:scale-110"
            title="Open Gamer Card"
            aria-label="Open Gamer Card"
          >
            <span className="text-xl">🕷️</span>
          </button>
        )}
        <ThemeToggle />
        <div className="relative" ref={dropdownRef}>
          <button
            aria-label={t('language_label')}
            className="px-2 py-1 rounded text-sm text-muted hover:text-default hover:bg-surface/10"
            onClick={() => setShowDropdown((v) => !v)}
          >
            {locale.toUpperCase()} ▼
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-24 bg-surface border border-gray-300 rounded shadow-lg z-50">
              {languages.map((lng) => (
                <button
                  key={lng}
                  className={`w-full px-2 py-1 text-left text-sm ${
                    locale === lng
                      ? 'bg-secondary/30 font-semibold'
                      : 'text-muted hover:text-default hover:bg-surface/10'
                  }`}
                  onClick={() => handleLanguageChange(lng)}
                >
                  {lng === 'es' ? t('language_spanish') : t('language_english')}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile hamburger */}
      <div className="lg:hidden">
        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-md text-default focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {open ? (
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

        {/* Backdrop (no heavy blur) */}
        <div
          className={`fixed inset-0 bg-surface/80 transition-opacity duration-200 ${
            open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
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
            <div className="text-default font-semibold">{t('menu')}</div>
            <button
              ref={closeButtonRef}
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="p-2 rounded-md text-default focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Toggle de tema con label y separación visual */}
          <div className="flex items-center justify-between mb-6 mt-2 px-2">
            <span className="text-muted text-sm">{t('theme')}</span>
            <div className="flex items-center gap-3">
              {isUnlocked && (
                <button
                  onClick={openCard}
                  className="p-1.5 rounded-md hover:bg-surface/10 transition-colors border border-transparent hover:border-surface/20"
                  title="Open Gamer Card"
                >
                  <span className="text-lg">🕷️</span>
                </button>
              )}
              <ThemeToggle />
            </div>
          </div>
          <hr className="mb-4 border-gray-300" />

          <nav>
            <ul className="flex flex-col gap-3">
              {SECTIONS.map((s, idx) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={handleLinkClick}
                    className={`block text-sm px-2 py-2 rounded ${
                      active === s.id
                        ? 'text-default bg-secondary/30 font-semibold'
                        : 'text-muted hover:text-default hover:bg-surface/10'
                    }`}
                    style={{ transitionDelay: `${idx * 35}ms` }}
                  >
                    {t(s.labelKey)}
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

export default Navbar;
