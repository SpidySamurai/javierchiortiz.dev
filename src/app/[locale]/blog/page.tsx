import { getPublishedPosts } from '@/lib/blogQueries';
import BlogCard from '@/components/2026/ui/BlogCard';
import Header from '@/components/2026/layout/Header';
import Sidebar from '@/components/2026/layout/Sidebar';
import ScrollProgress from '@/components/2026/ui/ScrollProgress';
import CustomCursor from '@/components/2026/ui/CustomCursor';
import BackBreadcrumb from '@/components/2026/ui/BackBreadcrumb';
import { getSidebarCollapsed } from '@/lib/sidebarState';
import type { Post } from '@/types/database';

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [posts, sidebarCollapsed] = await Promise.all([getPublishedPosts(), getSidebarCollapsed()]);

  return (
    <div className="ds-2026" style={{ minHeight: '100vh' }}>
      <ScrollProgress />
      <CustomCursor />
      <Header />
      <Sidebar defaultCollapsed={sidebarCollapsed} />
      <main className="sidebar-main pt-20">
        <BackBreadcrumb />
        <section className="py-28 px-8" style={{ backgroundColor: 'var(--ds-bg)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="space-y-2 mb-16">
              <span
                className="text-xs uppercase tracking-[0.3em] font-bold block"
                style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                BLOG
              </span>
              <h1
                className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
                style={{
                  color: 'var(--ds-on-surface)',
                  fontFamily: 'var(--font-manrope), sans-serif',
                }}
              >
                Thoughts &{' '}
                <span style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>Beyond Code</span>
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={adaptPost(post, locale)} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function adaptPost(post: Post, locale: string) {
  return {
    slug: post.slug,
    date: post.published_at
      ? new Date(post.published_at).toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', {
          month: 'long',
          year: 'numeric',
        })
      : '',
    category: post.category,
    readTime: post.read_time,
    coverTheme: (post.cover_theme ?? 'pilots') as 'pilots' | 'spiderman' | 'karate',
    theme: post.cover_theme ?? undefined,
    title: locale === 'es' ? post.title_es : post.title_en,
    excerpt: (locale === 'es' ? post.excerpt_es : post.excerpt_en) ?? undefined,
    coverImageUrl: post.cover_image_url,
    coverImagePositionCard: post.cover_image_position_card,
    coverAspectCard: post.cover_image_aspect_card,
  };
}
