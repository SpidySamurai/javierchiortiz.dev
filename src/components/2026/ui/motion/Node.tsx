'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion';

interface NodeProps {
  cx: number;
  cy: number;
  r?: number;
  /** 0..1 glow intensity, static or driven by a MotionValue. */
  glow?: number | MotionValue<number>;
  color?: string;
}

/** Small rounded SVG node with an optional glow halo. Renders inside an <svg>. */
export function Node({ cx, cy, r = 3, glow = 0, color = 'var(--ds-primary-vivid)' }: NodeProps) {
  const fixed = useMotionValue(typeof glow === 'number' ? glow : 0);
  useEffect(() => {
    if (typeof glow === 'number') fixed.set(glow);
  }, [glow, fixed]);

  const g = typeof glow === 'number' ? fixed : glow;
  const haloOpacity = useTransform(g, (v) => v * 0.4);
  const coreOpacity = useTransform(g, (v) => 0.4 + 0.6 * v);

  return (
    <g>
      <motion.circle cx={cx} cy={cy} r={r * 2.8} style={{ fill: color, opacity: haloOpacity }} />
      <motion.circle cx={cx} cy={cy} r={r} style={{ fill: color, opacity: coreOpacity }} />
    </g>
  );
}
