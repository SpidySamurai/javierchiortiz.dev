import { useId, type CSSProperties } from 'react';
import {
  AXES_D, AXES_LEN, B, BUILD_MARKS_D, CIRCLE_D, CIRCLE_LEN, DIMS_D, DIMS_LEN, FRONT, HULL_D, HULL_LEN, L, P, PIV,
  PLAN_GRID_D, PY, TOP, VIEW_H, VIEW_W,
} from './geometry';

/**
 * The scene markup. Static React: every animated attribute is declared with
 * `data-bind` and written by the line driver, so this never re-renders per frame.
 * Colors come from DS tokens; the two semantic colors are --ds-issue and --ds-pass.
 */

const C = {
  primary: 'var(--ds-primary)',
  vivid: 'var(--ds-primary-container)',
  outline: 'var(--ds-outline)',
  outlineVariant: 'var(--ds-outline-variant)',
  bg: 'var(--ds-bg)',
  belt: 'var(--ds-surface-container)',
  plate: 'var(--ds-surface-high)',
  steel: 'var(--ds-surface-highest)',
  bright: 'var(--ds-surface-bright)',
  on: 'var(--ds-on-surface)',
  onVariant: 'var(--ds-on-surface-variant)',
  spark: 'var(--ds-spark)',
} as const;

interface SceneProps {
  /** viewBox to show. Mobile crops around one station. */
  viewBox?: string;
  className?: string;
}

function Zone({ id, cx, bind, color }: { id: string; cx: number; bind: string; color: string }) {
  return (
    <>
      <radialGradient id={`${id}-${cx}`}>
        <stop offset="0%" stopColor={color} stopOpacity="0.9" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </radialGradient>
      <circle cx={cx} cy={330} r={170} fill={`url(#${id}-${cx})`} data-bind={`opacity:${bind}`} />
    </>
  );
}

function Backdrop({ id }: { id: string }) {
  return (
    <>
      <Zone id={id} cx={P} bind="zone.plan" color={C.vivid} />
      <Zone id={id} cx={B} bind="zone.build" color={C.vivid} />
      <Zone id={id} cx={L} bind="zone.launch" color={C.spark} />
      {/* Drafting table post */}
      <line x1={PIV[0]} y1={140} x2={PIV[0]} y2={PIV[1]} stroke={C.outlineVariant} strokeWidth={4} strokeLinecap="round" />
      <rect x={96} y={132} width={28} height={12} rx={3} fill={C.steel} />
    </>
  );
}

/** Physical conveyor: surface, front edge, moving treads, luminous progress trail, station plates. */
function Band() {
  return (
    <>
      <ellipse cx={640} cy={392} rx={680} ry={14} fill="black" opacity={0.35} style={{ filter: 'blur(10px)' }} />
      <rect x={0} y={TOP} width={VIEW_W} height={48} fill={C.belt} />
      <rect x={0} y={FRONT} width={VIEW_W} height={20} fill={C.bg} />
      <rect x={0} y={FRONT} width={VIEW_W} height={2} fill={C.steel} />
      <path data-bind="d:treadsD" fill="none" stroke={C.steel} strokeWidth={2} strokeLinecap="round" />
      <line x1={0} y1={309} x2={VIEW_W} y2={309} stroke={C.bright} strokeWidth={1} />

      <g data-bind="opacity:planPlateOp">
        <polygon points="234,311 414,311 406,349 226,349" fill={C.plate} />
        <path d={PLAN_GRID_D} data-bind="opacity:plateGridOp" fill="none" stroke={C.vivid} strokeWidth={1} />
      </g>
      <g data-bind="opacity:buildPlateOp">
        <polygon points="554,311 734,311 726,349 546,349" fill={C.plate} />
        <path d={BUILD_MARKS_D} fill="none" stroke={C.primary} strokeWidth={1.5} strokeLinecap="round" />
      </g>
      <g data-bind="opacity:padOp">
        <polygon points="874,311 1054,311 1046,349 866,349" fill={C.plate} />
        <polygon
          points="874,311 1054,311 1046,349 866,349"
          fill={C.spark}
          data-bind="opacity:padWarm"
          style={{ filter: 'blur(2px)' }}
        />
      </g>

      <line x1={0} y1={330} x2={0} y2={330} data-bind="x2:trailX2,opacity:trailOp" stroke={C.vivid} strokeWidth={6} style={{ filter: 'blur(4px)' }} />
      <line x1={0} y1={330} x2={0} y2={330} data-bind="x2:trailX2,opacity:trailOp" stroke={C.primary} strokeWidth={1.5} />
    </>
  );
}

/** Blueprint that the drafting arm draws at the plan station. */
function Blueprint() {
  return (
    <g transform={`translate(${P} ${PY})`} data-bind="opacity:cons.op">
      <path
        d={CIRCLE_D} fill="none" stroke={C.vivid} strokeWidth={1.2}
        strokeDasharray={CIRCLE_LEN} data-bind="stroke-dashoffset:cons.circleOff"
      />
      <path
        d={AXES_D} fill="none" stroke={C.vivid} strokeWidth={1}
        strokeDasharray={AXES_LEN} data-bind="stroke-dashoffset:cons.axesOff"
      />
      <path
        d={DIMS_D} fill="none" stroke={C.primary} strokeWidth={1.2}
        strokeDasharray={DIMS_LEN} data-bind="stroke-dashoffset:cons.dimsOff"
      />
    </g>
  );
}

/** The product piece: outline, ignition tail and glow. Cubes land here in the build stage. */
function Product() {
  return (
    <g data-bind="transform:piece.tf">
      <ellipse cx={0} cy={30} rx={66} ry={10} fill="black" data-bind="opacity:piece.shadowOp" style={{ filter: 'blur(6px)' }} />
      <path
        d={HULL_D} fill="none" stroke={C.primary} strokeWidth={1.6} strokeLinejoin="round"
        strokeDasharray={HULL_LEN} data-bind="stroke-dashoffset:piece.outlineOff,opacity:piece.outlineOp"
      />
      <line x1={0} y1={-26} x2={0} y2={-26} data-bind="x1:piece.tailX" stroke={C.spark} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
      <circle cx={0} cy={-26} r={14} fill={C.spark} opacity={0.55} style={{ filter: 'blur(8px)' }} />
      <circle cx={0} cy={-26} r={5} fill="color-mix(in srgb, var(--ds-spark) 25%, white)" />
    </g>
  );
}

/** Two-segment drafting arm with IK. */
function DraftingArm() {
  return (
    <>
      <g data-bind="opacity:arm.op">
        <line x1={PIV[0]} y1={PIV[1]} data-bind="x2:arm.ex,y2:arm.ey" stroke={C.onVariant} strokeWidth={4} strokeLinecap="round" />
        <line data-bind="x1:arm.ex,y1:arm.ey,x2:arm.tx,y2:arm.ty" stroke={C.onVariant} strokeWidth={3} strokeLinecap="round" />
        <circle cx={PIV[0]} cy={PIV[1]} r={7} fill={C.plate} stroke={C.onVariant} strokeWidth={2} />
        <circle data-bind="cx:arm.ex,cy:arm.ey" r={5} fill={C.plate} stroke={C.onVariant} strokeWidth={2} />
      </g>
      <circle data-bind="cx:arm.tx,cy:arm.ty,opacity:arm.tipGlow" r={7} fill={C.primary} style={{ filter: 'blur(4px)' }} />
      <circle data-bind="cx:arm.tx,cy:arm.ty" r={2.5} fill={C.on} />
    </>
  );
}

export default function LineScene({ viewBox = `0 0 ${VIEW_W} ${VIEW_H}`, className }: SceneProps) {
  const id = useId();
  const [, , w, h] = viewBox.split(' ').map(Number);
  const style: CSSProperties = { display: 'block', width: '100%', height: 'auto', aspectRatio: `${w} / ${h}` };
  return (
    <svg aria-hidden viewBox={viewBox} className={className} style={style} overflow={viewBox.startsWith('0 0') ? 'visible' : 'hidden'}>
      <Backdrop id={id} />
      <Band />
      <Blueprint />
      <Product />
      <DraftingArm />
    </svg>
  );
}
