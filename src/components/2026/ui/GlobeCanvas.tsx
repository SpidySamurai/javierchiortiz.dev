'use client';

import createGlobe from 'cobe';
import { useEffect, useRef, useState } from 'react';

export interface GlobePoint {
  lat: number;
  lng: number;
}

interface GlobeCanvasProps {
  points: GlobePoint[];
  size?: number;
}

export default function GlobeCanvas({ points, size = 480 }: GlobeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phi = useRef(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const pointsRef = useRef<GlobePoint[]>(points);
  const markerProgress = useRef(0);
  const [visible, setVisible] = useState(false);

  // Keep ref in sync without recreating the globe
  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.35, 0.6],
      markerColor: [1, 0.65, 0.2],
      glowColor: [0.38, 0.40, 1],
      markers: [],
    });

    let rafId: number;

    const animate = () => {
      if (!isDragging.current) phi.current += 0.005;
      if (pointsRef.current.length > 0) {
        markerProgress.current = Math.min(1, markerProgress.current + 0.012);
      }
      const pulse = (0.018 + Math.abs(Math.sin(Date.now() / 1200)) * 0.007) * markerProgress.current;
      globe.update({
        phi: phi.current,
        markers: pointsRef.current.map((p) => ({
          location: [p.lat, p.lng] as [number, number],
          size: pulse,
        })),
      });
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    setTimeout(() => setVisible(true), 200);

    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      lastX.current = e.clientX;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      phi.current += (e.clientX - lastX.current) / 100;
      lastX.current = e.clientX;
    };
    const onPointerUp = () => { isDragging.current = false; };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      cancelAnimationFrame(rafId);
      globe.destroy();
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [size]); // globe created once — points flow in via ref

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        maxWidth: size,
        height: 'auto',
        aspectRatio: '1',
        margin: '0 auto',
        cursor: 'grab',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}
    />
  );
}
