// src/components/Cat.tsx
'use client';
import '@/utils/Cat.css';
import React from 'react';

export default function Cat() {
  const [showBubble, setShowBubble] = React.useState(false);
  const [pupilPos, setPupilPos] = React.useState({
    left: { x: 0, y: 0 },
    right: { x: 0, y: 0 },
  });
  const catRef = React.useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setShowBubble(true);
    setTimeout(() => setShowBubble(false), 2000);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!catRef.current) return;
      
      const rect = catRef.current.getBoundingClientRect();
      const scaleX = rect.width / 72; // Normalize if scaled
      const scaleY = rect.height / 72;

      // Base eye positions relative to the SVG (72x72 viewBox)
      // Left: 21, 16. Right: 35, 16.
      // We must account for the 1.5rem bottom/right fixed positioning if needed,
      // but getBoundingClientRect returns viewport coordinates which is what we want.
      
      const leftEyeCx = rect.left + (21 * scaleX);
      const leftEyeCy = rect.top + (16 * scaleY);
      const rightEyeCx = rect.left + (35 * scaleX);
      const rightEyeCy = rect.top + (16 * scaleY);

      const calcOffset = (eyeX: number, eyeY: number) => {
        const dx = e.clientX - eyeX;
        const dy = e.clientY - eyeY;
        const angle = Math.atan2(dy, dx);
        // Max pupil movement radius (e.g. 2.5 units)
        // We use a log/sqrt scale or clamping so it doesn't jump too fast, 
        // but simple clamping is usually best for eyes.
        const maxDist = 2.5; 
        const dist = Math.min(maxDist, Math.hypot(dx, dy) / 15); 
        
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist
        };
      };

      setPupilPos({
        left: calcOffset(leftEyeCx, leftEyeCy),
        right: calcOffset(rightEyeCx, rightEyeCy)
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={catRef}
      className="cat-wrapper cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label="Interactive Kawaii Cat"
    >
      {/* Speech Bubble */}
      <div className={`cat-bubble ${showBubble ? 'show' : ''}`}>Miau! 🧡</div>

      <svg
        className="cat-svg"
        width="72"
        height="72"
        viewBox="0 0 72 72"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="false"
        focusable="false"
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffd9b3" />
            <stop offset="50%" stopColor="#f39c12" />
            <stop offset="100%" stopColor="#d35400" />
          </linearGradient>
          <linearGradient id="earGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffd9a3" />
            <stop offset="100%" stopColor="#f39c12" />
            <stop offset="100%" stopColor="#d35400" />
          </linearGradient>
        </defs>

        <g className="cat-group" transform="translate(6,6)">
          {/* Tail */}
          <path
            className="cat-tail"
            d="M44 38 C54 34, 62 26, 58 18"
            stroke="#8d4b18"
            strokeWidth={4}
            strokeLinecap="round"
            fill="none"
          />

          {/* Body */}
          <ellipse cx={28} cy={34} rx={20} ry={16} fill="url(#bodyGrad)" stroke="#b35715" strokeWidth={1.6} />

          {/* Paws (peeking over edge) */}
          <g transform="translate(8,42)">
            <ellipse cx={6} cy={6} rx={4} ry={3.5} fill="#fff" stroke="#b35715" strokeWidth={0.9} />
            <ellipse cx={18} cy={6} rx={4} ry={3.5} fill="#fff" stroke="#b35715" strokeWidth={0.9} />
          </g>

          {/* Head */}
          <circle className="cat-head" cx={28} cy={16} r={14} fill="url(#bodyGrad)" stroke="#b35715" strokeWidth={1.6} />

          {/* Ears */}
          <polygon className="cat-ear left" points="18,8 12,-2 24,6" fill="url(#earGrad)" stroke="#b35715" strokeLinejoin="round" />
          <polygon className="cat-ear right" points="38,8 44,-2 32,6" fill="url(#earGrad)" stroke="#b35715" strokeLinejoin="round" />

          {/* Inner Ears */}
          <polygon points="17,6 15,2 20,6" fill="#ffd1dc" opacity={0.8} />
          <polygon points="39,6 41,2 36,6" fill="#ffd1dc" opacity={0.8} />

          {/* Eyes (Kawaii) */}
          <g className="cat-eyes">
            <circle cx={21 + pupilPos.left.x} cy={16 + pupilPos.left.y} r={3.5} fill="#2c3e50" />
            <circle cx={35 + pupilPos.right.x} cy={16 + pupilPos.right.y} r={3.5} fill="#2c3e50" />
            {/* Sparkles */}
            <circle cx={22.5 + pupilPos.left.x} cy={14.5 + pupilPos.left.y} r={1.2} fill="#fff" />
            <circle cx={36.5 + pupilPos.right.x} cy={14.5 + pupilPos.right.y} r={1.2} fill="#fff" />
          </g>

          {/* Cheeks */}
          <ellipse cx={16} cy={20} rx={2.5} ry={1.5} fill="#ff9aa2" opacity={0.6} />
          <ellipse cx={40} cy={20} rx={2.5} ry={1.5} fill="#ff9aa2" opacity={0.6} />

          {/* Nose & mouth */}
          <path d="M28 19 l-1.5 1.5 h3 z" fill="#ff9aa2" stroke="none" />
          <path d="M28 20.5 q-1.5 1.5 -3 1" stroke="#b4553a" strokeWidth={1} fill="none" strokeLinecap="round" />
          <path d="M28 20.5 q1.5 1.5 3 1" stroke="#b4553a" strokeWidth={1} fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
