'use client';

import { useState } from 'react';
import SectionHeader from '@/app/admin/_components/SectionHeader';
import StatCard from '@/app/admin/_components/StatCard';
import TrendChart from '@/app/admin/_components/TrendChart';
import TopPagesTable, { type TopPage } from '@/app/admin/_components/TopPagesTable';
import VisitorList, { type Visitor } from '@/app/admin/_components/VisitorList';
import GeoHeatmap from '@/app/admin/_components/GeoHeatmap';

interface Overview {
  total_views: number;
  total_unique: number;
  month_views: number;
  month_unique: number;
  today_views: number;
  today_unique: number;
}

type Tab = 'site' | 'posthog';

export default function AnalyticsView({
  overview,
  topPages,
  visitors,
  postHogUrl,
}: {
  overview: Overview;
  topPages: TopPage[];
  visitors: Visitor[];
  postHogUrl?: string | null;
}) {
  const [activeTab, setActiveTab] = useState<Tab>('site');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'site', label: 'Site Analytics' },
    { id: 'posthog', label: 'PostHog' },
  ];

  return (
    <div>
      <div className="mb-7">
        <SectionHeader eyebrow="Metrics" title="Site" accent="Analytics" subtitle="Page views" />
      </div>

      <div
        className="flex gap-1 p-1 rounded-[12px] mb-7 w-fit"
        style={{ background: 'var(--ds-surface)' }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-1.5 rounded-[8px] text-[13px] font-medium transition-colors duration-150 cursor-pointer border-none"
              style={{
                background: isActive ? 'var(--ds-surface-highest)' : 'transparent',
                color: isActive ? 'var(--ds-on-surface)' : 'var(--ds-outline)',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'site' && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Total Views" primary={overview.total_views} />
            <StatCard label="Unique Visitors" primary={overview.total_unique} />
            <StatCard
              label="This Month"
              primary={overview.month_unique}
              secondary={`${overview.month_views.toLocaleString()} views`}
            />
            <StatCard
              label="Today"
              primary={overview.today_unique}
              secondary={`${overview.today_views.toLocaleString()} views`}
            />
          </div>
          <TrendChart />
          <GeoHeatmap />
          <TopPagesTable data={topPages} />
          <VisitorList data={visitors} />
        </div>
      )}

      {activeTab === 'posthog' && (
        <>
          {postHogUrl ? (
            <div
              className="rounded-[14px] overflow-hidden"
              style={{ border: '1px solid var(--ds-surface-high)' }}
            >
              <iframe
                src={postHogUrl}
                className="w-full h-[700px] border-none block"
                allowFullScreen
              />
            </div>
          ) : (
            <div
              className="px-5 py-4 rounded-xl text-[13px] leading-[1.6]"
              style={{
                border: '1px dashed var(--ds-surface-high)',
                color: 'var(--ds-outline-variant)',
              }}
            >
              PostHog dashboard not configured. Set{' '}
              <code
                className="px-1.5 py-px rounded"
                style={{ color: 'var(--ds-outline)', background: 'var(--ds-surface-container)' }}
              >
                POSTHOG_DASHBOARD_URL
              </code>{' '}
              in{' '}
              <code
                className="px-1.5 py-px rounded"
                style={{ color: 'var(--ds-outline)', background: 'var(--ds-surface-container)' }}
              >
                .env.local
              </code>
              .
            </div>
          )}
        </>
      )}
    </div>
  );
}
