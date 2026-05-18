'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 12px',
        background: 'transparent',
        border: 'none',
        color: '#464554',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        borderRadius: 9,
        textAlign: 'left',
        fontFamily: 'var(--font-inter, system-ui, sans-serif)',
        transition: 'color 0.1s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
      onMouseLeave={(e) => (e.currentTarget.style.color = '#464554')}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: 18 }}
      >
        logout
      </span>
      Sign out
    </button>
  );
}
