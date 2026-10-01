/** Pure helpers shared by the production line frame. No React, no DOM. */

export type Pt = readonly [number, number];
export type Polyline = readonly Pt[];

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/** Progress of `s` through the window [a, b], clamped to 0..1. */
export function prog(s: number, a: number, b: number): number {
  return clamp01((s - a) / (b - a));
}

/** Exponential ease-out: snappy arrival, no overshoot. */
export function expo(u: number): number {
  return u >= 1 ? 1 : 1 - Math.pow(2, -10 * u);
}

export function ease3(u: number): number {
  return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
}

export function lerp(a: number, b: number, u: number): number {
  return a + (b - a) * u;
}

/** Round to 2 decimals so attribute strings stay short and stable. */
export function n(v: number): number {
  return Math.round(v * 100) / 100;
}

export function ptsStr(pts: Polyline): string {
  return pts.map((p) => `${n(p[0])},${n(p[1])}`).join(' ');
}

export function dPath(lines: readonly Polyline[]): string {
  return lines
    .map((pl) => pl.map((p, i) => `${i ? 'L' : 'M'}${n(p[0])} ${n(p[1])}`).join(' '))
    .join(' ');
}

function plLen(pl: Polyline): number {
  let l = 0;
  for (let i = 1; i < pl.length; i++) l += Math.hypot(pl[i][0] - pl[i - 1][0], pl[i][1] - pl[i - 1][1]);
  return l;
}

export function linesLen(lines: readonly Polyline[]): number {
  let t = 0;
  for (const pl of lines) t += plLen(pl);
  return t;
}

/** Point at fraction `u` of the total length of a set of polylines. */
export function pointOnLines(lines: readonly Polyline[], u: number): Pt {
  let d = clamp01(u) * linesLen(lines);
  for (const pl of lines) {
    for (let i = 1; i < pl.length; i++) {
      const seg = Math.hypot(pl[i][0] - pl[i - 1][0], pl[i][1] - pl[i - 1][1]);
      if (d <= seg) {
        const t = seg ? d / seg : 0;
        return [lerp(pl[i - 1][0], pl[i][0], t), lerp(pl[i - 1][1], pl[i][1], t)];
      }
      d -= seg;
    }
  }
  const last = lines[lines.length - 1];
  return last[last.length - 1];
}

/** Convex hull (monotone chain). */
export function hull(points: readonly Pt[]): Pt[] {
  const pts = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Pt[] = [];
  const upper: Pt[] = [];
  for (let i = 0; i < pts.length; i++) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], pts[i]) <= 0) lower.pop();
    lower.push(pts[i]);
  }
  for (let i = pts.length - 1; i >= 0; i--) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], pts[i]) <= 0) upper.pop();
    upper.push(pts[i]);
  }
  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

export function bez(p0: Pt, p1: Pt, p2: Pt, u: number): Pt {
  const a = (1 - u) * (1 - u);
  const b = 2 * (1 - u) * u;
  const c = u * u;
  return [a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]];
}
