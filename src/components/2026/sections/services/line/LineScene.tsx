import { useId, type CSSProperties, type ReactNode } from 'react';
import {
  AXES_D, AXES_LEN, B, BUILD_MARKS_D, CIRCLE_D, CIRCLE_LEN, DIMS_D, DIMS_LEN, FRONT, HULL_D, HULL_LEN, L, P, PIV,
  BEAM, CUBE_STR, HULL4_STR, HULL5_STR, HULL_C2_STR, HB_LEN, PLAN_GRID_D, PY, TOP, TOPC, VIEW_H, VIEW_W,
} from './geometry';
import type { Labels } from './bind';

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
  /** Static scene text (step names), already translated. */
  copy: Labels;
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
      {/* Launch tower */}
      <rect x={866} y={BEAM} width={8} height={200} rx={3} fill={C.steel} />
      {/* Gantry posts */}
      <line x1={548} y1={376} x2={548} y2={BEAM} stroke={C.outlineVariant} strokeWidth={5} strokeLinecap="round" />
      <line x1={732} y1={376} x2={732} y2={BEAM} stroke={C.outlineVariant} strokeWidth={5} strokeLinecap="round" />
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

      <LiftFx />

      <line x1={0} y1={330} x2={0} y2={330} data-bind="x2:trailX2,opacity:trailOp" stroke={C.vivid} strokeWidth={6} style={{ filter: 'blur(4px)' }} />
      <line x1={0} y1={330} x2={0} y2={330} data-bind="x2:trailX2,opacity:trailOp" stroke={C.primary} strokeWidth={1.5} />
    </>
  );
}

const RINGS = [
  { k: 0, w: 2 },
  { k: 1, w: 1.5 },
  { k: 2, w: 1.2 },
] as const;
const PUFFS = [
  { k: 0, x: 928, y: 336, b: 8 },
  { k: 1, x: 992, y: 338, b: 8 },
  { k: 2, x: 900, y: 330, b: 9 },
  { k: 3, x: 1022, y: 332, b: 9 },
  { k: 4, x: 960, y: 326, b: 10 },
] as const;

/** Shockwave rings, smoke puffs and the curved smoke trail left by the ascent. */
function LiftFx() {
  return (
    <g>
      {RINGS.map((r) => (
        <ellipse
          key={r.k} cx={L} cy={340} fill="none" stroke={C.spark} strokeWidth={r.w}
          data-bind={`rx:lift.r${r.k}x,ry:lift.r${r.k}y,opacity:lift.r${r.k}o`}
        />
      ))}
      {PUFFS.map((p) => (
        <circle
          key={p.k} cx={p.x} cy={p.y} fill={C.outline} style={{ filter: `blur(${p.b}px)` }}
          data-bind={`r:lift.p${p.k}r,opacity:lift.p${p.k}o`}
        />
      ))}
      <path data-bind="d:lift.trailD,opacity:lift.trailOp" fill="none" stroke={C.outline} strokeWidth={18} strokeLinecap="round" style={{ filter: 'blur(8px)' }} />
      <path data-bind="d:lift.trailD,opacity:lift.trailOp" fill="none" stroke={C.spark} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

/** Countdown lights and the clamp on the tower. */
function LaunchTower() {
  return (
    <>
      {[212, 254, 296].map((y, i) => (
        <g key={y}>
          <circle cx={870} cy={y} r={5} fill={C.belt} stroke={C.outlineVariant} strokeWidth={1.5} />
          <circle cx={870} cy={y} r={5} fill={C.spark} data-bind={`opacity:launch.n${i}`} />
        </g>
      ))}
      <line x1={874} y1={274} x2={874} y2={274} data-bind="x2:launch.clampX2,opacity:launch.clampOp" stroke={C.outline} strokeWidth={3} strokeLinecap="round" />
    </>
  );
}

/** Orbit ellipse, support heartbeat and rocket plume. They follow the product. */
function Orbit() {
  return (
    <>
      <ellipse data-bind="cx:orbit.cx,cy:orbit.cy,opacity:orbit.op" rx={112} ry={26} fill="none" stroke={C.vivid} strokeWidth={1.2} strokeDasharray="4 7" />
      <path data-bind="d:orbit.hbD,opacity:orbit.hbOp" fill="none" stroke={C.outlineVariant} strokeWidth={1.6} strokeLinejoin="round" />
      <path
        data-bind="d:orbit.hbD,opacity:orbit.hbOp,stroke-dashoffset:orbit.hbOff" fill="none" stroke="var(--ds-pass)" strokeWidth={1.8}
        strokeLinejoin="round" strokeLinecap="round" strokeDasharray={`${HB_LEN * 0.35} ${HB_LEN}`}
      />
      <polygon data-bind="points:lift.plume,opacity:lift.plumeOp" fill={C.spark} style={{ filter: 'blur(3px)' }} />
      <polygon data-bind="points:lift.core,opacity:lift.plumeOp" fill="color-mix(in srgb, var(--ds-spark) 25%, white)" />
    </>
  );
}

/** LIVE badge that rides above the product in orbit, and the DEPLOYED mark on the pad. */
function LaunchMarks({ copy }: { copy: Labels }) {
  return (
    <>
      <g data-bind="transform:badge.tf,opacity:badge.op">
        <rect x={-50} y={0} width={100} height={25} rx={12.5} fill={C.plate} stroke={C.spark} strokeOpacity={0.5} strokeWidth={1} />
        <circle cx={-36} cy={12.5} r={3.5} fill={C.spark} data-bind="opacity:badge.dot" />
        <text x={-27} y={12.5} dominantBaseline="central" fontSize={11} fontWeight={800} letterSpacing="0.12em" fill={C.on} style={{ fontFamily: 'var(--font-manrope), sans-serif' }}>
          LIVE
        </text>
        <text x={11} y={12.5} dominantBaseline="central" fontSize={11} fontWeight={600} fill={C.onVariant} data-bind="text:badge.ver" style={{ fontFamily: 'var(--font-inter), sans-serif' }} />
      </g>
      <g data-bind="opacity:lift.deployOp">
        <circle cx={L} cy={296} r={13} fill="var(--ds-pass)" />
        <path d="M953.5 296 L958.5 301 L967 291" fill="none" stroke={C.bg} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        <text
          x={L} y={258} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600} letterSpacing="0.12em"
          fill="var(--ds-pass)" style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {copy.deployed}
        </text>
      </g>
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

/** One iso cube: three shaded faces plus the lit windows that switch on at launch. */
function Cube({ k, tone = 'ln-cube', children }: { k: number; tone?: string; children?: ReactNode }) {
  const c = CUBE_STR[k];
  const edge = { stroke: C.bg, strokeWidth: 1, strokeOpacity: 0.5 };
  return (
    <g data-bind={`transform:c${k}.tf,opacity:c${k}.op`}>
      <polygon points={c.top} fill={`var(--${tone}-top)`} {...edge} />
      <polygon points={c.right} fill={`var(--${tone}-right)`} {...edge} />
      <polygon points={c.left} fill={`var(--${tone}-left)`} {...edge} />
      <polygon points={c.wr} fill={C.spark} data-bind={`opacity:c${k}.win`} />
      <polygon points={c.wl} fill={C.spark} data-bind={`opacity:c${k}.win`} />
      {children}
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
      <Cube k={0} />
      <Cube k={1} />
      <Cube k={2}>
        {/* Feedback flag on the misaligned block */}
        <polygon points={HULL_C2_STR} data-bind="opacity:flag.op" fill="none" stroke="var(--ds-issue)" strokeWidth={2.5} strokeLinejoin="round" />
        <circle cx={TOPC[2][0] - 34} cy={TOPC[2][1] - 6} r={9} fill="var(--ds-issue)" data-bind="opacity:flag.op" />
        <path
          d={`M${TOPC[2][0] - 34} ${TOPC[2][1] - 11} L${TOPC[2][0] - 34} ${TOPC[2][1] - 5} M${TOPC[2][0] - 34} ${TOPC[2][1] - 1.5} L${TOPC[2][0] - 34} ${TOPC[2][1] - 1}`}
          data-bind="opacity:flag.op" fill="none" stroke={C.bg} strokeWidth={2.2} strokeLinecap="round"
        />
      </Cube>
      <Cube k={3} />
      <Cube k={4} />
      {/* Update module: lands on top in orbit */}
      <Cube k={5} tone="ln-evo" />
      <circle data-bind="cx:evo.gx,cy:evo.gy,opacity:evo.gop" r={7} fill={C.spark} style={{ filter: 'blur(3px)' }} />
      <circle data-bind="r:evo.sr,opacity:evo.sop" cx={0} cy={-68} fill="none" stroke={C.spark} strokeWidth={2} />
      <polygon points={HULL4_STR} data-bind="opacity:pass.op4" fill="none" stroke="var(--ds-pass)" strokeWidth={2.5} strokeLinejoin="round" />
      <polygon points={HULL5_STR} data-bind="opacity:pass.op5" fill="none" stroke="var(--ds-pass)" strokeWidth={2.5} strokeLinejoin="round" />
    </g>
  );
}

/** Gantry: scanning beam, rail, carriage and grip, plus the pass check and the feedback bubble. */
function Gantry() {
  return (
    <>
      <line x1={548} x2={732} data-bind="y1:scan.y,y2:scan.y,opacity:scan.op" stroke={C.primary} strokeWidth={10} style={{ filter: 'blur(5px)' }} />
      <line x1={548} x2={732} data-bind="y1:scan.y,y2:scan.y,opacity:scan.op" stroke={C.on} strokeWidth={1.5} />

      <rect x={536} y={BEAM} width={208} height={8} rx={3} fill={C.steel} />
      <rect x={536} y={BEAM} width={208} height={8} rx={3} fill={C.vivid} data-bind="opacity:gantry.glow" />
      <rect data-bind="x:gantry.carX" y={184} width={24} height={10} rx={2} fill={C.outlineVariant} />
      <line y1={194} data-bind="x1:gantry.armX,x2:gantry.armX,y2:gantry.armY" stroke={C.primary} strokeWidth={2} />
      <path data-bind="d:gantry.gripD" fill="none" stroke={C.primary} strokeWidth={2.5} strokeLinecap="round" />

      <circle cx={724} cy={214} r={11} fill="var(--ds-pass)" data-bind="opacity:pass.checkOp" />
      <path
        d="M718.5 214 L722.5 218 L729.5 210" data-bind="opacity:pass.checkOp"
        fill="none" stroke={C.bg} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"
      />

      <g data-bind="transform:fb.tf,opacity:fb.op">
        <rect x={-17} y={-13} width={34} height={24} rx={7} fill={C.plate} stroke={C.spark} strokeWidth={1.6} />
        <polygon points="-8,11 0,11 -10,19" fill={C.plate} stroke={C.spark} strokeWidth={1.6} strokeLinejoin="round" />
        <path d="M0 -6 L0 4 M-5 -1 L5 -1" fill="none" stroke={C.spark} strokeWidth={2} strokeLinecap="round" />
      </g>
    </>
  );
}

const STEP_ROWS = [
  { key: 'b', label: 'step.build', y: 214.5 },
  { key: 't', label: 'step.test', y: 234.5 },
  { key: 'f', label: 'step.feedback', y: 254.5 },
  { key: 'i', label: 'step.improve', y: 274.5 },
] as const;

/** Iteration counter, the four-step cycle and a status line, drawn next to the gantry. */
function StepIndicator({ copy }: { copy: Labels }) {
  return (
    <g data-bind="opacity:steps.op">
      <g transform="translate(746 189)" fill="none" stroke={C.primary} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 6 A4 4 0 1 1 8.2 2.7 M8.5 0.8 L8.5 3 L10.7 3" />
      </g>
      <text
        x={763} y={195} fontSize={10} fontWeight={600} letterSpacing="0.16em" dominantBaseline="central"
        fill={C.onVariant} data-bind="text:steps.iter" style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      />
      {STEP_ROWS.map((r) => (
        <g key={r.key}>
          <circle cx={749.5} cy={r.y} r={3.5} data-bind={`s.fill:steps.${r.key}.dot`} />
          <text
            x={760} y={r.y} fontSize={11} fontWeight={800} letterSpacing="0.1em" dominantBaseline="central"
            data-bind={`s.fill:steps.${r.key}.c`} style={{ fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            {copy[r.label]}
          </text>
        </g>
      ))}
      <text
        fontSize={11} fontWeight={600} dominantBaseline="central" data-wrap={17}
        data-bind="wrap:ver.text,s.fill:ver.color" style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      >
        <tspan x={746} y={296} />
        <tspan x={746} y={311} />
        <tspan x={746} y={326} />
      </text>
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

export default function LineScene({ copy, viewBox = `0 0 ${VIEW_W} ${VIEW_H}`, className }: SceneProps) {
  const id = useId();
  const [, , w, h] = viewBox.split(' ').map(Number);
  const style = {
    display: 'block', width: '100%', height: 'auto', aspectRatio: `${w} / ${h}`, opacity: 0,
    '--ln-cube-top': 'color-mix(in srgb, var(--ds-primary-container) 55%, white)',
    '--ln-cube-right': 'var(--ds-primary-container)',
    '--ln-cube-left': 'color-mix(in srgb, var(--ds-primary-container) 73%, black)',
    '--ln-evo-top': 'color-mix(in srgb, var(--ds-primary-container) 30%, white)',
    '--ln-evo-right': 'color-mix(in srgb, var(--ds-primary-container) 70%, white)',
    '--ln-evo-left': 'color-mix(in srgb, var(--ds-primary-container) 96%, black)',
  } as CSSProperties;
  return (
    <svg aria-hidden viewBox={viewBox} className={className} style={style} data-bind="s.opacity:ready" overflow={viewBox.startsWith('0 0') ? 'visible' : 'hidden'}>
      <Backdrop id={id} />
      <Band />
      <LaunchTower />
      <Blueprint />
      <Orbit />
      <Product />
      <Gantry />
      <StepIndicator copy={copy} />
      <DraftingArm />
      <LaunchMarks copy={copy} />
    </svg>
  );
}
