// src/components/Cat.tsx
'use client';
import '@/utils/Cat.css';
import React from 'react';

export default function Cat() {
  return (
    <div className="cat-wrapper" role="img" aria-label="Animated orange cat">
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

          {/* Back stripes */}
          <path d="M14 26 q8 -8 20 -8" stroke="#d46b14" strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.95} />
          <path d="M12 30 q8 -8 22 -8" stroke="#d46b14" strokeWidth={1.5} strokeLinecap="round" fill="none" opacity={0.85} />

          {/* Paws (front) */}
          <g transform="translate(8,42)">
            <circle cx={6} cy={6} r={3.2} fill="#f39c12" stroke="#b35715" strokeWidth={0.9} />
            <circle cx={18} cy={6} r={3.2} fill="#f39c12" stroke="#b35715" strokeWidth={0.9} />
          </g>

          {/* Head */}
          <circle className="cat-head" cx={28} cy={16} r={13} fill="url(#bodyGrad)" stroke="#b35715" strokeWidth={1.6} />

          {/* Ears */}
          <polygon className="cat-ear left" points="18,8 14,0 22,6" fill="url(#earGrad)" stroke="#b35715" />
          <polygon className="cat-ear right" points="38,8 34,0 42,6" fill="url(#earGrad)" stroke="#b35715" />
          <polygon points="16.5,6 18,2 20.5,6" fill="#ffd9b3" opacity={0.95} />
          <polygon points="39.5,6 37.5,2 35.5,6" fill="#ffd9b3" opacity={0.95} />

          {/* Eyes */}
          <g className="cat-eyes">
            <ellipse className="cat-eye" cx={22} cy={16} rx={3} ry={3.6} fill="#2c3e50" />
            <ellipse className="cat-eye" cx={34} cy={16} rx={3} ry={3.6} fill="#2c3e50" />
            <circle cx={21.2} cy={15.2} r={0.7} fill="#fff" opacity={0.95} />
            <circle cx={33.2} cy={15.2} r={0.7} fill="#fff" opacity={0.95} />
          </g>

          {/* Nose & mouth */}
          <path d="M28 18 q1.4 2 4 2" stroke="#b4553a" strokeWidth={1.4} fill="none" strokeLinecap="round" />
          <path d="M28 20 q2 1 4 0" stroke="#b4553a" strokeWidth={1} fill="none" strokeLinecap="round" />

          {/* Whiskers */}
          <path d="M14 18 h-6" stroke="#8d4b18" strokeWidth={0.9} strokeLinecap="round" />
          <path d="M42 18 h6" stroke="#8d4b18" strokeWidth={0.9} strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
 
