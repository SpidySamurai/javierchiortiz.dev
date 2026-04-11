'use client';

import type { BlogPost } from '@/data/blog';
import BlogPostLayout from './BlogPostLayout';
import SongHero from './SongHero';

export default function TwentyOnePilotsPost({ post, locale }: { post: BlogPost; locale: string }) {
  const heroSlot = <SongHero />;

  const midSlot = post.youtubeId ? (
    <div className="my-8">
      <div className="rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${post.youtubeId}`}
          allowFullScreen
          title="Twenty One Pilots"
          style={{ border: 'none', display: 'block' }}
        />
      </div>
      <p
        className="mt-3 text-sm italic"
        style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
      >
        — A song that explains it better than words.
      </p>
    </div>
  ) : null;

  return <BlogPostLayout post={post} locale={locale} heroSlot={heroSlot} midSlot={midSlot} />;
}
