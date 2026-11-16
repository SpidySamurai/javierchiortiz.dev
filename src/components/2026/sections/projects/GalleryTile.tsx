import type { DataProject } from '@/types';
import { ResponsiveLoop } from '@/components/2026/ui/ResponsiveLoop';

const FONT_BODY = 'var(--font-inter), sans-serif';
const FONT_HEAD = 'var(--font-manrope), sans-serif';

export interface GalleryTileCopy {
  title: string;
  kind: string;
  description: string;
  /** Label and value pairs shown with the details, already translated. */
  facts: [string, string][];
  liveLabel: string;
  liveAria: string;
}

/**
 * One bento tile: the project's loop, its name always readable at the bottom,
 * and the details over the loop on hover or keyboard focus (a tap focuses the
 * tile on touch screens).
 */
export function GalleryTile({
  project,
  copy,
  className,
}: {
  project: DataProject;
  copy: GalleryTileCopy;
  className: string;
}) {
  if (!project.videoDesktop || !project.videoMobile) return null;

  return (
    <ResponsiveLoop
      sources={{
        desktop: project.videoDesktop,
        mobile: project.videoMobile,
        desktopPoster: project.posterDesktop,
        mobilePoster: project.posterMobile,
      }}
      label={copy.title}
      className={`group ${className}`}
    >
      <div
        tabIndex={0}
        className="absolute inset-0 z-10 outline-none focus-visible:[box-shadow:inset_0_0_0_2px_var(--ds-primary)] rounded-md"
      >
        <div
          className="absolute inset-x-0 bottom-0 px-4 pb-3.5 pt-12 transition-opacity duration-200 group-hover:opacity-0 group-focus-within:opacity-0"
          style={{
            background:
              'linear-gradient(transparent, color-mix(in srgb, var(--ds-bg) 92%, transparent))',
          }}
        >
          <h3
            className="text-[17px] font-bold"
            style={{ color: 'var(--ds-on-surface)', fontFamily: FONT_HEAD }}
          >
            {copy.title}
          </h3>
          <p
            className="text-xs mt-0.5"
            style={{ color: 'var(--ds-on-surface-variant)', fontFamily: FONT_BODY }}
          >
            {copy.kind}
          </p>
        </div>

        <div
          className="absolute inset-0 flex flex-col justify-end gap-2.5 p-4 md:p-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
          style={{ backgroundColor: 'color-mix(in srgb, var(--ds-bg) 90%, transparent)' }}
        >
          <p
            aria-hidden
            className="text-xl font-extrabold"
            style={{ color: 'var(--ds-on-surface)', fontFamily: FONT_HEAD }}
          >
            {copy.title}
          </p>
          <p
            className="hidden @min-[260px]:block text-[13px] leading-relaxed"
            style={{ color: 'var(--ds-on-surface-variant)', fontFamily: FONT_BODY }}
          >
            {copy.description}
          </p>
          <dl
            className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs"
            style={{ fontFamily: FONT_BODY }}
          >
            {copy.facts.map(([label, value]) => (
              <div key={label} className="contents">
                <dt
                  className="text-[10px] uppercase tracking-[0.12em] font-bold pt-0.5"
                  style={{ color: 'var(--ds-outline)' }}
                >
                  {label}
                </dt>
                <dd style={{ color: 'var(--ds-on-surface)' }}>{value}</dd>
              </div>
            ))}
          </dl>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={copy.liveAria}
              className="self-start inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--ds-primary)]"
              style={{ color: 'var(--ds-primary)', fontFamily: FONT_HEAD }}
            >
              {copy.liveLabel}
              <span translate="no" aria-hidden className="material-symbols-outlined text-sm">
                arrow_outward
              </span>
            </a>
          )}
        </div>
      </div>
    </ResponsiveLoop>
  );
}
