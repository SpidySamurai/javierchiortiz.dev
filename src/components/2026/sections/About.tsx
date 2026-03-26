'use client';

import { useTranslations } from 'next-intl';

export default function About() {
  const t = useTranslations('common');

  return (
    <section
      id="about"
      className="py-28 px-8 lg:px-20"
      style={{ backgroundColor: '#0b1326', scrollMarginTop: '5rem' }}
    >
      {/* Section label */}
      <p
        className="text-xs uppercase tracking-[0.3em] font-bold mb-4"
        style={{ color: '#c0c1ff', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {t('about')}
      </p>

      <h2
        className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-16"
        style={{ color: '#dae2fd', fontFamily: 'var(--font-manrope), sans-serif' }}
      >
        About me
      </h2>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="flex flex-col gap-5">
          {(['about_paragraph_1', 'about_paragraph_2'] as const).map((key) => (
            <p
              key={key}
              className="text-lg leading-relaxed"
              style={{ color: '#c7c4d7', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t(key)}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-5">
          {(['about_paragraph_3', 'about_paragraph_4'] as const).map((key) => (
            <p
              key={key}
              className="text-lg leading-relaxed"
              style={{ color: '#c7c4d7', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t(key)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
