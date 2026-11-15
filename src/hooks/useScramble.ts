'use client';

import { useEffect, useState } from 'react';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&!?';

/** Reveals `target` left to right through random characters, one per 35ms frame. */
export function useScramble(target: string) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    const PRE = 4;
    const maxFrames = PRE + target.length;

    function tick() {
      if (cancelled) return;
      frame++;
      const resolved = Math.max(0, frame - PRE);
      setDisplay(
        target
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' ';
            if (i < resolved) return ch;
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join('')
      );
      if (frame < maxFrames) setTimeout(tick, 35);
      else if (!cancelled) setDisplay(target);
    }

    tick();
    return () => {
      cancelled = true;
    };
  }, [target]);

  return display;
}
