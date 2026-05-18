import SectionHeader from '@/app/admin/_components/SectionHeader';

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
      <div className="mb-7">
        <SectionHeader eyebrow="Metrics" title="Site" accent="Analytics" subtitle="Page views" />
      </div>

      <div
        className="inline-flex flex-col gap-1 px-6 py-4 rounded-[14px] mb-7"
        style={{
          background: 'var(--ds-surface)',
          border: '1px solid var(--ds-surface-high)',
        }}
      >
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.05em]"
          style={{ color: 'var(--ds-outline-variant)' }}
        >
          Total views
        </span>
        <span
          className="text-[32px] font-bold leading-none"
          style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--ds-font-display)' }}
        >
          {total.toLocaleString()}
        </span>
      </div>

      {postHogUrl ? (
        <div className="mb-8 rounded-[14px] overflow-hidden" style={{ border: '1px solid var(--ds-surface-high)' }}>
          <iframe src={postHogUrl} className="w-full h-[600px] border-none block" allowFullScreen />
        </div>
      ) : (
        <div
          className="mb-8 px-5 py-4 rounded-xl text-[13px] leading-[1.6]"
          style={{
            border: '1px dashed var(--ds-surface-high)',
            color: 'var(--ds-outline-variant)',
          }}
        >
          PostHog dashboard not configured. Set{' '}
          <code
            className="px-1.5 py-px rounded"
            style={{ color: 'var(--ds-outline)', background: 'var(--ds-surface-container)' }}
          >
            POSTHOG_DASHBOARD_URL
          </code>{' '}
          in{' '}
          <code
            className="px-1.5 py-px rounded"
            style={{ color: 'var(--ds-outline)', background: 'var(--ds-surface-container)' }}
          >
            .env.local
          </code>
          .
        </div>
      )}

      <div
        className="flex flex-col gap-2.5 px-6 py-5 rounded-[14px]"
        style={{
          background: 'var(--ds-surface)',
          border: '1px solid var(--ds-surface-high)',
        }}
      >
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.05em] mb-1"
          style={{ color: 'var(--ds-outline-variant)' }}
        >
          Top pages
        </span>
        {data.map(({ path, count }) => (
          <div key={path} className="flex items-center gap-3">
            <span
              className="w-[220px] text-[12px] font-mono shrink-0 overflow-hidden text-ellipsis whitespace-nowrap"
              style={{ color: 'var(--ds-outline)' }}
            >
              {path}
            </span>
            <div className="flex-1 rounded h-1.5" style={{ background: 'var(--ds-surface-container)' }}>
              <div
                className="h-full rounded transition-[width] duration-300"
                style={{
                  width: `${(count / max) * 100}%`,
                  background: 'linear-gradient(90deg, var(--ds-primary-container), var(--ds-primary))',
                }}
              />
            </div>
            <span
              className="text-[12px] w-9 text-right shrink-0"
              style={{ color: 'var(--ds-outline-variant)' }}
            >
              {count}
            </span>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-center py-10 m-0" style={{ color: 'var(--ds-outline-variant)' }}>
            No data yet.
          </p>
        )}
      </div>
    </div>
  );
}
