/**
 * Build stage: v1 base placed with one misaligned block, test (scan), flag (feedback),
 * improve (gantry realigns); iteration 2 re-tests, takes user feedback, adds the
 * top cube and ships. Writes the cubes, gantry, scan, flag, bubble and the andon board.
 */
import { TOPC } from './cubes';
import { B, BEAM, CAR, CYCLE, FRONT, GRIP_Y, PY, ST, SW_IN, Y0, carAt } from './geometry';
import { expo, lerp, n, prog, ptsStr } from './math';
import { U_PASS, U_SCAN, U_TL, UCAR, UD, UM, buildAt } from './updatePass';
import type { Frame } from './frame';

const ISSUE = 'var(--ds-scene-screen-issue)';
const PASS = 'var(--ds-scene-screen-pass)';
const WARM = 'var(--ds-scene-screen-warm)';
const ON = 'var(--ds-scene-screen-on)';
const MUTED = 'var(--ds-scene-screen-muted)';
const ACCENT = 'var(--ds-scene-screen-accent)';
const VIVID = 'var(--ds-primary-vivid)';
const PC = 'var(--ds-primary-container)';
const OFF = 'var(--ds-scene-screen-off)';
const IDLE_LAMP = 'var(--ds-scene-steel-lo)';

/** Andon events: [start s, iteration, step key]. */
const EV: readonly (readonly [number, number, string])[] = [
  [4.6, 1, 'b'], [6.2, 1, 't'], [6.7, 1, 'f'], [7.0, 1, 'i'], [7.5, 2, 't'], [8.2, 2, 'f'], [8.55, 2, 'i'], [9.1, 2, 't'],
];

export function buildFrame(f: Frame, s: number, T: number): void {
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
    // Boot flicker while the screens switch on.
    let win = prog(T, 10.05 + k * 0.07, 10.2 + k * 0.07);
    if (win > 0 && win < 1) win *= 0.6 + 0.4 * Math.abs(Math.sin(s * 60 + k));
    f[`c${k}.win`] = n(win);
  }

  // Gantry carriage and gripper follow each placement and the realignment.
  const updCar = s >= 15.8 && s < 17.6;
  const carX = s >= 4.5 && s < 9.9 ? carAt(CAR, s) : updCar ? carAt(UCAR, s) : 0;
  let armY = GRIP_Y;
  let holding = false;
  for (let j = 0; j < 5; j++) {
    const st = ST[j];
    if (s >= st - 0.12 && s < st + 0.26) {
      armY = s < st ? GRIP_Y : PY + TOPC[j][1] + seatY[j];
      holding = true;
    } else if (s >= st + 0.26 && s < st + 0.36) armY = lerp(PY + TOPC[j][1], GRIP_Y, expo(prog(s, st + 0.26, st + 0.36)));
  }
  // Update pass: the gripper lowers each module into its outline on the tray.
  if (updCar) {
    for (let j = 0; j < 4; j++) {
      const ud = UD[j];
      const seatTop = UM[j].cy - 20 * UM[j].c;
      if (s >= ud - 0.06 && s < ud + 0.14) {
        armY = lerp(GRIP_Y, seatTop, expo(prog(s, ud, ud + 0.14)));
        holding = true;
      } else if (s >= ud + 0.14 && s < ud + 0.2) armY = lerp(seatTop, GRIP_Y, expo(prog(s, ud + 0.14, ud + 0.2)));
    }
  }
  const c2Top = PY + TOPC[2][1] - 6 * mis + yl;
  if (s >= 7.0 && s < 7.1) armY = lerp(GRIP_Y, c2Top, expo(prog(s, 7.0, 7.1)));
  else if (s >= 7.1 && s < 7.37) {
    armY = c2Top;
    holding = true;
  } else if (s >= 7.37 && s < 7.47) armY = lerp(c2Top, GRIP_Y, expo(prog(s, 7.37, 7.47)));
  const armX = B + carX + (s >= 6.95 && s < 7.47 ? 9 * mis : 0);
  const buildA = buildAt(s);
  f['car.tf'] = `translate(${n(B + carX)} 0)`;
  f['car.ledOp'] = holding ? 1 : 0.35;
  f['car.ledFill'] = holding ? PASS : 'var(--ds-primary)';
  f['sleeve.x'] = n(armX - 4.5);
  f['rod.x'] = n(armX - 2.5);
  f['rod.h'] = n(Math.max(0, armY - 10 - 197));
  f['head.tf'] = `translate(${n(armX)} ${n(armY)})`;
  const gap = holding ? 8.5 : 13;
  f['fing.l'] = n(-gap - 3.5);
  f['fing.r'] = n(gap);
  f['beam.op'] = n(buildA);
  f['beam.glow'] = n(0.55 * buildA);

  // Tests: scan plane, flag on the misaligned block, mint hulls when they pass.
  const scanWin = s < 7.2 ? [6.25, 6.7] : s < 9.0 ? [7.6, 7.95] : s < 12 ? [9.15, 9.45] : U_SCAN;
  const su = prog(s, scanWin[0], scanWin[1]);
  const sy = lerp(BEAM + 30, FRONT - 4, su);
  f['scan.poly'] = ptsStr([[556, sy], [724, sy], [736, sy - 20], [568, sy - 20]]);
  f['scan.y'] = n(sy);
  f['scan.op'] = n(su > 0 && su < 1 ? Math.sin(Math.PI * su) : 0);
  f['flag.op'] = n(prog(s, 6.7, 6.8) * (1 - prog(s, 7.17, 7.3)));
  f['pass.op4'] = n(Math.sin(Math.PI * prog(s, 7.95, 8.3)));
  f['pass.op5'] = n(Math.sin(Math.PI * prog(s, 9.45, 9.85)));
  f['pass.checkOp'] = n(
    Math.max(
      prog(s, 7.95, 8.05) * (1 - prog(s, 8.25, 8.35)),
      prog(s, 9.45, 9.55) * (1 - prog(s, 9.8, 9.95)),
      prog(s, U_PASS, U_PASS + 0.1) * (1 - prog(s, U_PASS + 0.3, U_PASS + 0.4)),
    ),
  );

  // User feedback bubble flies in from the right.
  const fbU = expo(prog(s, 8.2, 8.5));
  f['fb.tf'] = `translate(${n(lerp(1010, B + 82, fbU))} ${n(lerp(150, PY - 112, fbU))})`;
  f['fb.op'] = n(prog(s, 8.2, 8.3) * (1 - prog(s, 8.75, 8.9)));

  andonFrame(f, s);
}

/** Andon board hanging from the gantry: iteration, the four-step cycle, a status line and progress. */
function andonFrame(f: Frame, s: number): void {
  // The board runs the main build (4.5-10.3), then the update pass as iteration 3 (14.2-19.5).
  const updB = s >= 14.2;
  const on = prog(s, 4.5, 4.75) * (1 - prog(s, 9.95, 10.3)) + prog(s, 14.2, 14.45) * (1 - prog(s, 19.1, 19.5));
  f['an.body'] = n(0.4 + 0.6 * on);
  const idle = s < 4.5;
  const iter = updB ? 3 : s < 7.5 ? 1 : 2;
  f['steps.iter'] = `iter${iter}`;
  for (let i = 0; i < 3; i++) f[`pip.${i}`] = i < iter ? PC : OFF;

  let cur = '';
  const done: Record<string, boolean> = {};
  let ver = 'placing';
  let vc = MUTED;
  let lamp = VIVID;
  let pw: number;
  if (!updB) {
    let ci = 0;
    for (let e = 0; e < EV.length; e++) if (s >= EV[e][0]) ci = e;
    if (idle) ci = -1;
    cur = ci < 0 ? '' : EV[ci][2];
    for (let e = 0; e < ci; e++) if (EV[e][1] === EV[ci][1]) done[EV[e][2]] = true;
    if (iter === 2) done.b = true;
    if (s >= 6.2 && s < 6.7) ver = 'testing1';
    else if (s >= 6.7 && s < 7.0) [ver, vc, lamp] = ['issue', ISSUE, ISSUE];
    else if (s >= 7.0 && s < 7.5) ver = 'fixing';
    else if (s >= 7.5 && s < 7.95) ver = 'retesting';
    else if (s >= 7.95 && s < 8.2) [ver, vc, lamp] = ['pass1', PASS, PASS];
    else if (s >= 8.2 && s < 8.55) [ver, vc, lamp] = ['feedback', WARM, WARM];
    else if (s >= 8.55 && s < 9.1) ver = 'improving';
    else if (s >= 9.1 && s < 9.45) ver = 'testing2';
    else if (s >= 9.45) [ver, vc, lamp] = ['ready', PASS, PASS];
    pw = prog(s, 4.6, 9.45);
  } else {
    // The update comes from feedback: design it (IMPROVE), build it, test it.
    done.f = true;
    if (s < 15.3) [ver, cur] = ['uPlan', 'i'];
    else if (s < U_SCAN[0]) {
      [ver, cur] = ['uBuild', 'b'];
      done.i = true;
    } else if (s < U_PASS) {
      [ver, cur] = ['uTest', 't'];
      done.i = done.b = true;
    } else {
      ver = s < U_TL[0] ? 'uReady' : s < SW_IN[3] + 0.65 ? 'uLive' : 'uDone';
      vc = lamp = PASS;
    }
    pw = prog(s, 14.4, U_PASS);
  }
  const allDone = ver === 'ready' || (updB && s >= U_PASS);

  const tailF = 1 - prog(s, CYCLE - 0.6, CYCLE - 0.05);
  const dotOn: Record<string, string> = { b: ACCENT, t: ON, f: iter === 1 ? ISSUE : WARM, i: PASS };
  for (const key of ['b', 't', 'f', 'i']) {
    const isCur = key === cur && !allDone;
    const isDone = allDone || (!!done[key] && key !== cur);
    f[`row.${key}.t`] = isCur ? ON : isDone ? 'var(--ds-scene-screen-done)' : 'var(--ds-scene-screen-dim)';
    f[`row.${key}.dot`] = isCur ? dotOn[key] : isDone ? 'var(--ds-scene-screen-ok-dot)' : OFF;
    f[`row.${key}.r`] = isDone ? 6 : 4.5;
    f[`row.${key}.chk`] = !idle && isDone ? n(tailF) : 0;
    f[`row.${key}.glowFill`] = dotOn[key];
    f[`row.${key}.glow`] = isCur ? 0.7 : 0;
  }
  f['ver.text'] = idle ? '' : ver;
  f['ver.color'] = vc;
  f['ver.op'] = n(tailF);
  f['prog.op'] = n(tailF);
  f['prog.w'] = n(132 * pw);
  f['prog.fill'] = allDone ? PASS : VIVID;
  if (idle) lamp = IDLE_LAMP;
  f['an.lampOp'] = n(idle ? 1 : 0.35 + 0.65 * tailF);
  f['an.lampFill'] = lamp;
  f['an.lampGlow'] = n(0.55 * on);
  f['an.glow'] = n(0.12 * on);
}
