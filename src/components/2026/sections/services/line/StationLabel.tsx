import { useTranslations } from 'next-intl';
import { STAGE_ICONS, type Stage } from './stages';

const NAME_KEY: Record<Stage, string> = { plan: 'lbl.planName', build: 'lbl.buildName', launch: 'lbl.launchName' };
const RING_KEY: Record<Stage, string> = { plan: 'lbl.planRing', build: 'lbl.buildRing', launch: 'lbl.launchRing' };

/** Icon, number, name and description of one station. Highlight follows the line frame (data-bind). */
export default function StationLabel({ stage, index }: { stage: Stage; index: number }) {
  const t = useTranslations('common');
  const step = t.raw(`services_process.${stage}`) as { name: string; desc: string };
  return (
    <div className="flex flex-col items-center gap-1.5 text-center px-2">
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'var(--ds-surface-high)' }}
        data-bind={`s.box-shadow:${RING_KEY[stage]}`}
      >
        <span
          translate="no"
          aria-hidden
          className="material-symbols-outlined"
          style={{ fontSize: 22, color: 'var(--ds-primary)' }}
        >
          {STAGE_ICONS[stage]}
        </span>
      </div>
      <span
        className="text-[11px] font-semibold tracking-[0.18em]"
        style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <span
        className="text-[15px] font-extrabold uppercase tracking-[0.08em]"
        style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-manrope), sans-serif', transition: 'color 0.3s' }}
        data-bind={`s.color:${NAME_KEY[stage]}`}
      >
        {step.name}
      </span>
      <p
        className="text-[13px] leading-snug max-w-[240px]"
        style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {step.desc}
      </p>
    </div>
  );
}
