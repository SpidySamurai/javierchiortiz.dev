/** Pure helpers for Mantecado's behaviour. No React, no DOM. */

import type { ShootingStar, SkyPoint } from './skyEvents';

/** Inactivity before the cat dozes off. */
export const SLEEP_AFTER_MS = 25_000;
/** The cat stays awake while the pointer rests this close. */
export const WAKE_RADIUS_PX = 220;
/** Stars arriving sooner than this after the last followed one are ignored. */
export const STAR_COOLDOWN_MS = 700;
/** A sleeping cat is roused by a star at most this often, so busy skies do not keep it up. */
export const STAR_WAKE_COOLDOWN_MS = 60_000;

/** The welcome wave plays this long after the cat first shows up. */
export const WAVE_WELCOME_MS = 1500;
/** Hovering or focusing the cat after this much inactivity gets a wave. */
export const WAVE_IDLE_MS = 60_000;

export const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

export const lerpPoint = (a: SkyPoint, b: SkyPoint, t: number): SkyPoint => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

/**
 * Pupil offset for a target `dx, dy` pixels away from the face. The pupil
 * leans in proportion to distance (full lean at `reach`) and never leaves the
 * circle of radius `max`.
 */
export function gazeOffset(dx: number, dy: number, max: number, reach = 160): SkyPoint {
  const dist = Math.hypot(dx, dy);
  if (dist < 0.5) return { x: 0, y: 0 };
  const lean = Math.min(1, dist / reach) * max;
  return { x: (dx / dist) * lean, y: (dy / dist) * lean };
}

/** Position 0..1 along the segment where it passes closest to `p`. */
export function closestApproach(from: SkyPoint, to: SkyPoint, p: SkyPoint): number {
  const sx = to.x - from.x;
  const sy = to.y - from.y;
  const len2 = sx * sx + sy * sy;
  if (len2 === 0) return 0;
  const t = ((p.x - from.x) * sx + (p.y - from.y) * sy) / len2;
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

/** True when any part of the star's path is inside the viewport (with a margin). */
export function crossesViewport(star: ShootingStar, width: number, height: number, margin = 80): boolean {
  for (let i = 0; i <= 8; i += 1) {
    const { x, y } = lerpPoint(star.from, star.to, i / 8);
    if (x >= -margin && x <= width + margin && y >= -margin && y <= height + margin) return true;
  }
  return false;
}

/** Drawing space of the cat SVG (the old CSS cat's pixels). */
export const CAT_VIEWBOX = { x: -20, y: -35, w: 170, h: 185 } as const;
/** On-screen size of one drawing unit. */
export const CAT_SCALE = 0.5;
/** How far the cat sinks, in drawing units, while only its head peeks out. */
export const PEEK_Y = 50;
export const HEAD_CENTER: SkyPoint = { x: 50, y: 45 };
/** Farthest a pupil may sit from its eye centre (inner radius 9, pupil radius 4). */
export const PUPIL_MAX = 4.6;
