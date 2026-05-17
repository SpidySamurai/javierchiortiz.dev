'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ContactMessage } from '@/types/database';

export default function MessageList({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const supabase = createClient();

  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await supabase.from('contact_messages').delete().eq('id', id);
    setMessages((m) => m.filter((msg) => msg.id !== id));
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', marginBottom: 24 }}>Messages</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ padding: 20, background: '#12121a', borderRadius: 12, border: '1px solid #1e1e2e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 15 }}>{msg.name}</span>
                <a
                  href={`mailto:${msg.email}`}
                  style={{ color: '#64748b', fontSize: 13, marginLeft: 8, textDecoration: 'none' }}
                >
                  {msg.email}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                <span style={{ color: '#475569', fontSize: 12 }}>
                  {new Date(msg.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </span>
                <button
                  onClick={() => deleteMessage(msg.id)}
                  style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 0 }}
                >
                  Delete
                </button>
              </div>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>
              {msg.message}
            </p>
          </div>
        ))}
        {messages.length === 0 && (
          <p style={{ color: '#475569', textAlign: 'center', padding: 60, margin: 0 }}>No messages yet.</p>
        )}
      </div>
    </div>
  );
}
