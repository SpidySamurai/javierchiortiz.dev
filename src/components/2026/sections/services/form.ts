/**
 * Geometry of the object that gets planned, built and launched: a small isometric pyramid
 * (2x2 base plus one block on top). Pure data, no React. Local units, origin at the form's centre.
 */

const U = 19;
const W = (U * Math.sqrt(3)) / 2;
const H = U / 2;
/** Vertical centring so the silhouette is symmetric around y = 0. */
const CY = 0.25 * U;

type V3 = readonly [number, number, number];

const r = (n: number) => Math.round(n * 100) / 100;
const pt = ([a, b, c]: V3) => `${r((a - b) * W)} ${r((a + b) * H - c * U - CY)}`;
const poly = (pts: V3[]) => `M${pts.map(pt).join(' L')} Z`;

export interface Cube {
  top: string;
  left: string;
  right: string;
  /** Offset it flies in from, in local units. */
  from: readonly [number, number];
}

function cube(a: number, b: number, c: number, from: readonly [number, number]): Cube {
  return {
    top: poly([[a, b, c + 1], [a + 1, b, c + 1], [a + 1, b + 1, c + 1], [a, b + 1, c + 1]]),
    left: poly([[a, b + 1, c], [a + 1, b + 1, c], [a + 1, b + 1, c + 1], [a, b + 1, c + 1]]),
    right: poly([[a + 1, b, c], [a + 1, b + 1, c], [a + 1, b + 1, c + 1], [a + 1, b, c + 1]]),
    from,
  };
}

/** Back to front, so later blocks paint over earlier ones. */
export const CUBES: readonly Cube[] = [
  cube(0, 0, 0, [-74, -30]),
  cube(1, 0, 0, [78, -26]),
  cube(0, 1, 0, [-70, 34]),
  cube(1, 1, 0, [72, 36]),
  cube(0.5, 0.5, 1, [0, -80]),
];

/** Clean silhouette of the finished form. */
export const OUTLINE = poly([
  [0.5, 0.5, 2], [1.5, 0.5, 2], [1, 0, 1], [2, 0, 1], [2, 0, 0],
  [2, 2, 0], [0, 2, 0], [0, 2, 1], [0, 1, 1], [0.5, 1.5, 2],
]);

const hw = r(2 * W);
const hh = r(1.5 * U - CY);

/** Blueprint construction lines around the form: grid, isometric axes, guide circle, dimensions. */
export const BLUEPRINT = {
  grid: 'M-48 -46 V46 M-24 -46 V46 M0 -46 V46 M24 -46 V46 M48 -46 V46 M-60 -36 H60 M-60 -12 H60 M-60 12 H60 M-60 36 H60',
  axes: 'M-58 -33.5 L58 33.5 M-58 33.5 L58 -33.5',
  circle: 'M-46 0 A46 46 0 1 1 46 0 A46 46 0 1 1 -46 0',
  arc: 'M-27 0 A27 27 0 0 1 0 -27',
  dimH: `M${-hw} 38 V52 M${hw} 38 V52 M${-hw} 48 H${hw} M${-hw - 3} 51 L${-hw + 3} 45 M${hw - 3} 51 L${hw + 3} 45`,
  dimV: `M38 ${-hh} H52 M38 ${hh} H52 M48 ${-hh} V${hh} M45 ${-hh + 3} L51 ${-hh - 3} M45 ${hh + 3} L51 ${hh - 3}`,
} as const;
