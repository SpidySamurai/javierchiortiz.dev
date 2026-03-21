import { useTranslations } from 'next-intl';

type ExperienceKey = 'enti' | 'softtek' | 'scandia' | 'iotam' | 'brightcoders';

const EXPERIENCE_KEYS: ExperienceKey[] = ['enti', 'softtek', 'scandia', 'iotam', 'brightcoders'];

const TECH_BY_ROLE: Record<ExperienceKey, string[]> = {
  enti:        ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  softtek:     ['React', 'Node.js', 'SQL', 'REST APIs'],
  scandia:     ['Shopify', 'Liquid', 'JavaScript', 'CSS'],
  iotam:       ['React', 'TypeScript', 'REST APIs'],
  brightcoders: ['React', 'CSS', 'JavaScript'],
};

function TechChip({ label }: { label: string }) {
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{
        background: 'var(--ds-secondary-container)',
        color: 'var(--ds-on-secondary)',
        fontFamily: 'var(--ds-font-body)',
      }}
    >
      {label}
    </span>
  );
}

export default function Timeline() {
  const t = useTranslations('common');

  return (
    <section
      id="experience"
      className="w-full max-w-screen-xl mx-auto px-6 py-20"
      style={{ scrollMarginTop: '4.5rem' }}
    >
      {/* Section label */}
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--ds-font-body)', letterSpacing: '0.1em' }}
      >
        {t('experience')}
      </p>

      {/* Section title */}
      <h2
        className="text-3xl lg:text-4xl font-bold mb-14"
        style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--ds-font-display)', letterSpacing: '-0.02em' }}
      >
        Professional Timeline
      </h2>

      {/* Timeline items */}
      <div className="flex flex-col gap-0">
        {EXPERIENCE_KEYS.map((key, i) => {
          const item = t.raw(`experience_items.${key}`) as { title: string; date: string; description: string };
          const isLast = i === EXPERIENCE_KEYS.length - 1;

          return (
            <div key={key} className="flex gap-8">
              {/* Timeline spine */}
              <div className="flex flex-col items-center pt-1 flex-shrink-0">
                <div
                  className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: i === 0 ? 'var(--ds-primary)' : 'var(--ds-outline-variant)' }}
                />
                {!isLast && (
                  <div
                    className="w-px flex-1 mt-1"
                    style={{ background: 'var(--ds-outline-variant)', minHeight: '3.5rem', opacity: 0.4 }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-12 flex-1">
                <p
                  className="text-xs uppercase tracking-widest mb-1"
                  style={{ color: 'var(--ds-outline)', fontFamily: 'var(--ds-font-body)', letterSpacing: '0.08em' }}
                >
                  {item.date}
                </p>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--ds-font-display)' }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--ds-font-body)', lineHeight: '1.6' }}
                >
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {TECH_BY_ROLE[key].map((tech) => (
                    <TechChip key={tech} label={tech} />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
