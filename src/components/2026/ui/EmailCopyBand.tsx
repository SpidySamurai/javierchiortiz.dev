'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CONTACT_EMAIL } from '@/lib/contact';

const CONFIRM_MS = 2200;

/**
 * Full-width band: the email is revealed letter by letter on hover/focus (a fill
 * rising from the bottom of each glyph) and copied to the clipboard on click.
 * Reduced-motion users get the same states without transitions.
 */
export default function EmailCopyBand() {
  const t = useTranslations('common');
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), CONFIRM_MS);
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={copy}
        data-copied={copied}
        aria-label={`${t('closing_copy_label')}: ${CONTACT_EMAIL}`}
        className="group/band relative w-full overflow-hidden rounded-xl cursor-pointer text-center transition-colors duration-300 motion-reduce:transition-none hover:bg-[color:color-mix(in_srgb,var(--ds-primary)_8%,var(--ds-surface-high))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--ds-primary)]"
        style={{
          backgroundColor: 'var(--ds-surface-high)',
          containerType: 'inline-size',
          padding: '2.25rem 1rem',
        }}
      >
        <span
          aria-hidden
          className="block whitespace-nowrap font-extrabold leading-none"
          style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: 'calc(100cqw / 17)',
            letterSpacing: '-0.03em',
            color: 'var(--ds-outline-variant)',
          }}
        >
          {CONTACT_EMAIL.split('').map((ch, i) => (
            <span
              key={i}
              data-char={ch}
              style={{ '--i': i } as React.CSSProperties}
              className="relative inline-block overflow-hidden pb-[0.12em] after:absolute after:left-0 after:top-0 after:content-[attr(data-char)] after:text-[color:var(--ds-primary)] after:translate-y-full after:transition-transform after:duration-500 after:ease-out after:[transition-delay:calc(var(--i)*22ms)] group-hover/band:after:translate-y-0 group-focus-visible/band:after:translate-y-0 group-data-[copied=true]/band:after:translate-y-0 motion-reduce:after:transition-none"
            >
              {ch}
            </span>
          ))}
        </span>

        <span
          aria-hidden
          className={`absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] transition-opacity duration-300 motion-reduce:transition-none ${
            copied ? 'opacity-0' : 'opacity-100 group-hover/band:opacity-0 group-focus-visible/band:opacity-0'
          }`}
          style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          <span translate="no" className="material-symbols-outlined text-base">
            content_copy
          </span>
          {t('closing_copy_label')}
        </span>

        <span
          aria-hidden
          className={`absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] transition-opacity duration-300 motion-reduce:transition-none ${
            copied ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          <span translate="no" className="material-symbols-outlined text-base">
            check
          </span>
          {t('closing_copied')}
        </span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? t('closing_copied') : ''}
      </span>
    </div>
  );
}
