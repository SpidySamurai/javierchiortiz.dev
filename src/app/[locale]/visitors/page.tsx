import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import VisitorsGlobe from '@/components/2026/sections/VisitorsGlobe';
import LeaveMemory from '@/components/2026/sections/LeaveMemory';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  return { title: t('visitors_title') };
}

export default function VisitorsPage() {
  return (
    <main>
      <VisitorsGlobe />
      <LeaveMemory />
    </main>
  );
}
