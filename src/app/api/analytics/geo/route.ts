import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc('get_geo_breakdown', { limit_n: 100 });
  if (error) return NextResponse.json([], { status: 500 });
  return NextResponse.json(data ?? []);
}
