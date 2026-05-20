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
import { NAV_ITEMS } from '@/config/navigation';
import LastVisitorChip from '@/components/2026/ui/LastVisitorChip';

function MobileDrawer({
  open,
  onClose,
  onCloseDrawerOnly,
  t,
  locale,
  isBlogActive,
  isVisitorsActive,
  isExperienceActive,
  sectionHref,
  isUnlocked,
  openCard,
  closeRef,
}: {
  open: boolean;
  onClose: () => void;
  onCloseDrawerOnly: () => void;
  t: ReturnType<typeof useTranslations>;
  locale: string;
  isBlogActive: boolean;
  isVisitorsActive: boolean;
  isExperienceActive: boolean;
  sectionHref: (id: string) => string;
  isUnlocked: boolean;
  openCard: (anchorY?: number) => void;
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

        {/* Last visitor chip — only on small screens; md+ shows it in the header */}
        <div className="md:hidden px-2 mb-4">
          <LastVisitorChip />
        </div>

        {/* Nav links */}
        <nav className="space-y-2 flex-1">
          {NAV_ITEMS.map(({ id, icon, key }) => (
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
              <span translate="no" className="material-symbols-outlined text-[20px]">{icon}</span>
              {t(key)}
            </a>
          ))}
          <Link
            href={`/${locale}/experience`}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-lg uppercase tracking-widest text-xs transition-all duration-200"
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontWeight: 700,
              color: isExperienceActive ? 'var(--ds-primary)' : 'var(--ds-outline)',
              backgroundColor: isExperienceActive ? 'color-mix(in srgb, var(--ds-primary) 10%, transparent)' : 'transparent',
            }}
          >
            <span translate="no" className="material-symbols-outlined text-[20px]">work</span>
            {t('experience')}
          </Link>
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
            <span translate="no" className="material-symbols-outlined text-[20px]">edit_note</span>
            Blog
          </Link>
          <Link
            href={`/${locale}/visitors`}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-lg uppercase tracking-widest text-xs transition-all duration-200"
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontWeight: 700,
              color: isVisitorsActive ? 'var(--ds-primary)' : 'var(--ds-outline)',
              backgroundColor: isVisitorsActive ? 'color-mix(in srgb, var(--ds-primary) 10%, transparent)' : 'transparent',
            }}
          >
            <span translate="no" className="material-symbols-outlined text-[20px]">public</span>
            {t('visitors_nav')}
          </Link>
        </nav>

        {/* Bottom — social + gamer card */}
        <div className="mt-auto space-y-4">
          {isUnlocked && (
            <button
              onClick={(e) => {
                const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                const isMobile = window.innerWidth < 768;
                openCard(isMobile ? undefined : rect.top);
                // Mobile: close only the drawer — NOT the card (closeDrawer would cancel openCard)
                if (isMobile) onCloseDrawerOnly();
              }}
              aria-label="Open Gamer Card"
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{ color: 'var(--ds-on-surface-variant)', backgroundColor: 'color-mix(in srgb, var(--ds-primary) 5%, transparent)' }}
            >
              <span translate="no" className="material-symbols-outlined text-[18px]">sports_esports</span>
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
  const { isUnlocked, openCard, closeCard } = useGamerCard();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isBlogActive = pathname.startsWith(`/${locale}/blog`);
  const isVisitorsActive = pathname.startsWith(`/${locale}/visitors`);
  const isExperienceActive = pathname.startsWith(`/${locale}/experience`);
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const sectionHref = (id: string) => (isHome ? `#${id}` : `/${locale}#${id}`);

  // Closes drawer + card (nav links, backdrop, close button)
  const closeDrawer = () => { setMobileOpen(false); closeCard(); };
  // Closes only the drawer — card stays open (used when opening card from drawer on mobile)
  const closeDrawerOnly = () => setMobileOpen(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer(); };
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
        className="header-adaptive fixed top-0 left-0 w-full flex items-center px-8 py-4 z-50"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--ds-bg) 60%, transparent)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)',
        }}
      >
        {/* Name — home link, always visible */}
        <Link
          href={`/${locale}`}
          style={{
            color: 'var(--ds-on-surface)',
            fontFamily: 'var(--font-manrope), sans-serif',
            fontWeight: 700,
            fontSize: '1rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Javier Chi Ortíz
        </Link>

        {/* Centered chip — tablet+ only; on small mobile it's inside the drawer */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
          <LastVisitorChip />
        </div>

        {/* Desktop controls */}
        <div className="hidden xl:flex items-center gap-3 ml-auto">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        {/* Mobile controls */}
        <div className="xl:hidden flex items-center gap-2 ml-auto">
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
          onClose={closeDrawer}
          onCloseDrawerOnly={closeDrawerOnly}
          t={t}
          locale={locale}
          isBlogActive={isBlogActive}
          isVisitorsActive={isVisitorsActive}
          isExperienceActive={isExperienceActive}
          sectionHref={sectionHref}
          isUnlocked={isUnlocked}
          openCard={openCard}
          closeRef={closeRef}
        />
      )}
    </>
  );
}
