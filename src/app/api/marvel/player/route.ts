import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const uid = searchParams.get('uid');
  // Forward the 'season' param if provided, otherwise the external API likely defaults to latest or we can let it omit.
  // Based on testing, ?season=X is useful. If not provided, we just pass what we get or nothing.
  const season = searchParams.get('season');

  if (!uid || !/^\d+$/.test(uid)) {
    return NextResponse.json({ error: 'Invalid UID' }, { status: 400 });
  }
  if (season && !/^\d{1,3}$/.test(season)) {
    return NextResponse.json({ error: 'Invalid season' }, { status: 400 });
  }

  const apiKey = process.env.MARVEL_RIVALS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Server misconfiguration: API Key missing' },
      { status: 500 }
    );
  }

  const baseUrl = `https://marvelrivalsapi.com/api/v1/player/${uid}`;
  const url = season ? `${baseUrl}?season=${season}` : baseUrl;

  try {
    const res = await fetch(url, {
      headers: {
        'x-api-key': apiKey,
      },
      next: { revalidate: 60 * 5 }, // Cache for 5 minutes to avoid rate limits
    });

    if (!res.ok) {
      if (res.status === 429) {
        return NextResponse.json({ error: 'Rate limited by Marvel Rivals API' }, { status: 429 });
      }
      return NextResponse.json(
        { error: `Upstream error: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Marvel Rivals data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
