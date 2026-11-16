'use client';

import { useTranslations } from 'next-intl';
import type { JourneyEntry } from '@/data/journey';

interface EntryMessages {
  title: string;
  date: string;
  description: string;
  metric?: string;
}

/** Reads the entry's copy from its messages group. */
export function useEntryMessages(entry: JourneyEntry): EntryMessages {
  const t = useTranslations('common');
  return t.raw(`${entry.group}.${entry.id}`) as EntryMessages;
}

function Description({ text }: { text: string }) {
  const parts = text.split('\n\n');
  return (
    <div className="space-y-2" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      {parts.map((part, i) => (
        <p
          key={i}
          className="text-lg leading-relaxed"
          style={{
            color:
              i === 0
                ? 'var(--ds-on-surface-variant)'
                : 'color-mix(in srgb, var(--ds-on-surface-variant) 80%, transparent)',
          }}
        >
          {part}
        </p>
      ))}
    </div>
  );
}

function EntryTitle({
  url,
  className,
  children,
}: {
  url?: string;
  className: string;
  children: React.ReactNode;
}) {
  const style = { color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' };
  if (!url) {
    return (
      <span className={className} style={style}>
        {children}
      </span>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} hover:text-[var(--ds-primary)] transition-colors`}
      style={style}
    >
      {children}
    </a>
  );
}

function Metric({ text }: { text: string }) {
  return (
    <p
      className="flex items-center gap-2 mb-5 text-xl font-bold"
      style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-manrope), sans-serif' }}
    >
      <span translate="no" aria-hidden className="material-symbols-outlined text-2xl">
        verified
      </span>
      {text}
    </p>
  );
}

interface EntryContentProps {
  entry: JourneyEntry;
}

/** Title, optional metric and description of one journey entry. */
export default function EntryContent({
  entry,
}: EntryContentProps) {
  const item = useEntryMessages(entry);

  return (
    <>
      <EntryTitle
        url={entry.url}
        className="text-4xl md:text-5xl font-black leading-none tracking-tighter block mb-4"
      >
        {item.title}
      </EntryTitle>
      {item.metric && <Metric text={item.metric} />}
      <Description text={item.description} />
    </>
  );
}
