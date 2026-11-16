import Cube from './Cube';
import { Booster } from './Booster';
import { FACES, HULL4_STR, HULL5_STR, HULL_C2_STR, HULL_D, HULL_LEN, KINDS, SWARM, TOPC } from './cubes';
import { COUNT } from './geometry';

/**
 * The product piece: shadow, wireframe ghost, outline, ignition tail, booster, the five
 * modules of the build and the update swarm. The swarm gets depth without re-parenting:
 * each module is drawn in a back layer (before the build) and a front layer (after it)
 * and only one of the two has opacity at a time.
 */

const ghostStyle = { fill: 'var(--ds-primary-vivid)', fillOpacity: 0.06, stroke: 'var(--ds-primary)', strokeOpacity: 0.55, strokeWidth: 1, strokeLinejoin: 'round' as const };
const swarmIdx = Array.from({ length: COUNT.swarm }, (_, i) => i);
const buildIdx = [0, 1, 2, 3, 4] as const;

/** Feedback flag on the misaligned block. */
function Flag() {
  const [tx, ty] = TOPC[2];
  const x = tx - 36;
  return (
    <g opacity={0} data-bind="opacity:flag.op">
      <polygon points={HULL_C2_STR} fill="var(--ds-issue)" fillOpacity={0.12} stroke="var(--ds-issue)" strokeWidth={2.6} strokeLinejoin="round" />
      <circle cx={x} cy={ty - 8} r={18} fill="var(--ds-issue)" opacity={0.35} style={{ filter: 'blur(6px)' }} />
      <circle cx={x} cy={ty - 8} r={11} fill="var(--ds-issue)" />
      <path d={`M${x} ${ty - 14} L${x} ${ty - 7} M${x} ${ty - 2.6} L${x} ${ty - 2.2}`} fill="none" stroke="var(--ds-bg)" strokeWidth={2.6} strokeLinecap="round" />
    </g>
  );
}

function SwarmLayer({ layer }: { layer: 'B' | 'F' }) {
  return (
    <g>
      {swarmIdx.map((i) => (
        <Cube key={i} faces={SWARM[i].faces} kind={SWARM[i].kind} bind={{ tf: `sw${i}.tf`, op: `sw${i}.op${layer}`, lit: `sw${i}.lit` }} />
      ))}
    </g>
  );
}

export function Piece() {
  return (
    <g data-bind="transform:piece.tf,opacity:piece.op">
      <ellipse cx={0} cy={42} rx={84} ry={12} fill="black" opacity={0} style={{ filter: 'blur(6px)' }} data-bind="opacity:piece.shadowOp" />
      <g opacity={0} data-bind="opacity:piece.ghostOp">
        {buildIdx.flatMap((k) =>
          (['top', 'right', 'left'] as const).map((face) => <polygon key={`${k}${face}`} points={FACES[k][face]} {...ghostStyle} />),
        )}
      </g>
      <path
        d={HULL_D} fill="none" stroke="var(--ds-primary)" strokeWidth={1.8} strokeLinejoin="round"
        strokeDasharray={`${HULL_LEN} ${HULL_LEN}`} strokeDashoffset={HULL_LEN} data-bind="stroke-dashoffset:piece.hullOff,opacity:piece.hullOp"
      />
      <line x1={0} y1={-26} x2={0} y2={-26} stroke="var(--ds-spark)" strokeWidth={3} strokeLinecap="round" opacity={0.7} data-bind="x1:piece.tailX" />
      <circle cx={0} cy={-26} r={15} fill="var(--ds-spark)" opacity={0.55} style={{ filter: 'blur(8px)' }} />
      <circle cx={0} cy={-26} r={5} fill="color-mix(in srgb, var(--ds-spark) 25%, white)" />
      <Booster />
      <SwarmLayer layer="B" />
      {buildIdx.map((k) => (
        <Cube key={k} faces={FACES[k]} kind={KINDS[k]} bind={{ tf: `c${k}.tf`, op: `c${k}.op`, lit: `c${k}.win` }}>
          {k === 2 && <Flag />}
        </Cube>
      ))}
      <SwarmLayer layer="F" />
      {swarmIdx.map((i) => (
        <g key={i}>
          <ellipse cx={SWARM[i].at[0]} cy={SWARM[i].at[1]} rx={14} ry={6} fill="none" stroke="var(--ds-primary)" strokeWidth={2} opacity={0} data-bind={`rx:snap${i}.rx,ry:snap${i}.ry,opacity:snap${i}.op`} />
          <circle r={16} fill="var(--ds-primary)" opacity={0} style={{ filter: 'blur(7px)' }} data-bind={`cx:snapGlow${i}.cx,cy:snapGlow${i}.cy,opacity:snapGlow${i}.op`} />
        </g>
      ))}
      <polygon points={HULL4_STR} fill="none" stroke="var(--ds-pass)" strokeWidth={2.6} strokeLinejoin="round" opacity={0} data-bind="opacity:pass.op4" />
      <polygon points={HULL5_STR} fill="none" stroke="var(--ds-pass)" strokeWidth={2.6} strokeLinejoin="round" opacity={0} data-bind="opacity:pass.op5" />
    </g>
  );
}
