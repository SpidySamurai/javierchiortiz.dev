'use client';

import { memo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useScramble } from '@/hooks/useScramble';

export interface ServiceItem {
  label: string;
  sub: string;
}

const ScrambleServiceCycler = memo(function ScrambleServiceCycler({
  services,
  active,
  idx,
  started,
  frozen,
  onStart,
  onAdvance,
}: {
  services: ServiceItem[];
  active: boolean;
  /** Index and started flag are owned by Hero so the planet ring can follow them. */
  idx: number;
  started: boolean;
  /** Stop advancing; the interval restarts from zero when it clears. */
  frozen: boolean;
  onStart: () => void;
  onAdvance: () => void;
}) {
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(onStart, 350);
    return () => clearTimeout(t);
  }, [active, onStart]);

  useEffect(() => {
    if (!started || frozen) return;
    const timer = setInterval(onAdvance, 3200);
    return () => clearInterval(timer);
  }, [started, frozen, onAdvance]);

  const current = services[idx];
  const label = useScramble(started ? current.label : '');

  return (
    <div className="space-y-1.5 flex-shrink-0 min-w-[14rem]">
      {/* Progress pills */}
      <div className="flex gap-1 items-center md:justify-center mb-2">
        {services.map((_, i) => (
          <div
            key={i}
            className="h-[2px] rounded-full transition-all duration-500"
            style={{
              width: i === idx ? '14px' : '4px',
              backgroundColor:
                i === idx
                  ? 'var(--ds-primary)'
                  : 'color-mix(in srgb, var(--ds-primary) 22%, transparent)',
            }}
          />
        ))}
      </div>

      {/* Width of the longest service, so the divider and CTA beside it never move */}
      <div aria-hidden className="invisible h-0 my-0 overflow-hidden">
        {services.map((s) => (
          <div key={s.label}>
            <div
              className="text-2xl font-bold tracking-tight whitespace-nowrap"
              style={{ fontFamily: 'var(--font-manrope), sans-serif', letterSpacing: '-0.01em' }}
            >
              {s.label}
            </div>
            <div
              className="text-sm italic whitespace-nowrap"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Scrambling label: w-0 min-w-full keeps its changing text out of the box width */}
      <p
        className="text-2xl font-bold tracking-tight w-0 min-w-full whitespace-nowrap"
        style={{
          color: 'var(--ds-on-surface)',
          fontFamily: 'var(--font-manrope), sans-serif',
          minHeight: '2rem',
          letterSpacing: '-0.01em',
        }}
      >
        {label}
        {started && label !== current.label && (
          <span
            style={{ borderRight: '2px solid currentColor', marginLeft: '2px', opacity: 0.6 }}
          />
        )}
      </p>

      {/* Sub description */}
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.22 }}
          className="text-sm italic w-0 min-w-full whitespace-nowrap"
          style={{
            color: 'var(--ds-on-surface-variant)',
            fontFamily: 'var(--font-inter), sans-serif',
            minHeight: '1.25rem',
          }}
        >
          {started ? current.sub : ''}
        </motion.p>
      </AnimatePresence>
    </div>
  );
});

export default ScrambleServiceCycler;
