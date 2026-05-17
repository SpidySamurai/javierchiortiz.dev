'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Post } from '@/types/database';

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>Posts</h1>
        <Link
          href="/admin/posts/new"
          style={{
            padding: '8px 16px',
            background: '#c0c1ff',
            color: '#0a0a0f',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          + New post
        </Link>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr
            style={{ borderBottom: '1px solid #1e1e2e', color: '#64748b', textAlign: 'left' }}
          >
            <th style={{ padding: '8px 12px', fontWeight: 500 }}>Slug</th>
            <th style={{ padding: '8px 12px', fontWeight: 500 }}>Title (EN)</th>
            <th style={{ padding: '8px 12px', fontWeight: 500 }}>Category</th>
            <th style={{ padding: '8px 12px', fontWeight: 500 }}>Status</th>
            <th style={{ padding: '8px 12px', fontWeight: 500 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} style={{ borderBottom: '1px solid #12121a' }}>
              <td
                style={{ padding: '10px 12px', color: '#94a3b8', fontFamily: 'monospace' }}
              >
                {post.slug}
              </td>
              <td style={{ padding: '10px 12px', color: '#e2e8f0' }}>{post.title_en}</td>
              <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{post.category}</td>
              <td style={{ padding: '10px 12px' }}>
                <button
                  onClick={() => togglePublish(post)}
                  style={{
                    padding: '3px 10px',
                    borderRadius: 9999,
                    fontSize: 12,
                    border: 'none',
                    cursor: 'pointer',
                    background: post.is_published ? 'rgba(22,163,74,0.13)' : '#1e1e2e',
                    color: post.is_published ? '#4ade80' : '#64748b',
                  }}
                >
                  {post.is_published ? 'Published' : 'Draft'}
                </button>
              </td>
              <td style={{ padding: '10px 12px' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Link
                    href={`/admin/posts/${post.id}`}
                    style={{ color: '#c0c1ff', textDecoration: 'none', fontSize: 13 }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deletePost(post.id)}
                    style={{
                      color: '#f87171',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 13,
                      padding: 0,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td
                colSpan={5}
                style={{ padding: 40, color: '#64748b', textAlign: 'center' }}
              >
                No posts yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
