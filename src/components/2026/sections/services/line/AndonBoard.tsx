import type { Labels } from './bind';
import { useGrad } from './SceneDefs';

/**
 * Andon board hanging from the gantry: a status lamp, the iteration counter, the
 * four-step cycle with check marks, a wrapped status line and a progress bar.
 * It is a dark screen in both themes, so its colors are the `screen` tokens.
 */

const s = (name: string) => `var(--ds-scene-${name})`;
const HEAD = { fontFamily: 'var(--font-manrope), sans-serif' } as const;
const BODY = { fontFamily: 'var(--font-inter), sans-serif' } as const;

const STEP_ROWS = [
  { key: 'b', label: 'step.build' },
  { key: 't', label: 'step.test' },
  { key: 'f', label: 'step.feedback' },
  { key: 'i', label: 'step.improve' },
] as const;

function StepRow({ k, label, y, copy }: { k: string; label: string; y: number; copy: Labels }) {
  return (
    <g>
      <circle cx={512} cy={y} r={4.5} fill={s('screen-off')} data-bind={`s.fill:row.${k}.dot,r:row.${k}.r`} />
      <circle cx={512} cy={y} r={9} fill={s('screen-accent')} opacity={0} style={{ filter: 'blur(3px)' }} data-bind={`opacity:row.${k}.glow,s.fill:row.${k}.glowFill`} />
      <path
        d={`M508.5 ${y} L511 ${y + 2.6} L515.6 ${y - 2.6}`} fill="none" stroke={s('screen-pass')} strokeWidth={2}
        strokeLinecap="round" strokeLinejoin="round" opacity={0} data-bind={`opacity:row.${k}.chk`}
      />
      <text
        x={524} y={y} fontSize={13} fontWeight={800} letterSpacing="0.08em" dominantBaseline="central" style={HEAD}
        fill={s('screen-dim')} data-bind={`s.fill:row.${k}.t`}
      >
        {copy[label]}
      </text>
    </g>
  );
}

export function AndonBoard({ copy }: { copy: Labels }) {
  const g = useGrad();
  return (
    <g>
      <rect x={559} y={150} width={4} height={22} fill={s('steel-mid')} />
      <rect x={717} y={150} width={4} height={22} fill={s('steel-mid')} />
      <ellipse cx={640} cy={92} rx={170} ry={74} fill="var(--ds-primary-vivid)" opacity={0.08} style={{ filter: 'blur(18px)' }} data-bind="s.fill:an.lampFill,opacity:an.glow" />
      <rect x={618} y={16} width={44} height={12} rx={4} fill="var(--ds-surface-high)" />
      <rect x={624} y={18} width={32} height={8} rx={3} fill="var(--ds-primary-vivid)" data-bind="s.fill:an.lampFill,opacity:an.lampOp" />
      <rect x={614} y={10} width={52} height={22} rx={10} fill="var(--ds-primary-vivid)" opacity={0.5} style={{ filter: 'blur(7px)' }} data-bind="s.fill:an.lampFill,opacity:an.lampGlow" />
      <rect x={488} y={26} width={304} height={128} rx={12} fill={g('board')} />
      <rect x={496} y={34} width={288} height={112} rx={7} fill={g('glass')} />
      <rect x={496} y={34} width={288} height={2} rx={1} fill="white" opacity={0.06} />
      <g data-bind="opacity:an.body">
        <g transform="translate(508 45) scale(1.15)" fill="none" stroke={s('screen-accent')} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 6 A4 4 0 1 1 8.2 2.7 M8.5 0.8 L8.5 3 L10.7 3" />
        </g>
        <text
          x={528} y={52} fontSize={13} fontWeight={800} letterSpacing="0.14em" dominantBaseline="central" fill={s('screen-muted')}
          style={HEAD} data-bind="text:steps.iter"
        />
        {[0, 1].map((i) => (
          <rect key={i} x={748 + i * 16} y={48} width={12} height={8} rx={3} fill={s('screen-off')} data-bind={`s.fill:pip.${i}`} />
        ))}
        <rect x={506} y={66} width={268} height={2} fill={s('screen-rule')} />
        <rect x={628} y={76} width={2} height={62} fill={s('screen-rule')} />
        {STEP_ROWS.map((r, i) => (
          <StepRow key={r.key} k={r.key} label={r.label} y={84 + i * 18} copy={copy} />
        ))}
        <text
          fontSize={13} fontWeight={600} dominantBaseline="central" data-wrap={18} style={BODY} fill={s('screen-muted')}
          data-bind="wrap:ver.text,s.fill:ver.color,opacity:ver.op"
        >
          <tspan x={640} y={86} />
          <tspan x={640} y={103} />
          <tspan x={640} y={120} />
        </text>
        <rect x={640} y={134} width={132} height={4} rx={2} fill={s('screen-rule')} />
        <rect x={640} y={134} width={0} height={4} rx={2} fill="var(--ds-primary-vivid)" data-bind="width:prog.w,s.fill:prog.fill,opacity:prog.op" />
      </g>
    </g>
  );
}
