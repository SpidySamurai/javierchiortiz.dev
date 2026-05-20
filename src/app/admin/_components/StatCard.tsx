interface StatCardProps {
  label: string;
  primary: string | number;
  secondary?: string;
}

export default function StatCard({ label, primary, secondary }: StatCardProps) {
  return (
    <div
      className="flex flex-col gap-1 px-5 py-4 rounded-[14px]"
      style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-surface-high)' }}
    >
      <span
        className="text-[11px] font-semibold uppercase tracking-[0.05em]"
        style={{ color: 'var(--ds-on-surface-variant)' }}
      >
        {label}
      </span>
      <span
        className="text-[28px] font-bold leading-none"
        style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope)' }}
      >
        {typeof primary === 'number' ? primary.toLocaleString() : primary}
      </span>
      {secondary && (
        <span className="text-[12px] mt-0.5" style={{ color: 'var(--ds-outline)' }}>
          {secondary}
        </span>
      )}
    </div>
  );
}
