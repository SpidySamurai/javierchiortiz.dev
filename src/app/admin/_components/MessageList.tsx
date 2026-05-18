'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ContactMessage } from '@/types/database';
import SectionHeader from '@/app/admin/_components/SectionHeader';

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
      <div className="mb-7">
        <SectionHeader
          eyebrow="Inbox"
          title="Contact"
          accent="Messages"
          subtitle={`${messages.length} ${messages.length === 1 ? 'message' : 'messages'}`}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="px-6 py-5 rounded-[14px]"
            style={{
              background: 'var(--ds-surface)',
              border: '1px solid var(--ds-surface-high)',
            }}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-semibold text-[14px]" style={{ color: 'var(--ds-on-surface)' }}>
                  {msg.name}
                </span>
                <a
                  href={`mailto:${msg.email}`}
                  className="text-[12px] no-underline px-2 py-0.5 rounded-md"
                  style={{
                    color: 'var(--ds-primary-container)',
                    background: 'color-mix(in srgb, var(--ds-primary-container) 10%, transparent)',
                  }}
                >
                  {msg.email}
                </a>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[12px]" style={{ color: 'var(--ds-outline-variant)' }}>
                  {new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="border-none bg-transparent cursor-pointer text-[13px] p-0 transition-colors duration-100"
                  style={{ color: 'var(--ds-outline-variant)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ds-outline-variant)')}
                >
                  Delete
                </button>
              </div>
            </div>
            <p
              className="text-[14px] leading-[1.7] whitespace-pre-wrap m-0"
              style={{ color: 'var(--ds-on-surface-variant)' }}
            >
              {msg.message}
            </p>
          </div>
        ))}
        {messages.length === 0 && (
          <div
            className="py-[60px] text-center rounded-[14px]"
            style={{
              color: 'var(--ds-outline-variant)',
              background: 'var(--ds-surface)',
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
