'use client';

import { useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import LineScene from './LineScene';
import StationLabel from './StationLabel';
import { CROPS, STAGES, STATIC_AT, type Stage } from './stages';
import { useLineCopy } from './useLineCopy';
import { useLineDriver } from './useLineDriver';

/** Desktop: station labels (HTML, i18n) above the scene, both driven by the same clock. */
function AnimatedLine() {
  const rootRef = useRef<HTMLDivElement>(null);
  const copy = useLineCopy();
  useLineDriver({ rootRef, labels: copy });

  return (
    <div ref={rootRef}>
      {/* Three columns centered at 25 / 50 / 75% so labels sit over their stations */}
      <div className="grid grid-cols-3 px-[12.5%] pb-2">
        {STAGES.map((stage, i) => (
          <StationLabel key={stage} stage={stage} index={i} />
        ))}
      </div>
      <LineScene copy={copy} />
    </div>
  );
}

/** Reduced motion: one frozen frame per station. No loops, no sky events. */
function StaticPanel({ stage, index }: { stage: Stage; index: number }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const copy = useLineCopy();
  useLineDriver({ rootRef, labels: copy, staticAt: STATIC_AT[stage] });

  return (
    <div ref={rootRef} className="flex flex-col gap-3">
      <StationLabel stage={stage} index={index} />
      <LineScene copy={copy} viewBox={CROPS[stage]} />
    </div>
  );
}

export default function ProductionLine() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    return (
      <div className="grid grid-cols-3 gap-6">
        {STAGES.map((stage, i) => (
          <StaticPanel key={stage} stage={stage} index={i} />
        ))}
      </div>
    );
  }
  return <AnimatedLine />;
}
