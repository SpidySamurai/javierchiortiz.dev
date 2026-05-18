import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PRIVATE_IP_RE =
  /^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|::1$|fd[0-9a-f]{2}:)/i;

function getClientIp(req: NextRequest): string | null {
  // x-forwarded-for leftmost value is client-supplied and spoofable;
  // acceptable for a cosmetic last-visitor widget.
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip');
}

async function geolocateIp(
  ip: string
): Promise<{ city: string; country: string; countryCode: string; region: string } | null> {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city,regionName&lang=en`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 'success' || !data.city) return null;
    return { city: data.city, country: data.country, countryCode: data.countryCode, region: data.regionName ?? '' };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { path, locale, newVisitor } = body;
  if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 });

  const referrer = req.headers.get('referer') ?? null;
  await supabase.from('page_views').insert({ path, locale: locale ?? null, referrer });

  let visitorGeo: { city: string; countryCode: string } | null = null;

  if (newVisitor) {
    const ip = getClientIp(req);
    if (ip && !PRIVATE_IP_RE.test(ip)) {
      const geo = await geolocateIp(ip);
      if (geo) {
        await supabase.from('visitor_locations').insert({
          city: geo.city,
          country: geo.country,
          country_code: geo.countryCode,
          region: geo.region,
        });
        visitorGeo = { city: geo.city, countryCode: geo.countryCode };
      }
    }
  }

  return NextResponse.json({ ok: true, geo: visitorGeo });
}
