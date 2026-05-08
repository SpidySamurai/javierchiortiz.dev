'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useGamerCard } from '@/components/providers/GamerCardContext';

const NAV_IDS = [
  { id: 'experience', icon: 'work', key: 'experience' },
  { id: 'projects', icon: 'grid_view', key: 'projects' },
  { id: 'about', icon: 'person', key: 'about' },
] as const;

const SECTION_IDS = ['experience', 'projects', 'about'];

export default function Sidebar() {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const [active, setActive] = useState<string>('');
  const [collapsed, setCollapsed] = useState(false);
  const { isUnlocked, openCard } = useGamerCard();
  const isBlogActive = pathname.startsWith(`/${locale}/blog`);
  const isHome = !isBlogActive;
  const sectionHref = (id: string) => (isHome ? `#${id}` : `/${locale}#${id}`);

  // Sync React state with CSS state (inline script already handled visual before first paint)
  useLayoutEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed') === 'true';
    setCollapsed(saved);
    requestAnimationFrame(() => {
      document.documentElement.setAttribute('data-sidebar-ready', '');
    });
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      document.documentElement.style.setProperty('--sidebar-w', next ? '4rem' : '16rem');
      if (next) document.documentElement.setAttribute('data-sidebar-collapsed', '');
      else document.documentElement.removeAttribute('data-sidebar-collapsed');
      return next;
    });
  };

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

  return (
    <>
    <aside
      className="sidebar-aside hidden xl:flex flex-col fixed left-0 top-0 h-full z-40 pt-24 overflow-hidden"
      style={{ width: collapsed ? '4rem' : '16rem', backgroundColor: 'var(--ds-surface)' }}
      suppressHydrationWarning
    >
      {/* Profile + Nav */}
      <div className="flex-1 flex flex-col justify-center gap-8 min-w-0">
        {/* Profile */}
        <div className="px-4">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-lg font-bold block hover:text-[#c0c1ff] transition-colors cursor-pointer text-left whitespace-nowrap"
            style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
            suppressHydrationWarning
          >
            <span className="sidebar-label">Javier Chi Ortíz</span>
          </button>
          <p
            className="sidebar-label uppercase tracking-widest mt-1 text-xs whitespace-nowrap"
            style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-manrope), sans-serif' }}
            suppressHydrationWarning
          >
            {t('hero_subtitle')}
          </p>
        </div>

        {/* Nav — key changes on expand to re-trigger stagger animation */}
        <nav key={collapsed ? 'nav-c' : 'nav-e'} className="space-y-1">
          {[...NAV_IDS, { id: 'blog', icon: 'edit_note', key: 'blog' } as const].map(
            ({ id, icon, key }, index) => {
              const isActive = id === 'blog' ? isBlogActive : active === id;
              const href = id === 'blog' ? `/${locale}/blog` : sectionHref(id);
              const label = id === 'blog' ? 'Blog' : t(key as Parameters<typeof t>[0]);
              return (
                <motion.a
                  key={id}
                  href={href}
                  title={collapsed ? label : undefined}
                  aria-current={isActive ? 'true' : undefined}
                  className="sidebar-nav-item flex items-center py-3 rounded-lg uppercase tracking-widest text-xs transition-colors duration-200"
                  style={{
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    gap: collapsed ? '0' : '0.75rem',
                    padding: collapsed ? '0.75rem 0' : '0.75rem 1rem',
                    transform: isActive && !collapsed ? 'translateX(4px)' : 'translateX(0)',
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontWeight: 700,
                    color: isActive ? 'var(--ds-primary)' : 'var(--ds-outline)',
                    backgroundColor: isActive
                      ? 'color-mix(in srgb, var(--ds-primary) 10%, transparent)'
                      : 'transparent',
                  }}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 22, delay: index * 0.07 }}
                  suppressHydrationWarning
                >
                  <span className="material-symbols-outlined text-[20px] shrink-0" aria-hidden="true">
                    {icon}
                  </span>
                  <span className="sidebar-label">{label}</span>
                </motion.a>
              );
            }
          )}
        </nav>
      </div>

      {/* Bottom */}
      <div className="mt-auto p-4 space-y-3">
        {/* GamerCard — space always reserved, pop animation on first unlock */}
        <div style={{ minHeight: '42px' }}>
          <AnimatePresence initial={false}>
            {isUnlocked && (
              <motion.button
                key="gamer-btn"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                onClick={openCard}
                aria-label="Open Gamer Card"
                title={collapsed ? t('gamer_card') : undefined}
                className="flex items-center rounded-lg text-sm font-medium"
                style={{
                  width: '100%',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: collapsed ? '0' : '0.5rem',
                  padding: collapsed ? '0.5rem' : '0.625rem 0.75rem',
                  color: 'var(--ds-on-surface-variant)',
                  backgroundColor: 'color-mix(in srgb, var(--ds-primary) 5%, transparent)',
                }}
              >
                <span className="material-symbols-outlined text-[18px] shrink-0">sports_esports</span>
                <span className="sidebar-label">{t('gamer_card')}</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Social */}
        <div
          className="flex pt-2 px-1"
          style={{
            flexDirection: 'column',
            alignItems: collapsed ? 'center' : 'flex-start',
            gap: '0.5rem',
          }}
          suppressHydrationWarning
        >
          <a
            href="https://github.com/SpidySamurai"
            target="_blank"
            rel="noopener noreferrer"
            title={collapsed ? 'GitHub' : undefined}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-[color:var(--ds-on-surface-variant)]"
            style={{ color: 'var(--ds-outline)' }}
          >
            <FaGithub size={14} aria-hidden="true" />
            <span className="sidebar-label">GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/javier-fernando-chi-ortiz/"
            target="_blank"
            rel="noopener noreferrer"
            title={collapsed ? 'LinkedIn' : undefined}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-[color:var(--ds-on-surface-variant)]"
            style={{ color: 'var(--ds-outline)' }}
          >
            <FaLinkedin size={14} aria-hidden="true" />
            <span className="sidebar-label">LinkedIn</span>
          </a>
        </div>
      </div>
    </aside>

    {/* Toggle — fixed, sits on right edge of sidebar, half outside */}
    <button
      onClick={toggle}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      className="hidden xl:flex fixed top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 items-center justify-center cursor-pointer rounded-full border"
      style={{
        left: 'var(--sidebar-w, 16rem)',
        zIndex: 50,
        backgroundColor: 'var(--ds-surface)',
        borderColor: 'var(--ds-outline-variant)',
        color: 'var(--ds-outline)',
        transition: 'left 0.25s ease',
      }}
    >
      <span
        className="sidebar-toggle-icon material-symbols-outlined text-[14px] leading-none"
        style={{ transition: 'transform 0.25s ease' }}
      >
        chevron_left
      </span>
    </button>
    </>
  );
}
