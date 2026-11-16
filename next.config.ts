import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['react-icons/si', 'react-icons/tb'],
  },
  // The 2025 design (Portfolio Mk2) moved to its own repo and deploy. Temporary
  // redirects keep the old /2025 links working.
  async redirects() {
    return [
      {
        source: '/:locale(es|en)/2025',
        destination: 'https://mk2.javierchiortiz.dev/:locale',
        permanent: false,
      },
      {
        source: '/2025',
        destination: 'https://mk2.javierchiortiz.dev',
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
