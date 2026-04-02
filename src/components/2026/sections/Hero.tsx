'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import type { Container } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { loadEmittersPlugin } from '@tsparticles/plugin-emitters';
import { loadTrailEffect } from '@tsparticles/effect-trail';

const PARTICLES_OPTIONS = {
  fullScreen: { enable: false },
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  particles: {
    number: { value: 140, density: { enable: true } },
    color: { value: ['#c0c1ff', '#a5b4fc', '#818cf8'] as string[] },
    opacity: {
      value: { min: 0.1, max: 0.6 },
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

const ParticleBackground = memo(function ParticleBackground({
  onLoaded,
}: {
  onLoaded: (c: Container | undefined) => void;
}) {
  return (
    <Particles
      id="hero-particles"
      className="absolute inset-0 z-0"
      style={{ pointerEvents: 'none' }}
      particlesLoaded={async (c) => onLoaded(c)}
      options={PARTICLES_OPTIONS}
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
      style={{ color: '#dae2fd', fontFamily: 'var(--font-manrope), sans-serif' }}
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
            ...(word.isAccent ? { color: '#c0c1ff', fontStyle: 'italic' } : {}),
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
  const [particlesReady, setParticlesReady] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const cometContainerRef = useRef<Container | null>(null);

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
        color: { value: '#ffffff' },
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

  // Comets during typing — fire a couple while text appears
  useEffect(() => {
    if (!particlesReady) return;
    const timers = [600, 1400].map((d) => setTimeout(fireComet, d));
    return () => timers.forEach(clearTimeout);
  }, [particlesReady]);

  // Burst after typing finishes
  useEffect(() => {
    if (!particlesReady || !typingDone) return;
    const timers = [100, 600, 1200, 2000].map((d) => setTimeout(fireComet, d));
    return () => timers.forEach(clearTimeout);
  }, [particlesReady, typingDone]);

  // Ongoing probabilistic comet every 5s
  useEffect(() => {
    if (!particlesReady || !typingDone) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.4) fireComet();
    }, 5000);
    return () => clearInterval(interval);
  }, [particlesReady, typingDone]);

  return (
    <section
      className="relative px-8 md:px-16 pt-24 pb-40 overflow-hidden"
      style={{ backgroundColor: '#0b1326' }}
    >
      {/* Unified particles — background + comets in one container */}
      {particlesReady && <ParticleBackground onLoaded={handleParticlesLoaded} />}

      {/* Ambient glow */}
      <div
        className="absolute -top-40 -right-20 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'rgba(128,131,255,0.06)',
          filter: 'blur(120px)',
        }}
      />

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
            style={{ color: '#c7c4d7', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {t('hero_description_long')}
          </motion.p>
        </div>

        {/* Right: overlapping image cards — hidden until real images are ready */}
        <div className="hidden w-full md:w-1/2 flex justify-center md:justify-end">
          {/* Fixed-size stage for the two cards */}
          <div className="relative" style={{ width: '320px', height: '380px' }}>
            {/* Back card — large, tilted right, z behind */}
            <div
              className="absolute overflow-hidden rounded-xl shadow-2xl"
              style={{
                width: '240px',
                height: '300px',
                top: '20px',
                right: '0',
                transform: 'rotate(3deg)',
                backgroundColor: '#131b2e',
                zIndex: 1,
              }}
            >
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: '#222a3d' }}
              >
                <span
                  className="text-xs uppercase tracking-widest"
                  style={{ color: '#908fa0', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  Pending
                </span>
              </div>
            </div>

            {/* Front card — smaller, tilted left, z on top */}
            <div
              className="absolute overflow-hidden rounded-xl shadow-2xl"
              style={{
                width: '200px',
                height: '220px',
                bottom: '0',
                left: '0',
                transform: 'rotate(-6deg)',
                backgroundColor: '#171f33',
                zIndex: 2,
              }}
            >
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: '#222a3d' }}
              >
                <span
                  className="text-xs uppercase tracking-widest"
                  style={{ color: '#908fa0', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  Pending
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comet caption */}
      <p className="absolute bottom-10 right-8 md:right-16 text-xs italic pointer-events-none">
        <TypingText
          text={t('hero_comet_caption')}
          start={typingDone}
          style={{
            color: 'rgba(192,193,255,0.75)',
            fontFamily: 'var(--font-inter), sans-serif',
            letterSpacing: '0.15em',
          }}
        />
      </p>

      {/* Editorial ticker */}
      <div
        className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none"
        style={{ opacity: 0.05 }}
        aria-hidden
      >
        <span
          className="text-[12rem] font-black uppercase whitespace-nowrap block"
          style={{
            WebkitTextStroke: '1px rgba(192,193,255,0.2)',
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
