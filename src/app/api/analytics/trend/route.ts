import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ALLOWED_DAYS = [30, 90, 365] as const;

export async function GET(req: NextRequest) {
  const raw = parseInt(req.nextUrl.searchParams.get('days') ?? '30', 10);
  const daysBack: number = ALLOWED_DAYS.includes(raw as (typeof ALLOWED_DAYS)[number]) ? raw : 30;

  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc('get_daily_trend', { days_back: daysBack });

  if (error) return NextResponse.json([], { status: 500 });
  return NextResponse.json(data ?? []);
}
