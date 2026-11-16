import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import WorkList from '@/components/2026/sections/work/WorkList';
import OpenSourceList from '@/components/2026/sections/work/OpenSourceList';
import Footer from '@/components/2026/sections/Footer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  return {
    title: `${t('work_title')} ${t('work_title_accent')}`,
    description: t('work_lead'),
    alternates: {
      canonical: `https://javierchiortiz.dev/${locale}/work`,
      languages: {
        en: 'https://javierchiortiz.dev/en/work',
        es: 'https://javierchiortiz.dev/es/work',
        'x-default': 'https://javierchiortiz.dev/en/work',
      },
    },
  };
}

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <WorkList locale={locale} />
      <OpenSourceList locale={locale} />
      <Footer />
    </>
  );
}
