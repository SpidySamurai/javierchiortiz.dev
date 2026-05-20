'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function BackBreadcrumb() {
  const locale = useLocale();
  return (
    <div className="px-8 lg:px-20 pt-8 pb-2">
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-70"
        style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        <span translate="no" className="material-symbols-outlined" style={{ fontSize: 14 }}>
          arrow_back
        </span>
        Portfolio
      </Link>
    </div>
  );
}
