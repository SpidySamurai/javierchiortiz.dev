import { createClient } from '@/lib/supabase/server';
import AnalyticsView from '@/app/admin/_components/AnalyticsView';
import type { TrendPoint } from '@/app/admin/_components/TrendChart';
import type { TopPage } from '@/app/admin/_components/TopPagesTable';

interface Overview {
  total_views: number;
  total_unique: number;
  month_views: number;
  month_unique: number;
  today_views: number;
  today_unique: number;
}

const EMPTY_OVERVIEW: Overview = {
  total_views: 0,
  total_unique: 0,
  month_views: 0,
  month_unique: 0,
  today_views: 0,
  today_unique: 0,
};

export default async function AnalyticsPage() {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const [{ data: overviewRows }, { data: trendRows }, { data: topPagesRows }] = await Promise.all([
    db.rpc('get_analytics_overview'),
    db.rpc('get_daily_trend', { days_back: 30 }),
    db.rpc('get_top_pages', { limit_n: 20 }),
  ]);

  const overview: Overview =
    (overviewRows as Overview[] | null)?.[0] ?? EMPTY_OVERVIEW;

  return (
    <AnalyticsView
      overview={overview}
      trend={(trendRows as unknown as TrendPoint[]) ?? []}
      topPages={(topPagesRows as unknown as TopPage[]) ?? []}
      postHogUrl={process.env.POSTHOG_DASHBOARD_URL ?? null}
    />
  );
}
