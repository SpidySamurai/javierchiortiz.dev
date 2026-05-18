import { createClient } from '@/lib/supabase/server';
import AdminNav from './_components/AdminNav';
import SignOutButton from './_components/SignOutButton';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import '../globals.css';

const PUBLIC_ADMIN_PAGES = ['/admin/login', '/admin/forgot-password', '/admin/reset-password'];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  // x-pathname is set by our middleware — not exposed to external clients
  // (middleware runs before this, so this is safe for routing logic)
  const pathname = headersList.get('x-pathname') ?? '';

  if (PUBLIC_ADMIN_PAGES.includes(pathname)) return <>{children}</>;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  return (
    <div className="ds-2026 flex min-h-screen" translate="no">
      <aside
        className="shrink-0 flex flex-col px-4 py-7 gap-1"
        style={{
          width: 220,
          backgroundColor: 'var(--ds-surface)',
          borderRight: '1px solid var(--ds-surface-high)',
        }}
      >
        <div className="px-3 mb-7">
          <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center mb-3"
            style={{
              background: 'linear-gradient(135deg, var(--ds-primary-container) 0%, var(--ds-primary) 100%)',
              boxShadow: '0 4px 12px rgba(128,131,255,0.3)',
            }}
          >
            <span
              className="material-symbols-outlined text-base"
              style={{ color: 'var(--ds-on-primary)', fontVariationSettings: "'FILL' 1" }}
            >
              manage_accounts
            </span>
          </div>
          <span
            className="block text-[15px] font-bold"
            style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--ds-font-display)' }}
          >
            CMS
          </span>
          <span className="block text-[11px] mt-0.5" style={{ color: 'var(--ds-outline-variant)' }}>
            {user.email}
          </span>
        </div>

        <div className="flex-1">
          <AdminNav />
        </div>

        <div className="pt-3 mt-2" style={{ borderTop: '1px solid var(--ds-surface-high)' }}>
          <SignOutButton />
        </div>
      </aside>

      <main
        className="flex-1 flex flex-col overflow-y-auto min-w-0"
        style={{ padding: '36px 40px', color: 'var(--ds-on-surface)' }}
      >
        {children}
      </main>
    </div>
  );
}
