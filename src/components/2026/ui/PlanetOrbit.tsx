'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  addBurnUp,
  createFx,
  drawBeams,
  drawBurnUps,
  drawLogo,
  drawPlanet,
  drawRing,
  drawRingLabel,
  drawSat,
  type OrbitFx,
} from '@/lib/orbitDraw';
import { onShootingStar } from '@/lib/skyEvents';
import {
  INITIAL_RING_ROT,
  cometLimbImpact,
  eggState,
  genCities,
  isCompact,
  planetGeo,
  ringAngleFor,
  ringGeo,
  ringPoint,
  ringRotation,
  ringSatellites,
  shortestDelta,
  type CityField,
} from '@/lib/orbitScene';

interface PlanetOrbitProps {
  /** Index of the active service, the satellite rotated to the front. */
  activeIndex: number;
  /** False until the service cycler has started; no satellite is active before. */
  started: boolean;
  /** The six translated service labels, drawn lowercased. */
  labels: string[];
  /** `performance.now()` at the easter egg click, or null while no egg runs. */
  eggAt: number | null;
}

/** Mutable scene state kept outside React: it changes every frame. */
interface SceneState {
  W: number;
  H: number;
  dpr: number;
  cityKey: string;
  cities: CityField;
  fx: OrbitFx;
  t0: number;
  last: number;
  raf: number;
  rotFrom: number;
  rotTo: number;
  rotT0: number;
  index: number;
  started: boolean;
  /** Comet burn-ups waiting for their moment, in canvas px. */
  burns: { at: number; x: number; y: number }[];
}

const MAX_DPR = 2;
const SPIN_RATE = 0.000012;

/**
 * Planet horizon, city lights and the six-satellite orbit ring, painted on one
 * canvas that fills its positioned parent. Decorative only.
 */
export default function PlanetOrbit({ activeIndex, started, labels, eggAt }: PlanetOrbitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const propsRef = useRef({ activeIndex, started, labels, eggAt, eggRm: reduceMotion });
  const targetRef = useRef<((now: number) => void) | null>(null);

  // Declared before the scene effect so the scene always reads fresh props.
  useEffect(() => {
    // Snapshot reduced motion when an egg starts, like Hero does for its timers,
    // so both follow the same timeline even if the preference flips mid-egg.
    const prev = propsRef.current;
    const eggRm = eggAt !== null && eggAt === prev.eggAt ? prev.eggRm : reduceMotion;
    propsRef.current = { activeIndex, started, labels, eggAt, eggRm };
    targetRef.current?.(performance.now());
  }, [activeIndex, started, labels, eggAt, reduceMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rm = reduceMotion;
    const start = performance.now();
    const st: SceneState = {
      W: 0,
      H: 0,
      dpr: 1,
      cityKey: '',
      cities: { lights: [], clusters: [] },
      fx: createFx(start),
      t0: start,
      last: start,
      raf: 0,
      rotFrom: INITIAL_RING_ROT,
      rotTo: INITIAL_RING_ROT,
      rotT0: -1e9,
      index: -1,
      started: false,
      burns: [],
    };
    let disposed = false;

    /** Rotate the ring so the active satellite ends at the front. */
    const applyTarget = (now: number) => {
      const p = propsRef.current;
      if (!p.started) return;
      if (st.started && st.index === p.activeIndex) return;
      st.started = true;
      st.index = p.activeIndex;
      const cur = ringRotation(st.rotFrom, st.rotTo, st.rotT0, now).rot;
      const next = cur + shortestDelta(cur, ringAngleFor(st.index));
      st.rotFrom = rm ? next : cur;
      st.rotTo = next;
      st.rotT0 = rm ? -1e9 : now;
      st.fx.beams = [];
    };

    const render = (now: number, dt: number) => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (!W || !H) return;
      const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      if (W !== st.W || H !== st.H || dpr !== st.dpr) {
        st.W = W;
        st.H = H;
        st.dpr = dpr;
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
      }
      const compact = isCompact(W);
      const G = planetGeo(W, H);
      const count = compact ? 24 : 60;
      const key = W + 'x' + H + ':' + count;
      if (key !== st.cityKey) {
        st.cityKey = key;
        st.cities = genCities(G, H, count, Math.random);
        st.fx.flares = [];
        st.fx.beams = [];
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const ringG = ringGeo(G, W);
      const at = (th: number) => ringPoint(ringG, th);
      const rr = rm
        ? { rot: st.rotTo, k: 1 }
        : ringRotation(st.rotFrom, st.rotTo, st.rotT0, now);
      const eggAt = propsRef.current.eggAt;
      const egg = eggAt === null ? null : eggState(now - eggAt, propsRef.current.eggRm);
      const sats = ringSatellites(
        G,
        ringG,
        rr.rot,
        rr.k,
        st.started ? st.index : -1,
        now,
        !rm,
        egg && { state: egg, W },
      );
      const spin = rm ? 0 : (now - st.t0) * SPIN_RATE;

      drawRing(ctx, at, false, egg?.q ?? 0);
      sats.filter((s) => !s.front).forEach((s) => drawSat(ctx, s, now, rm));
      drawPlanet(ctx, G, st.cities, st.fx, {
        W,
        H,
        now,
        still: rm,
        spin,
        red: egg?.red ?? 0,
      });
      drawRing(ctx, at, true, egg?.q ?? 0);
      const active = sats.find((s) => s.active) ?? null;
      if (!rm) drawBeams(ctx, G, st.fx, active, now, spin, compact ? 4 : 9);
      if (egg) drawLogo(ctx, sats, egg);
      sats
        .filter((s) => s.front)
        .sort((a, b) => a.depth - b.depth)
        .forEach((s) => drawSat(ctx, s, now, rm));
      const names = propsRef.current.labels;
      const quietLabels = egg !== null && egg.q > 0.05;
      sats.forEach((s) => {
        if (quietLabels) return;
        if (compact && !s.active) return;
        drawRingLabel(ctx, s, names[s.i] ?? '', W);
      });
      if (!rm) {
        const due = st.burns.filter((b) => b.at <= now);
        st.burns = st.burns.filter((b) => b.at > now);
        for (const b of due) if (now - b.at < 1000) addBurnUp(st.fx, b.x, b.y, now);
        drawBurnUps(ctx, st.fx, now, dt);
      }
    };

    const drawStatic = () => {
      if (disposed) return;
      applyTarget(performance.now());
      render(performance.now(), 0);
    };

    const loop = (now: number) => {
      st.raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, Math.max(0, (now - st.last) / 1000));
      st.last = now;
      render(now, dt);
    };
    const play = () => {
      if (st.raf) return;
      st.last = performance.now();
      st.raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      cancelAnimationFrame(st.raf);
      st.raf = 0;
    };

    targetRef.current = rm ? drawStatic : applyTarget;
    applyTarget(performance.now());

    // Hero comets keep flying behind the opaque planet; play the burn-up where
    // their path first meets the limb, when they get there.
    const offStar = rm
      ? null
      : onShootingStar((star) => {
          // Skip while paused offscreen: only render() drains the queue.
          if (star.source !== 'hero' || !st.W || !st.H || !st.raf) return;
          const rect = canvas.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          const kx = st.W / rect.width;
          const ky = st.H / rect.height;
          const fromX = (star.from.x - rect.left) * kx;
          const fromY = (star.from.y - rect.top) * ky;
          const toX = (star.to.x - rect.left) * kx;
          const toY = (star.to.y - rect.top) * ky;
          const hit = cometLimbImpact(planetGeo(st.W, st.H), fromX, fromY);
          // A hit past the left edge means the comet leaves before reaching the limb.
          if (!hit || hit.x < 0) return;
          const path = Math.hypot(toX - fromX, toY - fromY);
          const frac = path > 0 ? Math.min(1, (hit.run * Math.SQRT2) / path) : 1;
          st.burns.push({ at: performance.now() + star.durationMs * frac, x: hit.x, y: hit.y });
        });

    let io: IntersectionObserver | null = null;
    let ro: ResizeObserver | null = null;
    if (rm) {
      drawStatic();
      ro = new ResizeObserver(drawStatic);
      ro.observe(canvas);
      void document.fonts?.ready.then(drawStatic);
    } else {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) play();
          else pause();
        },
        { threshold: 0 },
      );
      io.observe(canvas);
    }

    return () => {
      disposed = true;
      targetRef.current = null;
      pause();
      offStar?.();
      io?.disconnect();
      ro?.disconnect();
    };
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full block"
      style={{ pointerEvents: 'none' }}
    />
  );
}
