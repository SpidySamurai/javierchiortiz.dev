import { cubicBezier, useTransform, type MotionValue } from 'framer-motion';

/** One cycle, in seconds. Every visual is a pure function of cycle progress 0..1. */
export const CYCLE = 9;

export const EXPO_OUT = cubicBezier(0.16, 1, 0.3, 1);

/** Key windows in seconds: [start, end]. */
export const T = {
  enter: [0, 0.9],
  grid: [0.5, 1.1],
  axes: [0.6, 1.3],
  circle: [0.7, 1.5],
  dims: [1.0, 1.8],
  outline: [1.5, 2.3],
  leave1: [2.5, 3.2],
  blocks: [3.2, 3.5, 3.8, 4.1, 4.4],
  blockDur: 0.55,
  clamp: [4.95, 5.8],
  leave2: [5.5, 6.2],
  ignite: [6.2, 6.9],
  lift: [6.9, 8.5],
} as const;

export type Stage = 'plan' | 'build' | 'launch';
export const STAGES: readonly Stage[] = ['plan', 'build', 'launch'];

export const STAGE_ICONS: Record<Stage, string> = {
  plan: 'architecture',
  build: 'construction',
  launch: 'rocket_launch',
};

/** Seconds at which the form reaches each station. */
export const ARRIVE: Record<Stage, number> = { plan: T.enter[1], build: T.leave1[1], launch: T.leave2[1] };

/** Stepper targets (progress): where each step's playback ends. */
export const REST: Record<Stage, number> = { plan: 2.4 / CYCLE, build: 5.35 / CYCLE, launch: 8.6 / CYCLE };

/** Frozen frames for the reduced-motion strip. */
export const STATIC_P: Record<Stage, number> = { plan: 2.4 / CYCLE, build: 5.35 / CYCLE, launch: 7.75 / CYCLE };
export const FIXTURE_P: Record<Stage, number> = { plan: 2.3 / CYCLE, build: 5.9 / CYCLE, launch: 6.6 / CYCLE };

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Eased 0..1 for the window [a, b] seconds of the cycle. */
export function seg(progress: number, a: number, b: number, ease: (t: number) => number = EXPO_OUT) {
  return ease(clamp01((progress * CYCLE - a) / (b - a)));
}

export function useSeg(
  progress: MotionValue<number>,
  a: number,
  b: number,
  ease: (t: number) => number = EXPO_OUT,
) {
  return useTransform(progress, (v) => seg(v, a, b, ease));
}

type XS = readonly [number, number, number];

/** Station x positions in local units; the form slides station to station. */
export function objectX(v: number, xs: XS) {
  const s = v * CYCLE;
  if (s < T.leave1[0]) return xs[0];
  if (s < T.leave2[0]) return lerp(xs[0], xs[1], seg(v, T.leave1[0], T.leave1[1]));
  return lerp(xs[1], xs[2], seg(v, T.leave2[0], T.leave2[1]));
}

const SPARK_FROM = -30;

export function sparkX(v: number, xs: XS) {
  if (v * CYCLE < T.enter[1]) return lerp(SPARK_FROM, xs[0], seg(v, T.enter[0], T.enter[1]));
  return objectX(v, xs);
}

export function sparkTail(v: number) {
  return 42 * Math.pow(1 - seg(v, T.enter[0], T.enter[1]), 0.7);
}

export function sparkOpacity(v: number) {
  const s = v * CYCLE;
  const breathe = 0.88 + 0.12 * Math.sin(s * 5);
  return seg(v, 0, 0.18) * (1 - seg(v, 3.45, 4.0)) * breathe;
}

/** The shooting star climbs this far above horizontal. */
export const STAR_ANGLE = (-26 * Math.PI) / 180;

/** Head position, tail length and opacity of the star in local units. x0 is the launch station. */
export function starAt(v: number, x0: number, w: number) {
  const s = v * CYCLE;
  const t = clamp01((s - T.lift[0]) / (T.lift[1] - T.lift[0]));
  const e = Math.pow(t, 2.4);
  const dist = e * ((w - x0 + 60) / Math.cos(STAR_ANGLE));
  return {
    x: x0 + dist * Math.cos(STAR_ANGLE),
    y: dist * Math.sin(STAR_ANGLE),
    len: 10 + 190 * Math.pow(e, 0.6),
    opacity: seg(v, 6.85, 7.15) * (1 - clamp01((e - 0.75) / 0.25)),
    scale: 0.45 + 0.55 * seg(v, 6.9, 7.5),
  };
}
