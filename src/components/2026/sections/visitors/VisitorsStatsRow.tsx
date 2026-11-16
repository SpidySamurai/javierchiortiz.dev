import type { ReactNode } from 'react';

const HAIRLINE = 'color-mix(in srgb, var(--ds-on-surface) 7%, transparent)';

function Stat({ value, label, locale }: { value: number; label: string; locale: string }) {
  return (
    <div>
      <div
        className="text-3xl font-extrabold"
        style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-manrope), sans-serif' }}
      >
        {value.toLocaleString(locale)}
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

/** Totals between two hairlines, with a slot on the right for the last visitor. */
export function VisitorsStatsRow({
  stats,
  locale,
  aside,
}: {
  stats: { value: number; label: string }[];
  locale: string;
  aside?: ReactNode;
}) {
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-x-12 gap-y-5 py-6"
      style={{ boxShadow: `0 -1px 0 ${HAIRLINE}, 0 1px 0 ${HAIRLINE}` }}
    >
      <div className="flex flex-wrap gap-x-12 gap-y-5">
        {stats.map((s) => (
          <Stat key={s.label} {...s} locale={locale} />
        ))}
      </div>
      {aside}
    </div>
  );
}
