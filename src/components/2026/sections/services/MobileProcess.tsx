'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion } from 'framer-motion';
import type { AnimationPlaybackControls } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { SparkToStar } from './SparkToStar';
import { CYCLE, REST, STAGES, STAGE_ICONS, STATIC_P } from './timeline';

const STEP_INTERVAL = 3800;
const STAGE_H = 230;

/** Mobile: the same motion graphic as a stepper. Each step plays its stage into view. */
export default function MobileProcess() {
  const t = useTranslations('common');
  const [step, setStep] = useState(0);
  const [width, setWidth] = useState(326);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef);
  const inViewRef = useRef(inView);
  const controlsRef = useRef<AnimationPlaybackControls | undefined>(undefined);
  const reduceMotion = useReducedMotion();
  const p = useMotionValue(0);
  const frame = useMotionValue(STATIC_P.plan);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setWidth(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const id = setInterval(() => setStep((s) => (s + 1) % STAGES.length), STEP_INTERVAL);
    return () => clearInterval(id);
  }, [inView, reduceMotion]);

  // Nothing plays offscreen.
  useEffect(() => {
    inViewRef.current = inView;
    if (inView) controlsRef.current?.play();
    else controlsRef.current?.pause();
  }, [inView]);

  useEffect(() => {
    if (reduceMotion) {
      frame.set(STATIC_P[STAGES[step]]);
      return;
    }
    const target = REST[STAGES[step]];
    const el = stageRef.current;
    // Looping or going back: fade out, restart the piece from its first frame.
    const restart = target < p.get() && el;
    let cancelled = false;

    const play = () => {
      const c = animate(p, target, { duration: Math.abs(target - p.get()) * CYCLE, ease: 'linear' });
      if (!inViewRef.current) c.pause();
      controlsRef.current = c;
    };

    if (restart) {
      const out = animate(el, { opacity: 0 }, { duration: 0.2, ease: [0.7, 0, 0.84, 0] });
      controlsRef.current = out;
      out.then(() => {
        if (cancelled) return;
        p.set(0);
        animate(el, { opacity: 1 }, { duration: 0.2, ease: [0.16, 1, 0.3, 1] });
        play();
      });
    } else {
      play();
    }
    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      if (el) el.style.opacity = '1';
    };
  }, [step, reduceMotion, p, frame]);

  const key = STAGES[step];
  const stepData = t.raw(`services_process.${key}`) as { name: string; desc: string };
  const scale = Math.max(1.2, Math.min(1.7, width / 210));

  return (
    <div ref={rootRef} className="flex flex-col items-center gap-6">
      {/* Step indicators */}
      <div className="flex gap-2">
        {STAGES.map((k, i) => (
          <button
            key={k}
            type="button"
            aria-label={(t.raw(`services_process.${k}`) as { name: string }).name}
            aria-current={i === step ? 'step' : undefined}
            onClick={() => setStep(i)}
            className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ds-primary-vivid)]"
            style={{
              width: i === step ? 24 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor:
                i === step
                  ? 'var(--ds-primary-vivid)'
                  : 'color-mix(in srgb, var(--ds-primary-vivid) 25%, transparent)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'width 0.3s ease, background-color 0.3s ease',
            }}
          />
        ))}
      </div>

      <div ref={stageRef} className="relative w-full" style={{ height: STAGE_H }}>
        <div
          aria-hidden
          style={{
            position: 'absolute', top: '50%', left: 0, right: 0, height: 1,
            backgroundImage:
              'repeating-linear-gradient(to right, color-mix(in srgb, var(--ds-primary) 16%, transparent) 0, color-mix(in srgb, var(--ds-primary) 16%, transparent) 5px, transparent 5px, transparent 16px)',
          }}
        />
        <SparkToStar
          p={reduceMotion ? frame : p}
          w={width}
          h={STAGE_H}
          xs={[width / 2, width / 2, width / 2]}
          scale={scale}
        />
      </div>

      <motion.div
        key={step}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-3 text-center"
        style={{ minHeight: 140 }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--ds-primary-vivid) 14%, transparent)',
              boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--ds-primary-vivid) 35%, transparent)',
            }}
          >
            <span
              translate="no"
              className="material-symbols-outlined"
              style={{ fontSize: 20, color: 'var(--ds-primary-vivid)' }}
            >
              {STAGE_ICONS[key]}
            </span>
          </div>
          <div className="text-left">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.2em] block"
              style={{ color: 'var(--ds-primary-vivid)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {String(step + 1).padStart(2, '0')}
            </span>
            <p
              className="text-xl font-black uppercase tracking-wide"
              style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
            >
              {stepData.name}
            </p>
          </div>
        </div>
        <p
          className="text-sm leading-relaxed max-w-xs mx-auto"
          style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {stepData.desc}
        </p>
      </motion.div>
    </div>
  );
}
