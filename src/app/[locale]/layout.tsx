import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import Header from '@/components/layout/Header';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });

  return {
    title: 'Javier Chi Ortíz',
    description: t('hero_description'),
    keywords: ['Desarrollador Web', 'Full Stack', 'React', 'Next.js', 'Portafolio'],
    authors: [{ name: 'Javier Chi Ortíz' }],
    openGraph: {
      title: 'Javier Chi Ortíz',
      description: t('hero_description'),
      url: 'https://javierchiortiz.dev',
      siteName: 'Javier Chi Ortíz',
      images: [
        {
          url: 'https://javierchiortiz.dev/utils/img/portfolio-personal-live-screenshot.png',
          width: 1200,
          height: 630,
        },
      ],
      locale: locale === 'es' ? 'es-ES' : 'en-US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Javier Chi Ortíz',
      description: t('hero_description'),
      images: ['https://javierchiortiz.dev/utils/img/portfolio-personal-live-screenshot.png'],
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

  // Ensure that the incoming `locale` is valid
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
            <Header />
            <main>{children}</main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
