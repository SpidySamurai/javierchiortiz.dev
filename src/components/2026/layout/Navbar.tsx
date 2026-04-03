'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LanguageSwitcher from '@/components/2026/ui/LanguageSwitcher';
import { useGamerCard } from '@/components/providers/GamerCardContext';

const NAV_SECTIONS = [
  { id: 'projects', labelKey: 'projects' },
  { id: 'experience', labelKey: 'experience' },
  { id: 'about', labelKey: 'about' },
] as const;

export default function Navbar() {
  const t = useTranslations('common');
  const { isUnlocked, openCard } = useGamerCard();

  const [active, setActive] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Active section via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Lock scroll when mobile drawer is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeRef.current?.focus(), 50);
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <nav className="flex items-center gap-6">
      {/* Desktop nav links */}
      <ul className="hidden lg:flex items-center gap-1">
        {NAV_SECTIONS.map(({ id, labelKey }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="px-3 py-1.5 rounded text-sm transition-colors"
              style={{
                color: active === id ? 'var(--ds-primary)' : 'var(--ds-on-surface-variant)',
                fontWeight: active === id ? 600 : 400,
                background: active === id
                  ? 'color-mix(in srgb, var(--ds-primary) 10%, transparent)'
                  : 'transparent',
              }}
              aria-current={active === id ? 'page' : undefined}
            >
              {t(labelKey)}
            </a>
          </li>
        ))}
      </ul>

      {/* Desktop controls */}
      <div className="hidden lg:flex items-center gap-3">
        {isUnlocked && (
          <button
            onClick={openCard}
            aria-label="Open Gamer Card"
            className="p-1.5 rounded transition-transform hover:scale-110"
          >
            🕷️
          </button>
        )}
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      {/* Mobile hamburger */}
      <div className="lg:hidden">
        <button
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="p-2 rounded"
          style={{ color: 'var(--ds-on-surface)' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            {mobileOpen ? (
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>

        {/* Backdrop */}
        <div
          aria-hidden
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 transition-opacity duration-200"
          style={{
            background: 'color-mix(in srgb, var(--ds-bg) 80%, transparent)',
            opacity: mobileOpen ? 1 : 0,
            pointerEvents: mobileOpen ? 'auto' : 'none',
            zIndex: 40,
          }}
        />

        {/* Drawer */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed top-0 right-0 h-full w-64 p-5 shadow-2xl transition-transform duration-300 ease-in-out"
          style={{
            background: 'var(--ds-surface-container)',
            transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
            zIndex: 50,
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-semibold" style={{ color: 'var(--ds-on-surface)' }}>
              {t('menu')}
            </span>
            <button
              ref={closeRef}
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="p-1.5 rounded"
              style={{ color: 'var(--ds-on-surface-variant)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between mb-6 px-1">
            <span className="text-sm" style={{ color: 'var(--ds-on-surface-variant)' }}>{t('theme')}</span>
            <div className="flex items-center gap-2">
              {isUnlocked && (
                <button onClick={openCard} aria-label="Open Gamer Card" className="p-1 rounded">
                  🕷️
                </button>
              )}
              <ThemeToggle />
            </div>
          </div>

          <div className="mb-4">
            <LanguageSwitcher />
          </div>

          <ul className="flex flex-col gap-1">
            {NAV_SECTIONS.map(({ id, labelKey }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded text-sm transition-colors"
                  style={{
                    color: active === id ? 'var(--ds-primary)' : 'var(--ds-on-surface-variant)',
                    fontWeight: active === id ? 600 : 400,
                    background: active === id
                      ? 'color-mix(in srgb, var(--ds-primary) 10%, transparent)'
                      : 'transparent',
                  }}
                >
                  {t(labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </nav>
  );
}
