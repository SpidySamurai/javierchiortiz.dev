'use client';

import React, { useState, useRef } from 'react';
import styles from './FlatCat.module.css';

type FlatCatProps = {
  onUnlock?: () => void;
};

export default function FlatCat({ onUnlock }: FlatCatProps) {
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState('Miau! 🧡');
  const [bubbleKey, setBubbleKey] = useState(0);
  const clickCountRef = useRef(0);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bubbleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const faceRef = useRef<HTMLDivElement>(null);

  const handleInteraction = () => {
    // Clear any existing bubble auto-hide timeout
    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
    }

    // Easter Egg Logic
    clickCountRef.current += 1;

    // Visual Feedback (Simplified)
    setBubbleKey((prev) => prev + 1);
    setShowBubble(true);

    // Random variations without numbers
    const variations = ['Miau! 🧡', 'Miau!!!! ⚡', 'Miau? 🤔', 'Purr...'];
    const randomText = variations[Math.floor(Math.random() * variations.length)];
    setBubbleText(randomText);

    // Clear existing reset timer
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    // Check threshold (7 clicks)
    if (clickCountRef.current >= 7) {
      setBubbleText('¡Secret!'); // Show manual unlock feedback FIRST

      // Wait a bit before opening the secret modal
      if (onUnlock) {
        setTimeout(() => {
          onUnlock();
        }, 1000);
      }

      // Keep the text visible a bit longer
      bubbleTimeoutRef.current = setTimeout(() => setShowBubble(false), 4000);

      clickCountRef.current = 0; // Reset count
    } else {
      // Set timer to reset count if user stops clicking for a bit (1.5s)
      resetTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
        setBubbleText('...'); // Reset feedback
      }, 1500);

      // Auto hide bubble for normal clicks
      bubbleTimeoutRef.current = setTimeout(() => setShowBubble(false), 2000);
    }
  };

  // Tracking del mouse para los ojos
  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!faceRef.current) return;
      const faceRect = faceRef.current.getBoundingClientRect();
      const faceCenterX = faceRect.left + faceRect.width / 2;
      const faceCenterY = faceRect.top + faceRect.height / 2;

      const deltaX = event.clientX - faceCenterX;
      const deltaY = event.clientY - faceCenterY;

      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.hypot(deltaX, deltaY), 8); // Limit movement

      const pupilX = Math.cos(angle) * distance;
      const pupilY = Math.sin(angle) * distance;

      faceRef.current.style.setProperty('--pupil-x', `${pupilX}px`);
      faceRef.current.style.setProperty('--pupil-y', `${pupilY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className={styles['sleeping-cat-wrapper']} // Using module class with bracket notation due to hyphens if needed, or camelCase if configured
      onClick={handleInteraction}
      title="Miau!"
    >
      <div className={styles['flat-cat-anim']}>
        <div className={styles['flat-cat']}>
          {/* Tail */}
          <div className={styles['cat-tail']}></div>

          {/* Body */}
          <div className={styles['cat-body']}></div>

          {/* Head */}
          <div className={styles['cat-head']} ref={faceRef}>
            <div className={`${styles['cat-ear']} ${styles.left}`}></div>
            <div className={`${styles['cat-ear']} ${styles.right}`}></div>

            <div className={styles['cat-face']}>
              <div className={styles['cat-eye']}></div>
              <div className={styles['cat-nose']}></div>
              <div className={styles['cat-eye']}></div>
            </div>
          </div>

          {/* Speech Bubble */}
          {showBubble && (
            <div key={bubbleKey} className={`${styles['cat-bubble']} ${styles.show}`}>
              {bubbleText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
