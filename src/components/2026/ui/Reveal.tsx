'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Centralized easing token for section entrances.
 * Tuple type (not number[]) so Framer Motion 12 accepts it as a cubic-bezier.
 */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface RevealProps {
  children: ReactNode;
  /** vertical offset travelled on enter (px). Ignored under reduced-motion. */
  y?: number;
  /** stagger delay (s) when used standalone. */
  delay?: number;
  className?: string;
}

/**
 * Single-block scroll reveal. Opacity + transform only (zero CLS).
 * Reduced-motion users get an opacity-only fade with a defined end state.
 */
export function Reveal({ children, y = 28, delay = 0, className }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={reduce ? { duration: 0.3 } : { duration: 0.55, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerGroupProps {
  children: ReactNode;
  /** seconds between each child entrance. */
  stagger?: number;
  /** delay before the first child enters. */
  delayChildren?: number;
  className?: string;
}

/**
 * Parent orchestrator: children carrying `variants={STAGGER_ITEM}` (or their own
 * hidden/show variant) cascade in document order. Child y-offset must itself be
 * gated on reduced-motion — this parent only owns timing.
 */
export function StaggerGroup({
  children,
  stagger = 0.08,
  delayChildren = 0.05,
  className,
}: StaggerGroupProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren } } }}
    >
      {children}
    </motion.div>
  );
}
