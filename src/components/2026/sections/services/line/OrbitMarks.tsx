import type { Labels } from './bind';
import { HB_LEN, L } from './geometry';

/** Orbit ring and satellite (split in a back half behind the product and a front half), heartbeat, LIVE badge and DEPLOYED mark. */

/** Back half of the ring and the satellite while it passes behind the product. */
export function OrbitBack() {
  return (
    <>
      <path fill="none" stroke="var(--ds-primary-container)" strokeWidth={1.3} strokeDasharray="4 7" opacity={0} data-bind="d:orbit.backD,opacity:orbit.backOp" />
      <circle r={3} fill="var(--ds-primary)" opacity={0} data-bind="cx:sat.cx,cy:sat.cy,opacity:sat.backOp" />
    </>
  );
}

export function OrbitFront({ copy }: { copy: Labels }) {
  return (
    <>
      <path fill="none" stroke="var(--ds-primary)" strokeWidth={1.6} opacity={0} data-bind="d:orbit.frontD,opacity:orbit.frontOp" />
      <circle r={3.5} fill="var(--ds-on-surface)" opacity={0} data-bind="cx:sat.cx,cy:sat.cy,opacity:sat.frontOp" />
      <path fill="none" stroke="var(--ds-outline-variant)" strokeWidth={1.6} strokeLinejoin="round" opacity={0} data-bind="d:hb.d,opacity:hb.op" />
      <path
        fill="none" stroke="var(--ds-pass)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" opacity={0}
        strokeDasharray={`${HB_LEN * 0.35} ${HB_LEN}`} data-bind="d:hb.d,opacity:hb.op,stroke-dashoffset:hb.off"
      />
      <g opacity={0} data-bind="transform:badge.tf,opacity:badge.op">
        <rect x={-62} y={2} width={124} height={30} rx={15} fill="black" opacity={0.35} style={{ filter: 'blur(5px)' }} />
        <rect x={-62} y={0} width={124} height={30} rx={15} fill="var(--ds-surface-high)" />
        <rect x={-62} y={0} width={124} height={3} rx={1.5} fill="white" opacity={0.07} />
        <circle cx={-44} cy={15} r={4.5} fill="var(--ds-spark)" data-bind="opacity:badge.dot" />
        <text x={-33} y={15.5} dominantBaseline="central" fontSize={13} fontWeight={800} letterSpacing="0.12em" fill="var(--ds-on-surface)" style={{ fontFamily: 'var(--font-manrope), sans-serif' }}>
          LIVE
        </text>
        <text x={14} y={15.5} dominantBaseline="central" fontSize={13} fontWeight={600} fill="var(--ds-on-surface-variant)" style={{ fontFamily: 'var(--font-inter), sans-serif' }} data-bind="text:badge.ver" />
      </g>
      <g opacity={0} data-bind="opacity:deploy.op">
        <circle cx={L} cy={300} r={22} fill="var(--ds-pass)" opacity={0.3} style={{ filter: 'blur(6px)' }} />
        <circle cx={L} cy={300} r={14} fill="var(--ds-pass)" />
        <path d={`M${L - 7} 300 L${L - 2} 305 L${L + 7.5} 294.5`} fill="none" stroke="var(--ds-bg)" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
        <text x={L} y={266} textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700} letterSpacing="0.14em" fill="var(--ds-pass)" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
          {copy.deployed}
        </text>
      </g>
    </>
  );
}
