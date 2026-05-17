'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0f',
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <h1
          style={{
            color: '#c0c1ff',
            fontFamily: 'sans-serif',
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Admin
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #2a2a3a',
            background: '#12121a',
            color: '#e2e8f0',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #2a2a3a',
            background: '#12121a',
            color: '#e2e8f0',
            fontSize: 14,
            outline: 'none',
          }}
        />
        {error && <p style={{ color: '#f87171', fontSize: 13, margin: 0 }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: '#c0c1ff',
            color: '#0a0a0f',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            border: 'none',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
