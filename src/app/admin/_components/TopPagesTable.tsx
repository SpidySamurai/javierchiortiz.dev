export interface TopPage {
  path: string;
  views: number;
  unique_visitors: number;
}

export default function TopPagesTable({ data }: { data: TopPage[] }) {
  const maxViews = data[0]?.views ?? 1;

  return (
    <div
      className="flex flex-col px-6 py-5 rounded-[14px]"
      style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-surface-high)' }}
    >
      <div className="grid grid-cols-[1fr_56px_56px] gap-x-3 mb-3">
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.05em]"
          style={{ color: 'var(--ds-on-surface-variant)' }}
        >
          Page
        </span>
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.05em] text-right"
          style={{ color: 'var(--ds-on-surface-variant)' }}
        >
          Views
        </span>
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.05em] text-right"
          style={{ color: 'var(--ds-on-surface-variant)' }}
        >
          Uniq
        </span>
      </div>

      {data.map(({ path, views, unique_visitors }) => (
        <div key={path} className="grid grid-cols-[1fr_56px_56px] gap-x-3 items-center py-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="text-[12px] font-mono shrink-0 w-[140px] overflow-hidden text-ellipsis whitespace-nowrap"
              style={{ color: 'var(--ds-outline)' }}
            >
              {path}
            </span>
            <div className="flex-1 rounded h-1" style={{ background: 'var(--ds-surface-container)' }}>
              <div
                className="h-full rounded"
                style={{
                  width: `${(views / maxViews) * 100}%`,
                  background: 'linear-gradient(90deg, var(--ds-primary-container), var(--ds-primary))',
                }}
              />
            </div>
          </div>
          <span
            className="text-[12px] text-right"
            style={{ color: 'var(--ds-outline)' }}
          >
            {views.toLocaleString()}
          </span>
          <span
            className="text-[12px] text-right"
            style={{ color: 'var(--ds-outline)' }}
          >
            {unique_visitors.toLocaleString()}
          </span>
        </div>
      ))}

      {data.length === 0 && (
        <p className="text-center py-10 m-0" style={{ color: 'var(--ds-outline-variant)' }}>
          No data yet.
        </p>
      )}
    </div>
  );
}
