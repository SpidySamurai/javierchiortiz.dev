import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { Database } from '@/types/database';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 60;

export async function GET() {
  const { data, error } = await supabase
    .from('visitor_locations')
    .select('country_code, country')
    .not('country_code', 'is', null)
    .not('country', 'is', null);

  if (error) return NextResponse.json({ countries: [] });

  const counts: Record<string, { country: string; visits: number }> = {};
  for (const row of data ?? []) {
    const code = (row.country_code as string).toLowerCase();
    if (!counts[code]) counts[code] = { country: row.country as string, visits: 0 };
    counts[code].visits++;
  }

  const countries = Object.entries(counts)
    .map(([code, { country, visits }]) => ({ code, country, visits }))
    .sort((a, b) => b.visits - a.visits);

  return NextResponse.json({ countries });
}
