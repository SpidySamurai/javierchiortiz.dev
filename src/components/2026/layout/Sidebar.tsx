'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useGamerCard } from '@/components/providers/GamerCardContext';

const NAV_IDS = [
  { id: 'experience', icon: 'work', key: 'experience' },
  { id: 'projects', icon: 'grid_view', key: 'projects' },
  { id: 'about', icon: 'person', key: 'about' },
  { id: 'stack', icon: 'terminal', key: 'stack' },
] as const;

const SECTION_IDS = ['experience', 'projects', 'about', 'stack'];

export default function Sidebar() {
  const t = useTranslations('common');
  const [active, setActive] = useState<string>('');
  const { isUnlocked, openCard } = useGamerCard();

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
      style={{ backgroundColor: '#060e20' }}
    >
      {/* Profile + Nav grouped and centered vertically */}
      <div className="flex-1 flex flex-col justify-center gap-8">
        {/* Profile */}
        <div className="px-2">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-lg font-bold block hover:text-[#c0c1ff] transition-colors cursor-pointer"
            style={{ color: '#ffffff', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            Javier Chi Ortíz
          </a>
          <p
            className="uppercase tracking-widest mt-1"
            style={{
              color: '#8ce638ff',
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
              href={`#${id}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg uppercase tracking-widest text-xs transition-all duration-200 ${
                isActive
                  ? 'text-[#a5b4fc] bg-[rgba(99,102,241,0.1)]'
                  : 'text-[#64748b] hover:text-[#cbd5e1] hover:bg-[#1a2030]'
              }`}
              style={{
                transform: isActive ? 'translateX(4px)' : 'translateX(0)',
                fontFamily: 'var(--font-manrope), sans-serif',
                fontWeight: 700,
              }}
            >
              <span className="material-symbols-outlined text-[20px]">{icon}</span>
              {t(key)}
            </a>
          );
        })}
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
            style={{ color: '#c7c4d7', backgroundColor: 'rgba(192,193,255,0.05)' }}
          >
            <span className="text-base">🕷️</span>
            {t('gamer_card')}
          </button>
        )}

        {/* Download CV button */}
        <a
          href="/cv-javier-chi.pdf"
          download
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold uppercase tracking-widest text-xs transition-opacity hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, #c0c1ff, #8083ff)',
            color: '#1000a9',
            fontFamily: 'var(--font-manrope), sans-serif',
          }}
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          {t('download_cv')}
        </a>

        {/* Social links */}
        <div className="flex flex-col gap-2 pt-4 px-1">
          <a
            href="https://github.com/javierchiortiz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium transition-colors text-[#64748b] hover:text-[#c7c4d7]"
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/javierchiortiz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium transition-colors text-[#64748b] hover:text-[#c7c4d7]"
          >
            <span className="material-symbols-outlined text-[16px]">account_circle</span>
            LinkedIn
          </a>
        </div>
      </div>
    </aside>
  );
}
