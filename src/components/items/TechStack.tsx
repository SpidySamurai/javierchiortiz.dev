'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { techIcons } from '@/data/techStack';
import TechPill from '@/components/ui/TechPill';
import type { TechId } from '@/types';

type TechStackProps = {
  stack: TechId[];
  previewRows?: number;
  rowHeight?: number;
};

export default function TechStack({ stack, previewRows = 2, rowHeight = 32 }: TechStackProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState(`${previewRows * rowHeight}px`);
  const [canOverflow, setCanOverflow] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const updateHeights = useCallback(() => {
    if (contentRef.current) {
      const fullHeight = contentRef.current.scrollHeight;
      const limitedHeight = previewRows * rowHeight;
      setCanOverflow(fullHeight > limitedHeight);
      setMaxHeight(isExpanded ? `${fullHeight}px` : `${limitedHeight}px`);
    }
  }, [isExpanded, previewRows, rowHeight]);

  useEffect(() => {
    updateHeights();
  }, [updateHeights]);

  // Recompute when the content (stack) changes
  useEffect(() => {
    updateHeights();
  }, [stack, updateHeights]);

  useEffect(() => {
    if (!contentRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      updateHeights();
    });

    resizeObserver.observe(contentRef.current);

    return () => resizeObserver.disconnect();
  }, [updateHeights]);

  return (
    <>
      <div
        className="mt-4 overflow-hidden transition-[max-height] duration-[450ms] ease-[cubic-bezier(0.87,0,0.13,1)]"
        style={{ maxHeight }}
      >
        <div ref={contentRef} className="flex flex-wrap gap-2">
          {stack.map((tech) => {
            const techInfo = techIcons[tech];
            const Icon = techInfo?.icon;
            return (
              <TechPill
                key={tech}
                label={techInfo?.label ?? tech}
                Icon={Icon}
                color={techInfo?.color}
              />
            );
          })}
        </div>
      </div>

      {canOverflow && (
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsExpanded((prev) => !prev);
          }}
          className="text-xs text-blue-300 underline underline-offset-2 mt-2 inline-block"
        >
          {isExpanded ? 'ver menos' : 'ver más'}
        </button>
      )}
    </>
  );
}
