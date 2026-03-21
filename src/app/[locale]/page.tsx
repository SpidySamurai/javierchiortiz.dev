import Header from '@/components/2026/layout/Header';
import Hero from '@/components/2026/sections/Hero';
import Timeline from '@/components/2026/sections/Timeline';
import Projects from '@/components/2026/sections/Projects';
import About from '@/components/2026/sections/About';
import Footer from '@/components/2026/sections/Footer';

export default function Home() {
  return (
    <div className="ds-2026 min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Projects />
        <Timeline />
        <About />
      </main>
      <Footer />
    </div>
  );
}
