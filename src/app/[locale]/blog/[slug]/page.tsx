import { getPostBySlug } from '@/lib/blogQueries';
import { blogPosts } from '@/data/blog';
import TwentyOnePilotsPost from '@/components/2026/blog/TwentyOnePilotsPost';
import SpiderManPost from '@/components/2026/blog/SpiderManPost';
import MarkdownPost from '@/components/2026/blog/MarkdownPost';
import Link from 'next/link';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <div className="ds-2026 py-28 px-8 text-center" style={{ minHeight: '100vh' }}>
        <p style={{ color: 'var(--ds-on-surface-variant)' }}>Post not found.</p>
        <Link href={`/${locale}/blog`} style={{ color: 'var(--ds-primary)' }}>
          ← Back to Blog
        </Link>
      </div>
    );
  }

  // Route legacy custom-component posts
  if (slug === 'twenty-one-pilots') {
    const legacy = blogPosts.find((p) => p.slug === slug);
    if (legacy) return <TwentyOnePilotsPost post={legacy} locale={locale} />;
  }
  if (slug === 'spider-man') {
    const legacy = blogPosts.find((p) => p.slug === slug);
    if (legacy) return <SpiderManPost post={legacy} locale={locale} />;
  }

  return <MarkdownPost post={post} locale={locale} />;
}
