'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Runs `update` once on mount and then at most once per animation frame while the
 * page scrolls or resizes. Does nothing under prefers-reduced-motion; `reducedUpdate`
 * (if given) runs once instead so the element can settle in its final state.
 * `update` must write to the DOM directly (refs), never to React state.
 */
export function useRafScroll(
  ref: RefObject<HTMLElement | null>,
  update: (el: HTMLElement, vw: number, vh: number) => void,
  reducedUpdate?: (el: HTMLElement) => void,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reducedUpdate?.(el);
      return;
    }

    let frame = 0;
    const run = () => {
      frame = 0;
      update(el, window.innerWidth, window.innerHeight);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(run);
    };

    run();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
    // update callbacks are module-level or stable by construction in the callers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}
