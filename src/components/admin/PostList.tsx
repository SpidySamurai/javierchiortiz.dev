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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#dae2fd', margin: 0, fontFamily: 'var(--font-manrope, system-ui, sans-serif)' }}>
            Posts
          </h1>
          <p style={{ color: '#464554', fontSize: 13, margin: '4px 0 0' }}>
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 18px',
            background: 'linear-gradient(135deg, #8083ff 0%, #c0c1ff 100%)',
            color: '#0f0060',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(128,131,255,0.25)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
          New post
        </Link>
      </div>

      <div style={{ borderRadius: 14, border: '1px solid #222a3d', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ backgroundColor: '#131b2e' }}>
              {['Slug', 'Title', 'Category', 'Status', 'Actions'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 16px',
                    color: '#464554',
                    fontWeight: 600,
                    textAlign: 'left',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    fontSize: 11,
                    borderBottom: '1px solid #222a3d',
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
                  backgroundColor: i % 2 === 0 ? '#0d1525' : '#0b1326',
                  borderBottom: i < posts.length - 1 ? '1px solid #1a2340' : 'none',
                }}
              >
                <td style={{ padding: '12px 16px', color: '#908fa0', fontFamily: 'monospace', fontSize: 12 }}>
                  {post.slug}
                </td>
                <td style={{ padding: '12px 16px', color: '#dae2fd', maxWidth: 240 }}>
                  <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.title_en}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 600, background: '#171f33', color: '#908fa0' }}>
                    {post.category}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button
                    onClick={() => togglePublish(post)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 9999,
                      fontSize: 11,
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      background: post.is_published ? 'rgba(74,222,128,0.1)' : '#171f33',
                      color: post.is_published ? '#4ade80' : '#464554',
                    }}
                  >
                    {post.is_published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <Link href={`/admin/posts/${post.id}`} style={{ color: '#c0c1ff', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
                      Edit
                    </Link>
                    <button
                      onClick={() => deletePost(post.id)}
                      style={{ color: '#464554', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 0 }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#464554')}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 60, color: '#464554', textAlign: 'center' }}>
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
