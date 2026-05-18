'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

export function useSectionTracking() {
  useEffect(() => {
    const entryTimes = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const section = (entry.target as HTMLElement).dataset.trackSection;
          if (!section) continue;

          if (entry.isIntersecting) {
            entryTimes.set(section, Date.now());
          } else {
            const entered = entryTimes.get(section);
            if (entered) {
              const timeOnSection = Math.round((Date.now() - entered) / 1000);
              posthog.capture('section_viewed', { section, time_on_section: timeOnSection });
              entryTimes.delete(section);
            }
          }
        }
      },
      { threshold: 0.3 }
    );

    const flush = () => {
      entryTimes.forEach((entered, section) => {
        const timeOnSection = Math.round((Date.now() - entered) / 1000);
        posthog.capture('section_viewed', { section, time_on_section: timeOnSection });
      });
      entryTimes.clear();
    };

    const sections = document.querySelectorAll<HTMLElement>('[data-track-section]');
    sections.forEach((el) => observer.observe(el));

    window.addEventListener('beforeunload', flush);
    return () => {
      observer.disconnect();
      window.removeEventListener('beforeunload', flush);
    };
  }, []);
}
