import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import type { Components } from 'react-markdown';
import type { Options } from 'rehype-pretty-code';

function YouTubeEmbed({ id }: { id: string }) {
  return (
    <div
      style={{
        position: 'relative',
        paddingBottom: '56.25%',
        height: 0,
        margin: '2rem 0',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    </div>
  );
}

const prettyCodeOptions: Options = {
  theme: 'github-dark-dimmed',
  keepBackground: false,
};

const components: Components = {
  h1: ({ children }) => (
    <h1
      style={{
        fontSize: '2rem',
        fontWeight: 900,
        color: 'var(--ds-on-surface)',
        fontFamily: 'var(--font-manrope), sans-serif',
        marginTop: '2.5rem',
        marginBottom: '1rem',
        letterSpacing: '-0.02em',
        lineHeight: 1.15,
      }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      style={{
        fontSize: '1.4rem',
        fontWeight: 700,
        color: 'var(--ds-on-surface)',
        fontFamily: 'var(--font-manrope), sans-serif',
        marginTop: '2rem',
        marginBottom: '0.75rem',
        letterSpacing: '-0.01em',
      }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      style={{
        fontSize: '1.1rem',
        fontWeight: 700,
        color: 'var(--ds-on-surface)',
        fontFamily: 'var(--font-manrope), sans-serif',
        marginTop: '1.5rem',
        marginBottom: '0.5rem',
      }}
    >
      {children}
    </h3>
  ),
  p: ({ children }) => {
    const text = Array.isArray(children)
      ? children.map((c) => (typeof c === 'string' ? c : ' ')).join('')
      : typeof children === 'string'
        ? children
        : '';
    const youtubePattern = /^::youtube(?:\[([^\]]+)\]|\{#?([^}]+)\})$/;
    const match = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .reduce<RegExpMatchArray | null>((found, line) => found ?? line.match(youtubePattern), null);
    if (match) return <YouTubeEmbed id={match[1] || match[2]} />;
    return (
      <p
        style={{
          color: 'var(--ds-on-surface-variant)',
          fontFamily: 'var(--font-inter), sans-serif',
          lineHeight: 1.8,
          marginBottom: '1.25rem',
          fontSize: '1rem',
        }}
      >
        {children}
      </p>
    );
  },
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: 'var(--ds-primary)', textDecoration: 'underline', textUnderlineOffset: 3 }}
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong style={{ color: 'var(--ds-on-surface)', fontWeight: 700 }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ color: 'var(--ds-on-surface)', fontStyle: 'italic' }}>{children}</em>
  ),
  // Block code: rehype-pretty-code handles token styling — we just provide the container
  pre: ({ children, ...props }) => (
    <pre
      {...props}
      style={{
        margin: '1.25rem 0',
        background: 'var(--ds-surface)',
        borderRadius: 8,
        padding: '1rem 1.25rem',
        overflowX: 'auto',
        fontSize: '0.875rem',
        lineHeight: 1.7,
      }}
    >
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }) => {
    // Block code after rehype-pretty-code — className has language-*, pass through
    if (className) {
      return (
        <code
          className={className}
          style={{ fontFamily: 'ui-monospace, "Cascadia Code", monospace' }}
          {...props}
        >
          {children}
        </code>
      );
    }
    // Inline code
    return (
      <code
        style={{
          background: 'var(--ds-surface)',
          color: 'var(--ds-primary)',
          fontFamily: 'ui-monospace, "Cascadia Code", monospace',
          fontSize: '0.85em',
          padding: '0.15em 0.4em',
          borderRadius: 4,
        }}
      >
        {children}
      </code>
    );
  },
  // rehype-pretty-code wraps pre in a figure — reset default browser margin
  figure: ({ children, ...props }) => (
    <figure style={{ margin: 0 }} {...props}>
      {children}
    </figure>
  ),
  blockquote: ({ children }) => (
    <blockquote
      style={{
        borderLeft: '3px solid var(--ds-primary)',
        paddingLeft: '1.25rem',
        margin: '1.5rem 0',
        color: 'var(--ds-on-surface-variant)',
        fontStyle: 'italic',
        opacity: 0.85,
      }}
    >
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul
      style={{
        color: 'var(--ds-on-surface-variant)',
        fontFamily: 'var(--font-inter), sans-serif',
        paddingLeft: '1.5rem',
        marginBottom: '1.25rem',
        lineHeight: 1.8,
        listStyleType: 'disc',
      }}
    >
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol
      style={{
        color: 'var(--ds-on-surface-variant)',
        fontFamily: 'var(--font-inter), sans-serif',
        paddingLeft: '1.5rem',
        marginBottom: '1.25rem',
        lineHeight: 1.8,
        listStyleType: 'decimal',
      }}
    >
      {children}
    </ol>
  ),
  li: ({ children }) => <li style={{ marginBottom: '0.25rem' }}>{children}</li>,
  hr: () => (
    <hr
      style={{
        border: 'none',
        height: 1,
        background: 'var(--ds-outline-variant)',
        margin: '2rem 0',
        opacity: 0.4,
      }}
    />
  ),
  img: ({ src, alt }) =>
    src ? (
      <img
        src={src}
        alt={alt ?? ''}
        loading="lazy"
        style={{ maxWidth: '100%', borderRadius: 8, margin: '1.5rem 0' }}
      />
    ) : null,
};

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypePrettyCode, prettyCodeOptions]]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
