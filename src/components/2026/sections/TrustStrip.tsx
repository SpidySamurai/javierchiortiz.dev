'use client';

import { motion } from 'framer-motion';

const STATS = [
  { value: '5+', label: 'years experience' },
  { value: '2', label: 'SaaS live' },
  { value: '3+', label: 'e-commerce brands' },
];

const COMPANIES = ['Softtek', 'ENTI'];

export default function TrustStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="px-8 lg:px-20 py-8"
      style={{ backgroundColor: 'var(--ds-bg)' }}
    >
      <div
        className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-5 rounded-2xl"
        style={{
          backgroundColor: 'var(--ds-surface)',
          border: '1px solid color-mix(in srgb, var(--ds-outline-variant) 40%, transparent)',
        }}
      >
        {/* Stats */}
        <div className="flex items-center gap-8">
          {STATS.map((stat, i) => (
            <div key={i} className="flex flex-col items-center sm:items-start">
              <span
                className="text-2xl font-black tracking-tight leading-none"
                style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-manrope), sans-serif' }}
              >
                {stat.value}
              </span>
              <span
                className="text-[10px] uppercase tracking-widest mt-0.5"
                style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          className="hidden sm:block w-px self-stretch"
          style={{ backgroundColor: 'color-mix(in srgb, var(--ds-outline-variant) 40%, transparent)' }}
        />

        {/* Companies */}
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] uppercase tracking-widest mr-2"
            style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Worked at
          </span>
          {COMPANIES.map((name, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-lg text-xs font-bold tracking-wide"
              style={{
                color: 'var(--ds-on-surface-variant)',
                backgroundColor: 'color-mix(in srgb, var(--ds-outline-variant) 15%, transparent)',
                fontFamily: 'var(--font-manrope), sans-serif',
              }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
