'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

const LOCALES = ['en', 'es'] as const;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  function handleSelect(next: string) {
    router.replace(pathname, { locale: next as 'en' | 'es' });
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label={t('language_label')}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 flex items-center justify-center rounded-full transition-colors text-[#94a3b8] hover:text-[#c0c1ff]"
      >
        <span className="material-symbols-outlined text-[22px]">translate</span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-28 rounded-lg overflow-hidden shadow-lg z-50"
          style={{
            background: 'var(--ds-surface-high)',
            border: '1px solid color-mix(in srgb, var(--ds-outline-variant) 30%, transparent)',
          }}
        >
          {LOCALES.map((lng) => (
            <button
              key={lng}
              onClick={() => handleSelect(lng)}
              className="w-full px-3 py-2 text-left text-sm transition-colors"
              style={{
                color: locale === lng ? 'var(--ds-primary)' : 'var(--ds-on-surface-variant)',
                fontWeight: locale === lng ? 600 : 400,
                background: locale === lng ? 'color-mix(in srgb, var(--ds-primary) 10%, transparent)' : 'transparent',
              }}
            >
              {lng === 'es' ? t('language_spanish') : t('language_english')}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
