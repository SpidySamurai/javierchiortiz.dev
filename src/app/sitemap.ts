import type { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/blogQueries';

const BASE_URL = 'https://javierchiortiz.dev';
const LOCALES = ['es', 'en'] as const;

const staticRoutes = ['', '/blog', '/experience', '/visitors', '/privacy'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts().catch(() => []);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${route}`,
      changeFrequency: route === '' ? ('weekly' as const) : ('monthly' as const),
      priority: route === '' ? 1 : 0.7,
    }))
  );

  const blogEntries: MetadataRoute.Sitemap = posts.flatMap((post) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  return [...staticEntries, ...blogEntries];
}
