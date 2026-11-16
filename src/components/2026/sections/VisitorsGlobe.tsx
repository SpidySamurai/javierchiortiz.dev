'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import useSWR from 'swr';
import { useLocale, useTranslations } from 'next-intl';
import GlobeCanvas, { type GlobePoint } from '@/components/2026/ui/GlobeCanvas';
import LastVisitorChip from '@/components/2026/ui/LastVisitorChip';
import { CountryRanking } from '@/components/2026/sections/visitors/CountryRanking';
import { VisitorsStatsRow } from '@/components/2026/sections/visitors/VisitorsStatsRow';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface GlobeData {
  points: GlobePoint[];
}

interface StatsData {
  total: number;
  countries: number;
  today: number;
}


interface CountriesData {
  countries: { code: string; country: string; visits: number }[];
}

const TOP_COUNTRIES = 8;

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

export default function VisitorsGlobe() {
  const t = useTranslations('common');
  const locale = useLocale();
  const utcTime = useUTCClock();
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const swrOptions = { revalidateOnFocus: false, dedupingInterval: 60_000 };
  const { data: globe } = useSWR<GlobeData>('/api/visitors/globe', fetcher, swrOptions);
  const { data: stats } = useSWR<StatsData>('/api/visitors/stats', fetcher, swrOptions);
  const { data: countryData } = useSWR<CountriesData>('/api/visitors/countries', fetcher, swrOptions);
  const points = globe?.points ?? [];

  const regionNames = new Intl.DisplayNames([locale], { type: 'region' });
  const allCountries = countryData?.countries ?? [];
  const ranked = allCountries.slice(0, TOP_COUNTRIES).map((c) => ({
    code: c.code,
    name: regionNames.of(c.code.toUpperCase()) ?? c.country,
    visits: c.visits,
  }));
  const remaining = allCountries.length - ranked.length;

  const animate = inView ? 'visible' : 'hidden';
  const transition = (delay: number) =>
    shouldReduceMotion
      ? { duration: 0 }
      : { type: 'spring' as const, stiffness: 280, damping: 26, delay };

  return (
    <section
      ref={ref}
      className="py-20 px-8"
      style={{ backgroundColor: 'var(--ds-bg)', overflow: 'visible' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        <div className="space-y-4">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate={animate}
            transition={transition(0)}
            className="text-3xl md:text-4xl font-extrabold"
            style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            {t('visitors_title')}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={animate}
            transition={transition(0.1)}
            className="max-w-xl leading-relaxed"
            style={{
              color: 'var(--ds-on-surface-variant)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {t('visitors_subtitle')}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 lg:items-center">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate={animate}
            transition={transition(0.2)}
            className="min-w-0"
          >
            <GlobeCanvas points={points} size={480} />
          </motion.div>

          {ranked.length > 0 && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={animate}
              transition={transition(0.3)}
            >
              <CountryRanking
                title={t('visitors_top_title')}
                countries={ranked}
                locale={locale}
                moreLabel={remaining > 0 ? t('visitors_more', { n: remaining }) : undefined}
              />
            </motion.div>
          )}
        </div>

        {stats && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={animate}
            transition={transition(0.4)}
            className="flex flex-col gap-4"
          >
            <VisitorsStatsRow
              locale={locale}
              stats={[
                { value: stats.total, label: t('visitors_total') },
                { value: stats.countries, label: t('visitors_countries') },
                { value: stats.today, label: t('visitors_today') },
              ]}
              aside={<LastVisitorChip />}
            />
            <p
              className="text-[11px]"
              style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t('visitors_since')}
              {utcTime && (
                <span style={{ color: 'var(--ds-on-surface-variant)' }}>
                  {' · '}
                  {utcTime} UTC
                </span>
              )}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
