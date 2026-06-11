'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import SectionHeader from '@/app/admin/_components/SectionHeader';
import PasswordInput from '@/app/admin/_components/PasswordInput';

export default function SettingsPage() {
  const [current, setCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    // Re-authenticate with current password first
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      setError('Could not retrieve user session.');
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: current,
    });

    if (signInError) {
      setError('Current password is incorrect.');
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setCurrent('');
      setPassword('');
      setConfirm('');
    }
    setLoading(false);
  };


  return (
    <div className="flex-1 flex items-center justify-center">
    <div className="w-full max-w-[480px]">
      <div className="mb-8">
        <SectionHeader eyebrow="Account" title="Change" accent="Password" />
      </div>

      <div
        className="rounded-[14px] p-6"
        style={{ background: 'var(--ds-surface)', border: '1px solid var(--ds-surface-high)' }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Current password */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: 'var(--ds-on-surface-variant)' }}
            >
              Current password
            </label>
            <PasswordInput
              placeholder="Enter current password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              onFocus={() => setFocused('current')}
              onBlur={() => setFocused(null)}
              focused={focused === 'current'}
              leftIcon="lock"
              required
            />
          </div>

          <div className="h-px" style={{ background: 'var(--ds-surface-high)' }} />

          {/* New password */}
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
              leftIcon="lock_reset"
              required
            />
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: 'var(--ds-on-surface-variant)' }}
            >
              Confirm new password
            </label>
            <PasswordInput
              placeholder="Repeat new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onFocus={() => setFocused('confirm')}
              onBlur={() => setFocused(null)}
              focused={focused === 'confirm'}
              leftIcon="check_circle"
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

          {success && (
            <div
              className="flex items-center gap-2.5 px-3.5 py-[11px] rounded-lg text-[13px]"
              style={{
                background: 'rgba(74,222,128,0.08)',
                border: '1px solid rgba(74,222,128,0.2)',
                color: '#4ade80',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              Password updated successfully.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-3 rounded-[10px] font-bold text-sm border-none tracking-wide transition-opacity duration-150"
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
