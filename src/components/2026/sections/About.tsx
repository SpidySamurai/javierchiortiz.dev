import { useTranslations } from 'next-intl';

export default function About() {
  const t = useTranslations('common');

  return (
    <section
      id="about"
      className="w-full max-w-screen-xl mx-auto px-6 py-20"
      style={{ scrollMarginTop: '4.5rem' }}
    >
      {/* Section label */}
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--ds-font-body)', letterSpacing: '0.1em' }}
      >
        {t('about')}
      </p>

      <h2
        className="text-3xl lg:text-4xl font-bold mb-12"
        style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--ds-font-display)', letterSpacing: '-0.02em' }}
      >
        About me
      </h2>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="flex flex-col gap-5">
          {(['about_paragraph_1', 'about_paragraph_2'] as const).map((key) => (
            <p
              key={key}
              className="text-base leading-relaxed"
              style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--ds-font-body)', lineHeight: '1.6' }}
            >
              {t(key)}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-5">
          {(['about_paragraph_3', 'about_paragraph_4'] as const).map((key) => (
            <p
              key={key}
              className="text-base leading-relaxed"
              style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--ds-font-body)', lineHeight: '1.6' }}
            >
              {t(key)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
