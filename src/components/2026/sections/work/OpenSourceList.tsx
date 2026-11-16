import { getTranslations } from 'next-intl/server';
import { GITHUB_USER, OPEN_SOURCE } from '@/data/work';

const FONT_BODY = 'var(--font-inter), sans-serif';
const FONT_HEAD = 'var(--font-manrope), sans-serif';
const HAIRLINE = 'color-mix(in srgb, var(--ds-on-surface) 7%, transparent)';

/** Open source section of the Work page: header on the left, hairline list of repositories on the right. */
export default async function OpenSourceList({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'common' });
  // Item copy is addressed by the data file's ids, which the typed message keys cannot express.
  const tr = t as unknown as (key: string) => string;

  return (
    <section className="pb-24 px-8" style={{ backgroundColor: 'var(--ds-bg)' }}>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.6fr] gap-10 lg:gap-14">
        <div className="space-y-4 lg:self-start">
          <div className="space-y-2">
            <span
              className="text-xs uppercase tracking-[0.3em] font-bold block"
              style={{ color: 'var(--ds-primary)', fontFamily: FONT_BODY }}
            >
              {t('work_oss_label')}
            </span>
            <h2
              className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
              style={{ color: 'var(--ds-on-surface)', fontFamily: FONT_HEAD }}
            >
              {t('work_oss_title')}{' '}
              <span style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>
                {t('work_oss_title_accent')}
              </span>
            </h2>
          </div>
          <p
            className="text-base leading-relaxed max-w-md"
            style={{ color: 'var(--ds-on-surface-variant)', fontFamily: FONT_BODY }}
          >
            {t('work_oss_lead')}
          </p>
        </div>

        <ul className="flex flex-col min-w-0" style={{ boxShadow: `0 -1px 0 ${HAIRLINE}` }}>
          {OPEN_SOURCE.map(({ id, repo, language }) => {
            const name = tr(`work_oss_items.${id}.name`);
            const path = `github.com/${GITHUB_USER}/${repo}`;
            const meta = language === 'docs' ? t('work_oss_docs') : language;
            return (
              <li key={id} style={{ boxShadow: `0 1px 0 ${HAIRLINE}` }}>
                <a
                  href={`https://${path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name}, ${t('work_oss_view')}`}
                  className="group grid md:grid-cols-[minmax(0,1fr)_auto] gap-x-8 gap-y-3 items-center py-6 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:[outline-color:var(--ds-primary)]"
                >
                  <div className="min-w-0">
                    <h3
                      className="text-[19px] font-extrabold leading-tight transition-colors duration-200 group-hover:text-[color:var(--ds-primary)] group-focus-visible:text-[color:var(--ds-primary)]"
                      style={{ color: 'var(--ds-on-surface)', fontFamily: FONT_HEAD }}
                    >
                      {name}
                    </h3>
                    <p
                      className="mt-2 text-[14.5px] leading-[1.55] max-w-2xl"
                      style={{ color: 'var(--ds-on-surface-variant)', fontFamily: FONT_BODY }}
                    >
                      {tr(`work_oss_items.${id}.description`)}
                    </p>
                    <p
                      className="mt-2 text-xs break-all"
                      style={{ color: 'var(--ds-outline)', fontFamily: FONT_BODY }}
                    >
                      {meta} · {path}
                    </p>
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.06em]"
                    style={{ color: 'var(--ds-primary)', fontFamily: FONT_HEAD }}
                  >
                    {t('work_oss_view')}
                    <span
                      translate="no"
                      aria-hidden
                      className="material-symbols-outlined text-base inline-block transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                    >
                      arrow_outward
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
