'use client';

import Header from '@/components/2026/layout/Header';
import Sidebar from '@/components/2026/layout/Sidebar';
import ScrollProgress from '@/components/2026/ui/ScrollProgress';
import BackToTop from '@/components/2026/ui/BackToTop';

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ds-2026" style={{ minHeight: '100vh', backgroundColor: 'var(--ds-bg)' }}>
      <ScrollProgress />
      <Header />
      <Sidebar />
      <main className="sidebar-main pt-20">
        {children}
      </main>
      <BackToTop />
    </div>
  );
}
