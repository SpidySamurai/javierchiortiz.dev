'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import { blogPosts } from '@/data/blog';
import BlogCard from '@/components/2026/ui/BlogCard';
import Header from '@/components/2026/layout/Header';
import Sidebar from '@/components/2026/layout/Sidebar';
import ScrollProgress from '@/components/2026/ui/ScrollProgress';
import CustomCursor from '@/components/2026/ui/CustomCursor';

export default function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);

  return (
    <div className="ds-2026" style={{ minHeight: '100vh' }}>
      <ScrollProgress />
      <CustomCursor />
      <Header />
      <Sidebar />

      <main className="xl:ml-64 pt-20">
        <section className="py-28 px-8" style={{ backgroundColor: 'var(--ds-bg)' }}>
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="space-y-2 mb-16"
            >
              <span
                className="text-xs uppercase tracking-[0.3em] font-bold block"
                style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
              >
                BLOG
              </span>
              <h1
                className="text-4xl md:text-5xl font-black uppercase tracking-tighter"
                style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
              >
                Thoughts &{' '}
                <span style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>Beyond Code</span>
              </h1>
            </motion.div>

            {/* Posts grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {blogPosts.map((post) => (
                <BlogCard key={post.slug} post={post} locale={locale} />
              ))}
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
