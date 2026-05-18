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
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#dae2fd', margin: 0, fontFamily: 'var(--font-manrope, system-ui, sans-serif)' }}>
          Messages
        </h1>
        <p style={{ color: '#464554', fontSize: 13, margin: '4px 0 0' }}>
          {messages.length} {messages.length === 1 ? 'message' : 'messages'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              padding: '20px 24px',
              background: '#131b2e',
              borderRadius: 14,
              border: '1px solid #222a3d',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ color: '#dae2fd', fontWeight: 600, fontSize: 14 }}>{msg.name}</span>
                <a
                  href={`mailto:${msg.email}`}
                  style={{
                    color: '#8083ff',
                    fontSize: 12,
                    textDecoration: 'none',
                    padding: '2px 8px',
                    background: 'rgba(128,131,255,0.1)',
                    borderRadius: 6,
                  }}
                >
                  {msg.email}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                <span style={{ color: '#464554', fontSize: 12 }}>
                  {new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <button
                  onClick={() => deleteMessage(msg.id)}
                  style={{ color: '#464554', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: 0 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#464554')}
                >
                  Delete
                </button>
              </div>
            </div>
            <p style={{ color: '#c7c4d7', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>
              {msg.message}
            </p>
          </div>
        ))}
        {messages.length === 0 && (
          <div
            style={{
              padding: 60,
              textAlign: 'center',
              color: '#464554',
              background: '#131b2e',
              borderRadius: 14,
              border: '1px solid #222a3d',
            }}
          >
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
