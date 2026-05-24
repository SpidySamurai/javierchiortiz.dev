'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import GlobeCanvas, { type GlobePoint } from '@/components/2026/ui/GlobeCanvas';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface GlobeData {
  points: GlobePoint[];
}

interface StatsData {
  total: number;
  countries: number;
  today: number;
}


function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div
        className="text-3xl font-extrabold"
        style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-manrope), sans-serif' }}
      >
        {value.toLocaleString()}
      </div>
      <div
        className="text-[10px] uppercase tracking-widest mt-1"
        style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {label}
      </div>
    </div>
  );
}

function useUTCClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString('en-GB', { timeZone: 'UTC', hour12: false });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const statsContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const statItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function VisitorsGlobe() {
  const t = useTranslations('common');
  const utcTime = useUTCClock();
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
const { data: globe } = useSWR<GlobeData>('/api/visitors/globe', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });
  const { data: stats } = useSWR<StatsData>('/api/visitors/stats', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });
  const points = globe?.points ?? [];

  const animate = inView ? 'visible' : 'hidden';
  const transition = (delay: number) =>
    shouldReduceMotion
      ? { duration: 0 }
      : { type: 'spring' as const, stiffness: 280, damping: 26, delay };

  return (
    <section
      ref={ref}
      className="py-20 px-8 md:px-16"
      style={{ backgroundColor: 'var(--ds-bg)', overflow: 'visible' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate={animate}
          transition={transition(0)}
          className="text-3xl md:text-4xl font-extrabold text-center"
          style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
        >
          {t('visitors_title')}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={animate}
          transition={transition(0.1)}
          className="text-center max-w-xl leading-relaxed"
          style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {t('visitors_subtitle')}
        </motion.p>

        {/* Globe with flags orbiting around it */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate={animate}
          transition={transition(0.2)}
          style={{ width: 480, height: 480, flexShrink: 0 }}
        >
          <GlobeCanvas points={points} size={480} />
        </motion.div>

        {stats && (
          <motion.div
            variants={statsContainer}
            initial="hidden"
            animate={animate}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex gap-12 justify-center flex-wrap">
              {[
                { value: stats.total, label: t('visitors_total') },
                { value: stats.countries, label: t('visitors_countries') },
                { value: stats.today, label: t('visitors_today') },
              ].map(({ value, label }) => (
                <motion.div key={label} variants={statItem}>
                  <StatItem value={value} label={label} />
                </motion.div>
              ))}
            </div>
            <motion.p
              variants={fadeUp}
              className="text-[11px] text-center"
              style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t('visitors_since')}
              {utcTime && (
                <span style={{ color: 'var(--ds-on-surface-variant)' }}>
                  {' · '}{utcTime} UTC
                </span>
              )}
            </motion.p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
