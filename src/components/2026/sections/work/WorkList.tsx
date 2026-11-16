import { getTranslations } from 'next-intl/server';
import { WORK } from '@/data/work';
import { WorkRow } from '@/components/2026/sections/work/WorkRow';

const HAIRLINE = 'color-mix(in srgb, var(--ds-on-surface) 7%, transparent)';

/** The Work page body: header block and the numbered list of everything in `WORK`. */
export default async function WorkList({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'common' });
  // WorkEntry fields are message keys; the data file is the only place that knows them.
  const tr = t as unknown as (key: string, values?: Record<string, string>) => string;

  return (
    <section className="py-20 px-8" style={{ backgroundColor: 'var(--ds-bg)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6 lg:gap-14 lg:items-end mb-12">
          <div className="space-y-2">
            <span
              className="text-xs uppercase tracking-[0.3em] font-bold block"
              style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t('work_label')}
            </span>
            <h1
              className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
              style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
            >
              {t('work_title')}{' '}
              <span style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>
                {t('work_title_accent')}
              </span>
            </h1>
          </div>
          <p
            className="text-base leading-relaxed max-w-xl"
            style={{
              color: 'var(--ds-on-surface-variant)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {t('work_lead')}
          </p>
        </div>

        <ol className="flex flex-col" style={{ boxShadow: `0 -1px 0 ${HAIRLINE}` }}>
          {WORK.map((entry, i) => {
            const title = tr(entry.title);
            return (
              <WorkRow
                key={entry.id}
                index={i}
                liveUrl={entry.liveUrl}
                loop={entry.loop}
                copy={{
                  title,
                  kind: tr(entry.kind),
                  description: tr(entry.description),
                  metric: entry.metric ? tr(entry.metric) : undefined,
                  facts: [
                    [t('projects_role'), tr(entry.role)],
                    [t('projects_period'), tr(entry.period)],
                  ],
                  liveLabel: t('work_view_live'),
                  liveAria: t('project_live_aria', { title }),
                }}
              />
            );
          })}
        </ol>
      </div>
    </section>
  );
}
