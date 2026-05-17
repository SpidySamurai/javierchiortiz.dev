import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { path, locale } = body;
  if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 });

  const referrer = req.headers.get('referer') ?? null;
  await supabase.from('page_views').insert({ path, locale: locale ?? null, referrer });

  return NextResponse.json({ ok: true });
}
