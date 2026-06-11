'use client';

import { useRef, useCallback, useEffect, useState } from 'react';

interface Props {
  src: string;
  value: string;
  onChange: (pos: string) => void;
  label: string;
  aspectRatio?: string;
}

export default function ImagePositionPicker({ src, value, onChange, label, aspectRatio = '16/9' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listenersRef = useRef<{ move: (e: MouseEvent) => void; up: (e: MouseEvent) => void } | null>(null);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (listenersRef.current) {
        document.removeEventListener('mousemove', listenersRef.current.move);
        document.removeEventListener('mouseup', listenersRef.current.up);
      }
    };
  }, []);

  const calcPos = useCallback((clientX: number, clientY: number): string | null => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = Math.round(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
    const y = Math.round(Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100)));
    return `${x}% ${y}%`;
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const initial = calcPos(e.clientX, e.clientY);
      if (initial) setDraft(initial);

      const onMove = (ev: MouseEvent) => {
        const pos = calcPos(ev.clientX, ev.clientY);
        if (pos) setDraft(pos);
      };

      const onUp = (ev: MouseEvent) => {
        const pos = calcPos(ev.clientX, ev.clientY);
        if (pos) {
          setDraft(pos);
          onChange(pos);
        }
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        listenersRef.current = null;
      };

      listenersRef.current = { move: onMove, up: onUp };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [calcPos, onChange]
  );

  const [xStr, yStr] = draft.split(' ');
  const dotX = Number.isFinite(parseFloat(xStr)) ? parseFloat(xStr) : 50;
  const dotY = Number.isFinite(parseFloat(yStr)) ? parseFloat(yStr) : 50;

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
          aspectRatio,
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
            objectPosition: draft,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '25% 25%',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
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
          }}
        />
      </div>
      <span style={{ fontSize: 11, color: '#464554', marginTop: 4, display: 'block' }}>
        {draft}
      </span>
    </div>
  );
}
