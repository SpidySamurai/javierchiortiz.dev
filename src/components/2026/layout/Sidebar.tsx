'use client';

import { useEffect, useState } from 'react';
import { useGamerCard } from '@/components/providers/GamerCardContext';
import FlatCat from '@/components/FlatCat';

const NAV_ITEMS = [
  { id: 'projects', icon: 'grid_view', label: 'Projects' },
  { id: 'experience', icon: 'work', label: 'Experience' },
  { id: 'insights', icon: 'terminal', label: 'Insights' },
  { id: 'contact', icon: 'mail', label: 'Contact' },
];

const SECTION_IDS = ['projects', 'experience', 'insights', 'contact'];

export default function Sidebar() {
  const [active, setActive] = useState<string>('');
  const { isUnlocked, openCard, unlockCard } = useGamerCard();

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
          <h1
            className="text-lg font-bold"
            style={{ color: '#ffffff', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            Javier Chi Ortíz
          </h1>
          <p
            className="uppercase tracking-widest mt-1"
            style={{
              color: '#8ce638ff',
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '10px',
            }}
          >
            Full Stack Developer
          </p>
        </div>

        {/* Nav links */}
        <nav className="space-y-2">
        {NAV_ITEMS.map(({ id, icon, label }) => {
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
              {label}
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
            Gamer Card
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
          Download CV
        </a>

        {/* Social links + FlatCat */}
        <div className="flex items-center gap-3 pt-4 px-1">
          <FlatCat onUnlock={unlockCard} />
          <div className="flex flex-col gap-2">
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
      </div>
    </aside>
  );
}
