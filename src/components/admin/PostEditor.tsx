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
import SectionHeader from '@/app/admin/_components/SectionHeader';

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
    <label className="flex flex-col gap-1.5 cursor-pointer">
      <span
        className="text-[11px] uppercase tracking-[0.08em]"
        style={{ color: 'var(--ds-outline-variant)' }}
      >
        {label}
      </span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={(e) => onCommit(colorKey, e.target.value)}
          className="w-9 h-7 rounded cursor-pointer p-0.5 bg-transparent"
          style={{ border: '1px solid var(--ds-surface-high)' }}
        />
        <span className="text-[12px] font-mono" style={{ color: 'var(--ds-outline)' }}>{draft}</span>
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

  const inputClass = 'w-full px-3 py-2 rounded-lg text-[14px] outline-none box-border';
  const inputStyle: React.CSSProperties = {
    background: 'var(--ds-surface-container)',
    border: '1px solid var(--ds-surface-high)',
    color: 'var(--ds-on-surface)',
  };

  const currentContent = form[`content_${tab}`];
  const currentTitle = form[`title_${tab}`];

  return (
    <div style={{ maxWidth: mode === 'split' ? 1400 : 900 }}>
      <div className="mb-6">
        <SectionHeader
          eyebrow="Content"
          title={post ? 'Edit' : 'New'}
          accent="Post"
        />
      </div>

      {/* Meta fields */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <input
          placeholder="slug (e.g. my-first-post)"
          value={form.slug}
          onChange={setField('slug')}
          className={inputClass}
          style={inputStyle}
          disabled={!!post}
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={setField('category')}
          className={inputClass}
          style={inputStyle}
        />
        <input
          placeholder="Read time (e.g. 5 min read)"
          value={form.read_time}
          onChange={setField('read_time')}
          className={inputClass}
          style={inputStyle}
        />
        <input
          placeholder="YouTube ID for hero (optional)"
          value={form.youtube_id}
          onChange={setField('youtube_id')}
          className={inputClass}
          style={inputStyle}
        />
        <input
          placeholder="Cover image URL (optional)"
          value={form.cover_image_url}
          onChange={setField('cover_image_url')}
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* Cover theme preset selector */}
      <div className="mb-4">
        <span
          className="text-[11px] uppercase tracking-[0.08em] block mb-2"
          style={{ color: 'var(--ds-outline-variant)' }}
        >
          Cover theme
        </span>
        <div className="flex gap-2 flex-wrap">
          {(['', ...PRESET_KEYS] as string[]).map((key) => {
            const preset = key ? BLOG_THEMES[key as ThemeKey] : null;
            const isActive = form.cover_theme === key;
            return (
              <button
                key={key || 'none'}
                onClick={() => handlePresetSelect(key || 'default')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-md text-[13px] cursor-pointer transition-[border-color] duration-150"
                style={{
                  border: isActive ? '2px solid var(--ds-primary)' : '2px solid var(--ds-surface-high)',
                  fontWeight: isActive ? 700 : 400,
                  background: preset ? preset.bg : 'var(--ds-surface-container)',
                  color: preset ? (preset.onSurface ?? 'var(--ds-on-surface)') : 'var(--ds-outline)',
                }}
              >
                {preset && (
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                    style={{ background: preset.primary }}
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
        className="mb-4 px-4 py-3 rounded-lg"
        style={{
          background: 'var(--ds-surface-container)',
          border: '1px solid var(--ds-surface-high)',
        }}
      >
        <div className={`flex items-center gap-2.5 ${form.theme_config_enabled ? 'mb-3' : ''}`}>
          <label
            className="flex items-center gap-2 cursor-pointer text-[13px]"
            style={{ color: 'var(--ds-outline)' }}
          >
            <input
              type="checkbox"
              checked={form.theme_config_enabled}
              onChange={(e) => setForm((f) => ({ ...f, theme_config_enabled: e.target.checked }))}
              className="w-3.5 h-3.5"
              style={{ accentColor: 'var(--ds-primary)' }}
            />
            Custom theme colors
          </label>
          {form.theme_config_enabled && (
            <button
              onClick={() => setForm((f) => ({ ...f, theme_config: { ...DEFAULT_THEME } }))}
              className="ml-auto text-[11px] bg-transparent border-none cursor-pointer px-1.5 py-0.5"
              style={{ color: 'var(--ds-outline-variant)' }}
            >
              Reset to default
            </button>
          )}
        </div>
        {form.theme_config_enabled && (
          <div className="grid grid-cols-4 gap-3">
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

      {/* Image position pickers */}
      {form.cover_image_url && (
        <div className="grid grid-cols-2 gap-4 mb-5">
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
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-1">
          {(['en', 'es'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setTab(l)}
              className="px-4 py-1.5 rounded-md border-none cursor-pointer text-[13px]"
              style={{
                background: tab === l ? 'var(--ds-primary)' : 'var(--ds-surface-high)',
                color: tab === l ? 'var(--ds-on-primary)' : 'var(--ds-outline)',
                fontWeight: tab === l ? 700 : 400,
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border-none cursor-pointer text-[12px]"
              style={{
                background: mode === m ? 'var(--ds-secondary-container)' : 'var(--ds-surface-high)',
                color: mode === m ? 'var(--ds-on-secondary)' : 'var(--ds-outline-variant)',
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
        className={`${inputClass} mb-3`}
        style={inputStyle}
      />
      <input
        placeholder={`Excerpt (${tab.toUpperCase()})`}
        value={form[`excerpt_${tab}`]}
        onChange={(e) => setForm((f) => ({ ...f, [`excerpt_${tab}`]: e.target.value }))}
        className={`${inputClass} mb-3`}
        style={inputStyle}
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
        <div className="flex gap-4 items-start">
          <div data-color-mode="dark" className="flex-1 min-w-0">
            <MDEditor
              value={currentContent}
              onChange={(v) => setForm((f) => ({ ...f, [`content_${tab}`]: v ?? '' }))}
              height={600}
              extraCommands={[youtubeCommand]}
            />
          </div>
          <div
            className="flex-1 min-w-0 max-h-[600px] overflow-y-auto rounded-lg"
            style={
              {
                background: activeTheme.bg,
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
              <div className="w-full h-[200px] overflow-hidden shrink-0">
                <img
                  src={form.cover_image_url}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ objectPosition: form.cover_image_position_hero }}
                />
              </div>
            )}
            <div className="p-6">
              {currentTitle && (
                <h1
                  className="text-[1.75rem] font-black mt-0 mb-4 tracking-tight leading-[1.1]"
                  style={{ color: activeTheme.onSurface, fontFamily: 'var(--font-manrope), sans-serif' }}
                >
                  {currentTitle}
                </h1>
              )}
              {currentContent ? (
                <MarkdownRenderer content={currentContent} />
              ) : (
                <p className="italic" style={{ color: 'var(--ds-outline-variant)' }}>No content yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {mode === 'blog' && (
        <div
          className="min-h-[400px] rounded-lg overflow-hidden"
          style={
            {
              background: activeTheme.bg,
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
            <div className="w-full h-[280px] overflow-hidden">
              <img
                src={form.cover_image_url}
                alt=""
                className="w-full h-full object-cover"
                style={{ objectPosition: form.cover_image_position_hero }}
              />
            </div>
          )}
          <div className="p-8">
            {currentTitle && (
              <h1
                className="text-[2.5rem] font-black mt-0 mb-6 tracking-tight leading-[1.1]"
                style={{ color: activeTheme.onSurface, fontFamily: 'var(--font-manrope), sans-serif' }}
              >
                {currentTitle}
              </h1>
            )}
            {currentContent ? (
              <MarkdownRenderer content={currentContent} />
            ) : (
              <p className="italic" style={{ color: 'var(--ds-outline-variant)' }}>No content yet.</p>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-[13px] mt-3" style={{ color: '#f87171' }}>{error}</p>}

      <div className="flex gap-3 mt-5">
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="px-5 py-2.5 rounded-lg border-none cursor-pointer text-[14px]"
          style={{ background: 'var(--ds-surface-high)', color: 'var(--ds-outline)' }}
        >
          Save draft
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="px-5 py-2.5 rounded-lg border-none cursor-pointer text-[14px] font-bold"
          style={{ background: 'var(--ds-primary)', color: 'var(--ds-on-primary)' }}
        >
          {saving ? 'Saving…' : 'Publish'}
        </button>
      </div>
    </div>
  );
}
