/**
 * Update modules. They sit on the tray in scene space (world) while the update is planned,
 * built, tested and launched from the pad; once in the climb they move into the piece's
 * space, ride the orbit with front/back depth and snap in one by one while the LIVE badge
 * counts v1.0 to v1.4.
 * No re-parenting: each module is drawn three times (world, piece back layer, piece front
 * layer) and only the copy of the current space has opacity.
 */
import { SWARM } from './cubes';
import { END_T, GRIP_Y, L, SC_ORB, SW_IN, SW_SLOT_ANGLE, swAng } from './geometry';
import { bez, ease3, expo, lerp, n, prog, type Pt } from './math';
import { ptsStr } from './math';
import { U_FLY, U_IGN, U_IN, U_PASS, U_TL, U_TRACED, UD, UM } from './updatePass';
import type { Frame } from './frame';
import type { Pose } from './frameLaunch';

export function swarmFrame(f: Frame, s: number, T: number, pose: Pose, ux: number): void {
  const { ax, ay, sc } = pose;
  let integrated = 0;
  const orx = 108 / SC_ORB;
  const ory = 26 / SC_ORB;
  const orbitAt = (a: number): Pt => [orx * Math.cos(a), -30 + ory * Math.sin(a)];
  const uFade = 1 - prog(T, END_T - 0.25, END_T);

  f['tray.op'] = n(s >= U_IN[0] - 0.05 ? 1 - prog(s, 19.6, 20.0) : 0);
  f['tray.tf'] = `translate(${n(ux)} 0)`;
  f['uPass.tf'] = `translate(${n(ux)} 0)`;
  f['uPass.op'] = n(Math.sin(Math.PI * prog(s, U_PASS - 0.02, U_PASS + 0.3)));

  SWARM.forEach((m, i) => {
    const u = UM[i];
    const tl = U_TL[i];
    const tO = tl + U_FLY;
    const ti = SW_IN[i];
    const seat: Pt = [ux + u.dx, u.cy];
    const worldTf = (p: Pt, w: number) =>
      `translate(${n(p[0])} ${n(p[1])}) scale(${n(w)}) translate(${n(-m.at[0])} ${n(-m.at[1])})`;
    let wp: Pt | null = null;
    let ws = u.w;
    let pt: Pt = [0, 0];
    let layer: 'W' | 'B' | 'F' = 'F';
    let scl = 1;
    let toBack = false;

    // Outline ghost on the tray: faint on entry, bright once traced, gone once the module is seated.
    f[`sw${i}.ghTf`] = worldTf(seat, u.w);
    f[`sw${i}.ghOp`] = n(
      s >= U_IN[0] - 0.05 && s < UD[i] + 0.3
        ? (0.3 + 0.7 * prog(s, U_TRACED[i] - 0.05, U_TRACED[i] + 0.1)) * (1 - prog(s, UD[i] + 0.12, UD[i] + 0.28))
        : 0,
    );

    if (s < tl) {
      // Dropped by the gripper (top face held at GRIP_Y), then rides the tray; strains on the pad at ignition.
      wp = [seat[0], lerp(GRIP_Y + 20 * u.c, u.cy, expo(prog(s, UD[i], UD[i] + 0.14)))];
      if (s >= U_IGN) {
        const ig = prog(s, U_IGN, tl);
        wp = [wp[0] + 0.5 * ig * Math.cos(s * 77 + i), wp[1] - 1.5 * ig + 0.6 * ig * Math.sin(s * 90 + i * 2)];
      }
    } else if (s < tO) {
      // Climb from the pad to its point on the orbit.
      const uF = ease3(prog(s, tl, tO));
      const aA = swAng(i, tO);
      const lo = orbitAt(aA);
      const end: Pt = [ax + sc * lo[0], ay + sc * lo[1]];
      const p0: Pt = [L + u.dx, u.cy - 1.5];
      wp = bez(p0, [p0[0], end[1] - 40], end, uF);
      ws = lerp(u.w, sc * (1 + 0.08 * Math.sin(aA)) * m.big, uF);
      // A module bound for the back of the orbit passes behind the piece once it is up there.
      toBack = Math.sin(aA) < 0 && uF > 0.5;
    } else if (s < ti) {
      const ang = swAng(i, s);
      pt = orbitAt(ang);
      layer = Math.sin(ang) < 0 ? 'B' : 'F';
      scl = (1 + 0.08 * Math.sin(ang)) * m.big;
    } else {
      const aI = SW_SLOT_ANGLE[i];
      const from = orbitAt(aI);
      const uI = ease3(prog(s, ti, ti + 0.5));
      const tgt = m.at;
      pt = bez(from, [lerp(from[0], tgt[0], 0.3), Math.min(from[1], tgt[1]) - 70], tgt, uI);
      layer = 'F';
      scl = lerp((1 + 0.08 * Math.sin(aI)) * m.big, 1, uI);
      if (uI >= 1) integrated++;
    }
    if (wp) pt = [(wp[0] - ax) / sc, (wp[1] - ay) / sc]; // piece space
    if (wp && !toBack) {
      layer = 'W';
      f[`sw${i}.wtf`] = worldTf(wp, ws);
    } else {
      if (toBack) {
        layer = 'B';
        scl = ws / sc;
      }
      const off: Pt = [pt[0] - m.at[0], pt[1] - m.at[1]];
      f[`sw${i}.tf`] = `translate(${n(off[0])} ${n(off[1])})` +
        (scl !== 1 ? ` translate(${n(m.at[0])} ${n(m.at[1])}) scale(${n(scl)}) translate(${n(-m.at[0])} ${n(-m.at[1])})` : '');
    }
    const op = (s >= UD[i] - 0.04 ? 1 : 0) * uFade;
    for (const l of ['W', 'B', 'F']) f[`sw${i}.op${l}`] = n(l === layer ? op : 0);

    // Mini plumes: a short sputter on the pad, full flame for the climb, out before the orbit.
    const plEnd = Math.sin(swAng(i, tO)) < 0 ? tl + U_FLY / 2 : tO - 0.08; // out before a back-bound module slips behind
    const plOn = s >= U_IGN && s < tO ? prog(s, U_IGN, U_IGN + 0.1) * (1 - prog(s, plEnd - 0.27, plEnd)) : 0;
    if (plOn > 0 && wp) {
      const cw = ws * u.g;
      const bx = wp[0];
      const by = wp[1] + 40 * cw - 3;
      const hw = 26 * cw;
      const len = (s < tl ? 8 + 10 * prog(s, U_IGN, tl) : 18 + 18 * prog(s, tl, tl + 0.15)) * (cw / 0.4) * (1 + 0.15 * Math.sin(s * 47 + i * 2.1));
      f[`uPl${i}.halo`] = ptsStr([[bx - hw, by], [bx + hw, by], [bx + hw * 0.8, by + len * 0.5], [bx, by + len * 1.3], [bx - hw * 0.8, by + len * 0.5]]);
      f[`uPl${i}.outer`] = ptsStr([[bx - hw * 0.5, by], [bx + hw * 0.5, by], [bx + hw * 0.4, by + len * 0.4], [bx, by + len], [bx - hw * 0.4, by + len * 0.4]]);
      f[`uPl${i}.core`] = ptsStr([[bx - hw * 0.3, by], [bx + hw * 0.3, by], [bx + hw * 0.2, by + len * 0.3], [bx, by + len * 0.6], [bx - hw * 0.2, by + len * 0.3]]);
    }
    f[`uPl${i}.haloOp`] = n((0.3 + 0.25 * prog(s, tl, tl + 0.15)) * plOn);
    f[`uPl${i}.outerOp`] = n(plOn);
    f[`uPl${i}.coreOp`] = n(plOn);

    f[`sw${i}.lit`] = n(prog(s, ti + 0.5, ti + 0.65));
    const sn = prog(s, ti + 0.45, ti + 0.85);
    f[`snap${i}.rx`] = n(14 + 46 * sn);
    f[`snap${i}.ry`] = n(6 + 20 * sn);
    f[`snap${i}.op`] = n(sn > 0 && sn < 1 ? 0.9 * (1 - sn) : 0);
    f[`snapGlow${i}.cx`] = n(pt[0]);
    f[`snapGlow${i}.cy`] = n(pt[1]);
    f[`snapGlow${i}.op`] = n(
      s >= tO && s < ti + 0.55 ? 0.5 * prog(s, tO, tO + 0.2) * (0.5 + 0.5 * prog(s, ti, ti + 0.5)) : 0,
    );
  });
  f['badge.ver'] = `v1.${integrated}`;
}
