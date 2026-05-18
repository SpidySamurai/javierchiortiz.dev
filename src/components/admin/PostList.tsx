'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Post } from '@/types/database';
import SectionHeader from '@/app/admin/_components/SectionHeader';

export default function PostList({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const supabase = createClient();

  const togglePublish = async (post: Post) => {
    const next = !post.is_published;
    const update = next
      ? { is_published: true, published_at: new Date().toISOString() }
      : { is_published: false, published_at: null };
    const { error } = await supabase.from('posts').update(update).eq('id', post.id);
    if (!error) setPosts((p) => p.map((pp) => (pp.id === post.id ? { ...pp, ...update } : pp)));
  };

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    await supabase.from('posts').delete().eq('id', id);
    setPosts((p) => p.filter((pp) => pp.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-7">
        <SectionHeader
          eyebrow="Content"
          title="All"
          accent="Posts"
          subtitle={`${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`}
        />
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-1.5 px-[18px] py-[9px] rounded-[10px] text-[13px] font-bold no-underline"
          style={{
            background: 'linear-gradient(135deg, var(--ds-primary-container) 0%, var(--ds-primary) 100%)',
            color: '#0f0060',
            boxShadow: '0 4px 12px color-mix(in srgb, var(--ds-primary-container) 25%, transparent)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
          New post
        </Link>
      </div>

      <div className="rounded-[14px] overflow-hidden" style={{ border: '1px solid var(--ds-surface-high)' }}>
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr style={{ backgroundColor: 'var(--ds-surface)' }}>
              {['Slug', 'Title', 'Category', 'Status', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 font-semibold text-left uppercase tracking-[0.05em] text-[11px]"
                  style={{
                    color: 'var(--ds-outline-variant)',
                    borderBottom: '1px solid var(--ds-surface-high)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.map((post, i) => (
              <tr
                key={post.id}
                style={{
                  backgroundColor: i % 2 === 0 ? '#0d1525' : 'var(--ds-bg)',
                  borderBottom: i < posts.length - 1 ? '1px solid #1a2340' : 'none',
                }}
              >
                <td className="px-4 py-3 font-mono text-[12px]" style={{ color: 'var(--ds-outline)' }}>
                  {post.slug}
                </td>
                <td className="px-4 py-3 max-w-[240px]" style={{ color: 'var(--ds-on-surface)' }}>
                  <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                    {post.title_en}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                    style={{ background: 'var(--ds-surface-container)', color: 'var(--ds-outline)' }}
                  >
                    {post.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => togglePublish(post)}
                    className="px-3 py-1 rounded-full text-[11px] font-bold border-none cursor-pointer"
                    style={{
                      background: post.is_published ? 'rgba(74,222,128,0.1)' : 'var(--ds-surface-container)',
                      color: post.is_published ? '#4ade80' : 'var(--ds-outline-variant)',
                    }}
                  >
                    {post.is_published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-4">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="no-underline text-[13px] font-medium"
                      style={{ color: 'var(--ds-primary)' }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="border-none bg-transparent cursor-pointer text-[13px] p-0 transition-colors duration-100"
                      style={{ color: 'var(--ds-outline-variant)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ds-outline-variant)')}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="py-[60px] text-center" style={{ color: 'var(--ds-outline-variant)' }}>
                  No posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
