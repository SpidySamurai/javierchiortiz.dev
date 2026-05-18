'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/admin/posts', label: 'Posts', icon: 'edit_note' },
  { href: '/admin/messages', label: 'Messages', icon: 'mail' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'bar_chart' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {NAV.map(({ href, label, icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 12px',
              borderRadius: 9,
              fontSize: 13,
              fontWeight: active ? 600 : 500,
              color: active ? '#c0c1ff' : '#464554',
              textDecoration: 'none',
              background: active ? 'rgba(128,131,255,0.1)' : 'transparent',
              transition: 'background 0.1s, color 0.1s',
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.background = '#131b2e';
                e.currentTarget.style.color = '#908fa0';
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#464554';
              }
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 18,
                fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                color: active ? '#8083ff' : 'inherit',
              }}
            >
              {icon}
            </span>
            {label}
            {active && (
              <div
                style={{
                  marginLeft: 'auto',
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: '#8083ff',
                  flexShrink: 0,
                }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
