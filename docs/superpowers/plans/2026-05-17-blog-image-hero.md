# Blog Cover Image & Drag Position Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add cover image support to blog posts with an independent drag-to-focal-point picker for card and hero views, wired into the admin editor and the public blog renderer.

**Architecture:** A standalone `ImagePositionPicker` client component handles drag logic and outputs a CSS `object-position` string. `MarkdownPost` gains a hero section that renders either a cover image (URL + position) or a `BlogCover` theme. `BlogCard` gains optional image support alongside the existing theme covers. `PostEditor` gains three new fields (`cover_image_url`, `cover_image_position_card`, `cover_image_position_hero`) and two pickers shown when a URL is entered. The admin preview panel already exists — it just needs the hero prepended.

**Tech Stack:** React 19, Next.js 15 App Router, TypeScript, inline styles (design system CSS vars), no new npm packages.

---

## File Map

| Action | Path                                           | Responsibility                                                                      |
| ------ | ---------------------------------------------- | ----------------------------------------------------------------------------------- |
| Create | `src/components/admin/ImagePositionPicker.tsx` | Drag-to-focal-point UI, outputs CSS `object-position` string                        |
| Modify | `src/components/2026/blog/MarkdownPost.tsx`    | Add hero section (image or BlogCover) above article header                          |
| Modify | `src/components/2026/ui/BlogCard.tsx`          | Support `coverImageUrl` + `coverImagePositionCard` alongside existing theme         |
| Modify | `src/app/[locale]/blog/page.tsx`               | Pass new image fields from Supabase `Post` to `BlogCard`                            |
| Modify | `src/components/admin/PostEditor.tsx`          | Add `cover_image_url` input + two `ImagePositionPicker` instances + hero in preview |

---

### Task 1: ImagePositionPicker component

**Files:**

- Create: `src/components/admin/ImagePositionPicker.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client';

import { useRef, useCallback } from 'react';

interface Props {
  src: string;
  value: string; // CSS object-position e.g. "50% 30%"
  onChange: (pos: string) => void;
  label: string;
  previewHeight: number; // px — 200 for card, 420 for hero
}

export default function ImagePositionPicker({ src, value, onChange, label, previewHeight }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const calcPos = useCallback(
    (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = Math.round(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
      const y = Math.round(Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100)));
      onChange(`${x}% ${y}%`);
    },
    [onChange]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      calcPos(e.clientX, e.clientY);

      const onMove = (ev: MouseEvent) => calcPos(ev.clientX, ev.clientY);
      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [calcPos]
  );

  // Parse "50% 30%" → { x: 50, y: 30 }
  const [xStr, yStr] = value.split(' ');
  const dotX = parseFloat(xStr ?? '50');
  const dotY = parseFloat(yStr ?? '50');

  return (
    <div style={{ marginBottom: 16 }}>
      <span style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>
        {label}
      </span>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        style={{
          position: 'relative',
          width: '100%',
          height: previewHeight,
          borderRadius: 8,
          overflow: 'hidden',
          cursor: 'crosshair',
          userSelect: 'none',
        }}
      >
        <img
          src={src}
          alt=""
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: value,
            pointerEvents: 'none',
          }}
        />
        {/* Grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '25% 25%',
            pointerEvents: 'none',
          }}
        />
        {/* Focal point dot */}
        <div
          style={{
            position: 'absolute',
            left: `${dotX}%`,
            top: `${dotY}%`,
            transform: 'translate(-50%, -50%)',
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#c0c1ff',
            boxShadow: '0 0 0 2px rgba(0,0,0,0.5), 0 0 0 4px rgba(192,193,255,0.4)',
            pointerEvents: 'none',
          }}
        />
      </div>
      <span style={{ fontSize: 11, color: '#464554', marginTop: 4, display: 'block' }}>
        {value}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
cd /home/javier/work-area/personal-projects/web-portfolio2025
pnpm tsc --noEmit 2>&1 | grep -v node_modules | grep ImagePositionPicker
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/ImagePositionPicker.tsx
git commit -m "feat(admin): add ImagePositionPicker drag-to-focal-point component"
```

---

### Task 2: Hero section in MarkdownPost

**Files:**

- Modify: `src/components/2026/blog/MarkdownPost.tsx`

- [ ] **Step 1: Replace file**

```tsx
import type { Post } from '@/types/database';
import Header from '@/components/2026/layout/Header';
import Sidebar from '@/components/2026/layout/Sidebar';
import MarkdownRenderer from '@/components/2026/blog/MarkdownRenderer';
import BlogCover from '@/components/2026/ui/BlogCover';
import Link from 'next/link';

export default function MarkdownPost({ post, locale }: { post: Post; locale: string }) {
  const title = locale === 'es' ? post.title_es : post.title_en;
  const content = locale === 'es' ? post.content_es : post.content_en;
  const hasImageHero = !!post.cover_image_url;
  const hasThemeHero = !!post.cover_theme && !hasImageHero;

  return (
    <div className="ds-2026" style={{ minHeight: '100vh', backgroundColor: 'var(--ds-bg)' }}>
      <Header />
      <Sidebar />
      <main className="xl:ml-64 pt-20">
        {/* Hero */}
        {hasImageHero && (
          <div style={{ width: '100%', height: 420, overflow: 'hidden' }}>
            <img
              src={post.cover_image_url!}
              alt={title ?? ''}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: post.cover_image_position_hero ?? '50% 50%',
              }}
            />
          </div>
        )}
        {hasThemeHero && (
          <BlogCover theme={post.cover_theme as 'pilots' | 'spiderman' | 'karate'} height="420px" />
        )}

        <article className="max-w-3xl mx-auto px-8 py-16">
          {/* Back */}
          <Link
            href={`/${locale}/blog`}
            style={{
              display: 'inline-block',
              marginBottom: '2rem',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--ds-outline)',
              fontFamily: 'var(--font-inter), sans-serif',
              textDecoration: 'none',
            }}
          >
            ← Blog
          </Link>

          <header className="mb-12 space-y-4">
            <span
              className="text-xs uppercase tracking-[0.3em] font-bold"
              style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {post.category}
            </span>
            <h1
              className="text-4xl md:text-5xl font-black tracking-tight leading-tight"
              style={{
                color: 'var(--ds-on-surface)',
                fontFamily: 'var(--font-manrope), sans-serif',
              }}
            >
              {title}
            </h1>
            <p className="text-sm" style={{ color: 'var(--ds-on-surface-variant)' }}>
              {post.read_time}
              {post.published_at && (
                <>
                  {' '}
                  &middot; {new Date(post.published_at).toLocaleDateString(
                    locale === 'es' ? 'es-MX' : 'en-US',
                    { month: 'long', day: 'numeric', year: 'numeric' }
                  )}
                </>
              )}
            </p>
          </header>

          <MarkdownRenderer content={content ?? ''} />
        </article>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
pnpm tsc --noEmit 2>&1 | grep -v node_modules | grep MarkdownPost
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/2026/blog/MarkdownPost.tsx
git commit -m "feat(blog): add hero section to MarkdownPost (image or BlogCover theme)"
```

---

### Task 3: Cover image support in BlogCard

**Files:**

- Modify: `src/components/2026/ui/BlogCard.tsx`
- Modify: `src/app/[locale]/blog/page.tsx`

- [ ] **Step 1: Update BlogCard to accept optional image fields**

Replace `src/components/2026/ui/BlogCard.tsx`:

```tsx
'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import BlogCover from './BlogCover';
import { getTheme } from '@/data/blogThemes';

interface BlogCardPost {
  slug: string;
  date: string;
  category: string;
  readTime: string;
  coverTheme: 'pilots' | 'spiderman' | 'karate';
  theme?: string;
  title?: string;
  excerpt?: string;
  coverImageUrl?: string | null;
  coverImagePositionCard?: string | null;
}

interface BlogCardProps {
  post: BlogCardPost;
  locale: string;
}

export default function BlogCard({ post, locale }: BlogCardProps) {
  const tb = useTranslations('blog');
  const title = post.title ?? tb(`${post.slug}.title`);
  const excerpt = post.excerpt ?? tb(`${post.slug}.excerpt`);
  const theme = getTheme(post.theme);

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group block rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: 'var(--ds-surface-container)',
        boxShadow: `0 0 0 1px color-mix(in srgb, ${theme.primary} 15%, transparent)`,
      }}
    >
      {/* Cover */}
      {post.coverImageUrl ? (
        <div style={{ width: '100%', height: 200, overflow: 'hidden' }}>
          <img
            src={post.coverImageUrl}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: post.coverImagePositionCard ?? '50% 50%',
            }}
          />
        </div>
      ) : (
        <BlogCover theme={post.coverTheme} height="200px" />
      )}

      {/* Content */}
      <div className="p-6 space-y-3">
        <span
          className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
          style={{
            backgroundColor: `color-mix(in srgb, ${theme.primary} 12%, transparent)`,
            color: theme.primary,
          }}
        >
          {post.category}
        </span>

        <h3
          className="text-xl font-black leading-tight group-hover:text-[color:var(--ds-primary)] transition-colors duration-200"
          style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
        >
          {title}
        </h3>

        <p
          className="text-sm leading-relaxed line-clamp-3"
          style={{
            color: 'var(--ds-on-surface-variant)',
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          {excerpt}
        </p>

        <div className="flex items-center justify-between pt-2">
          <div
            className="flex items-center gap-3 text-xs"
            style={{ color: 'var(--ds-outline)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
          <span
            className="text-xs font-bold transition-colors duration-200 group-hover:translate-x-1 inline-block transition-transform"
            style={{ color: theme.primary, fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Read →
          </span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Update adaptPost in blog/page.tsx to pass image fields**

In `src/app/[locale]/blog/page.tsx`, update the `adaptPost` function:

```tsx
function adaptPost(post: Post, locale: string) {
  return {
    slug: post.slug,
    date: post.published_at
      ? new Date(post.published_at).toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', {
          month: 'long',
          year: 'numeric',
        })
      : '',
    category: post.category,
    readTime: post.read_time,
    coverTheme: (post.cover_theme ?? 'pilots') as 'pilots' | 'spiderman' | 'karate',
    theme: post.cover_theme ?? undefined,
    title: locale === 'es' ? post.title_es : post.title_en,
    excerpt: (locale === 'es' ? post.excerpt_es : post.excerpt_en) ?? undefined,
    coverImageUrl: post.cover_image_url,
    coverImagePositionCard: post.cover_image_position_card,
  };
}
```

- [ ] **Step 3: TypeScript check**

```bash
pnpm tsc --noEmit 2>&1 | grep -v node_modules | grep -E "BlogCard|blog/page"
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/components/2026/ui/BlogCard.tsx src/app/\[locale\]/blog/page.tsx
git commit -m "feat(blog): support cover_image_url in BlogCard listing with per-card object-position"
```

---

### Task 4: Wire image fields + pickers into PostEditor

**Files:**

- Modify: `src/components/admin/PostEditor.tsx`

This task adds three new form fields to `PostForm` and the corresponding UI: a URL input, and two `ImagePositionPicker` instances (one for card, one for hero) that appear only when a URL is set. The admin preview panel already exists — this task also prepends the hero image to it.

- [ ] **Step 1: Read the current PostEditor**

```bash
cat src/components/admin/PostEditor.tsx
```

- [ ] **Step 2: Apply all changes to PostEditor**

The changes are:

1. Add `ImagePositionPicker` import
2. Add three fields to `PostForm` type: `cover_image_url`, `cover_image_position_card`, `cover_image_position_hero`
3. Add those fields to `EMPTY` constant with defaults `''`, `'50% 50%'`, `'50% 50%'`
4. Add those fields to the `post ?` initializer block
5. Add those fields to the save `payload`
6. Add `cover_image_url` input in the meta fields grid
7. After the meta grid, add picker section (only when `form.cover_image_url` is set)
8. In preview panel, prepend hero image if `form.cover_image_url` is set

Full file after changes:

```tsx
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
          {(['edit', 'preview'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                background: mode === m ? '#3e3c8f' : '#1e1e2e',
                color: mode === m ? '#c0c1ff' : '#64748b',
                fontWeight: mode === m ? 700 : 400,
                textTransform: 'capitalize',
              }}
            >
              {m === 'edit' ? '✏ Edit' : '👁 Preview'}
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
            height={400}
            extraCommands={[youtubeCommand]}
          />
        </div>
      )}

      {mode === 'preview' && (
        <div
          style={
            {
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
            } as React.CSSProperties
          }
        >
          {/* Hero preview */}
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
                  color: '#dae2fd',
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
```

- [ ] **Step 3: TypeScript check — zero new errors**

```bash
pnpm tsc --noEmit 2>&1 | grep -v node_modules
```

Expected: no output (the 3 pre-existing Supabase errors were fixed in a prior commit via the regenerated types — this should be fully clean now).

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/PostEditor.tsx
git commit -m "feat(admin): add cover_image_url field, dual ImagePositionPicker for card/hero, hero preview"
```

---

## Self-Review

**Spec coverage:**

- ✅ Cover image shown in blog post hero (`MarkdownPost` Task 2) — image URL + hero position
- ✅ Cover image shown in blog listing card (`BlogCard` Task 3) — image URL + card position
- ✅ Drag-to-position for card (independent) — `ImagePositionPicker previewHeight={200}` Task 4
- ✅ Drag-to-position for hero (independent) — `ImagePositionPicker previewHeight={200}` Task 4
- ✅ Hero visible in admin preview with correct position — preview panel Task 4
- ✅ Falls back to BlogCover theme if no image URL — Task 2 and Task 3

**Placeholder scan:** No TBD/TODO present.

**Type consistency:**

- `cover_image_url`, `cover_image_position_card`, `cover_image_position_hero` — same names used in `PostForm`, `EMPTY`, post initializer, payload, and JSX throughout Task 4
- `ImagePositionPicker` props: `src`, `value`, `onChange`, `label`, `previewHeight` — consistent between Task 1 (definition) and Task 4 (usage)
- `BlogCardPost.coverImageUrl` / `coverImagePositionCard` — camelCase in component interface, snake_case in `adaptPost` mapping — correctly bridged in Task 3

**Note on hero picker height:** Both pickers use `previewHeight={200}` in the editor for space efficiency. The actual hero on the live blog is 420px tall, but a 200px preview is sufficient to tune the focal point — the grid overlay provides visual reference. This is a design tradeoff: a 420px picker would push save/publish buttons far down the page.
