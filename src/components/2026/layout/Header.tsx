'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/2026/ui/ThemeToggle';
import LanguageSwitcher from '@/components/2026/ui/LanguageSwitcher';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useGamerCard } from '@/components/providers/GamerCardContext';

const NAV_IDS = [
  { id: 'experience', icon: 'work', key: 'experience' },
  { id: 'projects', icon: 'grid_view', key: 'projects' },
  { id: 'about', icon: 'person', key: 'about' },
] as const;

function MobileDrawer({
  open,
  onClose,
  t,
  locale,
  isBlogActive,
  sectionHref,
  isUnlocked,
  openCard,
  closeRef,
}: {
  open: boolean;
  onClose: () => void;
  t: ReturnType<typeof useTranslations>;
  locale: string;
  isBlogActive: boolean;
  sectionHref: (id: string) => string;
  isUnlocked: boolean;
  openCard: () => void;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={onClose}
        className="ds-2026 fixed inset-0 transition-opacity duration-200 xl:hidden"
        style={{
          background: 'color-mix(in srgb, var(--ds-bg) 80%, transparent)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          zIndex: 9998,
        }}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="ds-2026 fixed top-0 left-0 h-full w-64 flex flex-col pt-6 p-6 transition-transform duration-300 xl:hidden"
        style={{
          backgroundColor: 'var(--ds-surface)',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          zIndex: 9999,
        }}
      >
        {/* Profile + close */}
        <div className="flex items-center justify-between mb-8">
          <div className="px-2">
            <span
              className="text-lg font-bold block"
              style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
            >
              Javier Chi Ortíz
            </span>
            <span
              className="uppercase tracking-widest text-xs"
              style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-manrope), sans-serif' }}
            >
              {t('hero_subtitle')}
            </span>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 rounded"
            style={{ color: 'var(--ds-on-surface-variant)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="space-y-2 flex-1">
          {NAV_IDS.map(({ id, icon, key }) => (
            <a
              key={id}
              href={sectionHref(id)}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg uppercase tracking-widest text-xs transition-all duration-200"
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontWeight: 700,
                color: 'var(--ds-outline)',
                backgroundColor: 'transparent',
              }}
            >
              <span className="material-symbols-outlined text-[20px]">{icon}</span>
              {t(key)}
            </a>
          ))}
          <Link
            href={`/${locale}/blog`}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-lg uppercase tracking-widest text-xs transition-all duration-200"
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontWeight: 700,
              color: isBlogActive ? 'var(--ds-primary)' : 'var(--ds-outline)',
              backgroundColor: isBlogActive ? 'color-mix(in srgb, var(--ds-primary) 10%, transparent)' : 'transparent',
            }}
          >
            <span className="material-symbols-outlined text-[20px]">edit_note</span>
            Blog
          </Link>
        </nav>

        {/* Bottom — social + gamer card */}
        <div className="mt-auto space-y-4">
          {isUnlocked && (
            <button
              onClick={() => { openCard(); onClose(); }}
              aria-label="Open Gamer Card"
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{ color: 'var(--ds-on-surface-variant)', backgroundColor: 'color-mix(in srgb, var(--ds-primary) 5%, transparent)' }}
            >
              <span className="material-symbols-outlined text-[18px]">sports_esports</span>
              {t('gamer_card')}
            </button>
          )}
          <div className="flex flex-col gap-2 pt-4 px-1">
            <a
              href="https://github.com/SpidySamurai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-[color:var(--ds-on-surface-variant)]"
              style={{ color: 'var(--ds-outline)' }}
            >
              <FaGithub size={14} aria-hidden="true" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/javier-fernando-chi-ortiz/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-[color:var(--ds-on-surface-variant)]"
              style={{ color: 'var(--ds-outline)' }}
            >
              <FaLinkedin size={14} aria-hidden="true" />
              LinkedIn
            </a>
          </div>
        </div>
      </aside>
    </>,
    document.body
  );
}

export default function Header() {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const { isUnlocked, openCard } = useGamerCard();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isBlogActive = pathname.startsWith(`/${locale}/blog`);
  const isHome = !isBlogActive;
  const sectionHref = (id: string) => (isHome ? `#${id}` : `/${locale}#${id}`);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeRef.current?.focus(), 50);
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full xl:left-64 xl:w-[calc(100%-16rem)] flex justify-between items-center px-8 py-4 z-50"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--ds-bg) 60%, transparent)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)',
        }}
      >
        <div />

        {/* Desktop controls */}
        <div className="hidden xl:flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        {/* Mobile controls */}
        <div className="xl:hidden flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <button
            className="p-2 rounded"
            style={{ color: 'var(--ds-on-surface)' }}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              {mobileOpen ? (
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {mounted && (
        <MobileDrawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          t={t}
          locale={locale}
          isBlogActive={isBlogActive}
          sectionHref={sectionHref}
          isUnlocked={isUnlocked}
          openCard={openCard}
          closeRef={closeRef}
        />
      )}
    </>
  );
}
