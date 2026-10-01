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
import { SparkToStar } from './SparkToStar';
import { ARRIVE, CYCLE, FIXTURE_P, STAGES, STAGE_ICONS, STATIC_P, T, seg, useSeg, type Stage } from './timeline';

const TRACK_H = 116;
const LABELS_H = 132;
const STATION_FRAC: Record<Stage, number> = { plan: 0.25, build: 0.5, launch: 0.75 };

const BELT_TRACK_CSS = `
@keyframes conv-track-flow { to { background-position: 16px 0; } }

.conv-track-outer {
  position: relative; border-radius: 10px; padding: 2px;
  background: linear-gradient(to right, transparent, color-mix(in srgb, var(--ds-primary) 6%, transparent) 15%, color-mix(in srgb, var(--ds-primary) 9%, transparent) 50%, color-mix(in srgb, var(--ds-primary) 6%, transparent) 85%, transparent);
}
.conv-track-wrap {
  position: relative; height: ${TRACK_H}px; border-radius: 8px;
  background: linear-gradient(180deg, var(--ds-surface-container) 0%, var(--ds-bg) 100%);
}
.conv-zone {
  position: absolute; top: 0; bottom: 0; width: 100px; transform: translateX(-50%); pointer-events: none;
}
.conv-zone-1 { left: 25%; background: radial-gradient(ellipse 50px 46px at 50% 50%, color-mix(in srgb, var(--ds-secondary-container) 22%, transparent) 0%, transparent 100%); }
.conv-zone-2 { left: 50%; background: radial-gradient(ellipse 50px 46px at 50% 50%, color-mix(in srgb, var(--ds-primary-container) 20%, transparent) 0%, transparent 100%); }
.conv-zone-3 { left: 75%; background: radial-gradient(ellipse 50px 46px at 50% 50%, color-mix(in srgb, var(--ds-spark) 14%, transparent) 0%, transparent 100%); }
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

/* Station fixtures: drafting marks, clamp, launch pad. All react to the same cycle progress. */

function PlanTick({ p, i }: { p: MotionValue<number>; i: number }) {
  const h = i % 2 === 0 ? 9 : 5;
  const opacity = useTransform(
    p,
    (v) => 0.25 + 0.75 * seg(v, 0.5 + 0.28 * i, 0.75 + 0.28 * i) * (1 - seg(v, T.leave1[0], T.leave1[1])),
  );
  return <motion.rect x={-18.75 + i * 9} y={-4 - h} width={1.5} height={h} rx={0.75} style={{ opacity, fill: 'var(--ds-primary)' }} />;
}

function PlanMarks({ p }: { p: MotionValue<number> }) {
  return (
    <>
      <rect x={-20} y={-4} width={40} height={1.5} rx={0.75} style={{ fill: 'var(--ds-outline-variant)' }} />
      {[0, 1, 2, 3, 4].map((i) => (
        <PlanTick key={i} p={p} i={i} />
      ))}
    </>
  );
}

function Clamp({ p }: { p: MotionValue<number> }) {
  const press = useTransform(p, (v) => seg(v, T.clamp[0], T.clamp[0] + 0.1) * (1 - seg(v, T.clamp[0] + 0.2, T.clamp[1])));
  const y = useTransform(press, (v) => v * 6);
  const flash = useTransform(press, (v) => 0.5 + 0.5 * v);
  return (
    <motion.g style={{ y }}>
      <rect x={-1} y={-20} width={2} height={14} style={{ fill: 'color-mix(in srgb, var(--ds-primary-vivid) 50%, transparent)' }} />
      <motion.rect x={-22} y={-9} width={44} height={5} rx={2.5} style={{ fill: 'var(--ds-primary-container)', opacity: flash }} />
    </motion.g>
  );
}

function LaunchPad({ p }: { p: MotionValue<number> }) {
  const glow = useTransform(p, (v) => seg(v, T.ignite[0], T.ignite[0] + 0.15) * (1 - seg(v, T.ignite[1], 8.0)));
  return (
    <>
      <rect x={-22} y={-5} width={44} height={2.5} rx={1.25} style={{ fill: 'var(--ds-outline-variant)' }} />
      <motion.rect x={-22} y={-5} width={44} height={2.5} rx={1.25} style={{ fill: 'var(--ds-spark)', opacity: glow }} />
      <Node cx={0} cy={-10} r={3} glow={glow} color="var(--ds-spark)" />
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
        {stage === 'plan' && <PlanMarks p={p} />}
        {stage === 'build' && <Clamp p={p} />}
        {stage === 'launch' && <LaunchPad p={p} />}
      </svg>
    </div>
  );
}

/** Ring that radiates from the station icon exactly when the form arrives. */
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

export default function Factory() {
  const t = useTranslations('common');
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: '120px' });
  const reduceMotion = useReducedMotion();

  const p = useMotionValue(0);
  const [width, setWidth] = useState(1000);

  const framePlan = useMotionValue(STATIC_P.plan);
  const frameBuild = useMotionValue(STATIC_P.build);
  const frameLaunch = useMotionValue(STATIC_P.launch);
  const frames: Record<Stage, MotionValue<number>> = { plan: framePlan, build: frameBuild, launch: frameLaunch };
  const fixPlan = useMotionValue(FIXTURE_P.plan);
  const fixBuild = useMotionValue(FIXTURE_P.build);
  const fixLaunch = useMotionValue(FIXTURE_P.launch);
  const fixtures: Record<Stage, MotionValue<number>> = { plan: fixPlan, build: fixBuild, launch: fixLaunch };

  // Track width drives the station x-positions (resize only, never per frame).
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const update = () => setWidth(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
  const xs = [width * 0.25, width * 0.5, width * 0.75] as const;

  return (
    <div ref={rootRef} className="relative" data-belt-paused={inView && animated ? undefined : ''}>
      <style dangerouslySetInnerHTML={{ __html: BELT_TRACK_CSS }} />

      {/* Station labels pinned at 25 / 50 / 75% */}
      <div className="relative z-10" style={{ height: LABELS_H }}>
        {STAGES.map((stage, i) => {
          const step = t.raw(`services_process.${stage}`) as { name: string; desc: string };
          return (
            <div
              key={stage}
              className="absolute top-0 bottom-0 flex flex-col items-center gap-0.5"
              style={{ left: `${STATION_FRAC[stage] * 100}%`, transform: 'translateX(-50%)' }}
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
                style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif', maxWidth: 150 }}
              >
                {step.desc}
              </p>
              <StationFixture stage={stage} p={animated ? p : fixtures[stage]} />
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
            <SparkToStar p={p} w={width} h={TRACK_H} xs={xs} />
          ) : (
            STAGES.map((stage) => <SparkToStar key={stage} p={frames[stage]} w={width} h={TRACK_H} xs={xs} />)
          )}
        </div>
        <div className="conv-reflection" />
      </div>
    </div>
  );
}
