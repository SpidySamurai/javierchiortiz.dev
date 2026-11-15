import { useTranslations } from 'next-intl';
import { Reveal, StaggerGroup } from '@/components/2026/ui/Reveal';
import { ScrollFillText } from '@/components/2026/ui/ScrollFillText';

const POINTS = [1, 2, 3, 4] as const;

export default function WhyMe() {
  const t = useTranslations('common');

  return (
    <section
      id="why"
      data-track-section="why"
      className="py-28 px-8 lg:px-20"
      style={{ backgroundColor: 'var(--ds-bg)', scrollMarginTop: '5rem' }}
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[5fr_7fr] gap-12 lg:gap-24 items-start">
        <div className="min-w-0 lg:sticky lg:top-28">
          <Reveal y={20} className="mb-4">
            <span
              className="text-xs uppercase tracking-[0.3em] font-bold block"
              style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t('why_label')}
            </span>
          </Reveal>
          <h2
            className="text-4xl md:text-5xl font-black tracking-tighter"
            style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            <ScrollFillText>
              {t('why_title')}{' '}
              <em style={{ color: 'var(--ds-primary)' }}>{t('why_title_accent')}</em>
              {t('why_title_end')}
            </ScrollFillText>
          </h2>
        </div>

        <StaggerGroup className="flex flex-col gap-3" stagger={0.1}>
          {POINTS.map((n) => (
            <Reveal key={n} y={20}>
              <div
                className="flex gap-5 p-6 rounded-xl"
                style={{ backgroundColor: 'var(--ds-surface-container)' }}
              >
                <span
                  translate="no"
                  aria-hidden
                  className="material-symbols-outlined shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xl"
                  style={{
                    color: 'var(--ds-primary)',
                    backgroundColor: 'color-mix(in srgb, var(--ds-primary) 12%, transparent)',
                  }}
                >
                  check
                </span>
                <div className="min-w-0">
                  <h3
                    className="text-lg font-extrabold mb-1.5"
                    style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
                  >
                    {t(`why_${n}_title`)}
                  </h3>
                  <p
                    className="text-base leading-relaxed"
                    style={{
                      color: 'var(--ds-on-surface-variant)',
                      fontFamily: 'var(--font-inter), sans-serif',
                    }}
                  >
                    {t(`why_${n}_body`)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
