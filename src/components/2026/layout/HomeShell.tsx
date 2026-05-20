import Header from '@/components/2026/layout/Header';
import Sidebar from '@/components/2026/layout/Sidebar';
import AnalyticsTracker from '@/components/2026/layout/AnalyticsTracker';
import Hero from '@/components/2026/sections/Hero';
import Timeline from '@/components/2026/sections/Timeline';
import Projects from '@/components/2026/sections/Projects';
import Product from '@/components/2026/sections/Product';
import About from '@/components/2026/sections/About';
import Services from '@/components/2026/sections/Services';
import Footer from '@/components/2026/sections/Footer';
import BlogPreview from '@/components/2026/sections/BlogPreview';
import MantecadoChat from '@/components/MantecadoChat';
import ScrollProgress from '@/components/2026/ui/ScrollProgress';
import BackToTop from '@/components/2026/ui/BackToTop';
import CustomCursor from '@/components/2026/ui/CustomCursor';
import type { Post } from '@/types/database';

export default function HomeShell({ posts, sidebarCollapsed }: { posts: Post[]; sidebarCollapsed?: boolean }) {

  return (
    <div className="ds-2026" style={{ minHeight: '100vh' }}>
      <AnalyticsTracker />
      <ScrollProgress />
      <CustomCursor />
      <Header />
      <Sidebar defaultCollapsed={sidebarCollapsed} />
      <MantecadoChat />
      <BackToTop />
      <main className="sidebar-main pt-20">
        <Hero />
        <Product />
        <Projects />
        <About />
        <Timeline />
        <Services />
        <BlogPreview posts={posts} />
        <Footer />
      </main>
    </div>
  );
}
