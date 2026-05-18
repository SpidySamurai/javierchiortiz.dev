import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { Database } from '@/types/database';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 0;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const excludeCity = searchParams.get('city');
  const excludeCountry = searchParams.get('country');

  const { data, error } = await supabase
    .from('visitor_locations')
    .select('city, country_code')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !data || data.length < 2) {
    return NextResponse.json({ visitor: null });
  }

  // Skip most recent (current visitor), find first that differs from caller
  const candidates = data.slice(1);
  const match = candidates.find((row) => {
    if (!excludeCity || !excludeCountry) return true;
    return row.city !== excludeCity || row.country_code !== excludeCountry;
  }) ?? candidates[0];

  if (!match) return NextResponse.json({ visitor: null });

  return NextResponse.json({
    visitor: {
      region: match.city,
      countryCode: match.country_code,
    },
  });
}
