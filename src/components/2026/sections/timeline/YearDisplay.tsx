'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { parseDuration } from './duration';

const yearVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 },
  },
};

export default function YearDisplay({ date }: { date?: string }) {
  const t = useTranslations('common');
  const duration = date ? parseDuration(date, t('duration_yr'), t('duration_mo')) : null;
  const period = date ? date.toUpperCase() : null;
  return (
    <motion.span
      className="font-black leading-none block"
      style={{ fontFamily: 'var(--font-manrope), sans-serif' }}
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
