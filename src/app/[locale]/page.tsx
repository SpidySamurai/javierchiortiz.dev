'use client';

import Header from '@/components/2026/layout/Header';
import Sidebar from '@/components/2026/layout/Sidebar';
import Hero from '@/components/2026/sections/Hero';
import Timeline from '@/components/2026/sections/Timeline';
import Projects from '@/components/2026/sections/Projects';
import Stack from '@/components/2026/sections/Stack';
import About from '@/components/2026/sections/About';
import Footer from '@/components/2026/sections/Footer';
import FlatCat from '@/components/FlatCat';
import { useGamerCard } from '@/components/providers/GamerCardContext';

export default function Home() {
  const { unlockCard } = useGamerCard();

  return (
    <div style={{ backgroundColor: '#0b1326', color: '#dae2fd', minHeight: '100vh' }}>
      <Header />
      <Sidebar />
      <FlatCat onUnlock={unlockCard} />
      <main className="lg:ml-64 pt-20">
        <Hero />
        <Timeline />
        <Projects />
        <Stack />
        <About />
        <Footer />
      </main>
    </div>
  );
}
