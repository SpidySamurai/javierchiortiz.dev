/**
 * The production line as a pure function of time. `lineFrame(s)` returns every
 * animated value of the scene (strings for points, paths and transforms, numbers
 * for opacities) keyed by the name the markup binds to. No React, no DOM.
 * Split by area: this file owns the belt, stations, plan and the piece; the
 * build, launch and swarm helpers write their own keys into the same frame.
 */
import {
  AXES, AXES_LEN, CIRCLE, CIRCLE_LEN, DIMS, DIMS_LEN, HULL_LEN, HULL_LINES,
} from './cubes';
import {
  B, CYCLE, END_T, FRONT, L, LIFTOFF_T, P, PIV, PY, REST, ROLLER_TURNS, SH, START, TOP, TREAD_PITCH, VIEW_W, ik,
} from './geometry';
import { dPath, expo, lerp, n, pointOnLines, prog } from './math';
import { buildFrame } from './frameBuild';
import { launchFrame } from './frameLaunch';
import { swarmFrame } from './frameSwarm';

export { CYCLE, SH };

/** Clock time (s) at which the product leaves the pad. */
export const LIFTOFF_S = SH + LIFTOFF_T;

export type Frame = Record<string, string | number>;

/** Stage boundaries on the s clock: plan, build, launch. */
export function stageAt(s: number): 0 | 1 | 2 {
  return s < 3.6 ? 0 : s < 9.9 ? 1 : 2;
}

const RING = 'inset 0 0 0 2px var(--ds-primary-container), 0 0 18px color-mix(in srgb, var(--ds-primary-container) 45%, transparent)';
const WARM_RING = 'inset 0 0 0 2px var(--ds-spark), 0 0 18px color-mix(in srgb, var(--ds-spark) 40%, transparent)';
const NAME_ON = 'var(--ds-on-surface)';
const NAME_OFF = 'var(--ds-outline)';

export function lineFrame(s: number): Frame {
  const T = s - SH;
  const f: Frame = { ready: 1 };

  let pieceX: number;
  if (s < 1.2) pieceX = lerp(START, P, expo(prog(s, 0, 1.2)));
  else if (s < 3.6) pieceX = P;
  else if (s < 4.6) pieceX = lerp(P, B, expo(prog(s, 3.6, 4.6)));
  else if (s < 9.9) pieceX = B;
  else if (s < 10.9) pieceX = lerp(B, L, expo(prog(s, 9.9, 10.9)));
  else pieceX = L;

  // Lift-off shake: the whole scene trembles while the engines build up.
  const shk = T >= 10.25 && T < LIFTOFF_T
    ? 0.9 * prog(T, 10.25, LIFTOFF_T)
    : T >= LIFTOFF_T && T < 11.7 ? 2.6 * (1 - prog(T, LIFTOFF_T, 11.7)) : 0;
  f.shake = shk ? `translate(${n(shk * Math.sin(T * 97))} ${n(shk * Math.cos(T * 83))})` : 'translate(0 0)';

  // Belt: treads and rollers only move while the piece travels.
  const travel = pieceX - START;
  const off = ((travel % TREAD_PITCH) + TREAD_PITCH) % TREAD_PITCH;
  const treads: [number, number][][] = [];
  for (let x0 = -40 + off; x0 < VIEW_W + 10; x0 += TREAD_PITCH) treads.push([[x0 + 9, TOP + 3], [x0, FRONT - 3]]);
  f.treadsD = dPath(treads);
  f.rollAng = `rotate(${n(((travel * ROLLER_TURNS * 180) / (L - START)) % 360)})`;

  const planA = prog(s, 1.2, 1.5) * (1 - prog(s, 3.5, 3.9));
  const buildA = prog(s, 4.5, 4.8) * (1 - prog(s, 9.8, 10.2));
  const launchOff = 1 - prog(T, END_T - 0.8, END_T - 0.2);
  const launchA = prog(T, 9.5, 9.8) * launchOff;
  [planA, buildA, launchA].forEach((a, i) => {
    f[`cone${i}.c`] = n(0.18 + 0.82 * a);
    f[`cone${i}.p`] = n(0.1 + 0.6 * a);
    f[`cone${i}.lens`] = n(0.25 + 0.75 * a);
  });
  f.planPlateOp = n(0.45 + 0.55 * planA);
  f.plateGridOp = n(0.3 + 0.7 * planA);
  f.buildPlateOp = n(0.45 + 0.55 * buildA);
  f.padOp = n(0.45 + 0.55 * launchA);
  f.padWarm = n((0.3 + 0.35 * prog(T, 10.25, 10.8) * (1 - prog(T, 11.4, 12.2))) * prog(T, 9.8, 10.3) * launchOff);
  const trailOp = prog(s, 0.1, 0.5) * (1 - prog(T, END_T - 0.9, END_T - 0.2));
  f.trailW = n(Math.max(0, Math.min(pieceX, L)));
  f.trailOp = n(trailOp);
  f.trailGlowOp = n(0.8 * trailOp);

  // Blueprint, drawn stroke by stroke by the drafting arm.
  f['bp.op'] = n(1 - prog(s, 3.6, 4.4));
  f['bp.circleOff'] = n(CIRCLE_LEN * (1 - prog(s, 1.9, 2.45)));
  f['bp.axesOff'] = n(AXES_LEN * (1 - prog(s, 2.45, 2.75)));
  f['bp.dimsOff'] = n(DIMS_LEN * (1 - prog(s, 2.75, 3.0)));
  f['bp.h0'] = n(0.18 * prog(s, 2.3, 2.45));
  f['bp.h1'] = n(0.18 * prog(s, 2.65, 2.75));
  f['bp.h2'] = n(0.18 * prog(s, 2.9, 3.0));
  f['ped.off'] = n(37.7 * (1 - prog(s, 1.9, 3.4)));
  f['ped.ringOp'] = n(s < 4.4 ? 1 : 1 - prog(s, 4.4, 4.8));
  f['ped.dotOp'] = n(prog(s, 3.4, 3.5) * (1 - prog(s, 4.4, 4.8)));

  // Drafting arm.
  let tipRel;
  if (s < 1.9) tipRel = CIRCLE[0][0];
  else if (s < 2.45) tipRel = pointOnLines(CIRCLE, prog(s, 1.9, 2.45));
  else if (s < 2.75) tipRel = pointOnLines(AXES, prog(s, 2.45, 2.75));
  else if (s < 3.0) tipRel = pointOnLines(DIMS, prog(s, 2.75, 3.0));
  else tipRel = pointOnLines(HULL_LINES, prog(s, 3.0, 3.4));
  const armB = expo(prog(s, 1.45, 1.85)) * (1 - expo(prog(s, 3.4, 3.8)));
  const arm = ik(PIV, [lerp(REST[0], P + tipRel[0], armB), lerp(REST[1], PY + tipRel[1], armB)]);
  const a1 = Math.atan2(arm.elbow[1] - PIV[1], arm.elbow[0] - PIV[0]) * 57.2958;
  const a2 = Math.atan2(arm.tip[1] - arm.elbow[1], arm.tip[0] - arm.elbow[0]) * 57.2958;
  f['arm.upperTf'] = `translate(${PIV[0]} ${PIV[1]}) rotate(${n(a1)})`;
  f['arm.foreTf'] = `translate(${n(arm.elbow[0])} ${n(arm.elbow[1])}) rotate(${n(a2)})`;
  f['arm.elbowTf'] = `translate(${n(arm.elbow[0])} ${n(arm.elbow[1])})`;
  f['arm.op'] = n(0.7 + 0.3 * armB);
  f['arm.tx'] = n(arm.tip[0]);
  f['arm.ty'] = n(arm.tip[1]);
  f['arm.tipGlow'] = n(armB * (s >= 1.9 && s < 3.4 ? 1 : 0.3));
  f['arm.tipOp'] = n(0.4 + 0.6 * armB);

  // The product piece: launch writes its transform; the swarm needs its pose.
  const pose = launchFrame(f, s, T, pieceX);
  f['piece.tf'] = `translate(${n(pose.ax)} ${n(pose.ay)}) rotate(${n(pose.tilt)} 0 -20) scale(${n(pose.sc)})`;
  f['piece.op'] = n(pose.op);
  f['piece.shadowOp'] = n(0.45 * (s >= 4.6 ? 1 : 0.35) * (1 - prog(T, LIFTOFF_T, LIFTOFF_T + 0.6)));
  f['piece.hullOff'] = n(HULL_LEN * (1 - prog(s, 3.0, 3.4)));
  f['piece.hullOp'] = n(1 - prog(s, 8.7, 9.1));
  f['piece.ghostOp'] = n(prog(s, 3.0, 3.45) * (1 - prog(s, 8.7, 9.1)));
  f['piece.tailX'] = n(-(s < 1.2 ? 70 * Math.pow(2, -10 * prog(s, 0, 1.2)) : 0));

  swarmFrame(f, T, pose);
  buildFrame(f, s, T);

  // Station labels (HTML).
  const stage = stageAt(s);
  f['lbl.planName'] = stage === 0 ? NAME_ON : NAME_OFF;
  f['lbl.buildName'] = stage === 1 ? NAME_ON : NAME_OFF;
  f['lbl.launchName'] = stage === 2 ? NAME_ON : NAME_OFF;
  f['lbl.planRing'] = planA > 0.5 ? RING : 'none';
  f['lbl.buildRing'] = buildA > 0.5 ? RING : 'none';
  f['lbl.launchRing'] = launchA > 0.5 ? WARM_RING : 'none';

  return f;
}
