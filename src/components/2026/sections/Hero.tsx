'use client';

import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export default function Hero() {
  const [particlesReady, setParticlesReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setParticlesReady(true));
  }, []);

  return (
    <section
      className="relative px-8 md:px-16 pt-24 pb-40 overflow-hidden"
      style={{ backgroundColor: '#0b1326' }}
    >
      {/* Particle background */}
      {particlesReady && (
        <Particles
          id="hero-particles"
          className="absolute inset-0 z-0"
          options={{
            fullScreen: { enable: false },
            background: { color: { value: 'transparent' } },
            fpsLimit: 60,
            particles: {
              number: { value: 140, density: { enable: true } },
              color: { value: ['#c0c1ff', '#a5b4fc', '#818cf8'] },
              opacity: {
                value: { min: 0.1, max: 0.6 },
                animation: { enable: true, speed: 0.6, sync: false },
              },
              size: {
                value: { min: 1, max: 3 },
              },
              collisions: {
                enable: true,
                mode: 'bounce',
              },
              move: {
                enable: true,
                speed: { min: 0.3, max: 0.8 },
                direction: 'top',
                random: true,
                straight: false,
                outModes: { default: 'out' },
                attract: { enable: true, rotate: { x: 600, y: 1200 } },
              },
              shape: { type: 'circle' },
            },
            interactivity: {
              events: {
                onHover: { enable: true, mode: 'repulse' },
              },
              modes: {
                repulse: { distance: 80, duration: 0.4 },
              },
            },
            detectRetina: true,
          }}
        />
      )}

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
          {/* Kicker */}
          <span
            className="text-xs uppercase tracking-[0.3em] font-bold block"
            style={{ color: '#c0c1ff', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Full Stack Developer
          </span>

          {/* Headline */}
          <h1
            className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-none"
            style={{ color: '#dae2fd', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            Crafting <span style={{ color: '#c0c1ff', fontStyle: 'italic' }}>Digital</span>
            <br />
            Artifacts
          </h1>

          {/* Description */}
          <p
            className="text-xl leading-relaxed max-w-lg"
            style={{ color: '#c7c4d7', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            A full-stack engineer operating at the intersection of aesthetic precision and technical
            robustness. Five years crafting accessible, mobile-first interfaces — from Lab2Next and
            data dashboards to reusable components and tools built to last.
          </p>
        </div>

        {/* Right: overlapping image cards */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
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
          Curator • Developer • Designer • Curator • Developer
        </span>
      </div>
    </section>
  );
}
