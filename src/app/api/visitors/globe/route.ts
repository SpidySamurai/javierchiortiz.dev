import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { Database } from '@/types/database';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 60;

export async function GET() {
  const { data } = await supabase
    .from('visitor_locations')
    .select('latitude, longitude')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null);

  const points = (data ?? []).map((row) => ({
    lat: row.latitude as number,
    lng: row.longitude as number,
  }));

  return NextResponse.json({ points });
}
