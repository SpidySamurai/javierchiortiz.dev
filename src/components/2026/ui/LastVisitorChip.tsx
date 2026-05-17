'use client';

import useSWR from 'swr';

interface VisitorData {
  visitor: {
    city: string;
    country: string;
    countryCode: string;
  } | null;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function countryFlag(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(c.charCodeAt(0) + 127397));
}

export default function LastVisitorChip() {
  const { data } = useSWR<VisitorData>('/api/last-visitor', fetcher, {
    dedupingInterval: 60_000,
    revalidateOnFocus: false,
  });

  const visitor = data?.visitor;
  if (!visitor) return null;

  return (
    <div
      className="flex items-center gap-1.5 select-none"
      title={`Last visitor from ${visitor.city}, ${visitor.country}`}
    >
      <span aria-hidden="true" className="text-sm leading-none">
        {countryFlag(visitor.countryCode)}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-inter), sans-serif',
          fontSize: '11px',
          color: 'var(--ds-outline)',
        }}
      >
        {visitor.city}, {visitor.country}
      </span>
    </div>
  );
}
