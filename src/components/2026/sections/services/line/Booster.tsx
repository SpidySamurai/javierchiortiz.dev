import { BOOST, NOZ } from './cubes';
import { COUNT } from './geometry';
import { useGrad, useTone } from './SceneDefs';

/**
 * Booster platform under the product at lift-off: a steel slab with warm strips, three
 * bell nozzles, plumes (halo, flame, core) and sparks. Everything follows the frame.
 */

const s = (name: string) => `var(--ds-scene-${name})`;
const HOT = s('hot');
const SPARK_HOT = `color-mix(in srgb, var(--ds-spark) 60%, ${HOT})`;
const GLOW = `color-mix(in srgb, var(--ds-spark) 50%, ${HOT})`;
const SLOTS = [0, 1, 2] as const;
const SPARKS = Array.from({ length: COUNT.sparks }, (_, k) => k);

function Plume({ i }: { i: number }) {
  const g = useGrad();
  return (
    <>
      <polygon fill={g('plume')} opacity={0} style={{ filter: 'blur(9px)' }} data-bind={`points:plume${i}.halo,opacity:plume${i}.haloOp`} />
      <polygon fill={g('plume')} style={{ filter: 'blur(3px)' }} data-bind={`points:plume${i}.outer,opacity:plume${i}.outerOp`} />
      <polygon fill={HOT} data-bind={`points:plume${i}.core,opacity:plume${i}.coreOp`} />
    </>
  );
}

/** Bell nozzle: narrow throat tucked under the slab, flared skirt, hot rim. */
function Nozzle({ i }: { i: number }) {
  const g = useGrad();
  const [x, y] = NOZ[i];
  const d = `M${x - 4} ${y} C${x - 4.5} ${y + 3} ${x - 8.5} ${y + 5} ${x - 9.5} ${y + 7.5} L${x + 9.5} ${y + 7.5} C${x + 8.5} ${y + 5} ${x + 4.5} ${y + 3} ${x + 4} ${y} Z`;
  return (
    <>
      <rect x={x - 5} y={y - 3} width={10} height={4} rx={1.5} fill={s('steel-lo')} />
      <path d={d} fill={g('steelV')} />
      <ellipse cx={x} cy={y + 7.5} rx={9.5} ry={2.6} fill={s('steel-shade')} />
      <ellipse cx={x} cy={y + 7.5} rx={8} ry={2.1} fill={GLOW} opacity={0} data-bind={`opacity:noz${i}.op`} />
    </>
  );
}

export function Booster() {
  const tone = useTone('steel');
  const face = { stroke: tone.edge, strokeOpacity: 0.6, strokeLinejoin: 'round' as const };
  return (
    <g opacity={0} data-bind="transform:boost.tf,opacity:boost.op">
      <ellipse cx={0} cy={70} rx={60} ry={34} fill="var(--ds-spark)" opacity={0} style={{ filter: 'blur(14px)' }} data-bind="opacity:burn.op" />
      {SLOTS.map((i) => <Plume key={i} i={i} />)}
      <polygon points={BOOST.right} fill={tone.right} {...face} />
      <polygon points={BOOST.left} fill={tone.left} {...face} />
      <polygon points={BOOST.top} fill={tone.top} />
      {[BOOST.mRight, BOOST.mLeft].map((m) => (
        <g key={m} transform={m}>
          <rect x={0} y={34} width={100} height={16} fill="var(--ds-spark)" opacity={0.9} />
          {[0, 1, 2, 3, 4].map((v) => (
            <rect key={v} x={10 + v * 18} y={64} width={10} height={14} rx={2} fill={s('steel-shade')} opacity={0.7} />
          ))}
        </g>
      ))}
      <line x1={BOOST.eR[0][0]} y1={BOOST.eR[0][1]} x2={BOOST.eR[1][0]} y2={BOOST.eR[1][1]} stroke="white" strokeOpacity={0.25} />
      <line x1={BOOST.eL[0][0]} y1={BOOST.eL[0][1]} x2={BOOST.eL[1][0]} y2={BOOST.eL[1][1]} stroke="white" strokeOpacity={0.18} />
      {SLOTS.map((i) => <Nozzle key={i} i={i} />)}
      {SPARKS.map((k) => (
        <circle key={k} r={1.6} fill={k % 3 ? SPARK_HOT : HOT} opacity={0} data-bind={`cx:spark${k}.cx,cy:spark${k}.cy,r:spark${k}.r,opacity:spark${k}.op`} />
      ))}
    </g>
  );
}
