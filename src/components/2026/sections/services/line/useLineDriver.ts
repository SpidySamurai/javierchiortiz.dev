'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { animate, motionValue, useInView, type AnimationPlaybackControls } from 'framer-motion';
import { applyFrame, collectBindings, type Labels } from './bind';
import { CYCLE, lineFrame } from './frame';

interface Options {
  /** Element that contains every bound node (scene and, on desktop, the labels). */
  rootRef: RefObject<HTMLElement | null>;
  /** Slice of the timeline to play, in seconds. Defaults to the whole cycle. */
  from?: number;
  to?: number;
  /** Loop the slice forever, or play once and hold the last frame. */
  loop?: boolean;
  /** Paint this single frame and never animate (reduced motion). */
  staticAt?: number;
  /** Translations for the text keys the frame emits. */
  labels: Labels;
}

/**
 * Drives the production line from one time MotionValue. Each tick computes a
 * frame and writes it straight to the DOM; nothing plays while offscreen.
 */
export function useLineDriver({ rootRef, from = 0, to = CYCLE, loop = true, staticAt, labels }: Options) {
  const inView = useInView(rootRef, { margin: '120px' });
  const controls = useRef<AnimationPlaybackControls | null>(null);
  const labelsRef = useRef(labels);

  useEffect(() => {
    labelsRef.current = labels;
  }, [labels]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const bindings = collectBindings(root);
    const time = motionValue(staticAt ?? from);
    const paint = (v: number) => applyFrame(bindings, lineFrame(v), labelsRef.current);
    paint(time.get());
    if (staticAt !== undefined) return;

    const off = time.on('change', paint);
    const c = animate(time, [from, to], { duration: to - from, ease: 'linear', repeat: loop ? Infinity : 0 });
    c.pause();
    controls.current = c;
    return () => {
      off();
      c.stop();
      controls.current = null;
    };
  }, [rootRef, from, to, loop, staticAt]);

  useEffect(() => {
    if (staticAt !== undefined) return;
    if (inView) controls.current?.play();
    else controls.current?.pause();
  }, [inView, from, to, loop, staticAt]);
}
