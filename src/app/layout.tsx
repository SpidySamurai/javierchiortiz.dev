import { Manrope, Inter } from 'next/font/google';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        {/* Sets sidebar CSS var before first paint — eliminates hydration flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var c=localStorage.getItem('sidebar-collapsed')==='true';document.documentElement.style.setProperty('--sidebar-w',c?'4rem':'16rem');if(c)document.documentElement.setAttribute('data-sidebar-collapsed','')}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${manrope.variable} ${inter.variable} antialiased`} style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
