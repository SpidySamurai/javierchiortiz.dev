'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&!?';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { TwentyOnePilotsEgg } from './TwentyOnePilotsEgg';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import type { Container } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { loadEmittersPlugin } from '@tsparticles/plugin-emitters';
import { loadTrailEffect } from '@tsparticles/effect-trail';

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
}: {
  onLoaded: (c: Container | undefined) => void;
  options: ReturnType<typeof getParticlesOptions>;
}) {
  return (
    <Particles
      id="hero-particles"
      className="absolute inset-0 z-0"
      style={{ pointerEvents: 'none' }}
      particlesLoaded={async (c) => onLoaded(c)}
      options={options}
    />
  );
});
function TypingText({
  text,
  start,
  style,
  className,
}: {
  text: string;
  start: boolean;
  style?: React.CSSProperties;
  className?: string;
}) {
  const [count, setCount] = useState(0);
  const done = count >= text.length;

  useEffect(() => {
    if (!start || done) return;
    const t = setTimeout(() => setCount((c) => c + 1), 55);
    return () => clearTimeout(t);
  }, [count, done, start]);

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
            marginRight: '0.22em',
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
}: {
  services: ServiceItem[];
  active: boolean;
}) {
  const [idx, setIdx] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setStarted(true), 350);
    return () => clearTimeout(t);
  }, [active]);

  useEffect(() => {
    if (!started) return;
    const timer = setInterval(() => setIdx((i) => (i + 1) % services.length), 3200);
    return () => clearInterval(timer);
  }, [started, services.length]);

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
  const [eggOpen, setEggOpen] = useState(false);
  const cometContainerRef = useRef<Container | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const particlesOptions = useMemo(() => getParticlesOptions(isDark), [isDark]);

  const services = useMemo<ServiceItem[]>(
    () => [
      { label: t('hero_svc_landing'), sub: t('hero_svc_landing_sub') },
      { label: t('hero_svc_webapp'), sub: t('hero_svc_webapp_sub') },
      { label: t('hero_svc_mvp'), sub: t('hero_svc_mvp_sub') },
      { label: t('hero_svc_cms'), sub: t('hero_svc_cms_sub') },
      { label: t('hero_svc_crm'), sub: t('hero_svc_crm_sub') },
      { label: t('hero_svc_ai'), sub: t('hero_svc_ai_sub') },
    ],
    [t],
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
        const c = cometContainerRef.current;
        if (!c) return;
        if (entry.isIntersecting) c.play();
        else c.pause();
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
    if (!cometContainerRef.current) return;
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

  return (
    <section
      ref={sectionRef}
      data-track-section="hero"
      className="relative px-8 md:px-16 pt-24 pb-24 md:pb-40 overflow-hidden"
      style={{ backgroundColor: 'var(--ds-bg)' }}
    >
      {/* Unified particles — background + comets in one container */}
      {particlesReady && (
        <ParticleBackground
          key="dark"
          onLoaded={handleParticlesLoaded}
          options={particlesOptions}
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

      {/* |-/ easter egg trigger — drifts like a particle */}
      <motion.span
        onClick={() => setEggOpen(true)}
        className="absolute top-1/3 right-[20%] cursor-pointer z-20 hidden md:block"
        animate={{
          opacity: [0.04, 0.18, 0.06, 0.22, 0.04, 0.14, 0.04],
          scale: [1, 1.04, 0.98, 1.06, 1, 1.02, 1],
        }}
        transition={{
          duration: 8,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror',
          times: [0, 0.2, 0.35, 0.55, 0.7, 0.85, 1],
        }}
        style={{
          color: 'color-mix(in srgb, var(--ds-on-surface) 100%, transparent)',
          fontFamily: 'var(--font-inter), sans-serif',
          fontSize: '2rem',
          letterSpacing: '0.5em',
          userSelect: 'none',
        }}
        whileHover={{ opacity: 0.35, scale: 1.05, transition: { duration: 0.3 } }}
      >
        |-/
      </motion.span>

      <div className="relative z-10 max-w-3xl mx-auto space-y-10 md:text-center">
          {/* Headline */}
          <AnimatedHeadline
            pre={t('hero_headline_pre')}
            accent={t('hero_headline_accent')}
            post={t('hero_headline_post')}
            onDone={() => setTypingDone(true)}
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
            <ScrambleServiceCycler services={services} active={typingDone} />

            {/* Vertical divider */}
            <div
              className="hidden sm:block w-px self-stretch"
              style={{ backgroundColor: 'var(--ds-outline-variant)' }}
            />

            {/* CTA — committed periwinkle button */}
            <div className="flex flex-col gap-2 flex-shrink-0 items-start md:items-center">
              <a
                href={`https://wa.me/529904147791?text=${encodeURIComponent("Hi! I saw your portfolio and I'd like to start a project together.")}`}
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
      <p className="hidden md:block absolute bottom-10 right-8 md:right-16 text-xs italic pointer-events-none">
        <TypingText
          text={t('hero_comet_caption')}
          start={typingDone}
          style={{
            color: 'color-mix(in srgb, var(--ds-primary) 75%, transparent)',
            fontFamily: 'var(--font-inter), sans-serif',
            letterSpacing: '0.15em',
          }}
        />
      </p>

      {/* Easter egg overlay */}
      <AnimatePresence>
        {eggOpen && <TwentyOnePilotsEgg onClose={() => setEggOpen(false)} />}
      </AnimatePresence>

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
