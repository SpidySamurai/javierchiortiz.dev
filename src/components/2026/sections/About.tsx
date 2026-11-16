import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/2026/ui/Reveal';
import { ScrollFillText } from '@/components/2026/ui/ScrollFillText';
import AboutLinks from '@/components/2026/sections/about/AboutLinks';
import StackRows from '@/components/2026/sections/about/StackRows';

const PARAGRAPHS = ['about_paragraph_personal', 'about_paragraph_4'] as const;

export default function About() {
  const t = useTranslations('common');

  return (
    <section
      id="about"
      data-track-section="about"
      className="py-28 px-8 lg:px-20"
      style={{ backgroundColor: 'var(--ds-about-bg)', scrollMarginTop: '5rem' }}
    >
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Left: text */}
        <div className="min-w-0">
          {/* Person header: name + role, no photo */}
          <Reveal y={12} className="mb-8">
            <p
              className="text-lg font-bold leading-tight"
              style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
            >
              Javier Chi Ortíz
            </p>
            <p
              className="text-xs uppercase tracking-[0.2em] font-bold mt-0.5"
              style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t('hero_subtitle')} · {t('about_location')}
            </p>
          </Reveal>

          <Reveal y={12} className="mb-4">
            <p
              className="text-xs uppercase tracking-[0.3em] font-bold"
              style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t('about_label')}
            </p>
          </Reveal>

          <h2
            className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-10"
            style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            <ScrollFillText>
              {t('about_title')}{' '}
              <em style={{ color: 'var(--ds-primary)' }}>{t('about_title_accent')}</em>
            </ScrollFillText>
          </h2>

          <div className="flex flex-col gap-5">
            {PARAGRAPHS.map((key, i) => (
              <Reveal key={key} y={12} delay={0.1 + i * 0.1}>
                <p
                  className="text-base leading-relaxed"
                  style={{
                    color: 'var(--ds-on-surface-variant)',
                    fontFamily: 'var(--font-inter), sans-serif',
                  }}
                >
                  {t(key)}
                </p>
              </Reveal>
            ))}
          </div>

          <AboutLinks />
        </div>

        {/* Right: stack rows + quote */}
        <div className="flex flex-col gap-8 min-w-0">
          <StackRows />

          <Reveal y={12}>
            <blockquote
              className="pt-5 px-5 pb-5 rounded-xl relative"
              style={{ backgroundColor: 'color-mix(in srgb, var(--ds-primary) 6%, transparent)' }}
            >
              <span
                className="block text-3xl font-black leading-none mb-2 select-none"
                style={{
                  color: 'var(--ds-primary)',
                  opacity: 0.4,
                  fontFamily: 'var(--font-manrope), sans-serif',
                }}
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <p
                className="text-sm leading-relaxed italic mb-3"
                style={{
                  color: 'var(--ds-on-surface-variant)',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              >
                {t('about_quote')}
              </p>
              <cite
                className="text-xs not-italic tracking-widest uppercase"
                style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {t('about_quote_author')}
              </cite>
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
