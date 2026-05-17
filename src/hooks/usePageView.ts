'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export function usePageView() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, locale }),
    }).catch(() => {});
  }, [pathname, locale]);
}
