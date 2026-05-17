import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { Database } from '@/types/database';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const revalidate = 0;

export async function GET() {
  const { data, error } = await supabase
    .from('visitor_locations')
    .select('region, country_code')
    .order('created_at', { ascending: false })
    .limit(2);

  if (error || !data || data.length < 2) {
    return NextResponse.json({ visitor: null });
  }

  const prev = data[1];
  return NextResponse.json({
    visitor: {
      region: prev.region ?? '',
      countryCode: prev.country_code,
    },
  });
}
