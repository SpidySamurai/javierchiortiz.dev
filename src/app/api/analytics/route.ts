import { createHash } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const VISITOR_HASH_SALT = process.env.VISITOR_HASH_SALT ?? 'dev-salt';

const PRIVATE_IP_RE =
  /^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|::1$|fd[0-9a-f]{2}:)/i;

function getClientIp(req: NextRequest): string | null {
  // x-forwarded-for leftmost value is client-supplied and spoofable;
  // acceptable for a cosmetic last-visitor widget.
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip');
}

const COUNTRY_CENTROIDS: Record<string, [number, number]> = {
  MX: [23.63, -102.55], US: [37.09, -95.71], CA: [56.13, -106.35],
  GB: [55.38, -3.44],   DE: [51.17, 10.45],  FR: [46.23, 2.21],
  ES: [40.46, -3.75],   IT: [41.87, 12.57],  BR: [-14.24, -51.93],
  AR: [-38.42, -63.62], CO: [4.57, -74.30],  PE: [-9.19, -75.02],
  VE: [6.42, -66.59],   CL: [-35.68, -71.54],JP: [36.20, 138.25],
  KR: [35.91, 127.77],  CN: [35.86, 104.20], IN: [20.59, 78.96],
  AU: [-25.27, 133.78], NZ: [-40.90, 174.89],
};

function countryFallbackCoords(countryCode: string): [number, number] | null {
  return COUNTRY_CENTROIDS[countryCode] ?? null;
}

async function geolocateIp(ip: string): Promise<{
  city: string;
  country: string;
  countryCode: string;
  region: string;
  lat: number;
  lon: number;
} | null> {
  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,countryCode,city,regionName,lat,lon&lang=en`,
      { signal: AbortSignal.timeout(3000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 'success' || !data.city) return null;

    let lat: number = data.lat;
    let lon: number = data.lon;

    if (lat == null || lon == null) {
      const fallback = countryFallbackCoords(data.countryCode);
      if (!fallback) return null;
      [lat, lon] = fallback;
    }

    return {
      city: data.city,
      country: data.country,
      countryCode: data.countryCode,
      region: data.regionName ?? '',
      lat,
      lon,
    };
  } catch {
    return null;
  }
}

function dailyVisitorHash(ip: string): string {
  const salt = VISITOR_HASH_SALT;
  const date = new Date().toISOString().slice(0, 10);
  return createHash('sha256').update(`${ip}:${date}:${salt}`).digest('hex');
}

function persistentVisitorHash(ip: string): string {
  const salt = VISITOR_HASH_SALT;
  return createHash('sha256').update(`${ip}:${salt}`).digest('hex');
}

const LOCAL_HOST_RE = /^(localhost|127\.0\.0\.1)(:\d+)?$/;

export async function POST(req: NextRequest) {
  const host = req.headers.get('host') ?? '';
  if (LOCAL_HOST_RE.test(host)) return NextResponse.json({ ok: true, geo: null });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { path, locale, newVisitor } = body;

  if (typeof path !== 'string' || !path || path.length > 512) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }
  if (locale !== undefined && (typeof locale !== 'string' || locale.length > 10)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
  }

  const ip = getClientIp(req);
  const visitorHash = ip && !PRIVATE_IP_RE.test(ip) ? persistentVisitorHash(ip) : null;

  const rawReferrer = req.headers.get('referer');
  const referrer = rawReferrer && rawReferrer.length <= 2048 ? rawReferrer : null;
  await supabase.from('page_views').insert({ path, locale: locale ?? null, referrer, visitor_hash: visitorHash });

  let visitorGeo: { city: string; countryCode: string } | null = null;

  if (newVisitor) {
    if (ip && !PRIVATE_IP_RE.test(ip)) {
      const hash = dailyVisitorHash(ip);
      const today = new Date().toISOString().slice(0, 10);

      const { data: existing } = await supabase
        .from('visitor_locations')
        .select('city, country_code')
        .eq('visitor_hash', hash)
        .gte('created_at', `${today}T00:00:00.000Z`)
        .limit(1)
        .maybeSingle();

      if (existing) {
        visitorGeo = { city: existing.city, countryCode: existing.country_code };
      } else {
        const geo = await geolocateIp(ip);
        if (geo) {
          await supabase.from('visitor_locations').insert({
            city: geo.city,
            country: geo.country,
            country_code: geo.countryCode,
            latitude: parseFloat(geo.lat.toFixed(2)),
            longitude: parseFloat(geo.lon.toFixed(2)),
            visitor_hash: hash,
          });
          visitorGeo = { city: geo.city, countryCode: geo.countryCode };
        }
      }
    }
  }

  return NextResponse.json({ ok: true, geo: visitorGeo });
}
