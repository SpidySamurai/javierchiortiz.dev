/**
 * Update pass: with the piece LIVE in orbit, four update modules ride a tray through the
 * same three stations (times in s on the scene clock, not T).
 *
 *   13.75-14.4  tray enters from the left        14.2-15.35  plan: both arms trace the module outlines
 *   15.3-15.9   tray to the build station        15.85-17.43 gantry drops each module into its outline
 *   17.4-17.68  scan plane test, 17.68 pass      17.9-18.5   tray to the pad, 18.5 countdown, 18.8 ignition
 *   19.0 + 0.13 i  module i lifts off (0.75 s climb), joins the orbit and snaps in at SW_IN[i]
 *   21.95 piece complete (v1.4), hold, 23.55 fade, 23.8 wrap
 */
import { B, L, P, START, type CarKeys } from './geometry';
import { dPath, expo, lerp, linesLen, prog, type Polyline } from './math';

export const U_IN = [13.75, 14.4] as const;
export const U_PB = [15.3, 15.9] as const;
export const U_BL = [17.9, 18.5] as const;
/** START to L plus UX0 to L is 2052 px = 57 tread pitches, so treads and rollers wrap clean. */
export const UX0 = -84;
export const BELT_RUN = L - START + (L - UX0);
/** Belt y of each module's front bottom corner on the tray. */
export const UBOT = 341;

export interface TrayModule {
  /** x offset on the tray. */
  dx: number;
  /** World scale of the module on the tray. */
  w: number;
  /** Cube size of the module geometry (0.5 half cube, 1 the big top cube). */
  g: number;
  /** World cube size (w * g). */
  c: number;
  /** World y of the module centre on the tray. */
  cy: number;
}

export const UM: TrayModule[] = (
  [[-59, 0.8, 0.5], [-25, 0.8, 0.5], [17, 0.65, 1], [59.5, 0.8, 0.5]] as const
).map(([dx, w, g]) => {
  const c = w * g;
  return { dx, w, g, c, cy: UBOT - 40 * c };
});

/** Gripper drops, and the carriage keyframes of the update pass. */
export const UD = [16.05, 16.41, 16.77, 17.13] as const;
export const UCAR: CarKeys = [
  [15.85, 16.0, 0, UM[0].dx],
  ...UD.map((t, i): [number, number, number, number] => [t + 0.18, t + 0.3, UM[i].dx, i < 3 ? UM[i + 1].dx : 0]),
];
export const U_SCAN = [17.4, 17.68] as const;
export const U_PASS = 17.68;
export const U_LAMP = 18.5;
export const U_IGN = 18.8;
export const U_FLY = 0.75;
/** Lift-off time of each module. */
export const U_TL = UM.map((_, i) => 19.0 + 0.13 * i);

/** Silhouette hexagon plus the inner Y of an iso cube of size c centred at (x, y). */
export function cubeOutline(x: number, y: number, c: number): Polyline[] {
  const h = 40 * c;
  const w = 34.641 * c;
  return [
    [[x, y - h], [x + w, y - h / 2], [x + w, y + h / 2], [x, y + h], [x - w, y + h / 2], [x - w, y - h / 2], [x, y - h]],
    [[x - w, y - h / 2], [x, y], [x + w, y - h / 2]],
    [[x, y], [x, y + h]],
  ];
}

const U_OUT = UM.map((m) => cubeOutline(P + m.dx, m.cy, m.c));
/** Arm 1 traces modules 0-1, arm 2 traces modules 2-3. */
export const U_LINES1: Polyline[] = [...U_OUT[0], ...U_OUT[1]];
export const U_LINES2: Polyline[] = [...U_OUT[2], ...U_OUT[3]];
export const U_LEN1 = linesLen(U_LINES1);
export const U_LEN2 = linesLen(U_LINES2);
export const U_D1 = dPath(U_LINES1);
export const U_D2 = dPath(U_LINES2);

/** Footprint of each module on the tray (tray-local), and the outline drawn on the pass check. */
export const TRAY_SLOTS_D = dPath(
  UM.map((m): Polyline => {
    const w = 34.641 * m.c;
    const h = 40 * m.c;
    return [[m.dx, UBOT], [m.dx + w, UBOT - h / 2], [m.dx, UBOT - h], [m.dx - w, UBOT - h / 2], [m.dx, UBOT]];
  }),
);
export const U_PASS_D = dPath(UM.flatMap((m) => cubeOutline(m.dx, m.cy, m.c).slice(0, 1)));

/** When each module's outline is finished. */
export const U_TRACED = [14.5 + (0.45 * linesLen(U_OUT[0])) / U_LEN1, 14.95, 14.55 + (0.45 * linesLen(U_OUT[2])) / U_LEN2, 15.0];

/** Where the update tray is on the belt at clock s. */
export function uxAt(s: number): number {
  if (s < U_PB[0]) return lerp(UX0, P, expo(prog(s, U_IN[0], U_IN[1])));
  if (s < U_BL[0]) return lerp(P, B, expo(prog(s, U_PB[0], U_PB[1])));
  return lerp(B, L, expo(prog(s, U_BL[0], U_BL[1])));
}

/** Station activity: the main build and the update pass both light the plan and build stations. */
export function planAt(s: number): number {
  return Math.max(prog(s, 1.2, 1.5) * (1 - prog(s, 3.5, 3.9)), prog(s, 14.3, 14.6) * (1 - prog(s, 15.4, 15.75)));
}
export function buildAt(s: number): number {
  return Math.max(prog(s, 4.5, 4.8) * (1 - prog(s, 9.8, 10.2)), prog(s, 15.75, 16.05) * (1 - prog(s, 17.85, 18.2)));
}
/** The pad dims while the update is planned and built, and lights again when the tray arrives. */
export function padAt(s: number, T: number, launchOff: number): number {
  return Math.max(prog(T, 9.5, 9.8) * (1 - prog(s, 14.2, 14.6)), prog(s, 18.2, 18.5)) * launchOff;
}
export function stageAt(s: number): 0 | 1 | 2 {
  return s < 3.6 ? 0 : s < 9.9 ? 1 : s < 14.3 ? 2 : s < 15.3 ? 0 : s < 17.9 ? 1 : 2;
}

