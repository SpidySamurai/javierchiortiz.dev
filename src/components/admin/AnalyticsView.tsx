interface PathCount {
  path: string;
  count: number;
}

export default function AnalyticsView({
  data,
  postHogUrl,
}: {
  data: PathCount[];
  postHogUrl?: string | null;
}) {
  const max = data[0]?.count ?? 1;
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#dae2fd', margin: 0, fontFamily: 'var(--font-manrope, system-ui, sans-serif)' }}>
          Analytics
        </h1>
        <p style={{ color: '#464554', fontSize: 13, margin: '4px 0 0' }}>
          Page views
        </p>
      </div>

      {/* Stat card */}
      <div
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          gap: 4,
          padding: '16px 24px',
          background: '#131b2e',
          border: '1px solid #222a3d',
          borderRadius: 14,
          marginBottom: 28,
        }}
      >
        <span style={{ color: '#464554', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Total views
        </span>
        <span style={{ color: '#dae2fd', fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-manrope, system-ui, sans-serif)', lineHeight: 1 }}>
          {total.toLocaleString()}
        </span>
      </div>

      {/* PostHog iframe or notice */}
      {postHogUrl ? (
        <div style={{ marginBottom: 32, borderRadius: 14, overflow: 'hidden', border: '1px solid #222a3d' }}>
          <iframe src={postHogUrl} style={{ width: '100%', height: 600, border: 'none', display: 'block' }} allowFullScreen />
        </div>
      ) : (
        <div
          style={{
            marginBottom: 32,
            padding: '16px 20px',
            borderRadius: 12,
            border: '1px dashed #222a3d',
            color: '#464554',
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          PostHog dashboard not configured. Set{' '}
          <code style={{ color: '#908fa0', background: '#171f33', padding: '1px 6px', borderRadius: 4 }}>
            POSTHOG_DASHBOARD_URL
          </code>{' '}
          in <code style={{ color: '#908fa0', background: '#171f33', padding: '1px 6px', borderRadius: 4 }}>.env.local</code>.
        </div>
      )}

      {/* Bar chart */}
      <div
        style={{
          background: '#131b2e',
          border: '1px solid #222a3d',
          borderRadius: 14,
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <span style={{ color: '#464554', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
          Top pages
        </span>
        {data.map(({ path, count }) => (
          <div key={path} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                width: 220,
                color: '#908fa0',
                fontSize: 12,
                fontFamily: 'monospace',
                flexShrink: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {path}
            </span>
            <div style={{ flex: 1, background: '#171f33', borderRadius: 4, height: 6 }}>
              <div
                style={{
                  width: `${(count / max) * 100}%`,
                  background: 'linear-gradient(90deg, #8083ff, #c0c1ff)',
                  height: '100%',
                  borderRadius: 4,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <span style={{ color: '#464554', fontSize: 12, width: 36, textAlign: 'right', flexShrink: 0 }}>
              {count}
            </span>
          </div>
        ))}
        {data.length === 0 && (
          <p style={{ color: '#464554', textAlign: 'center', padding: 40, margin: 0 }}>No data yet.</p>
        )}
      </div>
    </div>
  );
}
