import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/blogQueries';
import MarkdownPost from '@/components/2026/blog/MarkdownPost';

const BASE_URL = 'https://javierchiortiz.dev';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);
  const title = post ? (locale === 'es' ? post.title_es : post.title_en) : 'Blog Post';
  const description = post
    ? ((locale === 'es' ? post.excerpt_es : post.excerpt_en) ?? undefined)
    : undefined;
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog/${slug}`,
      languages: {
        en: `${BASE_URL}/en/blog/${slug}`,
        es: `${BASE_URL}/es/blog/${slug}`,
        'x-default': `${BASE_URL}/en/blog/${slug}`,
      },
    },
    openGraph: {
      title: title ?? undefined,
      description: description ?? undefined,
      url: `${BASE_URL}/${locale}/blog/${slug}`,
      type: 'article',
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return <MarkdownPost post={post} locale={locale} />;
}
