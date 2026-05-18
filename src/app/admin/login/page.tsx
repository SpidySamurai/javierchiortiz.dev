'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
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

  const inputStyle = (field: string): React.CSSProperties => ({
    padding: '11px 14px',
    borderRadius: 10,
    border: 'none',
    outline: focusedField === field ? '2px solid #8083ff' : '2px solid transparent',
    background: focusedField === field ? '#1a2340' : '#131b2e',
    color: '#dae2fd',
    fontSize: 14,
    fontFamily: 'var(--font-inter, system-ui, sans-serif)',
    transition: 'background 0.15s, outline-color 0.15s',
    width: '100%',
    boxSizing: 'border-box',
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b1326',
        backgroundImage:
          'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(128,131,255,0.08) 0%, transparent 70%)',
      }}
    >
      <div
        style={{
          width: 360,
          background: '#131b2e',
          borderRadius: 20,
          padding: '40px 36px',
          boxShadow: '0 0 0 1px #222a3d, 0 24px 64px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 4 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #8083ff 0%, #c0c1ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              boxShadow: '0 4px 16px rgba(128,131,255,0.35)',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 20, color: '#1000a9', fontVariationSettings: "'FILL' 1" }}
            >
              lock
            </span>
          </div>
          <h1
            style={{
              color: '#dae2fd',
              fontFamily: 'var(--font-manrope, system-ui, sans-serif)',
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
              letterSpacing: '-0.3px',
            }}
          >
            Admin
          </h1>
          <p
            style={{
              color: '#908fa0',
              fontFamily: 'var(--font-inter, system-ui, sans-serif)',
              fontSize: 13,
              margin: 0,
            }}
          >
            Sign in to access the CMS
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label
              style={{
                color: '#908fa0',
                fontFamily: 'var(--font-inter, system-ui, sans-serif)',
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              required
              style={inputStyle('email')}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label
              style={{
                color: '#908fa0',
                fontFamily: 'var(--font-inter, system-ui, sans-serif)',
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              required
              style={inputStyle('password')}
            />
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.2)',
                borderRadius: 8,
                padding: '10px 14px',
                color: '#f87171',
                fontFamily: 'var(--font-inter, system-ui, sans-serif)',
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
              padding: '12px 14px',
              borderRadius: 10,
              background: loading
                ? '#464554'
                : 'linear-gradient(135deg, #8083ff 0%, #c0c1ff 100%)',
              color: loading ? '#908fa0' : '#0f0060',
              fontWeight: 700,
              fontSize: 14,
              fontFamily: 'var(--font-inter, system-ui, sans-serif)',
              cursor: loading ? 'not-allowed' : 'pointer',
              border: 'none',
              transition: 'opacity 0.15s, background 0.15s',
              letterSpacing: '0.01em',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
