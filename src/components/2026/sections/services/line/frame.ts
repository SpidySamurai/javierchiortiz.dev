/**
 * The production line as a pure function of time. `lineFrame(s)` returns every
 * animated value of the scene (strings for points, paths and transforms, numbers
 * for opacities) keyed by the name the markup binds to. No React, no DOM.
 */
import {
  AXES, AXES_LEN, B, CIRCLE, CIRCLE_LEN, DIMS, DIMS_LEN, FRONT, HULL_LEN, HULL_LINES, L, P, PIV, PY, REST, START, TOP, ik,
} from './geometry';
import { dPath, expo, lerp, n, pointOnLines, prog } from './math';

/** One loop of the line, in seconds. */
export const CYCLE = 14.7;
/** The launch is shifted by SH so the build has room to iterate. */
export const SH = 1.3;

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
  const f: Frame = {};

  let pieceX: number;
  if (s < 1.2) pieceX = lerp(START, P, expo(prog(s, 0, 1.2)));
  else if (s < 3.6) pieceX = P;
  else if (s < 4.6) pieceX = lerp(P, B, expo(prog(s, 3.6, 4.6)));
  else if (s < 9.9) pieceX = B;
  else if (s < 10.9) pieceX = lerp(B, L, expo(prog(s, 9.9, 10.9)));
  else pieceX = L;

  // Treads only move while the piece travels.
  const off = (((pieceX - START) % 36) + 36) % 36;
  const treads: [number, number][][] = [];
  for (let x0 = -40 + off; x0 < 1290; x0 += 36) treads.push([[x0 + 9, TOP + 3], [x0, FRONT - 3]]);
  f.treadsD = dPath(treads);

  const planActive = prog(s, 1.2, 1.5) * (1 - prog(s, 3.5, 3.9));
  const buildActive = prog(s, 4.5, 4.8) * (1 - prog(s, 9.8, 10.2));
  const launchActive = prog(T, 9.5, 9.8) * (1 - prog(T, 12.6, 13.2));
  const launchOff = 1 - prog(T, 12.6, 13.2);

  f['zone.plan'] = n(0.1 + 0.3 * planActive);
  f['zone.build'] = n(0.1 + 0.3 * buildActive);
  f['zone.launch'] = n(0.08 + 0.3 * launchActive);
  f.planPlateOp = n(0.4 + 0.6 * planActive);
  f.plateGridOp = n(0.3 + 0.7 * planActive);
  f.buildPlateOp = n(0.4 + 0.6 * buildActive);
  f.padOp = n(0.4 + 0.6 * launchActive);
  f.padWarm = n(0.3 * prog(T, 9.8, 10.3) * launchOff);
  f.trailX2 = n(Math.min(pieceX, L));
  f.trailOp = n(prog(s, 0.1, 0.5) * (1 - prog(T, 12.5, 13.2)));

  // Blueprint, drawn stroke by stroke by the drafting arm.
  f['cons.op'] = n(1 - prog(s, 3.6, 4.4));
  f['cons.circleOff'] = n(CIRCLE_LEN * (1 - prog(s, 1.9, 2.45)));
  f['cons.axesOff'] = n(AXES_LEN * (1 - prog(s, 2.45, 2.75)));
  f['cons.dimsOff'] = n(DIMS_LEN * (1 - prog(s, 2.75, 3.0)));

  let tipRel;
  if (s < 1.9) tipRel = CIRCLE[0][0];
  else if (s < 2.45) tipRel = pointOnLines(CIRCLE, prog(s, 1.9, 2.45));
  else if (s < 2.75) tipRel = pointOnLines(AXES, prog(s, 2.45, 2.75));
  else if (s < 3.0) tipRel = pointOnLines(DIMS, prog(s, 2.75, 3.0));
  else tipRel = pointOnLines(HULL_LINES, prog(s, 3.0, 3.4));
  const armBlend = expo(prog(s, 1.45, 1.85)) * (1 - expo(prog(s, 3.4, 3.8)));
  const arm = ik(PIV, [lerp(REST[0], P + tipRel[0], armBlend), lerp(REST[1], PY + tipRel[1], armBlend)]);
  f['arm.ex'] = n(arm.elbow[0]);
  f['arm.ey'] = n(arm.elbow[1]);
  f['arm.tx'] = n(arm.tip[0]);
  f['arm.ty'] = n(arm.tip[1]);
  f['arm.op'] = n(0.55 + 0.45 * armBlend);
  f['arm.tipGlow'] = n(armBlend * (s >= 1.9 && s < 3.4 ? 1 : 0.3));

  // The product piece.
  const tail = s < 1.2 ? 70 * Math.pow(2, -10 * prog(s, 0, 1.2)) : 0;
  f['piece.tf'] = `translate(${n(pieceX)} ${PY}) scale(1)`;
  f['piece.shadowOp'] = n(0.4 * (s >= 4.6 ? 1 : 0.3));
  f['piece.outlineOff'] = n(HULL_LEN * (1 - prog(s, 3.0, 3.4)));
  f['piece.outlineOp'] = n(1 - prog(s, 8.7, 9.1));
  f['piece.tailX'] = n(-tail);

  // Station labels (HTML).
  const stage = stageAt(s);
  f['lbl.planName'] = stage === 0 ? NAME_ON : NAME_OFF;
  f['lbl.buildName'] = stage === 1 ? NAME_ON : NAME_OFF;
  f['lbl.launchName'] = stage === 2 ? NAME_ON : NAME_OFF;
  f['lbl.planRing'] = planActive > 0.5 ? RING : 'none';
  f['lbl.buildRing'] = buildActive > 0.5 ? RING : 'none';
  f['lbl.launchRing'] = launchActive > 0.5 ? WARM_RING : 'none';

  return f;
}
