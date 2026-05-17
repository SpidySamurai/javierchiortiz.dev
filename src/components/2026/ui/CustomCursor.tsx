'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);

  const rx = useSpring(mx, { stiffness: 180, damping: 18, mass: 0.5 });
  const ry = useSpring(my, { stiffness: 180, damping: 18, mass: 0.5 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    document.documentElement.style.cursor = 'none';
    return () => {
      window.removeEventListener('mousemove', move);
      document.documentElement.style.cursor = '';
    };
  }, [mx, my]);

  return (
    <>
      {/* Dot — follows exactly */}
      <motion.div
        className="fixed top-0 left-0 z-[10001] pointer-events-none"
        style={{
          x: mx,
          y: my,
          translateX: '-50%',
          translateY: '-50%',
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: 'var(--ds-primary)',
        }}
      />
      {/* Ring — lags behind */}
      <motion.div
        className="fixed top-0 left-0 z-[10000] pointer-events-none"
        style={{
          x: rx,
          y: ry,
          translateX: '-50%',
          translateY: '-50%',
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: '1.5px solid color-mix(in srgb, var(--ds-primary) 50%, transparent)',
        }}
      />
    </>
  );
}
