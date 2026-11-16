import { ResponsiveLoop } from '@/components/2026/ui/ResponsiveLoop';
import type { LoopSources } from '@/types';

const FONT_BODY = 'var(--font-inter), sans-serif';
const FONT_HEAD = 'var(--font-manrope), sans-serif';
const HAIRLINE = 'color-mix(in srgb, var(--ds-on-surface) 7%, transparent)';

/** A work entry with its copy already translated. */
export interface WorkRowCopy {
  title: string;
  kind: string;
  description: string;
  metric?: string;
  /** Label and value pairs shown as a definition list. */
  facts: [string, string][];
  liveLabel: string;
  liveAria: string;
}

/**
 * One row of the Work list: the story on the left (text first on a phone), the project's loop on
 * the right, top-aligned. Rows are separated by a hairline, never a border.
 */
export function WorkRow({
  index,
  copy,
  liveUrl,
  loop,
}: {
  index: number;
  copy: WorkRowCopy;
  liveUrl: string;
  loop: LoopSources;
}) {
  return (
    <li
      className="grid gap-8 lg:gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] py-12"
      style={{ boxShadow: `0 1px 0 ${HAIRLINE}` }}
    >
      <div className="min-w-0 flex gap-5 md:gap-8">
        <span
          aria-hidden
          className="text-sm font-bold tabular-nums pt-1"
          style={{ color: 'var(--ds-outline)', fontFamily: FONT_HEAD }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <span
            className="text-[11px] uppercase tracking-[0.2em] font-bold"
            style={{ color: 'var(--ds-primary)', fontFamily: FONT_BODY }}
          >
            {copy.kind}
          </span>
          <h2
            className="mt-2 text-2xl md:text-3xl font-extrabold leading-tight tracking-[-0.01em]"
            style={{ color: 'var(--ds-on-surface)', fontFamily: FONT_HEAD }}
          >
            {copy.title}
          </h2>
          <p
            className="mt-3 text-[15px] leading-[1.6] max-w-xl"
            style={{ color: 'var(--ds-on-surface-variant)', fontFamily: FONT_BODY }}
          >
            {copy.description}
          </p>
          {copy.metric && (
            <p
              className="mt-5 text-lg md:text-xl font-extrabold leading-snug"
              style={{ color: 'var(--ds-primary)', fontFamily: FONT_HEAD }}
            >
              {copy.metric}
            </p>
          )}
          <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 max-w-xl">
            {copy.facts.map(([label, value]) => (
              <div key={label}>
                <dt
                  className="text-[11px] uppercase tracking-[0.18em] font-bold"
                  style={{ color: 'var(--ds-outline)', fontFamily: FONT_BODY }}
                >
                  {label}
                </dt>
                <dd
                  className="mt-1 text-sm"
                  style={{ color: 'var(--ds-on-surface)', fontFamily: FONT_BODY }}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={copy.liveAria}
            className="group mt-7 inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.06em] rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:[outline-color:var(--ds-primary)]"
            style={{ color: 'var(--ds-primary)', fontFamily: FONT_HEAD }}
          >
            {copy.liveLabel}
            <span
              translate="no"
              aria-hidden
              className="material-symbols-outlined text-base inline-block transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
            >
              arrow_outward
            </span>
          </a>
        </div>
      </div>

      <ResponsiveLoop
        sources={loop}
        label={copy.title}
        className="aspect-[4/5] sm:aspect-video w-full rounded-[8px]! lg:self-start"
      />
    </li>
  );
}
