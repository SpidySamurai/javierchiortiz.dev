'use client';

import { useEffect, useId, useRef } from 'react';
import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion';
import { DrawPath } from '@/components/2026/ui/motion/DrawPath';
import { BLUEPRINT, CUBES, OUTLINE, type Cube } from './form';
import { emitShootingStar } from '@/lib/skyEvents';
import { CYCLE, STAR_ANGLE, T, objectX, seg, sparkOpacity, sparkTail, sparkX, starAt, useSeg } from './timeline';

type XS = readonly [number, number, number];

const SPARK = 'var(--ds-spark)';
const HOT = 'color-mix(in srgb, var(--ds-spark) 62%, white)';
const FACES = {
  cool: {
    top: 'color-mix(in srgb, var(--ds-primary-container) 70%, white)',
    left: 'var(--ds-primary-container)',
    right: 'color-mix(in srgb, var(--ds-primary-container) 55%, black)',
  },
  warm: {
    top: HOT,
    left: SPARK,
    right: 'color-mix(in srgb, var(--ds-spark) 60%, black)',
  },
};

/* ── Plan: blueprint construction lines draw themselves around the spark ── */

function Line({ p, win, d, width = 0.8, stroke = 'var(--ds-primary-container)' }: {
  p: MotionValue<number>;
  win: readonly [number, number];
  d: string;
  width?: number;
  stroke?: string;
}) {
  const progress = useSeg(p, win[0], win[1]);
  return <DrawPath d={d} progress={progress} stroke={stroke} strokeWidth={width} />;
}

function Blueprint({ p, x }: { p: MotionValue<number>; x: number }) {
  const opacity = useTransform(p, (v) => 1 - seg(v, T.leave1[0], T.leave1[1]));
  return (
    <g transform={`translate(${x} 0)`}>
      <motion.g style={{ opacity }}>
        <g opacity={0.42}>
          <Line p={p} win={T.grid} d={BLUEPRINT.grid} width={0.6} stroke="var(--ds-outline)" />
        </g>
        <g opacity={0.55}>
          <Line p={p} win={T.axes} d={BLUEPRINT.axes} width={0.7} />
        </g>
        <g opacity={0.72}>
          <Line p={p} win={T.circle} d={BLUEPRINT.circle} width={0.8} />
          <Line p={p} win={T.circle} d={BLUEPRINT.arc} width={0.8} />
        </g>
        <g opacity={0.85}>
          <Line p={p} win={T.dims} d={BLUEPRINT.dimH} width={0.9} stroke="var(--ds-primary)" />
          <Line p={p} win={T.dims} d={BLUEPRINT.dimV} width={0.9} stroke="var(--ds-primary)" />
        </g>
      </motion.g>
    </g>
  );
}

function Outline({ p }: { p: MotionValue<number> }) {
  const progress = useSeg(p, T.outline[0], T.outline[1]);
  const opacity = useTransform(p, (v) => 1 - seg(v, 4.5, 5.4));
  return (
    <motion.g style={{ opacity }}>
      <DrawPath d={OUTLINE} progress={progress} stroke="var(--ds-primary)" strokeWidth={1.4} />
    </motion.g>
  );
}

/* ── Build: blocks fly in one by one and snap into the outline ── */

function Faces({ cube, tone }: { cube: Cube; tone: 'cool' | 'warm' }) {
  const f = FACES[tone];
  const edge = { stroke: 'var(--ds-bg)', strokeWidth: 0.7, strokeLinejoin: 'round' as const };
  return (
    <g>
      <path d={cube.left} fill={f.left} {...edge} />
      <path d={cube.right} fill={f.right} {...edge} />
      <path d={cube.top} fill={f.top} {...edge} />
    </g>
  );
}

function FlyingCube({ p, cube, index }: { p: MotionValue<number>; cube: Cube; index: number }) {
  const start = T.blocks[index];
  const t = useSeg(p, start, start + T.blockDur);
  const x = useTransform(t, (v) => (1 - v) * cube.from[0]);
  const y = useTransform(t, (v) => (1 - v) * cube.from[1]);
  const opacity = useTransform(t, (v) => Math.min(1, v * 5));
  return (
    <motion.g style={{ x, y, opacity }}>
      <Faces cube={cube} tone="cool" />
    </motion.g>
  );
}

function Blocks({ p }: { p: MotionValue<number> }) {
  const ignite = useSeg(p, T.ignite[0], T.ignite[1]);
  const scale = useTransform(p, (v) => 1 - 0.85 * seg(v, 6.95, 7.4));
  const opacity = useTransform(p, (v) => 1 - seg(v, 7.15, 7.45));
  return (
    <motion.g style={{ scale, opacity }}>
      {CUBES.map((cube, i) => (
        <FlyingCube key={i} p={p} cube={cube} index={i} />
      ))}
      <motion.g style={{ opacity: ignite }}>
        {CUBES.map((cube, i) => (
          <Faces key={i} cube={cube} tone="warm" />
        ))}
      </motion.g>
    </motion.g>
  );
}

/* ── Warm light: the spark and the shooting star share one drawing ── */

function Comet({ id, x, y, len, opacity, scale, angle, core, halfWidth }: {
  id: string;
  x: MotionValue<number>;
  y: MotionValue<number>;
  len: MotionValue<number>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  angle: number;
  core: number;
  halfWidth: number;
}) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const tail = (k: number, reach: number) => ([hx, hy, l]: number[]) => {
    const px = -sin * halfWidth * k;
    const py = cos * halfWidth * k;
    const tx = hx - cos * l * reach;
    const ty = hy - sin * l * reach;
    return `M${hx + px} ${hy + py} L${tx} ${ty} L${hx - px} ${hy - py} Z`;
  };
  const d = useTransform([x, y, len], tail(1, 1));
  const dCore = useTransform([x, y, len], tail(0.4, 0.7));
  return (
    <motion.g style={{ opacity }}>
      <motion.path d={d} style={{ fill: `url(#${id}-tail)` }} />
      <motion.path d={dCore} style={{ fill: HOT, opacity: 0.85 }} />
      <motion.g style={{ x, y }}>
        <motion.g style={{ scale }}>
          <circle r={core * 6} fill={`url(#${id}-glow)`} />
          <circle r={core} fill={HOT} />
        </motion.g>
      </motion.g>
    </motion.g>
  );
}

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-tail`} x1="1" y1="0" x2="0" y2="0">
        <stop offset="0" style={{ stopColor: HOT, stopOpacity: 0.95 }} />
        <stop offset="0.35" style={{ stopColor: SPARK, stopOpacity: 0.5 }} />
        <stop offset="1" style={{ stopColor: SPARK, stopOpacity: 0 }} />
      </linearGradient>
      <radialGradient id={`${id}-glow`}>
        <stop offset="0" style={{ stopColor: SPARK, stopOpacity: 0.7 }} />
        <stop offset="1" style={{ stopColor: SPARK, stopOpacity: 0 }} />
      </radialGradient>
    </defs>
  );
}

interface SceneProps {
  /** Cycle progress 0..1. A frozen value renders a still frame. */
  p: MotionValue<number>;
  w: number;
  h: number;
  /** Station x positions in px. */
  xs: XS;
  /** Zoom of the drawing (mobile draws it larger). */
  scale?: number;
}

/** The whole piece: a spark becomes a blueprint, then a built form, then a shooting star. */
export function SparkToStar({ p, w, h, xs, scale = 1 }: SceneProps) {
  const id = useId().replace(/:/g, '');
  const local = xs.map((x) => x / scale) as unknown as XS;
  const wl = w / scale;

  const objX = useTransform(p, (v) => objectX(v, local));
  const igniteGlow = useTransform(p, (v) => seg(v, T.ignite[0], T.ignite[1]) * (1 - seg(v, 7.1, 7.6)) * 0.75);

  const sx = useTransform(p, (v) => sparkX(v, local));
  const sLen = useTransform(p, sparkTail);
  const sOpacity = useTransform(p, sparkOpacity);
  const flat = useMotionValue(0);
  const one = useMotionValue(1);

  const starX = useTransform(p, (v) => starAt(v, local[2], wl).x);
  const starY = useTransform(p, (v) => starAt(v, local[2], wl).y);
  const starLen = useTransform(p, (v) => starAt(v, local[2], wl).len);
  const starOpacity = useTransform(p, (v) => starAt(v, local[2], wl).opacity);
  const starScale = useTransform(p, (v) => starAt(v, local[2], wl).scale);

  // Announce the launch so the rest of the page (the cat) can watch the star lift off.
  const svgRef = useRef<SVGSVGElement>(null);
  const launchX = local[2];
  useEffect(() => {
    const liftP = T.lift[0] / CYCLE;
    const x0 = launchX;
    let prev = p.get();
    return p.on('change', (v) => {
      const crossed = prev < liftP && v >= liftP && v - prev < 0.2;
      prev = v;
      const svg = svgRef.current;
      if (!crossed || !svg) return;
      const rect = svg.getBoundingClientRect();
      const a = starAt(liftP, x0, wl);
      const b = starAt(T.lift[1] / CYCLE, x0, wl);
      const toViewport = (pt: { x: number; y: number }) => ({
        x: rect.left + pt.x * scale,
        y: rect.top + h / 2 + pt.y * scale,
      });
      emitShootingStar({
        from: toViewport(a),
        to: toViewport(b),
        durationMs: (T.lift[1] - T.lift[0]) * 1000,
      });
    });
  }, [p, launchX, wl, scale, h]);

  return (
    <svg
      ref={svgRef}
      aria-hidden
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
    >
      <Defs id={id} />
      <g transform={`translate(0 ${h / 2}) scale(${scale})`}>
        <Blueprint p={p} x={local[0]} />
        <motion.g style={{ x: objX }}>
          <motion.circle r={62} style={{ fill: `url(#${id}-glow)`, opacity: igniteGlow }} />
          <Outline p={p} />
          <Blocks p={p} />
        </motion.g>
        <Comet id={id} x={sx} y={flat} len={sLen} opacity={sOpacity} scale={one} angle={0} core={2.4} halfWidth={1.3} />
        <Comet
          id={id}
          x={starX}
          y={starY}
          len={starLen}
          opacity={starOpacity}
          scale={starScale}
          angle={STAR_ANGLE}
          core={4}
          halfWidth={3.6}
        />
      </g>
    </svg>
  );
}
