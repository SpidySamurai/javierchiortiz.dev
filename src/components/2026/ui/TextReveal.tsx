'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { EASE } from './Reveal';

interface TextRevealProps {
  children: ReactNode;
  /** stagger offset when several reveals sit together. */
  delay?: number;
  className?: string;
}

/**
 * Mask/clip heading reveal (#signature). The content wipes up from behind an
 * overflow-hidden frame. Drop inside a styled <h2> — font styles cascade in.
 * Reduced-motion collapses to an opacity fade with a defined end state.
 */
export function TextReveal({ children, delay = 0, className }: TextRevealProps) {
  const reduce = useReducedMotion();
  // Observe the unclipped frame, not the hidden text: the text sits outside the
  // overflow-hidden frame, so observing it can never report "in view".
  const frameRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(frameRef, { once: true, margin: '-40px' });

  if (reduce) {
    return (
      <motion.span
        className={className}
        style={{ display: 'block' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.span>
    );
  }

  return (
    // pb buffer keeps descenders / italics from clipping against the mask edge.
    <span
      ref={frameRef}
      className={className}
      // paddingRight keeps the overhang of a trailing italic glyph from being clipped.
      style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.12em', paddingRight: '0.12em' }}
    >
      <motion.span
        style={{ display: 'block', willChange: 'transform' }}
        // 150% keeps accents (í, ó) from peeking above the mask edge before the reveal.
        initial={{ y: '150%' }}
        animate={inView ? { y: 0 } : undefined}
        transition={{ duration: 0.7, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
