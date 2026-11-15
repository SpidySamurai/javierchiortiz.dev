import type { ReactNode } from 'react';
import { BUILD_MARKS_D, FRONT, L, PLAN_GRID_D, ROLLER_X, TOP, VIEW_W } from './geometry';
import { ptsStr } from './math';
import { useGrad } from './SceneDefs';

/** Physical conveyor: legs, rails, moving treads, station plates, rollers and the luminous progress trail. */

const s = (name: string) => `var(--ds-scene-${name})`;
const LEG_X = [36, 236, 420, 822, 1100, 1240] as const;

function Plate({ x0, bind, children }: { x0: number; bind: string; children?: ReactNode }) {
  return (
    <g data-bind={`opacity:${bind}`}>
      <polygon points={ptsStr([[x0 + 8, 311], [x0 + 188, 311], [x0 + 180, 349], [x0, 349]])} fill="var(--ds-surface-high)" />
      <polygon points={ptsStr([[x0, 349], [x0 + 180, 349], [x0 + 180, 352], [x0, 352]])} fill={s('steel-mid')} />
      {children}
    </g>
  );
}

export function Belt() {
  const g = useGrad();
  return (
    <g>
      <ellipse cx={640} cy={410} rx={700} ry={18} fill="black" opacity={0.4} style={{ filter: 'blur(12px)' }} />
      {LEG_X.map((x) => (
        <g key={x}>
          <rect x={x - 6} y={400} width={30} height={6} rx={2} fill={s('steel-base')} />
          <rect x={x} y={372} width={14} height={29} fill={g('steelH')} />
          <polygon points={ptsStr([[x + 14, 372], [x + 19, 368], [x + 19, 397], [x + 14, 401]])} fill={s('steel-shade')} />
        </g>
      ))}
      <rect x={0} y={300} width={VIEW_W} height={6} fill={s('belt-edge')} />
      <rect x={0} y={300} width={VIEW_W} height={1.5} fill={s('belt-rim')} />
      <rect x={0} y={TOP} width={VIEW_W} height={48} fill={g('beltTop')} />
      <path data-bind="d:treadsD" fill="none" stroke={s('belt-tread')} strokeWidth={2} strokeLinecap="round" />

      <Plate x0={226} bind="planPlateOp">
        <path d={PLAN_GRID_D} data-bind="opacity:plateGridOp" fill="none" stroke="var(--ds-primary-container)" strokeWidth={1} />
      </Plate>
      <Plate x0={546} bind="buildPlateOp">
        <path d={BUILD_MARKS_D} fill="none" stroke="var(--ds-primary)" strokeWidth={1.6} strokeLinecap="round" />
      </Plate>
      <Plate x0={866} bind="padOp">
        <ellipse cx={L + 4} cy={330} rx={66} ry={12} fill="none" stroke="var(--ds-spark)" strokeOpacity={0.4} strokeWidth={1.5} />
        <ellipse cx={L + 4} cy={330} rx={30} ry={5.5} fill={s('steel-shade')} />
        <polygon points="874,311 1054,311 1046,349 866,349" fill="var(--ds-spark)" opacity={0} style={{ filter: 'blur(3px)' }} data-bind="opacity:padWarm" />
      </Plate>

      <rect x={0} y={FRONT} width={VIEW_W} height={20} fill={g('beltFront')} />
      <rect x={0} y={FRONT} width={VIEW_W} height={1.5} fill={s('steel-light')} />
      {ROLLER_X.map((rx) => (
        <g key={rx}>
          <circle cx={rx} cy={365} r={7} fill={s('roller')} />
          <circle cx={rx} cy={365} r={4.6} fill={s('roller-hub')} />
          <g transform={`translate(${rx} 365)`}>
            <path d="M-4 0 L4 0" stroke={s('roller-spoke')} strokeWidth={1.8} strokeLinecap="round" data-bind="transform:rollAng" />
          </g>
        </g>
      ))}
      <rect x={0} y={355} width={0} height={5} fill="var(--ds-primary-vivid)" opacity={0} style={{ filter: 'blur(4px)' }} data-bind="width:trailW,opacity:trailGlowOp" />
      <rect x={0} y={356.5} width={0} height={2} fill="var(--ds-primary)" opacity={0} data-bind="width:trailW,opacity:trailOp" />
    </g>
  );
}
