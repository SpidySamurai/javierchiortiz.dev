import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import SignOutButton from './_components/SignOutButton';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already redirects unauthenticated users to /admin/login.
  // Rendering children here avoids an infinite redirect loop on the login page itself.
  if (!user) return <>{children}</>;

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#0a0a0f',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <nav
        style={{
          width: 200,
          borderRight: '1px solid #1a1a2e',
          padding: '2rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: '#c0c1ff',
            fontWeight: 700,
            fontSize: 16,
            marginBottom: 24,
            paddingLeft: 12,
            display: 'block',
          }}
        >
          CMS
        </span>
        {[
          { href: '/admin/posts', label: 'Posts' },
          { href: '/admin/messages', label: 'Messages' },
          { href: '/admin/analytics', label: 'Analytics' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              color: '#94a3b8',
              padding: '8px 12px',
              borderRadius: 6,
              fontSize: 14,
              textDecoration: 'none',
              display: 'block',
            }}
          >
            {label}
          </Link>
        ))}
        <div style={{ marginTop: 'auto' }}>
          <SignOutButton />
        </div>
      </nav>
      <main style={{ flex: 1, padding: '2rem', color: '#e2e8f0', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
