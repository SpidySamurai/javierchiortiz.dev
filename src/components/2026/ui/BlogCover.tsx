interface BlogCoverProps {
  theme: 'pilots' | 'spiderman';
  height?: string;
}

export default function BlogCover({ theme, height = '200px' }: BlogCoverProps) {
  if (theme === 'pilots') {
    return (
      <div
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{
          height,
          background: 'radial-gradient(ellipse at 85% 15%, rgba(180,0,0,0.18) 0%, transparent 55%), #0a0a0a',
        }}
      >
        {/* Faint |-/ symbol */}
        <span
          className="select-none pointer-events-none absolute"
          style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: 'clamp(80px, 18vw, 160px)',
            fontWeight: 900,
            color: '#ffffff',
            opacity: 0.05,
            letterSpacing: '-0.04em',
            userSelect: 'none',
          }}
        >
          |-/
        </span>
        {/* Accent line */}
        <div
          className="absolute top-0 right-0 w-1"
          style={{
            height: '100%',
            background: 'linear-gradient(to bottom, #b00000 0%, transparent 70%)',
            opacity: 0.6,
          }}
        />
        {/* Small |-/ label */}
        <span
          className="relative z-10 font-black tracking-widest"
          style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.2em',
          }}
        >
          |-/
        </span>
      </div>
    );
  }

  // spiderman theme
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height,
        background: 'radial-gradient(ellipse at 30% 60%, rgba(180,0,0,0.2) 0%, transparent 55%), #0d0d1a',
      }}
    >
      {/* Diagonal red accent */}
      <div
        className="absolute"
        style={{
          width: '200%',
          height: '3px',
          background: 'linear-gradient(90deg, transparent 0%, #cc0000 40%, transparent 100%)',
          top: '38%',
          left: '-50%',
          transform: 'rotate(-12deg)',
          opacity: 0.5,
        }}
      />
      <div
        className="absolute"
        style={{
          width: '200%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, #1a44cc 50%, transparent 100%)',
          top: '55%',
          left: '-50%',
          transform: 'rotate(-12deg)',
          opacity: 0.35,
        }}
      />
      {/* Subtle web radial */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 70% 30%, rgba(26, 68, 204, 0.12) 0%, transparent 60%)',
        }}
      />
      {/* Spider icon hint */}
      <div
        className="absolute inset-0 flex items-center justify-center"
      >
        <span
          className="material-symbols-outlined select-none pointer-events-none"
          style={{
            fontSize: 'clamp(56px, 12vw, 96px)',
            color: '#ffffff',
            opacity: 0.04,
          }}
        >
          bug_report
        </span>
      </div>
    </div>
  );
}
