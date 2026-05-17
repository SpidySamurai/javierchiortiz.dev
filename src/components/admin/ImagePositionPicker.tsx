'use client';

import { useRef, useCallback } from 'react';

interface Props {
  src: string;
  value: string;           // CSS object-position e.g. "50% 30%"
  onChange: (pos: string) => void;
  label: string;
  previewHeight: number;   // px — 200 for card, 420 for hero
}

export default function ImagePositionPicker({ src, value, onChange, label, previewHeight }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const calcPos = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.round(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
    const y = Math.round(Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100)));
    onChange(`${x}% ${y}%`);
  }, [onChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    calcPos(e.clientX, e.clientY);

    const onMove = (ev: MouseEvent) => calcPos(ev.clientX, ev.clientY);
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [calcPos]);

  // Parse "50% 30%" → { x: 50, y: 30 }
  const [xStr, yStr] = value.split(' ');
  const dotX = parseFloat(xStr ?? '50');
  const dotY = parseFloat(yStr ?? '50');

  return (
    <div style={{ marginBottom: 16 }}>
      <span style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>
        {label}
      </span>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        style={{
          position: 'relative',
          width: '100%',
          height: previewHeight,
          borderRadius: 8,
          overflow: 'hidden',
          cursor: 'crosshair',
          userSelect: 'none',
        }}
      >
        <img
          src={src}
          alt=""
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: value,
            pointerEvents: 'none',
          }}
        />
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '25% 25%',
          pointerEvents: 'none',
        }} />
        {/* Focal point dot */}
        <div style={{
          position: 'absolute',
          left: `${dotX}%`,
          top: `${dotY}%`,
          transform: 'translate(-50%, -50%)',
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#c0c1ff',
          boxShadow: '0 0 0 2px rgba(0,0,0,0.5), 0 0 0 4px rgba(192,193,255,0.4)',
          pointerEvents: 'none',
        }} />
      </div>
      <span style={{ fontSize: 11, color: '#464554', marginTop: 4, display: 'block' }}>
        {value}
      </span>
    </div>
  );
}
