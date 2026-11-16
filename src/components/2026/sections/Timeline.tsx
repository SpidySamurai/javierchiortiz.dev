'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import EntryContent, { useEntryMessages } from '@/components/2026/sections/timeline/EntryContent';
import YearDisplay from '@/components/2026/sections/timeline/YearDisplay';
import { JOURNEY, type JourneyEntry } from '@/data/journey';

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

/** One row: year on one side of the center line, text on the other (alternating sides, always left-aligned). */
function TimelineRow({ entry, index }: { entry: JourneyEntry; index: number }) {
  const { date } = useEntryMessages(entry);
  const textLeft = index % 2 === 0;

  return (
    <motion.div
      className="relative grid md:grid-cols-2 gap-12 items-center"
      custom={textLeft ? 1 : -1}
      variants={entryVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {textLeft ? (
        <>
          <div className="md:pr-16 order-2 md:order-1">
            <EntryContent entry={entry} />
          </div>
          <div className="relative order-1 md:order-2">
            <div className="pl-0 md:pl-16">
              <YearDisplay date={date} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="md:pr-16 order-1">
            <YearDisplay date={date} />
          </div>
          <div className="order-2 relative">
            <div className="pl-0 md:pl-16">
              <EntryContent entry={entry} />
            </div>
          </div>
        </>
      )}

      {/* Center dot, on the row, aligned with the center line */}
      <div
        className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-10 hidden md:block"
        style={
          textLeft
            ? {
                backgroundColor: 'var(--ds-primary)',
                boxShadow: '0 0 20px color-mix(in srgb, var(--ds-primary) 60%, transparent)',
              }
            : {
                backgroundColor: 'var(--ds-primary-container)',
                boxShadow: '0 0 16px color-mix(in srgb, var(--ds-primary-container) 40%, transparent)',
              }
        }
      />
    </motion.div>
  );
}

export default function Timeline() {
  const t = useTranslations('common');

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
              {JOURNEY.map((entry, i) => (
                <TimelineRow key={entry.id} entry={entry} index={i} />
              ))}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
