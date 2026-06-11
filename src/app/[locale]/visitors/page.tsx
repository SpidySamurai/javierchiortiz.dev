import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import VisitorsGlobe from '@/components/2026/sections/VisitorsGlobe';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  return {
    title: t('visitors_title'),
    alternates: {
      canonical: `https://javierchiortiz.dev/${locale}/visitors`,
      languages: {
        en: 'https://javierchiortiz.dev/en/visitors',
        es: 'https://javierchiortiz.dev/es/visitors',
        'x-default': 'https://javierchiortiz.dev/en/visitors',
      },
    },
  };
}

export default function VisitorsPage() {
  return (
    <>
      <VisitorsGlobe />
    </>
  );
}
