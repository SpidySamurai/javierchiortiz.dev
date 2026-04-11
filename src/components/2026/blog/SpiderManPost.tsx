import type { BlogPost } from '@/data/blog';
import BlogPostLayout from './BlogPostLayout';

export default function SpiderManPost({ post, locale }: { post: BlogPost; locale: string }) {
  return <BlogPostLayout post={post} locale={locale} />;
}
