import { COUNT, L } from './geometry';

/** Pad effects: shock rings, ground glow, ground clouds, exhaust puffs along the climb and the smoke trail. */

const s = (name: string) => `var(--ds-scene-${name})`;
const RING_W = [2.2, 1.6, 1.2] as const;
const idx = (n: number) => Array.from({ length: n }, (_, k) => k);

export function LaunchFx() {
  return (
    <g>
      {RING_W.map((w, k) => (
        <ellipse key={k} cx={L} cy={338} rx={0} ry={0} fill="none" stroke="var(--ds-spark)" strokeWidth={w} opacity={0} data-bind={`rx:ring${k}.rx,ry:ring${k}.ry,opacity:ring${k}.op`} />
      ))}
      <ellipse cx={L} cy={336} rx={190} ry={36} fill="var(--ds-spark)" opacity={0} style={{ filter: 'blur(16px)' }} data-bind="opacity:ground.op" />
      {idx(COUNT.puffs).map((k) => (
        <circle
          key={k} cx={L} cy={334} r={0} opacity={0} fill={k % 3 ? s('puff-a') : s('puff-b')}
          style={{ filter: `blur(${7 + Math.floor(k / 2)}px)` }}
          data-bind={`cx:puff${k}.cx,cy:puff${k}.cy,r:puff${k}.r,opacity:puff${k}.op`}
        />
      ))}
      {idx(COUNT.exhaust).map((k) => (
        <circle
          key={k} r={0} opacity={0} fill={k % 2 ? s('puff-a') : s('puff-b')} style={{ filter: 'blur(7px)' }}
          data-bind={`cx:ex${k}.cx,cy:ex${k}.cy,r:ex${k}.r,opacity:ex${k}.op`}
        />
      ))}
      <path
        fill="none" stroke="color-mix(in srgb, var(--ds-spark) 60%, var(--ds-outline))" strokeWidth={9} strokeLinecap="round" opacity={0}
        style={{ filter: 'blur(6px)' }} data-bind="d:smoke.d,opacity:smoke.op"
      />
      <path fill="none" stroke="var(--ds-spark)" strokeWidth={2} strokeLinecap="round" opacity={0} data-bind="d:smoke.d,opacity:smoke.coreOp" />
    </g>
  );
}

/** Rings that pulse out of the module in orbit while it is live. */
export function LivePulses() {
  return (
    <>
      {idx(COUNT.pulses).map((k) => (
        <ellipse
          key={k} fill="none" stroke="var(--ds-pass)" strokeWidth={1.4} opacity={0}
          data-bind={`cx:pulse${k}.cx,cy:pulse${k}.cy,rx:pulse${k}.rx,ry:pulse${k}.ry,opacity:pulse${k}.op`}
        />
      ))}
    </>
  );
}

/** Separation ring left behind when the booster drops away. */
export function SeparationRing() {
  return <ellipse fill="none" stroke="var(--ds-spark)" strokeWidth={2} opacity={0} data-bind="cx:sep.cx,cy:sep.cy,rx:sep.rx,ry:sep.ry,opacity:sep.op" />;
}
