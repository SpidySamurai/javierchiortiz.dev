import Navbar from './Navbar';

export default function Header() {
  return (
    <header
      className="sticky top-0 z-40 w-full px-6"
      style={{
        background: 'color-mix(in srgb, var(--ds-surface-bright) 60%, transparent)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid color-mix(in srgb, var(--ds-outline-variant) 15%, transparent)',
      }}
    >
      <div className="w-full max-w-screen-xl mx-auto flex items-center justify-between h-16">
        {/* Logo / wordmark */}
        <a
          href="#"
          className="text-sm font-semibold tracking-tight"
          style={{ color: 'var(--ds-primary)', fontFamily: 'var(--ds-font-display)' }}
        >
          jco.
        </a>

        <Navbar />
      </div>
    </header>
  );
}
