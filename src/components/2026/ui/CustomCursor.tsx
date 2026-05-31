'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const [hovered, setHovered] = useState(false);

  const rx = useSpring(mx, { stiffness: 180, damping: 18, mass: 0.5 });
  const ry = useSpring(my, { stiffness: 180, damping: 18, mass: 0.5 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    // Grow over anything interactive (links, buttons, or opt-in [data-cursor]).
    const over = (e: MouseEvent) => {
      const el = e.target as Element | null;
      setHovered(!!el?.closest?.('a, button, [role="button"], [data-cursor]'));
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    document.documentElement.style.cursor = 'none';
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      document.documentElement.style.cursor = '';
    };
  }, [mx, my]);

  return (
    <>
      {/* Dot — follows exactly, hides over interactive targets */}
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
        animate={{ scale: hovered ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      />
      {/* Ring — lags, expands and inverts over interactive targets */}
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
          mixBlendMode: hovered ? 'difference' : 'normal',
        }}
        animate={{
          scale: hovered ? 2 : 1,
          backgroundColor: hovered ? 'var(--ds-primary)' : 'rgba(0,0,0,0)',
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
      />
    </>
  );
}
