'use client';

import { useState, useEffect, memo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { ICommand, ExecuteState, TextAreaTextApi } from '@uiw/react-md-editor';
import type { Post } from '@/types/database';
import MarkdownRenderer from '@/components/2026/blog/MarkdownRenderer';
import ImagePositionPicker from '@/components/admin/ImagePositionPicker';
import { BLOG_THEMES } from '@/data/blogThemes';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const PRESET_KEYS = Object.keys(BLOG_THEMES).filter((k) => k !== 'default') as string[];

type ThemeKey = keyof typeof BLOG_THEMES;

const ThemeColorPicker = memo(function ThemeColorPicker({
  colorKey,
  label,
  value,
  onCommit,
}: {
  colorKey: string;
  label: string;
  value: string;
  onCommit: (key: string, value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => {
    setDraft(value);
  }, [value]);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, cursor: 'pointer' }}>
      <span
        style={{
          fontSize: 11,
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="color"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={(e) => onCommit(colorKey, e.target.value)}
          style={{
            width: 36,
            height: 28,
            borderRadius: 4,
            border: '1px solid #1e1e2e',
            cursor: 'pointer',
            padding: 2,
            background: 'none',
          }}
        />
        <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>{draft}</span>
      </div>
    </label>
  );
});

type ThemeConfig = {
  bg: string;
  surface: string;
  primary: string;
  onSurface: string;
};

const DEFAULT_THEME: ThemeConfig = {
  bg: '#0b1326',
  surface: '#131b2e',
  primary: '#c0c1ff',
  onSurface: '#dae2fd',
};

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
  theme_config_enabled: boolean;
  theme_config: ThemeConfig;
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
  theme_config_enabled: false,
  theme_config: { ...DEFAULT_THEME },
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
          theme_config_enabled: !!post.theme_config,
          theme_config: post.theme_config
            ? { ...DEFAULT_THEME, ...post.theme_config }
            : { ...DEFAULT_THEME },
        }
      : EMPTY
  );

  const [tab, setTab] = useState<'en' | 'es'>('en');
  const [mode, setMode] = useState<'edit' | 'split' | 'blog'>('edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const youtubeCommand: ICommand = {
    name: 'youtube',
    keyCommand: 'youtube',
    buttonProps: { title: 'Insert YouTube embed', style: { fontSize: 13, padding: '4px 8px' } },
    icon: (
      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
        smart_display
      </span>
    ),
    execute: (_state: ExecuteState, api: TextAreaTextApi) => {
      const id = prompt('YouTube Video ID (e.g. dQw4w9WgXcQ):');
      if (!id?.trim()) return;
      api.replaceSelection(`\n::youtube[${id.trim()}]\n`);
    },
  };

  const setField = (key: keyof PostForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
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
      theme_config: form.theme_config_enabled ? form.theme_config : null,
      is_published: publish,
      published_at: publish ? post?.published_at ?? new Date().toISOString() : null,
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

  const activeTheme = form.theme_config_enabled ? form.theme_config : DEFAULT_THEME;

  const handleColorCommit = (key: string, value: string) =>
    setForm((f) => ({ ...f, theme_config: { ...f.theme_config, [key]: value } }));

  const handlePresetSelect = (key: string) => {
    const preset = BLOG_THEMES[key as ThemeKey];
    setForm((f) => ({
      ...f,
      cover_theme: key === 'default' ? '' : key,
      ...(f.theme_config_enabled && preset
        ? {
            theme_config: {
              bg: preset.bg,
              surface: preset.surface,
              primary: preset.primary,
              onSurface: preset.onSurface ?? DEFAULT_THEME.onSurface,
            },
          }
        : {}),
    }));
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
    <div style={{ maxWidth: mode === 'split' ? 1400 : 900 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', marginBottom: 24 }}>
        {post ? 'Edit post' : 'New post'}
      </h1>

      {/* Meta fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
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
          placeholder="YouTube ID for hero (optional)"
          value={form.youtube_id}
          onChange={setField('youtube_id')}
          style={inputStyle}
        />
        <input
          placeholder="Cover image URL (optional)"
          value={form.cover_image_url}
          onChange={setField('cover_image_url')}
          style={inputStyle}
        />
      </div>

      {/* Cover theme preset selector */}
      <div style={{ marginBottom: 16 }}>
        <span
          style={{
            fontSize: 11,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: 8,
          }}
        >
          Cover theme
        </span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['', ...PRESET_KEYS] as string[]).map((key) => {
            const preset = key ? BLOG_THEMES[key as ThemeKey] : null;
            const isActive = form.cover_theme === key;
            return (
              <button
                key={key || 'none'}
                onClick={() => handlePresetSelect(key || 'default')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: isActive ? '2px solid #c0c1ff' : '2px solid #1e1e2e',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 400,
                  background: preset ? preset.bg : '#12121a',
                  color: preset ? (preset.onSurface ?? '#f0f0f0') : '#94a3b8',
                  transition: 'border-color 0.15s',
                }}
              >
                {preset && (
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: preset.primary,
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                )}
                {key || 'None'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme color config */}
      <div
        style={{
          marginBottom: 16,
          padding: '12px 16px',
          background: '#12121a',
          borderRadius: 8,
          border: '1px solid #1e1e2e',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: form.theme_config_enabled ? 12 : 0,
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              color: '#94a3b8',
              fontSize: 13,
            }}
          >
            <input
              type="checkbox"
              checked={form.theme_config_enabled}
              onChange={(e) => setForm((f) => ({ ...f, theme_config_enabled: e.target.checked }))}
              style={{ accentColor: '#c0c1ff', width: 14, height: 14 }}
            />
            Custom theme colors
          </label>
          {form.theme_config_enabled && (
            <button
              onClick={() => setForm((f) => ({ ...f, theme_config: { ...DEFAULT_THEME } }))}
              style={{
                marginLeft: 'auto',
                fontSize: 11,
                color: '#64748b',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px 6px',
              }}
            >
              Reset to default
            </button>
          )}
        </div>
        {form.theme_config_enabled && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {(
              [
                ['bg', 'Background'],
                ['surface', 'Surface'],
                ['primary', 'Primary'],
                ['onSurface', 'Text'],
              ] as [keyof ThemeConfig, string][]
            ).map(([key, label]) => (
              <ThemeColorPicker
                key={key}
                colorKey={key}
                label={label}
                value={form.theme_config[key]}
                onCommit={handleColorCommit}
              />
            ))}
          </div>
        )}
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', gap: 4 }}>
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
        <div style={{ display: 'flex', gap: 4 }}>
          {(
            [
              ['edit', 'edit', 'Edit'],
              ['split', 'vertical_split', 'Split'],
              ['blog', 'visibility', 'Blog'],
            ] as const
          ).map(([m, icon, label]) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                background: mode === m ? '#3e3c8f' : '#1e1e2e',
                color: mode === m ? '#c0c1ff' : '#64748b',
                fontWeight: mode === m ? 700 : 400,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                {icon}
              </span>
              {label}
            </button>
          ))}
        </div>
      </div>

      <input
        placeholder={`Title (${tab.toUpperCase()})`}
        value={form[`title_${tab}`]}
        onChange={(e) => setForm((f) => ({ ...f, [`title_${tab}`]: e.target.value }))}
        style={{ ...inputStyle, marginBottom: 12 }}
      />
      <input
        placeholder={`Excerpt (${tab.toUpperCase()})`}
        value={form[`excerpt_${tab}`]}
        onChange={(e) => setForm((f) => ({ ...f, [`excerpt_${tab}`]: e.target.value }))}
        style={{ ...inputStyle, marginBottom: 12 }}
      />

      {mode === 'edit' && (
        <div data-color-mode="dark">
          <MDEditor
            value={currentContent}
            onChange={(v) => setForm((f) => ({ ...f, [`content_${tab}`]: v ?? '' }))}
            height={500}
            extraCommands={[youtubeCommand]}
          />
        </div>
      )}

      {mode === 'split' && (
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div data-color-mode="dark" style={{ flex: 1, minWidth: 0 }}>
            <MDEditor
              value={currentContent}
              onChange={(v) => setForm((f) => ({ ...f, [`content_${tab}`]: v ?? '' }))}
              height={600}
              extraCommands={[youtubeCommand]}
            />
          </div>
          <div
            style={
              {
                flex: 1,
                minWidth: 0,
                maxHeight: 600,
                overflowY: 'auto',
                background: activeTheme.bg,
                borderRadius: 8,
                '--ds-bg': activeTheme.bg,
                '--ds-surface': activeTheme.surface,
                '--ds-on-surface': activeTheme.onSurface,
                '--ds-on-surface-variant': '#c7c4d7',
                '--ds-primary': activeTheme.primary,
                '--ds-outline-variant': '#464554',
              } as React.CSSProperties
            }
          >
            {form.cover_image_url && (
              <div style={{ width: '100%', height: 200, overflow: 'hidden', flexShrink: 0 }}>
                <img
                  src={form.cover_image_url}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: form.cover_image_position_hero,
                  }}
                />
              </div>
            )}
            <div style={{ padding: '1.5rem' }}>
              {currentTitle && (
                <h1
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 900,
                    color: activeTheme.onSurface,
                    fontFamily: 'var(--font-manrope), sans-serif',
                    marginTop: 0,
                    marginBottom: '1rem',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                  }}
                >
                  {currentTitle}
                </h1>
              )}
              {currentContent ? (
                <MarkdownRenderer content={currentContent} />
              ) : (
                <p style={{ color: '#464554', fontStyle: 'italic' }}>No content yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {mode === 'blog' && (
        <div
          style={
            {
              minHeight: 400,
              background: activeTheme.bg,
              borderRadius: 8,
              overflow: 'hidden',
              '--ds-bg': activeTheme.bg,
              '--ds-surface': activeTheme.surface,
              '--ds-on-surface': activeTheme.onSurface,
              '--ds-on-surface-variant': '#c7c4d7',
              '--ds-primary': activeTheme.primary,
              '--ds-outline-variant': '#464554',
            } as React.CSSProperties
          }
        >
          {form.cover_image_url && (
            <div style={{ width: '100%', height: 280, overflow: 'hidden' }}>
              <img
                src={form.cover_image_url}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: form.cover_image_position_hero,
                }}
              />
            </div>
          )}
          <div style={{ padding: '2rem' }}>
            {currentTitle && (
              <h1
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: activeTheme.onSurface,
                  fontFamily: 'var(--font-manrope), sans-serif',
                  marginTop: 0,
                  marginBottom: '1.5rem',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                {currentTitle}
              </h1>
            )}
            {currentContent ? (
              <MarkdownRenderer content={currentContent} />
            ) : (
              <p style={{ color: '#464554', fontStyle: 'italic' }}>No content yet.</p>
            )}
          </div>
        </div>
      )}

      {error && <p style={{ color: '#f87171', fontSize: 13, marginTop: 12 }}>{error}</p>}

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
