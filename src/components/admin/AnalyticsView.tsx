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
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>Analytics</h1>
        <span style={{ color: '#64748b', fontSize: 14 }}>{total} total views</span>
      </div>

      {postHogUrl ? (
        <div style={{ marginBottom: 40, borderRadius: 12, overflow: 'hidden', border: '1px solid #1e293b' }}>
          <iframe
            src={postHogUrl}
            style={{ width: '100%', height: 600, border: 'none', display: 'block' }}
            allowFullScreen
          />
        </div>
      ) : (
        <div style={{
          marginBottom: 40, padding: 24, borderRadius: 12,
          border: '1px dashed #1e293b', color: '#475569', fontSize: 13, lineHeight: 1.6,
        }}>
          <strong style={{ color: '#64748b' }}>PostHog dashboard not configured.</strong>
          {' '}PostHog → Dashboards → Share → enable public sharing → copy URL → agrega{' '}
          <code style={{ color: '#94a3b8' }}>POSTHOG_DASHBOARD_URL</code> a{' '}
          <code style={{ color: '#94a3b8' }}>.env.local</code>.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map(({ path, count }) => (
          <div key={path} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                width: 240,
                color: '#94a3b8',
                fontSize: 13,
                fontFamily: 'monospace',
                flexShrink: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {path}
            </span>
            <div style={{ flex: 1, background: '#12121a', borderRadius: 4, height: 8 }}>
              <div
                style={{
                  width: `${(count / max) * 100}%`,
                  background: '#c0c1ff',
                  height: '100%',
                  borderRadius: 4,
                }}
              />
            </div>
            <span
              style={{
                color: '#64748b',
                fontSize: 13,
                width: 40,
                textAlign: 'right',
                flexShrink: 0,
              }}
            >
              {count}
            </span>
          </div>
        ))}
        {data.length === 0 && (
          <p style={{ color: '#475569', textAlign: 'center', padding: 60, margin: 0 }}>
            No data yet.
          </p>
        )}
      </div>
    </div>
  );
}
