'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const STARS = [
  { x: 0.28, y: 0.22 }, { x: 0.28, y: 0.50 }, { x: 0.28, y: 0.78 },
  { x: 0.42, y: 0.50 }, { x: 0.50, y: 0.50 }, { x: 0.58, y: 0.50 },
  { x: 0.64, y: 0.78 }, { x: 0.68, y: 0.50 }, { x: 0.72, y: 0.22 },
];

const LINES: [number, number][] = [
  [0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8],
];

const AMBIENT = [
  { x: 0.08, y: 0.12, r: 1.0, ph: 0.0 }, { x: 0.92, y: 0.18, r: 1.2, ph: 0.8 },
  { x: 0.15, y: 0.65, r: 0.8, ph: 1.5 }, { x: 0.85, y: 0.58, r: 1.1, ph: 2.3 },
  { x: 0.25, y: 0.08, r: 0.9, ph: 0.4 }, { x: 0.72, y: 0.06, r: 0.7, ph: 1.2 },
  { x: 0.05, y: 0.42, r: 1.0, ph: 3.1 }, { x: 0.95, y: 0.36, r: 0.8, ph: 2.7 },
  { x: 0.20, y: 0.88, r: 0.9, ph: 0.9 }, { x: 0.80, y: 0.85, r: 1.1, ph: 1.8 },
  { x: 0.45, y: 0.04, r: 0.7, ph: 2.1 }, { x: 0.55, y: 0.96, r: 0.8, ph: 0.3 },
  { x: 0.12, y: 0.35, r: 0.5, ph: 0.6 }, { x: 0.88, y: 0.30, r: 0.6, ph: 1.4 },
  { x: 0.35, y: 0.92, r: 0.8, ph: 2.4 }, { x: 0.65, y: 0.90, r: 0.7, ph: 0.2 },
];

const GROUPS = [
  { starStart: 0.15, lineStart: 0.30, starIndices: [0, 1, 2], lineIndices: [0, 1] },
  { starStart: 0.42, lineStart: 0.56, starIndices: [3, 4, 5], lineIndices: [2, 3] },
  { starStart: 0.65, lineStart: 0.76, starIndices: [6, 7, 8], lineIndices: [4, 5] },
];

const CONFETTI_COLORS = ['#e63946', '#cc0000', '#ff1a1a', '#1a1a1a', '#2a2a2a', '#ff4444'];

function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
function clamp01(t: number) { return Math.max(0, Math.min(1, t)); }
function remap(t: number, a: number, b: number) { return clamp01((t - a) / (b - a)); }

export function TwentyOnePilotsEgg({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stopped = false;
    let frame: number;

    const rain = () => {
      if (stopped) return;
      confetti({
        particleCount: 6,
        angle: 270,
        spread: 80,
        origin: { x: Math.random(), y: -0.05 },
        colors: CONFETTI_COLORS,
        gravity: 0.7,
        decay: 0.95,
        startVelocity: 14,
        ticks: 400,
        shapes: ['square', 'circle'],
        zIndex: 9999,
      });
      frame = requestAnimationFrame(rain);
    };

    confetti({
      particleCount: 120,
      angle: 60,
      spread: 50,
      origin: { x: 0, y: 0.3 },
      colors: CONFETTI_COLORS,
      gravity: 0.6,
      decay: 0.95,
      startVelocity: 25,
      ticks: 400,
      shapes: ['square', 'circle'],
      zIndex: 9999,
    });
    confetti({
      particleCount: 120,
      angle: 120,
      spread: 50,
      origin: { x: 1, y: 0.3 },
      colors: CONFETTI_COLORS,
      gravity: 0.6,
      decay: 0.95,
      startVelocity: 25,
      ticks: 400,
      shapes: ['square', 'circle'],
      zIndex: 9999,
    });

    // Start the rain loop
    frame = requestAnimationFrame(rain);

    // Stop rain after 4s, let existing confetti fall naturally
    const stop = setTimeout(() => { stopped = true; }, 4000);

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      clearTimeout(stop);
    };
  }, []);

  // Constellation canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setup = () => {
      const dpr = window.devicePixelRatio;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setup();

    const startTime = performance.now();
    const TOTAL = 3600;
    let raf: number;

    const draw = (now: number) => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const t = (now - startTime) / TOTAL;

      ctx.clearRect(0, 0, W, H);

      // Ambient stars
      const ambientIn = easeOut(clamp01(t / 0.25));
      AMBIENT.forEach((s) => {
        const twinkle = 0.45 + 0.55 * Math.sin(now * 0.0012 + s.ph);
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(192,193,255,${ambientIn * 0.28 * twinkle})`;
        ctx.fill();
      });

      // Symbols
      GROUPS.forEach((group) => {
        group.starIndices.forEach((si, gi) => {
          const p = easeOut(remap(t, group.starStart + gi * 0.055, group.starStart + gi * 0.055 + 0.1));
          if (p <= 0) return;
          const sx = STARS[si].x * W;
          const sy = STARS[si].y * H;

          const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, 16 * p);
          grd.addColorStop(0, `rgba(192,193,255,${0.28 * p})`);
          grd.addColorStop(1, 'rgba(192,193,255,0)');
          ctx.beginPath();
          ctx.arc(sx, sy, 16 * p, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();

          const scale = p < 0.6 ? p * (1 / 0.6) * 1.35 : 1.35 - (p - 0.6) * (1 / 0.4) * 0.35;
          ctx.beginPath();
          ctx.arc(sx, sy, 2.8 * scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(225,226,255,${p})`;
          ctx.fill();
        });

        group.lineIndices.forEach((li, gi) => {
          const [from, to] = LINES[li];
          const p = easeOut(remap(t, group.lineStart + gi * 0.09, group.lineStart + gi * 0.09 + 0.18));
          if (p <= 0) return;

          const sx = STARS[from].x * W, sy = STARS[from].y * H;
          const ex = STARS[to].x * W,   ey = STARS[to].y * H;

          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + (ex - sx) * p, sy + (ey - sy) * p);
          ctx.strokeStyle = `rgba(192,193,255,${0.38 * Math.min(p * 2.5, 1)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65 }}
      className="fixed inset-0 z-50 cursor-pointer select-none"
      style={{ backgroundColor: 'rgba(11,19,38,0.92)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <motion.p
        initial={{ opacity: 0, letterSpacing: '0.15em' }}
        animate={{ opacity: 1, letterSpacing: '0.48em' }}
        transition={{ delay: 3.0, duration: 1.4, ease: 'easeOut' }}
        className="absolute bottom-14 left-1/2 -translate-x-1/2 text-xs uppercase whitespace-nowrap pointer-events-none"
        style={{ color: 'rgba(192,193,255,0.55)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        twenty one pilots
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.28 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] whitespace-nowrap pointer-events-none"
        style={{ color: 'rgba(192,193,255,1)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        click to dismiss
      </motion.p>
    </motion.div>
  );
}
