'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Artifact } from './Artifact';
import { CYCLE, REST, STAGES, STAGE_ICONS } from './timeline';

/** Cycle progress at which the artifact is an empty card, just after it arrives. */
const BLANK = 0.8 / CYCLE;
const STEP_INTERVAL = 3600;
/** The stepper plays the factory timeline a bit faster than the belt. */
const SPEED = 0.6;

/** Mobile: the same artifact as a stepper. Each step plays the transformation into that stage. */
export default function MobileProcess() {
  const t = useTranslations('common');
  const [step, setStep] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef);
  const reduceMotion = useReducedMotion();
  const p = useMotionValue(REST.idea);
  const prevStep = useRef(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const id = setInterval(() => setStep((s) => (s + 1) % STAGES.length), STEP_INTERVAL);
    return () => clearInterval(id);
  }, [inView, reduceMotion]);

  useEffect(() => {
    const target = REST[STAGES[step]];
    const card = cardRef.current;
    const wrapped = step === 0 && prevStep.current !== 0;
    prevStep.current = step;

    if (reduceMotion) {
      p.set(target);
      return;
    }

    let controls: { stop: () => void } | undefined;
    let cancelled = false;
    const play = () => {
      controls = animate(p, target, {
        duration: Math.abs(target - p.get()) * CYCLE * SPEED,
        ease: 'linear',
      });
    };

    if (wrapped && card) {
      // Looping back: fade the finished app out, restart from a blank card.
      const fade = animate(card, { opacity: 0 }, { duration: 0.2, ease: [0.7, 0, 0.84, 0] });
      fade.then(() => {
        if (cancelled) return;
        p.set(BLANK);
        animate(card, { opacity: 1 }, { duration: 0.2, ease: [0.16, 1, 0.3, 1] });
        play();
      });
      controls = fade;
    } else {
      play();
    }
    return () => {
      cancelled = true;
      controls?.stop();
      if (card) card.style.opacity = '1';
    };
  }, [step, reduceMotion, p]);

  const key = STAGES[step];
  const stepData = t.raw(`services_process.${key}`) as { name: string; desc: string };

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

      <div ref={cardRef}>
        <Artifact progress={p} />
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
