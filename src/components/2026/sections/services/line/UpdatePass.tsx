import Cube from './Cube';
import { SWARM } from './cubes';
import { COUNT } from './geometry';
import { TRAY_SLOTS_D, U_D1, U_D2, U_LEN1, U_LEN2, U_PASS_D } from './updatePass';
import { useGrad } from './SceneDefs';

/**
 * The update pass on the line: a tray that rides the belt with four outline ghosts, the
 * four modules (in scene space until they reach the orbit), their mini plumes, the outlines
 * both arms trace at the plan station and the pass outline after the scan.
 */

const s = (name: string) => `var(--ds-scene-${name})`;
const idx = Array.from({ length: COUNT.swarm }, (_, i) => i);

function Tray() {
  return (
    <g opacity={0} data-bind="transform:tray.tf,opacity:tray.op">
      <ellipse cx={2} cy={351} rx={84} ry={7} fill="black" opacity={0.45} style={{ filter: 'blur(4px)' }} />
      <polygon points="-70,321 80,321 74,346 -76,346" fill="var(--ds-surface-highest)" />
      <polygon points="-76,346 74,346 74,350 -76,350" fill={s('steel-mid')} />
      <polygon points="74,346 80,321 80,325 74,350" fill={s('steel-shade')} />
      <rect x={-70} y={321} width={150} height={1.4} fill={s('steel-light')} />
      <path d={TRAY_SLOTS_D} fill="none" stroke="var(--ds-primary)" strokeOpacity={0.4} strokeWidth={1} />
    </g>
  );
}

function MiniPlume({ i }: { i: number }) {
  const g = useGrad();
  const k = `uPl${i}`;
  return (
    <>
      <polygon fill={g('plume')} opacity={0} style={{ filter: 'blur(4px)' }} data-bind={`points:${k}.halo,opacity:${k}.haloOp`} />
      <polygon fill={g('plume')} opacity={0} style={{ filter: 'blur(1.2px)' }} data-bind={`points:${k}.outer,opacity:${k}.outerOp`} />
      <polygon fill={s('hot')} opacity={0} data-bind={`points:${k}.core,opacity:${k}.coreOp`} />
    </>
  );
}

/** Tray, plumes, outline ghosts and the modules in scene space. Drawn over the piece, under the gantry beam. */
export function UpdateWorld() {
  return (
    <g>
      <Tray />
      {idx.map((i) => <MiniPlume key={i} i={i} />)}
      {idx.map((i) => (
        <g key={i} opacity={0} data-bind={`transform:sw${i}.ghTf,opacity:sw${i}.ghOp`}>
          {(['top', 'right', 'left'] as const).map((face) => (
            <polygon
              key={face} points={SWARM[i].faces[face]} fill="var(--ds-primary-container)" fillOpacity={0.08} stroke="var(--ds-primary)"
              strokeOpacity={0.75} strokeWidth={1.4} strokeLinejoin="round" vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      ))}
      {idx.map((i) => (
        <Cube key={i} faces={SWARM[i].faces} kind={SWARM[i].kind} bind={{ tf: `sw${i}.wtf`, op: `sw${i}.opW`, lit: `sw${i}.lit` }} />
      ))}
    </g>
  );
}

/** Outlines of the four modules, traced at the plan station by arm 1 (modules 0-1) and arm 2 (modules 2-3). */
export function UpdateOutlines() {
  const strokes = [{ d: U_D1, len: U_LEN1 }, { d: U_D2, len: U_LEN2 }];
  return (
    <g opacity={0} data-bind="opacity:ubp.op">
      {strokes.map((st, i) => (
        <g key={i}>
          <path d={st.d} fill="none" stroke="var(--ds-primary)" strokeWidth={1.3 * 4} opacity={0} style={{ filter: 'blur(3px)' }} data-bind={`opacity:ubp.h${i}`} />
          <path d={st.d} fill="none" stroke="var(--ds-primary)" strokeWidth={1.3} strokeDasharray={`${st.len} ${st.len}`} strokeDashoffset={st.len} data-bind={`stroke-dashoffset:ubp.${i + 1}Off`} />
        </g>
      ))}
    </g>
  );
}

/** Pass outline after the scan; rides with the tray. */
export function UpdatePassMark() {
  return <path d={U_PASS_D} fill="none" stroke="var(--ds-pass)" strokeWidth={2.4} strokeLinejoin="round" opacity={0} data-bind="transform:uPass.tf,opacity:uPass.op" />;
}
