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
  launch: [10, 23.8],
};

/**
 * viewBox cropped around each station, all the same size so the panels line up. Plan reaches
 * right to include the foreground arm and its column; build reaches to the top for the andon
 * board; launch reaches right to include the orbit. The update pass (plan, build, test) runs
 * at the first two stations, so on mobile it only shows when the tray reaches the pad and
 * lifts off the update modules.
 */
export const CROPS: Record<Stage, string> = {
  plan: '70 0 470 380',
  build: '470 0 470 380',
  launch: '810 0 470 380',
};

/** Frozen frames for reduced motion: both arms drawing the blueprint, "v2 ready to ship", in orbit with the four modules integrated (v1.4). */
export const STATIC_AT: Record<Stage, number> = { plan: 3.0, build: 9.7, launch: 22.8 };
