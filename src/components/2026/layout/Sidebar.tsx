'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
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
  const { isUnlocked, openCard } = useGamerCard();
  const isBlogActive = pathname.startsWith(`/${locale}/blog`);
  const isHome = !isBlogActive;
  const sectionHref = (id: string) => isHome ? `#${id}` : `/${locale}#${id}`;

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
    <aside
      className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 z-40 pt-24 p-6"
      style={{ backgroundColor: 'var(--ds-surface)' }}
    >
      {/* Profile + Nav grouped and centered vertically */}
      <div className="flex-1 flex flex-col justify-center gap-8">
        {/* Profile */}
        <div className="px-2">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-lg font-bold block hover:text-[#c0c1ff] transition-colors cursor-pointer"
            style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            Javier Chi Ortíz
          </a>
          <p
            className="uppercase tracking-widest mt-1"
            style={{
              color: 'var(--ds-primary)',
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '10px',
            }}
          >
            {t('hero_subtitle')}
          </p>
        </div>

        {/* Nav links */}
        <nav className="space-y-2">
        {NAV_IDS.map(({ id, icon, key }) => {
          const isActive = active === id;
          return (
            <a
              key={id}
              href={sectionHref(id)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg uppercase tracking-widest text-xs transition-all duration-200"
              style={{
                transform: isActive ? 'translateX(4px)' : 'translateX(0)',
                fontFamily: 'var(--font-manrope), sans-serif',
                fontWeight: 700,
                color: isActive ? 'var(--ds-primary)' : 'var(--ds-outline)',
                backgroundColor: isActive ? 'color-mix(in srgb, var(--ds-primary) 10%, transparent)' : 'transparent',
              }}
            >
              <span className="material-symbols-outlined text-[20px]">{icon}</span>
              {t(key)}
            </a>
          );
        })}
        <Link
          href={`/${locale}/blog`}
          className="flex items-center gap-3 px-4 py-3 rounded-lg uppercase tracking-widest text-xs transition-all duration-200"
          style={{
            transform: isBlogActive ? 'translateX(4px)' : 'translateX(0)',
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
      </div>

      {/* Bottom section */}
      <div className="mt-auto space-y-4">
        {/* GamerCard unlock button */}
        {isUnlocked && (
          <button
            onClick={openCard}
            aria-label="Open Gamer Card"
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{ color: 'var(--ds-on-surface-variant)', backgroundColor: 'color-mix(in srgb, var(--ds-primary) 5%, transparent)' }}
          >
            <span className="material-symbols-outlined text-[18px]">sports_esports</span>
            {t('gamer_card')}
          </button>
        )}

        {/* Social links */}
        <div className="flex flex-col gap-2 pt-4 px-1">
          <a
            href="https://github.com/SpidySamurai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color: 'var(--ds-outline)' }}
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/javier-fernando-chi-ortiz/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color: 'var(--ds-outline)' }}
          >
            <span className="material-symbols-outlined text-[16px]">account_circle</span>
            LinkedIn
          </a>
        </div>
      </div>
    </aside>
  );
}
