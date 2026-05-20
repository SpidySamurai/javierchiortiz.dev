'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Chip from '@/components/2026/ui/Chip';

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
    yearDisplay: ['2022', '2023'],
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
      duration: 0.38,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      staggerChildren: 0.06,
    },
  },
};

const yearVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 },
  },
};


const MONTH_IDX: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
  // Spanish
  Ene: 0,
  Ago: 7,
  Dic: 11,
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

function ChipCarousel({ items }: { items: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft.current - (x - startX.current);
  };
  const stopDrag = () => { dragging.current = false; };

  return (
    <div
      className="relative overflow-hidden mb-6"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
      }}
    >
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-1 cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        {items.map((tech, i) => (
          <motion.span
            key={tech}
            initial={{ opacity: 0, x: 8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.3, ease: 'easeOut' }}
            className="shrink-0"
          >
            <Chip variant="tech">{tech}</Chip>
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function Description({ text }: { text: string }) {
  const parts = text.split('\n\n');
  return (
    <div className="space-y-2" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      {parts.map((part, i) => (
        <p
          key={i}
          className="text-lg leading-relaxed"
          style={{
            color:
              i === 0
                ? 'var(--ds-on-surface-variant)'
                : 'color-mix(in srgb, var(--ds-on-surface-variant) 80%, transparent)',
          }}
        >
          {part}
        </p>
      ))}
    </div>
  );
}

function TierBadge({ label, isLead }: { label: string; isLead?: boolean }) {
  return <Chip variant="tier" active={isLead}>{label}</Chip>;
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
          style={{ color: 'color-mix(in srgb, var(--ds-primary) 55%, transparent)' }}
        >
          {period}
        </span>
      )}
      {duration && (
        <span
          className="block mt-2"
          style={{
            color: 'color-mix(in srgb, var(--ds-primary) 35%, transparent)',
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

const VISIBLE_DEFAULT = 3;

export default function Timeline() {
  const t = useTranslations('common');
  const [showAll, setShowAll] = useState(false);
  const visibleEntries = showAll ? TIMELINE_ENTRIES : TIMELINE_ENTRIES.slice(0, VISIBLE_DEFAULT);

  return (
    <section
      id="experience"
      data-track-section="experience"
      className="px-8 lg:px-20 py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--ds-surface)', scrollMarginTop: '5rem' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-end mb-24 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <div className="space-y-2">
            <span
              className="text-xs uppercase tracking-[0.3em] font-bold block"
              style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t('timeline_label')}
            </span>
            <h3
              className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
              style={{
                color: 'var(--ds-on-surface)',
                fontFamily: 'var(--font-manrope), sans-serif',
              }}
            >
              {t('timeline_title')}{' '}
              <span style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>
                {t('timeline_title_accent')}
              </span>
            </h3>
          </div>
        </motion.div>

        {/* Timeline items */}
        <div className="relative">
          {/* Center vertical line */}
          <div
            className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px hidden md:block"
            style={{
              background: `linear-gradient(to bottom, var(--ds-primary), color-mix(in srgb, var(--ds-primary) 15%, transparent), transparent)`,
              transform: 'translateX(-50%)',
            }}
          />

          <div className="space-y-32">
            <AnimatePresence initial={false}>
            {visibleEntries.map((entry, i) => {
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
                        className="text-4xl md:text-5xl font-black leading-none mb-2 tracking-tighter block hover:text-[var(--ds-primary)] transition-colors"
                        style={{
                          color: 'var(--ds-on-surface)',
                          fontFamily: 'var(--font-manrope), sans-serif',
                        }}
                      >
                        {item.title}
                      </a>
                      <ChipCarousel items={entry.tech} />
                      <Description text={item.description} />
                    </div>

                    {/* Center dot — on the row, aligned with the center line */}
                    <div
                      className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-10 hidden md:block"
                      style={{
                        backgroundColor: 'var(--ds-primary)',
                        boxShadow:
                          '0 0 20px color-mix(in srgb, var(--ds-primary) 60%, transparent)',
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
                      backgroundColor: 'var(--ds-primary-container)',
                      boxShadow:
                        '0 0 16px color-mix(in srgb, var(--ds-primary-container) 40%, transparent)',
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
                        className="text-4xl md:text-5xl font-black leading-none mb-4 tracking-tighter block hover:text-[var(--ds-primary)] transition-colors"
                        style={{
                          color: 'var(--ds-on-surface)',
                          fontFamily: 'var(--font-manrope), sans-serif',
                        }}
                      >
                        {item.title}
                      </a>
                      <ChipCarousel items={entry.tech} />
                      <Description text={item.description} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </div>

          {/* Show more / less */}
          {TIMELINE_ENTRIES.length > VISIBLE_DEFAULT && (
            <motion.div
              className="flex justify-center mt-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => setShowAll((v) => !v)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors"
                style={{
                  color: 'var(--ds-primary)',
                  fontFamily: 'var(--font-inter), sans-serif',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem 1rem',
                }}
              >
                <span translate="no" className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  {showAll ? 'expand_less' : 'expand_more'}
                </span>
                {showAll ? t('show_less') : t('show_more')}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
