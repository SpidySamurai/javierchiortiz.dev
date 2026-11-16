/**
 * Plan station: the blueprint and the two drafting arms. In the main pass arm 1 draws
 * the circle and the axes while arm 2 draws the dimensions and the contour; in the update
 * pass arm 1 traces modules 0-1 and arm 2 modules 2-3 on the tray outlines.
 */
import { AXES, AXES_LEN, CIRCLE, CIRCLE_LEN, DIMS, DIMS_LEN, HULL_LINES } from './cubes';
import { P, PIV, PIV2, PY, REST, REST2, ik } from './geometry';
import { expo, lerp, n, pointOnLines, prog, type Pt } from './math';
import { U_LEN1, U_LEN2, U_LINES1, U_LINES2 } from './updatePass';
import type { Frame } from './frame';

/** One arm pose: reach `b` out from rest toward `tgt`, `drawing` lights the tip. */
function poseArm(f: Frame, id: string, piv: Pt, rest: Pt, tgt: Pt, flip: boolean, k: number, b: number, drawing: boolean): void {
  const pose = ik(piv, [lerp(rest[0], tgt[0], b), lerp(rest[1], tgt[1], b)], flip, 170 * k, 170 * k);
  const a1 = Math.atan2(pose.elbow[1] - piv[1], pose.elbow[0] - piv[0]) * 57.2958;
  const a2 = Math.atan2(pose.tip[1] - pose.elbow[1], pose.tip[0] - pose.elbow[0]) * 57.2958;
  // The mirrored arm keeps the lit edge of its links on top.
  const mir = flip ? ' scale(1 -1)' : '';
  f[`${id}.upperTf`] = `translate(${piv[0]} ${piv[1]}) rotate(${n(a1)})${mir}`;
  f[`${id}.foreTf`] = `translate(${n(pose.elbow[0])} ${n(pose.elbow[1])}) rotate(${n(a2)})${mir}`;
  f[`${id}.elbowTf`] = `translate(${n(pose.elbow[0])} ${n(pose.elbow[1])})`;
  f[`${id}.op`] = n(0.7 + 0.3 * b);
  f[`${id}.tx`] = n(pose.tip[0]);
  f[`${id}.ty`] = n(pose.tip[1]);
  f[`${id}.tipGlow`] = n(b * (drawing ? 1 : 0.3));
  f[`${id}.tipOp`] = n(0.4 + 0.6 * b);
}

export function armsFrame(f: Frame, s: number): void {
  // Main blueprint, shared by both arms: arm 1 circle (1.9-2.5) + axes (2.5-2.95), arm 2 dims (2.05-2.6) + hull (2.65-3.3).
  f['bp.circleOff'] = n(CIRCLE_LEN * (1 - prog(s, 1.9, 2.5)));
  f['bp.axesOff'] = n(AXES_LEN * (1 - prog(s, 2.5, 2.95)));
  f['bp.dimsOff'] = n(DIMS_LEN * (1 - prog(s, 2.05, 2.6)));
  f['bp.h0'] = n(0.18 * prog(s, 2.35, 2.5));
  f['bp.h1'] = n(0.18 * prog(s, 2.85, 2.95));
  f['bp.h2'] = n(0.18 * prog(s, 2.5, 2.6));
  // Update outlines at the plan station.
  f['ubp.op'] = n(s >= 14 ? 1 - prog(s, 15.3, 15.75) : 0);
  f['ubp.1Off'] = n(U_LEN1 * (1 - prog(s, 14.5, 14.95)));
  f['ubp.2Off'] = n(U_LEN2 * (1 - prog(s, 14.55, 15.0)));
  f['ubp.h0'] = n(0.18 * prog(s, 14.85, 14.95));
  f['ubp.h1'] = n(0.18 * prog(s, 14.9, 15.0));

  // Pedestal rings track each arm's share of the drawing.
  const upd = s >= 9;
  const ringOp = upd ? prog(s, 14.1, 14.3) * (1 - prog(s, 15.5, 15.9)) : 1 - prog(s, 4.4, 4.8);
  f['ped.off'] = n(37.7 * (1 - (upd ? prog(s, 14.5, 14.95) : prog(s, 1.9, 2.95))));
  f['ped2.off'] = n(44 * (1 - (upd ? prog(s, 14.55, 15.0) : prog(s, 2.05, 3.3))));
  f['ped.ringOp'] = n(ringOp);
  f['ped2.ringOp'] = n(ringOp);
  f['ped.dotOp'] = n(ringOp * (upd ? prog(s, 14.95, 15.05) : prog(s, 2.95, 3.05)));
  f['ped2.dotOp'] = n(ringOp * (upd ? prog(s, 15.0, 15.1) : prog(s, 3.3, 3.4)));

  let b1: number;
  let b2: number;
  let t1: Pt;
  let t2: Pt;
  let d1: boolean;
  let d2: boolean;
  if (!upd) {
    b1 = expo(prog(s, 1.45, 1.85)) * (1 - expo(prog(s, 3.05, 3.45)));
    const r1 = s < 1.9 ? CIRCLE[0][0] : s < 2.5 ? pointOnLines(CIRCLE, prog(s, 1.9, 2.5)) : pointOnLines(AXES, prog(s, 2.5, 2.95));
    b2 = expo(prog(s, 1.6, 2.0)) * (1 - expo(prog(s, 3.35, 3.75)));
    const r2 = s < 2.65 ? pointOnLines(DIMS, prog(s, 2.05, 2.6)) : pointOnLines(HULL_LINES, prog(s, 2.65, 3.3));
    t1 = [P + r1[0], PY + r1[1]];
    t2 = [P + r2[0], PY + r2[1]];
    d1 = s >= 1.9 && s < 2.95;
    d2 = s >= 2.05 && s < 3.3;
  } else {
    b1 = expo(prog(s, 14.2, 14.5)) * (1 - expo(prog(s, 15.0, 15.3)));
    b2 = expo(prog(s, 14.25, 14.55)) * (1 - expo(prog(s, 15.05, 15.35)));
    t1 = pointOnLines(U_LINES1, prog(s, 14.5, 14.95));
    t2 = pointOnLines(U_LINES2, prog(s, 14.55, 15.0));
    d1 = s >= 14.5 && s < 14.95;
    d2 = s >= 14.55 && s < 15.0;
  }
  poseArm(f, 'a1', PIV, REST, t1, false, 1, b1, d1);
  poseArm(f, 'a2', PIV2, REST2, t2, true, 1.1, b2, d2);
}
