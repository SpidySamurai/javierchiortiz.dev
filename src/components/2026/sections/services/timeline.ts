import { cubicBezier, useTransform, type MotionValue } from 'framer-motion';

/** One factory cycle, in seconds. Every visual below is a pure function of cycle progress 0..1. */
export const CYCLE = 8;

export const EXPO_OUT = cubicBezier(0.16, 1, 0.3, 1);
export const EXPO_IN = cubicBezier(0.7, 0, 0.84, 0);

/** Key moments in seconds. Travel eases out, dwell lets the artifact transform. */
export const T = {
  arriveIdea: 0.9,
  leaveIdea: 2.3,
  arriveBuild: 3.2,
  leaveBuild: 4.9,
  arriveLaunch: 5.8,
  leaveLaunch: 7.4,
} as const;

export type Stage = 'idea' | 'build' | 'launch';
export const STAGES: readonly Stage[] = ['idea', 'build', 'launch'];

/** Progress at which each stage is fully formed (used by static and stepper views). */
export const REST: Record<Stage, number> = {
  idea: 2.2 / CYCLE,
  build: 4.9 / CYCLE,
  launch: 7.2 / CYCLE,
};

/** Arrival time (seconds) of the artifact at each station. */
export const ARRIVE: Record<Stage, number> = {
  idea: T.arriveIdea,
  build: T.arriveBuild,
  launch: T.arriveLaunch,
};

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

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

const CARD_W = 160;

/** Left edge of the artifact for a track of width w. Stations sit at 25 / 50 / 75%. */
export function artifactX(progress: number, w: number) {
  const left = (frac: number) => w * frac - CARD_W / 2;
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const s = progress * CYCLE;
  const enter = -CARD_W - 30;
  const exit = w + 30;

  if (s < T.arriveIdea) return lerp(enter, left(0.25), seg(progress, 0, T.arriveIdea));
  if (s < T.leaveIdea) return left(0.25);
  if (s < T.arriveBuild) return lerp(left(0.25), left(0.5), seg(progress, T.leaveIdea, T.arriveBuild));
  if (s < T.leaveBuild) return left(0.5);
  if (s < T.arriveLaunch) return lerp(left(0.5), left(0.75), seg(progress, T.leaveBuild, T.arriveLaunch));
  if (s < T.leaveLaunch) return left(0.75);
  return lerp(left(0.75), exit, seg(progress, T.leaveLaunch, CYCLE, EXPO_IN));
}

/** 0..1..0 press stamp: a quick drop on arrival, a slow release. */
export function stamp(progress: number) {
  const down = seg(progress, T.arriveBuild, T.arriveBuild + 0.12);
  const up = seg(progress, T.arriveBuild + 0.22, T.arriveBuild + 0.9);
  return down * (1 - up);
}

export const STAGE_ICONS: Record<Stage, string> = {
  idea: 'lightbulb',
  build: 'terminal',
  launch: 'rocket_launch',
};
