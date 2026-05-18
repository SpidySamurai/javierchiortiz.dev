import { createClient } from '@/lib/supabase/server';
import AnalyticsView from '@/app/admin/_components/AnalyticsView';

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: views } = await supabase.from('page_views').select('path');

  const counts = (views ?? []).reduce<Record<string, number>>((acc, { path }) => {
    acc[path] = (acc[path] ?? 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const postHogUrl = process.env.POSTHOG_DASHBOARD_URL ?? null;

  return <AnalyticsView data={data} postHogUrl={postHogUrl} />;
}
