/**
 * The production line as a pure function of time. `lineFrame(s)` returns every
 * animated value of the scene (strings for points, paths and transforms, numbers
 * for opacities) keyed by the name the markup binds to. No React, no DOM.
 * Split by area: this file owns the belt, stations, plan and the piece; the
 * build, launch and swarm helpers write their own keys into the same frame.
 */
import { HULL_LEN } from './cubes';
import {
  B, CYCLE, END_T, FRONT, L, LIFTOFF_T, P, ROLLER_TURNS, SH, START, TOP, TREAD_PITCH, VIEW_W,
} from './geometry';
import { dPath, expo, lerp, n, prog } from './math';
import { armsFrame } from './frameArms';
import { buildFrame } from './frameBuild';
import { launchFrame } from './frameLaunch';
import { swarmFrame } from './frameSwarm';
import { BELT_RUN, UX0, buildAt, padAt, planAt, stageAt, uxAt } from './updatePass';

export { CYCLE, SH };

/** Clock time (s) at which the product leaves the pad. */
export const LIFTOFF_S = SH + LIFTOFF_T;

export type Frame = Record<string, string | number>;

export { stageAt };

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

  // Belt: treads and rollers follow the piece, then the update tray.
  const ux = uxAt(s);
  const travel = pieceX - START + (ux - UX0);
  const off = ((travel % TREAD_PITCH) + TREAD_PITCH) % TREAD_PITCH;
  const treads: [number, number][][] = [];
  for (let x0 = -40 + off; x0 < VIEW_W + 10; x0 += TREAD_PITCH) treads.push([[x0 + 9, TOP + 3], [x0, FRONT - 3]]);
  f.treadsD = dPath(treads);
  // Whole turns over both runs so the spokes match when the loop wraps.
  f.rollAng = `rotate(${n(((travel * ROLLER_TURNS * 360) / BELT_RUN) % 360)})`;

  const planA = planAt(s);
  const buildA = buildAt(s);
  const launchOff = 1 - prog(T, END_T - 0.8, END_T - 0.2);
  const launchA = padAt(s, T, launchOff);
  [planA, buildA, launchA].forEach((a, i) => {
    f[`cone${i}.c`] = n(0.18 + 0.82 * a);
    f[`cone${i}.p`] = n(0.1 + 0.6 * a);
    f[`cone${i}.lens`] = n(0.25 + 0.75 * a);
  });
  f.planPlateOp = n(0.45 + 0.55 * planA);
  f.plateGridOp = n(0.3 + 0.7 * planA);
  f.buildPlateOp = n(0.45 + 0.55 * buildA);
  f.padOp = n(0.45 + 0.55 * launchA);
  // The LED trail restarts under the update tray (hidden for the swap at 13.8).
  const trailOp = prog(s, 0.1, 0.5) * (1 - prog(T, END_T - 0.9, END_T - 0.2)) * (1 - prog(s, 13.45, 13.75) * (1 - prog(s, 13.85, 14.1)));
  f.trailW = n(Math.max(0, s >= 13.8 ? ux : Math.min(pieceX, L)));
  f.trailOp = n(trailOp);
  f.trailGlowOp = n(0.8 * trailOp);

  f['bp.op'] = n(1 - prog(s, 3.6, 4.4));
  armsFrame(f, s);

  // The product piece: launch writes its transform; the swarm needs its pose.
  const pose = launchFrame(f, s, T, pieceX);
  f['piece.tf'] = `translate(${n(pose.ax)} ${n(pose.ay)}) rotate(${n(pose.tilt)} 0 -20) scale(${n(pose.sc)})`;
  f['piece.op'] = n(pose.op);
  f['piece.shadowOp'] = n(0.45 * (s >= 4.6 ? 1 : 0.35) * (1 - prog(T, LIFTOFF_T, LIFTOFF_T + 0.6)));
  f['piece.hullOff'] = n(HULL_LEN * (1 - prog(s, 2.65, 3.3)));
  f['piece.hullOp'] = n(1 - prog(s, 8.7, 9.1));
  f['piece.ghostOp'] = n(prog(s, 3.1, 3.5) * (1 - prog(s, 8.7, 9.1)));
  f['piece.tailX'] = n(-(s < 1.2 ? 70 * Math.pow(2, -10 * prog(s, 0, 1.2)) : 0));

  swarmFrame(f, s, T, pose, ux);
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
