import { createClient } from '@/lib/supabase/server';
import PostList from '@/components/admin/PostList';

export default async function PostsPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  return <PostList initialPosts={posts ?? []} />;
}
