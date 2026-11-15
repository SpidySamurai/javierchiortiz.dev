import { ptsStr } from './math';
import { L1, L2, PIV } from './geometry';
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

/** Drafting arm: two segments with joints, the emitter head and the tracing light. In front of everything. */
export function DraftingArm() {
  const g = useGrad();
  return (
    <>
      <g data-bind="opacity:arm.op">
        <g data-bind="transform:arm.upperTf">
          <rect x={-8} y={-8} width={L1 + 16} height={16} rx={8} fill={g('armU')} />
          <rect x={28} y={-2.5} width={L1 - 56} height={5} rx={2.5} fill={s('steel-lo')} opacity={0.55} />
        </g>
        <g data-bind="transform:arm.foreTf">
          <rect x={-6} y={-6} width={L2 - 14} height={12} rx={6} fill={g('armU')} />
          <rect x={L2 - 30} y={-8.5} width={24} height={17} rx={4} fill={s('steel-mid')} />
          <rect x={L2 - 30} y={-8.5} width={24} height={3} rx={1.5} fill={s('steel-light')} />
          <polygon points={`${L2 - 6},-5 ${L2},-2 ${L2},2 ${L2 - 6},5`} fill={s('steel-bright')} />
        </g>
        <circle cx={PIV[0]} cy={PIV[1]} r={17} fill="var(--ds-surface-highest)" />
        <circle cx={PIV[0]} cy={PIV[1]} r={11} fill={s('steel-light')} />
        <circle cx={PIV[0]} cy={PIV[1]} r={4} fill="var(--ds-primary)" />
        <g data-bind="transform:arm.elbowTf">
          <circle r={12} fill="var(--ds-surface-highest)" />
          <circle r={7} fill={s('steel-light')} />
          <circle r={2.8} fill="var(--ds-primary)" />
        </g>
      </g>
      <circle r={9} fill="var(--ds-primary-container)" opacity={0} style={{ filter: 'blur(4px)' }} data-bind="cx:arm.tx,cy:arm.ty,opacity:arm.tipGlow" />
      <circle r={2.8} fill="var(--ds-on-surface)" data-bind="cx:arm.tx,cy:arm.ty,opacity:arm.tipOp" />
    </>
  );
}
