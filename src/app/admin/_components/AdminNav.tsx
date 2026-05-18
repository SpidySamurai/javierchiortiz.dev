'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/admin/posts', label: 'Posts', icon: 'edit_note' },
  { href: '/admin/messages', label: 'Messages', icon: 'mail' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'bar_chart' },
  { href: '/admin/settings', label: 'Settings', icon: 'settings' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.map(({ href, label, icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 px-3 py-[9px] rounded-[9px] text-[13px] no-underline transition-[background,color] duration-100"
            style={{
              fontWeight: active ? 600 : 500,
              color: active ? 'var(--ds-primary)' : 'var(--ds-outline)',
              background: active ? 'color-mix(in srgb, var(--ds-primary-container) 15%, transparent)' : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.background = 'var(--ds-surface-container)';
                e.currentTarget.style.color = 'var(--ds-on-surface-variant)';
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--ds-outline)';
              }
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 18,
                fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                color: active ? 'var(--ds-primary-container)' : 'inherit',
              }}
            >
              {icon}
            </span>
            {label}
            {active && (
              <div
                className="ml-auto w-1 h-1 rounded-full shrink-0"
                style={{ background: 'var(--ds-primary-container)' }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
