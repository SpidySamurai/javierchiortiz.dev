'use client';

import React, { useState } from 'react';
import '@/utils/FlatCat.css';

export default function FlatCat() {
    const [showBubble, setShowBubble] = useState(false);
    const [bubbleKey, setBubbleKey] = useState(0);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

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

    return (
        <div
            className="sleeping-cat-wrapper"
            aria-label="Interactive Flat Orange Cat"
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        >
            <div key={bubbleKey} className={`cat-bubble ${showBubble ? 'show' : ''}`}>Miau! 🧡</div>

            {/* Inner scale/anim container */}
            <div className="flat-cat-anim">
                <div className="flat-cat">
                    <div className="cat-tail"></div>
                    <div className="cat-body"></div>

                    <div className="cat-head">
                        <div className="cat-ear left"></div>
                        <div className="cat-ear right"></div>

                        <div className="cat-face">
                            <div className="cat-eye left"></div>
                            <div className="cat-eye right"></div>
                            <div className="cat-nose"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
