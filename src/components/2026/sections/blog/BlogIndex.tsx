'use client';

import { useState } from 'react';
import { BlogRow } from '@/components/2026/sections/blog/BlogRow';
import type { BlogRowItem } from '@/lib/blogPostRow';

const HAIRLINE = 'color-mix(in srgb, var(--ds-on-surface) 7%, transparent)';
const ALL = '__all__';

export interface BlogCategoryTab {
  key: string;
  label: string;
}

/**
 * The blog index list: text tabs filter the posts by category on the client, each post is the
 * same BlogRow the home shows. Everything arrives already localized.
 */
export function BlogIndex({
  items,
  tabs,
  locale,
  allLabel,
  filterLabel,
  readLabel,
}: {
  items: BlogRowItem[];
  tabs: BlogCategoryTab[];
  locale: string;
  allLabel: string;
  filterLabel: string;
  readLabel: string;
}) {
  const [active, setActive] = useState(ALL);
  const visible = active === ALL ? items : items.filter((i) => i.categoryKey === active);
  const allTabs = [{ key: ALL, label: allLabel }, ...tabs];

  return (
    <div>
      {tabs.length > 1 && (
        <div
          role="group"
          aria-label={filterLabel}
          className="flex flex-wrap gap-x-7 gap-y-1 mb-2"
          style={{ boxShadow: `0 1px 0 ${HAIRLINE}` }}
        >
          {allTabs.map(({ key, label }) => {
            const isActive = key === active;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={isActive}
                data-blog-tab={key}
                onClick={() => setActive(key)}
                className="py-3 text-sm font-bold tracking-[0.04em] transition-colors duration-200 hover:text-[color:var(--ds-on-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:rounded focus-visible:[outline-color:var(--ds-primary)]"
                style={{
                  color: isActive ? 'var(--ds-on-surface)' : 'var(--ds-on-surface-variant)',
                  fontFamily: 'var(--font-manrope), sans-serif',
                  boxShadow: isActive ? 'inset 0 -2px 0 var(--ds-primary)' : 'none',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-col">
        {visible.map(({ row }) => (
          <BlogRow
            key={row.slug}
            post={row}
            href={`/${locale}/blog/${row.slug}`}
            readLabel={readLabel}
          />
        ))}
      </div>
    </div>
  );
}
