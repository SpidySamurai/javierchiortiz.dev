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
      className="w-full flex items-center gap-2.5 px-3 py-[9px] bg-transparent border-none cursor-pointer rounded-[9px] text-left text-[13px] font-medium transition-colors duration-100"
      style={{ color: 'var(--ds-outline)', fontFamily: 'var(--ds-font-body)' }}
      onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ds-outline)')}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
      Sign out
    </button>
  );
}
