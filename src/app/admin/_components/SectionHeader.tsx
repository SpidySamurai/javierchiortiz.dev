interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  accent: string;
  subtitle?: string;
}

export default function SectionHeader({ eyebrow, title, accent, subtitle }: SectionHeaderProps) {
  return (
    <div>
      <span
        className="text-[10px] font-bold uppercase tracking-[0.25em] block mb-1"
        style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {eyebrow}
      </span>
      <h1
        className="text-2xl font-black uppercase tracking-tighter m-0"
        style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--ds-font-display)' }}
      >
        {title}{' '}
        <em style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>{accent}</em>
      </h1>
      {subtitle && (
        <p className="text-[13px] mt-1 mb-0" style={{ color: 'var(--ds-outline-variant)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
