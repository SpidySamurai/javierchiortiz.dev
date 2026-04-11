'use client';

import { use } from 'react';
import Link from 'next/link';
import { blogPosts } from '@/data/blog';
import BlogPostLayout from '@/components/2026/blog/BlogPostLayout';
import TwentyOnePilotsPost from '@/components/2026/blog/TwentyOnePilotsPost';
import SpiderManPost from '@/components/2026/blog/SpiderManPost';
import type { BlogPost } from '@/data/blog';

type PostComponent = React.ComponentType<{ post: BlogPost; locale: string }>;

const POST_COMPONENTS: Record<string, PostComponent> = {
  'twenty-one-pilots': TwentyOnePilotsPost,
  'spider-man': SpiderManPost,
};

export default function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = use(params);
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="ds-2026 py-28 px-8 text-center" style={{ minHeight: '100vh' }}>
        <p style={{ color: 'var(--ds-on-surface-variant)' }}>Post not found.</p>
        <Link href={`/${locale}/blog`} style={{ color: 'var(--ds-primary)' }}>← Back to Blog</Link>
      </div>
    );
  }

  const PostComponent = POST_COMPONENTS[slug] ?? BlogPostLayout;
  return <PostComponent post={post} locale={locale} />;
}
