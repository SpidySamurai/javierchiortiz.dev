import { dPath, ptsStr } from './math';
import { B, L, P, PIV, VIEW_W } from './geometry';
import { useGrad } from './SceneDefs';

/** Wall, floor and the three station lamps that light up as the product arrives. */

const s = (name: string) => `var(--ds-scene-${name})`;
const STRIPES = Array.from({ length: Math.ceil((VIEW_W - 80) / 160) }, (_, i) => 80 + i * 160);
const FLOOR_LINES = dPath([
  ...Array.from({ length: 21 }, (_, i) => -560 + i * 120).map((fx): [number, number][] => [[640 + (fx - 640) * 0.62, 378], [fx, 440]]),
  [[0, 404], [1280, 404]],
  [[0, 424], [1280, 424]],
]);

function Cone({ i, cx, warm }: { i: number; cx: number; warm?: boolean }) {
  const g = useGrad();
  return (
    <g>
      <polygon points={ptsStr([[cx - 16, 10], [cx + 16, 10], [cx + 128, 344], [cx - 128, 344]])} fill={g(warm ? 'coneW' : 'coneV')} data-bind={`opacity:cone${i}.c`} />
      <ellipse cx={cx} cy={338} rx={170} ry={30} fill={g(warm ? 'poolW' : 'poolV')} data-bind={`opacity:cone${i}.p`} />
      <rect x={cx - 26} y={0} width={52} height={9} rx={3} fill="var(--ds-surface-high)" />
      <rect x={cx - 17} y={8} width={34} height={3} rx={1.5} fill={warm ? 'var(--ds-spark)' : 'var(--ds-primary)'} data-bind={`opacity:cone${i}.lens`} />
    </g>
  );
}

export function Backdrop() {
  const g = useGrad();
  return (
    <>
      <rect x={0} y={0} width={VIEW_W} height={300} fill={g('wall')} />
      <rect x={0} y={296} width={VIEW_W} height={144} fill={g('floor')} />
      {STRIPES.map((x) => (
        <rect key={x} x={x} y={0} width={80} height={300} fill="var(--ds-on-surface)" opacity={0.012} />
      ))}
      <path d={FLOOR_LINES} stroke={s('floor-line')} strokeWidth={1} fill="none" />
      <Cone i={0} cx={P} />
      <Cone i={1} cx={B} />
      <Cone i={2} cx={L} warm />
    </>
  );
}

/** Drafting pedestal behind the belt: base, column, glass panel and the progress ring around it. */
export function Pedestal() {
  const g = useGrad();
  const [cx, cy] = [PIV[0], 263];
  return (
    <g>
      <polygon points="80,288 140,288 150,280 90,280" fill="var(--ds-surface-highest)" />
      <rect x={80} y={288} width={60} height={18} fill="var(--ds-surface-high)" />
      <polygon points="140,288 150,280 150,306 140,306" fill="var(--ds-surface-container)" />
      <rect x={98} y={236} width={24} height={52} fill={g('steelH')} />
      <polygon points="122,236 129,230 129,282 122,288" fill={s('steel-shade')} />
      <rect x={100} y={248} width={20} height={30} rx={3} fill={s('glass')} />
      <circle cx={cx} cy={cy} r={6} fill="none" stroke={s('screen-off')} strokeWidth={2.4} />
      <circle
        cx={cx} cy={cy} r={6} fill="none" stroke={s('screen-accent')} strokeWidth={2.4} strokeDasharray="37.7 37.7" strokeDashoffset={37.7}
        transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="round" data-bind="stroke-dashoffset:ped.off,opacity:ped.ringOp"
      />
      <circle cx={cx} cy={cy} r={2} fill={s('screen-pass')} opacity={0} data-bind="opacity:ped.dotOp" />
    </g>
  );
}
