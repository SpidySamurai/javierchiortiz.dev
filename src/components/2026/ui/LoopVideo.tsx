'use client';

import { useEffect, useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

/**
 * A muted walkthrough loop that plays only while it is on screen. A video
 * hidden with display: none never enters the view, so it never plays. With
 * reduced motion it stays on its poster.
 */
export function LoopVideo({
  src,
  poster,
  label,
  className = '',
}: {
  src: string;
  poster?: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (inView && !reduce) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, reduce]);

  return (
    <video
      ref={ref}
      aria-label={label}
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      className={`absolute inset-0 h-full w-full object-cover object-top ${className}`}
      style={{ backgroundColor: 'var(--ds-surface-high)' }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
