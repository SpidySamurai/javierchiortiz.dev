/** Static geometry of the production line: stations, iso cubes, blueprint, plates, arm IK. */
import { dPath, expo, hull, linesLen, prog, ptsStr, type Polyline, type Pt } from './math';

/** Scene space. Everything is authored in a 1280 x 440 viewBox. */
export const VIEW_W = 1280;
export const VIEW_H = 440;

/** Station x positions: plan, build, launch. */
export const P = 320;
export const B = 640;
export const L = 960;

export const TOP = 306;
export const FRONT = 354;
/** Y where the piece rests on the belt. */
export const PY = 318;
export const START = -48;
export const CY = -26;
export const BEAM = 176;

const A = 34;
const C30 = 0.8660254;

export function iso(x: number, y: number, z: number): Pt {
  return [(x - y) * A * C30, (x + y - 2) * A * 0.5 - z * A];
}

function bil(p0: Pt, p1: Pt, p3: Pt, u: number, v: number): Pt {
  return [p0[0] + u * (p1[0] - p0[0]) + v * (p3[0] - p0[0]), p0[1] + u * (p1[1] - p0[1]) + v * (p3[1] - p0[1])];
}

function winQuad(face: readonly Pt[]): string {
  const [p0, p1, , p3] = face;
  return ptsStr([bil(p0, p1, p3, 0.3, 0.3), bil(p0, p1, p3, 0.7, 0.3), bil(p0, p1, p3, 0.7, 0.72), bil(p0, p1, p3, 0.3, 0.72)]);
}

/** Cube cells: the 2x2 base, the second floor, the third floor (the update module). */
const CUBES: readonly (readonly [number, number, number])[] = [
  [0, 0, 0],
  [1, 0, 0],
  [0, 1, 0],
  [1, 1, 0],
  [0.5, 0.5, 1],
  [0.5, 0.5, 2],
];

const FACES = CUBES.map(([i, j, k]) => ({
  top: [iso(i, j, k + 1), iso(i + 1, j, k + 1), iso(i + 1, j + 1, k + 1), iso(i, j + 1, k + 1)] as Pt[],
  right: [iso(i + 1, j, k), iso(i + 1, j + 1, k), iso(i + 1, j + 1, k + 1), iso(i + 1, j, k + 1)] as Pt[],
  left: [iso(i, j + 1, k), iso(i + 1, j + 1, k), iso(i + 1, j + 1, k + 1), iso(i, j + 1, k + 1)] as Pt[],
}));

const VERTS = CUBES.map(([i, j, k]) => {
  const v: Pt[] = [];
  for (let dx = 0; dx < 2; dx++) for (let dy = 0; dy < 2; dy++) for (let dz = 0; dz < 2; dz++) v.push(iso(i + dx, j + dy, k + dz));
  return v;
});

/** Pre-stringified polygon points per cube. */
export const CUBE_STR = FACES.map((f) => ({
  top: ptsStr(f.top),
  right: ptsStr(f.right),
  left: ptsStr(f.left),
  wr: winQuad(f.right),
  wl: winQuad(f.left),
}));

/** Centre of each cube's top face (piece-local). */
export const TOPC: Pt[] = FACES.map((f) => {
  let x = 0;
  let y = 0;
  for (const q of f.top) {
    x += q[0];
    y += q[1];
  }
  return [x / 4, y / 4];
});

const HULL5 = hull(VERTS.slice(0, 5).flat());
const HULL4 = hull(VERTS.slice(0, 4).flat());
const HULL_C2 = hull(VERTS[2]);

export const HULL5_STR = ptsStr(HULL5);
export const HULL4_STR = ptsStr(HULL4);
export const HULL_C2_STR = ptsStr(HULL_C2);

export const HULL_LINES: Polyline[] = [[...HULL5, HULL5[0]]];
export const HULL_LEN = linesLen(HULL_LINES);
export const HULL_D = dPath(HULL_LINES);

const BB = HULL5.reduce(
  (b, p) => ({
    minX: Math.min(b.minX, p[0]),
    maxX: Math.max(b.maxX, p[0]),
    minY: Math.min(b.minY, p[1]),
    maxY: Math.max(b.maxY, p[1]),
  }),
  { minX: 1e9, maxX: -1e9, minY: 1e9, maxY: -1e9 },
);

/** Blueprint drawn at the plan station (piece-local, origin at the belt rest point). */
export const CIRCLE: Polyline[] = [
  Array.from({ length: 73 }, (_, q): Pt => {
    const ang = -Math.PI / 2 + (q / 72) * Math.PI * 2;
    return [Math.cos(ang) * 76, CY + Math.sin(ang) * 76];
  }),
];
export const AXES: Polyline[] = [
  [[-C30 * 104, CY - 52], [C30 * 104, CY + 52]],
  [[C30 * 104, CY - 52], [-C30 * 104, CY + 52]],
  [[0, CY - 104], [0, CY + 66]],
];
const DY = BB.minY - 24;
const DXX = BB.maxX + 30;
export const DIMS: Polyline[] = [
  [[BB.minX, DY + 8], [BB.minX, DY - 6]],
  [[BB.minX, DY], [BB.maxX, DY]],
  [[BB.maxX, DY - 6], [BB.maxX, DY + 8]],
  [[DXX - 8, BB.minY], [DXX + 6, BB.minY]],
  [[DXX, BB.minY], [DXX, BB.maxY]],
  [[DXX - 8, BB.maxY], [DXX + 6, BB.maxY]],
];
export const CIRCLE_D = dPath(CIRCLE);
export const CIRCLE_LEN = linesLen(CIRCLE);
export const AXES_D = dPath(AXES);
export const AXES_LEN = linesLen(AXES);
export const DIMS_D = dPath(DIMS);
export const DIMS_LEN = linesLen(DIMS);

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

/** Drafting arm: two 170 segments pivoting at PIV. */
export const PIV: Pt = [110, 236];
export const REST: Pt = [180, 250];
const L1 = 170;
const L2 = 170;

export function ik(p: Pt, t: Pt): { elbow: Pt; tip: Pt } {
  const dx = t[0] - p[0];
  const dy = t[1] - p[1];
  const d = Math.max(1, Math.min(Math.hypot(dx, dy), L1 + L2 - 0.5));
  const th = Math.atan2(dy, dx);
  const c = (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d);
  const a = Math.acos(Math.max(-1, Math.min(1, c)));
  const e: Pt = [p[0] + L1 * Math.cos(th - a), p[1] + L1 * Math.sin(th - a)];
  const vx = t[0] - e[0];
  const vy = t[1] - e[1];
  const vl = Math.hypot(vx, vy) || 1;
  return { elbow: e, tip: [e[0] + (vx / vl) * L2, e[1] + (vy / vl) * L2] };
}

/** Build stage: when each of the five cubes is dropped in, and where the gantry carries its grip. */
export const GRIP_Y = BEAM + 20;
export const ST = [4.8, 5.16, 5.52, 5.88, 8.7] as const;
/** Start offset of each cube above its seat, so its top sits at the grip height. */
export const Y0 = TOPC.map((c) => GRIP_Y - (PY + c[1]));
const TX = TOPC.map((c) => c[0]);

/** Carriage keyframes: [start, end, fromX, toX] in seconds / piece-local x. */
const CAR: readonly (readonly [number, number, number, number])[] = [
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

export function carAt(t: number): number {
  if (t < CAR[0][0]) return 0;
  for (let i = 0; i < CAR.length; i++) {
    const g = CAR[i];
    if (t < g[0]) return CAR[i - 1][3];
    if (t <= g[1]) return g[2] + (g[3] - g[2]) * expo(prog(t, g[0], g[1]));
  }
  return CAR[CAR.length - 1][3];
}

/** Launch: where the product settles in orbit, and the support heartbeat drawn over it (orbit-local). */
export const ORBIT: Pt = [1172, 160];
export const HB: Polyline = [[-196, 0], [-166, 0], [-156, -15], [-147, 13], [-139, -5], [-131, 0], [-84, 0]];
export const HB_LEN = linesLen([HB]);
/** Launch-clock time (s, T = s - SH) at which the product leaves the pad. */
export const LIFTOFF_T = 10.6;
