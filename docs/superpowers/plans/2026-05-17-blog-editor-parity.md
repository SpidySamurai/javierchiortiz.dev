# Blog Editor Parity & YouTube Embeds Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the blog renderer and CMS editor so any content written in the editor renders identically on the blog, with YouTube embeds insertable at any position and a full post preview before publishing.

**Architecture:** Extract a shared `MarkdownRenderer` component used by both `MarkdownPost` (public blog) and the admin `PostEditor` (preview tab). YouTube embeds use a `::youtube[VIDEO_ID]` shorthand detected by a custom paragraph component — no new parsing packages required. The editor gets a toolbar button that prompts for a video ID and inserts the shorthand at the cursor.

**Tech Stack:** react-markdown v10, remark-gfm, rehype-sanitize, @uiw/react-md-editor v4 (extraCommands API), Next.js App Router, TypeScript, design system CSS vars (`--ds-*`).

---

## File Map

| Action | Path                                            | Purpose                                              |
| ------ | ----------------------------------------------- | ---------------------------------------------------- |
| Create | `src/components/2026/blog/MarkdownRenderer.tsx` | Shared styled markdown renderer with YouTube support |
| Modify | `src/components/2026/blog/MarkdownPost.tsx`     | Use MarkdownRenderer instead of inline ReactMarkdown |
| Modify | `src/components/admin/PostEditor.tsx`           | Add Preview tab + YouTube toolbar button             |

---

### Task 1: Create MarkdownRenderer with styled components and YouTube support

**Files:**

- Create: `src/components/2026/blog/MarkdownRenderer.tsx`

- [ ] **Step 1: Create the file**

```tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import type { Components } from 'react-markdown';

function YouTubeEmbed({ id }: { id: string }) {
  return (
    <div
      style={{
        position: 'relative',
        paddingBottom: '56.25%',
        height: 0,
        margin: '2rem 0',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
      />
    </div>
  );
}

const components: Components = {
  h1: ({ children }) => (
    <h1
      style={{
        fontSize: '2rem',
        fontWeight: 900,
        color: 'var(--ds-on-surface)',
        fontFamily: 'var(--font-manrope), sans-serif',
        marginTop: '2.5rem',
        marginBottom: '1rem',
        letterSpacing: '-0.02em',
        lineHeight: 1.15,
      }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      style={{
        fontSize: '1.4rem',
        fontWeight: 700,
        color: 'var(--ds-on-surface)',
        fontFamily: 'var(--font-manrope), sans-serif',
        marginTop: '2rem',
        marginBottom: '0.75rem',
        letterSpacing: '-0.01em',
      }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      style={{
        fontSize: '1.1rem',
        fontWeight: 700,
        color: 'var(--ds-on-surface)',
        fontFamily: 'var(--font-manrope), sans-serif',
        marginTop: '1.5rem',
        marginBottom: '0.5rem',
      }}
    >
      {children}
    </h3>
  ),
  p: ({ children }) => {
    const text = typeof children === 'string' ? children : '';
    const match = text.match(/^::youtube\[([^\]]+)\]$/);
    if (match) return <YouTubeEmbed id={match[1]} />;
    return (
      <p
        style={{
          color: 'var(--ds-on-surface-variant)',
          fontFamily: 'var(--font-inter), sans-serif',
          lineHeight: 1.8,
          marginBottom: '1.25rem',
          fontSize: '1rem',
        }}
      >
        {children}
      </p>
    );
  },
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: 'var(--ds-primary)', textDecoration: 'underline', textUnderlineOffset: 3 }}
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong style={{ color: 'var(--ds-on-surface)', fontWeight: 700 }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ color: 'var(--ds-on-surface)', fontStyle: 'italic' }}>{children}</em>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.startsWith('language-');
    if (isBlock) {
      return (
        <code
          style={{
            display: 'block',
            background: 'var(--ds-surface)',
            color: 'var(--ds-primary)',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            padding: '1rem 1.25rem',
            borderRadius: 8,
            overflowX: 'auto',
            marginBottom: '1.25rem',
            lineHeight: 1.6,
          }}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        style={{
          background: 'var(--ds-surface)',
          color: 'var(--ds-primary)',
          fontFamily: 'monospace',
          fontSize: '0.85em',
          padding: '0.15em 0.4em',
          borderRadius: 4,
        }}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre style={{ margin: '1.25rem 0', background: 'transparent' }}>{children}</pre>
  ),
  blockquote: ({ children }) => (
    <blockquote
      style={{
        borderLeft: '3px solid var(--ds-primary)',
        paddingLeft: '1.25rem',
        margin: '1.5rem 0',
        color: 'var(--ds-on-surface-variant)',
        fontStyle: 'italic',
        opacity: 0.85,
      }}
    >
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul
      style={{
        color: 'var(--ds-on-surface-variant)',
        fontFamily: 'var(--font-inter), sans-serif',
        paddingLeft: '1.5rem',
        marginBottom: '1.25rem',
        lineHeight: 1.8,
        listStyleType: 'disc',
      }}
    >
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol
      style={{
        color: 'var(--ds-on-surface-variant)',
        fontFamily: 'var(--font-inter), sans-serif',
        paddingLeft: '1.5rem',
        marginBottom: '1.25rem',
        lineHeight: 1.8,
        listStyleType: 'decimal',
      }}
    >
      {children}
    </ol>
  ),
  li: ({ children }) => <li style={{ marginBottom: '0.25rem' }}>{children}</li>,
  hr: () => (
    <hr
      style={{
        border: 'none',
        height: 1,
        background: 'var(--ds-outline-variant)',
        margin: '2rem 0',
        opacity: 0.4,
      }}
    />
  ),
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt ?? ''}
      style={{ maxWidth: '100%', borderRadius: 8, margin: '1.5rem 0' }}
    />
  ),
};

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd /path/to/project && pnpm tsc --noEmit 2>&1 | grep MarkdownRenderer
```

Expected: no output (no errors).

- [ ] **Step 3: Commit**

```bash
git add src/components/2026/blog/MarkdownRenderer.tsx
git commit -m "feat(blog): add shared MarkdownRenderer with design system styles and YouTube embed support"
```

---

### Task 2: Wire MarkdownRenderer into MarkdownPost

**Files:**

- Modify: `src/components/2026/blog/MarkdownPost.tsx`

- [ ] **Step 1: Replace the ReactMarkdown block**

Current `MarkdownPost.tsx` lines 1-6 imports and lines 45-48 rendering block. Replace the entire file with:

```tsx
import type { Post } from '@/types/database';
import Header from '@/components/2026/layout/Header';
import Sidebar from '@/components/2026/layout/Sidebar';
import MarkdownRenderer from '@/components/2026/blog/MarkdownRenderer';

export default function MarkdownPost({ post, locale }: { post: Post; locale: string }) {
  const title = locale === 'es' ? post.title_es : post.title_en;
  const content = locale === 'es' ? post.content_es : post.content_en;

  return (
    <div className="ds-2026" style={{ minHeight: '100vh', backgroundColor: 'var(--ds-bg)' }}>
      <Header />
      <Sidebar />
      <main className="xl:ml-64 pt-20">
        <article className="max-w-3xl mx-auto px-8 py-16">
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
          <div>
            <MarkdownRenderer content={content ?? ''} />
          </div>
        </article>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Confirm TypeScript clean**

```bash
pnpm tsc --noEmit 2>&1 | grep -E "MarkdownPost|MarkdownRenderer"
```

Expected: no output.

- [ ] **Step 3: Start dev server and open a blog post**

```bash
pnpm dev
```

Open `http://localhost:3000/en/blog/<any-slug>` and confirm styled headings, code blocks, and links render correctly.

- [ ] **Step 4: Commit**

```bash
git add src/components/2026/blog/MarkdownPost.tsx
git commit -m "refactor(blog): use shared MarkdownRenderer in MarkdownPost"
```

---

### Task 3: Add Preview tab and YouTube button to PostEditor

**Files:**

- Modify: `src/components/admin/PostEditor.tsx`

This task replaces the single-file content. The key changes are:

1. Import `MarkdownRenderer`
2. Add `mode` state: `'edit' | 'preview'`
3. Render mode toggle buttons above the editor
4. When `mode === 'preview'`, show `MarkdownRenderer` with current content; hide MDEditor
5. Add a YouTube custom command to the MDEditor toolbar

- [ ] **Step 1: Add mode state and YouTube command — replace PostEditor.tsx**

Replace the entire file with:

```tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Post } from '@/types/database';
import MarkdownRenderer from '@/components/2026/blog/MarkdownRenderer';

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

const youtubeCommand = {
  name: 'youtube',
  keyCommand: 'youtube',
  buttonProps: { title: 'Insert YouTube embed', style: { fontSize: 13, padding: '4px 8px' } },
  icon: <span>▶ YT</span>,
  execute: (_state: unknown, api: { replaceSelection: (text: string) => void }) => {
    const id = prompt('YouTube Video ID (e.g. dQw4w9WgXcQ):');
    if (!id?.trim()) return;
    api.replaceSelection(`\n::youtube[${id.trim()}]\n`);
  },
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
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
      </div>

      {/* Language + mode tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        {/* Language tabs */}
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
        {/* Mode toggle */}
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

      {/* Title field (shown in both modes) */}
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

      {/* Edit mode */}
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

      {/* Preview mode */}
      {mode === 'preview' && (
        <div
          style={
            {
              minHeight: 400,
              background: '#0b1326',
              borderRadius: 8,
              padding: '2rem',
              '--ds-bg': '#0b1326',
              '--ds-surface': '#131b2e',
              '--ds-on-surface': '#dae2fd',
              '--ds-on-surface-variant': '#c7c4d7',
              '--ds-primary': '#c0c1ff',
              '--ds-outline-variant': '#464554',
            } as React.CSSProperties
          }
        >
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

- [ ] **Step 2: Verify TypeScript**

```bash
pnpm tsc --noEmit 2>&1 | grep PostEditor
```

Expected: no output.

- [ ] **Step 3: Test in browser**

1. Open `http://localhost:3000/admin/posts/new`
2. Confirm Edit/Preview toggle appears top-right of the content area
3. Switch to Preview — should show dark panel with styled markdown
4. Click the ▶ YT button in the editor toolbar — prompt should appear
5. Enter any YouTube ID (e.g. `dQw4w9WgXcQ`) — `::youtube[dQw4w9WgXcQ]` inserts at cursor
6. Switch to Preview — YouTube iframe should appear embedded

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/PostEditor.tsx
git commit -m "feat(admin): add post preview tab and YouTube inline embed toolbar button"
```

---

### Task 4: Verify YouTube renders on public blog

**Files:**

- Read only: `src/components/2026/blog/MarkdownRenderer.tsx`

- [ ] **Step 1: Create a test post with YouTube embed**

In the admin editor:

1. Create a new draft post with any slug
2. In the content, add a line: `::youtube[dQw4w9WgXcQ]`
3. Save as draft (do NOT publish)

- [ ] **Step 2: Temporarily render draft to verify**

In `src/app/[locale]/blog/[slug]/page.tsx`, the `getPostBySlug` query only fetches published posts. To test, temporarily change `getPostBySlug` in `src/lib/blogQueries.ts` to also fetch unpublished posts, visit the draft URL, then revert.

Check `src/lib/blogQueries.ts` for the exact query and add `.eq('is_published', false)` or remove the filter temporarily.

- [ ] **Step 3: Confirm the iframe renders on blog**

Visit `http://localhost:3000/en/blog/<test-slug>` and confirm the YouTube player appears at the correct position in the content.

- [ ] **Step 4: Revert any temporary query changes**

```bash
git diff src/lib/blogQueries.ts
# If any changes, restore:
git restore src/lib/blogQueries.ts
```

- [ ] **Step 5: Delete the test draft via admin UI**

---

## Self-Review

**Spec coverage:**

- ✅ Editor parity: `MarkdownRenderer` shared between blog and editor preview
- ✅ YouTube at any position: `::youtube[ID]` in markdown, toolbar insert button
- ✅ Preview before publish: Preview tab in PostEditor with styled render

**Placeholder scan:**

- No TBD or TODO present

**Type consistency:**

- `youtubeCommand.execute` types match `@uiw/react-md-editor` extraCommands API
- `MarkdownRenderer` accepts `{ content: string }` — used consistently in Task 1, 2, and 3
- `PostForm` type unchanged from original — no regressions

**Potential issue:** The `p` component in `MarkdownRenderer` checks `typeof children === 'string'` for the YouTube match. In react-markdown v10, a paragraph with only text will pass a string child, but with inline formatting it may pass an array. The `::youtube[ID]` shorthand should always be on its own line (no inline formatting around it), so this is safe. If a user wraps it in bold/etc., it silently falls through to a normal `<p>`.
