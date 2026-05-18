'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { useTranslations, useLocale } from 'next-intl';
import ReactCountryFlag from 'react-country-flag';
import { useMemo } from 'react';

interface VisitorData {
  visitor: {
    region: string;
    countryCode: string;
  } | null;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function LastVisitorChip() {
  const t = useTranslations('common');
  const locale = useLocale();

  const apiUrl = useMemo(() => {
    try {
      const raw = sessionStorage.getItem('visitor_geo');
      if (!raw) return '/api/last-visitor';
      const geo = JSON.parse(raw) as { city: string; countryCode: string };
      return `/api/last-visitor?city=${encodeURIComponent(geo.city)}&country=${encodeURIComponent(geo.countryCode)}`;
    } catch {
      return '/api/last-visitor';
    }
  }, []);

  const { data } = useSWR<VisitorData>(apiUrl, fetcher, {
    dedupingInterval: 60_000,
    revalidateOnFocus: false,
  });

  const visitor = data?.visitor;
  if (!visitor) return null;

  const countryName = new Intl.DisplayNames([locale], { type: 'region' }).of(visitor.countryCode) ?? visitor.countryCode;
  const location = visitor.region ? `${visitor.region}, ${countryName}` : countryName;

  return (
    <Link
      href={`/${locale}/visitors`}
      className="flex items-center gap-1.5 select-none"
      title={`${t('last_visitor_from')} ${location}`}
      style={{ textDecoration: 'none' }}
    >
      <ReactCountryFlag
        countryCode={visitor.countryCode}
        svg
        aria-hidden="true"
        style={{ width: '1.1em', height: '1.1em' }}
      />
      <span
        style={{
          fontFamily: 'var(--font-inter), sans-serif',
          fontSize: '11px',
          color: 'var(--ds-outline)',
        }}
      >
        {t('last_visitor_from')} {location}
      </span>
    </Link>
  );
}
