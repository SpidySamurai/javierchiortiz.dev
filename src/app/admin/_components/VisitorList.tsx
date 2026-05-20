export interface Visitor {
  city: string;
  country: string;
  country_code: string;
  visited_at: string;
}

function flagEmoji(code: string): string {
  return [...code.toUpperCase()].map(c =>
    String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0))
  ).join('');
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function VisitorList({ data }: { data: Visitor[] }) {
  return (
    <div
      className="flex flex-col px-6 py-5 rounded-[14px]"
      style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-surface-high)' }}
    >
      <span
        className="text-[11px] font-semibold uppercase tracking-[0.05em] mb-3"
        style={{ color: 'var(--ds-outline-variant)' }}
      >
        Recent visitors
      </span>

      {data.map((v, i) => (
        <div
          key={i}
          className="flex items-center gap-3 py-2"
          style={{ borderTop: i > 0 ? '1px solid var(--ds-surface-container)' : undefined }}
        >
          <span className="text-[18px] leading-none w-6 text-center shrink-0">
            {flagEmoji(v.country_code)}
          </span>
          <div className="flex-1 min-w-0">
            <span
              className="text-[13px] font-medium block truncate"
              style={{ color: 'var(--ds-on-surface)' }}
            >
              {v.city}
            </span>
            <span
              className="text-[11px]"
              style={{ color: 'var(--ds-outline)' }}
            >
              {v.country}
            </span>
          </div>
          <span
            className="text-[11px] shrink-0"
            style={{ color: 'var(--ds-outline-variant)' }}
          >
            {relativeTime(v.visited_at)}
          </span>
        </div>
      ))}

      {data.length === 0 && (
        <p className="text-center py-10 m-0" style={{ color: 'var(--ds-outline-variant)' }}>
          No visitors yet.
        </p>
      )}
    </div>
  );
}
