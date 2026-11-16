import type { Metadata } from 'next';
import { getPublishedPosts } from '@/lib/blogQueries';
import { getTranslations } from 'next-intl/server';
import { BlogIndex, type BlogCategoryTab } from '@/components/2026/sections/blog/BlogIndex';
import { adaptPostRow } from '@/lib/blogPostRow';
import Header from '@/components/2026/layout/Header';
import ScrollProgress from '@/components/2026/ui/ScrollProgress';
import CustomCursor from '@/components/2026/ui/CustomCursor';
import BackBreadcrumb from '@/components/2026/ui/BackBreadcrumb';

const BASE_URL = 'https://javierchiortiz.dev';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  return {
    title: isEn ? 'Blog: Thoughts & Beyond Code' : 'Blog: Pensamientos y más allá del código',
    description: isEn
      ? 'Engineering insights, life lessons, and culture by Javier Chi, AI software engineer.'
      : 'Perspectivas de ingeniería, lecciones de vida y cultura por Javier Chi, ingeniero de software con IA.',
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog`,
      languages: {
        en: `${BASE_URL}/en/blog`,
        es: `${BASE_URL}/es/blog`,
        'x-default': `${BASE_URL}/en/blog`,
      },
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [posts, t] = await Promise.all([
    getPublishedPosts(),
    getTranslations({ locale, namespace: 'common' }),
  ]);
  const items = posts.map((post) => adaptPostRow(post, locale, t));
  // One tab per category present in the posts, in order of first appearance.
  const tabs: BlogCategoryTab[] = [];
  items.forEach(({ categoryKey, row }) => {
    if (!tabs.some((tab) => tab.key === categoryKey)) {
      tabs.push({ key: categoryKey, label: row.category });
    }
  });

  return (
    <div className="ds-2026" style={{ minHeight: '100vh' }}>
      <ScrollProgress />
      <CustomCursor />
      <Header />
      <main className="pt-20">
        <BackBreadcrumb />
        <section className="py-20 px-8" style={{ backgroundColor: 'var(--ds-bg)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6 lg:gap-14 lg:items-end mb-12">
              <div className="space-y-2">
                <span
                  className="text-xs uppercase tracking-[0.3em] font-bold block"
                  style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  Blog
                </span>
                <h1
                  className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
                  style={{
                    color: 'var(--ds-on-surface)',
                    fontFamily: 'var(--font-manrope), sans-serif',
                  }}
                >
                  {t('blog_title')}{' '}
                  <span style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>
                    {t('blog_title_accent')}
                  </span>
                </h1>
              </div>
              <p
                className="text-base leading-relaxed max-w-xl"
                style={{
                  color: 'var(--ds-on-surface-variant)',
                  fontFamily: 'var(--font-inter), sans-serif',
                }}
              >
                {t('blog_lead')}
              </p>
            </div>
            <BlogIndex
              items={items}
              tabs={tabs}
              locale={locale}
              allLabel={t('blog_filter_all')}
              filterLabel={t('blog_filter_label')}
              readLabel={t('blog_read')}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
