'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { ICommand, ExecuteState, TextAreaTextApi } from '@uiw/react-md-editor';
import type { Post } from '@/types/database';
import MarkdownRenderer from '@/components/2026/blog/MarkdownRenderer';
import ImagePositionPicker from '@/components/admin/ImagePositionPicker';

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
  cover_image_url: string;
  cover_image_position_card: string;
  cover_image_position_hero: string;
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
  cover_image_url: '',
  cover_image_position_card: '50% 50%',
  cover_image_position_hero: '50% 50%',
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
          cover_image_url: post.cover_image_url ?? '',
          cover_image_position_card: post.cover_image_position_card ?? '50% 50%',
          cover_image_position_hero: post.cover_image_position_hero ?? '50% 50%',
        }
      : EMPTY
  );

  const [tab, setTab] = useState<'en' | 'es'>('en');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const youtubeCommand: ICommand = {
    name: 'youtube',
    keyCommand: 'youtube',
    buttonProps: { title: 'Insert YouTube embed', style: { fontSize: 13, padding: '4px 8px' } },
    icon: <span>▶ YT</span>,
    execute: (_state: ExecuteState, api: TextAreaTextApi) => {
      const id = prompt('YouTube Video ID (e.g. dQw4w9WgXcQ):');
      if (!id?.trim()) return;
      api.replaceSelection(`\n::youtube[${id.trim()}]\n`);
    },
  };

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
      cover_image_url: form.cover_image_url || null,
      cover_image_position_card: form.cover_image_position_card || null,
      cover_image_position_hero: form.cover_image_position_hero || null,
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

  const currentContent = form[`content_${tab}`];
  const currentTitle = form[`title_${tab}`];

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', marginBottom: 24 }}>
        {post ? 'Edit post' : 'New post'}
      </h1>

      {/* Meta fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <input placeholder="slug (e.g. my-first-post)" value={form.slug} onChange={setField('slug')} style={inputStyle} disabled={!!post} />
        <input placeholder="Category" value={form.category} onChange={setField('category')} style={inputStyle} />
        <input placeholder="Read time (e.g. 5 min read)" value={form.read_time} onChange={setField('read_time')} style={inputStyle} />
        <input placeholder="cover_theme (pilots / spiderman / karate or blank)" value={form.cover_theme} onChange={setField('cover_theme')} style={inputStyle} />
        <input placeholder="YouTube ID for hero (optional)" value={form.youtube_id} onChange={setField('youtube_id')} style={inputStyle} />
        <input placeholder="Cover image URL (optional)" value={form.cover_image_url} onChange={setField('cover_image_url')} style={inputStyle} />
      </div>

      {/* Image position pickers — only when URL is set */}
      {form.cover_image_url && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <ImagePositionPicker
            src={form.cover_image_url}
            value={form.cover_image_position_card}
            onChange={(pos) => setForm((f) => ({ ...f, cover_image_position_card: pos }))}
            label="Card position (listing view)"
            previewHeight={200}
          />
          <ImagePositionPicker
            src={form.cover_image_url}
            value={form.cover_image_position_hero}
            onChange={(pos) => setForm((f) => ({ ...f, cover_image_position_hero: pos }))}
            label="Hero position (post view)"
            previewHeight={200}
          />
        </div>
      )}

      {/* Language + mode tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['en', 'es'] as const).map((l) => (
            <button key={l} onClick={() => setTab(l)} style={{ padding: '6px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, background: tab === l ? '#c0c1ff' : '#1e1e2e', color: tab === l ? '#0a0a0f' : '#94a3b8', fontWeight: tab === l ? 700 : 400 }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['edit', 'preview'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, background: mode === m ? '#3e3c8f' : '#1e1e2e', color: mode === m ? '#c0c1ff' : '#64748b', fontWeight: mode === m ? 700 : 400, textTransform: 'capitalize' }}>
              {m === 'edit' ? '✏ Edit' : '👁 Preview'}
            </button>
          ))}
        </div>
      </div>

      <input placeholder={`Title (${tab.toUpperCase()})`} value={form[`title_${tab}`]} onChange={(e) => setForm((f) => ({ ...f, [`title_${tab}`]: e.target.value }))} style={{ ...inputStyle, marginBottom: 12 }} />
      <input placeholder={`Excerpt (${tab.toUpperCase()})`} value={form[`excerpt_${tab}`]} onChange={(e) => setForm((f) => ({ ...f, [`excerpt_${tab}`]: e.target.value }))} style={{ ...inputStyle, marginBottom: 12 }} />

      {mode === 'edit' && (
        <div data-color-mode="dark">
          <MDEditor value={currentContent} onChange={(v) => setForm((f) => ({ ...f, [`content_${tab}`]: v ?? '' }))} height={400} extraCommands={[youtubeCommand]} />
        </div>
      )}

      {mode === 'preview' && (
        <div
          style={{
            minHeight: 400,
            background: '#0b1326',
            borderRadius: 8,
            overflow: 'hidden',
            '--ds-bg': '#0b1326',
            '--ds-surface': '#131b2e',
            '--ds-on-surface': '#dae2fd',
            '--ds-on-surface-variant': '#c7c4d7',
            '--ds-primary': '#c0c1ff',
            '--ds-outline-variant': '#464554',
          } as React.CSSProperties}
        >
          {/* Hero preview */}
          {form.cover_image_url && (
            <div style={{ width: '100%', height: 280, overflow: 'hidden' }}>
              <img
                src={form.cover_image_url}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: form.cover_image_position_hero }}
              />
            </div>
          )}
          <div style={{ padding: '2rem' }}>
            {currentTitle && (
              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#dae2fd', fontFamily: 'var(--font-manrope), sans-serif', marginTop: 0, marginBottom: '1.5rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {currentTitle}
              </h1>
            )}
            {currentContent
              ? <MarkdownRenderer content={currentContent} />
              : <p style={{ color: '#464554', fontStyle: 'italic' }}>No content yet.</p>
            }
          </div>
        </div>
      )}

      {error && <p style={{ color: '#f87171', fontSize: 13, marginTop: 12 }}>{error}</p>}

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <button onClick={() => handleSave(false)} disabled={saving} style={{ padding: '10px 20px', background: '#1e1e2e', color: '#94a3b8', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
          Save draft
        </button>
        <button onClick={() => handleSave(true)} disabled={saving} style={{ padding: '10px 20px', background: '#c0c1ff', color: '#0a0a0f', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
          {saving ? 'Saving…' : 'Publish'}
        </button>
      </div>
    </div>
  );
}
