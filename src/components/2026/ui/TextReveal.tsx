'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
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
    <span className={className} style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.12em' }}>
      <motion.span
        style={{ display: 'block', willChange: 'transform' }}
        initial={{ y: '120%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
