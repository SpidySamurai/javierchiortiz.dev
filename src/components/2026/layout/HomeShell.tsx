'use client';

import Header from '@/components/2026/layout/Header';
import Sidebar from '@/components/2026/layout/Sidebar';
import Hero from '@/components/2026/sections/Hero';
import Timeline from '@/components/2026/sections/Timeline';
import Projects from '@/components/2026/sections/Projects';
import Product from '@/components/2026/sections/Product';
import About from '@/components/2026/sections/About';
import Footer from '@/components/2026/sections/Footer';
import BlogPreview from '@/components/2026/sections/BlogPreview';
import MantecadoChat from '@/components/MantecadoChat';
import ScrollProgress from '@/components/2026/ui/ScrollProgress';
import BackToTop from '@/components/2026/ui/BackToTop';
import CustomCursor from '@/components/2026/ui/CustomCursor';
import { usePageView } from '@/hooks/usePageView';
import type { Post } from '@/types/database';

export default function HomeShell({ posts }: { posts: Post[] }) {
  usePageView();

  return (
    <div className="ds-2026" style={{ minHeight: '100vh' }}>
      <ScrollProgress />
      <CustomCursor />
      <Header />
      <Sidebar />
      <MantecadoChat />
      <BackToTop />
      <main className="sidebar-main pt-20">
        <Hero />
        <Timeline />
        <Product />
        <Projects />
        <About />
<BlogPreview posts={posts} />
        <Footer />
      </main>
    </div>
  );
}
