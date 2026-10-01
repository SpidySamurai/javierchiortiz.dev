/**
 * Tiny typed pub/sub for things that cross the sky. Emitters (hero comets, the
 * factory launch) announce a shooting star in viewport coordinates; listeners
 * (the Mantecado cat) decide whether to react. No React, no DOM access.
 */

export interface SkyPoint {
  x: number;
  y: number;
}

export interface ShootingStar {
  /** Where the star becomes visible, in viewport (client) coordinates. */
  from: SkyPoint;
  /** Where it leaves, in viewport (client) coordinates. */
  to: SkyPoint;
  /** How long the star takes to travel from `from` to `to`. */
  durationMs: number;
}

type ShootingStarListener = (star: ShootingStar) => void;

const listeners = new Set<ShootingStarListener>();

export function emitShootingStar(star: ShootingStar): void {
  for (const listener of Array.from(listeners)) {
    try {
      listener(star);
    } catch {
      // A faulty listener must never break the emitter's own animation.
    }
  }
}

export function onShootingStar(listener: ShootingStarListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
