'use client';

import { useId } from 'react';
import { MC } from '@/lib/catPalette';
import {
  EARS,
  EAR_BASE_Y,
  EYE_X,
  EYE_Y,
  HEAD_PATCH,
  HEAD_SHAPE,
  NOSE_SHAPE,
  RUN_BODY_SHAPE,
  RUN_TAIL_SHAPE,
  earInnerShape,
  earShape,
} from '@/lib/catShapes';
import styles from './MantecadoRun.module.css';

/**
 * Mantecado running across the bottom of the viewport, once, left to right.
 * The same flat drawing as MantecadoCat: its head as is, with the eyes turned
 * to where it runs, the body stretched sideways and pill legs. Decorative.
 */

function Leg({ className, x, near }: { className: string; x: number; near: boolean }) {
  return (
    <g className={className}>
      <rect
        x={x - 8}
        y={102}
        width={16}
        height={50}
        rx={8}
        fill={near ? MC.white : MC.farLeg}
        {...(near ? { stroke: MC.dark, strokeOpacity: 0.14, strokeWidth: 1 } : {})}
      />
    </g>
  );
}

/** An ear at its resting tilt, swept back 10 degrees for the run. */
function Ear({ side }: { side: 'left' | 'right' }) {
  const { apex, base, resting } = EARS[side];
  return (
    <g transform={`rotate(-10 ${base} ${EAR_BASE_Y})`}>
      <g transform={`rotate(${resting} ${apex} 5)`}>
        <path
          d={earShape(apex)}
          fill={MC.orange}
          stroke={MC.orange}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <path d={earInnerShape(apex)} fill={MC.nose} />
      </g>
    </g>
  );
}

/** An open eye looking ahead, to the right. */
function Eye({ cx }: { cx: number }) {
  return (
    <g transform={`translate(${cx} ${EYE_Y})`}>
      <circle r={12} fill={MC.dark} />
      <circle r={9} fill={MC.eyeYellow} />
      <circle cx={3.4} cy={-0.4} r={4} fill={MC.dark} />
      <circle cx={4.9} cy={-1.9} r={1.3} fill="#fff" opacity={0.9} />
    </g>
  );
}

export default function MantecadoRun({ onDone }: { onDone: () => void }) {
  const uid = useId().replace(/:/g, '');
  return (
    <div
      aria-hidden
      className={styles.run}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) onDone();
      }}
    >
      <svg viewBox="-40 -40 260 210" focusable="false">
        <defs>
          <clipPath id={`${uid}-h`}>
            <path d={HEAD_SHAPE} />
          </clipPath>
          <clipPath id={`${uid}-b`}>
            <path d={RUN_BODY_SHAPE} />
          </clipPath>
          <clipPath id={`${uid}-t`}>
            <path d={RUN_TAIL_SHAPE} />
          </clipPath>
        </defs>
        <g className={styles.bob}>
          {/* Tail, raised behind the body, with its three faint stripes */}
          <g className={styles.tail}>
            <g transform="rotate(-24 28 92)">
              <path d={RUN_TAIL_SHAPE} fill={MC.orange} />
              <g clipPath={`url(#${uid}-t)`} fill="#000" opacity={0.05}>
                <rect x={-20} y={80} width={8} height={25} />
                <rect x={-4} y={80} width={8} height={25} />
                <rect x={12} y={80} width={8} height={25} />
              </g>
            </g>
          </g>

          <Leg className={styles.backFar} x={74} near={false} />
          <Leg className={styles.frontFar} x={162} near={false} />

          <path d={RUN_BODY_SHAPE} fill={MC.white} />
          <circle cx={54} cy={70} r={41.2} fill={MC.orange} clipPath={`url(#${uid}-b)`} />

          <Leg className={styles.backNear} x={62} near />
          <Leg className={styles.frontNear} x={150} near />

          {/* The left whisker is left out: seen from the side it would cross the body. */}
          <g className={styles.head}>
            <g transform="translate(118 2) rotate(-4 50 90)">
              <path d={HEAD_SHAPE} fill={MC.white} />
              <path d={HEAD_PATCH} fill={MC.orange} clipPath={`url(#${uid}-h)`} />
              <Ear side="left" />
              <Ear side="right" />
              {EYE_X.map((cx) => (
                <Eye key={cx} cx={cx} />
              ))}
              <ellipse cx={14} cy={70} rx={6} ry={3} fill={MC.nose} opacity={0.22} />
              <ellipse cx={86} cy={70} rx={6} ry={3} fill={MC.nose} opacity={0.22} />
              <path d={NOSE_SHAPE} fill={MC.nose} />
              <rect
                x={47}
                y={66}
                width={2}
                height={6}
                fill={MC.nose}
                transform="rotate(30 48 69)"
              />
              <rect
                x={51}
                y={66}
                width={2}
                height={6}
                fill={MC.nose}
                transform="rotate(-30 52 69)"
              />
              <rect
                x={80}
                y={57}
                width={35}
                height={1.5}
                rx={0.75}
                fill={MC.whisker}
                transform="rotate(8 97.5 57.75)"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
