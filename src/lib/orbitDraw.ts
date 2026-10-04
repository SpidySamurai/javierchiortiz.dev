/**
 * Canvas 2D drawing helpers for the hero planet scene. They take a context and
 * plain data from `orbitScene`; no React. Color strings are canvas values.
 */

import {
  easeOutCubic,
  limbY,
  lightPos,
  type CityField,
  type Light,
  type PlanetGeo,
  type RingPoint,
  type RingSat,
} from './orbitScene';

export interface VisLight {
  L: Light;
  x: number;
  y: number;
}

export interface Flare {
  L: Light;
  t0: number;
}

export interface Beam {
  L: Light;
  t0: number;
  dur: number;
}

export interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t0: number;
  flash?: boolean;
}

/** Mutable per-scene effects: flares, uplink beams, burn-up sparks. */
export interface OrbitFx {
  flares: Flare[];
  beams: Beam[];
  sparks: Spark[];
  vis: VisLight[];
  nextFlare: number;
  nextBeam: number;
}

export function createFx(now: number): OrbitFx {
  return { flares: [], beams: [], sparks: [], vis: [], nextFlare: now + 1200, nextBeam: now };
}

export interface PlanetOptions {
  W: number;
  H: number;
  now: number;
  /** Static frame: no twinkle, no flares. */
  still: boolean;
  spin: number;
}

export function drawPlanet(
  ctx: CanvasRenderingContext2D,
  G: PlanetGeo,
  cities: CityField,
  fx: OrbitFx,
  { W, H, now, still, spin }: PlanetOptions,
): void {
  ctx.beginPath();
  ctx.arc(G.cx, G.cy, G.R, 0, Math.PI * 2);
  const body = ctx.createLinearGradient(0, G.limbTop, 0, H);
  body.addColorStop(0, '#121b33');
  body.addColorStop(1, '#0a1021');
  ctx.fillStyle = body;
  ctx.fill();

  for (const C of cities.clusters) {
    const lo = C.lon + spin;
    const cz = Math.cos(lo);
    if (cz <= 0.05) continue;
    const x = G.cx + G.R * C.cl * Math.sin(lo);
    if (x < -60 || x > W + 60) continue;
    const y = G.cy - G.R * C.sl;
    if (y > H + 40) continue;
    const edge = Math.min(1, Math.max(0, (y - limbY(G, x)) / 14));
    if (edge <= 0) continue;
    const r = 8 + C.size * 1.1;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(255,190,120,' + (0.07 * Math.sqrt(cz) * edge).toFixed(3) + ')');
    g.addColorStop(1, 'rgba(255,190,120,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const vis: VisLight[] = [];
  for (const L of cities.lights) {
    const p = lightPos(G, L, spin);
    if (!p) continue;
    if (p.x < -2 || p.x > W + 2 || p.y > H + 2) continue;
    const edge = Math.min(1, Math.max(0, (p.y - limbY(G, p.x)) / 8));
    if (edge <= 0) continue;
    const tw = still ? 0.9 : 0.75 + 0.25 * Math.sin(now * 0.0021 + L.tw);
    const a = L.b * Math.sqrt(p.cz) * edge * tw;
    ctx.fillStyle = 'rgba(255,214,160,' + a.toFixed(3) + ')';
    ctx.fillRect(p.x - L.sz / 2, p.y - L.sz / 2, L.sz, L.sz);
    if (edge >= 1 && L.b > 0.5) vis.push({ L, x: p.x, y: p.y });
  }
  fx.vis = vis;

  if (!still) {
    if (now >= fx.nextFlare && vis.length) {
      fx.nextFlare = now + 650 + Math.random() * 900;
      fx.flares.push({ L: vis[Math.floor(Math.random() * vis.length)].L, t0: now });
    }
    fx.flares = fx.flares.filter((f) => now - f.t0 < 1500);
    for (const f of fx.flares) {
      const p = lightPos(G, f.L, spin);
      if (!p) continue;
      const k = (now - f.t0) / 1500;
      const e = easeOutCubic(k);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.scale(1, 0.45);
      ctx.strokeStyle = 'rgba(255,214,160,' + (0.55 * (1 - k)).toFixed(3) + ')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 3 + 16 * e, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = 'rgba(255,236,210,' + (1 - k).toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const ag = ctx.createRadialGradient(G.cx, G.cy, G.R - 30, G.cx, G.cy, G.R + 90);
  ag.addColorStop(0, 'rgba(128,131,255,0)');
  ag.addColorStop(0.25, 'rgba(150,152,255,0.28)');
  ag.addColorStop(0.3, 'rgba(128,131,255,0.16)');
  ag.addColorStop(0.5, 'rgba(128,131,255,0.05)');
  ag.addColorStop(1, 'rgba(128,131,255,0)');
  ctx.fillStyle = ag;
  ctx.beginPath();
  ctx.arc(G.cx, G.cy, G.R + 90, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(205,207,255,0.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(G.cx, G.cy, G.R, Math.PI, Math.PI * 2);
  ctx.stroke();

  const dx = G.cx + W * 0.34;
  const dy = limbY(G, dx);
  ctx.save();
  ctx.translate(dx, dy);
  ctx.scale(1, 0.3);
  const dg = ctx.createRadialGradient(0, 0, 0, 0, 0, 340);
  dg.addColorStop(0, 'rgba(205,207,255,0.22)');
  dg.addColorStop(1, 'rgba(205,207,255,0)');
  ctx.fillStyle = dg;
  ctx.beginPath();
  ctx.arc(0, 0, 340, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Back half (front=false) or front half (front=true) of the ring line. */
export function drawRing(
  ctx: CanvasRenderingContext2D,
  at: (th: number) => RingPoint,
  front: boolean,
): void {
  ctx.lineWidth = 1;
  let prev: RingPoint | null = null;
  for (let s = 0; s <= 120; s++) {
    const p = at((s / 120) * Math.PI * 2);
    if (prev && p.depth > 0 === front && prev.depth > 0 === front) {
      const a = front ? 0.16 + 0.16 * p.depth : 0.1;
      ctx.strokeStyle = 'rgba(192,193,255,' + a.toFixed(3) + ')';
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
    prev = p;
  }
}

export function drawRingLabel(
  ctx: CanvasRenderingContext2D,
  s: RingSat,
  label: string,
  W: number,
): void {
  if (s.hidden) return;
  ctx.font = (s.active ? 'italic 400 11px' : 'italic 400 10px') + ' Inter, system-ui, sans-serif';
  ctx.letterSpacing = '1.5px';
  ctx.textBaseline = 'alphabetic';
  const right = s.x < W * 0.82;
  ctx.textAlign = right ? 'left' : 'right';
  const a = s.active ? 0.9 : 0.2 + (0.2 * (s.depth + 1)) / 2;
  ctx.fillStyle = 'rgba(192,193,255,' + a.toFixed(3) + ')';
  ctx.fillText(label.toLowerCase(), s.x + (right ? 28 : -28) * s.scale, s.y - 12 * s.scale);
}

export function drawSat(
  ctx: CanvasRenderingContext2D,
  s: RingSat,
  now: number,
  still: boolean,
): void {
  const sc = s.scale || 1;
  ctx.save();
  ctx.globalAlpha = s.alpha;
  ctx.translate(s.x, s.y);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 34 * sc);
  g.addColorStop(0, 'rgba(192,193,255,' + (s.active ? 0.2 : 0.08) + ')');
  g.addColorStop(1, 'rgba(192,193,255,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, 34 * sc, 0, Math.PI * 2);
  ctx.fill();
  let ra = s.ang + Math.PI;
  if (Math.cos(ra) < 0) ra += Math.PI;
  ctx.rotate(ra);
  ctx.scale(1.15 * sc, 1.15 * sc);
  ctx.fillStyle = '#3e3c8f';
  ctx.fillRect(-25, -4, 15, 8);
  ctx.fillRect(10, -4, 15, 8);
  ctx.strokeStyle = 'rgba(175,173,255,0.6)';
  ctx.lineWidth = 0.6;
  [-25, 10].forEach((x0) => {
    ctx.strokeRect(x0, -4, 15, 8);
    ctx.beginPath();
    ctx.moveTo(x0 + 5, -4);
    ctx.lineTo(x0 + 5, 4);
    ctx.moveTo(x0 + 10, -4);
    ctx.lineTo(x0 + 10, 4);
    ctx.moveTo(x0, 0);
    ctx.lineTo(x0 + 15, 0);
    ctx.stroke();
  });
  ctx.strokeStyle = 'rgba(199,196,215,0.75)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(10, 0);
  ctx.stroke();
  ctx.fillStyle = '#dae2fd';
  ctx.fillRect(-5, -4, 10, 8);
  ctx.fillStyle = '#c7c4d7';
  ctx.fillRect(-5, 2, 10, 2);
  ctx.strokeStyle = '#dae2fd';
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.lineTo(0, -6.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -9, 3.2, Math.PI * 0.2, Math.PI * 0.8);
  ctx.stroke();
  if (still || (now + s.i * 233) % 1400 < 160) {
    ctx.fillStyle = 'rgba(255,200,140,0.95)';
    ctx.beginPath();
    ctx.arc(5.5, -5, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Warm uplink beams from nearby city lights to the active satellite. */
export function drawBeams(
  ctx: CanvasRenderingContext2D,
  G: PlanetGeo,
  fx: OrbitFx,
  sat: RingSat | null,
  now: number,
  spin: number,
  maxBeams: number,
): void {
  const on = sat ? (sat.on ?? 1) : 0;
  if (!sat || on <= 0) {
    fx.beams = [];
    return;
  }
  if (now >= fx.nextBeam && fx.beams.length < maxBeams) {
    fx.nextBeam = now + 140 + Math.random() * 220;
    const near = fx.vis.filter((v) => Math.abs(v.x - sat.x) < 300);
    if (near.length) {
      fx.beams.push({
        L: near[Math.floor(Math.random() * near.length)].L,
        t0: now,
        dur: 1300 + Math.random() * 1100,
      });
    }
  }
  const keep: Beam[] = [];
  for (const b of fx.beams) {
    const k = (now - b.t0) / b.dur;
    if (k >= 1) continue;
    const p = lightPos(G, b.L, spin);
    if (!p) continue;
    keep.push(b);
    const fade = Math.sin(Math.PI * k) * on;
    const g = ctx.createLinearGradient(p.x, p.y, sat.x, sat.y);
    g.addColorStop(0, 'rgba(255,214,160,' + (0.38 * fade).toFixed(3) + ')');
    g.addColorStop(1, 'rgba(170,172,255,' + (0.5 * fade).toFixed(3) + ')');
    ctx.strokeStyle = g;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(sat.x, sat.y);
    ctx.stroke();
    const q = (k * 2.2) % 1;
    ctx.fillStyle = 'rgba(255,232,205,' + (0.9 * fade).toFixed(3) + ')';
    ctx.beginPath();
    ctx.arc(p.x + (sat.x - p.x) * q, p.y + (sat.y - p.y) * q, 1.3, 0, Math.PI * 2);
    ctx.fill();
  }
  fx.beams = keep;
}

/** Queue the flash and warm sparks of a comet burning up at (x, y). */
export function addBurnUp(fx: OrbitFx, x: number, y: number, now: number): void {
  for (let q = 0; q < 14; q++) {
    fx.sparks.push({
      x,
      y,
      vx: -40 - Math.random() * 120 + (Math.random() - 0.5) * 60,
      vy: -Math.random() * 90,
      t0: now,
    });
  }
  fx.sparks.push({ flash: true, x, y, vx: 0, vy: 0, t0: now });
}

/** Advance and draw burn-up flashes and sparks. */
export function drawBurnUps(
  ctx: CanvasRenderingContext2D,
  fx: OrbitFx,
  now: number,
  dt: number,
): void {
  const alive: Spark[] = [];
  for (const s of fx.sparks) {
    const k = (now - s.t0) / (s.flash ? 520 : 760);
    if (k >= 1) continue;
    alive.push(s);
    if (s.flash) {
      const fg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 28);
      fg.addColorStop(0, 'rgba(236,238,255,' + (0.6 * (1 - k)).toFixed(3) + ')');
      fg.addColorStop(1, 'rgba(160,162,255,0)');
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 28, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    s.vx *= 0.95;
    s.vy *= 0.95;
    ctx.fillStyle = 'rgba(255,226,190,' + (0.9 * (1 - k)).toFixed(3) + ')';
    ctx.fillRect(s.x - 0.8, s.y - 0.8, 1.6, 1.6);
  }
  fx.sparks = alive;
}
