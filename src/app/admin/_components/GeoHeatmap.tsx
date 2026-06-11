'use client';

import useSWR from 'swr';
import { Treemap, ResponsiveContainer } from 'recharts';

export interface GeoRow {
  country: string;
  country_code: string;
  city: string;
  visitors: number;
}

interface CountryNode {
  name: string;
  code: string;
  size: number;
  maxSize: number;
}

function flagEmoji(code: string | null | undefined) {
  if (!code || code.length < 2) return '🌐';
  return [...code.toUpperCase()]
    .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join('');
}

function lerpColor(t: number): string {
  // #131b2e (ds-surface, near-black) → #c0c1ff (ds-primary, bright lavender)
  // Wide range for maximum contrast between low and high traffic
  const r = Math.round(0x13 + (0xc0 - 0x13) * t);
  const g = Math.round(0x1b + (0xc1 - 0x1b) * t);
  const b = Math.round(0x2e + (0xff - 0x2e) * t);
  return `rgb(${r},${g},${b})`;
}

// Pick readable text color based on cell brightness (t = normalized traffic)
function cellTextColor(t: number): string {
  return t > 0.55 ? '#0f0060' : '#dae2fd';
}
function cellSubColor(t: number): string {
  return t > 0.55 ? 'rgba(15,0,96,0.88)' : 'rgba(192,193,255,0.85)';
}

function TreeCell(props: CountryNode & { x: number; y: number; width: number; height: number }) {
  const { x, y, width, height, name, code, size, maxSize } = props;
  const t = Math.sqrt(size / (maxSize || 1));
  const fill = lerpColor(t);
  const textColor = cellTextColor(t);
  const subColor = cellSubColor(t);
  const showFlag = width > 36 && height > 24;
  const showName = width > 56 && height > 38;
  const showCount = width > 56 && height > 52;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx={6}
        style={{ stroke: 'var(--ds-bg, #0b1326)', strokeWidth: 2 }}
      />
      {showFlag && (
        <text
          x={x + width / 2}
          y={y + height / 2 - (showName ? 10 : 0)}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={showName ? 14 : 11}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {flagEmoji(code)}
        </text>
      )}
      {showName && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 8}
          textAnchor="middle"
          fill={textColor}
          fontSize={10}
          fontWeight={600}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {name}
        </text>
      )}
      {showCount && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 21}
          textAnchor="middle"
          fill={subColor}
          fontSize={10}
          fontWeight={500}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {size}
        </text>
      )}
    </g>
  );
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function GeoHeatmap() {
  const { data: rows = [] } = useSWR<GeoRow[]>('/api/analytics/geo', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });

  // Aggregate by country
  const byCountry = new Map<string, CountryNode>();
  for (const row of rows) {
    if (!row.country_code) continue;
    if (!byCountry.has(row.country)) {
      byCountry.set(row.country, { name: row.country, code: row.country_code, size: 0, maxSize: 0 });
    }
    byCountry.get(row.country)!.size += Number(row.visitors);
  }
  const countries = Array.from(byCountry.values()).sort((a, b) => b.size - a.size);
  const maxCountry = countries[0]?.size ?? 1;
  const treemapData = countries.map((c) => ({ ...c, maxSize: maxCountry }));

  // Top cities
  const cities = [...rows]
    .sort((a, b) => Number(b.visitors) - Number(a.visitors))
    .slice(0, 30);
  const maxCity = cities[0] ? Number(cities[0].visitors) : 1;

  return (
    <div className="flex flex-col gap-5">
      <div
        className="px-4 pt-5 pb-4 rounded-[14px]"
        style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-surface-high)' }}
      >
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.05em] mb-4 block"
          style={{ color: 'var(--ds-on-surface-variant)' }}
        >
          Visitors by country
        </span>
        {treemapData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <Treemap
              data={treemapData}
              dataKey="size"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              content={<TreeCell {...({} as any)} />}
            />
          </ResponsiveContainer>
        ) : (
          <p className="text-center py-10 m-0" style={{ color: 'var(--ds-outline-variant)' }}>
            No data yet.
          </p>
        )}
      </div>

      <div
        className="flex flex-col px-6 py-5 rounded-[14px]"
        style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-surface-high)' }}
      >
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.05em] mb-4 block"
          style={{ color: 'var(--ds-on-surface-variant)' }}
        >
          Visitors by city
        </span>
        <div
          className="flex flex-col gap-2 max-h-[280px] overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--ds-surface-highest) transparent',
          }}
        >
          {cities.map((row, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[15px] shrink-0 w-5 text-center leading-none">
                {flagEmoji(row.country_code)}
              </span>
              <span
                className="text-[12px] w-[130px] shrink-0 truncate"
                style={{ color: 'var(--ds-outline)' }}
              >
                {row.city}
              </span>
              <div
                className="flex-1 rounded-full h-1.5"
                style={{ background: 'var(--ds-surface-container)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(Number(row.visitors) / maxCity) * 100}%`,
                    background:
                      'linear-gradient(90deg, var(--ds-on-secondary), var(--ds-primary))',
                  }}
                />
              </div>
              <span
                className="text-[11px] w-5 text-right shrink-0 tabular-nums"
                style={{ color: 'var(--ds-outline-variant)' }}
              >
                {row.visitors}
              </span>
            </div>
          ))}
          {cities.length === 0 && (
            <p className="text-center py-6 m-0" style={{ color: 'var(--ds-outline-variant)' }}>
              No data yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
