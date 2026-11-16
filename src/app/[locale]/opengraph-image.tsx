import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';

export const runtime = 'edge';
export const alt =
  'Javier Chi · Software that scales: 6+ years shipping SaaS platforms and AI automations · javierchiortiz.dev';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// 2026 design tokens (src/app/globals.css, .ds-2026)
const BG = '#0b1326';
const ON_SURFACE = '#dae2fd';
const ON_SURFACE_VARIANT = '#c7c4d7';
const PRIMARY = '#c0c1ff';
const PRIMARY_CONTAINER = '#8083ff';
const PRIMARY_VIVID = '#6d6dff';

// Latin subsets of Manrope 800 and Inter 400 (SIL OFL), the 2026 heading and body fonts.
const manropeFont = () =>
  fetch(new URL('../../../public/og/Manrope-ExtraBold.ttf', import.meta.url)).then((res) =>
    res.arrayBuffer()
  );
const interFont = () =>
  fetch(new URL('../../../public/og/Inter-Regular.ttf', import.meta.url)).then((res) =>
    res.arrayBuffer()
  );

const STARS: Array<[number, number, number, number]> = [
  [760, 70, 1.6, 0.6],
  [842, 132, 1.1, 0.4],
  [968, 58, 1.4, 0.5],
  [1092, 104, 1.8, 0.7],
  [1150, 196, 1.1, 0.4],
  [1032, 210, 1.2, 0.35],
  [880, 236, 1.5, 0.5],
  [1124, 300, 1.3, 0.45],
  [732, 300, 1.1, 0.35],
  [1180, 40, 1.2, 0.5],
];

// Satellites sit on the orbit (parametric angles of the ellipse, before rotation).
const SATELLITES = [200, 290, 20];

const ORBIT = { cx: 930, cy: 400, rx: 250, ry: 64, rotate: -10 };

// An echo of the hero: a planet horizon with an atmosphere glow and one tilted orbit.
function heroVisual(): string {
  const stars = STARS.map(
    ([x, y, r, o]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${PRIMARY}" fill-opacity="${o}"/>`
  ).join('');

  const satellites = SATELLITES.map((deg) => {
    const t = (deg * Math.PI) / 180;
    const x = ORBIT.cx + ORBIT.rx * Math.cos(t);
    const y = ORBIT.cy + ORBIT.ry * Math.sin(t);
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
      <circle r="9" fill="${PRIMARY_CONTAINER}" fill-opacity="0.25" filter="url(#soft)"/>
      <rect x="-11" y="-2.5" width="8" height="5" rx="1" fill="${PRIMARY_VIVID}"/>
      <rect x="3" y="-2.5" width="8" height="5" rx="1" fill="${PRIMARY_VIVID}"/>
      <rect x="-3" y="-3" width="6" height="6" rx="1.5" fill="${ON_SURFACE}"/>
    </g>`;
  }).join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <radialGradient id="planet" cx="0.5" cy="0" r="0.75">
        <stop offset="0" stop-color="#1c2550"/>
        <stop offset="0.45" stop-color="#121a36"/>
        <stop offset="1" stop-color="${BG}"/>
      </radialGradient>
      <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${PRIMARY}" stop-opacity="0"/>
        <stop offset="0.35" stop-color="${PRIMARY}" stop-opacity="0.9"/>
        <stop offset="1" stop-color="${PRIMARY}" stop-opacity="0.6"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="18"/></filter>
      <filter id="soft" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4"/></filter>
    </defs>
    ${stars}
    <circle cx="1010" cy="1110" r="640" fill="none" stroke="${PRIMARY_CONTAINER}" stroke-opacity="0.55" stroke-width="26" filter="url(#glow)"/>
    <circle cx="1010" cy="1110" r="640" fill="url(#planet)"/>
    <circle cx="1010" cy="1110" r="640" fill="none" stroke="url(#rim)" stroke-width="2"/>
    <g transform="rotate(${ORBIT.rotate} ${ORBIT.cx} ${ORBIT.cy})">
      <ellipse cx="${ORBIT.cx}" cy="${ORBIT.cy}" rx="${ORBIT.rx}" ry="${ORBIT.ry}" fill="none" stroke="${PRIMARY}" stroke-opacity="0.35" stroke-width="1.5"/>
      ${satellites}
    </g>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  const [manrope, inter] = await Promise.all([manropeFont(), interFont()]);

  // The hero's long description ends with the current role; the card keeps its first sentence.
  const description = `${t('hero_description_long').split('. ')[0].replace(/\.$/, '')}.`;

  return new ImageResponse(
    (
      <div
        style={{
          background: BG,
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          fontFamily: 'Inter',
        }}
      >
        <img
          src={heroVisual()}
          alt=""
          width={1200}
          height={630}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 0 0 84px',
            width: 700,
            height: '100%',
          }}
        >
          <div
            style={{
              fontFamily: 'Manrope',
              fontWeight: 800,
              fontSize: 112,
              lineHeight: 1,
              letterSpacing: '-0.035em',
              color: ON_SURFACE,
            }}
          >
            Javier Chi
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              marginTop: 22,
              fontFamily: 'Manrope',
              fontWeight: 800,
              fontSize: 62,
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              color: ON_SURFACE,
            }}
          >
            <span style={{ marginRight: 16, flexShrink: 0, whiteSpace: 'nowrap' }}>
              {t('hero_headline_pre').trim()}
            </span>
            <span style={{ color: PRIMARY_VIVID, flexShrink: 0, transform: 'skewX(-10deg)' }}>
              {t('hero_headline_accent')}
            </span>
            <span style={{ flexShrink: 0, marginLeft: -6 }}>{t('hero_headline_post')}</span>
          </div>

          <div
            style={{
              marginTop: 30,
              fontSize: 27,
              lineHeight: 1.45,
              color: ON_SURFACE_VARIANT,
              maxWidth: 580,
            }}
          >
            {description}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginTop: 44 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 10,
                background: PRIMARY_VIVID,
                marginRight: 14,
              }}
            />
            <div style={{ fontSize: 24, letterSpacing: '0.04em', color: PRIMARY }}>
              javierchiortiz.dev
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Manrope', data: manrope, weight: 800, style: 'normal' },
        { name: 'Inter', data: inter, weight: 400, style: 'normal' },
      ],
    }
  );
}
