'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { useLocale } from 'next-intl';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

export default function VisitorCounter() {
  const locale = useLocale();
  const { data } = useSWR<{ count: number | null }>('/api/visitor-count', fetcher, {
    dedupingInterval: 60_000,
    revalidateOnFocus: false,
  });

  if (!data?.count) return null;

  return (
    <Link
      href={`/${locale}/visitors`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-inter), sans-serif',
        fontSize: '10px',
        color: 'var(--ds-outline)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        textDecoration: 'none',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#8083ff',
          opacity: 0.7,
          flexShrink: 0,
        }}
      />
      {formatCount(data.count)} visitors
    </Link>
  );
}
