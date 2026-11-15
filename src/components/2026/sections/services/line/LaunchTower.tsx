import { dPath } from './math';
import { useGrad } from './SceneDefs';

/** Lattice launch tower behind the belt, with countdown lamps and a beacon; the umbilical arm sits in front. */

const s = (name: string) => `var(--ds-scene-${name})`;
const RUNGS = Array.from({ length: 7 }, (_, i) => 146 + i * 26);
const LATTICE = dPath(Array.from({ length: 6 }, (_, i) => 146 + i * 26).flatMap((y): [number, number][][] => [[[849, y], [873, y + 26]], [[873, y], [849, y + 26]]]));
const LAMPS = [202, 227, 252] as const;

export function LaunchTower() {
  return (
    <g>
      <polygon points="846,146 876,146 884,139 854,139" fill={s('steel-hi')} />
      <rect x={846} y={146} width={30} height={160} fill={s('steel-deep')} />
      <polygon points="876,146 884,139 884,306 876,306" fill={s('steel-shade')} />
      <path d={LATTICE} stroke={s('steel-mid')} strokeWidth={2} fill="none" />
      {RUNGS.map((y) => (
        <rect key={y} x={846} y={y} width={30} height={3} fill={s('steel-hi')} />
      ))}
      <rect x={846} y={146} width={3} height={160} fill={s('steel-hi')} />
      <rect x={873} y={146} width={3} height={160} fill={s('steel-mid')} />
      <rect x={849} y={184} width={24} height={86} rx={5} fill={s('glass')} />
      {LAMPS.map((y, i) => (
        <g key={y}>
          <circle cx={861} cy={y} r={7} fill={s('steel-shade')} />
          <circle cx={861} cy={y} r={13} fill="var(--ds-spark)" opacity={0} style={{ filter: 'blur(5px)' }} data-bind={`opacity:lamp${i}.glow`} />
          <circle cx={861} cy={y} r={6} fill="var(--ds-spark)" opacity={0} data-bind={`opacity:lamp${i}.on`} />
        </g>
      ))}
      <rect x={864} y={122} width={3} height={18} fill={s('steel-hi')} />
      <circle cx={865.5} cy={121} r={4} fill="var(--ds-spark)" opacity={0.3} data-bind="opacity:beacon.op" />
      <circle cx={865.5} cy={121} r={10} fill="var(--ds-spark)" opacity={0} style={{ filter: 'blur(4px)' }} data-bind="opacity:beacon.glow" />
    </g>
  );
}

/** Umbilical arm that reaches the product and lets go at ignition. */
export function Umbilical() {
  const g = useGrad();
  return (
    <g opacity={0} data-bind="opacity:umb.op">
      <rect x={876} y={293} width={0} height={8} rx={2} fill={g('steelV')} data-bind="width:umb.w" />
      <rect x={876} y={288} width={6} height={18} rx={2} fill={s('steel-light')} data-bind="x:umb.clawX" />
    </g>
  );
}
