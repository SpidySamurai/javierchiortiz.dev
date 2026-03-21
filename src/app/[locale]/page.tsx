import Header from '@/components/2026/layout/Header';
import Sidebar from '@/components/2026/layout/Sidebar';
import Hero from '@/components/2026/sections/Hero';
import Timeline from '@/components/2026/sections/Timeline';
import Projects from '@/components/2026/sections/Projects';
import Footer from '@/components/2026/sections/Footer';

export default function Home() {
  return (
    <div style={{ backgroundColor: '#0b1326', color: '#dae2fd', minHeight: '100vh' }}>
      <Header />
      <Sidebar />
      <main className="lg:ml-64 pt-20">
        <Hero />
        <Timeline />
        <Projects />
        <Footer />
      </main>
    </div>
  );
}
