'use client';

import { useCallback, useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/** Lets the hero settle before the run starts. */
const RUN_DELAY_MS = 600;

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
 * When Mantecado shows up on the home page. Every time the page loads he runs
 * across the screen; he peeks from his corner only while the element
 * with `heroId` is out of view, so he never covers the hero. Reduced motion:
 * no run.
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
    const timer = window.setTimeout(() => setRunning(true), RUN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  const endRun = useCallback(() => setRunning(false), []);

  return { running, endRun, showCorner: !running && !heroInView, reduceMotion };
}
