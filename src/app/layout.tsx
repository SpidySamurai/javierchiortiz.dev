import { Manrope, Inter } from 'next/font/google';
import { headers, cookies } from 'next/headers';
import ConsoleBanner from '@/components/ConsoleBanner';

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [headersList, cookieStore] = await Promise.all([headers(), cookies()]);
  const locale = headersList.get('x-locale') ?? 'en';
  const theme = cookieStore.get('theme')?.value ?? 'dark';
  const collapsed = cookieStore.get('sidebar-collapsed')?.value === 'true';

  return (
    <html
      lang={locale}
      data-theme={theme}
      data-scroll-behavior="smooth"
      {...(collapsed ? { 'data-sidebar-collapsed': '' } : {})}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        className={`${manrope.variable} ${inter.variable} antialiased`}
        style={{ margin: 0, padding: 0 }}
      >
        <ConsoleBanner />
        {children}
      </body>
    </html>
  );
}
