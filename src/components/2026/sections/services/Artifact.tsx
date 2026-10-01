'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import { DrawPath } from '@/components/2026/ui/motion/DrawPath';
import { Node } from '@/components/2026/ui/motion/Node';
import { useSeg } from './timeline';

export const CARD_W = 160;
export const CARD_H = 110;

const INK = 'var(--ds-primary)';
const VIVID = 'var(--ds-primary-vivid)';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

// Idea: three wavy strokes. Same command structure as the rules below so `d` can interpolate.
const WAVY = [
  'M24 36 C 38 30, 52 42, 66 36 S 98 30, 122 36',
  'M24 54 C 36 49, 50 59, 64 54 S 86 50, 104 54',
  'M24 72 C 34 68, 46 76, 58 72 S 78 68, 92 72',
] as const;
// Build: the strokes straighten into the header rule and the first two code lines.
const RULES = [
  'M10 22 C 40 22, 70 22, 90 22 S 120 22, 150 22',
  'M10 76 C 40 76, 70 76, 90 76 S 100 76, 110 76',
  'M10 85 C 25 85, 40 85, 55 85 S 70 85, 80 85',
] as const;

const SPARK = 'M134 22 L136 28 L142 30 L136 32 L134 38 L132 32 L126 30 L132 28 Z';
const CODE_TYPED = ['M10 94 H128', 'M10 103 H62'] as const;
const DOTS = [16, 25, 34] as const;
const DOT_FILL = ['var(--ds-error)', 'var(--ds-primary)', 'var(--ds-success)'] as const;

const LOG = [
  { text: 'prompt', y: 81, hot: false },
  { text: 'eval 0.94', y: 92, hot: true },
  { text: 'deploy', y: 103, hot: false },
] as const;

function roundRect(x: number, y: number, w: number, h: number, r: number) {
  return `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;
}
const dotRing = (cx: number) => `M${cx - 2.4} 11 a2.4 2.4 0 1 0 4.8 0 a2.4 2.4 0 1 0 -4.8 0`;
const check = (y: number) => `M138 ${y - 3.4} l2.6 2.8 l4.8 -5.4`;

interface ArtifactProps {
  /** Cycle progress 0..1. Rest values from timeline.REST give each finished stage. */
  progress: MotionValue<number>;
}

/** The thing the factory makes: note, then wireframe and code, then a shipped app with its log. */
export function Artifact({ progress }: ArtifactProps) {
  const morph1 = useSeg(progress, 2.35, 3.15);
  const morph2 = useSeg(progress, 5.0, 5.8);

  const dWavy1 = useTransform<number, string>(morph1, [0, 1], [WAVY[0], RULES[0]]);
  const dWavy2 = useTransform<number, string>(morph1, [0, 1], [WAVY[1], RULES[1]]);
  const dWavy3 = useTransform<number, string>(morph1, [0, 1], [WAVY[2], RULES[2]]);

  const draw1 = useSeg(progress, 1.0, 1.8);
  const draw2 = useSeg(progress, 1.2, 2.0);
  const draw3 = useSeg(progress, 1.4, 2.2);
  const drawSpark = useSeg(progress, 1.7, 2.2);

  const ideaTint = useTransform(morph1, (v) => 1 - v);
  const sparkFade = useSeg(progress, 2.3, 2.7);
  const sparkOpacity = useTransform(sparkFade, (v) => 1 - v);

  const boxA = useSeg(progress, 3.3, 4.0);
  const boxB = useSeg(progress, 3.45, 4.1);
  const dotDraw = useSeg(progress, 3.4, 3.9);
  const typed1 = useSeg(progress, 3.9, 4.5);
  const typed2 = useSeg(progress, 4.1, 4.7);

  const codeFade = useSeg(progress, 5.0, 5.5);
  const codeOpacity = useTransform(codeFade, (v) => 1 - v);
  const fill = useSeg(progress, 5.3, 5.9);
  const fillStrong = useTransform(fill, (v) => v * 0.92);
  const fillSoft = useTransform(fill, (v) => v * 0.7);
  const panel = useSeg(progress, 5.6, 6.0);
  const liveGlow = useSeg(progress, 6.6, 7.1);

  const logIn = [
    useSeg(progress, 5.95, 6.3),
    useSeg(progress, 6.35, 6.7),
    useSeg(progress, 6.75, 7.1),
  ];
  const logCheck = [
    useSeg(progress, 6.1, 6.4),
    useSeg(progress, 6.5, 6.8),
    useSeg(progress, 6.9, 7.2),
  ];
  const logSlide = [
    useTransform(logIn[0], (v) => (1 - v) * -6),
    useTransform(logIn[1], (v) => (1 - v) * -6),
    useTransform(logIn[2], (v) => (1 - v) * -6),
  ];

  const ringIdea = ideaTint;
  const ringBuild = useTransform(morph2, (v) => 1 - v);
  const ringBuildOpacity = useTransform([morph1, ringBuild], ([a, b]: number[]) => a * b);
  const glow = useSeg(progress, 5.6, 6.2);

  return (
    <div
      aria-hidden
      style={{
        position: 'relative',
        width: CARD_W,
        height: CARD_H,
        borderRadius: 10,
        boxShadow: '0 8px 20px color-mix(in srgb, var(--ds-bg) 75%, transparent)',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 10,
          opacity: glow,
          boxShadow: '0 0 22px color-mix(in srgb, var(--ds-primary-vivid) 45%, transparent)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 10,
          overflow: 'hidden',
          backgroundColor: 'var(--ds-surface-container)',
        }}
      >
        <svg width={CARD_W} height={CARD_H} viewBox={`0 0 ${CARD_W} ${CARD_H}`} style={{ display: 'block' }}>
          {/* Card tint and outline per stage */}
          <motion.rect
            width={CARD_W}
            height={CARD_H}
            style={{ fill: 'color-mix(in srgb, var(--ds-secondary-container) 38%, transparent)', opacity: ideaTint }}
          />
          <motion.rect
            x={0.5}
            y={0.5}
            width={CARD_W - 1}
            height={CARD_H - 1}
            rx={9.5}
            fill="none"
            strokeDasharray="3 4"
            style={{ stroke: 'color-mix(in srgb, var(--ds-on-secondary) 55%, transparent)', opacity: ringIdea }}
          />
          <motion.rect
            x={0.5}
            y={0.5}
            width={CARD_W - 1}
            height={CARD_H - 1}
            rx={9.5}
            fill="none"
            style={{ stroke: 'color-mix(in srgb, var(--ds-primary-vivid) 45%, transparent)', opacity: ringBuildOpacity }}
          />
          <motion.rect
            x={0.5}
            y={0.5}
            width={CARD_W - 1}
            height={CARD_H - 1}
            rx={9.5}
            fill="none"
            strokeWidth={1.5}
            style={{ stroke: 'color-mix(in srgb, var(--ds-primary-vivid) 85%, transparent)', opacity: morph2 }}
          />

          {/* Idea: the spark, only while it is a note */}
          <motion.g style={{ opacity: sparkOpacity }}>
            <DrawPath d={SPARK} progress={drawSpark} stroke="var(--ds-on-secondary)" />
          </motion.g>

          {/* Header rule: wavy stroke, then window bar */}
          <DrawPath d={dWavy1} progress={draw1} stroke={INK} />

          {/* Wireframe */}
          <DrawPath d={roundRect(10, 32, 52, 32, 4)} progress={boxA} stroke={VIVID} />
          <DrawPath d={roundRect(70, 32, 80, 32, 4)} progress={boxB} stroke={VIVID} />
          {DOTS.map((cx) => (
            <DrawPath key={cx} d={dotRing(cx)} progress={dotDraw} stroke={VIVID} />
          ))}

          {/* Launch: the wireframe fills in */}
          <motion.rect x={10} y={32} width={52} height={32} rx={4} style={{ fill: VIVID, opacity: fillStrong }} />
          <motion.g style={{ opacity: fillSoft }}>
            <rect x={70} y={32} width={80} height={32} rx={4} style={{ fill: 'var(--ds-surface-high)' }} />
            <rect x={77} y={41} width={50} height={3} rx={1.5} style={{ fill: 'color-mix(in srgb, var(--ds-on-surface) 40%, transparent)' }} />
            <rect x={77} y={49} width={34} height={3} rx={1.5} style={{ fill: 'color-mix(in srgb, var(--ds-on-surface) 25%, transparent)' }} />
          </motion.g>
          {DOTS.map((cx, i) => (
            <motion.circle key={cx} cx={cx} cy={11} r={2.4} style={{ fill: DOT_FILL[i], opacity: fill }} />
          ))}
          <motion.g style={{ opacity: fill }}>
            <Node cx={142} cy={11} r={2.2} glow={liveGlow} color="var(--ds-success)" />
          </motion.g>

          {/* Code: first two lines are the morphed strokes, two more type in */}
          <motion.g style={{ opacity: codeOpacity }}>
            <DrawPath d={dWavy2} progress={draw2} stroke={INK} />
            <DrawPath d={dWavy3} progress={draw3} stroke={INK} />
            <DrawPath d={CODE_TYPED[0]} progress={typed1} stroke={INK} />
            <DrawPath d={CODE_TYPED[1]} progress={typed2} stroke={INK} />
          </motion.g>

          {/* Launch log */}
          <motion.rect
            x={6}
            y={70}
            width={148}
            height={36}
            rx={5}
            style={{ fill: 'color-mix(in srgb, var(--ds-bg) 70%, transparent)', opacity: panel }}
          />
          {LOG.map((line, i) => (
            <g key={line.text}>
              <motion.text
                x={13}
                y={line.y}
                fontSize={8.5}
                style={{
                  fontFamily: MONO,
                  fill: line.hot ? 'var(--ds-primary)' : 'var(--ds-on-surface-variant)',
                  opacity: logIn[i],
                  x: logSlide[i],
                }}
              >
                {line.text}
              </motion.text>
              <DrawPath d={check(line.y)} progress={logCheck[i]} stroke="var(--ds-success)" />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
