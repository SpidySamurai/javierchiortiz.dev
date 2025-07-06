'use client';
import { useState, useRef, useEffect } from 'react';
import { techIcons } from '@/data/techStack';

type TechStackProps = {
  stack: string[];
  previewRows?: number;
  rowHeight?: number;
};

export default function TechStack({
  stack,
  previewRows = 2,
  rowHeight = 32,
}: TechStackProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState('0px');
  const [canOverflow, setCanOverflow] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const updateHeights = () => {
    if (contentRef.current) {
      const fullHeight = contentRef.current.scrollHeight;
      const limitedHeight = previewRows * rowHeight;
      setCanOverflow(fullHeight > limitedHeight);
      setMaxHeight(isExpanded ? `${fullHeight}px` : `${limitedHeight}px`);
    }
  };

  useEffect(() => {
    updateHeights();
  }, [isExpanded, stack]);

  useEffect(() => {
    if (!contentRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      updateHeights();
    });

    resizeObserver.observe(contentRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <>
      <div
        className="mt-4 overflow-hidden transition-[max-height] duration-450 ease-[cubic-bezier(0.87,0,0.13,1)]"
        style={{ maxHeight }}
      >
        <div ref={contentRef} className="flex flex-wrap gap-2">
          {stack.map((tech, idx) => {
            const techInfo = techIcons[tech];
            const Icon = techInfo?.icon;
            return (
              <span
                key={idx}
                className="flex items-center gap-2 bg-blue-800/40 text-blue-200 text-xs px-2 py-1 rounded-full font-mono"
              >
                {Icon && <Icon className="w-4 h-4" style={{ color: techInfo?.color }} />}
                {techInfo?.label ?? tech}
              </span>
            );
          })}
        </div>
      </div>

      {canOverflow && (
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsExpanded(prev => !prev);
          }}
          className="text-xs text-blue-300 underline underline-offset-2 mt-2 inline-block"
        >
          {isExpanded ? 'ver menos' : 'ver más'}
        </button>
      )}
    </>
  );
}
