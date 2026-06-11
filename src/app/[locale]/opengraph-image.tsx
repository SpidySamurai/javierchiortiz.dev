import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';

export const runtime = 'edge';
export const alt = 'Javier Chi — Full Stack Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0b1326',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 96px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(99,102,241,0.12)',
            filter: 'blur(80px)',
          }}
        />

        {/* Label */}
        <p
          style={{
            color: '#6366f1',
            fontSize: 16,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: 24,
            fontWeight: 700,
          }}
        >
          {t('about_label')}
        </p>

        {/* Name */}
        <h1
          style={{
            color: '#f1f5f9',
            fontSize: 88,
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: 20,
            letterSpacing: '-0.02em',
          }}
        >
          Javier Chi
        </h1>

        {/* Title */}
        <p
          style={{
            color: '#c0c1ff',
            fontSize: 32,
            fontWeight: 600,
            marginBottom: 40,
          }}
        >
          {t('hero_subtitle')}
        </p>

        {/* Description */}
        <p
          style={{
            color: '#64748b',
            fontSize: 20,
            lineHeight: 1.5,
            maxWidth: 700,
          }}
        >
          {t('hero_description')}
        </p>

        {/* Bottom line */}
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: 96,
            right: 96,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p style={{ color: '#334155', fontSize: 14, letterSpacing: '0.2em' }}>
            javierchiortiz.dev
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            {['React', 'Next.js', 'TypeScript', 'NestJS'].map((tech) => (
              <span
                key={tech}
                style={{
                  color: '#475569',
                  fontSize: 13,
                  border: '1px solid #1e293b',
                  borderRadius: 6,
                  padding: '4px 10px',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
