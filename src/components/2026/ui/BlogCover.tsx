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
        style={{ height, background: '#0a0808' }}
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
              'linear-gradient(to bottom, rgba(8,8,8,0.55) 0%, rgba(8,8,8,0.1) 40%, rgba(8,8,8,0.1) 60%, rgba(8,8,8,0.75) 100%)',
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
              'linear-gradient(to top, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.2) 60%, transparent 100%)',
          }}
        />
        {/* Photo credit */}
        <span
          className="absolute bottom-2 right-3 text-[9px] select-none pointer-events-none"
          style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-inter), sans-serif' }}
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
            'linear-gradient(to top, rgba(13,12,20,0.75) 0%, rgba(13,12,20,0.2) 60%, transparent 100%)',
        }}
      />
    </div>
  );
}
