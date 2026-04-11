'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { prepareWithSegments, measureNaturalWidth } from '@chenglou/pretext';
import { TOP_SONGS } from '@/data/twentyOnePilotsSongs';

const FONT_SIZE = 12;
const FONT = `600 ${FONT_SIZE}px Inter`;
const LINE_H = 22;
const ROW_COUNT = 9;
const SYMBOL_RADIUS = 88;
const SYMBOL_HPAD = 24;
const SYMBOL_VPAD = 4;
const MOUSE_RADIUS = 80;
const SPEEDS = [0.45, 0.62, 0.38, 0.55, 0.48, 0.60, 0.40, 0.52, 0.44];
const BASE_OPACITIES = [0.14, 0.10, 0.18, 0.12, 0.16, 0.10, 0.20, 0.12, 0.15];

// No |-/ in the text — only the central symbol
const UNIT_TEXT = TOP_SONGS.join('  ·  ') + '  ·  ';
const TEXT_TRACK = UNIT_TEXT.repeat(6);

interface Interval { left: number; right: number }

function circleIntervalForBand(
  cx: number, cy: number, r: number,
  bandTop: number, bandBottom: number,
  hPad: number, vPad: number
): Interval | null {
  const top = bandTop - vPad;
  const bottom = bandBottom + vPad;
  if (top >= cy + r || bottom <= cy - r) return null;
  const minDy = cy >= top && cy <= bottom ? 0 : cy < top ? top - cy : cy - bottom;
  if (minDy >= r) return null;
  const maxDx = Math.sqrt(r * r - minDy * minDy);
  return { left: cx - maxDx - hPad, right: cx + maxDx + hPad };
}

interface RowEl {
  leftClip: HTMLDivElement;
  leftText: HTMLSpanElement;
  rightClip: HTMLDivElement;
  rightText: HTMLSpanElement;
}

export default function SongHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const symbolRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const container = containerRef.current;
    const symbol = symbolRef.current;
    if (!container || !symbol) return;

    const prepared = prepareWithSegments(UNIT_TEXT, FONT);
    const textWidth = measureNaturalWidth(prepared);

    const ch = container.offsetHeight;
    const rowAreaTop = (ch - ROW_COUNT * LINE_H) / 2;

    const rows: RowEl[] = [];
    const offsets = SPEEDS.map((_, i) => (i * textWidth) / ROW_COUNT);

    for (let i = 0; i < ROW_COUNT; i++) {
      const rowTop = rowAreaTop + i * LINE_H;

      const leftClip = document.createElement('div');
      leftClip.style.cssText = `position:absolute;top:${rowTop}px;left:0;height:${LINE_H}px;overflow:hidden;pointer-events:none`;

      const leftText = document.createElement('span');
      leftText.style.cssText = `white-space:nowrap;position:absolute;top:0;left:0;font:${FONT};letter-spacing:0.14em;text-transform:uppercase;color:#f0f0f0;opacity:${BASE_OPACITIES[i]}`;
      leftText.textContent = TEXT_TRACK;
      leftClip.appendChild(leftText);

      const rightClip = document.createElement('div');
      rightClip.style.cssText = `position:absolute;top:${rowTop}px;height:${LINE_H}px;overflow:hidden;pointer-events:none`;

      const rightText = document.createElement('span');
      rightText.style.cssText = `white-space:nowrap;position:absolute;top:0;left:0;font:${FONT};letter-spacing:0.14em;text-transform:uppercase;color:#f0f0f0;opacity:${BASE_OPACITIES[i]}`;
      rightText.textContent = TEXT_TRACK;
      rightClip.appendChild(rightText);

      container.appendChild(leftClip);
      container.appendChild(rightClip);
      rows.push({ leftClip, leftText, rightClip, rightText });
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouseRef.current = { x: -999, y: -999 }; };
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    let rafId: number;

    const render = () => {
      const cw = container.offsetWidth;
      const ch2 = container.offsetHeight;
      const sx = cw / 2;
      const sy = ch2 / 2;
      const rowAreaTop2 = (ch2 - ROW_COUNT * LINE_H) / 2;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < ROW_COUNT; i++) {
        const dir = i % 2 === 0 ? 1 : -1;

        // Mouse proximity: speed boost when near
        const rowCy = rowAreaTop2 + i * LINE_H + LINE_H / 2;
        const distToMouse = Math.hypot(mx - cw / 2, my - rowCy);
        const mouseInfluence = Math.max(0, 1 - distToMouse / MOUSE_RADIUS);
        const speed = SPEEDS[i]! * (1 + mouseInfluence * 3);

        offsets[i] = ((offsets[i]! + speed * dir) % textWidth + textWidth) % textWidth;
        const offset = offsets[i]!;

        const rowTop = rowAreaTop2 + i * LINE_H;

        // Collision with central symbol
        const symbolInterval = circleIntervalForBand(sx, sy, SYMBOL_RADIUS, rowTop, rowTop + LINE_H, SYMBOL_HPAD, SYMBOL_VPAD);
        const leftWidth = symbolInterval ? Math.max(0, Math.min(symbolInterval.left, cw)) : cw;
        const rightStart = symbolInterval ? Math.max(0, Math.min(symbolInterval.right, cw)) : cw;
        const rightWidth = cw - rightStart;

        // Mouse proximity: highlight nearby rows gold
        const baseOpacity = BASE_OPACITIES[i]!;
        const highlightOpacity = baseOpacity + mouseInfluence * 0.55;
        const color = mouseInfluence > 0.3 ? `rgba(240,192,64,${mouseInfluence.toFixed(2)})` : '#f0f0f0';
        const opacity = Math.min(highlightOpacity, 0.75).toFixed(2);

        const { leftClip, leftText, rightClip, rightText } = rows[i]!;

        leftClip.style.top = `${rowTop}px`;
        leftClip.style.width = `${leftWidth}px`;
        leftText.style.transform = `translateX(${-offset}px)`;
        leftText.style.color = color;
        leftText.style.opacity = opacity;

        rightClip.style.top = `${rowTop}px`;
        rightClip.style.left = `${rightStart}px`;
        rightClip.style.width = `${rightWidth}px`;
        rightText.style.transform = `translateX(${-(offset + rightStart)}px)`;
        rightText.style.color = color;
        rightText.style.opacity = opacity;
      }

      symbol.style.left = `${sx}px`;
      symbol.style.top = `${sy}px`;

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      rows.forEach(({ leftClip, rightClip }) => {
        if (container.contains(leftClip)) container.removeChild(leftClip);
        if (container.contains(rightClip)) container.removeChild(rightClip);
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[480px] overflow-hidden select-none"
      style={{ background: '#050505' }}
    >
      {/* |-/ symbol */}
      <div
        ref={symbolRef}
        className="absolute z-20 pointer-events-none"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 rounded-full"
          style={{
            width: 220, height: 220,
            background: 'radial-gradient(circle, rgba(240,192,64,0.28) 0%, rgba(240,192,64,0.08) 50%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
        <motion.span
          animate={{
            opacity: [0.85, 1, 0.8, 1, 0.88, 1, 0.85],
            textShadow: [
              '0 0 12px rgba(240,192,64,0.5)',
              '0 0 32px rgba(240,192,64,1), 0 0 64px rgba(240,192,64,0.4)',
              '0 0 8px rgba(240,192,64,0.3)',
              '0 0 36px rgba(240,192,64,1), 0 0 72px rgba(240,192,64,0.5)',
              '0 0 14px rgba(240,192,64,0.5)',
              '0 0 28px rgba(240,192,64,0.9)',
              '0 0 12px rgba(240,192,64,0.5)',
            ],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', times: [0, 0.2, 0.35, 0.55, 0.7, 0.85, 1] }}
          style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: 'clamp(52px, 9vw, 110px)',
            fontWeight: 900,
            color: '#f0c040',
            letterSpacing: '0.15em',
            display: 'block',
          }}
        >
          |-/
        </motion.span>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none z-10"
        style={{ height: '35%', background: 'linear-gradient(to top, var(--ds-bg) 0%, transparent 100%)' }}
      />
    </div>
  );
}
