'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { TwentyOnePilotsEgg } from './TwentyOnePilotsEgg';
import { useTheme } from 'next-themes';
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
        value: { min: isDark ? 0.1 : 0.15, max: isDark ? 0.6 : 0.45 },
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
      repulse: { enable: true, distance: 80, duration: 0.4 },
    },
    interactivity: {
      events: { onHover: { enable: true, mode: ['repulse', 'bubble'] as string[] } },
      modes: {
        repulse: { distance: 160, duration: 2, speed: 12, factor: 20 },
        bubble: { distance: 120, size: 6, duration: 0.3, opacity: 0.9 },
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
    ...pre.trim().split(/\s+/).filter(Boolean).map((w) => ({ text: w, isAccent: false })),
    ...accent.trim().split(/\s+/).filter(Boolean).map((w) => ({ text: w, isAccent: true })),
    ...post.trim().split(/\s+/).filter(Boolean).map((w) => ({ text: w, isAccent: false })),
  ];

  const lastDelay = (words.length - 1) * 0.1 + 0.55;

  useEffect(() => {
    const timer = setTimeout(() => onDone?.(), lastDelay * 1000 + 100);
    return () => clearTimeout(timer);
  }, [lastDelay, onDone]);

  return (
    <h1
      className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-none"
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
            ...(word.isAccent ? { color: 'var(--ds-primary)', fontStyle: 'italic' } : {}),
          }}
        >
          {word.text}
        </motion.span>
      ))}
    </h1>
  );
}

export default function Hero() {
  const t = useTranslations('common');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== 'light';
  const [particlesReady, setParticlesReady] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const [eggOpen, setEggOpen] = useState(false);
  const cometContainerRef = useRef<Container | null>(null);
  const particlesOptions = useMemo(() => getParticlesOptions(isDark), [isDark]);

  const handleParticlesLoaded = useCallback((c: Container | undefined) => {
    cometContainerRef.current = c ?? null;
  }, []);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
      await loadEmittersPlugin(engine);
      await loadTrailEffect(engine);
    }).then(() => setParticlesReady(true));
  }, []);

  const fireComet = () => {
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
  };

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
      className="relative px-8 md:px-16 pt-24 pb-40 overflow-hidden"
      style={{ backgroundColor: 'var(--ds-bg)' }}
    >
      {/* Unified particles — background + comets in one container */}
      {particlesReady && <ParticleBackground key={resolvedTheme ?? 'dark'} onLoaded={handleParticlesLoaded} options={particlesOptions} />}

      {/* Ambient glow */}
      <div
        className="absolute -top-40 -right-20 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'rgba(128,131,255,0.06)',
          filter: 'blur(120px)',
        }}
      />

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

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-0">
        {/* Left: text block */}
        <div className="w-full md:w-1/2 space-y-6">
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
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-xl leading-relaxed max-w-lg"
            style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {t('hero_description_long')}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={typingDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="flex flex-col gap-1"
          >
            <a
              href="mailto:javierchiortiz@gmail.com"
              className="text-base font-semibold transition-colors hover:opacity-80"
              style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-manrope), sans-serif' }}
            >
              {t('hero_cta')}
            </a>
            <span
              className="text-xs italic tracking-widest"
              style={{ color: 'color-mix(in srgb, var(--ds-primary) 55%, transparent)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {t('hero_cta_sub')}
            </span>
          </motion.div>
        </div>

        {/* Right — empty until real images are ready */}
        <div className="hidden md:block w-full md:w-1/2" />
      </div>

      {/* Comet caption */}
      <p className="absolute bottom-10 right-8 md:right-16 text-xs italic pointer-events-none">
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
        style={{ opacity: 0.05 }}
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
