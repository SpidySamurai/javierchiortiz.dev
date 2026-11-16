import { createContext, useContext } from 'react';
import type { Tone } from './cubes';

/**
 * Gradients of the scene. Ids are prefixed per scene instance (the desktop scene and the
 * three reduced-motion panels coexist on the page), and every stop color is a DS token.
 */

const SceneId = createContext('ln');
export const SceneIdProvider = SceneId.Provider;

/** `url(#...)` reference to one of this instance's gradients. */
export function useGrad(): (name: string) => string {
  const id = useContext(SceneId);
  return (name) => `url(#${id}-${name})`;
}

const v = (name: string) => `var(--ds-scene-${name})`;
/** Darker end of a face gradient: the face token mixed toward black. */
const shade = (name: string, pct: number) => `color-mix(in srgb, var(--ds-scene-${name}) ${100 - pct}%, black)`;

export const TONES: readonly Tone[] = ['base', 'nova', 'evo', 'steel'];
/** How much darker the bottom of each face gradient is, per face. */
const FACE_SHADE = { top: 16, right: 28, left: 34 } as const;

type Stop = readonly [offset: number, color: string, opacity?: number];

function Linear({ id, stops, x2 = 0, y2 = 1 }: { id: string; stops: readonly Stop[]; x2?: number; y2?: number }) {
  return (
    <linearGradient id={id} x1={0} y1={0} x2={x2} y2={y2}>
      {stops.map(([o, c, op]) => (
        <stop key={o} offset={o} stopColor={c} stopOpacity={op ?? 1} />
      ))}
    </linearGradient>
  );
}

function Radial({ id, color, opacity }: { id: string; color: string; opacity: number }) {
  return (
    <radialGradient id={id}>
      <stop offset={0} stopColor={color} stopOpacity={opacity} />
      <stop offset={1} stopColor={color} stopOpacity={0} />
    </radialGradient>
  );
}

export function SceneDefs({ id }: { id: string }) {
  const q = (name: string) => `${id}-${name}`;
  const spark = 'var(--ds-spark)';
  const vivid = 'var(--ds-primary-container)';
  return (
    <defs>
      <Linear id={q('wall')} stops={[[0, v('wall-a')], [1, v('wall-b')]]} />
      <Linear id={q('floor')} stops={[[0, v('floor-a')], [1, v('floor-b')]]} />
      <Linear id={q('beltTop')} stops={[[0, v('belt-top-a')], [1, v('belt-top-b')]]} />
      <Linear id={q('beltFront')} stops={[[0, v('belt-front-a')], [1, v('belt-front-b')]]} />
      <Linear id={q('steelV')} stops={[[0, v('steel-hi')], [1, v('steel-lo')]]} />
      <Linear id={q('steelH')} stops={[[0, v('steel-hi')], [1, v('steel-lo')]]} x2={1} y2={0} />
      <Linear id={q('armU')} stops={[[0, v('steel-bright')], [0.45, `color-mix(in srgb, ${v('steel-bright')} 45%, ${v('steel-mid')})`], [1, v('steel-mid')]]} />
      {/* Foreground tones for the arm and column in front of the belt */}
      <Linear id={q('armF')} stops={[[0, v('fg-arm-hi')], [0.4, v('fg-arm-mid')], [1, v('fg-arm-lo')]]} />
      <Linear id={q('steelF')} stops={[[0, v('fg-steel-hi')], [0.55, v('fg-steel-mid')], [1, v('fg-steel-lo')]]} x2={1} y2={0} />
      <Linear id={q('board')} stops={[[0, v('steel-mid')], [1, v('steel-shade')]]} />
      <Linear id={q('glass')} stops={[[0, v('glass-hi')], [1, v('glass')]]} />
      <Linear id={q('coneV')} stops={[[0, vivid, 0.26], [1, vivid, 0]]} />
      <Linear id={q('coneW')} stops={[[0, spark, 0.22], [1, spark, 0]]} />
      <Linear id={q('plume')} stops={[[0, v('hot')], [0.25, spark], [1, spark, 0]]} />
      <Linear id={q('scan')} stops={[[0, vivid, 0], [1, vivid, 0.4]]} />
      <Radial id={q('poolV')} color="var(--ds-primary-vivid)" opacity={0.55} />
      <Radial id={q('poolW')} color={spark} opacity={0.5} />
      {TONES.map((t) => (
        <g key={t}>
          <Linear id={q(`t-${t}`)} x2={1} y2={1} stops={[[0, v(`tone-${t}-top`)], [1, shade(`tone-${t}-top`, FACE_SHADE.top)]]} />
          <Linear id={q(`r-${t}`)} stops={[[0, v(`tone-${t}-right`)], [1, shade(`tone-${t}-right`, FACE_SHADE.right)]]} />
          <Linear id={q(`l-${t}`)} stops={[[0, v(`tone-${t}-left`)], [1, shade(`tone-${t}-left`, FACE_SHADE.left)]]} />
        </g>
      ))}
    </defs>
  );
}

/** Face fills of a tone, as `url(#...)` references. */
export function useTone(tone: Tone) {
  const g = useGrad();
  return { top: g(`t-${tone}`), right: g(`r-${tone}`), left: g(`l-${tone}`), edge: v(`tone-${tone}-edge`) };
}
