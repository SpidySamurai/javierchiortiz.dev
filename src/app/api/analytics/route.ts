import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getClientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip');
}

async function geolocateIp(ip: string): Promise<{ city: string; country: string; countryCode: string } | null> {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 'success' || !data.city) return null;
    return { city: data.city, country: data.country, countryCode: data.countryCode };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { path, locale } = body;
  if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 });

  const referrer = req.headers.get('referer') ?? null;
  await supabase.from('page_views').insert({ path, locale: locale ?? null, referrer });

  const ip = getClientIp(req);
  if (ip) {
    const geo = await geolocateIp(ip);
    if (geo) {
      await supabase.from('visitor_locations').insert({
        city: geo.city,
        country: geo.country,
        country_code: geo.countryCode,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
