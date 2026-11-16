import { ptsStr } from './math';
import { L1, L2 } from './geometry';
import { useGrad } from './SceneDefs';

/** Gantry legs, light beam, carriage with gripper; scan plane, pass check and the feedback bubble. */

const s = (name: string) => `var(--ds-scene-${name})`;

/** The two legs stand in front of the belt, behind the product. */
export function GantryLegs() {
  const g = useGrad();
  return (
    <g>
      {[540, 724].map((x) => (
        <g key={x}>
          <rect x={x - 8} y={398} width={32} height={8} rx={2} fill="var(--ds-surface-highest)" />
          <rect x={x} y={184} width={16} height={215} fill={g('steelH')} />
          <polygon points={ptsStr([[x + 16, 184], [x + 22, 178], [x + 22, 393], [x + 16, 399]])} fill={s('steel-shade')} />
          <rect x={x + 3} y={232} width={10} height={3} fill={s('steel-light')} />
          <rect x={x + 3} y={330} width={10} height={3} fill={s('steel-light')} />
        </g>
      ))}
    </g>
  );
}

/** Beam, carriage, rod, sleeve and the gripper that holds each module. In front of the product. */
export function GantryBeam() {
  const g = useGrad();
  return (
    <g>
      <polygon points="528,170 752,170 762,161 538,161" fill={s('steel-hi')} />
      <rect x={528} y={170} width={224} height={16} fill={g('steelV')} />
      <polygon points="752,170 762,161 762,177 752,186" fill={s('steel-shade')} />
      <rect x={538} y={176} width={204} height={3} rx={1.5} fill={s('steel-shade')} />
      <rect x={538} y={176} width={204} height={3} rx={1.5} fill="var(--ds-primary)" opacity={0} data-bind="opacity:beam.op" />
      <rect x={534} y={172} width={212} height={11} rx={5} fill="var(--ds-primary-vivid)" opacity={0} style={{ filter: 'blur(5px)' }} data-bind="opacity:beam.glow" />
      <g data-bind="transform:car.tf">
        <rect x={-14} y={186} width={28} height={11} rx={2} fill={s('steel-mid')} />
        <rect x={-14} y={186} width={28} height={2} fill={s('steel-light')} />
        <circle cx={8} cy={192} r={2.2} fill="var(--ds-pass)" opacity={0.4} data-bind="opacity:car.ledOp,s.fill:car.ledFill" />
      </g>
      <rect y={197} width={5} height={0} fill={s('steel-bright')} data-bind="x:rod.x,height:rod.h" />
      <rect y={197} width={9} height={12} fill={s('steel-hi')} data-bind="x:sleeve.x" />
      <g data-bind="transform:head.tf">
        <rect x={-13} y={-10} width={26} height={8} rx={2} fill={s('steel-light')} />
        <rect x={-13} y={-10} width={26} height={2} fill={s('steel-bright')} />
        <rect y={-3} width={3.5} height={11} rx={1} fill={s('steel-bright')} data-bind="x:fing.l" />
        <rect y={-3} width={3.5} height={11} rx={1} fill={s('steel-bright')} data-bind="x:fing.r" />
      </g>
    </g>
  );
}

/** Scan plane sweeping the product, pass check, and the feedback bubble that flies in. */
export function GantryFx() {
  const g = useGrad();
  return (
    <>
      <g opacity={0} data-bind="opacity:scan.op">
        <polygon fill={g('scan')} data-bind="points:scan.poly" />
        <line x1={556} x2={724} stroke="var(--ds-primary-container)" strokeWidth={10} style={{ filter: 'blur(5px)' }} data-bind="y1:scan.y,y2:scan.y" />
        <line x1={556} x2={724} stroke="var(--ds-on-surface)" strokeWidth={1.6} data-bind="y1:scan.y,y2:scan.y" />
      </g>
      <g opacity={0} data-bind="opacity:pass.checkOp">
        <circle cx={708} cy={222} r={20} fill="var(--ds-pass)" opacity={0.35} style={{ filter: 'blur(6px)' }} />
        <circle cx={708} cy={222} r={12} fill="var(--ds-pass)" />
        <path d="M702 222 L706.5 226.5 L714.5 217.5" fill="none" stroke="var(--ds-bg)" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g opacity={0} data-bind="transform:fb.tf,opacity:fb.op">
        <rect x={-22} y={-15} width={46} height={34} rx={9} fill="black" opacity={0.4} style={{ filter: 'blur(5px)' }} />
        <polygon points="-8,14 2,14 -12,24" fill="var(--ds-surface-highest)" />
        <rect x={-22} y={-17} width={44} height={31} rx={9} fill="var(--ds-surface-highest)" />
        <rect x={-22} y={-17} width={44} height={4} rx={2} fill="white" opacity={0.08} />
        <path d="M0 -9 L0 5 M-7 -2 L7 -2" fill="none" stroke="var(--ds-spark)" strokeWidth={2.6} strokeLinecap="round" />
      </g>
    </>
  );
}

/** Outline of the foreground arm: a thin dark edge that separates it from the belt behind. */
const FG_EDGE = 'color-mix(in srgb, var(--ds-scene-steel-shade) 60%, black)';

interface ArmProps {
  /** Frame key prefix: a1 or a2. */
  id: 'a1' | 'a2';
  piv: readonly [number, number];
  /** Scale of the whole arm (links, thickness, joints). */
  k: number;
  /** Foreground arm: darker tones and an outline. */
  fg?: boolean;
}

/** Drafting arm: two segments with joints, the emitter head and the tracing light. */
export function DraftArm({ id, piv, k, fg = false }: ArmProps) {
  const g = useGrad();
  const l1 = L1 * k;
  const l2 = L2 * k;
  const fill = g(fg ? 'armF' : 'armU');
  const ol = fg ? { stroke: FG_EDGE, strokeWidth: 1.2, strokeOpacity: 0.8 } : {};
  const joint = fg ? s('steel-deep') : 'var(--ds-surface-highest)';
  const jointHi = fg ? s('steel-hi') : s('steel-light');
  const hand = s('steel-mid');
  const handHi = fg ? s('steel-bright') : s('steel-light');
  return (
    <>
      <g data-bind={`opacity:${id}.op`}>
        <g data-bind={`transform:${id}.upperTf`}>
          <rect x={-8 * k} y={-8 * k} width={l1 + 16 * k} height={16 * k} rx={8 * k} fill={fill} {...ol} />
          <rect x={28 * k} y={-2.5 * k} width={l1 - 56 * k} height={5 * k} rx={2.5 * k} fill={s('steel-lo')} opacity={fg ? 0.75 : 0.55} />
        </g>
        <g data-bind={`transform:${id}.foreTf`}>
          <rect x={-6 * k} y={-6 * k} width={l2 - 14 * k} height={12 * k} rx={6 * k} fill={fill} {...ol} />
          <rect x={l2 - 30 * k} y={-8.5 * k} width={24 * k} height={17 * k} rx={4 * k} fill={hand} {...ol} />
          <rect x={l2 - 30 * k} y={-8.5 * k} width={24 * k} height={3 * k} rx={1.5 * k} fill={handHi} />
          <polygon points={`${l2 - 6 * k},${-5 * k} ${l2},${-2 * k} ${l2},${2 * k} ${l2 - 6 * k},${5 * k}`} fill={s('steel-bright')} />
        </g>
        <circle cx={piv[0]} cy={piv[1]} r={17 * k} fill={joint} {...ol} />
        <circle cx={piv[0]} cy={piv[1]} r={11 * k} fill={jointHi} />
        <circle cx={piv[0]} cy={piv[1]} r={4 * k} fill="var(--ds-primary)" />
        <g data-bind={`transform:${id}.elbowTf`}>
          <circle r={12 * k} fill={joint} {...ol} />
          <circle r={7 * k} fill={jointHi} />
          <circle r={2.8 * k} fill="var(--ds-primary)" />
        </g>
      </g>
      <circle r={9 * k} fill="var(--ds-primary-container)" opacity={0} style={{ filter: 'blur(4px)' }} data-bind={`cx:${id}.tx,cy:${id}.ty,opacity:${id}.tipGlow`} />
      <circle r={2.8 * k} fill="var(--ds-on-surface)" data-bind={`cx:${id}.tx,cy:${id}.ty,opacity:${id}.tipOp`} />
    </>
  );
}
