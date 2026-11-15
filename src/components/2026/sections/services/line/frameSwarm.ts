/**
 * Update swarm: four modules leave the pad, ride the orbit (front/back depth), then
 * snap into the product one by one while the LIVE badge counts v1.0 to v1.4.
 * Depth without re-parenting: each module is drawn in a back and a front layer and
 * only one layer's opacity is non-zero at a time.
 */
import { SWARM } from './cubes';
import { END_T, L, PY, SC_ORB, SW_A0, SW_IN, SW_LAUNCH, SW_ORB, SW_W } from './geometry';
import { bez, ease3, lerp, n, prog, type Pt } from './math';
import type { Frame } from './frame';
import type { Pose } from './frameLaunch';

export function swarmFrame(f: Frame, T: number, pose: Pose): void {
  const { ax, ay, sc } = pose;
  const fadeEnd = 1 - prog(T, END_T - 0.25, END_T);
  let integrated = 0;
  const padL: Pt = [(L - ax) / (sc || 1), (PY - 20 - ay) / (sc || 1)];
  const orx = 108 / SC_ORB;
  const ory = 26 / SC_ORB;
  const orbitAt = (a: number): Pt => [orx * Math.cos(a), -30 + ory * Math.sin(a)];

  SWARM.forEach((m, i) => {
    const tl = SW_LAUNCH + i * 0.14;
    const ti = SW_IN[i];
    const ang = SW_A0[i] + SW_W * (T - SW_ORB);
    let pt: Pt;
    let behind: boolean;
    let scl: number;
    if (T < SW_ORB) {
      const uL = ease3(prog(T, tl, SW_ORB));
      const a0p = orbitAt(SW_A0[i]);
      pt = bez(padL, [padL[0], a0p[1] - 120], a0p, uL);
      behind = Math.sin(SW_A0[i]) < 0;
      scl = lerp(0.5, 1, uL) * m.big;
    } else if (T < ti) {
      pt = orbitAt(ang);
      behind = Math.sin(ang) < 0;
      scl = (1 + 0.08 * Math.sin(ang)) * m.big;
    } else {
      const aI = SW_A0[i] + SW_W * (ti - SW_ORB);
      const from = orbitAt(aI);
      const uI = ease3(prog(T, ti, ti + 0.5));
      const tgt = m.at;
      pt = bez(from, [lerp(from[0], tgt[0], 0.3), Math.min(from[1], tgt[1]) - 70], tgt, uI);
      behind = false;
      scl = lerp((1 + 0.08 * Math.sin(aI)) * m.big, 1, uI);
      if (uI >= 1) integrated++;
    }
    const off: Pt = [pt[0] - m.at[0], pt[1] - m.at[1]];
    f[`sw${i}.tf`] = `translate(${n(off[0])} ${n(off[1])})` +
      (scl !== 1 ? ` translate(${n(m.at[0])} ${n(m.at[1])}) scale(${n(scl)}) translate(${n(-m.at[0])} ${n(-m.at[1])})` : '');
    const op = prog(T, tl, tl + 0.12) * fadeEnd;
    f[`sw${i}.opB`] = n(behind ? op : 0);
    f[`sw${i}.opF`] = n(behind ? 0 : op);
    f[`sw${i}.lit`] = n(prog(T, ti + 0.5, ti + 0.65));
    const sn = prog(T, ti + 0.45, ti + 0.85);
    f[`snap${i}.rx`] = n(14 + 46 * sn);
    f[`snap${i}.ry`] = n(6 + 20 * sn);
    f[`snap${i}.op`] = n(sn > 0 && sn < 1 ? 0.9 * (1 - sn) : 0);
    f[`snapGlow${i}.cx`] = n(pt[0]);
    f[`snapGlow${i}.cy`] = n(pt[1]);
    f[`snapGlow${i}.op`] = n(
      T >= tl && T < ti + 0.55 ? 0.5 * prog(T, tl, tl + 0.2) * (T < SW_ORB ? 1 : 0.5 + 0.5 * prog(T, ti, ti + 0.5)) : 0,
    );
  });
  f['badge.ver'] = `v1.${integrated}`;
}
