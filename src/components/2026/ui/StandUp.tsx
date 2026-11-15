'use client';

import { useRef, type ReactNode } from 'react';
import { useRafScroll } from './useRafScroll';

interface StandUpProps {
  children: ReactNode;
  /** 0 to 0.25, added to the progress so items in a row can lead (edges first). */
  lead?: number;
  className?: string;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Media stands up as it enters: tilts back and rises into place depending on its
 * viewport position, ending with no transform. Reduced motion: never transforms.
 */
export function StandUp({ children, lead = 0, className }: StandUpProps) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useRafScroll(outer, (el, vw, vh) => {
    const target = inner.current;
    if (!target) return;
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const qv = clamp01((1.039 * vh - center) / (0.44 * vh) + lead);
    const angle = Math.min(112, 140 * (1 - qv) * (1 - qv));
    target.style.transform =
      angle < 0.01
        ? 'none'
        : `rotateX(${angle}deg) translateY(${angle * 0.0729 * (vw / 100)}px) scale(${1 + angle * 0.00092})`;
  });

  return (
    <div ref={outer} className={className} style={{ perspective: '1560px' }}>
      <div ref={inner} className="h-full" style={{ transformOrigin: 'center bottom' }}>
        {children}
      </div>
    </div>
  );
}
