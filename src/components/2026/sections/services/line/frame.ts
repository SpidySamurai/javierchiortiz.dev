/**
 * The production line as a pure function of time. `lineFrame(s)` returns every
 * animated value of the scene (strings for points, paths and transforms, numbers
 * for opacities) keyed by the name the markup binds to. No React, no DOM.
 */
import {
  AXES, AXES_LEN, B, BEAM, CIRCLE, CIRCLE_LEN, DIMS, DIMS_LEN, FRONT, GRIP_Y, HULL_LEN, HULL_LINES, L, P, PIV, PY, REST,
  ST, START, TOP, TOPC, Y0, carAt, ik,
} from './geometry';
import { dPath, expo, lerp, n, pointOnLines, prog } from './math';

const ISSUE = 'var(--ds-issue)';
const PASS = 'var(--ds-pass)';
const SPARK = 'var(--ds-spark)';
const STEP_ON = 'var(--ds-on-surface)';
const STEP_OFF = 'var(--ds-outline)';
const DOT_OFF = 'var(--ds-outline-variant)';

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

  buildFrame(f, s, T);

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

/**
 * Build: v1 base placed with one misaligned block, test (scan), flag (feedback),
 * improve (gantry realigns); iteration 2 re-tests, takes user feedback, adds the
 * top cube and ships. Writes the cubes, gantry, scan, flag, bubble and step indicator.
 */
function buildFrame(f: Frame, s: number, T: number): void {
  const fixP = expo(prog(s, 7.13, 7.27));
  const mis = 1 - fixP;
  const yl = -18 * (expo(prog(s, 7.1, 7.23)) - expo(prog(s, 7.25, 7.37)));
  const seatY: number[] = [];
  for (let k = 0; k < 5; k++) {
    const drop = expo(prog(s, ST[k], ST[k] + 0.26));
    const yOff = lerp(Y0[k], 0, drop);
    seatY.push(yOff);
    let tf = `translate(0 ${n(yOff)})`;
    if (k === 2) {
      tf = `translate(${n(9 * mis)} ${n(yOff - 6 * mis + yl)}) rotate(${n(-12 * mis)} ${n(TOPC[2][0])} ${n(TOPC[2][1] + 17)})`;
    }
    f[`c${k}.tf`] = tf;
    f[`c${k}.op`] = s >= ST[k] - 0.06 && s >= 4.6 ? 1 : 0;
    f[`c${k}.win`] = n(prog(T, 10.05 + k * 0.07, 10.2 + k * 0.07));
  }

  // Gantry carriage and grip follow each placement and the realignment.
  const carX = s >= 4.5 && s < 9.9 ? carAt(s) : 0;
  let armY = GRIP_Y;
  for (let j = 0; j < 5; j++) {
    const st = ST[j];
    if (s >= st && s < st + 0.26) armY = PY + TOPC[j][1] + seatY[j];
    else if (s >= st + 0.26 && s < st + 0.36) armY = lerp(PY + TOPC[j][1], GRIP_Y, expo(prog(s, st + 0.26, st + 0.36)));
  }
  const c2Top = PY + TOPC[2][1] - 6 * mis + yl;
  if (s >= 7.0 && s < 7.1) armY = lerp(GRIP_Y, c2Top, expo(prog(s, 7.0, 7.1)));
  else if (s >= 7.1 && s < 7.37) armY = c2Top;
  else if (s >= 7.37 && s < 7.47) armY = lerp(c2Top, GRIP_Y, expo(prog(s, 7.37, 7.47)));
  const armX = B + carX + (s >= 6.95 && s < 7.47 ? 9 * mis : 0);
  const buildActive = prog(s, 4.5, 4.8) * (1 - prog(s, 9.8, 10.2));
  f['gantry.carX'] = n(B + carX - 12);
  f['gantry.armX'] = n(armX);
  f['gantry.armY'] = n(armY);
  f['gantry.gripD'] = `M${n(armX - 10)} ${n(armY)} L${n(armX + 10)} ${n(armY)}`;
  f['gantry.glow'] = n(0.45 * buildActive);

  // Tests: scan beam, flag on the misaligned block, mint hulls when they pass.
  const scanWin = s < 7.2 ? [6.25, 6.7] : s < 9.0 ? [7.6, 7.95] : [9.15, 9.45];
  const su = prog(s, scanWin[0], scanWin[1]);
  f['scan.y'] = n(lerp(BEAM + 26, FRONT - 4, su));
  f['scan.op'] = n(su > 0 && su < 1 ? Math.sin(Math.PI * su) : 0);
  f['flag.op'] = n(prog(s, 6.7, 6.8) * (1 - prog(s, 7.17, 7.3)));
  f['pass.op4'] = n(Math.sin(Math.PI * prog(s, 7.95, 8.3)));
  f['pass.op5'] = n(Math.sin(Math.PI * prog(s, 9.45, 9.85)));
  f['pass.checkOp'] = n(
    Math.max(
      prog(s, 7.95, 8.05) * (1 - prog(s, 8.25, 8.35)),
      prog(s, 9.45, 9.55) * (1 - prog(s, 9.8, 9.95)),
    ),
  );

  // User feedback bubble flies in from the right.
  const fbU = expo(prog(s, 8.2, 8.5));
  f['fb.tf'] = `translate(${n(lerp(1010, B + 74, fbU))} ${n(lerp(140, PY - 116, fbU))})`;
  f['fb.op'] = n(prog(s, 8.2, 8.3) * (1 - prog(s, 8.75, 8.9)));

  // Step indicator.
  f['steps.op'] = n(prog(s, 4.6, 4.8) * (1 - prog(s, 9.9, 10.1)));
  f['steps.iter'] = s < 7.5 ? 'iter1' : 'iter2';
  let cur = 'b';
  if (s >= 6.2 && s < 6.7) cur = 't';
  else if (s >= 6.7 && s < 7.0) cur = 'f';
  else if (s >= 7.0 && s < 7.5) cur = 'i';
  else if (s >= 7.5 && s < 8.2) cur = 't';
  else if (s >= 8.2 && s < 8.55) cur = 'f';
  else if (s >= 8.55 && s < 9.1) cur = 'i';
  else if (s >= 9.1) cur = 't';
  const dotOn: Record<string, string> = { b: 'var(--ds-primary)', t: STEP_ON, f: s < 7.5 ? ISSUE : SPARK, i: PASS };
  for (const key of ['b', 't', 'f', 'i']) {
    f[`steps.${key}.c`] = cur === key ? STEP_ON : STEP_OFF;
    f[`steps.${key}.dot`] = cur === key ? dotOn[key] : DOT_OFF;
  }

  let ver = 'placing';
  let verColor = 'var(--ds-on-surface-variant)';
  if (s >= 6.2 && s < 6.7) ver = 'testing1';
  else if (s >= 6.7 && s < 7.0) [ver, verColor] = ['issue', ISSUE];
  else if (s >= 7.0 && s < 7.5) ver = 'fixing';
  else if (s >= 7.5 && s < 7.95) ver = 'retesting';
  else if (s >= 7.95 && s < 8.2) [ver, verColor] = ['pass1', PASS];
  else if (s >= 8.2 && s < 8.55) [ver, verColor] = ['feedback', SPARK];
  else if (s >= 8.55 && s < 9.1) ver = 'improving';
  else if (s >= 9.1 && s < 9.45) ver = 'testing2';
  else if (s >= 9.45) [ver, verColor] = ['ready', PASS];
  f['ver.text'] = ver;
  f['ver.color'] = verColor;
}
