'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import PasswordInput from '@/app/admin/_components/PasswordInput';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin/posts');
      router.refresh();
    }
  };

  return (
    <div className="ds-2026 flex min-h-screen" translate="no" style={{ fontFamily: 'var(--ds-font-body)' }}>

      {/* Left — brand panel */}
      <div
        className="hidden sm:flex shrink-0 flex-col justify-between p-12"
        style={{
          flex: '0 0 42%',
          background: 'var(--ds-bg)',
          borderRight: '1px solid var(--ds-surface-high)',
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 28, color: 'var(--ds-primary)', fontVariationSettings: "'FILL' 1" }}
        >
          manage_accounts
        </span>

        <div>
          <p
            className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3.5"
            style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Content Management
          </p>
          <h1
            className="text-[38px] font-black m-0 leading-[1.1] tracking-tighter uppercase"
            style={{ fontFamily: 'var(--ds-font-display)', color: 'var(--ds-on-surface)' }}
          >
            Javier<br /><em style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>Chi Ortíz</em>
          </h1>
          <div className="mt-6 flex flex-col gap-2">
            {[
              { label: 'Posts', icon: 'edit_note' },
              { label: 'Messages', icon: 'mail' },
              { label: 'Analytics', icon: 'bar_chart' },
            ].map(({ label, icon }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 text-[13px]"
                style={{ color: 'var(--ds-on-surface-variant)' }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 15, color: 'var(--ds-outline)', fontVariationSettings: "'FILL' 0" }}
                >
                  {icon}
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs" style={{ color: 'var(--ds-outline-variant)' }}>
          Set a new password for your account.
        </div>
      </div>

      {/* Right — form panel */}
      <div
        className="flex-1 flex items-center justify-center p-10"
        style={{ background: 'var(--ds-surface-container)' }}
      >
        <div className="w-full max-w-[360px]">
          <div className="mb-8">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.25em] block mb-1.5"
              style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Account Recovery
            </span>
            <h2
              className="text-[26px] font-black m-0 mb-2 tracking-tighter uppercase"
              style={{ fontFamily: 'var(--ds-font-display)', color: 'var(--ds-on-surface)' }}
            >
              New <em style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>password</em>
            </h2>
            <p className="text-[13px] m-0" style={{ color: 'var(--ds-outline)' }}>
              Choose a strong password for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                className="text-[11px] font-semibold uppercase tracking-[0.1em]"
                style={{ color: 'var(--ds-on-surface-variant)' }}
              >
                New password
              </label>
              <PasswordInput
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              focused={focused === 'password'}
              required
            />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-[11px] font-semibold uppercase tracking-[0.1em]"
                style={{ color: 'var(--ds-on-surface-variant)' }}
              >
                Confirm password
              </label>
              <PasswordInput
              placeholder="Repeat password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onFocus={() => setFocused('confirm')}
              onBlur={() => setFocused(null)}
              focused={focused === 'confirm'}
              leftIcon="lock_reset"
              required
            />
            </div>

            {error && (
              <div
                className="px-3.5 py-[11px] rounded-lg text-[13px]"
                style={{
                  background: 'rgba(248,113,113,0.08)',
                  border: '1px solid rgba(248,113,113,0.2)',
                  color: 'var(--ds-error)',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 px-4 py-3 rounded-[10px] font-bold text-sm border-none tracking-wide transition-opacity duration-150"
              style={{
                background: loading ? 'var(--ds-surface-high)' : 'var(--ds-primary)',
                color: loading ? 'var(--ds-outline)' : 'var(--ds-on-primary)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
