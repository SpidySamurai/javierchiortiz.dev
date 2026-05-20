'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/admin/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
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

        <Link
          href="/admin/login"
          className="flex items-center gap-1.5 text-xs no-underline transition-colors duration-150"
          style={{ color: 'var(--ds-outline)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ds-on-surface-variant)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ds-outline)')}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
          Back to sign in
        </Link>
      </div>

      {/* Right — form panel */}
      <div
        className="flex-1 flex items-center justify-center p-10"
        style={{ background: 'var(--ds-surface-container)' }}
      >
        <div className="w-full max-w-[360px]">
          {sent ? (
            <div className="flex flex-col gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'color-mix(in srgb, var(--ds-primary) 15%, transparent)' }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 24, color: 'var(--ds-primary)', fontVariationSettings: "'FILL' 1" }}
                >
                  mark_email_read
                </span>
              </div>
              <div>
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.25em] block mb-1.5"
                  style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  Check your inbox
                </span>
                <h2
                  className="text-[26px] font-black m-0 mb-2 tracking-tighter uppercase"
                  style={{ fontFamily: 'var(--ds-font-display)', color: 'var(--ds-on-surface)' }}
                >
                  Email <em style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>sent</em>
                </h2>
                <p className="text-[13px] m-0 leading-relaxed" style={{ color: 'var(--ds-outline)' }}>
                  Password reset link sent to <span style={{ color: 'var(--ds-on-surface-variant)' }}>{email}</span>. Check your inbox.
                </p>
              </div>
              <Link
                href="/admin/login"
                className="flex items-center gap-1.5 text-[13px] no-underline mt-2"
                style={{ color: 'var(--ds-primary)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
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
                  Reset <em style={{ color: 'var(--ds-primary)', fontStyle: 'italic' }}>password</em>
                </h2>
                <p className="text-[13px] m-0" style={{ color: 'var(--ds-outline)' }}>
                  Enter your email and we&apos;ll send a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[11px] font-semibold uppercase tracking-[0.1em]"
                    style={{ color: 'var(--ds-on-surface-variant)' }}
                  >
                    Email
                  </label>
                  <div className="relative">
                    <span
                      className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{
                        fontSize: 18,
                        color: focused ? 'var(--ds-primary-container)' : 'var(--ds-outline)',
                        fontVariationSettings: "'FILL' 0",
                        transition: 'color 0.15s',
                      }}
                    >
                      person
                    </span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      required
                      className="pl-10 pr-4 py-3 rounded-[10px] border-none text-sm w-full box-border transition-[outline-color] duration-150"
                      style={{
                        outline: focused ? '2px solid var(--ds-primary-container)' : '2px solid var(--ds-surface-high)',
                        background: 'var(--ds-surface)',
                        color: 'var(--ds-on-surface)',
                      }}
                    />
                  </div>
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
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>

                <Link
                  href="/admin/login"
                  className="text-center text-[13px] no-underline transition-colors duration-150"
                  style={{ color: 'var(--ds-outline)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ds-on-surface-variant)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ds-outline)')}
                >
                  Back to sign in
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
