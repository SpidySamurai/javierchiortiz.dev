import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0b1326',
        padding: '2rem',
        gap: '1.5rem',
        textAlign: 'center',
      }}
    >
      <span
        style={{
          fontFamily: 'sans-serif',
          fontSize: 'clamp(6rem, 20vw, 12rem)',
          fontWeight: 800,
          lineHeight: 1,
          color: '#c0c1ff',
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
            fontFamily: 'sans-serif',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#dae2fd',
            margin: 0,
          }}
        >
          404 — Unexecuted idea.
        </h1>
        <p style={{ fontFamily: 'sans-serif', fontSize: '0.9rem', color: '#c7c4d7', margin: 0 }}>
          The best ideas start without a URL. Tell me yours.
        </p>
      </div>

      <Link
        href="/#contact"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.65rem 1.4rem',
          borderRadius: '2rem',
          backgroundColor: '#c0c1ff',
          color: '#1000a9',
          fontFamily: 'sans-serif',
          fontWeight: 700,
          fontSize: '0.85rem',
          textDecoration: 'none',
        }}
      >
        Let&apos;s talk →
      </Link>
    </div>
  );
}
