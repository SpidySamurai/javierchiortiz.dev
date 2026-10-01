'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Node } from '@/components/2026/ui/motion/Node';
import { Pulse } from '@/components/2026/ui/motion/Pulse';
import { Artifact, CARD_H, CARD_W } from './Artifact';
import {
  ARRIVE,
  CYCLE,
  REST,
  STAGES,
  STAGE_ICONS,
  T,
  artifactX,
  seg,
  stamp,
  useSeg,
  type Stage,
} from './timeline';

const TRACK_H = 116;
const LABELS_H = 132;
const STATION_LEFT: Record<Stage, string> = { idea: '25%', build: '50%', launch: '75%' };

const BELT_TRACK_CSS = `
@keyframes conv-track-flow { to { background-position: 16px 0; } }

.conv-track-outer {
  position: relative; border-radius: 10px; padding: 2px;
  background: linear-gradient(to right, transparent, color-mix(in srgb, var(--ds-primary) 6%, transparent) 15%, color-mix(in srgb, var(--ds-primary) 9%, transparent) 50%, color-mix(in srgb, var(--ds-primary) 6%, transparent) 85%, transparent);
}
.conv-track-wrap {
  position: relative; height: ${TRACK_H}px; overflow: hidden; border-radius: 8px;
  background: linear-gradient(180deg, var(--ds-surface-container) 0%, var(--ds-bg) 100%);
}
.conv-zone {
  position: absolute; top: 0; bottom: 0; width: 100px; transform: translateX(-50%); pointer-events: none;
}
.conv-zone-1 { left: 25%; background: radial-gradient(ellipse 50px 46px at 50% 50%, color-mix(in srgb, var(--ds-secondary-container) 22%, transparent) 0%, transparent 100%); }
.conv-zone-2 { left: 50%; background: radial-gradient(ellipse 50px 46px at 50% 50%, color-mix(in srgb, var(--ds-primary-container) 20%, transparent) 0%, transparent 100%); }
.conv-zone-3 { left: 75%; background: radial-gradient(ellipse 50px 46px at 50% 50%, color-mix(in srgb, var(--ds-primary) 12%, transparent) 0%, transparent 100%); }
.conv-tick {
  position: absolute; top: 0; bottom: 0; width: 1px; pointer-events: none;
  background: linear-gradient(to bottom, transparent 5%, color-mix(in srgb, var(--ds-primary) 8%, transparent) 25%, color-mix(in srgb, var(--ds-primary) 14%, transparent) 50%, color-mix(in srgb, var(--ds-primary) 8%, transparent) 75%, transparent 95%);
}
.conv-tick-1 { left: 25%; } .conv-tick-2 { left: 50%; } .conv-tick-3 { left: 75%; }
.conv-dashes {
  position: absolute; top: 50%; left: 0; right: 0; height: 1px; transform: translateY(-50%);
  background-image: repeating-linear-gradient(to right, color-mix(in srgb, var(--ds-primary) 18%, transparent) 0px, color-mix(in srgb, var(--ds-primary) 18%, transparent) 5px, transparent 5px, transparent 16px);
  background-size: 16px 1px;
  animation: conv-track-flow 1s linear infinite;
}

/* Faint reflection beneath the track */
.conv-reflection {
  position: absolute; left: 6px; right: 6px; top: 100%; height: 30px; pointer-events: none;
  background: linear-gradient(180deg, color-mix(in srgb, var(--ds-primary) 8%, transparent), transparent);
  filter: blur(6px); opacity: 0.55;
}

/* Pause the belt dashes when scrolled out of view */
[data-belt-paused] .conv-dashes { animation-play-state: paused; }

@media (prefers-reduced-motion: reduce) {
  .conv-dashes { animation: none !important; }
}
`;

/* ── Station fixtures: lamp, press, emitter. All react to the same cycle progress. ── */

const BURST = Array.from({ length: 10 }, (_, i) => {
  const angle = ((-170 + i * (160 / 9)) * Math.PI) / 180;
  const reach = 11 + ((i * 7) % 4) * 4;
  return { dx: Math.cos(angle) * reach, dy: Math.sin(angle) * reach, r: i % 3 === 0 ? 2.6 : 1.9 };
});

function Particle({ burst, dx, dy, r }: { burst: MotionValue<number>; dx: number; dy: number; r: number }) {
  const x = useTransform(burst, [0, 1], [0, dx]);
  const y = useTransform(burst, [0, 1], [0, dy]);
  const opacity = useTransform(burst, [0, 0.08, 0.5, 1], [0, 1, 0.85, 0]);
  return <motion.circle cx={0} cy={-4} r={r} style={{ x, y, opacity, fill: 'var(--ds-primary)' }} />;
}

function Lamp({ p }: { p: MotionValue<number> }) {
  const glow = useTransform(p, (v) => seg(v, T.arriveIdea, T.arriveIdea + 0.25) * (1 - seg(v, T.leaveIdea, T.leaveIdea + 0.6)));
  return <Node cx={0} cy={-4} r={3.2} glow={glow} />;
}

function Press({ p }: { p: MotionValue<number> }) {
  const y = useTransform(p, (v) => stamp(v) * 9);
  return (
    <motion.g style={{ y }}>
      <rect x={-1} y={-20} width={2} height={14} style={{ fill: 'color-mix(in srgb, var(--ds-primary-vivid) 50%, transparent)' }} />
      <rect x={-22} y={-9} width={44} height={5} rx={2.5} style={{ fill: 'var(--ds-primary-container)' }} />
    </motion.g>
  );
}

function Emitter({ p }: { p: MotionValue<number> }) {
  const burst = useSeg(p, T.arriveLaunch, T.arriveLaunch + 0.8);
  const glow = useTransform(p, (v) => seg(v, T.arriveLaunch, T.arriveLaunch + 0.15) * (1 - seg(v, T.arriveLaunch + 0.3, T.arriveLaunch + 1.3)));
  return (
    <>
      <Node cx={0} cy={-4} r={2.8} glow={glow} color="var(--ds-primary)" />
      {BURST.map((b, i) => (
        <Particle key={i} burst={burst} {...b} />
      ))}
    </>
  );
}

function StationFixture({ stage, p }: { stage: Stage; p: MotionValue<number> }) {
  return (
    <div aria-hidden className="relative w-full flex-1" style={{ minHeight: 20 }}>
      <div
        style={{
          position: 'absolute', top: 2, bottom: 0, left: '50%', width: 1,
          background: 'linear-gradient(to bottom, transparent, color-mix(in srgb, var(--ds-primary-vivid) 38%, transparent))',
        }}
      />
      <svg
        width={60}
        height={40}
        viewBox="-30 -40 60 40"
        style={{ position: 'absolute', left: '50%', bottom: 0, marginLeft: -30, overflow: 'visible' }}
      >
        {stage === 'idea' && <Lamp p={p} />}
        {stage === 'build' && <Press p={p} />}
        {stage === 'launch' && <Emitter p={p} />}
      </svg>
    </div>
  );
}

/** Ring that radiates from the station icon exactly when the artifact arrives. */
function ArrivalRing({ stage, p }: { stage: Stage; p: MotionValue<number> }) {
  const r = useSeg(p, ARRIVE[stage], ARRIVE[stage] + 0.9);
  const scale = useTransform(r, (v) => 0.6 + 1.6 * v);
  const opacity = useTransform(r, (v) => (v > 0 ? 0.55 * (1 - v) : 0));
  return (
    <motion.span
      aria-hidden
      style={{
        position: 'absolute', inset: 0, borderRadius: '50%', pointerEvents: 'none', scale, opacity,
        boxShadow: '0 0 0 1.5px color-mix(in srgb, var(--ds-primary-vivid) 60%, transparent)',
      }}
    />
  );
}

/** Short signal that leads the artifact to the next station. */
function BeltPulses({ p, w }: { p: MotionValue<number>; w: number }) {
  const y = TRACK_H / 2;
  const legs = [
    { from: 0, to: w * 0.25, a: 0, b: 0.55 },
    { from: w * 0.25, to: w * 0.5, a: T.leaveIdea, b: T.leaveIdea + 0.55 },
    { from: w * 0.5, to: w * 0.75, a: T.leaveBuild, b: T.leaveBuild + 0.55 },
    { from: w * 0.75, to: w, a: T.leaveLaunch, b: T.leaveLaunch + 0.55 },
  ];
  return (
    <svg
      aria-hidden
      width={w}
      height={TRACK_H}
      viewBox={`0 0 ${w} ${TRACK_H}`}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      {legs.map((leg, i) => (
        <PulseLeg key={i} p={p} d={`M${leg.from} ${y} H${leg.to}`} a={leg.a} b={leg.b} />
      ))}
    </svg>
  );
}

function PulseLeg({ p, d, a, b }: { p: MotionValue<number>; d: string; a: number; b: number }) {
  const progress = useSeg(p, a, b);
  return <Pulse d={d} progress={progress} length={0.1} />;
}

/* ── The artifact on the belt (animated) ── */

function MovingArtifact({ p, w, scale }: { p: MotionValue<number>; w: MotionValue<number>; scale: MotionValue<number> }) {
  const x = useTransform([p, w], ([pv, wv]: number[]) => artifactX(pv, wv));
  const y = useTransform(p, (v) => stamp(v) * 2);
  return (
    <motion.div
      style={{
        position: 'absolute', left: 0, top: (TRACK_H - CARD_H) / 2, width: CARD_W, height: CARD_H,
        x, y, scale, willChange: 'transform',
      }}
    >
      <Artifact progress={p} />
    </motion.div>
  );
}

function StaticArtifact({ stage, scale }: { stage: Stage; scale: MotionValue<number> }) {
  const p = useMotionValue(REST[stage]);
  return (
    <motion.div
      style={{
        position: 'absolute', left: STATION_LEFT[stage], top: (TRACK_H - CARD_H) / 2,
        width: CARD_W, height: CARD_H, x: '-50%', scale,
      }}
    >
      <Artifact progress={p} />
    </motion.div>
  );
}

export default function Factory() {
  const t = useTranslations('common');
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: '120px' });
  const reduceMotion = useReducedMotion();

  const p = useMotionValue(0);
  const trackW = useMotionValue(1000);
  const cardScale = useMotionValue(1);
  const [width, setWidth] = useState(1000);

  const restIdea = useMotionValue(REST.idea);
  const restBuild = useMotionValue(REST.build);
  const restLaunch = useMotionValue(REST.launch);
  const rest: Record<Stage, MotionValue<number>> = { idea: restIdea, build: restBuild, launch: restLaunch };

  // Track width drives station x-positions and artifact scale (resize only, never per frame).
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const update = () => {
      const w = el.offsetWidth;
      trackW.set(w);
      cardScale.set(Math.max(0.64, Math.min(1, ((w / 4) * 0.9) / CARD_W)));
      setWidth(w);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [trackW, cardScale]);

  // One clock for the whole belt. Paused offscreen and under reduced motion.
  useEffect(() => {
    if (reduceMotion || !inView) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      p.set((p.get() + dt / CYCLE) % 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion, inView, p]);

  const animated = !reduceMotion;

  return (
    <div ref={rootRef} className="relative" data-belt-paused={inView && animated ? undefined : ''}>
      <style dangerouslySetInnerHTML={{ __html: BELT_TRACK_CSS }} />

      {/* Station labels pinned at 25 / 50 / 75% */}
      <div className="relative z-10" style={{ height: LABELS_H }}>
        {STAGES.map((stage, i) => {
          const step = t.raw(`services_process.${stage}`) as { name: string; desc: string };
          const sp = animated ? p : rest[stage];
          return (
            <div
              key={stage}
              className="absolute top-0 bottom-0 flex flex-col items-center gap-0.5"
              style={{ left: STATION_LEFT[stage], transform: 'translateX(-50%)' }}
            >
              <div
                className="relative w-[38px] h-[38px] shrink-0 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--ds-primary-vivid) 12%, transparent)',
                  boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--ds-primary-vivid) 35%, transparent)',
                }}
              >
                {animated && <ArrivalRing stage={stage} p={p} />}
                <span
                  translate="no"
                  className="material-symbols-outlined"
                  style={{ fontSize: 18, color: 'var(--ds-primary-vivid)' }}
                >
                  {STAGE_ICONS[stage]}
                </span>
              </div>
              <span
                className="text-[9px] font-bold uppercase tracking-[0.14em] shrink-0"
                style={{ color: 'var(--ds-primary-vivid)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className="text-[13px] font-black uppercase tracking-wide shrink-0"
                style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
              >
                {step.name}
              </span>
              <p
                className="text-[10.5px] text-center leading-relaxed shrink-0"
                style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif', maxWidth: 120 }}
              >
                {step.desc}
              </p>
              <StationFixture stage={stage} p={sp} />
            </div>
          );
        })}
      </div>

      {/* Track */}
      <div className="conv-track-outer">
        <div className="conv-track-wrap">
          <div className="conv-zone conv-zone-1" />
          <div className="conv-zone conv-zone-2" />
          <div className="conv-zone conv-zone-3" />
          <div className="conv-tick conv-tick-1" />
          <div className="conv-tick conv-tick-2" />
          <div className="conv-tick conv-tick-3" />
          <div className="conv-dashes" />
          {animated ? (
            <>
              <BeltPulses p={p} w={width} />
              <MovingArtifact p={p} w={trackW} scale={cardScale} />
            </>
          ) : (
            STAGES.map((stage) => <StaticArtifact key={stage} stage={stage} scale={cardScale} />)
          )}
        </div>
        <div className="conv-reflection" />
      </div>
    </div>
  );
}
