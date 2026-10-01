'use client';

import { motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

interface DrawPathProps {
  /** Path data. A MotionValue lets a path morph between two same-shaped paths. */
  d: string | MotionValue<string>;
  /** External 0..1 progress. When given, the path is driven by it and never animates on its own. */
  progress?: MotionValue<number>;
  /** Self-driven mode only: draws in when true, draws out when false. */
  active?: boolean;
  duration?: number;
  delay?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
}

/**
 * SVG stroke that draws itself via pathLength (transform-free, compositor friendly).
 * Colors are CSS values, so DS tokens work: stroke="var(--ds-primary)".
 */
export function DrawPath({
  d,
  progress,
  active = true,
  duration = 0.8,
  delay = 0,
  stroke = 'var(--ds-primary)',
  strokeWidth = 1.6,
  fill = 'none',
}: DrawPathProps) {
  const reduceMotion = useReducedMotion();
  const fallback = useMotionValue(0);
  // Round caps leave a dot at pathLength 0, so hide the path until it has started.
  const visible = useTransform(progress ?? fallback, (v) => (v > 0.04 ? 1 : 0));

  const shared = {
    d,
    fill,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    style: { stroke },
  };

  if (progress) {
    return <motion.path {...shared} style={{ stroke, pathLength: progress, opacity: visible }} />;
  }

  const on = active || reduceMotion;
  return (
    <motion.path
      {...shared}
      initial={{ pathLength: reduceMotion ? 1 : 0, opacity: reduceMotion ? 1 : 0 }}
      animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
      transition={{ duration: reduceMotion ? 0 : duration, delay, ease: EASE_OUT_EXPO }}
    />
  );
}
