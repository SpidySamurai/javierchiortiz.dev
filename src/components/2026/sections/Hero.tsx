'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&!?';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import type { Container } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { loadEmittersPlugin } from '@tsparticles/plugin-emitters';
import { loadTrailEffect } from '@tsparticles/effect-trail';
import { whatsappUrl } from '@/lib/contact';
import { emitShootingStar } from '@/lib/skyEvents';
import {
  EGG_CAPTION_BACK_MS,
  EGG_END_MS,
  EGG_LYRIC_MS,
  EGG_RM_END_MS,
  cometLimbImpact,
  planetGeo,
} from '@/lib/orbitScene';
import PlanetOrbit from '@/components/2026/ui/PlanetOrbit';

/** Measured comet speed along each axis (px/s) for the 45 degree trail. */
const COMET_SPEED = 340;

/** Easter egg caption: a lyric, so it stays English in every locale. */
const EGG_LYRIC = 'sometimes quiet is violent';
/** Longest wait for an in-flight comet before the particles freeze. */
const MAX_COMET_WAIT_MS = 3000;
const EGG_RED = '#e63946';

function getParticlesOptions(isDark: boolean) {
  return {
    fullScreen: { enable: false },
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    particles: {
      number: { value: 140, density: { enable: true } },
      color: {
        value: isDark
          ? (['#c0c1ff', '#a5b4fc', '#818cf8'] as string[])
          : (['#4042c8', '#5254d0', '#6668e8'] as string[]),
      },
      opacity: {
        value: { min: isDark ? 0.1 : 0.2, max: isDark ? 0.6 : 0.65 },
        animation: { enable: true, speed: 0.6, sync: false },
      },
      size: { value: { min: 1, max: 3 } },
      collisions: { enable: true, mode: 'bounce' as const },
      move: {
        enable: true,
        speed: { min: 0.3, max: 0.8 },
        direction: 'top' as const,
        random: true,
        straight: false,
        outModes: { default: 'out' as const },
        attract: { enable: true, rotate: { x: 600, y: 1200 } },
      },
      shape: { type: 'circle' },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'repulse' as const },
        onClick: { enable: true, mode: ['push', 'repulse'] as string[] },
      },
      modes: {
        repulse: { distance: 110, duration: 1.4, speed: 1.2, factor: 3, easing: 'ease-out-sine' },
        push: { quantity: 8 },
      },
    },
    detectRetina: true,
  } as const;
}

const ParticleBackground = memo(function ParticleBackground({
  onLoaded,
  options,
  dimmed,
  instant,
}: {
  onLoaded: (c: Container | undefined) => void;
  options: ReturnType<typeof getParticlesOptions>;
  /** Dim the stars to about 40% while the easter egg runs. */
  dimmed: boolean;
  /** Skip the dimming transition (reduced motion). */
  instant: boolean;
}) {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        pointerEvents: 'none',
        opacity: dimmed ? 0.4 : 1,
        transition: instant ? 'none' : 'opacity 600ms ease-in-out',
      }}
    >
      <Particles
        id="hero-particles"
        className="absolute inset-0 z-0"
        style={{ pointerEvents: 'none' }}
        particlesLoaded={async (c) => onLoaded(c)}
        options={options}
      />
    </div>
  );
});
function TypingText({
  text,
  start,
  instant = false,
  style,
  className,
}: {
  text: string;
  start: boolean;
  /** Show the full text at once instead of typing it (reduced motion). */
  instant?: boolean;
  style?: React.CSSProperties;
  className?: string;
}) {
  // Retype whenever the text changes: reset the count during render so the old
  // length never flashes against the new text.
  const [typed, setTyped] = useState({ text, count: 0 });
  if (typed.text !== text) setTyped({ text, count: 0 });
  // `start` gates instant too, so the first client render matches the server HTML.
  const count = instant && start ? text.length : typed.text === text ? typed.count : 0;
  const done = count >= text.length;

  useEffect(() => {
    if (!start || done) return;
    const t = setTimeout(
      () => setTyped((s) => (s.text === text ? { text, count: s.count + 1 } : s)),
      55,
    );
    return () => clearTimeout(t);
  }, [count, done, start, text]);

  return (
    <span className={className} style={style}>
      {text.slice(0, count)}
      {!done && start && (
        <span style={{ borderRight: '1px solid currentColor', marginLeft: '1px', opacity: 0.5 }} />
      )}
    </span>
  );
}

function AnimatedHeadline({
  pre,
  accent,
  post,
  onDone,
}: {
  pre: string;
  accent: string;
  post: string;
  onDone?: () => void;
}) {
  const words: { text: string; isAccent: boolean }[] = [
    ...pre
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({ text: w, isAccent: false })),
    ...accent
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({ text: w, isAccent: true })),
    ...post
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({ text: w, isAccent: false })),
  ];

  const lastDelay = (words.length - 1) * 0.1 + 0.55;

  useEffect(() => {
    const timer = setTimeout(() => onDone?.(), lastDelay * 1000 + 100);
    return () => clearTimeout(timer);
  }, [lastDelay, onDone]);

  return (
    <h1
      className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.95]"
      style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.55, ease: 'easeOut' }}
          className="inline-block"
          style={{
            // No gap before a trailing punctuation token like "."
            marginRight: /^[.,!?;:]+$/.test(words[i + 1]?.text ?? '') ? 0 : '0.22em',
            ...(word.isAccent ? { color: 'var(--ds-primary-vivid)', fontStyle: 'italic' } : {}),
          }}
        >
          {word.text}
        </motion.span>
      ))}
    </h1>
  );
}

function useScramble(target: string) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    const PRE = 4;
    const maxFrames = PRE + target.length;

    function tick() {
      if (cancelled) return;
      frame++;
      const resolved = Math.max(0, frame - PRE);
      setDisplay(
        target
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' ';
            if (i < resolved) return ch;
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join(''),
      );
      if (frame < maxFrames) setTimeout(tick, 35);
      else if (!cancelled) setDisplay(target);
    }

    tick();
    return () => {
      cancelled = true;
    };
  }, [target]);

  return display;
}

interface ServiceItem {
  label: string;
  sub: string;
}

const ScrambleServiceCycler = memo(function ScrambleServiceCycler({
  services,
  active,
  idx,
  started,
  frozen,
  onStart,
  onAdvance,
}: {
  services: ServiceItem[];
  active: boolean;
  /** Index and started flag are owned by Hero so the planet ring can follow them. */
  idx: number;
  started: boolean;
  /** Stop advancing; the interval restarts from zero when it clears. */
  frozen: boolean;
  onStart: () => void;
  onAdvance: () => void;
}) {
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(onStart, 350);
    return () => clearTimeout(t);
  }, [active, onStart]);

  useEffect(() => {
    if (!started || frozen) return;
    const timer = setInterval(onAdvance, 3200);
    return () => clearInterval(timer);
  }, [started, frozen, onAdvance]);

  const current = services[idx];
  const label = useScramble(started ? current.label : '');

  return (
    <div className="space-y-1.5 flex-shrink-0 min-w-[14rem]">
      {/* Progress pills */}
      <div className="flex gap-1 items-center mb-2">
        {services.map((_, i) => (
          <div
            key={i}
            className="h-[2px] rounded-full transition-all duration-500"
            style={{
              width: i === idx ? '14px' : '4px',
              backgroundColor:
                i === idx
                  ? 'var(--ds-primary)'
                  : 'color-mix(in srgb, var(--ds-primary) 22%, transparent)',
            }}
          />
        ))}
      </div>

      {/* Scrambling label */}
      <p
        className="text-2xl font-bold tracking-tight"
        style={{
          color: 'var(--ds-on-surface)',
          fontFamily: 'var(--font-manrope), sans-serif',
          minHeight: '2rem',
          letterSpacing: '-0.01em',
        }}
      >
        {label}
        {started && label !== current.label && (
          <span
            style={{ borderRight: '2px solid currentColor', marginLeft: '2px', opacity: 0.6 }}
          />
        )}
      </p>

      {/* Sub description */}
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.22 }}
          className="text-sm italic"
          style={{
            color: 'var(--ds-on-surface-variant)',
            fontFamily: 'var(--font-inter), sans-serif',
            minHeight: '1.25rem',
          }}
        >
          {started ? current.sub : ''}
        </motion.p>
      </AnimatePresence>
    </div>
  );
});

export default function Hero() {
  const t = useTranslations('common');
  const isDark = true; // dark-only site — no theme branching (avoids hydration mismatch)
  const [particlesReady, setParticlesReady] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;
  /** performance.now() at the easter egg click; null while no egg runs. */
  const [eggAt, setEggAt] = useState<number | null>(null);
  const [eggLyric, setEggLyric] = useState(false);
  const [eggHot, setEggHot] = useState(false);
  const eggActive = eggAt !== null;
  const eggRunningRef = useRef(false);
  const eggTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const heroInViewRef = useRef(true);
  const cometEndRef = useRef(0);
  const [serviceIdx, setServiceIdx] = useState(0);
  const [servicesStarted, setServicesStarted] = useState(false);
  const cometContainerRef = useRef<Container | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const particlesOptions = useMemo(() => getParticlesOptions(isDark), [isDark]);

  const services = useMemo<ServiceItem[]>(
    () => [
      { label: t('hero_svc_agents'), sub: t('hero_svc_agents_sub') },
      { label: t('hero_svc_rag'), sub: t('hero_svc_rag_sub') },
      { label: t('hero_svc_evals'), sub: t('hero_svc_evals_sub') },
      { label: t('hero_svc_automations'), sub: t('hero_svc_automations_sub') },
      { label: t('hero_svc_saas'), sub: t('hero_svc_saas_sub') },
      { label: t('hero_svc_webapps'), sub: t('hero_svc_webapps_sub') },
    ],
    [t],
  );

  const serviceLabels = useMemo(() => services.map((s) => s.label), [services]);
  const handleTypingDone = useCallback(() => setTypingDone(true), []);
  const handleServicesStart = useCallback(() => setServicesStarted(true), []);
  const handleServicesAdvance = useCallback(
    () => setServiceIdx((i) => (i + 1) % services.length),
    [services.length],
  );

  const handleParticlesLoaded = useCallback((c: Container | undefined) => {
    cometContainerRef.current = c ?? null;
  }, []);

  // Pause the particle render loop while the hero is scrolled out of view —
  // frees CPU/GPU for the rest of the page, zero visual change in-view.
  useEffect(() => {
    const el = sectionRef.current;
    if (!particlesReady || !el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        heroInViewRef.current = entry.isIntersecting;
        const c = cometContainerRef.current;
        if (!c) return;
        // The egg keeps the stars frozen until it ends, in view or not.
        if (entry.isIntersecting) {
          if (!eggRunningRef.current) c.play();
        } else c.pause();
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [particlesReady]);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
      await loadEmittersPlugin(engine);
      await loadTrailEffect(engine);
    }).then(() => setParticlesReady(true));
  }, []);

  const fireComet = useCallback(() => {
    if (!cometContainerRef.current || eggRunningRef.current) return;
    const container = cometContainerRef.current;
    const { width, height } = container.canvas.size;
    const startX = width * (0.3 + Math.random() * 0.7); // anywhere from 30% to 100% along top

    // Spawn visual comet particle
    container.particles.addParticle(
      { x: startX, y: 0 },
      {
        color: {
          value: isDark
            ? (['#ffffff', '#c0c1ff', '#a5b4fc', '#e0e7ff'] as string[])
            : (['#4042c8', '#6668e8', '#312ec0', '#1e1cb8'] as string[]),
        },
        size: { value: { min: 1, max: 1 } },
        opacity: { value: 1 },
        effect: {
          type: 'trail',
          options: { trail: { length: 20, minWidth: 1 } },
        },
        collisions: { enable: false },
        move: {
          speed: 50,
          direction: 'bottom-left',
          straight: true,
          outModes: { default: 'none' },
          attract: { enable: false },
        },
      }
    );

    // Tell the rest of the page (the cat) a star is crossing the sky. The comet
    // flies at 45 degrees down-left until it leaves the canvas or burns up.
    const rect = container.canvas.element?.getBoundingClientRect();
    if (rect) {
      const kx = rect.width / width;
      const ky = rect.height / height;
      // The comet passes behind the planet: stop it where it meets the limb, using
      // the same geometry PlanetOrbit draws the burn-up with (CSS px, hero-sized).
      const impact = cometLimbImpact(planetGeo(rect.width, rect.height), startX * kx, 0);
      const run = impact ? Math.min(startX, height, impact.run / kx) : Math.min(startX, height);
      emitShootingStar({
        from: { x: rect.left + startX * kx, y: rect.top },
        to: { x: rect.left + (startX - run) * kx, y: rect.top + run * ky },
        durationMs: (run / COMET_SPEED) * 1000,
        source: 'hero',
      });
      cometEndRef.current = performance.now() + (run / COMET_SPEED) * 1000;
    }

    // Animate virtual cursor along the comet trajectory to trigger hover repulse
    const duration = 2200;
    const startTime = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      container.interactivity.mouse.position = {
        x: startX - startX * progress,
        y: height * progress,
      };
      container.interactivity.mouse.inside = true;
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        container.interactivity.mouse.inside = false;
      }
    };
    requestAnimationFrame(animate);
  }, [isDark]);

  useEffect(() => {
    if (!particlesReady) return;
    const timers = [600, 1400].map((d) => setTimeout(fireComet, d));
    return () => timers.forEach(clearTimeout);
  }, [particlesReady, fireComet]);

  useEffect(() => {
    if (!particlesReady || !typingDone) return;
    const timers = [100, 600, 1200, 2000].map((d) => setTimeout(fireComet, d));
    return () => timers.forEach(clearTimeout);
  }, [particlesReady, typingDone, fireComet]);

  useEffect(() => {
    if (!particlesReady || !typingDone) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.4) fireComet();
    }, 5000);
    return () => clearInterval(interval);
  }, [particlesReady, typingDone, fireComet]);

  const clearEggTimers = useCallback(() => {
    eggTimersRef.current.forEach(clearTimeout);
    eggTimersRef.current = [];
  }, []);

  useEffect(() => clearEggTimers, [clearEggTimers]);

  // The quiet moment: freeze the sky, retype the caption as the lyric, then
  // hand everything back. Clicks are ignored until it ends.
  const startEgg = useCallback(() => {
    if (eggRunningRef.current) return;
    eggRunningRef.current = true;
    const now = performance.now();
    const after = (fn: () => void, ms: number) =>
      eggTimersRef.current.push(setTimeout(fn, ms));
    setEggAt(now);
    // Comets already in flight finish before the stars freeze.
    const pauseIn = reduceMotion
      ? 0
      : Math.min(MAX_COMET_WAIT_MS, Math.max(600, cometEndRef.current - now));
    after(() => cometContainerRef.current?.pause(), pauseIn);
    after(() => setEggLyric(true), reduceMotion ? 0 : EGG_LYRIC_MS);
    after(() => setEggLyric(false), reduceMotion ? EGG_RM_END_MS : EGG_CAPTION_BACK_MS);
    after(
      () => {
        eggRunningRef.current = false;
        eggTimersRef.current = [];
        setEggAt(null);
        if (heroInViewRef.current) cometContainerRef.current?.play();
      },
      reduceMotion ? EGG_RM_END_MS : EGG_END_MS,
    );
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      data-track-section="hero"
      className="relative px-8 md:px-16 pt-24 pb-[260px] md:pb-[340px] md:min-h-[860px] overflow-hidden"
      style={{ backgroundColor: 'var(--ds-bg)' }}
    >
      {/* Unified particles — background + comets in one container */}
      {particlesReady && (
        <ParticleBackground
          key="dark"
          onLoaded={handleParticlesLoaded}
          options={particlesOptions}
          dimmed={eggActive}
          instant={reduceMotion}
        />
      )}

      {/* Ambient glow */}
      <div
        className="absolute -top-40 -right-20 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: isDark ? 'rgba(128,131,255,0.06)' : 'rgba(64,66,200,0.09)',
          filter: 'blur(120px)',
        }}
      />
      {/* Secondary glow — light mode only, bottom-left anchor */}
      {!isDark && (
        <div
          className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'rgba(96,100,232,0.07)', filter: 'blur(100px)' }}
        />
      )}

      {/* Planet horizon + orbit ring: above the particles, below the content */}
      <PlanetOrbit
        activeIndex={serviceIdx}
        started={servicesStarted}
        labels={serviceLabels}
        eggAt={eggAt}
      />

      {/* |-/ easter egg trigger: faint until hovered, red while the egg runs */}
      <button
        type="button"
        onClick={startEgg}
        onMouseEnter={() => setEggHot(true)}
        onMouseLeave={() => setEggHot(false)}
        onFocus={(e) => {
          // Engines without :focus-visible throw from matches(); treat focus as visible.
          let visible = true;
          try {
            visible = e.currentTarget.matches(':focus-visible');
          } catch {}
          setEggHot(visible);
        }}
        onBlur={() => setEggHot(false)}
        aria-label={t('hero_egg_label')}
        className="absolute z-20 bottom-[196px] left-2 md:bottom-auto md:left-auto md:top-[218px] md:right-[20%] min-h-11 min-w-11 px-2.5 py-1.5 cursor-pointer select-none rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--ds-primary-vivid)]"
      >
        <motion.span
          aria-hidden
          className="inline-block text-2xl md:text-[2rem] leading-none transition-colors duration-[600ms]"
          animate={
            eggActive
              ? { opacity: 0.6, transition: { duration: 0.3 } }
              : eggHot
                ? { opacity: 0.4, transition: { duration: 0.3 } }
                : reduceMotion
                  ? { opacity: 0.1, transition: { duration: 0 } }
                  : {
                      opacity: [0.04, 0.18, 0.06, 0.22, 0.04, 0.14, 0.04],
                      transition: {
                        duration: 8,
                        ease: 'easeInOut',
                        repeat: Infinity,
                        repeatType: 'mirror',
                        times: [0, 0.2, 0.35, 0.55, 0.7, 0.85, 1],
                      },
                    }
          }
          style={{
            color: eggActive ? EGG_RED : 'var(--ds-on-surface)',
            fontFamily: 'var(--font-inter), sans-serif',
            letterSpacing: '0.5em',
          }}
        >
          |-/
        </motion.span>
      </button>

      <div className="relative z-10 max-w-3xl mx-auto space-y-10 md:text-center">
          {/* Headline */}
          <AnimatedHeadline
            pre={t('hero_headline_pre')}
            accent={t('hero_headline_accent')}
            post={t('hero_headline_post')}
            onDone={handleTypingDone}
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={typingDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.38, ease: 'easeOut' }}
            className="text-lg md:text-xl leading-relaxed"
            style={{
              color: 'var(--ds-on-surface-variant)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {t('hero_description_long')}
          </motion.p>

          {/* CTA + Scrambler */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={typingDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.38, delay: 0.1, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-start md:items-center md:justify-center gap-10 sm:gap-8"
          >
            {/* Scrambler */}
            <ScrambleServiceCycler
              services={services}
              active={typingDone}
              idx={serviceIdx}
              started={servicesStarted}
              frozen={eggActive}
              onStart={handleServicesStart}
              onAdvance={handleServicesAdvance}
            />

            {/* Vertical divider */}
            <div
              className="hidden sm:block w-px self-stretch"
              style={{ backgroundColor: 'var(--ds-outline-variant)' }}
            />

            {/* CTA — committed periwinkle button */}
            <div className="flex flex-col gap-2 flex-shrink-0 items-start md:items-center">
              <a
                href={whatsappUrl(t('contact_wa_message'))}
                target="_blank"
                rel="noopener noreferrer"
                className="group/cta inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest transition-transform duration-200 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--ds-primary-vivid)]"
                style={{
                  backgroundColor: 'var(--ds-primary-vivid)',
                  color: 'var(--ds-on-vivid)',
                  fontFamily: 'var(--font-manrope), sans-serif',
                }}
              >
                {t('hero_cta')}
                <span
                  translate="no"
                  aria-hidden
                  className="material-symbols-outlined text-base inline-block transition-transform duration-200 motion-safe:group-hover/cta:translate-x-1"
                >
                  arrow_forward
                </span>
              </a>
              <span
                className="text-xs italic tracking-widest"
                style={{
                  color: 'color-mix(in srgb, var(--ds-primary) 60%, transparent)',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              >
                {t('hero_cta_sub')}
              </span>
            </div>
          </motion.div>
      </div>

      {/* Comet caption */}
      <p
        className={`${eggActive ? 'block' : 'hidden md:block'} absolute bottom-10 right-8 md:right-16 text-xs italic pointer-events-none`}
      >
        <TypingText
          text={eggLyric ? EGG_LYRIC : t('hero_comet_caption')}
          start={typingDone}
          instant={reduceMotion}
          style={{
            color: 'color-mix(in srgb, var(--ds-primary) 75%, transparent)',
            fontFamily: 'var(--font-inter), sans-serif',
            letterSpacing: '0.15em',
          }}
        />
      </p>

      {/* Editorial ticker */}
      <div
        className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none"
        style={{ opacity: isDark ? 0.05 : 0.1 }}
        aria-hidden
      >
        <span
          className="text-[12rem] font-black uppercase whitespace-nowrap block"
          style={{
            WebkitTextStroke: '1px color-mix(in srgb, var(--ds-primary) 20%, transparent)',
            color: 'transparent',
            transform: 'translateY(50%)',
            fontFamily: 'var(--font-manrope), sans-serif',
            lineHeight: 1,
          }}
        >
          {t('hero_ticker')} • {t('hero_ticker')}
        </span>
      </div>
    </section>
  );
}
