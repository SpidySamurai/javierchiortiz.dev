import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';

const youtubeRe = /^::youtube(?:\[([^\]]+)\]|\{#?([^}]+)\})$/gm;

function preprocessContent(content: string): string {
  return content.replace(youtubeRe, (_, id1, id2) => {
    const id = id1 || id2;
    return `<div class="yt-embed"><iframe src="https://www.youtube.com/embed/${id}" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
  });
}

export default async function MarkdownRenderer({ content }: { content: string }) {
  const preprocessed = preprocessContent(content);

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypePrettyCode, { theme: 'github-dark-dimmed', keepBackground: false })
    .use(rehypeStringify)
    .process(preprocessed);

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: String(result) }}
    />
  );
}
