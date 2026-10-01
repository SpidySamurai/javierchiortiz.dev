/**
 * Mantecado's character moments as pure pose math. No React, no DOM.
 *
 * `momentPose(kind, seconds)` returns every animated channel at a point in the
 * moment. Offsets are in the cat's drawing units and are added to the life
 * motion (breathing, blinking) by the component. Each moment starts and ends
 * at the neutral pose, so it can begin and finish without a visible jump.
 */

export type MomentKind = 'wave' | 'stretch' | 'rocket';

export interface MomentContext {
  /** Rocket: seconds the star takes to fly, so the hop lands when it arrives. */
  flight?: number;
}

export interface MomentPose {
  /** Degrees added to each ear, and a multiplier on ear height. */
  earL: number;
  earR: number;
  earS: number;
  /** Degrees added to the head tilt, and units the head sinks. */
  headRot: number;
  headY: number;
  /** Multiplier on the chest height (1 = relaxed). */
  chest: number;
  /** 0..1 eyelid closure, combined with blinking by taking the larger. */
  lid: number;
  /** 0..1 yawn: how wide the mouth is open. */
  mouth: number;
  /** 0..1 front paws pushed out. */
  paws: number;
  /** Multiplier on eye size. */
  eyeScale: number;
  /** Whole cat: units lifted (negative is up) and squash and stretch around its feet. */
  lift: number;
  squashX: number;
  squashY: number;
  /** 0..1 sparkles around the head. */
  sparkle: number;
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
  headY: 0,
  chest: 1,
  lid: 0,
  mouth: 0,
  paws: 0,
  eyeScale: 1,
  lift: 0,
  squashX: 1,
  squashY: 1,
  sparkle: 0,
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
const easeInOut3 = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

const rocketFlight = (ctx: MomentContext) => Math.min(2.6, Math.max(1, ctx.flight ?? 2));

export function momentSeconds(kind: MomentKind, ctx: MomentContext = {}): number {
  return kind === 'rocket' ? MOMENT_SECONDS + rocketFlight(ctx) - 2 : MOMENT_SECONDS;
}

export function momentPose(kind: MomentKind, u: number, ctx: MomentContext = {}): MomentPose {
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
  if (kind === 'stretch') {
    const squint = prog(u, 0, 0.2) * (1 - prog(u, 2.3, 2.6));
    const closed = prog(u, 0.2, 0.4) * (1 - prog(u, 2.3, 2.6));
    p.lid = Math.max(0.55 * squint, closed);
    const st = expo(prog(u, 0.2, 0.9)) * (1 - expo(prog(u, 2.3, 2.8)));
    p.headY = 8 * st;
    p.chest = 1 - 0.08 * st;
    p.paws = st;
    p.tail = -30 * st;
    const yawn = Math.sin(Math.PI * prog(u, 1.0, 1.9));
    p.mouth = yawn;
    p.headRot = -9 * yawn;
    p.earL = -10 * yawn;
    p.earR = 10 * yawn;
    p.earS = 1 - 0.12 * yawn;
    if (u >= 1.9 && u < 2.3) p.headRot += 5 * Math.sin(((u - 1.9) / 0.4) * 4 * Math.PI) * (1 - prog(u, 1.9, 2.3));
  }
  if (kind === 'rocket') {
    // The hop beats are timed from the moment the star arrives, which is `flight` seconds in.
    const v = u - (rocketFlight(ctx) - 2);
    const re = easeInOut3(prog(u, 0.4, rocketFlight(ctx)));
    const perk = prog(u, 0, 0.3) * (1 - prog(v, 2.9, 3.3));
    p.earL = 8 * perk;
    p.earR = -8 * perk;
    p.earS = 1 + 0.1 * perk;
    p.eyeScale = 1 + 0.12 * prog(u, 0.4, 0.6) * (1 - prog(v, 2.8, 3.1));
    p.headRot = lerp(-7, 9, re) * perk;
    if (v >= 2.0 && v < 2.18) p.lift = -25 * expo(prog(v, 2.0, 2.18));
    else if (v >= 2.18 && v < 2.34) p.lift = -25 * (1 - Math.pow(prog(v, 2.18, 2.34), 2));
    const land = Math.sin(Math.PI * prog(v, 2.34, 2.48));
    p.squashY = 1 - 0.08 * land;
    p.squashX = 1 + 0.05 * land;
    p.happy = prog(v, 2.3, 2.42) * (1 - prog(v, 2.95, 3.1));
    p.sparkle = Math.sin(Math.PI * prog(v, 2.25, 3.1));
    p.tail = -25 * perk + 10 * Math.sin(v * 16) * prog(v, 2.3, 2.45) * (1 - prog(v, 2.95, 3.1));
  }
  return p;
}
