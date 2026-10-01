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
const PUPIL_R = 4;

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
  happy,
  scale,
  pupilX,
  pupilY,
  clipId,
}: {
  cx: number;
  scale: MotionValue<number>;
  lid: MotionValue<number>;
  happy: MotionValue<number>;
  pupilX: MotionValue<number>;
  pupilY: MotionValue<number>;
  clipId: string;
}) {
  const topY = useTransform(lid, (l) => -12.5 + 13.7 * l);
  const bottomY = useTransform(lid, (l) => 12.5 - 13.7 * l);
  const edge = useTransform([lid, happy], ([l, h]: number[]) => clamp01(l * 4) * (1 - h));
  // The highlight rides the pupil, up and to the right.
  const hlX = useTransform(pupilX, (v) => v + PUPIL_R * 0.38);
  const hlY = useTransform(pupilY, (v) => v - PUPIL_R * 0.38);
  return (
    <motion.g style={{ scale, ...pivot(cx, EYE_Y) }}>
      <g transform={`translate(${cx} ${EYE_Y})`}>
        <circle r={12} fill={MC.dark} />
        <circle r={9} fill={MC.eyeYellow} />
        <motion.circle r={PUPIL_R} fill={MC.dark} style={{ x: pupilX, y: pupilY }} />
        <motion.circle r={1.3} fill="#fff" opacity={0.9} style={{ x: hlX, y: hlY }} />
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
        {/* Happy squint: covers the eye with the face colour and draws an arch */}
        <motion.g style={{ opacity: happy }}>
          <circle r={12.8} fill={MC.white} />
          <path d="M-9 4 Q0 -8 9 4" fill="none" stroke={MC.dark} strokeWidth={3} strokeLinecap="round" />
        </motion.g>
      </g>
    </motion.g>
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
        <path
          d={`M${apexX} -15 L${apexX - 15} 25 L${apexX + 15} 25 Z`}
          fill={MC.orange}
          stroke={MC.orange}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <path d={`M${apexX} 0 L${apexX - 8} 25 L${apexX + 8} 25 Z`} fill={MC.nose} />
      </g>
    </motion.g>
  );
}

/**
 * The left front limb. It pivots at the shoulder. At rest it is invisible
 * (white on white) and only its paw bump shows, so the cat has exactly two
 * paws. While raised, the limb fades in and the bump gives way to pink pads.
 */
function Limb({ rotate, lines }: { rotate: MotionValue<number>; lines: MotionValue<number> }) {
  const limbOp = useTransform(rotate, (r) => clamp01(r / 25));
  const bumpOp = useTransform(rotate, (r) => 0.1 * (1 - clamp01(r / 40)));
  const padsOp = useTransform(rotate, (r) => clamp01((r - 40) / 60));
  return (
    <motion.g style={{ rotate, ...pivot(53, 114) }}>
      <g transform="translate(53 114)">
        <motion.rect
          x={-8}
          y={0}
          width={16}
          height={36}
          rx={8}
          fill={MC.white}
          stroke={MC.dark}
          strokeOpacity={0.14}
          strokeWidth={1}
          style={{ opacity: limbOp }}
        />
        <motion.path d="M-8 36 V34 A8 8 0 0 1 0 26 A8 8 0 0 1 8 34 V36 Z" fill="#000" style={{ opacity: bumpOp }} />
        <motion.g style={{ opacity: padsOp }} fill={MC.nose}>
          <circle cx={0} cy={29} r={3.8} />
          <circle cx={-4.5} cy={23} r={1.8} />
          <circle cx={0} cy={21} r={1.8} />
          <circle cx={4.5} cy={23} r={1.8} />
        </motion.g>
        <motion.path
          d="M-15 24 Q-21 31 -15 38 M15 24 Q21 31 15 38"
          fill="none"
          stroke={MC.sparkle}
          strokeWidth={2}
          strokeLinecap="round"
          style={{ opacity: lines }}
        />
      </g>
    </motion.g>
  );
}

const SPARKLES = [
  { x: -6, y: 0, size: 1.1, fill: MC.eyeYellow },
  { x: 106, y: 6, size: 0.8, fill: MC.sparkle },
  { x: 52, y: -26, size: 0.9, fill: MC.eyeYellow },
] as const;

/** A tiny four-point star that grows and fades with `amount`. */
function Sparkle({ amount, size, fill }: { amount: MotionValue<number>; size: number; fill: string }) {
  const scale = useTransform(amount, (a) => Math.max(0.01, a * size));
  return (
    <motion.path
      d="M0 -6.4 L1.3 -1.3 L6.4 0 L1.3 1.3 L0 6.4 L-1.3 1.3 L-6.4 0 L-1.3 -1.3 Z"
      fill={fill}
      style={{ scale, opacity: amount }}
    />
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
  const { rise, sleep, breath, perk, tailPhase, flick, twitchL, twitchR, blink, zClock, pose } = life;

  const bodyShape = 'M30 150 V90 A40 40 0 0 1 70 50 H74 C96 52 116 76 118 104 V150 Z';
  const headShape = 'M45 0 H55 A45 45 0 0 1 100 45 A45 45 0 0 1 55 90 H45 A45 45 0 0 1 0 45 A45 45 0 0 1 45 0 Z';
  const tailShape = 'M90 125 H127.5 A12.5 12.5 0 0 1 127.5 150 H90 Z';

  // Moment pose channels, one motion value each
  const mHeadRot = useTransform(pose, (p) => p.headRot);
  const mTail = useTransform(pose, (p) => p.tail);
  const mEarL = useTransform(pose, (p) => p.earL);
  const mEarR = useTransform(pose, (p) => p.earR);
  const mEarS = useTransform(pose, (p) => p.earS);
  const mHeadY = useTransform(pose, (p) => p.headY);
  const mChest = useTransform(pose, (p) => p.chest);
  const mLid = useTransform(pose, (p) => p.lid);
  const mMouth = useTransform(pose, (p) => p.mouth);
  const mPaws = useTransform(pose, (p) => p.paws);
  const eyeScale = useTransform(pose, (p) => p.eyeScale);
  const mLift = useTransform(pose, (p) => p.lift);
  const squashX = useTransform(pose, (p) => p.squashX);
  const squashY = useTransform(pose, (p) => p.squashY);
  const sparkle = useTransform(pose, (p) => p.sparkle);

  const sink = useTransform([rise, mLift], ([v, l]: number[]) => PEEK_Y * (1 - v) + l);
  const headY = useTransform([breath, sleep, mHeadY], ([b, s, m]: number[]) => -1.3 * b + 9 * s + m);
  const headTilt = useTransform([sleep, mHeadRot], ([s, r]: number[]) => 4 * s + r);
  const chest = useTransform([breath, mChest], ([b, m]: number[]) => (1 + 0.018 * b) * m);
  const tailRotate = useTransform(
    [tailPhase, rise, sleep, flick, mTail],
    ([ph, r, s, f, m]: number[]) => ph * (2.5 + 7.5 * r) * (1 - s) - 22 * f + m,
  );
  const earL = useTransform([twitchL, perk, sleep, mEarL], ([w, k, s, m]: number[]) => -w + 6 * k - 5 * s + m);
  const earR = useTransform([twitchR, perk, sleep, mEarR], ([w, k, s, m]: number[]) => w - 6 * k + 5 * s + m);
  const earScale = useTransform([perk, mEarS], ([k, m]: number[]) => (1 + 0.08 * k) * m);
  const happy = useTransform(pose, (p) => p.happy);
  const pawRot = useTransform(pose, (p) => p.pawRot);
  const waveLines = useTransform(pose, (p) => p.waveLines);
  const lid = useTransform([blink, sleep, mLid], ([b, s, m]: number[]) => Math.max(b, clamp01(s / 0.7), m));
  // Yawn: the small mouth gives way to an open one
  const smallMouth = useTransform(mMouth, (m) => (m > 0.03 ? 0 : 1));
  const yawnOp = useTransform(mMouth, (m) => (m > 0.03 ? 1 : 0));
  const yawnScale = useTransform(mMouth, (m) => Math.max(0.01, m));
  const yawnY = useTransform(mMouth, (m) => 76 + 2 * m);
  const tongueY = useTransform(mMouth, (m) => 80 + 4 * m);
  // Stretching paws slide outward along the floor
  const pawsOp = useTransform(mPaws, (p) => clamp01(p * 3));
  const pawsScale = useTransform(mPaws, (p) => 0.8 + 0.4 * p);
  const pawLX = useTransform(mPaws, (p) => -8 * p);
  const pawRX = useTransform(mPaws, (p) => 8 * p);

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

        <motion.g style={{ y: sink, scaleX: squashX, scaleY: squashY, ...pivot(75, 150) }}>
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
            <path d="M75 150 V148 A8 8 0 0 1 83 140 A8 8 0 0 1 91 148 V150 Z" fill="#000" opacity={0.1} />
          </motion.g>
          {/* Front paws pushed out while stretching */}
          <motion.g style={{ opacity: pawsOp }}>
            {[{ cx: 53, x: pawLX }, { cx: 83, x: pawRX }].map((paw) => (
              <motion.ellipse
                key={paw.cx}
                cx={paw.cx}
                cy={146}
                rx={10}
                ry={6}
                fill={MC.white}
                stroke={MC.dark}
                strokeOpacity={0.18}
                strokeWidth={1}
                style={{ x: paw.x, scale: pawsScale }}
              />
            ))}
          </motion.g>

          {/* Head */}
          <motion.g style={{ y: headY, rotate: headTilt, ...pivot(50, 90) }}>
            <path d={headShape} fill={MC.white} />
            <path d="M0 0 H66.5 L0 66.5 Z" fill={MC.orange} clipPath={`url(#${uid}-head)`} />
            <Ear side="left" rotate={earL} scaleY={earScale} />
            <Ear side="right" rotate={earR} scaleY={earScale} />

            {EYES.map((cx) => (
              <Eye key={cx} cx={cx} lid={lid} happy={happy} scale={eyeScale} pupilX={life.pupilX} pupilY={life.pupilY} clipId={`${uid}-eye`} />
            ))}

            {/* Blush */}
            <ellipse cx={14} cy={70} rx={6} ry={3} fill={MC.nose} opacity={0.22} />
            <ellipse cx={86} cy={70} rx={6} ry={3} fill={MC.nose} opacity={0.22} />

            {/* Nose and mouth */}
            <path d="M45 60 H55 L50 68 Z" fill={MC.nose} />
            <motion.g style={{ opacity: smallMouth }}>
              <rect x={47} y={66} width={2} height={6} fill={MC.nose} transform="rotate(30 48 69)" />
              <rect x={51} y={66} width={2} height={6} fill={MC.nose} transform="rotate(-30 52 69)" />
            </motion.g>
            <motion.g style={{ opacity: yawnOp }}>
              <motion.ellipse cx={50} cy={0} rx={7} ry={10} fill={MC.mouth} style={{ y: yawnY, scale: yawnScale }} />
              <motion.ellipse cx={50} cy={0} rx={4} ry={4} fill={MC.nose} style={{ y: tongueY, scale: yawnScale }} />
            </motion.g>

            {/* Whiskers */}
            <rect x={-15} y={57} width={35} height={1.5} rx={0.75} fill={WHISKER} transform="rotate(-8 2.5 57.75)" />
            <rect x={80} y={57} width={35} height={1.5} rx={0.75} fill={WHISKER} transform="rotate(8 97.5 57.75)" />
          </motion.g>

          {/* Left front limb, over the head while it waves */}
          <Limb rotate={pawRot} lines={waveLines} />

          {/* Sparkles after a cheer */}
          {SPARKLES.map((sp) => (
            <g key={sp.x} transform={`translate(${sp.x} ${sp.y})`}>
              <Sparkle amount={sparkle} size={sp.size} fill={sp.fill} />
            </g>
          ))}

          {/* Sleep glyphs */}
          {[0, 1, 2].map((i) => (
            <Zed key={i} clock={zClock} sleep={sleep} index={i} />
          ))}
        </motion.g>
      </svg>
    </button>
  );
}
