export type Stage = 'plan' | 'build' | 'launch';
export const STAGES: readonly Stage[] = ['plan', 'build', 'launch'];

export const STAGE_ICONS: Record<Stage, string> = {
  plan: 'architecture',
  build: 'construction',
  launch: 'rocket_launch',
};

/** Mobile: the slice of the timeline each step plays, in seconds (see frame.ts). */
export const SLICES: Record<Stage, readonly [number, number]> = {
  plan: [0, 3.6],
  build: [4.3, 9.9],
  launch: [10, 14.7],
};

/** viewBox cropped around each station. Launch reaches right to include the orbit. */
export const CROPS: Record<Stage, string> = {
  plan: '110 60 420 320',
  build: '470 60 420 320',
  launch: '860 60 420 320',
};

/** Frozen frames for reduced motion: blueprint drawn, "v2 ready to ship", in orbit with v1.1. */
export const STATIC_AT: Record<Stage, number> = { plan: 3.45, build: 9.7, launch: 14.3 };
