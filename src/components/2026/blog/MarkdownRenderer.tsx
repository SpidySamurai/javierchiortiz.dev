import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import type { Components } from 'react-markdown';

function YouTubeEmbed({ id }: { id: string }) {
  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, margin: '2rem 0', borderRadius: 12, overflow: 'hidden' }}>
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
      />
    </div>
  );
}

const components: Components = {
  h1: ({ children }) => (
    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif', marginTop: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif', marginTop: '2rem', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--ds-on-surface)', fontFamily: 'var(--font-manrope), sans-serif', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
      {children}
    </h3>
  ),
  p: ({ children }) => {
    const text = Array.isArray(children)
      ? children.map((c) => (typeof c === 'string' ? c : '')).join('')
      : typeof children === 'string'
      ? children
      : '';
    const match = text.match(/^::youtube\[([^\]]+)\]$/);
    if (match) return <YouTubeEmbed id={match[1]} />;
    return (
      <p style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--font-inter), sans-serif', lineHeight: 1.8, marginBottom: '1.25rem', fontSize: '1rem' }}>
        {children}
      </p>
    );
  },
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ds-primary)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong style={{ color: 'var(--ds-on-surface)', fontWeight: 700 }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ color: 'var(--ds-on-surface)', fontStyle: 'italic' }}>{children}</em>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.startsWith('language-');
    if (isBlock) {
      return (
        <code style={{ display: 'block', background: 'var(--ds-surface)', color: 'var(--ds-primary)', fontFamily: 'monospace', fontSize: '0.875rem', padding: '1rem 1.25rem', borderRadius: 8, overflowX: 'auto', marginBottom: '1.25rem', lineHeight: 1.6 }}>
          {children}
        </code>
      );
    }
    return (
      <code style={{ background: 'var(--ds-surface)', color: 'var(--ds-primary)', fontFamily: 'monospace', fontSize: '0.85em', padding: '0.15em 0.4em', borderRadius: 4 }}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre style={{ margin: '1.25rem 0', background: 'transparent' }}>{children}</pre>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: '3px solid var(--ds-primary)', paddingLeft: '1.25rem', margin: '1.5rem 0', color: 'var(--ds-on-surface-variant)', fontStyle: 'italic', opacity: 0.85 }}>
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--font-inter), sans-serif', paddingLeft: '1.5rem', marginBottom: '1.25rem', lineHeight: 1.8, listStyleType: 'disc' }}>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol style={{ color: 'var(--ds-on-surface-variant)', fontFamily: 'var(--font-inter), sans-serif', paddingLeft: '1.5rem', marginBottom: '1.25rem', lineHeight: 1.8, listStyleType: 'decimal' }}>
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li style={{ marginBottom: '0.25rem' }}>{children}</li>
  ),
  hr: () => (
    <hr style={{ border: 'none', height: 1, background: 'var(--ds-outline-variant)', margin: '2rem 0', opacity: 0.4 }} />
  ),
  img: ({ src, alt }) => (
    <img src={src} alt={alt ?? ''} style={{ maxWidth: '100%', borderRadius: 8, margin: '1.5rem 0' }} />
  ),
};

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
