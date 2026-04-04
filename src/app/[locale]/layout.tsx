import type { Metadata } from 'next';
import { Manrope, Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { GamerCardProvider } from '@/components/providers/GamerCardContext';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

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
    keywords: ['Full Stack Developer', 'React', 'Next.js', 'TypeScript', 'NestJS', 'Portfolio', 'Frontend', 'Backend'],
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

export default async function RootLayout({
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
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className={`${manrope.variable} ${inter.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <GamerCardProvider>
            <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
              {children}
            </ThemeProvider>
          </GamerCardProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
