import Header from '@/components/2026/layout/Header';
import Sidebar from '@/components/2026/layout/Sidebar';
import ScrollProgress from '@/components/2026/ui/ScrollProgress';
import BackToTop from '@/components/2026/ui/BackToTop';
import { getSidebarCollapsed } from '@/lib/sidebarState';

export default async function ExperienceLayout({ children }: { children: React.ReactNode }) {
  const sidebarCollapsed = await getSidebarCollapsed();

  return (
    <div className="ds-2026" style={{ minHeight: '100vh', backgroundColor: 'var(--ds-bg)' }}>
      <ScrollProgress />
      <Header />
      <Sidebar defaultCollapsed={sidebarCollapsed} />
      <main className="sidebar-main pt-20">
        {children}
      </main>
      <BackToTop />
    </div>
  );
}
