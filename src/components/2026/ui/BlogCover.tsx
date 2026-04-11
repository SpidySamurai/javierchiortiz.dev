import Image from 'next/image';

interface BlogCoverProps {
  theme: 'pilots' | 'spiderman';
  height?: string;
}

export default function BlogCover({ theme, height = '200px' }: BlogCoverProps) {
  if (theme === 'pilots') {
    return (
      <div
        className="relative w-full overflow-hidden"
        style={{ height }}
      >
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
          style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.2) 60%, transparent 100%)' }}
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
        style={{ background: 'linear-gradient(to top, rgba(13,12,20,0.75) 0%, rgba(13,12,20,0.2) 60%, transparent 100%)' }}
      />
    </div>
  );
}
