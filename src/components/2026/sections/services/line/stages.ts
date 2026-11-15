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
  launch: [10, 19.9],
};

/**
 * viewBox cropped around each station, all the same size so the panels line up. Build
 * reaches to the top for the andon board; launch reaches right to include the orbit.
 */
export const CROPS: Record<Stage, string> = {
  plan: '70 0 420 380',
  build: '470 0 420 380',
  launch: '850 0 420 380',
};

/** Frozen frames for reduced motion: blueprint drawn, "v2 ready to ship", in orbit with the four modules integrated (v1.4). */
export const STATIC_AT: Record<Stage, number> = { plan: 3.45, build: 9.7, launch: 18.8 };
