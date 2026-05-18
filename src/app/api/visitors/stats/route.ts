import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { Database } from '@/types/database';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 60;

export async function GET() {
  const todayStart = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z');

  const [totalResult, countriesResult, todayResult] = await Promise.all([
    supabase
      .from('visitor_locations')
      .select('*', { count: 'exact', head: true }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any).rpc('count_distinct_countries'),
    supabase
      .from('visitor_locations')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart.toISOString()),
  ]);

  return NextResponse.json({
    total: totalResult.count ?? 0,
    countries: (countriesResult.data as number | null) ?? 0,
    today: todayResult.count ?? 0,
  });
}
