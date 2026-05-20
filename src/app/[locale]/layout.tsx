import type { Metadata } from 'next';
import '../globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { GamerCardProvider } from '@/components/providers/GamerCardContext';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });

  const title = 'Javier Chi — Freelance Full Stack Engineer · Next.js · SaaS · AI Automation';
  const description = t('meta_description');

  return {
    metadataBase: new URL('https://javierchiortiz.dev'),
    title: {
      default: title,
      template: '%s | Javier Chi',
    },
    description,
    keywords: [
      'Full Stack Developer',
      'Full Stack Engineer',
      'Freelance Developer',
      'Next.js Developer',
      'SaaS Developer',
      'AI Automation Developer',
      'React',
      'TypeScript',
      'NestJS',
      'Freelance',
      'For Hire',
      'US Market',
      'Remote Developer',
    ],
    authors: [{ name: 'Javier Fernando Chi Ortiz', url: 'https://javierchiortiz.dev' }],
    creator: 'Javier Fernando Chi Ortiz',
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: 'https://javierchiortiz.dev',
      siteName: 'Javier Chi',
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Javier Fernando Chi Ortiz',
    url: 'https://javierchiortiz.dev',
    jobTitle: 'Full Stack Engineer',
    sameAs: [
      'https://www.linkedin.com/in/javier-fernando-chi-ortiz/',
      'https://github.com/SpidySamurai',
    ],
  };

  return (
    <PostHogProvider>
      <NextIntlClientProvider messages={messages}>
        <GamerCardProvider>
          <ThemeProvider attribute="data-theme" defaultTheme="dark" enableColorScheme={false}>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
          </ThemeProvider>
        </GamerCardProvider>
      </NextIntlClientProvider>
    </PostHogProvider>
  );
}
