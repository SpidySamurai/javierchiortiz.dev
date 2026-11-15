/**
 * Launch: countdown on the tower, umbilical, booster plumes and ground clouds, the
 * product lifts off and gravity-turns into orbit with exhaust puffs along the climb,
 * "deployed" on the pad; in orbit a heartbeat and a LIVE badge show support.
 * Returns the product pose so the piece transform and the swarm can follow it.
 */
import { A, BOOST_H, NOZ } from './cubes';
import { ARRIVE_T, COUNT, END_T, HB, HB_LEN, L, LIFTOFF_T, ORBIT, PY } from './geometry';
import { bez, dPath, expo, lerp, n, prog, ptsStr, type Pt } from './math';
import type { Frame } from './frame';

export interface Pose {
  ax: number;
  ay: number;
  sc: number;
  tilt: number;
  op: number;
}

/** Heavy start, then it accelerates up and eases into orbit. */
function climb(fu: number): number {
  return fu < 0.42 ? 0.3 * Math.pow(fu / 0.42, 2.4) : 0.3 + 0.7 * (1 - Math.pow(1 - (fu - 0.42) / 0.58, 3));
}

export function launchFrame(f: Frame, s: number, T: number, pieceX: number): Pose {
  const launchOff = 1 - prog(T, END_T - 0.8, END_T - 0.2);
  const launchA = prog(T, 9.5, 9.8) * launchOff;
  const fadeEnd = 1 - prog(T, END_T - 0.25, END_T);
  const dock = expo(prog(T, 9.62, 9.92));
  const liftY = -BOOST_H * A * dock;
  const le = climb(prog(T, LIFTOFF_T, ARRIVE_T));

  let ax = pieceX;
  let ay = PY + liftY;
  let sc = 1;
  let tilt = 0;
  // Ignition: straining against the clamps.
  if (T >= 10.25 && T < LIFTOFF_T) {
    const ig = prog(T, 10.25, LIFTOFF_T);
    ay += -3 * ig + 0.9 * ig * Math.sin(T * 90);
    ax += 0.6 * ig * Math.cos(T * 77);
  }
  if (T >= LIFTOFF_T) {
    const bp = bez([L, PY], [L, 120], ORBIT, le);
    ax = bp[0];
    ay = bp[1] + liftY - 3 * (1 - le) + (T > ARRIVE_T ? 3 * Math.sin((T - ARRIVE_T) * 2.2) : 0);
    sc = lerp(1, 0.55, le);
    tilt = 20 * Math.sin(Math.PI * Math.pow(le, 0.8));
  }

  boosterFrame(f, s, T, dock, ax, ay, sc);

  // Countdown, umbilical, beacon.
  for (let i = 0; i < 3; i++) {
    const v = prog(T, 9.7 + i * 0.15, 9.8 + i * 0.15) * launchOff;
    f[`lamp${i}.glow`] = n(0.8 * v);
    f[`lamp${i}.on`] = n(v);
  }
  const cx2 = 876 + 26 * prog(T, 9.6, 9.8) * (1 - expo(prog(T, 10.1, 10.25)));
  f['umb.w'] = n(cx2 - 876);
  f['umb.clawX'] = n(cx2 - 4);
  f['umb.op'] = n(prog(T, 9.55, 9.65) * (1 - prog(T, 10.2, 10.35)));
  const blink = s % 0.8 < 0.4 ? 1 : 0.25;
  f['beacon.op'] = n(0.3 + 0.7 * launchA * blink);
  f['beacon.glow'] = n(0.7 * launchA * blink);

  groundFrame(f, s, T, le);

  // Orbit ring, satellite, heartbeat, badge.
  const oy = ay - 30 * sc;
  const orx = 118;
  const ory = 28;
  const orbOp = 0.75 * prog(T, 12.45, 12.7) * fadeEnd;
  f['orbit.backD'] = `M${n(ax - orx)} ${n(oy)} A${orx} ${ory} 0 0 1 ${n(ax + orx)} ${n(oy)}`;
  f['orbit.frontD'] = `M${n(ax + orx)} ${n(oy)} A${orx} ${ory} 0 0 1 ${n(ax - orx)} ${n(oy)}`;
  f['orbit.backOp'] = n(orbOp * 0.8);
  f['orbit.frontOp'] = n(orbOp);
  const sa = T * 1.7;
  const sx = ax + orx * Math.cos(sa);
  const sy = oy + ory * Math.sin(sa);
  const front = Math.sin(sa) > 0;
  f['sat.cx'] = n(sx);
  f['sat.cy'] = n(sy);
  f['sat.backOp'] = n(front ? 0 : orbOp * 0.7);
  f['sat.frontOp'] = n(front ? orbOp : 0);
  const hbU = T > 12.65 ? ((T - 12.65) / 1.1) % 1 : 0;
  f['hb.d'] = dPath([HB.map((p): Pt => [ax + p[0], ay - 30 + p[1]])]);
  f['hb.off'] = n(HB_LEN * 0.35 - hbU * HB_LEN * 1.35);
  const hbOp = prog(T, 12.65, 12.8) * fadeEnd;
  f['hb.op'] = n(hbOp);
  f['badge.tf'] = `translate(${n(ax)} ${n(ay - 118)})`;
  f['badge.op'] = n(prog(T, 12.6, 12.75) * fadeEnd);
  f['badge.dot'] = n(0.35 + 0.65 * Math.abs(Math.sin(s * 4)));
  // Live: a soft pulse leaves the module every 1.2 s while it is up.
  for (let k = 0; k < COUNT.pulses; k++) {
    const pu = T > 12.8 ? ((T - 12.8) / 1.2 + k / 3) % 1 : 0;
    f[`pulse${k}.cx`] = n(ax);
    f[`pulse${k}.cy`] = n(ay - 30 * sc);
    f[`pulse${k}.rx`] = n(50 + 120 * pu);
    f[`pulse${k}.ry`] = n(14 + 32 * pu);
    f[`pulse${k}.op`] = n(
      T > 12.8 ? 0.45 * (1 - pu) * prog(pu, 0, 0.1) * prog(T, 12.8, 13.2) * (1 - prog(T, END_T - 0.4, END_T - 0.1)) : 0,
    );
  }

  return { ax, ay, sc, tilt, op: fadeEnd };
}

/** Booster platform: docks under the product, three plumes with halo and flicker, sparks, separation. */
function boosterFrame(f: Frame, s: number, T: number, dock: number, ax: number, ay: number, sc: number): void {
  const sepU = prog(T, 12.3, 13.05);
  f['boost.op'] = n(prog(T, 9.6, 9.75) * (1 - prog(T, 12.45, 13.0)));
  f['boost.tf'] = `translate(${n(-24 * sepU)} ${n(lerp(26, 0, dock) + 150 * sepU * sepU)}) rotate(${n(-28 * sepU)} 0 30)`;
  const plOp = prog(T, 10.2, 10.35) * (1 - prog(T, 12.2, 12.35));
  // Short sputter at ignition, full thrust as it leaves the pad.
  const plLen = 14 + 40 * prog(T, 10.25, 10.6) + 86 * prog(T, 10.75, 11.1);
  const flick = 0.85 + 0.15 * Math.sin(s * 53) * Math.sin(s * 31);
  f['burn.op'] = n(0.8 * plOp * flick);
  NOZ.forEach((q, i) => {
    const x = q[0];
    const y = q[1] + 8;
    const len = plLen * (1 + 0.12 * Math.sin(s * 47 + i * 2.1));
    const w = 1 + 0.25 * prog(T, 10.75, 11.1);
    f[`plume${i}.halo`] = ptsStr([[x - 16 * w, y], [x + 16 * w, y], [x + 24 * w, y + len * 0.45], [x + 8, y + len * 1.25], [x - 8, y + len * 1.25], [x - 24 * w, y + len * 0.45]]);
    f[`plume${i}.outer`] = ptsStr([[x - 9, y], [x + 9, y], [x + 14 * w, y + len * 0.35], [x + 5, y + len], [x - 5, y + len], [x - 14 * w, y + len * 0.35]]);
    f[`plume${i}.core`] = ptsStr([[x - 6, y], [x + 6, y], [x + 4.5, y + len * 0.3], [x, y + len * 0.62], [x - 4.5, y + len * 0.3]]);
    f[`plume${i}.haloOp`] = n(0.55 * plOp * prog(T, 10.7, 11.0) * flick);
    f[`plume${i}.outerOp`] = n(plOp * flick);
    f[`plume${i}.coreOp`] = n(plOp);
    f[`noz${i}.op`] = n(Math.max(plOp, 0.6 * prog(T, 10.05, 10.2) * (1 - prog(T, 12.2, 12.35))));
  });
  for (let k = 0; k < COUNT.sparks; k++) {
    const nz = NOZ[k % 3];
    const pu = (s * 2.4 + k * 0.383) % 1;
    f[`spark${k}.cx`] = n(nz[0] + Math.sin(k * 12.9) * 18 * pu);
    f[`spark${k}.cy`] = n(nz[1] + 10 + pu * plLen * 1.2);
    f[`spark${k}.r`] = n(1.8 * (1 - pu) + 0.4);
    f[`spark${k}.op`] = n(plOp * prog(T, 10.7, 10.95) * (1 - pu));
  }
  const sr = prog(T, 12.3, 12.65);
  f['sep.cx'] = n(ax);
  f['sep.cy'] = n(ay + A * 1.05 * sc);
  f['sep.rx'] = n(10 + 50 * sr);
  f['sep.ry'] = n(3 + 12 * sr);
  f['sep.op'] = n(sr > 0 && sr < 1 ? (1 - sr) * 0.9 : 0);
}

/** Smoke trail, exhaust puffs along the climb, shock rings, ground clouds, pad glow and the DEPLOYED mark. */
function groundFrame(f: Frame, s: number, T: number, le: number): void {
  const liftY = -BOOST_H * A * expo(prog(T, 9.62, 9.92));
  const flightAt = (u: number): Pt => {
    const bq = bez([L, PY], [L, 120], ORBIT, u);
    return [bq[0], bq[1] + liftY + 74 * lerp(1, 0.55, u)];
  };
  const trail: Pt[] = [];
  if (T >= LIFTOFF_T) for (let q = 0; q <= 16; q++) trail.push(flightAt((le * q) / 16));
  const td = trail.length > 1 ? dPath([trail]) : 'M0 0';
  const tOp = T >= LIFTOFF_T ? 0.8 * prog(T, LIFTOFF_T, LIFTOFF_T + 0.2) * (1 - prog(T, 12.6, 13.6)) : 0;
  f['smoke.d'] = td;
  f['smoke.op'] = n(tOp * 0.35);
  f['smoke.coreOp'] = n(tOp);

  // Exhaust puffs: each one is dropped at its moment of the climb, then swells and thins out.
  for (let k = 0; k < COUNT.exhaust; k++) {
    const te = LIFTOFF_T + 0.05 + k * 0.085;
    const age = T - te;
    if (age < 0 || te > 12.25) {
      f[`ex${k}.op`] = 0;
      continue;
    }
    const pt = flightAt(climb(prog(te, LIFTOFF_T, ARRIVE_T)));
    f[`ex${k}.cx`] = n(pt[0] + 6 * Math.sin(k * 3.7) * prog(age, 0, 2));
    f[`ex${k}.cy`] = n(pt[1] + 10 * prog(age, 0, 2.5));
    f[`ex${k}.r`] = n(5 + 15 * expo(prog(age, 0, 1.6)));
    f[`ex${k}.op`] = n(0.38 * prog(age, 0, 0.12) * (1 - prog(age, 0.5, 2.2)));
  }
  for (let k = 0; k < 3; k++) {
    const r = prog(T, 10.6 + k * 0.15, 11.3 + k * 0.15);
    f[`ring${k}.rx`] = n(24 + 150 * r);
    f[`ring${k}.ry`] = n(6 + 30 * r);
    f[`ring${k}.op`] = n(r > 0 ? (1 - r) * 0.9 : 0);
  }
  // Ground clouds roll out from under the pad and settle.
  for (let k = 0; k < COUNT.puffs; k++) {
    const side = k % 2 ? 1 : -1;
    const rank = Math.floor(k / 2);
    const u2 = prog(T, 10.3 + rank * 0.06, 12.9 + rank * 0.15);
    const ou = expo(u2);
    f[`puff${k}.cx`] = n(L + side * (16 + (34 + rank * 19) * ou));
    f[`puff${k}.cy`] = n(336 - 6 * ou - (rank % 2) * 8 * ou);
    f[`puff${k}.r`] = n(6 + (13 + rank * 2.2) * ou);
    f[`puff${k}.op`] = n(u2 > 0 ? 0.36 * prog(u2, 0, 0.08) * (1 - prog(T, 12.4, 13.8)) : 0);
  }
  const flick = 0.85 + 0.15 * Math.sin(s * 53) * Math.sin(s * 31);
  f['ground.op'] = n((0.25 * prog(T, 10.25, 10.6) + 0.35 * prog(T, 10.75, 11.0)) * (1 - prog(T, 11.2, 12.0)) * flick);
  f['deploy.op'] = n(prog(T, 12.3, 12.5) * (1 - prog(T, 13.3, 13.6)));
}
