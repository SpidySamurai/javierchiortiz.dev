'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      setProgress(total > 0 ? scrollTop / total : 0);
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] origin-left pointer-events-none"
      style={{
        transform: `scaleX(${progress})`,
        background:
          'linear-gradient(to right, var(--ds-primary), color-mix(in srgb, var(--ds-primary) 60%, #c0c1ff))',
        transition: 'transform 0.05s linear',
      }}
    />
  );
}
