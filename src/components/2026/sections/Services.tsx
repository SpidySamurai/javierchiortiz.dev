'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimate } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';

const SERVICE_KEYS = ['landing', 'webapp', 'mvp', 'cms', 'crm', 'ai'] as const;
const STATION_KEYS = ['idea', 'build', 'launch'] as const;
const STATION_ICONS = ['lightbulb', 'terminal', 'rocket_launch'] as const;
const WA_PHONE = '529904147791';

// ~11.5s per loop, 5 items evenly staggered
const ITEM_COUNT = 5;
const LOOP_DURATION = 11.5;
const STAGGER = LOOP_DURATION / ITEM_COUNT;

const BELT_TRACK_CSS = `
@keyframes conv-track-flow { to { background-position: 16px 0; } }

.conv-track-outer {
  position: relative; border-radius: 10px; padding: 2px;
  background: linear-gradient(to right, transparent, color-mix(in srgb, var(--ds-primary) 6%, transparent) 15%, color-mix(in srgb, var(--ds-primary) 9%, transparent) 50%, color-mix(in srgb, var(--ds-primary) 6%, transparent) 85%, transparent);
}
.conv-track-wrap {
  position: relative; height: 92px; overflow: hidden; border-radius: 8px;
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
`;

type Phase = 'raw' | 'idea' | 'build' | 'approved';

const PHASE_BG: Record<Phase, string> = {
  raw:      'color-mix(in srgb, var(--ds-surface-container) 80%, transparent)',
  idea:     'color-mix(in srgb, var(--ds-secondary-container) 70%, transparent)',
  build:    'color-mix(in srgb, var(--ds-primary-container) 60%, transparent)',
  approved: 'color-mix(in srgb, var(--ds-primary) 15%, transparent)',
};
const PHASE_OUTLINE: Record<Phase, string> = {
  raw:      '1px dashed color-mix(in srgb, var(--ds-primary) 20%, transparent)',
  idea:     '1px solid color-mix(in srgb, var(--ds-on-secondary) 60%, transparent)',
  build:    '1px solid color-mix(in srgb, var(--ds-primary-container) 70%, transparent)',
  approved: '1.5px solid color-mix(in srgb, var(--ds-primary) 90%, transparent)',
};
const PHASE_GLOW: Record<Phase, string> = {
  raw:      'none',
  idea:     'none',
  build:    'none',
  approved: '0 0 14px color-mix(in srgb, var(--ds-primary) 50%, transparent)',
};

interface BeltItemProps {
  initialDelay: number;
  s1: number;
  s2: number;
  s3: number;
  exitX: number;
}

function BeltItem({ initialDelay, s1, s2, s3, exitX }: BeltItemProps) {
  const [phase, setPhase] = useState<Phase>('raw');
  const [scope, animate] = useAnimate<HTMLDivElement>();

  useEffect(() => {
    let active = true;

    async function run() {
      await new Promise<void>(r => setTimeout(r, initialDelay * 1000));

      while (active) {
        const iterStart = performance.now();

        animate(scope.current, { x: -80, opacity: 0, scale: 0.95 }, { duration: 0 });
        setPhase('raw');
        await new Promise<void>(r => setTimeout(r, 16));
        if (!active) break;

        // Enter
        await animate(scope.current, { opacity: 1 }, { duration: 0.35, ease: 'easeOut' });
        if (!active) break;

        // → Station 1 (Idea)
        await animate(scope.current, { x: s1 }, { duration: 2.0, ease: [0.25, 0.1, 0.25, 1] });
        if (!active) break;
        setPhase('idea');
        await animate(scope.current, { scale: 1.08 }, { duration: 0.14, ease: 'easeOut' });
        await animate(scope.current, { scale: 1.0 }, { duration: 0.16, ease: 'easeIn' });
        if (!active) break;
        await new Promise<void>(r => setTimeout(r, 480));
        if (!active) break;

        // → Station 2 (Build)
        await animate(scope.current, { x: s2 }, { duration: 2.0, ease: [0.25, 0.1, 0.25, 1] });
        if (!active) break;
        setPhase('build');
        await animate(scope.current, { scale: 1.08 }, { duration: 0.14, ease: 'easeOut' });
        await animate(scope.current, { scale: 1.0 }, { duration: 0.16, ease: 'easeIn' });
        if (!active) break;
        await new Promise<void>(r => setTimeout(r, 480));
        if (!active) break;

        // → Station 3 (Approved)
        await animate(scope.current, { x: s3 }, { duration: 2.0, ease: [0.25, 0.1, 0.25, 1] });
        if (!active) break;
        setPhase('approved');
        await animate(scope.current, { scale: 1.1 }, { duration: 0.18, ease: 'easeOut' });
        await animate(scope.current, { scale: 1.0 }, { duration: 0.2, ease: 'easeIn' });
        if (!active) break;
        await new Promise<void>(r => setTimeout(r, 680));
        if (!active) break;

        // Exit
        await animate(scope.current, { x: exitX, opacity: 0 }, { duration: 1.8, ease: [0.4, 0, 1, 1] });
        if (!active) break;

        // Drift compensation — keep each loop exactly LOOP_DURATION seconds
        const elapsed = (performance.now() - iterStart) / 1000;
        const remaining = LOOP_DURATION - elapsed;
        if (remaining > 0.02) await new Promise<void>(r => setTimeout(r, remaining * 1000));
      }
    }

    run();
    return () => { active = false; };
  }, [initialDelay, s1, s2, s3, exitX, animate, scope]);

  return (
    <div
      ref={scope}
      style={{
        position: 'absolute',
        top: 'calc(50% - 29px)',
        left: 0,
        width: 68,
        height: 58,
        borderRadius: 8,
        overflow: 'hidden',
        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
        willChange: 'transform',
        backgroundColor: PHASE_BG[phase],
        outline: PHASE_OUTLINE[phase],
        boxShadow: PHASE_GLOW[phase],
        transition: 'background-color 0.35s ease, box-shadow 0.35s ease, outline-color 0.35s ease',
      }}
    >
      <AnimatePresence mode="wait">
        {phase === 'raw' && (
          <motion.div
            key="raw"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4, padding: '7px 8px' }}
          >
            {[50, 85, 35, 65].map((w, i) => (
              <div key={i} style={{ height: 2, borderRadius: 1, background: 'color-mix(in srgb, var(--ds-primary) 40%, transparent)', width: `${w}%` }} />
            ))}
          </motion.div>
        )}

        {phase === 'idea' && (
          <motion.div
            key="idea"
            initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8 }}
          >
            <span translate="no" className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--ds-on-secondary)', flexShrink: 0 }}>
              lightbulb
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              {[80, 100, 55].map((w, i) => (
                <div key={i} style={{ height: 2, borderRadius: 1, background: 'color-mix(in srgb, var(--ds-on-secondary) 50%, transparent)', width: `${w}%` }} />
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'build' && (
          <motion.div
            key="build"
            initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '7px 8px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <motion.div
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--ds-on-secondary)' }}
              />
              <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--ds-on-secondary)', textTransform: 'uppercase' }}>
                building
              </span>
            </div>
            {[90, 60, 75].map((w, i) => (
              <div key={i} style={{ height: 2, borderRadius: 1, background: 'color-mix(in srgb, var(--ds-on-secondary) 55%, transparent)', width: `${w}%`, marginBottom: 3 }} />
            ))}
          </motion.div>
        )}

        {phase === 'approved' && (
          <motion.div
            key="approved"
            initial={{ opacity: 0, scale: 0.82 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}
          >
            <span
              translate="no"
              className="material-symbols-outlined"
              style={{ fontSize: 26, color: 'var(--ds-primary)', fontVariationSettings: "'FILL' 1, 'wght' 400", filter: 'drop-shadow(0 0 6px color-mix(in srgb, var(--ds-primary) 80%, transparent))' }}
            >
              check_circle
            </span>
            <span style={{ fontSize: 6.5, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--ds-primary)', textTransform: 'uppercase' }}>
              approved
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileProcess({ t }: { t: ReturnType<typeof useTranslations> }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % STATION_KEYS.length), 2800);
    return () => clearInterval(id);
  }, []);

  const key = STATION_KEYS[step];
  const stepData = t.raw(`services_process.${key}`) as { name: string; desc: string };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Step indicators */}
      <div className="flex gap-2">
        {STATION_KEYS.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            style={{
              width: i === step ? 24 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor:
                i === step
                  ? 'var(--ds-primary)'
                  : 'color-mix(in srgb, var(--ds-primary) 25%, transparent)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'width 0.3s ease, background-color 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Animated card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex flex-col items-center gap-4 text-center"
          style={{ minHeight: 140 }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--ds-primary) 10%, transparent)',
              boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--ds-primary) 20%, transparent)',
            }}
          >
            <span
              translate="no"
              className="material-symbols-outlined"
              style={{ fontSize: 26, color: 'var(--ds-primary)' }}
            >
              {STATION_ICONS[step]}
            </span>
          </div>
          <div>
            <span
              className="text-[9px] font-bold uppercase tracking-[0.2em] block mb-1"
              style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {String(step + 1).padStart(2, '0')}
            </span>
            <p
              className="text-xl font-black uppercase tracking-wide mb-2"
              style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
            >
              {stepData.name}
            </p>
            <p
              className="text-sm leading-relaxed max-w-xs mx-auto"
              style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {stepData.desc}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface BeltPos { s1: number; s2: number; s3: number; exitX: number }
const DEFAULT_POS: BeltPos = { s1: 170, s2: 375, s3: 572, exitX: 1080 };

export default function Services() {
  const t = useTranslations('common');
  const locale = useLocale();
  const beltRef = useRef<HTMLDivElement>(null);
  const [beltPos, setBeltPos] = useState<BeltPos>(DEFAULT_POS);

  useEffect(() => {
    const el = beltRef.current;
    if (!el) return;
    const ITEM_W = 68;
    const update = () => {
      const w = el.offsetWidth;
      setBeltPos({
        s1: Math.round(w * 0.25 - ITEM_W / 2),
        s2: Math.round(w * 0.50 - ITEM_W / 2),
        s3: Math.round(w * 0.75 - ITEM_W / 2),
        exitX: w + 100,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const waMessage =
    locale === 'es'
      ? 'Hola Javier, vi tu portfolio y quiero contactarte'
      : 'Hi Javier, I saw your portfolio and want to get in touch';
  const waHref = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(waMessage)}`;

  return (
    <section
      id="services"
      data-track-section="services"
      className="px-8 lg:px-20 py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--ds-surface)', scrollMarginTop: '5rem' }}
    >
      <style dangerouslySetInnerHTML={{ __html: BELT_TRACK_CSS }} />
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <span
            className="text-xs uppercase tracking-[0.3em] font-bold block mb-3"
            style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {t('services_label')}
          </span>
          <h3
            className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
            style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            {t('services_title')}{' '}
            <span style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>
              {t('services_title_accent')}
            </span>
          </h3>
        </motion.div>

        {/* Services grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
          }}
        >
          {SERVICE_KEYS.map((key) => {
            const item = t.raw(`services_items.${key}`) as { name: string; desc: string };
            return (
              <motion.div
                key={key}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
                }}
              >
                <p
                  className="text-2xl md:text-3xl font-black tracking-tight leading-tight mb-1"
                  style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
                >
                  {item.name}
                </p>
                <p
                  className="text-sm italic"
                  style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Separator */}
        <div
          className="h-px mb-12"
          style={{
            background:
              'linear-gradient(to right, transparent, color-mix(in srgb, var(--ds-outline-variant) 30%, transparent), transparent)',
          }}
        />

        {/* Mobile: step cycler */}
        <motion.div
          className="md:hidden mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
        >
          <MobileProcess t={t} />
        </motion.div>

        {/* Desktop: Conveyor Belt */}
        <motion.div
          className="hidden md:block mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
        >
          <div className="relative" ref={beltRef}>
            {/* Station labels pinned at 25 / 50 / 75% */}
            <div className="relative h-[148px]">
              {STATION_KEYS.map((key, i) => {
                const step = t.raw(`services_process.${key}`) as { name: string; desc: string };
                const pct = ['25%', '50%', '75%'][i];
                return (
                  <div
                    key={key}
                    className="absolute top-0 flex flex-col items-center gap-1"
                    style={{ left: pct, transform: 'translateX(-50%)' }}
                  >
                    <div
                      className="w-[38px] h-[38px] rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--ds-primary) 7%, transparent)',
                        boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--ds-primary) 12%, transparent)',
                      }}
                    >
                      <span
                        translate="no"
                        className="material-symbols-outlined"
                        style={{ fontSize: 18, color: 'var(--ds-primary)' }}
                      >
                        {STATION_ICONS[i]}
                      </span>
                    </div>
                    <span
                      className="text-[9px] font-bold uppercase tracking-[0.14em]"
                      style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="text-[13px] font-black uppercase tracking-wide"
                      style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
                    >
                      {step.name}
                    </span>
                    <p
                      className="text-[10.5px] text-center leading-relaxed"
                      style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif', maxWidth: 120 }}
                    >
                      {step.desc}
                    </p>
                    <div
                      style={{
                        width: 1,
                        height: 18,
                        background: 'linear-gradient(to bottom, color-mix(in srgb, var(--ds-primary) 18%, transparent), transparent)',
                      }}
                    />
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
                {Array.from({ length: ITEM_COUNT }, (_, i) => (
                  <BeltItem
                    key={i}
                    initialDelay={i * STAGGER}
                    s1={beltPos.s1}
                    s2={beltPos.s2}
                    s3={beltPos.s3}
                    exitX={beltPos.exitX}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.15 }}
        >
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-opacity hover:opacity-80"
            style={{
              backgroundColor: 'var(--ds-primary)',
              color: 'var(--ds-on-primary)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {t('services_cta')}
          </a>
        </motion.div>

      </div>
    </section>
  );
}
