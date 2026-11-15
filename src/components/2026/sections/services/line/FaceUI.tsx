import type { ReactNode } from 'react';
import type { FaceKind, TopKind } from './cubes';

/**
 * Interface drawn on the faces of a module, in a 100 x 100 face space that the cube
 * maps onto the projected face. Each screen has a dim layer and a lit layer that fades
 * in when the module boots (the lit layer's opacity is bound to `litKey`).
 */

const s = (name: string) => `var(--ds-scene-${name})`;
const DIM = { a: s('ui-dim-a'), b: s('ui-dim-b'), acc: s('ui-dim-acc'), ok: s('ui-dim-ok'), w: s('ui-dim-w') };
const LIT = { a: s('ui-lit-a'), b: s('ui-lit-b'), acc: s('screen-warm'), ok: s('screen-pass'), w: s('screen-warm') };
type Pal = typeof DIM;

const BARS: readonly (readonly [number, number])[] = [[18, 16], [31, 28], [44, 20], [57, 36], [70, 26]];

function Bars({ c }: { c: Pal }) {
  return (
    <>
      <rect x={18} y={21} width={30} height={5} rx={2.5} fill={c.b} />
      {BARS.map((b, i) => (
        <rect key={b[0]} x={b[0]} y={66 - b[1]} width={9} height={b[1]} rx={2} fill={i === 3 ? c.ok : c.a} />
      ))}
    </>
  );
}

function Form({ c }: { c: Pal }) {
  return (
    <>
      <rect x={18} y={20} width={32} height={5} rx={2.5} fill={c.a} />
      <rect x={18} y={30} width={64} height={10} rx={3} fill={c.b} />
      <rect x={18} y={44} width={64} height={10} rx={3} fill={c.b} />
      <rect x={50} y={59} width={32} height={10} rx={5} fill={c.acc} />
    </>
  );
}

function Chart({ c }: { c: Pal }) {
  return (
    <>
      <rect x={18} y={20} width={28} height={5} rx={2.5} fill={c.b} />
      <polyline points="18,64 30,52 42,57 55,40 68,46 82,28" fill="none" stroke={c.a} strokeWidth={1.7} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={82} cy={28} r={4} fill={c.ok} />
    </>
  );
}

function Lines({ c }: { c: Pal }) {
  return (
    <>
      <rect x={18} y={20} width={44} height={7} rx={3} fill={c.a} />
      <rect x={18} y={33} width={62} height={5} rx={2.5} fill={c.b} />
      <rect x={18} y={43} width={52} height={5} rx={2.5} fill={c.b} />
      <rect x={18} y={58} width={26} height={9} rx={4.5} fill={c.w} />
    </>
  );
}

function Toggle({ c }: { c: Pal }) {
  return (
    <>
      <rect x={18} y={22} width={40} height={18} rx={9} fill={c.w} />
      <circle cx={49} cy={31} r={7} fill={c.a} />
      <rect x={18} y={50} width={62} height={5} rx={2.5} fill={c.b} />
      <rect x={18} y={60} width={44} height={5} rx={2.5} fill={c.b} />
    </>
  );
}

const SIDE = [0, 1, 2, 3] as const;
function Chip({ c }: { c: Pal }) {
  return (
    <>
      <rect x={34} y={24} width={32} height={40} rx={5} fill={c.b} />
      <rect x={42} y={33} width={16} height={22} rx={3} fill={c.ok} />
      {SIDE.map((i) => (
        <g key={i}>
          <rect x={26} y={28 + i * 9} width={7} height={4} rx={1} fill={c.b} />
          <rect x={67} y={28 + i * 9} width={7} height={4} rx={1} fill={c.b} />
        </g>
      ))}
    </>
  );
}

const SCREENS: Partial<Record<FaceKind, (p: { c: Pal }) => ReactNode>> = {
  bars: Bars, form: Form, chart: Chart, lines: Lines, toggle: Toggle, chip: Chip,
};

function Screen({ kind, litKey }: { kind: FaceKind; litKey: string }) {
  const Draw = SCREENS[kind] as (p: { c: Pal }) => ReactNode;
  return (
    <>
      <rect x={6} y={10} width={88} height={68} rx={10} fill={s('ink')} opacity={0.32} />
      <rect x={9} y={13} width={82} height={62} rx={8} fill={s('glass')} />
      <g><Draw c={DIM} /></g>
      <g opacity={0} data-bind={`opacity:${litKey}`}>
        <rect x={2} y={6} width={96} height={76} rx={12} fill={s('screen-glow')} opacity={0.5} style={{ filter: 'blur(5px)' }} />
        <rect x={9} y={13} width={82} height={62} rx={8} fill={s('screen-lit')} />
        <g><Draw c={LIT} /></g>
      </g>
    </>
  );
}

const LED_SETS: Record<'vents' | 'leds', readonly (readonly [number, number, keyof typeof LIT])[]> = {
  vents: [[82, 26, 'ok']],
  leds: [[22, 27, 'ok'], [36, 27, 'a'], [50, 27, 'acc']],
};

function Panel({ kind, litKey }: { kind: 'vents' | 'leds'; litKey: string }) {
  const slots = kind === 'vents' ? 4 : 2;
  const y0 = kind === 'vents' ? 22 : 46;
  const leds = LED_SETS[kind];
  return (
    <>
      {Array.from({ length: slots }, (_, i) => (
        <rect key={i} x={14} y={y0 + i * 13} width={kind === 'vents' ? 56 : 72} height={6} rx={3} fill={s('ink')} opacity={0.38} />
      ))}
      {leds.map((d) => (
        <circle key={d[0]} cx={d[0]} cy={d[1]} r={4.8} fill={s('ink')} opacity={0.8} />
      ))}
      <g opacity={0} data-bind={`opacity:${litKey}`}>
        {leds.map((d) => (
          <g key={d[0]}>
            <circle cx={d[0]} cy={d[1]} r={9} fill={LIT[d[2]]} opacity={0.5} style={{ filter: 'blur(3px)' }} />
            <circle cx={d[0]} cy={d[1]} r={4.8} fill={LIT[d[2]]} />
          </g>
        ))}
      </g>
    </>
  );
}

/** Side face content: a UI screen or a vents/LED panel. */
export function SideFace({ kind, litKey }: { kind: FaceKind; litKey: string }) {
  return kind === 'vents' || kind === 'leds' ? <Panel kind={kind} litKey={litKey} /> : <Screen kind={kind} litKey={litKey} />;
}

/** Warm feedback band across the top of a side face. */
export function Band() {
  return (
    <>
      <rect x={0} y={0} width={100} height={14} fill="var(--ds-spark)" />
      <rect x={0} y={14} width={100} height={3} fill="color-mix(in srgb, var(--ds-spark) 40%, black)" opacity={0.5} />
    </>
  );
}

/** Top face content: vent slats, a warm dome light, or a plain plate. */
export function TopFace({ kind, litKey }: { kind: TopKind; litKey: string }) {
  if (kind === 'vent') {
    return (
      <>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={24} y={28 + i * 16} width={52} height={7} rx={3.5} fill={s('ink')} opacity={0.22} />
        ))}
      </>
    );
  }
  if (kind === 'dome') {
    return (
      <>
        <circle cx={50} cy={50} r={26} fill={s('ink')} opacity={0.18} />
        <circle cx={50} cy={50} r={20} fill={s('dome')} />
        <g opacity={0} data-bind={`opacity:${litKey}`}>
          <circle cx={50} cy={50} r={30} fill="var(--ds-spark)" opacity={0.6} style={{ filter: 'blur(5px)' }} />
          <circle cx={50} cy={50} r={20} fill="color-mix(in srgb, var(--ds-spark) 70%, white)" />
        </g>
        <circle cx={42} cy={42} r={6} fill="white" opacity={0.75} />
      </>
    );
  }
  return (
    <>
      <rect x={16} y={16} width={68} height={68} rx={12} fill="white" opacity={0.16} />
      <circle cx={50} cy={50} r={9} fill={s('ink')} opacity={0.18} />
    </>
  );
}
