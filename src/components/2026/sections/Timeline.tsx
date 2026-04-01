'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

type ExperienceKey = 'enti' | 'softtek' | 'scandia' | 'iotam' | 'brightcoders';

interface TimelineEntry {
  key: ExperienceKey;
  tier: string;
  yearDisplay: string[];
  tech: string[];
  url: string;
}

const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    key: 'enti',
    tier: 'tier_consulting',
    yearDisplay: ['2023', 'PRESENT'],
    tech: ['Next.js', 'React', 'TypeScript', 'Node.js', 'NestJS', 'SQL'],
    url: 'https://enti.mx/',
  },
  {
    key: 'softtek',
    tier: 'tier_enterprise',
    yearDisplay: ['2022', '2024'],
    tech: ['React', 'TypeScript', 'C#', '.NET', 'SQL'],
    url: 'https://www.softtek.com/',
  },
  {
    key: 'scandia',
    tier: 'tier_ecommerce',
    yearDisplay: ['2020', '2022'],
    tech: ['Shopify', 'Liquid', 'JavaScript', 'Next.js', 'React'],
    url: 'https://www.linkedin.com/company/scandia-manufacturing/people/?viewAsMember=true',
  },
  {
    key: 'iotam',
    tier: 'tier_startup',
    yearDisplay: ['2021'],
    tech: ['React', 'TypeScript', 'SASS', 'REST APIs'],
    url: 'https://iotam.com.mx/',
  },
  {
    key: 'brightcoders',
    tier: 'tier_internship',
    yearDisplay: ['2021'],
    tech: ['Ruby', 'Ruby on Rails', 'JavaScript', 'HTML', 'CSS'],
    url: 'https://www.brightcoders.com/',
  },
];

const entryVariants = {
  hidden: (dir: number) => ({ opacity: 0, x: dir * 60 }),
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      staggerChildren: 0.08,
    },
  },
};

const yearVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const, delay: 0.15 },
  },
};

const chipVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

const MONTH_IDX: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  // Spanish
  Ene: 0, Ago: 7, Dic: 11,
};

function parseDuration(dateStr: string, yrLabel: string, moLabel: string): string {
  const [startPart, endPart] = dateStr.split(' - ');
  const parse = (s: string) => {
    const [mon, yr] = s.trim().split(' ');
    return { m: MONTH_IDX[mon] ?? 0, y: parseInt(yr) };
  };
  const start = parse(startPart);
  const now = new Date();
  const endTrimmed = endPart?.trim();
  const end =
    endTrimmed === 'Present' || endTrimmed === 'Presente'
      ? { m: now.getMonth(), y: now.getFullYear() }
      : parse(endPart);
  const total = (end.y - start.y) * 12 + (end.m - start.m) + 1;
  const yr = Math.floor(total / 12);
  const mo = total % 12;
  if (yr > 0 && mo > 0) return `${yr} ${yrLabel} ${mo} ${moLabel}`;
  if (yr > 0) return `${yr} ${yrLabel}`;
  return `${mo} ${moLabel}`;
}

function TechChip({ label }: { label: string }) {
  return (
    <motion.span
      className="px-3 py-0.5 rounded text-[9px] font-medium uppercase border"
      style={{
        color: 'rgba(199,196,215,0.7)',
        borderColor: 'rgba(70,69,84,0.3)',
        fontFamily: 'var(--font-inter), sans-serif',
      }}
      variants={chipVariants}
    >
      {label}
    </motion.span>
  );
}

function TierBadge({ label, isLead }: { label: string; isLead?: boolean }) {
  return (
    <div
      className="inline-block px-4 py-1 mb-4 rounded-full text-[10px] font-bold uppercase tracking-widest border"
      style={{
        color: isLead ? '#c0c1ff' : '#908fa0',
        backgroundColor: isLead ? 'rgba(192,193,255,0.1)' : 'rgba(144,143,160,0.08)',
        borderColor: isLead ? 'rgba(192,193,255,0.2)' : 'rgba(144,143,160,0.15)',
      }}
    >
      {label}
    </div>
  );
}


function YearDisplay({ align = 'left', date }: { align?: 'left' | 'right'; date?: string }) {
  const t = useTranslations('common');
  const duration = date ? parseDuration(date, t('duration_yr'), t('duration_mo')) : null;
  const period = date ? date.toUpperCase().replace(' - ', ' — ') : null;
  return (
    <motion.span
      className="font-black leading-none block"
      style={{ fontFamily: 'var(--font-manrope), sans-serif', textAlign: align }}
      variants={yearVariants}
    >
      {period && (
        <span
          className="block text-2xl md:text-3xl tracking-tight"
          style={{ color: 'rgba(192,193,255,0.55)' }}
        >
          {period}
        </span>
      )}
      {duration && (
        <span
          className="block mt-2"
          style={{
            color: 'rgba(192,193,255,0.35)',
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.08em',
          }}
        >
          {duration}
        </span>
      )}
    </motion.span>
  );
}

export default function Timeline() {
  const t = useTranslations('common');

  return (
    <section
      id="experience"
      className="px-8 lg:px-20 py-32 overflow-hidden"
      style={{ backgroundColor: '#131b2e', scrollMarginTop: '5rem' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-end mb-24 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="space-y-2">
            <span
              className="text-xs uppercase tracking-[0.3em] font-bold block"
              style={{ color: '#c0c1ff', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t('timeline_label')}
            </span>
            <h3
              className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
              style={{ color: '#dae2fd', fontFamily: 'var(--font-manrope), sans-serif' }}
            >
              {t('timeline_title')}{' '}<span style={{ color: '#c0c1ff', fontStyle: 'italic' }}>{t('timeline_title_accent')}</span>
            </h3>
          </div>
        </motion.div>

        {/* Timeline items */}
        <div className="relative">
          {/* Center vertical line */}
          <div
            className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px hidden md:block"
            style={{
              background:
                'linear-gradient(to bottom, #c0c1ff, rgba(128,131,255,0.15), transparent)',
              transform: 'translateX(-50%)',
            }}
          />

          <div className="space-y-32">
            {TIMELINE_ENTRIES.map((entry, i) => {
              const item = t.raw(`experience_items.${entry.key}`) as {
                title: string;
                date: string;
                description: string;
              };
              const isOdd = i % 2 === 0;
              const isLead = entry.key === 'enti';

              if (isOdd) {
                // ODD: text left, year right
                return (
                  <motion.div
                    key={entry.key}
                    className="relative grid md:grid-cols-2 gap-12 items-center"
                    custom={1}
                    variants={entryVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                  >
                    {/* Text on LEFT */}
                    <div className="md:text-right md:pr-16 order-2 md:order-1">
                      <TierBadge label={t(entry.tier as Parameters<typeof t>[0])} isLead={isLead} />
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-4xl md:text-5xl font-black leading-none mb-2 tracking-tighter block hover:text-[#c0c1ff] transition-colors"
                        style={{
                          color: '#dae2fd',
                          fontFamily: 'var(--font-manrope), sans-serif',
                        }}
                      >
                        {item.title}
                      </a>
                      <motion.div
                        className="flex flex-wrap md:justify-end gap-2 mb-6"
                        variants={{
                          hidden: {},
                          visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
                        }}
                      >
                        {entry.tech.map((tech) => (
                          <TechChip key={tech} label={tech} />
                        ))}
                      </motion.div>
                      <p
                        className="text-lg leading-relaxed"
                        style={{ color: '#c7c4d7', fontFamily: 'var(--font-inter), sans-serif' }}
                      >
                        {item.description}
                      </p>
                    </div>

                    {/* Center dot — on the row, aligned with the center line */}
                    <div
                      className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-10 hidden md:block"
                      style={{
                        backgroundColor: '#c0c1ff',
                        boxShadow: '0 0 20px rgba(192,193,255,0.6)',
                      }}
                    />

                    {/* Year on RIGHT */}
                    <div className="relative order-1 md:order-2">
                      <div className="pl-0 md:pl-16">
                        <YearDisplay date={item.date} />
                      </div>
                    </div>
                  </motion.div>
                );
              }

              // EVEN: year left, text right
              return (
                <motion.div
                  key={entry.key}
                  className="relative grid md:grid-cols-2 gap-12 items-center"
                  custom={-1}
                  variants={entryVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                >
                  {/* Year on LEFT */}
                  <div className="md:text-right md:pr-16 order-1">
                    <YearDisplay align="right" date={item.date} />
                  </div>

                  {/* Center dot — on the row, aligned with the center line */}
                  <div
                    className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-10 hidden md:block"
                    style={{
                      backgroundColor: '#8083ff',
                      boxShadow: '0 0 16px rgba(128,131,255,0.4)',
                    }}
                  />

                  {/* Text on RIGHT */}
                  <div className="order-2 relative">
                    <div className="pl-0 md:pl-16">
                      <TierBadge label={t(entry.tier as Parameters<typeof t>[0])} />
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-4xl md:text-5xl font-black leading-none mb-4 tracking-tighter block hover:text-[#c0c1ff] transition-colors"
                        style={{
                          color: '#dae2fd',
                          fontFamily: 'var(--font-manrope), sans-serif',
                        }}
                      >
                        {item.title}
                      </a>
                      <motion.div
                        className="flex flex-wrap gap-2 mb-6"
                        variants={{
                          hidden: {},
                          visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
                        }}
                      >
                        {entry.tech.map((tech) => (
                          <TechChip key={tech} label={tech} />
                        ))}
                      </motion.div>
                      <p
                        className="text-lg leading-relaxed"
                        style={{ color: '#c7c4d7', fontFamily: 'var(--font-inter), sans-serif' }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
