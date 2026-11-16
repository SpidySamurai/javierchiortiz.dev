/** Static geometry of the production line: stations, timings, plates, arm IK, carriage, launch path. */
import { dPath, expo, linesLen, prog, type Polyline, type Pt } from './math';
import { TOPC } from './cubes';

/** Scene space. Everything is authored in a 1280 x 440 viewBox. */
export const VIEW_W = 1280;
export const VIEW_H = 440;

/** One loop of the line, in seconds. */
export const CYCLE = 23.8;
/** The launch is shifted by SH so the build has room to iterate. */
export const SH = 1.3;
/** Launch clock (T = s - SH): the product leaves the pad, reaches orbit, and the cycle fades out. */
export const LIFTOFF_T = 10.9;
export const ARRIVE_T = 12.5;
export const END_T = 22.5;

/** Station x positions: plan, build, launch. */
export const P = 320;
export const B = 640;
export const L = 960;

export const TOP = 306;
export const FRONT = 354;
/** Y where the piece rests on the belt. */
export const PY = 313;
export const START = -48;
export const BEAM = 176;

/** Station floor plates: perspective grid (plan) and corner marks (build). */
function plateGrid(cx: number): string {
  const lines: Polyline[] = [];
  for (const o of [-72, -48, -24, 0, 24, 48, 72]) lines.push([[cx + o + 8, TOP + 5], [cx + o, FRONT - 5]]);
  for (const f of [1 / 3, 2 / 3]) {
    const y = TOP + 5 + (FRONT - TOP - 10) * f;
    const sh = 8 * (1 - f);
    lines.push([[cx - 94 + sh, y], [cx + 86 + sh, y]]);
  }
  return dPath(lines);
}

function plateMarks(cx: number): string {
  const x1 = cx - 86;
  const x2 = cx + 94;
  const x3 = cx + 86;
  const x4 = cx - 94;
  const y1 = TOP + 5;
  const y2 = FRONT - 5;
  return dPath([
    [[x1 + 16, y1], [x1, y1], [x1 - 2, y1 + 10]],
    [[x2 - 16, y1], [x2, y1], [x2 - 2, y1 + 10]],
    [[x3 - 16, y2], [x3, y2], [x3 + 2, y2 - 10]],
    [[x4 + 16, y2], [x4, y2], [x4 + 2, y2 - 10]],
  ]);
}

export const PLAN_GRID_D = plateGrid(P);
export const BUILD_MARKS_D = plateMarks(B);
/** Treads on the belt surface repeat every TREAD_PITCH px. */
export const TREAD_PITCH = 36;
/** Roller spacing and whole turns over both belt runs (piece, then update tray), so spokes match when the loop wraps. */
export const ROLLER_X: number[] = Array.from({ length: Math.ceil((VIEW_W - 22) / 44) }, (_, i) => 22 + i * 44);
export const ROLLER_TURNS = 47;

/**
 * Drafting arms: two 170 segments each. Arm 1 stands behind the belt, left of the plan
 * station; arm 2 stands on the foreground floor in front of the belt, 1.1x larger so it
 * reads nearer the camera.
 */
export const PIV: Pt = [110, 236];
export const REST: Pt = [180, 250];
export const PIV2: Pt = [498, 205];
export const REST2: Pt = [428, 219];
export const K2 = 1.1;
export const L1 = 170;
export const L2 = 170;

/** Two-link IK. `flip` bends the elbow the other way so the mirrored arm keeps its elbow up. */
export function ik(p: Pt, t: Pt, flip = false, l1 = L1, l2 = L2): { elbow: Pt; tip: Pt } {
  const L1 = l1;
  const L2 = l2;
  const dx = t[0] - p[0];
  const dy = t[1] - p[1];
  const d = Math.max(1, Math.min(Math.hypot(dx, dy), L1 + L2 - 0.5));
  const th = Math.atan2(dy, dx);
  const c = (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d);
  const a = Math.acos(Math.max(-1, Math.min(1, c)));
  const ea = flip ? th + a : th - a;
  const e: Pt = [p[0] + L1 * Math.cos(ea), p[1] + L1 * Math.sin(ea)];
  const vx = t[0] - e[0];
  const vy = t[1] - e[1];
  const vl = Math.hypot(vx, vy) || 1;
  return { elbow: e, tip: [e[0] + (vx / vl) * L2, e[1] + (vy / vl) * L2] };
}

/** Build stage: when each of the five cubes is dropped in, and where the gantry carries its grip. */
export const GRIP_Y = BEAM + 28;
export const ST = [4.8, 5.16, 5.52, 5.88, 8.7] as const;
/** Start offset of each cube above its seat, so its top sits at the grip height. */
export const Y0 = TOPC.map((c) => GRIP_Y - (PY + c[1]));
const TX = TOPC.map((c) => c[0]);

/** Carriage keyframes: [start, end, fromX, toX] in seconds / piece-local x. */
export const CAR: CarKeys = [
  [4.58, 4.78, 0, TX[0]],
  [4.96, 5.14, TX[0], TX[1]],
  [5.32, 5.5, TX[1], TX[2]],
  [5.68, 5.86, TX[2], TX[3]],
  [6.14, 6.3, TX[3], 0],
  [6.85, 7.0, 0, TX[2]],
  [7.47, 7.6, TX[2], 0],
  [8.5, 8.68, 0, TX[4]],
  [8.96, 9.15, TX[4], 0],
];

export type CarKeys = readonly (readonly [number, number, number, number])[];

export function carAt(list: CarKeys, t: number): number {
  if (t < list[0][0]) return list[0][2];
  for (let i = 0; i < list.length; i++) {
    const g = list[i];
    if (t < g[0]) return list[i - 1][3];
    if (t <= g[1]) return g[2] + (g[3] - g[2]) * expo(prog(t, g[0], g[1]));
  }
  return list[list.length - 1][3];
}

/** Launch: where the product settles in orbit, and the support heartbeat drawn over it (orbit-local). */
export const ORBIT: Pt = [1140, 160];
export const HB: Polyline = [[-196, 0], [-166, 0], [-156, -15], [-147, 13], [-139, -5], [-131, 0], [-84, 0]];
export const HB_LEN = linesLen([HB]);

/** Update swarm in orbit: modules ride the orbit with depth, then snap in one by one at SW_IN. */
export const SC_ORB = 0.55;
export const SW_W = 2.2;
export const SW_IN = [20.25, 20.6, 20.95, 21.3] as const;
const SW_TGT = [0, Math.PI, Math.PI, Math.PI / 2] as const;
/** Orbit angle of module i at clock s; it reaches its slot angle SW_TGT[i] at SW_IN[i]. */
export const swAng = (i: number, s: number) => SW_TGT[i] + SW_W * (s - SW_IN[i]);
export const SW_SLOT_ANGLE = SW_TGT;

export const COUNT = { puffs: 14, exhaust: 16, sparks: 18, swarm: 4, pulses: 3 } as const;
