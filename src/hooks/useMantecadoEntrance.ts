'use client';

import { useCallback, useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/** How far down the page has to move before the run starts, so a nudge does not trigger it. */
const RUN_SCROLL_PX = 40;

export interface MantecadoEntrance {
  /** The run across the bottom of the screen is playing. */
  running: boolean;
  /** Call when the run's animation ends. */
  endRun: () => void;
  /** The cat may peek from its corner: the run is over and the hero is out of view. */
  showCorner: boolean;
  reduceMotion: boolean;
}

/**
 * When Mantecado shows up on the home page. On every visit he runs across the
 * screen the first time the page scrolls down, so he does not compete with the
 * hero on load; he peeks from his corner only while the element with `heroId`
 * is out of view, so he never covers the hero. Reduced motion: no run.
 */
export function useMantecadoEntrance(heroId: string): MantecadoEntrance {
  const reduceMotion = useReducedMotion() ?? false;
  const [running, setRunning] = useState(false);
  const [heroInView, setHeroInView] = useState(true);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) {
      setHeroInView(false);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setHeroInView(entry.isIntersecting));
    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroId]);

  useEffect(() => {
    if (reduceMotion) return;
    const startY = window.scrollY;
    const onScroll = () => {
      if (window.scrollY - startY < RUN_SCROLL_PX) return;
      window.removeEventListener('scroll', onScroll);
      setRunning(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduceMotion]);

  const endRun = useCallback(() => setRunning(false), []);

  return { running, endRun, showCorner: !running && !heroInView, reduceMotion };
}
