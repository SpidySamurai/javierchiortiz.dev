'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import LineScene from './line/LineScene';
import { CROPS, SLICES, STAGES, STAGE_ICONS, STATIC_AT, type Stage } from './line/stages';
import { useLineCopy } from './line/useLineCopy';
import { useLineDriver } from './line/useLineDriver';

/** Seconds a finished step stays on screen before the next one starts. */
const HOLD_S = 1.4;

/** One station of the production line, cropped, playing only its own slice of the timeline. */
function StepScene({ stage, reduced }: { stage: Stage; reduced: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const copy = useLineCopy();
  const [from, to] = SLICES[stage];
  useLineDriver({ rootRef, from, to, loop: false, staticAt: reduced ? STATIC_AT[stage] : undefined, labels: copy });
  return (
    <div ref={rootRef} className="w-full">
      <LineScene copy={copy} viewBox={CROPS[stage]} />
    </div>
  );
}

/** Mobile: the same scene as a stepper. Each step plays its stage, then hands over to the next. */
export default function MobileProcess() {
  const t = useTranslations('common');
  const [step, setStep] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const [from, to] = SLICES[STAGES[step]];
    const id = setTimeout(() => setStep((s) => (s + 1) % STAGES.length), (to - from + HOLD_S) * 1000);
    return () => clearTimeout(id);
  }, [step, inView, reduceMotion]);

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

      <StepScene key={key} stage={key} reduced={reduceMotion} />

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
