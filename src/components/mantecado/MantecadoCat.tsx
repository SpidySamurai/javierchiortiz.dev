'use client';

import { useId } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useMantecadoLife } from '@/hooks/useMantecadoLife';
import { CAT_SCALE, CAT_VIEWBOX, PEEK_Y } from '@/lib/catLife';
import { MC } from './palette';

/**
 * Mantecado as a living SVG. Same flat silhouette as the CSS cat in FlatCat:
 * a 100x90 head, a 90x100 body, a pill tail, two eyes, a nose. Every part that
 * moves reads a motion value from useMantecadoLife.
 */

const WHISKER = 'rgba(51, 41, 43, 0.35)';
const EYES = [27, 73] as const;
const EYE_Y = 55;

/** Rotate or scale around a point in drawing units, not around the element's own box. */
const pivot = (x: number, y: number) => ({
  transformBox: 'view-box' as const,
  originX: `${x}px`,
  originY: `${y}px`,
});

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

function Eye({
  cx,
  lid,
  pupilX,
  pupilY,
  clipId,
}: {
  cx: number;
  lid: MotionValue<number>;
  pupilX: MotionValue<number>;
  pupilY: MotionValue<number>;
  clipId: string;
}) {
  const topY = useTransform(lid, (l) => -12.5 + 13.7 * l);
  const bottomY = useTransform(lid, (l) => 12.5 - 13.7 * l);
  const edge = useTransform(lid, (l) => clamp01(l * 4));
  return (
    <g transform={`translate(${cx} ${EYE_Y})`}>
      <circle r={12} fill={MC.dark} />
      <circle r={9} fill={MC.eyeYellow} />
      <motion.circle r={4} fill={MC.dark} style={{ x: pupilX, y: pupilY }} />
      <g clipPath={`url(#${clipId})`}>
        <motion.rect x={-13} y={0} width={26} height={26} fill={MC.white} style={{ y: bottomY }} />
        <motion.g style={{ y: topY }}>
          <rect x={-13} y={-26} width={26} height={26} fill={MC.white} />
          <motion.path
            d="M-10.5 0 Q0 4 10.5 0"
            fill="none"
            stroke={MC.dark}
            strokeWidth={2.6}
            strokeLinecap="round"
            style={{ opacity: edge }}
          />
        </motion.g>
      </g>
    </g>
  );
}

function Ear({
  side,
  rotate,
  scaleY,
}: {
  side: 'left' | 'right';
  rotate: MotionValue<number>;
  scaleY: MotionValue<number>;
}) {
  const left = side === 'left';
  // Static resting pose (the old CSS rotated each ear 15 degrees outward), then the live motion on top.
  const apexX = left ? 20 : 80;
  const baseX = left ? 25.2 : 74.8;
  const resting = left ? -15 : 15;
  return (
    <motion.g style={{ rotate, scaleY, ...pivot(baseX, 24.3) }}>
      <g transform={`rotate(${resting} ${apexX} 5)`}>
        <path d={`M${apexX} -15 L${apexX - 15} 25 L${apexX + 15} 25 Z`} fill={MC.orange} />
        <path d={`M${apexX} 0 L${apexX - 8} 25 L${apexX + 8} 25 Z`} fill={MC.nose} />
      </g>
    </motion.g>
  );
}

/** A small z that drifts up and fades. Decorative. */
function Zed({ clock, sleep, index }: { clock: MotionValue<number>; sleep: MotionValue<number>; index: number }) {
  const phase = (v: number) => (v + index / 3) % 1;
  const x = useTransform(clock, (v) => 100 + phase(v) * 24 + Math.sin(phase(v) * 6.283) * 3);
  const y = useTransform(clock, (v) => -6 - phase(v) * 42);
  const scale = useTransform(clock, (v) => 0.8 + 0.9 * phase(v));
  const opacity = useTransform([clock, sleep], ([v, s]: number[]) => Math.pow(Math.sin(Math.PI * phase(v)), 1.2) * s);
  return (
    <motion.g style={{ x, y, scale, opacity }}>
      <path d="M-4 -4.5 H4 L-4 4.5 H4" fill="none" stroke={MC.orangeLight} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </motion.g>
  );
}

export default function MantecadoCat({ onOpen }: { onOpen: () => void }) {
  const t = useTranslations('common.mantecado');
  const uid = useId().replace(/:/g, '');
  const life = useMantecadoLife();
  const { rise, sleep, breath, perk, tailPhase, flick, twitchL, twitchR, blink, zClock } = life;

  const bodyShape = 'M30 150 V90 A40 40 0 0 1 70 50 H80 A40 40 0 0 1 120 90 V150 Z';
  const headShape = 'M45 0 H55 A45 45 0 0 1 100 45 A45 45 0 0 1 55 90 H45 A45 45 0 0 1 0 45 A45 45 0 0 1 45 0 Z';
  const tailShape = 'M90 125 H127.5 A12.5 12.5 0 0 1 127.5 150 H90 Z';

  const sink = useTransform(rise, (v) => PEEK_Y * (1 - v));
  const headY = useTransform([breath, sleep], ([b, s]: number[]) => -1.3 * b + 9 * s);
  const headTilt = useTransform(sleep, (s) => 4 * s);
  const chest = useTransform(breath, (b) => 1 + 0.018 * b);
  const tailRotate = useTransform([tailPhase, rise, sleep, flick], ([ph, r, s, f]: number[]) => ph * (2.5 + 7.5 * r) * (1 - s) - 22 * f);
  const earL = useTransform([twitchL, perk, sleep], ([w, p, s]: number[]) => -w + 6 * p - 5 * s);
  const earR = useTransform([twitchR, perk, sleep], ([w, p, s]: number[]) => w - 6 * p + 5 * s);
  const earScale = useTransform(perk, (p) => 1 + 0.08 * p);
  const lid = useTransform([blink, sleep], ([b, s]: number[]) => Math.max(b, clamp01(s / 0.7)));

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={t('open_chat')}
      {...life.bind}
      className="absolute cursor-pointer rounded-[22px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ds-primary)]"
      style={{
        right: '-0.75rem',
        bottom: '-0.75rem',
        width: CAT_VIEWBOX.w * CAT_SCALE,
        height: (CAT_VIEWBOX.h) * CAT_SCALE,
        pointerEvents: 'auto',
        padding: 0,
        border: 0,
        background: 'transparent',
        WebkitTapHighlightColor: 'transparent',
        // Cut only at the viewport edge so the cat can sink below it, never above or beside.
        clipPath: 'inset(-80px -40px 0 -40px)',
      }}
    >
      <svg
        ref={life.svgRef}
        aria-hidden
        focusable="false"
        viewBox={`${CAT_VIEWBOX.x} ${CAT_VIEWBOX.y} ${CAT_VIEWBOX.w} ${CAT_VIEWBOX.h}`}
        width={CAT_VIEWBOX.w * CAT_SCALE}
        height={CAT_VIEWBOX.h * CAT_SCALE}
        style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
      >
        <defs>
          <clipPath id={`${uid}-body`}><path d={bodyShape} /></clipPath>
          <clipPath id={`${uid}-head`}><path d={headShape} /></clipPath>
          <clipPath id={`${uid}-tail`}><path d={tailShape} /></clipPath>
          <clipPath id={`${uid}-eye`}><circle r={12.7} /></clipPath>
        </defs>

        <motion.g style={{ y: sink }}>
          {/* Tail, behind the body */}
          <motion.g style={{ rotate: tailRotate, ...pivot(100, 137.5) }}>
            <path d={tailShape} fill={MC.orange} />
            <g clipPath={`url(#${uid}-tail)`} fill="#000" opacity={0.05}>
              <rect x={98} y={125} width={8} height={25} />
              <rect x={114} y={125} width={8} height={25} />
              <rect x={130} y={125} width={8} height={25} />
            </g>
          </motion.g>

          {/* Body */}
          <motion.g style={{ scaleY: chest, ...pivot(75, 150) }}>
            <path d={bodyShape} fill={MC.white} />
            <circle cx={30} cy={100} r={41.2} fill={MC.orange} clipPath={`url(#${uid}-body)`} />
            <path d="M45 150 V148 A8 8 0 0 1 53 140 A8 8 0 0 1 61 148 V150 Z" fill="#000" opacity={0.1} />
            <path d="M75 150 V148 A8 8 0 0 1 83 140 A8 8 0 0 1 91 148 V150 Z" fill="#000" opacity={0.1} />
          </motion.g>

          {/* Head */}
          <motion.g style={{ y: headY, rotate: headTilt, ...pivot(50, 90) }}>
            <path d={headShape} fill={MC.white} />
            <path d="M0 0 H66.5 L0 66.5 Z" fill={MC.orange} clipPath={`url(#${uid}-head)`} />
            <Ear side="left" rotate={earL} scaleY={earScale} />
            <Ear side="right" rotate={earR} scaleY={earScale} />

            {EYES.map((cx) => (
              <Eye key={cx} cx={cx} lid={lid} pupilX={life.pupilX} pupilY={life.pupilY} clipId={`${uid}-eye`} />
            ))}

            {/* Nose and mouth */}
            <path d="M45 60 H55 L50 68 Z" fill={MC.nose} />
            <rect x={47} y={66} width={2} height={6} fill={MC.nose} transform="rotate(30 48 69)" />
            <rect x={51} y={66} width={2} height={6} fill={MC.nose} transform="rotate(-30 52 69)" />

            {/* Whiskers */}
            <rect x={-15} y={57} width={35} height={1.5} rx={0.75} fill={WHISKER} transform="rotate(-8 2.5 57.75)" />
            <rect x={80} y={57} width={35} height={1.5} rx={0.75} fill={WHISKER} transform="rotate(8 97.5 57.75)" />
          </motion.g>

          {/* Sleep glyphs */}
          {[0, 1, 2].map((i) => (
            <Zed key={i} clock={zClock} sleep={sleep} index={i} />
          ))}
        </motion.g>
      </svg>
    </button>
  );
}
