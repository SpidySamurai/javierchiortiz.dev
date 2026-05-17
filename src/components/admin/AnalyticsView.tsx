interface PathCount { path: string; count: number; }

export default function AnalyticsView({ data }: { data: PathCount[] }) {
  const max = data[0]?.count ?? 1;
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>Analytics</h1>
        <span style={{ color: '#64748b', fontSize: 14 }}>{total} total views</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map(({ path, count }) => (
          <div key={path} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              width: 240, color: '#94a3b8', fontSize: 13, fontFamily: 'monospace',
              flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {path}
            </span>
            <div style={{ flex: 1, background: '#12121a', borderRadius: 4, height: 8 }}>
              <div style={{
                width: `${(count / max) * 100}%`,
                background: '#c0c1ff', height: '100%', borderRadius: 4,
              }} />
            </div>
            <span style={{ color: '#64748b', fontSize: 13, width: 40, textAlign: 'right', flexShrink: 0 }}>
              {count}
            </span>
          </div>
        ))}
        {data.length === 0 && (
          <p style={{ color: '#475569', textAlign: 'center', padding: 60, margin: 0 }}>No data yet.</p>
        )}
      </div>
    </div>
  );
}
