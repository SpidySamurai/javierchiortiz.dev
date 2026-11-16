import Header from '@/components/2026/layout/Header';
import ScrollProgress from '@/components/2026/ui/ScrollProgress';
import BackToTop from '@/components/2026/ui/BackToTop';
import BackBreadcrumb from '@/components/2026/ui/BackBreadcrumb';

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ds-2026" style={{ minHeight: '100vh', backgroundColor: 'var(--ds-bg)' }}>
      <ScrollProgress />
      <Header />
      <main className="pt-20">
        <BackBreadcrumb />
        {children}
      </main>
      <BackToTop />
    </div>
  );
}
