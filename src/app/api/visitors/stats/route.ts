import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { Database } from '@/types/database';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 60;

export async function GET() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [totalResult, countriesResult, todayResult] = await Promise.all([
    supabase
      .from('visitor_locations')
      .select('*', { count: 'exact', head: true }),
    supabase
      .from('visitor_locations')
      .select('country_code'),
    supabase
      .from('visitor_locations')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart.toISOString()),
  ]);

  const uniqueCountries = new Set(
    (countriesResult.data ?? []).map((r) => r.country_code)
  ).size;

  return NextResponse.json({
    total: totalResult.count ?? 0,
    countries: uniqueCountries,
    today: todayResult.count ?? 0,
  });
}
