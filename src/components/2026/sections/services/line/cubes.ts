/** Isometric modules: iso projection, box faces, hulls, blueprint strokes, face kinds and the update swarm slots. */
import { dPath, hull, linesLen, ptsStr, type Polyline, type Pt } from './math';

/** Iso cell size in scene px. K scales the blueprint (authored for a 34 px cell). */
export const A = 40;
const C30 = 0.8660254;
const K = A / 34;
export const CY = -26 * K;

export function iso(x: number, y: number, z: number): Pt {
  return [(x - y) * A * C30, (x + y - 2) * A * 0.5 - z * A];
}

const m4 = (v: number) => Math.round(v * 10000) / 10000;

/** SVG matrix that maps a 100 x 100 face space onto a projected face (top-left, top-right, bottom-left corners). */
function matrix(tl: Pt, tr: Pt, bl: Pt): string {
  const v = [(tr[0] - tl[0]) / 100, (tr[1] - tl[1]) / 100, (bl[0] - tl[0]) / 100, (bl[1] - tl[1]) / 100, tl[0], tl[1]];
  return `matrix(${v.map(m4).join(' ')})`;
}

export interface BoxFaces {
  top: string;
  right: string;
  left: string;
  mTop: string;
  mRight: string;
  mLeft: string;
  eR: readonly [Pt, Pt];
  eL: readonly [Pt, Pt];
  eV: readonly [Pt, Pt];
}

export function boxFaces(i: number, j: number, k: number, w: number, d: number, h: number): BoxFaces {
  return {
    top: ptsStr([iso(i, j, k + h), iso(i + w, j, k + h), iso(i + w, j + d, k + h), iso(i, j + d, k + h)]),
    right: ptsStr([iso(i + w, j, k), iso(i + w, j + d, k), iso(i + w, j + d, k + h), iso(i + w, j, k + h)]),
    left: ptsStr([iso(i, j + d, k), iso(i + w, j + d, k), iso(i + w, j + d, k + h), iso(i, j + d, k + h)]),
    mTop: matrix(iso(i, j, k + h), iso(i + w, j, k + h), iso(i, j + d, k + h)),
    mRight: matrix(iso(i + w, j + d, k + h), iso(i + w, j, k + h), iso(i + w, j + d, k)),
    mLeft: matrix(iso(i, j + d, k + h), iso(i + w, j + d, k + h), iso(i, j + d, k)),
    eR: [iso(i + w, j + d, k + h), iso(i + w, j, k + h)],
    eL: [iso(i, j + d, k + h), iso(i + w, j + d, k + h)],
    eV: [iso(i + w, j + d, k), iso(i + w, j + d, k + h)],
  };
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

export const FACES: BoxFaces[] = CUBES.map(([i, j, k]) => boxFaces(i, j, k, 1, 1, 1));

/** Corner points of the top face of each cube (piece-local), used for centres. */
function topCorners(i: number, j: number, k: number): Pt[] {
  return [iso(i, j, k + 1), iso(i + 1, j, k + 1), iso(i + 1, j + 1, k + 1), iso(i, j + 1, k + 1)];
}

/** Centre of each cube's top face (piece-local). */
export const TOPC: Pt[] = CUBES.map(([i, j, k]) => {
  const c = topCorners(i, j, k);
  return [c.reduce((a, q) => a + q[0], 0) / 4, c.reduce((a, q) => a + q[1], 0) / 4];
});

const VERTS = CUBES.map(([i, j, k]) => {
  const v: Pt[] = [];
  for (let dx = 0; dx < 2; dx++) for (let dy = 0; dy < 2; dy++) for (let dz = 0; dz < 2; dz++) v.push(iso(i + dx, j + dy, k + dz));
  return v;
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
    return [Math.cos(ang) * 76 * K, CY + Math.sin(ang) * 76 * K];
  }),
];
export const AXES: Polyline[] = [
  [[-C30 * 104 * K, CY - 52 * K], [C30 * 104 * K, CY + 52 * K]],
  [[C30 * 104 * K, CY - 52 * K], [-C30 * 104 * K, CY + 52 * K]],
  [[0, CY - 104 * K], [0, CY + 66 * K]],
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

/** Booster platform under the product at lift-off. */
export const BOOST_H = 0.45;
export const BOOST = boxFaces(0, 0, -BOOST_H, 2, 2, BOOST_H);
/** Nozzle mounting points (piece-local). */
export const NOZ: Pt[] = [-36, 0, 36].map((x): Pt => [x, A + BOOST_H * A - Math.abs(x) * (A / 2) / (2 * A * C30)]);

/** What is drawn on each face of a module: UI screens, panels, vents, a warm feedback band. */
export type FaceKind = 'bars' | 'form' | 'chart' | 'lines' | 'toggle' | 'chip' | 'vents' | 'leds';
export type TopKind = 'vent' | 'plate' | 'dome';
export type Tone = 'base' | 'nova' | 'evo' | 'steel';
export interface CubeKind {
  t: TopKind;
  r: FaceKind;
  l: FaceKind;
  tone: Tone;
  band?: boolean;
}

export const KINDS: readonly CubeKind[] = [
  { t: 'vent', r: 'vents', l: 'leds', tone: 'base' },
  { t: 'plate', r: 'bars', l: 'vents', tone: 'base' },
  { t: 'plate', r: 'vents', l: 'form', tone: 'base' },
  { t: 'plate', r: 'chart', l: 'leds', tone: 'base' },
  { t: 'dome', r: 'toggle', l: 'lines', tone: 'nova', band: true },
  { t: 'plate', r: 'chip', l: 'vents', tone: 'evo' },
];

const MINI_K: readonly CubeKind[] = [
  { t: 'plate', r: 'bars', l: 'leds', tone: 'evo' },
  { t: 'plate', r: 'vents', l: 'chart', tone: 'evo' },
  { t: 'vent', r: 'chip', l: 'lines', tone: 'evo' },
];

/** Update swarm: slot order is the integration order (right corner, left corner, top module, front corner). */
export interface SwarmSlot {
  faces: BoxFaces;
  kind: CubeKind;
  /** Where the module rests once integrated (piece-local). */
  at: Pt;
  /** Visual size factor while it flies. */
  big: number;
}

const SLOT_CELLS: readonly (readonly [number, number, number] | null)[] = [[1.5, 0, 1], [0, 1.5, 1], null, [1.5, 1.5, 1]];

export const SWARM: SwarmSlot[] = SLOT_CELLS.map((c, i) => {
  if (!c) return { faces: FACES[5], kind: KINDS[5], at: iso(1, 1, 2.5), big: 0.72 };
  return {
    faces: boxFaces(c[0], c[1], c[2], 0.5, 0.5, 0.5),
    kind: MINI_K[i > 2 ? 2 : i],
    at: iso(c[0] + 0.25, c[1] + 0.25, c[2] + 0.25),
    big: 1,
  };
});
