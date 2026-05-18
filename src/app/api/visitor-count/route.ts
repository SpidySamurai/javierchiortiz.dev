import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const revalidate = 60;

export async function GET() {
  const { count, error } = await supabase
    .from('visitor_locations')
    .select('*', { count: 'exact', head: true });

  if (error) return NextResponse.json({ count: null });

  return NextResponse.json({ count });
}
