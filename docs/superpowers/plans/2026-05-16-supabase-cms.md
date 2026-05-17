# Supabase CMS Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace static blog data with a Supabase-backed CMS that includes a bilingual (EN/ES) markdown editor, contact form, page analytics, and an auth-protected admin portal — all without requiring code deploys for new content.

**Architecture:** Supabase handles auth, DB (posts, contact_messages, page_views), and RLS policies. The public site uses Next.js server components to fetch published posts. The `/admin` route (outside `[locale]`) is protected by Next.js middleware using `@supabase/ssr`. Existing custom-component posts (TwentyOnePilots, SpiderMan) are preserved via `cover_theme` field; new posts use `react-markdown`.

**Tech Stack:** `@supabase/supabase-js`, `@supabase/ssr`, `react-markdown`, `remark-gfm`, `rehype-sanitize`, `@uiw/react-md-editor` (dynamic import, SSR disabled)

---

## File Map

**Created:**

- `src/lib/supabase/client.ts` — browser Supabase client (singleton)
- `src/lib/supabase/server.ts` — server Supabase client (cookies-based)
- `src/types/database.ts` — TypeScript types matching DB schema
- `src/app/admin/layout.tsx` — admin shell (auth guard)
- `src/app/admin/login/page.tsx` — login form
- `src/app/admin/page.tsx` — redirect to /admin/posts
- `src/app/admin/posts/page.tsx` — post list
- `src/app/admin/posts/new/page.tsx` — new post
- `src/app/admin/posts/[id]/page.tsx` — edit post
- `src/app/admin/messages/page.tsx` — contact inbox
- `src/app/admin/analytics/page.tsx` — page view stats
- `src/app/api/contact/route.ts` — POST contact message
- `src/app/api/analytics/route.ts` — POST page view
- `src/components/2026/sections/Contact.tsx` — contact form section
- `src/components/2026/blog/MarkdownPost.tsx` — markdown renderer for DB posts
- `src/components/admin/PostEditor.tsx` — bilingual markdown editor
- `src/components/admin/PostList.tsx` — post table with publish toggle
- `src/components/admin/MessageList.tsx` — contact messages table
- `src/components/admin/AnalyticsView.tsx` — page view counts
- `src/hooks/usePageView.ts` — fires analytics on route change

**Modified:**

- `src/app/[locale]/blog/page.tsx` — fetch from Supabase (server component)
- `src/app/[locale]/blog/[slug]/page.tsx` — fetch from Supabase + route to custom or markdown
- `src/app/[locale]/page.tsx` — add `<Contact />` section
- `middleware.ts` — protect `/admin/*`, redirect unauthenticated to `/admin/login`
- `src/data/blog.ts` — keep type `BlogPost` for legacy custom posts, mark deprecated

**Deleted after Task 15 (seed):**

- `src/data/blog.ts` (replace with DB queries)

---

## Task 1: Install dependencies

**Files:** `package.json`

- [ ] Run:

```bash
npm install @supabase/supabase-js @supabase/ssr react-markdown remark-gfm rehype-sanitize @uiw/react-md-editor
```

- [ ] Verify install:

```bash
npm ls @supabase/supabase-js @supabase/ssr react-markdown @uiw/react-md-editor 2>&1 | grep -v "npm warn"
```

Expected: four packages listed with versions, no errors.

- [ ] Commit:

```bash
git add package.json package-lock.json
git commit -m "chore: add supabase, react-markdown, md-editor deps"
```

---

## Task 2: Environment variables

**Files:** `.env.local` (gitignored), `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`

- [ ] Create `.env.local` (get values from Supabase dashboard → Project Settings → API):

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

- [ ] Create `src/lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] Create `src/lib/supabase/server.ts`:

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
```

- [ ] Commit:

```bash
git add src/lib/supabase/client.ts src/lib/supabase/server.ts
git commit -m "feat(supabase): add browser and server clients"
```

---

## Task 3: TypeScript database types

**Files:** `src/types/database.ts`

- [ ] Create `src/types/database.ts`:

```typescript
export interface Post {
  id: string;
  slug: string;
  title_en: string;
  title_es: string;
  excerpt_en: string | null;
  excerpt_es: string | null;
  content_en: string | null;
  content_es: string | null;
  category: string;
  read_time: string;
  cover_theme: string | null;
  youtube_id: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface PageView {
  id: string;
  path: string;
  locale: string | null;
  referrer: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: Post;
        Insert: Omit<Post, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Post, 'id' | 'created_at'>>;
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: Omit<ContactMessage, 'id' | 'created_at'>;
        Update: never;
      };
      page_views: { Row: PageView; Insert: Omit<PageView, 'id' | 'created_at'>; Update: never };
    };
  };
}
```

- [ ] Commit:

```bash
git add src/types/database.ts
git commit -m "feat(supabase): add database TypeScript types"
```

---

## Task 4: Database schema (run in Supabase SQL Editor)

**Files:** `docs/supabase/schema.sql` (save for reference)

- [ ] Create `docs/supabase/schema.sql`:

```sql
-- Posts
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title_en text not null,
  title_es text not null,
  excerpt_en text,
  excerpt_es text,
  content_en text,
  content_es text,
  category text not null default 'General',
  read_time text not null default '5 min read',
  cover_theme text,
  youtube_id text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger posts_updated_at before update on posts
  for each row execute function update_updated_at();

-- Contact messages
create table if not exists contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Page views
create table if not exists page_views (
  id uuid default gen_random_uuid() primary key,
  path text not null,
  locale text,
  referrer text,
  created_at timestamptz not null default now()
);

-- RLS
alter table posts enable row level security;
alter table contact_messages enable row level security;
alter table page_views enable row level security;

-- Posts: public can read published, auth can do everything
create policy "public read published posts"
  on posts for select using (is_published = true);
create policy "auth full access posts"
  on posts for all using (auth.role() = 'authenticated');

-- Contact: public insert, auth read/delete
create policy "public insert contact"
  on contact_messages for insert with check (true);
create policy "auth read contact"
  on contact_messages for select using (auth.role() = 'authenticated');
create policy "auth delete contact"
  on contact_messages for delete using (auth.role() = 'authenticated');

-- Analytics: public insert, auth read
create policy "public insert page_view"
  on page_views for insert with check (true);
create policy "auth read page_views"
  on page_views for select using (auth.role() = 'authenticated');
```

- [ ] Run this SQL in **Supabase Dashboard → SQL Editor**. Verify in **Table Editor** that `posts`, `contact_messages`, `page_views` tables exist.

- [ ] Commit:

```bash
git add docs/supabase/schema.sql
git commit -m "feat(supabase): add db schema and RLS policies"
```

---

## Task 5: Blog data layer

**Files:** `src/data/blog.ts` (add DB query), `src/app/[locale]/blog/page.tsx`, `src/app/[locale]/blog/[slug]/page.tsx`

- [ ] Add query functions to `src/data/blog.ts` (keep existing `BlogPost` type for legacy custom components, add new functions below it):

```typescript
// Existing BlogPost type and blogPosts array stays — used by legacy custom components

import { createClient } from '@/lib/supabase/server';
import type { Post } from '@/types/database';

export async function getPublishedPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  if (error) return null;
  return data;
}
```

- [ ] Convert `src/app/[locale]/blog/page.tsx` to a **server component** (remove `'use client'`, `use(params)` → `await params`):

```typescript
import { getPublishedPosts } from '@/data/blog';
import BlogCard from '@/components/2026/ui/BlogCard';
import Header from '@/components/2026/layout/Header';
import Sidebar from '@/components/2026/layout/Sidebar';
import ScrollProgress from '@/components/2026/ui/ScrollProgress';
import type { Post } from '@/types/database';

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const posts = await getPublishedPosts();

  return (
    <div className="ds-2026" style={{ minHeight: '100vh' }}>
      <ScrollProgress />
      <Header />
      <Sidebar />
      <main className="xl:ml-64 pt-20">
        <section className="py-28 px-8" style={{ backgroundColor: 'var(--ds-bg)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="space-y-2 mb-16">
              <span
                className="text-xs uppercase tracking-[0.3em] font-bold block"
                style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                BLOG
              </span>
              <h1
                className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
                style={{
                  color: 'var(--ds-on-surface)',
                  fontFamily: 'var(--font-manrope), sans-serif',
                }}
              >
                Thoughts &{' '}
                <span style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>Beyond Code</span>
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={adaptPost(post, locale)} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Adapts DB Post to the shape BlogCard expects (title, category, etc. from locale)
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
    coverTheme: (post.cover_theme ?? 'default') as 'pilots' | 'spiderman' | 'karate',
    title: locale === 'es' ? post.title_es : post.title_en,
    excerpt: locale === 'es' ? post.excerpt_es : post.excerpt_en,
  };
}
```

- [ ] Update `BlogCard` component (`src/components/2026/ui/BlogCard.tsx`) to accept optional `title` and `excerpt` props from the adapted post (check the file first — it currently reads title from translations; add a fallback to accept them as props if present).

- [ ] Verify: start dev server (`npm run dev`), visit `http://localhost:3000/en/blog`. Should show empty grid (no posts in DB yet). No errors in console.

- [ ] Commit:

```bash
git add src/data/blog.ts src/app src/components/2026/ui/BlogCard.tsx
git commit -m "feat(blog): fetch posts from Supabase, convert page to server component"
```

---

## Task 6: Blog post page — markdown renderer + custom component routing

**Files:** `src/components/2026/blog/MarkdownPost.tsx`, `src/app/[locale]/blog/[slug]/page.tsx`

- [ ] Create `src/components/2026/blog/MarkdownPost.tsx`:

```typescript
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import type { Post } from '@/types/database';
import Header from '@/components/2026/layout/Header';
import Sidebar from '@/components/2026/layout/Sidebar';

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
                  · {new Date(post.published_at).toLocaleDateString(
                    locale === 'es' ? 'es-MX' : 'en-US',
                    { month: 'long', day: 'numeric', year: 'numeric' }
                  )}
                </>
              )}
            </p>
          </header>
          <div
            className="prose prose-invert max-w-none"
            style={{ color: 'var(--ds-on-surface-variant)' }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
              {content ?? ''}
            </ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  );
}
```

- [ ] Update `src/app/[locale]/blog/[slug]/page.tsx` to a server component fetching from Supabase, routing to custom component or markdown:

```typescript
import { getPostBySlug } from '@/data/blog';
import { blogPosts } from '@/data/blog';
import BlogPostLayout from '@/components/2026/blog/BlogPostLayout';
import TwentyOnePilotsPost from '@/components/2026/blog/TwentyOnePilotsPost';
import SpiderManPost from '@/components/2026/blog/SpiderManPost';
import MarkdownPost from '@/components/2026/blog/MarkdownPost';
import Link from 'next/link';

const CUSTOM_COMPONENTS: Record<
  string,
  React.ComponentType<{
    post: {
      slug: string;
      date: string;
      category: string;
      readTime: string;
      coverTheme: 'pilots' | 'spiderman' | 'karate';
      theme?: string;
      youtubeId?: string;
    };
    locale: string;
  }>
> = {
  'twenty-one-pilots': TwentyOnePilotsPost,
  'spider-man': SpiderManPost,
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <div className="ds-2026 py-28 px-8 text-center" style={{ minHeight: '100vh' }}>
        <p style={{ color: 'var(--ds-on-surface-variant)' }}>Post not found.</p>
        <Link href={`/${locale}/blog`} style={{ color: 'var(--ds-primary)' }}>
          ← Back to Blog
        </Link>
      </div>
    );
  }

  // Route to custom component if one exists for this slug
  const CustomComponent = CUSTOM_COMPONENTS[slug];
  if (CustomComponent) {
    const legacyPost = blogPosts.find((p) => p.slug === slug);
    if (legacyPost) return <CustomComponent post={legacyPost} locale={locale} />;
  }

  return <MarkdownPost post={post} locale={locale} />;
}
```

- [ ] Verify: `npm run lint` — no errors. Dev server renders blog page.

- [ ] Commit:

```bash
git add src/components/2026/blog/MarkdownPost.tsx src/app
git commit -m "feat(blog): add markdown post renderer, route custom vs markdown posts"
```

---

## Task 7: Contact form section + API route

**Files:** `src/app/api/contact/route.ts`, `src/components/2026/sections/Contact.tsx`, `src/app/[locale]/page.tsx`

- [ ] Create `src/app/api/contact/route.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }
  if (message.length > 2000) {
    return NextResponse.json({ error: 'Message too long' }, { status: 400 });
  }

  const { error } = await supabase.from('contact_messages').insert({ name, email, message });
  if (error) return NextResponse.json({ error: 'Failed to save' }, { status: 500 });

  return NextResponse.json({ ok: true });
}
```

- [ ] Create `src/components/2026/sections/Contact.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const t = useTranslations('common');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid color-mix(in srgb, var(--ds-outline-variant) 50%, transparent)',
    backgroundColor: 'var(--ds-surface)',
    color: 'var(--ds-on-surface)',
    fontFamily: 'var(--font-inter), sans-serif',
    fontSize: '0.875rem',
    outline: 'none',
  } as React.CSSProperties;

  return (
    <section
      id="contact"
      className="py-24 px-8 md:px-16"
      style={{ backgroundColor: 'var(--ds-bg)' }}
    >
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-2 mb-12"
        >
          <span
            className="text-xs uppercase tracking-[0.3em] font-bold block"
            style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {t('contact_label')}
          </span>
          <h2
            className="text-3xl md:text-4xl font-black uppercase tracking-tighter"
            style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            {t('contact_heading')}
          </h2>
        </motion.div>

        {status === 'sent' ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
            style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {t('contact_success')}
          </motion.p>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                required
                placeholder={t('contact_name')}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                style={inputStyle}
              />
              <input
                required
                type="email"
                placeholder={t('contact_email')}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <textarea
              required
              rows={5}
              placeholder={t('contact_message')}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
            {status === 'error' && (
              <p className="text-sm" style={{ color: '#f87171' }}>
                {t('contact_error')}
              </p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-3 px-6 rounded-lg font-semibold text-sm transition-opacity disabled:opacity-50"
              style={{
                backgroundColor: 'var(--ds-primary)',
                color: 'var(--ds-on-primary)',
                fontFamily: 'var(--font-manrope), sans-serif',
              }}
            >
              {status === 'sending' ? t('contact_sending') : t('contact_submit')}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
}
```

- [ ] Add translation keys to `src/messages/en/common.json` (or wherever `contact_*` keys should live):

```json
"contact_label": "Contact",
"contact_heading": "Let's work together",
"contact_name": "Your name",
"contact_email": "Your email",
"contact_message": "Tell me about your project...",
"contact_submit": "Send message",
"contact_sending": "Sending...",
"contact_success": "Message sent! I'll get back to you soon.",
"contact_error": "Something went wrong. Try again."
```

Add the same keys in Spanish to `src/messages/es/common.json`.

- [ ] Add `<Contact />` to `src/app/[locale]/page.tsx` — after `<About />`, before `<BlogPreview />`:

```typescript
import Contact from '@/components/2026/sections/Contact';
// ... inside return:
// <About />
// <Contact />
// <BlogPreview />
```

- [ ] Verify: dev server, submit the form, check Supabase **Table Editor → contact_messages** for the row.

- [ ] Commit:

```bash
git add src/app/api/contact src/components/2026/sections/Contact.tsx src/app src/messages
git commit -m "feat(contact): add contact form section with Supabase persistence"
```

---

## Task 8: Page analytics

**Files:** `src/app/api/analytics/route.ts`, `src/hooks/usePageView.ts`, `src/app/[locale]/page.tsx`, `src/app/[locale]/blog/page.tsx`

- [ ] Create `src/app/api/analytics/route.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { path, locale } = body;
  if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 });

  const referrer = req.headers.get('referer') ?? null;
  await supabase.from('page_views').insert({ path, locale: locale ?? null, referrer });

  return NextResponse.json({ ok: true });
}
```

- [ ] Create `src/hooks/usePageView.ts`:

```typescript
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export function usePageView() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, locale }),
    }).catch(() => {});
  }, [pathname, locale]);
}
```

- [ ] Add `usePageView()` call to `src/app/[locale]/page.tsx` inside the `Home` component:

```typescript
import { usePageView } from '@/hooks/usePageView';
// inside function Home():
usePageView();
```

- [ ] Commit:

```bash
git add src/app/api/analytics src/hooks/usePageView.ts src/app
git commit -m "feat(analytics): track page views via Supabase"
```

---

## Task 9: Auth middleware

**Files:** `middleware.ts` (root of project), `src/app/admin/login/page.tsx`

- [ ] Create/replace `middleware.ts` at project root:

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  if (isAdminRoute && !isLoginPage && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  if (isLoginPage && user) {
    return NextResponse.redirect(new URL('/admin/posts', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

- [ ] Create `src/app/admin/login/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin/posts');
      router.refresh();
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0f',
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <h1
          style={{
            color: '#c0c1ff',
            fontFamily: 'sans-serif',
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Admin
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #2a2a3a',
            background: '#12121a',
            color: '#e2e8f0',
            fontSize: 14,
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #2a2a3a',
            background: '#12121a',
            color: '#e2e8f0',
            fontSize: 14,
          }}
        />
        {error && <p style={{ color: '#f87171', fontSize: 13 }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: '#c0c1ff',
            color: '#0a0a0f',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            border: 'none',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
```

- [ ] Create admin user: **Supabase Dashboard → Authentication → Users → Add user**. Use your email + strong password.

- [ ] Verify: visit `http://localhost:3000/admin` → redirects to `/admin/login`. Sign in → redirects to `/admin/posts` (404 for now — that's fine).

- [ ] Commit:

```bash
git add middleware.ts src/app/admin/login
git commit -m "feat(admin): add auth middleware and login page"
```

---

## Task 10: Admin layout + shell

**Files:** `src/app/admin/layout.tsx`, `src/app/admin/page.tsx`

- [ ] Create `src/app/admin/layout.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#0a0a0f',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Sidebar */}
      <nav
        style={{
          width: 200,
          borderRight: '1px solid #1a1a2e',
          padding: '2rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <span
          style={{
            color: '#c0c1ff',
            fontWeight: 700,
            fontSize: 16,
            marginBottom: 24,
            paddingLeft: 12,
          }}
        >
          CMS
        </span>
        {[
          { href: '/admin/posts', label: 'Posts' },
          { href: '/admin/messages', label: 'Messages' },
          { href: '/admin/analytics', label: 'Analytics' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              color: '#94a3b8',
              padding: '8px 12px',
              borderRadius: 6,
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            {label}
          </Link>
        ))}
        <form action="/api/auth/signout" method="POST" style={{ marginTop: 'auto' }}>
          <SignOutButton />
        </form>
      </nav>
      <main style={{ flex: 1, padding: '2rem', color: '#e2e8f0', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}

function SignOutButton() {
  'use client';
  // Inline client sign-out — avoids a separate file
  return null; // replaced in next step with proper signout
}
```

- [ ] Update `AdminLayout` to use a proper sign-out approach — replace the form with a client component button. Create `src/app/admin/_components/SignOutButton.tsx`:

```typescript
'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      style={{
        width: '100%',
        padding: '8px 12px',
        background: 'transparent',
        border: 'none',
        color: '#64748b',
        fontSize: 14,
        cursor: 'pointer',
        borderRadius: 6,
        textAlign: 'left',
      }}
    >
      Sign out
    </button>
  );
}
```

- [ ] Update `AdminLayout` to import and use `SignOutButton` (remove the broken placeholder).

- [ ] Create `src/app/admin/page.tsx`:

```typescript
import { redirect } from 'next/navigation';
export default function AdminRoot() {
  redirect('/admin/posts');
}
```

- [ ] Commit:

```bash
git add src/app/admin/layout.tsx src/app/admin/page.tsx src/app/admin/_components
git commit -m "feat(admin): add admin layout with nav and sign-out"
```

---

## Task 11: Admin — post list

**Files:** `src/components/admin/PostList.tsx`, `src/app/admin/posts/page.tsx`

- [ ] Create `src/components/admin/PostList.tsx`:

```typescript
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
    const update: Partial<Post> = next
      ? { is_published: true, published_at: new Date().toISOString() }
      : { is_published: false };
    const { error } = await supabase.from('posts').update(update).eq('id', post.id);
    if (!error) setPosts((p) => p.map((pp) => (pp.id === post.id ? { ...pp, ...update } : pp)));
  };

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return;
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
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0' }}>Posts</h1>
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
          <tr style={{ borderBottom: '1px solid #1e1e2e', color: '#64748b', textAlign: 'left' }}>
            <th style={{ padding: '8px 12px' }}>Slug</th>
            <th style={{ padding: '8px 12px' }}>Title (EN)</th>
            <th style={{ padding: '8px 12px' }}>Category</th>
            <th style={{ padding: '8px 12px' }}>Status</th>
            <th style={{ padding: '8px 12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} style={{ borderBottom: '1px solid #12121a' }}>
              <td style={{ padding: '10px 12px', color: '#94a3b8', fontFamily: 'monospace' }}>
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
                    background: post.is_published ? '#16a34a22' : '#1e1e2e',
                    color: post.is_published ? '#4ade80' : '#64748b',
                  }}
                >
                  {post.is_published ? 'Published' : 'Draft'}
                </button>
              </td>
              <td style={{ padding: '10px 12px', display: 'flex', gap: 8 }}>
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
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: 24, color: '#64748b', textAlign: 'center' }}>
                No posts yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] Create `src/app/admin/posts/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server';
import PostList from '@/components/admin/PostList';

export default async function PostsPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  return <PostList initialPosts={posts ?? []} />;
}
```

- [ ] Verify: visit `http://localhost:3000/admin/posts` (while signed in). Should render empty table with "New post" button.

- [ ] Commit:

```bash
git add src/components/admin/PostList.tsx src/app/admin/posts/page.tsx
git commit -m "feat(admin): add post list page"
```

---

## Task 12: Admin — post editor (create + edit)

**Files:** `src/components/admin/PostEditor.tsx`, `src/app/admin/posts/new/page.tsx`, `src/app/admin/posts/[id]/page.tsx`

> Note: `@uiw/react-md-editor` requires `dynamic` import with `ssr: false` in Next.js.

- [ ] Create `src/components/admin/PostEditor.tsx`:

```typescript
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

const EMPTY_FORM: PostForm = {
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
      : EMPTY_FORM
  );
  const [tab, setTab] = useState<'en' | 'es'>('en');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof PostForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async (publish: boolean) => {
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      excerpt_en: form.excerpt_en || null,
      excerpt_es: form.excerpt_es || null,
      content_en: form.content_en || null,
      content_es: form.content_es || null,
      cover_theme: form.cover_theme || null,
      youtube_id: form.youtube_id || null,
      is_published: publish,
      published_at: publish ? new Date().toISOString() : null,
    };

    const { error } = post
      ? await supabase.from('posts').update(payload).eq('id', post.id)
      : await supabase.from('posts').insert(payload);

    if (error) {
      setError(error.message);
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
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', marginBottom: 24 }}>
        {post ? 'Edit post' : 'New post'}
      </h1>

      {/* Meta fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <input
          placeholder="slug (url-friendly)"
          value={form.slug}
          onChange={set('slug')}
          style={inputStyle}
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={set('category')}
          style={inputStyle}
        />
        <input
          placeholder="Read time (e.g. 5 min read)"
          value={form.read_time}
          onChange={set('read_time')}
          style={inputStyle}
        />
        <input
          placeholder="cover_theme (pilots/spiderman/karate or blank)"
          value={form.cover_theme}
          onChange={set('cover_theme')}
          style={inputStyle}
        />
        <input
          placeholder="YouTube ID (optional)"
          value={form.youtube_id}
          onChange={set('youtube_id')}
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
          Publish
        </button>
      </div>
    </div>
  );
}
```

- [ ] Create `src/app/admin/posts/new/page.tsx`:

```typescript
import PostEditor from '@/components/admin/PostEditor';
export default function NewPostPage() {
  return <PostEditor />;
}
```

- [ ] Create `src/app/admin/posts/[id]/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server';
import PostEditor from '@/components/admin/PostEditor';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single();
  if (!post) notFound();
  return <PostEditor post={post} />;
}
```

- [ ] Verify: create a test post from `/admin/posts/new`, publish it, check it appears at `/en/blog`.

- [ ] Commit:

```bash
git add src/components/admin/PostEditor.tsx src/app/admin/posts/new src/app/admin/posts/[id]
git commit -m "feat(admin): add bilingual markdown post editor"
```

---

## Task 13: Admin — messages inbox

**Files:** `src/components/admin/MessageList.tsx`, `src/app/admin/messages/page.tsx`

- [ ] Create `src/components/admin/MessageList.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ContactMessage } from '@/types/database';

export default function MessageList({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const supabase = createClient();

  const deleteMessage = async (id: string) => {
    await supabase.from('contact_messages').delete().eq('id', id);
    setMessages((m) => m.filter((msg) => msg.id !== id));
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', marginBottom: 24 }}>
        Messages
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              padding: 20,
              background: '#12121a',
              borderRadius: 12,
              border: '1px solid #1e1e2e',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 15 }}>{msg.name}</span>
                <span style={{ color: '#64748b', fontSize: 13, marginLeft: 8 }}>{msg.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: '#475569', fontSize: 12 }}>
                  {new Date(msg.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <button
                  onClick={() => deleteMessage(msg.id)}
                  style={{
                    color: '#f87171',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 13,
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {msg.message}
            </p>
          </div>
        ))}
        {messages.length === 0 && (
          <p style={{ color: '#475569', textAlign: 'center', padding: 40 }}>No messages yet.</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] Create `src/app/admin/messages/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server';
import MessageList from '@/components/admin/MessageList';

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  return <MessageList initialMessages={messages ?? []} />;
}
```

- [ ] Commit:

```bash
git add src/components/admin/MessageList.tsx src/app/admin/messages
git commit -m "feat(admin): add contact messages inbox"
```

---

## Task 14: Admin — analytics view

**Files:** `src/components/admin/AnalyticsView.tsx`, `src/app/admin/analytics/page.tsx`

- [ ] Create `src/components/admin/AnalyticsView.tsx`:

```typescript
interface PathCount {
  path: string;
  count: number;
}

export default function AnalyticsView({ data }: { data: PathCount[] }) {
  const max = data[0]?.count ?? 1;

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', marginBottom: 24 }}>
        Analytics
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.map(({ path, count }) => (
          <div key={path} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                width: 220,
                color: '#94a3b8',
                fontSize: 13,
                fontFamily: 'monospace',
                flexShrink: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {path}
            </span>
            <div style={{ flex: 1, background: '#12121a', borderRadius: 4, height: 8 }}>
              <div
                style={{
                  width: `${(count / max) * 100}%`,
                  background: '#c0c1ff',
                  height: '100%',
                  borderRadius: 4,
                  transition: 'width 0.3s',
                }}
              />
            </div>
            <span style={{ color: '#64748b', fontSize: 13, width: 40, textAlign: 'right' }}>
              {count}
            </span>
          </div>
        ))}
        {data.length === 0 && (
          <p style={{ color: '#475569', textAlign: 'center', padding: 40 }}>No data yet.</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] Create `src/app/admin/analytics/page.tsx`:

```typescript
import { createClient } from '@/lib/supabase/server';
import AnalyticsView from '@/components/admin/AnalyticsView';

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: views } = await supabase.from('page_views').select('path');

  const counts = (views ?? []).reduce<Record<string, number>>((acc, { path }) => {
    acc[path] = (acc[path] ?? 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return <AnalyticsView data={data} />;
}
```

- [ ] Commit:

```bash
git add src/components/admin/AnalyticsView.tsx src/app/admin/analytics
git commit -m "feat(admin): add page view analytics"
```

---

## Task 15: Seed existing posts to Supabase

**Files:** `docs/supabase/seed.sql`

- [ ] Create `docs/supabase/seed.sql` and run in Supabase SQL Editor:

```sql
insert into posts (slug, title_en, title_es, excerpt_en, excerpt_es, category, read_time, cover_theme, youtube_id, is_published, published_at)
values
  (
    'twenty-one-pilots',
    'Twenty One Pilots — The Band That Stays With You',
    'Twenty One Pilots — La Banda Que Se Queda Contigo',
    'An exploration of why Twenty One Pilots connects so deeply across generations.',
    'Una exploración de por qué Twenty One Pilots conecta tan profundamente entre generaciones.',
    'Music',
    '6 min read',
    'pilots',
    'bYsCJv7Pc0s',
    true,
    now()
  ),
  (
    'spider-man',
    'Spider-Man and the Weight of Responsibility',
    'Spider-Man y el Peso de la Responsabilidad',
    'Why Peter Parker''s story resonates beyond superhero tropes.',
    'Por qué la historia de Peter Parker resuena más allá de los tropos de superhéroes.',
    'Culture',
    '7 min read',
    'spiderman',
    null,
    true,
    now()
  ),
  (
    'karate',
    'What Karate Taught Me About Code',
    'Lo Que el Karate Me Enseñó Sobre el Código',
    'Discipline, iteration, and deliberate practice — lessons that transcend the dojo.',
    'Disciplina, iteración y práctica deliberada — lecciones que trascienden el dojo.',
    'Life',
    '5 min read',
    'karate',
    null,
    true,
    now()
  );
```

- [ ] Run the SQL. Verify in Table Editor that 3 rows exist with `is_published = true`.

- [ ] Visit `http://localhost:3000/en/blog` — all 3 posts should appear.

- [ ] Visit `http://localhost:3000/en/blog/twenty-one-pilots` — should render the custom `TwentyOnePilotsPost` component.

- [ ] Run `npm run lint` — no errors.

- [ ] Commit:

```bash
git add docs/supabase/seed.sql
git commit -m "feat(supabase): seed existing posts to database"
```

---

## Post-implementation checklist

- [ ] `.env.local` is in `.gitignore` (verify: `git check-ignore -v .env.local`)
- [ ] Blog page shows posts from Supabase
- [ ] New post created from admin appears on public blog after publish
- [ ] Contact form submits → row appears in `contact_messages` table
- [ ] Page views are recorded for each visit
- [ ] `/admin` redirects to login when unauthenticated
- [ ] `npm run lint` — no errors
- [ ] `npm run build` — no errors
