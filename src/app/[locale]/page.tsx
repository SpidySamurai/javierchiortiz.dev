import type { Metadata } from 'next';
import { getPublishedPosts } from '@/lib/blogQueries';
import HomeShell from '@/components/2026/layout/HomeShell';
import { getSidebarCollapsed } from '@/lib/sidebarState';

const BASE_URL = 'https://javierchiortiz.dev';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        en: `${BASE_URL}/en`,
        es: `${BASE_URL}/es`,
        'x-default': `${BASE_URL}/en`,
      },
    },
  };
}

export default async function Home() {
  const [posts, sidebarCollapsed] = await Promise.all([getPublishedPosts(), getSidebarCollapsed()]);
  return <HomeShell posts={posts} sidebarCollapsed={sidebarCollapsed} />;
}
