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
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ds-on-surface)', margin: 0, fontFamily: 'var(--ds-font-display)' }}>
          Messages
        </h1>
        <p style={{ color: 'var(--ds-outline-variant)', fontSize: 13, margin: '4px 0 0' }}>
          {messages.length} {messages.length === 1 ? 'message' : 'messages'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              padding: '20px 24px',
              background: 'var(--ds-surface)',
              borderRadius: 14,
              border: '1px solid var(--ds-surface-high)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--ds-on-surface)', fontWeight: 600, fontSize: 14 }}>{msg.name}</span>
                <a
                  href={`mailto:${msg.email}`}
                  style={{
                    color: 'var(--ds-primary-container)',
                    fontSize: 12,
                    textDecoration: 'none',
                    padding: '2px 8px',
                    background: 'color-mix(in srgb, var(--ds-primary-container) 10%, transparent)',
                    borderRadius: 6,
                  }}
                >
                  {msg.email}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                <span style={{ color: 'var(--ds-outline-variant)', fontSize: 12 }}>
                  {new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <button
                  onClick={() => deleteMessage(msg.id)}
                  style={{ color: 'var(--ds-outline-variant)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 0 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ds-outline-variant)')}
                >
                  Delete
                </button>
              </div>
            </div>
            <p style={{ color: 'var(--ds-on-surface-variant)', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>
              {msg.message}
            </p>
          </div>
        ))}
        {messages.length === 0 && (
          <div
            style={{
              padding: 60,
              textAlign: 'center',
              color: 'var(--ds-outline-variant)',
              background: 'var(--ds-surface)',
              borderRadius: 14,
              border: '1px solid var(--ds-surface-high)',
            }}
          >
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
