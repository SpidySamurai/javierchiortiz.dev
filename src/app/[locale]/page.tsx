import { getPublishedPosts } from '@/lib/blogQueries';
import HomeShell from '@/components/2026/layout/HomeShell';
import { getSidebarCollapsed } from '@/lib/sidebarState';

export default async function Home() {
  const [posts, sidebarCollapsed] = await Promise.all([getPublishedPosts(), getSidebarCollapsed()]);
  return <HomeShell posts={posts} sidebarCollapsed={sidebarCollapsed} />;
}
