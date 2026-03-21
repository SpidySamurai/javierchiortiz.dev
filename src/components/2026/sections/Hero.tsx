'use client';

import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('common');

  return (
    <section
      className="relative px-8 md:px-16 pt-24 pb-40 overflow-hidden"
      style={{ backgroundColor: '#0b1326' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute -top-40 -right-20 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'rgba(128,131,255,0.06)',
          filter: 'blur(120px)',
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-start gap-12 max-w-7xl mx-auto">
        {/* Left: text block */}
        <div className="w-full md:w-3/5 space-y-8">
          <h1
            className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-tight"
            style={{ color: '#dae2fd', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            Crafting
            <br />
            <span style={{ color: '#c0c1ff', fontStyle: 'italic' }}>Digital</span> Artifacts
          </h1>

          <p
            className="text-xl leading-relaxed max-w-xl"
            style={{ color: '#c7c4d7', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {t('hero_description')}
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <a
              href="#projects"
              className="px-6 py-3 rounded-lg text-sm font-bold transition-opacity hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #c0c1ff, #8083ff)',
                color: '#1000a9',
                fontFamily: 'var(--font-manrope), sans-serif',
              }}
            >
              View Projects
            </a>
            <a
              href="#experience"
              className="px-6 py-3 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: '#c7c4d7',
                border: '1px solid rgba(70,69,84,0.6)',
              }}
            >
              Experience
            </a>
          </div>
        </div>

        {/* Right: overlapping image cards */}
        <div className="w-full md:w-2/5 flex justify-end relative" style={{ minHeight: '320px' }}>
          {/* Large card */}
          <div
            className="w-64 h-80 rounded-xl overflow-hidden shadow-2xl p-2 flex-shrink-0"
            style={{
              backgroundColor: '#131b2e',
              transform: 'rotate(3deg)',
            }}
          >
            <div
              className="w-full h-full rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#222a3d' }}
            >
              <span
                className="text-xs uppercase tracking-widest"
                style={{ color: '#908fa0', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                Pending
              </span>
            </div>
          </div>

          {/* Small overlapping card */}
          <div
            className="absolute -bottom-12 -left-12 w-48 h-48 rounded-xl overflow-hidden shadow-2xl p-2"
            style={{
              backgroundColor: '#171f33',
              transform: 'rotate(-6deg)',
            }}
          >
            <div
              className="w-full h-full rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#222a3d' }}
            >
              <span
                className="text-xs uppercase tracking-widest"
                style={{ color: '#908fa0', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                Pending
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial ticker */}
      <div
        className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none"
        style={{ opacity: 0.05 }}
        aria-hidden
      >
        <span
          className="text-[12rem] font-black uppercase whitespace-nowrap block"
          style={{
            WebkitTextStroke: '1px rgba(192,193,255,0.2)',
            color: 'transparent',
            transform: 'translateY(50%)',
            fontFamily: 'var(--font-manrope), sans-serif',
            lineHeight: 1,
          }}
        >
          Curator • Developer • Designer • Curator • Developer
        </span>
      </div>
    </section>
  );
}
