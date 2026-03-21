'use client';

import { useEffect, useState } from 'react';
import { useGamerCard } from '@/components/providers/GamerCardContext';

const NAV_ITEMS = [
  { id: 'projects', icon: 'grid_view', label: 'Projects' },
  { id: 'experience', icon: 'work', label: 'Experience' },
  { id: 'contact', icon: 'mail', label: 'Contact' },
];

const SECTION_IDS = ['projects', 'experience', 'contact'];

export default function Sidebar() {
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
      {/* Profile */}
      <div className="mb-10 px-2">
        <div
          className="w-12 h-12 rounded-full overflow-hidden mb-4 flex items-center justify-center"
          style={{ backgroundColor: '#222a3d' }}
        >
          <span className="material-symbols-outlined text-xl" style={{ color: '#908fa0' }}>
            account_circle
          </span>
        </div>
        <h1
          className="text-lg font-bold"
          style={{ color: '#dae2fd', fontFamily: 'var(--font-manrope), sans-serif' }}
        >
          Javier Chi Ortíz
        </h1>
        <p
          className="uppercase tracking-widest mt-1"
          style={{
            color: '#464554',
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '10px',
          }}
        >
          Full Stack Developer
        </p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ id, icon, label }) => {
          const isActive = active === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                color: isActive ? '#c0c1ff' : '#464554',
                backgroundColor: isActive ? 'rgba(192,193,255,0.1)' : 'transparent',
                transform: isActive ? 'translateX(4px)' : 'translateX(0)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#c7c4d7';
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#1a2030';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#464554';
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent';
                }
              }}
            >
              <span className="material-symbols-outlined text-[20px]">{icon}</span>
              {label}
            </a>
          );
        })}
      </nav>

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
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-opacity hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, #c0c1ff, #8083ff)',
            color: '#1000a9',
            fontFamily: 'var(--font-manrope), sans-serif',
          }}
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Download CV
        </a>

        {/* Social links */}
        <div className="flex gap-3 px-1">
          <a
            href="https://github.com/javierchiortiz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color: '#464554' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#c7c4d7')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#464554')}
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/javierchiortiz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color: '#464554' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#c7c4d7')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#464554')}
          >
            <span className="material-symbols-outlined text-[16px]">work</span>
            LinkedIn
          </a>
        </div>
      </div>
    </aside>
  );
}
