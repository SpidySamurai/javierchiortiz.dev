'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Post } from '@/types/database';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

type PostForm = {
  slug: string;
  title_en: string;
  title_es: string;
  excerpt_en: string;
  excerpt_es: string;
  content_en: string;
  content_es: string;
  category: string;
  read_time: string;
  cover_theme: string;
  youtube_id: string;
};

const EMPTY: PostForm = {
  slug: '',
  title_en: '',
  title_es: '',
  excerpt_en: '',
  excerpt_es: '',
  content_en: '',
  content_es: '',
  category: 'General',
  read_time: '5 min read',
  cover_theme: '',
  youtube_id: '',
};

export default function PostEditor({ post }: { post?: Post }) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState<PostForm>(
    post
      ? {
          slug: post.slug,
          title_en: post.title_en,
          title_es: post.title_es,
          excerpt_en: post.excerpt_en ?? '',
          excerpt_es: post.excerpt_es ?? '',
          content_en: post.content_en ?? '',
          content_es: post.content_es ?? '',
          category: post.category,
          read_time: post.read_time,
          cover_theme: post.cover_theme ?? '',
          youtube_id: post.youtube_id ?? '',
        }
      : EMPTY
  );

  const [tab, setTab] = useState<'en' | 'es'>('en');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const setField =
    (key: keyof PostForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async (publish: boolean) => {
    if (!form.slug || !form.title_en || !form.title_es) {
      setError('Slug, title EN, and title ES are required.');
      return;
    }
    setSaving(true);
    setError('');

    const payload = {
      slug: form.slug,
      title_en: form.title_en,
      title_es: form.title_es,
      excerpt_en: form.excerpt_en || null,
      excerpt_es: form.excerpt_es || null,
      content_en: form.content_en || null,
      content_es: form.content_es || null,
      category: form.category,
      read_time: form.read_time,
      cover_theme: form.cover_theme || null,
      youtube_id: form.youtube_id || null,
      is_published: publish,
      published_at: publish ? (post?.published_at ?? new Date().toISOString()) : null,
    };

    const { error: dbError } = post
      ? await supabase.from('posts').update(payload).eq('id', post.id)
      : await supabase.from('posts').insert(payload);

    if (dbError) {
      setError(dbError.message);
      setSaving(false);
      return;
    }
    router.push('/admin/posts');
    router.refresh();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    background: '#12121a',
    border: '1px solid #1e1e2e',
    borderRadius: 8,
    color: '#e2e8f0',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', marginBottom: 24 }}>
        {post ? 'Edit post' : 'New post'}
      </h1>

      {/* Meta fields */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <input
          placeholder="slug (e.g. my-first-post)"
          value={form.slug}
          onChange={setField('slug')}
          style={inputStyle}
          disabled={!!post}
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={setField('category')}
          style={inputStyle}
        />
        <input
          placeholder="Read time (e.g. 5 min read)"
          value={form.read_time}
          onChange={setField('read_time')}
          style={inputStyle}
        />
        <input
          placeholder="cover_theme (pilots / spiderman / karate or blank)"
          value={form.cover_theme}
          onChange={setField('cover_theme')}
          style={inputStyle}
        />
        <input
          placeholder="YouTube ID (optional)"
          value={form.youtube_id}
          onChange={setField('youtube_id')}
          style={inputStyle}
        />
      </div>

      {/* Language tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {(['en', 'es'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setTab(l)}
            style={{
              padding: '6px 16px',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              background: tab === l ? '#c0c1ff' : '#1e1e2e',
              color: tab === l ? '#0a0a0f' : '#94a3b8',
              fontWeight: tab === l ? 700 : 400,
            }}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Per-language fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          placeholder={`Title (${tab.toUpperCase()})`}
          value={form[`title_${tab}`]}
          onChange={(e) => setForm((f) => ({ ...f, [`title_${tab}`]: e.target.value }))}
          style={inputStyle}
        />
        <input
          placeholder={`Excerpt (${tab.toUpperCase()})`}
          value={form[`excerpt_${tab}`]}
          onChange={(e) => setForm((f) => ({ ...f, [`excerpt_${tab}`]: e.target.value }))}
          style={inputStyle}
        />
        <div data-color-mode="dark">
          <MDEditor
            value={form[`content_${tab}`]}
            onChange={(v) => setForm((f) => ({ ...f, [`content_${tab}`]: v ?? '' }))}
            height={400}
          />
        </div>
      </div>

      {error && (
        <p style={{ color: '#f87171', fontSize: 13, marginTop: 12 }}>{error}</p>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          style={{
            padding: '10px 20px',
            background: '#1e1e2e',
            color: '#94a3b8',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Save draft
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          style={{
            padding: '10px 20px',
            background: '#c0c1ff',
            color: '#0a0a0f',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {saving ? 'Saving…' : 'Publish'}
        </button>
      </div>
    </div>
  );
}
