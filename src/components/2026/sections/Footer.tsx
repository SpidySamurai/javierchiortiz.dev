'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('common');
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      data-track-section="contact"
      className="py-20 px-8 md:px-16 border-t"
      style={{
        backgroundColor: 'var(--ds-bg)',
        borderColor: 'color-mix(in srgb, var(--ds-outline-variant) 10%, transparent)',
        scrollMarginTop: '5rem',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        {/* Identity */}
        <div className="text-center md:text-left">
          <h2
            className="text-3xl font-extrabold mb-2"
            style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            Javier Chi Ortíz
          </h2>
          <p
            style={{
              color: 'var(--ds-on-surface-variant)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {t('footer_available')}
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-8">
          <a
            href="mailto:javier@javierchiortiz.dev"
            className="text-xs font-bold uppercase tracking-widest transition-colors text-[#c7c4d7] hover:text-[#c0c1ff]"
          >
            Email
          </a>
          <a
            href="https://www.linkedin.com/in/javier-fernando-chi-ortiz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-widest transition-colors text-[#c7c4d7] hover:text-[#c0c1ff]"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/SpidySamurai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-widest transition-colors text-[#c7c4d7] hover:text-[#c0c1ff]"
          >
            GitHub
          </a>
        </div>

        {/* Copyright + Privacy */}
        <div className="flex flex-col items-center md:items-end gap-1">
          <p
            className="text-[10px] uppercase tracking-widest"
            style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif', margin: 0 }}
          >
            © {year} Javier Chi Ortíz
          </p>
          <a
            href="/privacy"
            className="text-[10px] uppercase tracking-widest transition-colors"
            style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif', textDecoration: 'none' }}
          >
            {t('privacy')}
          </a>
        </div>
      </div>
    </footer>
  );
}
