import { useTranslations } from 'next-intl';

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/javierchiortiz' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/javierchiortiz' },
] as const;

export default function Footer() {
  const t = useTranslations('common');
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full px-6 py-10"
      style={{ borderTop: '1px solid color-mix(in srgb, var(--ds-outline-variant) 20%, transparent)' }}
    >
      <div className="w-full max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p
          className="text-sm"
          style={{ color: 'var(--ds-outline)', fontFamily: 'var(--ds-font-body)' }}
        >
          © {year} Javier Chi Ortíz — {t('footer_rights')}
        </p>

        <div className="flex items-center gap-6">
          {SOCIAL_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors hover:opacity-80"
              style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--ds-font-body)' }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
