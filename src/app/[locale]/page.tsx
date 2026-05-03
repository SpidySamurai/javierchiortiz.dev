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
import FlatCat from '@/components/FlatCat';
import ScrollProgress from '@/components/2026/ui/ScrollProgress';
import BackToTop from '@/components/2026/ui/BackToTop';
import CustomCursor from '@/components/2026/ui/CustomCursor';
import { useGamerCard } from '@/components/providers/GamerCardContext';

export default function Home() {
  const { unlockCard } = useGamerCard();

  return (
    <div className="ds-2026" style={{ minHeight: '100vh' }}>
      <ScrollProgress />
      <CustomCursor />
      <Header />
      <Sidebar />
      <FlatCat onUnlock={unlockCard} />
      <BackToTop />
      <main className="xl:ml-64 pt-20">
        <Hero />
        <Timeline />
        <Product />
        <Projects />
        <About />
        <BlogPreview />
        <Footer />
      </main>
    </div>
  );
}
