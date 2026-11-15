/**
 * Mantecado's flat drawing, in the drawing units of MantecadoCat's viewBox.
 * The sitting cat and the run share the head, ears, eyes and face; only the
 * body and tail change with the pose.
 */

/** A 100x90 rounded head. */
export const HEAD_SHAPE =
  'M45 0 H55 A45 45 0 0 1 100 45 A45 45 0 0 1 55 90 H45 A45 45 0 0 1 0 45 A45 45 0 0 1 45 0 Z';
/** The orange diagonal patch, clipped to the head. */
export const HEAD_PATCH = 'M0 0 H66.5 L0 66.5 Z';
export const NOSE_SHAPE = 'M45 60 H55 L50 68 Z';

export const EYE_X = [27, 73] as const;
export const EYE_Y = 55;

/** Ear apex, the pivot at its base, and the resting outward tilt in degrees. */
export const EARS = {
  left: { apex: 20, base: 25.2, resting: -15 },
  right: { apex: 80, base: 74.8, resting: 15 },
} as const;
export const EAR_BASE_Y = 24.3;
export const earShape = (apex: number) => `M${apex} -15 L${apex - 15} 25 L${apex + 15} 25 Z`;
export const earInnerShape = (apex: number) => `M${apex} 0 L${apex - 8} 25 L${apex + 8} 25 Z`;

/** Sitting: a 90x100 body and a pill tail lying to the right. */
export const SIT_BODY_SHAPE = 'M30 150 V90 A40 40 0 0 1 70 50 H74 C96 52 116 76 118 104 V150 Z';
export const SIT_TAIL_SHAPE = 'M90 125 H127.5 A12.5 12.5 0 0 1 127.5 150 H90 Z';

/** Running: the body stretched sideways and the pill tail trailing behind. */
export const RUN_BODY_SHAPE = 'M58 66 H146 A30 30 0 0 1 146 126 H58 A30 30 0 0 1 58 66 Z';
export const RUN_TAIL_SHAPE = 'M-26 80 H28 V105 H-26 A12.5 12.5 0 0 1 -26 80 Z';
