'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin/posts');
      router.refresh();
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--ds-font-body)' }}>

      {/* Left — brand panel */}
      <div
        style={{
          flex: '0 0 42%',
          background: 'var(--ds-bg)',
          borderRight: '1px solid #1a2340',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 52px',
        }}
        className="admin-brand-panel"
      >
        {/* Top: initials badge */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'linear-gradient(135deg, var(--ds-primary-container), var(--ds-primary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px color-mix(in srgb, var(--ds-primary-container) 30%, transparent)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--ds-font-display)',
              fontWeight: 800,
              fontSize: 16,
              color: '#0f0060',
              letterSpacing: '-0.5px',
            }}
          >
            JC
          </span>
        </div>

        {/* Center: identity */}
        <div>
          <p
            style={{
              color: '#5e5c72',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              margin: '0 0 14px',
            }}
          >
            Content Management
          </p>
          <h1
            style={{
              fontFamily: 'var(--ds-font-display)',
              fontWeight: 800,
              fontSize: 38,
              color: 'var(--ds-on-surface)',
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: '-1px',
            }}
          >
            Javier<br />Chi Ortíz
          </h1>
          <div
            style={{
              marginTop: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {['Posts', 'Messages', 'Analytics'].map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  color: '#424060',
                  fontSize: 13,
                }}
              >
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#424060' }} />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: portfolio link */}
        <Link
          href="/"
          style={{
            color: '#6b6880',
            fontSize: 12,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ds-outline)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#6b6880')}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_back</span>
          Back to portfolio
        </Link>
      </div>

      {/* Right — form panel */}
      <div
        style={{
          flex: 1,
          background: '#060d1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 40px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ marginBottom: 36 }}>
            <h2
              style={{
                fontFamily: 'var(--ds-font-display)',
                fontWeight: 700,
                fontSize: 22,
                color: 'var(--ds-on-surface)',
                margin: '0 0 6px',
                letterSpacing: '-0.3px',
              }}
            >
              Sign in
            </h2>
            <p style={{ color: '#6b6880', fontSize: 13, margin: 0 }}>
              Access restricted to authorized users.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label style={{ color: '#6b6880', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                required
                style={{
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: 'none',
                  outline: focused === 'email' ? '2px solid var(--ds-primary-container)' : '2px solid #1a2340',
                  background: focused === 'email' ? '#0f1e3a' : 'var(--ds-bg)',
                  color: 'var(--ds-on-surface)',
                  fontSize: 14,
                  transition: 'outline-color 0.15s, background 0.15s',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label style={{ color: '#6b6880', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                required
                style={{
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: 'none',
                  outline: focused === 'password' ? '2px solid var(--ds-primary-container)' : '2px solid #1a2340',
                  background: focused === 'password' ? '#0f1e3a' : 'var(--ds-bg)',
                  color: 'var(--ds-on-surface)',
                  fontSize: 14,
                  transition: 'outline-color 0.15s, background 0.15s',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  padding: '11px 14px',
                  borderRadius: 8,
                  background: 'rgba(248,113,113,0.06)',
                  border: '1px solid rgba(248,113,113,0.18)',
                  color: '#f87171',
                  fontSize: 13,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4,
                padding: '13px 16px',
                borderRadius: 10,
                background: loading ? '#1a2340' : 'linear-gradient(135deg, var(--ds-primary-container), var(--ds-primary))',
                color: loading ? '#6b6880' : '#0f0060',
                fontWeight: 700,
                fontSize: 14,
                cursor: loading ? 'not-allowed' : 'pointer',
                border: 'none',
                transition: 'opacity 0.15s',
                letterSpacing: '0.01em',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .admin-brand-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
