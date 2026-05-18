'use client';

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

export default function VisitorsGlobe() {
  const t = useTranslations('common');

  const { data: globe } = useSWR<GlobeData>('/api/visitors/globe', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });
  const { data: stats } = useSWR<StatsData>('/api/visitors/stats', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });

  const points = globe?.points ?? [];

  return (
    <section
      className="py-20 px-8 md:px-16"
      style={{ backgroundColor: 'var(--ds-bg)' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
        <h1
          className="text-3xl md:text-4xl font-extrabold text-center"
          style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
        >
          {t('visitors_title')}
        </h1>

        <GlobeCanvas points={points} size={480} />

        {stats && (
          <div className="flex gap-12 justify-center flex-wrap">
            <StatItem value={stats.total} label={t('visitors_total')} />
            <StatItem value={stats.countries} label={t('visitors_countries')} />
            <StatItem value={stats.today} label={t('visitors_today')} />
          </div>
        )}
      </div>
    </section>
  );
}
