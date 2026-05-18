import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import SignOutButton from './_components/SignOutButton';

const NAV = [
  { href: '/admin/posts', label: 'Posts', icon: 'edit_note' },
  { href: '/admin/messages', label: 'Messages', icon: 'mail' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'bar_chart' },
];

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
        backgroundColor: '#0b1326',
        fontFamily: 'var(--font-inter, system-ui, sans-serif)',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          flexShrink: 0,
          backgroundColor: '#131b2e',
          borderRight: '1px solid #222a3d',
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 16px',
          gap: 4,
        }}
      >
        {/* Logo */}
        <div style={{ padding: '0 12px', marginBottom: 28 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #8083ff 0%, #c0c1ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              boxShadow: '0 4px 12px rgba(128,131,255,0.3)',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16, color: '#1000a9', fontVariationSettings: "'FILL' 1" }}
            >
              manage_accounts
            </span>
          </div>
          <span
            style={{
              color: '#dae2fd',
              fontWeight: 700,
              fontSize: 15,
              display: 'block',
              fontFamily: 'var(--font-manrope, system-ui, sans-serif)',
            }}
          >
            CMS
          </span>
          <span
            style={{
              color: '#464554',
              fontSize: 11,
              display: 'block',
              marginTop: 2,
            }}
          >
            {user.email}
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 500,
                color: '#908fa0',
                textDecoration: 'none',
                transition: 'background 0.1s, color 0.1s',
              }}
              className="admin-nav-link"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18, fontVariationSettings: "'FILL' 0" }}
              >
                {icon}
              </span>
              {label}
            </Link>
          ))}
        </nav>

        {/* Sign out */}
        <div
          style={{
            borderTop: '1px solid #222a3d',
            paddingTop: 12,
            marginTop: 8,
          }}
        >
          <SignOutButton />
        </div>
      </aside>

      {/* Main */}
      <main
        style={{
          flex: 1,
          padding: '36px 40px',
          overflowY: 'auto',
          color: '#dae2fd',
          minWidth: 0,
        }}
      >
        {children}
      </main>

      <style>{`
        .admin-nav-link:hover {
          background: #1a2340;
          color: #c7c4d7;
        }
      `}</style>
    </div>
  );
}
