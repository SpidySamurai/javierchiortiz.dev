/**
 * Pure geometry for the hero planet and its orbit ring. No React, no DOM.
 * Shared by the PlanetOrbit canvas and the Hero comet so the burn-up point
 * computed for a comet matches what the canvas draws.
 */

export const COMPACT_MAX_WIDTH = 768;
export const SATELLITE_COUNT = 6;
export const TAU = Math.PI * 2;

/** Ring angle the first rotation starts from, before any service is active. */
export const INITIAL_RING_ROT = Math.PI / 2 + 1.1;
export const ROTATION_MS = 1500;

export type Rand = () => number;

export interface PlanetGeo {
  R: number;
  cx: number;
  cy: number;
  limbTop: number;
}

export interface Light {
  /** cos / sin of latitude. */
  cl: number;
  sl: number;
  lon: number;
  b: number;
  tw: number;
  sz: number;
}

export interface Cluster {
  cl: number;
  sl: number;
  lon: number;
  size: number;
}

export interface CityField {
  lights: Light[];
  clusters: Cluster[];
}

export interface LightPos {
  x: number;
  y: number;
  cz: number;
}

export interface RingGeo {
  ecx: number;
  ecy: number;
  erx: number;
  ery: number;
  tilt: number;
}

export interface RingPoint {
  x: number;
  y: number;
  depth: number;
}

export interface RingSat {
  x: number;
  y: number;
  ang: number;
  i: number;
  front: boolean;
  depth: number;
  scale: number;
  active: boolean;
  alpha: number;
  hidden: boolean;
  /** Beam intensity (rotation progress) for the active satellite. */
  on?: number;
  /** 0..1 progress of the glide to its easter egg logo vertex, when it left the ring. */
  egg?: number;
}

/** Easter egg timeline sampled at one instant, all ramps 0..1. */
export interface EggState {
  /** Milliseconds since the click. */
  t: number;
  rm: boolean;
  /** Quiet: dims the ring line, hides labels and beams. */
  q: number;
  /** Warm to red shift of the city lights. */
  red: number;
  /** Logo stroke draw-in. */
  lines: number;
  /** Glide progress of satellite i from the ring (0) to its logo vertex (1). */
  k: (i: number) => number;
}

export function isCompact(W: number): boolean {
  return W < COMPACT_MAX_WIDTH;
}

/** Planet circle for a canvas of W x H. Narrow widths get a shallower band. */
export function planetGeo(W: number, H: number): PlanetGeo {
  const R = Math.max(W * 1.6, 1500);
  const band = isCompact(W) ? Math.min(170, H * 0.24) : Math.min(220, H * 0.28);
  const limbTop = H - band;
  return { R, cx: W / 2, cy: limbTop + R, limbTop };
}

/** Y of the planet limb (top edge of the circle) at horizontal position x. */
export function limbY(G: PlanetGeo, x: number): number {
  const dx = x - G.cx;
  return G.cy - Math.sqrt(Math.max(0, G.R * G.R - dx * dx));
}

function mkLight(rand: Rand, lat: number, lon: number, b: number): Light {
  return {
    cl: Math.cos(lat),
    sl: Math.sin(lat),
    lon,
    b,
    tw: rand() * TAU,
    sz: 0.55 + rand() * 0.75,
  };
}

/** Warm city clusters plus a sparse rural scatter, projected on the visible band. */
export function genCities(G: PlanetGeo, H: number, count: number, rand: Rand): CityField {
  const latMax = Math.PI / 2 - 0.004;
  const latAt = (y: number) => Math.asin(Math.min(1, Math.max(-1, (G.cy - y) / G.R)));
  const gauss = () => (rand() + rand() + rand() - 1.5) / 1.5;
  const lights: Light[] = [];
  const clusters: Cluster[] = [];
  for (let c = 0; c < count; c++) {
    const clat = Math.min(latMax, latAt(G.limbTop + 6 + rand() * (H - G.limbTop + 10)));
    const clon = rand() * TAU;
    const k = Math.max(40, G.R * Math.cos(clat));
    const sx = (10 + rand() * 26) / k;
    const sy = (2.5 + rand() * 4.5) / k;
    const n = 6 + Math.floor(rand() * 24);
    clusters.push({ cl: Math.cos(clat), sl: Math.sin(clat), lon: clon, size: n });
    for (let q = 0; q < n; q++) {
      const lat = Math.min(latMax, clat + gauss() * sy);
      lights.push(mkLight(rand, lat, clon + gauss() * sx, 0.45 + rand() * 0.55));
    }
  }
  const rural = count * 4;
  for (let q = 0; q < rural; q++) {
    const lat = Math.min(latMax, latAt(G.limbTop + 6 + rand() * (H - G.limbTop + 10)));
    lights.push(mkLight(rand, lat, rand() * TAU, 0.15 + rand() * 0.3));
  }
  return { lights, clusters };
}

/** Screen position of a light on the near hemisphere, or null when it faces away. */
export function lightPos(G: PlanetGeo, L: Light, spin: number): LightPos | null {
  const lo = L.lon + spin;
  const cz = Math.cos(lo);
  if (cz <= 0.02) return null;
  return { x: G.cx + G.R * L.cl * Math.sin(lo), y: G.cy - G.R * L.sl, cz };
}

/** Tilted ellipse the satellites travel on, sitting on the limb. */
export function ringGeo(G: PlanetGeo, W: number): RingGeo {
  const compact = isCompact(W);
  return {
    ecx: G.cx,
    ecy: G.limbTop + (compact ? 20 : 28),
    erx: Math.min(W * (compact ? 0.46 : 0.47), 660),
    ery: compact ? 60 : 92,
    tilt: -0.05,
  };
}

/** Point on the ring at angle th. depth is +1 at the front (near), -1 at the back. */
export function ringPoint(r: RingGeo, th: number): RingPoint {
  const ct = Math.cos(r.tilt);
  const st = Math.sin(r.tilt);
  const lx = r.erx * Math.cos(th);
  const ly = r.ery * Math.sin(th);
  return { x: r.ecx + lx * ct - ly * st, y: r.ecy + lx * st + ly * ct, depth: Math.sin(th) };
}

/** Ring angle that brings satellite index i to the front. */
export function ringAngleFor(i: number): number {
  return Math.PI / 2 - i * (TAU / SATELLITE_COUNT);
}

/** Signed shortest rotation from angle cur to angle want, in (-PI, PI]. */
export function shortestDelta(cur: number, want: number): number {
  return ((((want - cur) % TAU) + TAU + Math.PI) % TAU) - Math.PI;
}

export function easeInOutCubic(k: number): number {
  return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
}

export function easeOutCubic(k: number): number {
  return 1 - Math.pow(1 - k, 3);
}

/** Ring rotation at time `now` for a rotation that started at t0. */
export function ringRotation(from: number, to: number, t0: number, now: number) {
  const k = Math.min(1, Math.max(0, (now - t0) / ROTATION_MS));
  return { rot: from + (to - from) * easeInOutCubic(k), k };
}

/** Total egg duration: the moment everything resumes. The last satellite's
 *  return glide ends at 6200 + 50 * 5 + 1200 = 7650 ms, so this leaves a margin. */
export const EGG_END_MS = 7700;
/** Reduced motion shows one static frame for this long. */
export const EGG_RM_END_MS = 6000;
/** When the caption switches to the lyric and back, in ms after the click. */
export const EGG_LYRIC_MS = 1200;
export const EGG_CAPTION_BACK_MS = 7000;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Egg ramps at t ms after the click, or null once the egg is over. */
export function eggState(t: number, rm: boolean): EggState | null {
  if (t >= (rm ? EGG_RM_END_MS : EGG_END_MS)) return null;
  if (rm) return { t, rm, q: 1, red: 1, lines: 1, k: () => 1 };
  return {
    t,
    rm,
    q: Math.min(clamp01(t / 600), 1 - clamp01((t - 6200) / 800)),
    red: Math.min(clamp01((t - 700) / 1200), 1 - clamp01((t - 6400) / 1000)),
    lines: Math.min(clamp01((t - 1900) / 700), 1 - clamp01((t - 6000) / 400)),
    k: (i) =>
      Math.min(
        easeInOutCubic(clamp01((t - 400 - 70 * i) / 1300)),
        1 - easeInOutCubic(clamp01((t - 6200 - 50 * i) / 1200)),
      ),
  };
}

/** Vertices of the |-/ logo in logo units: bar, dash, slash. */
const LOGO_VERTS: readonly (readonly [number, number])[] = [
  [0, -1],
  [0, 1],
  [0.55, 0],
  [1.15, 0],
  [1.6, 1],
  [2.1, -1],
];

/** Canvas position of logo vertex i, centered on the planet in front of it. */
export function logoVertex(G: PlanetGeo, W: number, i: number): { x: number; y: number } {
  const compact = isCompact(W);
  const sc = compact ? 38 : 54;
  const [vx, vy] = LOGO_VERTS[i];
  return { x: G.cx + (vx - 1.05) * sc, y: G.limbTop + (compact ? 58 : 82) + vy * sc };
}

export type RGB = readonly [number, number, number];

/** Blend two RGB triples by k, as the "r,g,b" body of a canvas color string. */
export function mixRGB(a: RGB, b: RGB, k: number): string {
  return a.map((v, n) => Math.round(v + (b[n] - v) * k)).join(',');
}

/** Warm city light and cluster glow colors, and their red egg counterparts. */
export const LIGHT_WARM: RGB = [255, 214, 160];
export const LIGHT_RED: RGB = [235, 64, 72];
export const GLOW_WARM: RGB = [255, 190, 120];
export const GLOW_RED: RGB = [220, 40, 52];

/**
 * The six satellites for a ring rotation. `animated` adds the idle bob. While an
 * egg runs, `egg` pulls each satellite toward its logo vertex.
 */
export function ringSatellites(
  G: PlanetGeo,
  ring: RingGeo,
  rot: number,
  progress: number,
  activeIndex: number,
  now: number,
  animated: boolean,
  egg: { state: EggState; W: number } | null = null,
): RingSat[] {
  const sats: RingSat[] = [];
  for (let i = 0; i < SATELLITE_COUNT; i++) {
    const th = rot + i * (TAU / SATELLITE_COUNT);
    const p = ringPoint(ring, th);
    const q = ringPoint(ring, th + 0.01);
    const front = p.depth > 0;
    const active = i === activeIndex;
    const dn = (p.depth + 1) / 2;
    const sat: RingSat = {
      x: p.x,
      y: p.y + (animated ? Math.sin(now / 900 + i) * 1.2 : 0),
      ang: Math.atan2(q.y - p.y, q.x - p.x),
      i,
      front,
      depth: p.depth,
      scale: 0.6 + 0.4 * dn,
      active,
      alpha: active ? 1 : 0.45 + 0.3 * dn,
      hidden: !front && p.y > limbY(G, p.x) - 2,
      on: active ? progress * (egg ? 1 - egg.state.q : 1) : undefined,
    };
    const ek = egg ? egg.state.k(i) : 0;
    if (egg && ek > 0) {
      const v = logoVertex(G, egg.W, i);
      sat.x += (v.x - sat.x) * ek;
      sat.y += (v.y - sat.y) * ek;
      sat.scale += (0.8 - sat.scale) * ek;
      sat.alpha += (1 - sat.alpha) * ek;
      sat.egg = ek;
      if (ek > 0.5) {
        sat.front = true;
        sat.hidden = false;
        sat.ang = Math.PI;
        sat.depth = 1;
      }
    }
    sats.push(sat);
  }
  return sats;
}

/** Y offset past the limb at which a comet counts as burning up. */
const BURN_MARGIN = 3;

/**
 * Where a comet flying 45 degrees down-left from (x, y) first meets the limb,
 * in the same canvas px as G. `run` is the travel per axis. Null if it leaves
 * the canvas first.
 */
export function cometLimbImpact(
  G: PlanetGeo,
  x: number,
  y: number,
): { x: number; y: number; run: number } | null {
  const f = (t: number) => y + t - (limbY(G, x - t) - BURN_MARGIN);
  if (f(0) >= 0) return { x, y, run: 0 };
  const maxRun = x + 80;
  const step = 2;
  for (let t = step; t <= maxRun; t += step) {
    if (f(t) < 0) continue;
    let lo = t - step;
    let hi = t;
    for (let n = 0; n < 12; n++) {
      const mid = (lo + hi) / 2;
      if (f(mid) >= 0) hi = mid;
      else lo = mid;
    }
    return { x: x - hi, y: y + hi, run: hi };
  }
  return null;
}
