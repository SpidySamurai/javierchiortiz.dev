import type { ReactNode } from 'react';

interface ChipProps {
  variant: 'category' | 'tech' | 'tier' | 'outline';
  size?: 'sm' | 'md';
  active?: boolean;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

export default function Chip({
  variant,
  size = 'md',
  active = false,
  icon,
  className = '',
  children,
}: ChipProps) {
  const base = 'inline-flex items-center gap-1.5 font-bold uppercase tracking-widest border rounded-full';

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-4 py-1 text-[10px]';

  const styles: Record<string, React.CSSProperties> = {
    category: {
      backgroundColor: 'var(--ds-secondary-container)',
      color: 'var(--ds-on-secondary)',
      borderColor: 'transparent',
      borderRadius: '9999px',
    },
    tech: {
      color: 'color-mix(in srgb, var(--ds-on-surface-variant) 70%, transparent)',
      borderColor: 'color-mix(in srgb, var(--ds-outline-variant) 30%, transparent)',
      backgroundColor: 'transparent',
      fontFamily: 'var(--font-inter), sans-serif',
      fontSize: '9px',
      borderRadius: '4px',
      padding: '2px 12px',
    },
    tier: {
      color: active ? 'var(--ds-primary)' : 'var(--ds-outline)',
      backgroundColor: active
        ? 'color-mix(in srgb, var(--ds-primary) 10%, transparent)'
        : 'color-mix(in srgb, var(--ds-outline) 8%, transparent)',
      borderColor: active
        ? 'color-mix(in srgb, var(--ds-primary) 20%, transparent)'
        : 'color-mix(in srgb, var(--ds-outline) 15%, transparent)',
      borderRadius: '9999px',
      marginBottom: '1rem',
    },
    outline: {
      color: 'var(--ds-outline)',
      borderColor: 'color-mix(in srgb, var(--ds-outline-variant) 30%, transparent)',
      backgroundColor: 'transparent',
      fontFamily: 'var(--font-inter), sans-serif',
      borderRadius: '4px',
    },
  };

  return (
    <span
      className={`${base} ${variant !== 'tech' && variant !== 'outline' ? sizeClass : ''} ${className}`}
      style={styles[variant]}
    >
      {icon && icon}
      {children}
    </span>
  );
}
