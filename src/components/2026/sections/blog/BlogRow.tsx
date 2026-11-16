import Link from 'next/link';
import BlogCover from '@/components/2026/ui/BlogCover';

export interface BlogRowPost {
  slug: string;
  title?: string;
  excerpt?: string;
  /** Already localized label (e.g. "Ingeniería"). */
  category: string;
  date: string;
  readTime: string;
  coverImageUrl?: string | null;
  coverImagePosition?: string | null;
  coverTheme: 'pilots' | 'spiderman' | 'karate';
}

const HAIRLINE = 'color-mix(in srgb, var(--ds-on-surface) 7%, transparent)';

/**
 * One post in the home's editorial list: thumbnail, category, title, excerpt and meta, with a
 * "read" cue on the right. The whole row is the link; hover lifts the title to the primary color.
 */
export function BlogRow({
  post,
  href,
  readLabel,
}: {
  post: BlogRowPost;
  href: string;
  readLabel: string;
}) {
  return (
    <Link
      href={href}
      className="group grid grid-cols-[96px_1fr] md:grid-cols-[200px_1fr_auto] gap-5 md:gap-8 items-center py-6 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:[outline-color:var(--ds-primary)]"
      style={{ boxShadow: `0 1px 0 ${HAIRLINE}` }}
    >
      <div
        className="relative overflow-hidden rounded-lg aspect-[5/3]"
        style={{ backgroundColor: 'var(--ds-surface-high)' }}
      >
        {post.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- same remote covers BlogCard renders as <img>
          <img
            src={post.coverImageUrl}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
            style={{ objectPosition: post.coverImagePosition ?? 'center' }}
          />
        ) : (
          <div className="absolute inset-0" aria-hidden>
            <BlogCover theme={post.coverTheme} height="100%" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <span
          className="text-[11px] uppercase tracking-[0.2em] font-bold"
          style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {post.category}
        </span>
        <h3
          className="mt-2 text-lg md:text-2xl font-extrabold leading-tight tracking-[-0.01em] transition-colors duration-200 group-hover:text-[color:var(--ds-primary)] group-focus-visible:text-[color:var(--ds-primary)]"
          style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p
            className="hidden md:block mt-2 text-[14.5px] leading-[1.55] max-w-3xl line-clamp-2"
            style={{
              color: 'var(--ds-on-surface-variant)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
          >
            {post.excerpt}
          </p>
        )}
        <p
          className="mt-2 text-xs"
          style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {post.date}
          {post.date && post.readTime ? ' · ' : ''}
          {post.readTime}
        </p>
      </div>

      <span
        className="hidden md:inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.06em]"
        style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-manrope), sans-serif' }}
      >
        {readLabel}
        <span
          translate="no"
          aria-hidden
          className="material-symbols-outlined text-base inline-block transition-transform duration-200 motion-safe:group-hover:translate-x-1"
        >
          arrow_forward
        </span>
      </span>
    </Link>
  );
}
