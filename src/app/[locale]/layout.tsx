import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { GamerCardProvider } from '@/components/providers/GamerCardContext';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });

  return {
    metadataBase: new URL('https://javierchiortiz.dev'),
    title: {
      default: 'Javier Chi — Full Stack Developer',
      template: '%s | Javier Chi',
    },
    description: t('hero_description'),
    keywords: [
      'Full Stack Developer',
      'React',
      'Next.js',
      'TypeScript',
      'NestJS',
      'Portfolio',
      'Frontend',
      'Backend',
    ],
    authors: [{ name: 'Javier Chi Ortíz', url: 'https://javierchiortiz.dev' }],
    creator: 'Javier Chi Ortíz',
    robots: { index: true, follow: true },
    openGraph: {
      title: 'Javier Chi — Full Stack Developer',
      description: t('hero_description'),
      url: 'https://javierchiortiz.dev',
      siteName: 'Javier Chi',
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Javier Chi — Full Stack Developer',
      description: t('hero_description'),
      creator: '@javierchi',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <GamerCardProvider>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </GamerCardProvider>
    </NextIntlClientProvider>
  );
}
