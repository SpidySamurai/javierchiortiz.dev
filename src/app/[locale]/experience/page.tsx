import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Timeline from '@/components/2026/sections/Timeline';
import Footer from '@/components/2026/sections/Footer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  return { title: `${t('experience')} — Javier Chi` };
}

export default function ExperiencePage() {
  return (
    <>
      <Timeline />
      <Footer />
    </>
  );
}
