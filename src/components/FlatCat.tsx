import React, { useState } from 'react';
import styles from './FlatCat.module.css';

export default function FlatCat() {
    const [showBubble, setShowBubble] = useState(false);
    const [bubbleKey, setBubbleKey] = useState(0);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const faceRef = React.useRef<HTMLDivElement>(null);

    const handleClick = () => {
        // Force re-render of bubble to replay animation
        setBubbleKey(prev => prev + 1);
        setShowBubble(true);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setShowBubble(false);
            timeoutRef.current = null;
        }, 2000);
    };

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!faceRef.current) return;

            const rect = faceRef.current.getBoundingClientRect();
            const faceCenterX = rect.left + rect.width / 2;
            const faceCenterY = rect.top + rect.height / 2;

            const dx = e.clientX - faceCenterX;
            const dy = e.clientY - faceCenterY;
            const angle = Math.atan2(dy, dx);

            // Limit movement radius
            const maxRadius = 6;
            const dist = Math.min(maxRadius, Math.hypot(dx, dy) / 10); // Damping divisor

            const pupilX = Math.cos(angle) * dist;
            const pupilY = Math.sin(angle) * dist;

            faceRef.current.style.setProperty('--pupil-x', `${pupilX}px`);
            faceRef.current.style.setProperty('--pupil-y', `${pupilY}px`);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            className={styles['sleeping-cat-wrapper']}
            aria-label="Interactive Flat Orange Cat"
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        >
            <div key={bubbleKey} className={`${styles['cat-bubble']} ${showBubble ? styles.show : ''}`}>Miau! 🧡</div>

            {/* Inner scale/anim container */}
            <div className={styles['flat-cat-anim']}>
                <div className={styles['flat-cat']}>
                    <div className={styles['cat-tail']}></div>
                    <div className={styles['cat-body']}></div>

                    <div className={styles['cat-head']}>
                        <div className={`${styles['cat-ear']} ${styles.left}`}></div>
                        <div className={`${styles['cat-ear']} ${styles.right}`}></div>

                        <div ref={faceRef} className={styles['cat-face']}>
                            <div className={`${styles['cat-eye']} ${styles.left}`}></div>
                            <div className={`${styles['cat-eye']} ${styles.right}`}></div>
                            <div className={styles['cat-nose']}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
