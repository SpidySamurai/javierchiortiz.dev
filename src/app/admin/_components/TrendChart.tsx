'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export interface TrendPoint {
  day: string;
  views: number;
  unique_visitors: number;
}

interface Colors {
  views: string;
  unique: string;
  grid: string;
  text: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipLabel: string;
  tooltipItem: string;
}

const FALLBACK_COLORS: Colors = {
  views: '#8083ff',
  unique: '#c0c1ff',
  grid: '#464554',
  text: '#908fa0',
  tooltipBg: '#171f33',
  tooltipBorder: '#2d3449',
  tooltipLabel: '#dae2fd',
  tooltipItem: '#908fa0',
};

function readColors(): Colors {
  const s = getComputedStyle(document.documentElement);
  const v = (name: string) => s.getPropertyValue(name).trim();
  return {
    views: v('--ds-primary-container') || FALLBACK_COLORS.views,
    unique: v('--ds-primary') || FALLBACK_COLORS.unique,
    grid: v('--ds-outline-variant') || FALLBACK_COLORS.grid,
    text: v('--ds-outline') || FALLBACK_COLORS.text,
    tooltipBg: v('--ds-surface-container') || FALLBACK_COLORS.tooltipBg,
    tooltipBorder: v('--ds-surface-highest') || FALLBACK_COLORS.tooltipBorder,
    tooltipLabel: v('--ds-on-surface') || FALLBACK_COLORS.tooltipLabel,
    tooltipItem: v('--ds-outline') || FALLBACK_COLORS.tooltipItem,
  };
}

export default function TrendChart({ data }: { data: TrendPoint[] }) {
  const [colors, setColors] = useState<Colors>(FALLBACK_COLORS);

  useEffect(() => {
    setColors(readColors());
  }, []);

  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.day + 'T00:00:00').toLocaleDateString('en', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  return (
    <div
      className="px-4 pt-5 pb-4 rounded-[14px]"
      style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-surface-high)' }}
    >
      <div className="flex items-center gap-4 mb-4">
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.05em]"
          style={{ color: 'var(--ds-on-surface-variant)' }}
        >
          30-day trend
        </span>
        <div className="flex items-center gap-3 ml-auto">
          <span className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--ds-outline)' }}>
            <span className="w-2.5 h-0.5 inline-block" style={{ background: colors.views }} />
            Page views
          </span>
          <span className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--ds-outline)' }}>
            <span className="w-2.5 h-0.5 inline-block" style={{ background: colors.unique }} />
            Unique visitors
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={formatted} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
          <CartesianGrid vertical={false} stroke={colors.grid} strokeOpacity={0.25} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: colors.text }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: colors.text }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: colors.tooltipLabel }}
            itemStyle={{ color: colors.tooltipItem }}
            cursor={{ stroke: colors.grid, strokeOpacity: 0.4 }}
          />
          <Line
            dataKey="views"
            name="Page views"
            stroke={colors.views}
            dot={false}
            strokeWidth={2}
            type="monotone"
          />
          <Line
            dataKey="unique_visitors"
            name="Unique visitors"
            stroke={colors.unique}
            dot={false}
            strokeWidth={2}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
