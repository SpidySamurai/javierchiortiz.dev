'use client';

import useSWR from 'swr';
import { useTranslations } from 'next-intl';
import ReactCountryFlag from 'react-country-flag';

interface VisitorData {
  visitor: {
    city: string;
    country: string;
    countryCode: string;
  } | null;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function LastVisitorChip() {
  const t = useTranslations('common');
  const { data } = useSWR<VisitorData>('/api/last-visitor', fetcher, {
    dedupingInterval: 60_000,
    revalidateOnFocus: false,
  });

  const visitor = data?.visitor;
  if (!visitor) return null;

  return (
    <div
      className="flex items-center gap-1.5 select-none"
      title={`${t('last_visitor_from')} ${visitor.city}, ${visitor.country}`}
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
        {t('last_visitor_from')} {visitor.city}, {visitor.country}
      </span>
    </div>
  );
}
