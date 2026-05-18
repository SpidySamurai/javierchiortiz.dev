'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export function usePageView() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    const newVisitor = !sessionStorage.getItem('visitor_tracked');
    if (newVisitor) sessionStorage.setItem('visitor_tracked', '1');

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, locale, newVisitor }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.geo && !sessionStorage.getItem('visitor_geo')) {
          sessionStorage.setItem('visitor_geo', JSON.stringify(data.geo));
        }
      })
      .catch(() => {});
  }, [pathname, locale]);
}
