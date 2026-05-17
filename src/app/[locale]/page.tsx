import { getPublishedPosts } from '@/lib/blogQueries';
import HomeShell from '@/components/2026/layout/HomeShell';

export default async function Home() {
  const posts = await getPublishedPosts();
  return <HomeShell posts={posts} />;
}
