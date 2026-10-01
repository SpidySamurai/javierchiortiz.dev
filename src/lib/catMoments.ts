/**
 * Mantecado's character moments as pure pose math. No React, no DOM.
 *
 * `momentPose(kind, seconds)` returns every animated channel at a point in the
 * moment. Offsets are in the cat's drawing units and are added to the life
 * motion (breathing, blinking) by the component. Each moment starts and ends
 * at the neutral pose, so it can begin and finish without a visible jump.
 */

export type MomentKind = 'wave';

export interface MomentPose {
  /** Degrees added to each ear, and a multiplier on ear height. */
  earL: number;
  earR: number;
  earS: number;
  /** Degrees added to the head tilt. */
  headRot: number;
  /** Degrees added to the tail swing. */
  tail: number;
  /** Raised limb rotation in degrees, 0 = hanging at rest. */
  pawRot: number;
  /** 0..1 happy squint on both eyes. */
  happy: number;
  /** 0..1 small motion lines beside the waving paw. */
  waveLines: number;
}

export const NEUTRAL_POSE: MomentPose = {
  earL: 0,
  earR: 0,
  earS: 1,
  headRot: 0,
  tail: 0,
  pawRot: 0,
  happy: 0,
  waveLines: 0,
};

/** Length of a standard moment, in seconds. */
export const MOMENT_SECONDS = 3.6;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const prog = (s: number, a: number, b: number) => clamp01((s - a) / (b - a));
/** Exponential ease-out: fast start, long settle. No overshoot. */
const expo = (u: number) => (u >= 1 ? 1 : 1 - Math.pow(2, -10 * u));

export function momentPose(kind: MomentKind, u: number): MomentPose {
  const p = { ...NEUTRAL_POSE };
  if (kind === 'wave') {
    const perk = prog(u, 0, 0.3) * (1 - prog(u, 2.0, 2.4));
    p.earL = 6 * perk;
    p.earR = -6 * perk;
    p.earS = 1 + 0.08 * perk;
    p.headRot = -6 * perk;
    p.tail = 5 * Math.sin(u * 3) * perk;
    const up = expo(prog(u, 0.3, 0.55)) * (1 - expo(prog(u, 1.7, 2.0)));
    const wave = u >= 0.55 && u < 1.7 ? Math.sin(((u - 0.55) / 1.15) * 3 * Math.PI * 2) : 0;
    p.pawRot = 150 * up + 18 * wave * up;
    p.happy = prog(u, 0.6, 0.75) * (1 - prog(u, 1.55, 1.7));
    p.waveLines = u >= 0.6 && u < 1.6 ? 0.5 + 0.5 * Math.abs(Math.sin(u * 12)) : 0;
  }
  return p;
}
