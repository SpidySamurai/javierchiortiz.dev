'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const t = useTranslations('common');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid color-mix(in srgb, var(--ds-outline-variant) 50%, transparent)',
    backgroundColor: 'var(--ds-surface)',
    color: 'var(--ds-on-surface)',
    fontFamily: 'var(--font-inter), sans-serif',
    fontSize: '0.875rem',
    outline: 'none',
  };

  return (
    <section
      id="contact"
      className="py-24 px-8 md:px-16"
      style={{ backgroundColor: 'var(--ds-bg)' }}
    >
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-2 mb-12"
        >
          <span
            className="text-xs uppercase tracking-[0.3em] font-bold block"
            style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {t('contact_label')}
          </span>
          <h2
            className="text-3xl md:text-4xl font-black uppercase tracking-tighter"
            style={{ color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif' }}
          >
            {t('contact_heading')}
          </h2>
        </motion.div>

        {status === 'sent' ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
            style={{ color: 'var(--ds-primary)', fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {t('contact_success')}
          </motion.p>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                required
                placeholder={t('contact_name')}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                style={inputStyle}
              />
              <input
                required
                type="email"
                placeholder={t('contact_email')}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <textarea
              required
              rows={5}
              placeholder={t('contact_message')}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
            {status === 'error' && (
              <p className="text-sm" style={{ color: '#f87171' }}>
                {t('contact_error')}
              </p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-3 px-6 rounded-lg font-semibold text-sm transition-opacity disabled:opacity-50"
              style={{
                backgroundColor: 'var(--ds-primary)',
                color: 'var(--ds-on-primary, #fff)',
                fontFamily: 'var(--font-manrope), sans-serif',
              }}
            >
              {status === 'sending' ? t('contact_sending') : t('contact_submit')}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
}
