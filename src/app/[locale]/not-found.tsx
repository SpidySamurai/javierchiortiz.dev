import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const t = await getTranslations('common');

  return (
    <div
      className="ds-2026"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--ds-bg)',
        padding: '2rem',
        gap: '1.5rem',
        textAlign: 'center',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-manrope), sans-serif',
          fontSize: 'clamp(6rem, 20vw, 12rem)',
          fontWeight: 800,
          lineHeight: 1,
          color: 'var(--ds-primary)',
          opacity: 0.18,
          userSelect: 'none',
          letterSpacing: '-0.04em',
        }}
      >
        404
      </span>

      <div style={{ marginTop: '-3rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--ds-on-surface)',
            margin: 0,
          }}
        >
          {t('not_found_title')}
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: '0.9rem',
            color: 'var(--ds-on-surface-variant)',
            margin: 0,
          }}
        >
          {t('not_found_message')}
        </p>
      </div>

      <Link
        href="/#contact"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.65rem 1.4rem',
          borderRadius: '2rem',
          backgroundColor: 'var(--ds-primary)',
          color: 'var(--ds-on-primary)',
          fontFamily: 'var(--font-manrope), sans-serif',
          fontWeight: 700,
          fontSize: '0.85rem',
          textDecoration: 'none',
        }}
      >
        {t('not_found_cta')}
      </Link>
    </div>
  );
}
