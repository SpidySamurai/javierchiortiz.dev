import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('common');

  return (
    <section className="w-full max-w-screen-xl mx-auto px-6 pt-24 pb-16">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
        {/* Text block */}
        <div className="flex-1 max-w-xl">
          {/* Label */}
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-6"
            style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--ds-font-body)', letterSpacing: '0.1em' }}
          >
            Curator · Developer · Designer
          </p>

          {/* Display headline */}
          <h1
            className="text-5xl lg:text-6xl font-bold leading-tight mb-6"
            style={{
              color: 'var(--ds-on-surface)',
              fontFamily: 'var(--ds-font-display)',
              letterSpacing: '-0.02em',
            }}
          >
            Crafting
            <br />
            <span style={{ color: 'var(--ds-primary)' }}>Digital</span>
            <br />
            Artifacts.
          </h1>

          {/* Tagline */}
          <p
            className="text-base leading-relaxed mb-10 max-w-md"
            style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--ds-font-body)', lineHeight: '1.6' }}
          >
            {t('hero_description')}
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-4">
            <a
              href="#projects"
              className="px-5 py-2.5 rounded-md text-sm font-medium transition-opacity hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, var(--ds-primary), var(--ds-primary-container))',
                color: 'var(--ds-on-primary)',
                fontFamily: 'var(--ds-font-body)',
              }}
            >
              View Projects
            </a>
            <a
              href="#about"
              className="px-5 py-2.5 rounded-md text-sm font-medium transition-colors"
              style={{
                color: 'var(--ds-on-surface-variant)',
                border: '1px solid color-mix(in srgb, var(--ds-outline-variant) 40%, transparent)',
              }}
            >
              About me
            </a>
          </div>
        </div>

        {/* Profile image — placeholder until final asset */}
        <div
          className="w-64 h-80 lg:w-72 lg:h-96 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
          style={{ background: 'var(--ds-surface-container)' }}
          aria-label="Profile image — coming soon"
        >
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--ds-outline)', fontFamily: 'var(--ds-font-body)' }}
          >
            Image pending
          </span>
        </div>
      </div>
    </section>
  );
}
