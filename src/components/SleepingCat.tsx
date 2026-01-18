'use client';

import React, { useState } from 'react';
import '@/utils/SleepingCat.css';

export default function SleepingCat() {
    const [showBubble, setShowBubble] = useState(false);

    const handleClick = () => {
        setShowBubble(true);
        setTimeout(() => setShowBubble(false), 2000);
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
            <div className={`cat-bubble ${showBubble ? 'show' : ''}`}>Miau! 🧡</div>

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
    );
}
