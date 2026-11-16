import { PIV2 } from './geometry';
import { ptsStr } from './math';
import { useGrad } from './SceneDefs';

/**
 * Pedestal of the second drafting arm. It stands on the floor in front of the belt, drawn
 * over the belt, the piece and the tray, and its tall column rises to the arm pivot between
 * the plan pad and the gantry leg. Darker foreground tones give the scene its depth.
 */

const s = (name: string) => `var(--ds-scene-${name})`;
const EDGE = 'color-mix(in srgb, var(--ds-scene-steel-shade) 60%, black)';
const CW = 14; // column half width
const RING_Y = 377;

export function ForegroundColumn() {
  const g = useGrad();
  const [qx, qy] = PIV2;
  return (
    <g>
      <ellipse cx={qx + 6} cy={434} rx={62} ry={8} fill="black" opacity={0.55} style={{ filter: 'blur(5px)' }} />
      <polygon points={ptsStr([[qx - 28, 416], [qx + 26, 416], [qx + 34, 409], [qx - 20, 409]])} fill={s('steel-mid')} />
      <rect x={qx - 28} y={416} width={54} height={19} fill={s('steel-deep')} />
      <polygon points={ptsStr([[qx + 26, 416], [qx + 34, 409], [qx + 34, 428], [qx + 26, 435]])} fill={s('steel-shade')} />
      <rect x={qx - 28} y={416} width={54} height={1.5} fill={s('steel-light')} />
      <rect x={qx - CW} y={qy} width={CW * 2} height={412 - qy} fill={g('steelF')} stroke={EDGE} strokeWidth={1} strokeOpacity={0.7} />
      <polygon points={ptsStr([[qx + CW, qy], [qx + CW + 7, qy - 6], [qx + CW + 7, 406], [qx + CW, 412]])} fill={s('steel-shade')} />
      <rect x={qx - CW + 2} y={qy} width={2.5} height={412 - qy} fill={s('steel-bright')} opacity={0.6} />
      {[qy + 34, 300].map((y) => (
        <rect key={y} x={qx - CW} y={y} width={CW * 2} height={3} fill={s('steel-hi')} />
      ))}
      <rect x={qx - 11} y={360} width={22} height={34} rx={3.5} fill={s('glass')} stroke={s('screen-off')} strokeWidth={1} />
      <circle cx={qx} cy={RING_Y} r={7} fill="none" stroke={s('screen-off')} strokeWidth={2.6} />
      <circle
        cx={qx} cy={RING_Y} r={7} fill="none" stroke={s('screen-accent')} strokeWidth={2.6} strokeDasharray="44 44" strokeDashoffset={44}
        transform={`rotate(-90 ${qx} ${RING_Y})`} strokeLinecap="round" data-bind="stroke-dashoffset:ped2.off,opacity:ped2.ringOp"
      />
      <circle cx={qx} cy={RING_Y} r={2.3} fill={s('screen-pass')} opacity={0} data-bind="opacity:ped2.dotOp" />
    </g>
  );
}
