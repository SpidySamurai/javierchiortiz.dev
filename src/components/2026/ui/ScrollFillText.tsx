'use client';

import { Children, cloneElement, isValidElement, useRef, type ReactNode } from 'react';
import { useRafScroll } from './useRafScroll';

const MIN_OPACITY = 0.22;
// Word i is fully filled when the heading top reaches (START - STEP * i) * vh,
// and it ramps in over RAMP * vh of scroll before that, with a cubic ease-in.
const START = 0.813;
const STEP = 0.0625;
const RAMP = 0.125;

function fillWords(node: ReactNode, counter: { n: number }): ReactNode {
  if (typeof node === 'string') {
    return node.split(/(\s+)/).map((part, i) => {
      if (part === '' || /^\s+$/.test(part)) return part;
      const index = counter.n++;
      // No inline opacity: words render fully visible on the server and without JS;
      // the scroll handler dims and fills them once it runs.
      return (
        <span key={i} data-fill-word={index}>
          {part}
        </span>
      );
    });
  }
  if (Array.isArray(node)) {
    return Children.toArray(node).map((child) => fillWords(child, counter));
  }
  if (isValidElement<{ children?: ReactNode }>(node) && node.props.children !== undefined) {
    return cloneElement(node, undefined, fillWords(node.props.children, counter));
  }
  return node;
}

function update(el: HTMLElement, _vw: number, vh: number) {
  const top = el.getBoundingClientRect().top;
  const words = el.querySelectorAll<HTMLElement>('[data-fill-word]');
  words.forEach((word, i) => {
    const done = (START - STEP * i) * vh;
    const p = Math.min(1, Math.max(0, (done + RAMP * vh - top) / (RAMP * vh)));
    word.style.opacity = String(MIN_OPACITY + (1 - MIN_OPACITY) * p * p * p);
  });
}

function settle(el: HTMLElement) {
  el.querySelectorAll<HTMLElement>('[data-fill-word]').forEach((w) => {
    w.style.opacity = '1';
  });
}

/**
 * Word-by-word scroll fill for section titles. Drop inside a styled heading: the
 * heading element and its text stay intact, each word is wrapped in a span whose
 * opacity follows the scroll position. Nested elements (italic accents) keep
 * their styling. Reduced motion renders every word fully filled.
 */
export function ScrollFillText({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  useRafScroll(ref, update, settle);
  return (
    <span ref={ref} style={{ display: 'block' }}>
      {fillWords(children, { n: 0 })}
    </span>
  );
}
