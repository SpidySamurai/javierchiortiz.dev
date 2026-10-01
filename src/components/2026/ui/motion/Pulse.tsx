'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';

interface PulseProps {
  d: string;
  /** 0..1 position of the dash along the path. Outside the path it is invisible. */
  progress: MotionValue<number>;
  /** Dash length as a fraction of the path (0..1). */
  length?: number;
  stroke?: string;
  strokeWidth?: number;
}

/**
 * A short bright dash travelling along a path. Only strokeDashoffset changes,
 * so nothing re-renders and nothing touches layout.
 */
export function Pulse({
  d,
  progress,
  length = 0.12,
  stroke = 'var(--ds-primary)',
  strokeWidth = 2,
}: PulseProps) {
  // Offset +length hides the dash before the start, -1 pushes it past the end.
  const strokeDashoffset = useTransform(progress, [0, 1], [length, -1]);

  return (
    <motion.path
      d={d}
      fill="none"
      pathLength={1}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray={`${length} 2`}
      style={{
        stroke,
        strokeDashoffset,
        filter: 'drop-shadow(0 0 4px color-mix(in srgb, var(--ds-primary) 70%, transparent))',
      }}
    />
  );
}
