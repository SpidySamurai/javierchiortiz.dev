import Image from 'next/image';

interface BlogCoverProps {
  theme: 'pilots' | 'spiderman' | 'karate';
  height?: string;
}

const BELT_COLORS = [
  { color: '#f8f8f8', label: 'white' },
  { color: '#f5d800', label: 'yellow' },
  { color: '#f08000', label: 'orange' },
  { color: '#1a8a2e', label: 'green' },
  { color: '#1040b8', label: 'blue' },
  { color: '#8a1010', label: 'red' },
  { color: '#111111', label: 'black' },
];

export default function BlogCover({ theme, height = '200px' }: BlogCoverProps) {
  if (theme === 'karate') {
    return (
      <div
        className="relative w-full overflow-hidden flex flex-col"
        style={{ height, background: 'var(--ds-bg)' }}
      >
        {/* Belt stripes — fills the full height */}
        <div className="absolute inset-0 flex flex-col">
          {BELT_COLORS.map(({ color, label }) => (
            <div
              key={label}
              className="flex-1 relative"
              style={{ background: color, opacity: 0.82 }}
            >
              {/* Subtle grain texture per stripe */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(0,0,0,0.18) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.18) 100%)',
                }}
              />
            </div>
          ))}
        </div>
        {/* Strong dark vignette overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, color-mix(in srgb, var(--ds-bg) 55%, transparent) 0%, color-mix(in srgb, var(--ds-bg) 10%, transparent) 40%, color-mix(in srgb, var(--ds-bg) 10%, transparent) 60%, color-mix(in srgb, var(--ds-bg) 75%, transparent) 100%)',
          }}
        />
        {/* Center line — the knot */}
        <div
          className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2"
          style={{ width: 3, background: 'rgba(255,255,255,0.08)' }}
        />
      </div>
    );
  }

  if (theme === 'pilots') {
    return (
      <div className="relative w-full overflow-hidden" style={{ height }}>
        <Image
          src="/blog/top-live-ao-arena.webp"
          alt="Twenty One Pilots live at AO Arena Manchester, May 2025"
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, color-mix(in srgb, var(--ds-bg) 70%, transparent) 0%, color-mix(in srgb, var(--ds-bg) 20%, transparent) 60%, transparent 100%)',
          }}
        />
        {/* Photo credit */}
        <span
          className="absolute bottom-2 right-3 text-[9px] select-none pointer-events-none"
          style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--font-inter), sans-serif', opacity: 0.5 }}
        >
          © Chris Bethell
        </span>
      </div>
    );
  }

  // spiderman theme
  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      <Image
        src="/blog/spiderman-cover.jpg"
        alt="Spider-Man — Peter Parker"
        fill
        className="object-cover object-center"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, color-mix(in srgb, var(--ds-bg) 75%, transparent) 0%, color-mix(in srgb, var(--ds-bg) 20%, transparent) 60%, transparent 100%)',
        }}
      />
    </div>
  );
}
