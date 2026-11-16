'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Chip from '@/components/2026/ui/Chip';
import type { JourneyEntry } from '@/data/journey';

const stackVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const, delay: 0.2 } },
};

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

function Metric({ text, alignRight }: { text: string; alignRight: boolean }) {
  return (
    <p
      className={`flex items-center gap-2 mb-5 text-xl font-bold ${alignRight ? 'md:justify-end' : ''}`}
      style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-manrope), sans-serif' }}
    >
      <span translate="no" aria-hidden className="material-symbols-outlined text-2xl">
        verified
      </span>
      {text}
    </p>
  );
}

function StackLine({ stack, label }: { stack: readonly string[]; label: string }) {
  return (
    <motion.p
      variants={stackVariants}
      className="mb-6 text-sm leading-relaxed"
      style={{ fontFamily: 'var(--font-inter), sans-serif', color: 'var(--ds-on-surface-variant)' }}
    >
      <span
        className="text-[10px] uppercase tracking-[0.28em] font-bold mr-3"
        style={{ color: 'var(--ds-primary)' }}
      >
        {label}
      </span>
      {stack.join(' · ')}
    </motion.p>
  );
}

interface EntryContentProps {
  entry: JourneyEntry;
  /** Text aligned to the right on md+ (entries whose text sits left of the center line). */
  alignRight?: boolean;
  /** Highlights the tier tag (the latest entry). */
  isLead?: boolean;
}

/** Tier tag, title, optional metric, stack line and description of one journey entry. */
export default function EntryContent({ entry, alignRight = false, isLead = false }: EntryContentProps) {
  const t = useTranslations('common');
  const item = useEntryMessages(entry);

  return (
    <>
      <Chip variant="tier" active={isLead}>
        {t(entry.tier)}
      </Chip>
      <EntryTitle
        url={entry.url}
        className={`text-4xl md:text-5xl font-black leading-none tracking-tighter block ${
          alignRight ? 'mb-2' : 'mb-4'
        }`}
      >
        {item.title}
      </EntryTitle>
      {item.metric && <Metric text={item.metric} alignRight={alignRight} />}
      {entry.stack.length > 0 && <StackLine stack={entry.stack} label={t('stack')} />}
      <Description text={item.description} />
    </>
  );
}
