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
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-start">
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
            className="text-4xl md:text-5xl lg:text-[64px] leading-none font-extrabold tracking-[-0.03em]"
            style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            <ScrollFillText>
              {t('why_title')}{' '}
              <em style={{ color: 'var(--ds-primary)' }}>{t('why_title_accent')}</em>
              {t('why_title_end')}
            </ScrollFillText>
          </h2>
        </div>

        {/* A plain list with hairline separators, as in the approved canvas (board 13) */}
        <StaggerGroup className="flex flex-col" stagger={0.1}>
          {POINTS.map((n) => (
            <Reveal key={n} y={20}>
              <div
                className="grid grid-cols-[28px_1fr] gap-3.5 py-5"
                style={{ boxShadow: '0 1px 0 color-mix(in srgb, var(--ds-on-surface) 7%, transparent)' }}
              >
                <span
                  translate="no"
                  aria-hidden
                  className="material-symbols-outlined text-xl mt-0.5"
                  style={{ color: 'var(--ds-primary)' }}
                >
                  check
                </span>
                <div className="min-w-0">
                  <h3
                    className="text-[19px] font-bold"
                    style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
                  >
                    {t(`why_${n}_title`)}
                  </h3>
                  <p
                    className="text-sm leading-[1.55] mt-1"
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
