import type { ReactNode } from 'react';
import type { LoopSources } from '@/types';
import { LoopVideo } from './LoopVideo';

/**
 * A media box that picks its loop from its own width, not the screen's:
 * under 360px it plays the mobile capture, otherwise the desktop one. Tall
 * narrow boxes on desktop and every box on a phone get the mobile loop.
 */
export function ResponsiveLoop({
  sources,
  label,
  className = '',
  children,
}: {
  sources: LoopSources;
  label: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`@container relative overflow-hidden rounded-md ${className}`}>
      <LoopVideo
        src={sources.desktop}
        poster={sources.desktopPoster}
        label={label}
        className="block @max-[360px]:hidden"
      />
      <LoopVideo
        src={sources.mobile}
        poster={sources.mobilePoster}
        label={label}
        className="hidden @max-[360px]:block"
      />
      {children}
    </div>
  );
}
