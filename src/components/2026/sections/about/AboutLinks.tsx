import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:[outline-color:var(--ds-primary)]';

const SOCIAL_LINKS = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/javier-fernando-chi-ortiz/', Icon: FaLinkedin },
  { name: 'GitHub', href: 'https://github.com/SpidySamurai', Icon: FaGithub },
] as const;

/** Journey button (outlined) followed by two quieter text links to the profiles. */
export default function AboutLinks() {
  const t = useTranslations('common');
  const locale = useLocale();

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-8">
      <Link
        href={`/${locale}/experience`}
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-colors hover:bg-[color-mix(in_srgb,var(--ds-primary)_10%,transparent)] ${FOCUS}`}
        style={{
          color: 'var(--ds-primary)',
          boxShadow: 'inset 0 0 0 1.5px color-mix(in srgb, var(--ds-primary) 55%, transparent)',
          fontFamily: 'var(--font-manrope), sans-serif',
        }}
      >
        <span translate="no" aria-hidden className="material-symbols-outlined text-lg">
          timeline
        </span>
        {t('about_journey_cta')}
      </Link>
      {SOCIAL_LINKS.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 rounded text-sm font-medium transition-colors hover:text-[color:var(--ds-on-surface)] ${FOCUS}`}
          style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          <Icon size={15} aria-hidden="true" />
          {name}
        </a>
      ))}
    </div>
  );
}
