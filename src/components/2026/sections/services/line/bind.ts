/**
 * Imperative binding between a frame and the DOM. The markup is static React;
 * elements declare what they follow with `data-bind="attr:key,attr:key"` and a
 * single pass per tick writes the values, so React never re-renders per frame.
 *
 * attr forms: `opacity` (SVG/HTML attribute), `s.box-shadow` (inline style),
 * `text` (textContent), `wrap` (fills child tspans, `data-wrap` = chars per line).
 */
import type { Frame } from './frame';

export interface Binding {
  el: Element;
  attr: string;
  key: string;
  last?: string;
}

export type Labels = Record<string, string>;

export function collectBindings(root: Element): Binding[] {
  const out: Binding[] = [];
  root.querySelectorAll('[data-bind]').forEach((el) => {
    for (const pair of (el.getAttribute('data-bind') ?? '').split(',')) {
      const i = pair.indexOf(':');
      if (i > 0) out.push({ el, attr: pair.slice(0, i), key: pair.slice(i + 1) });
    }
  });
  return out;
}

function wrapLines(text: string, max: number, lines: number): string[] {
  const out: string[] = [];
  let cur = '';
  for (const word of text.split(' ')) {
    if (cur && (cur + ' ' + word).length > max) {
      out.push(cur);
      cur = word;
    } else {
      cur = cur ? cur + ' ' + word : word;
    }
  }
  if (cur) out.push(cur);
  while (out.length < lines) out.push('');
  return out.slice(0, lines);
}

export function applyFrame(bindings: Binding[], frame: Frame, labels: Labels): void {
  for (const b of bindings) {
    const raw = frame[b.key];
    if (raw === undefined) continue;
    const value = b.attr === 'text' || b.attr === 'wrap' ? (labels[String(raw)] ?? String(raw)) : String(raw);
    if (value === b.last) continue;
    b.last = value;
    if (b.attr === 'text') {
      b.el.textContent = value;
    } else if (b.attr === 'wrap') {
      const max = Number(b.el.getAttribute('data-wrap')) || 18;
      const spans = b.el.children;
      const lines = wrapLines(value, max, spans.length);
      for (let i = 0; i < spans.length; i++) spans[i].textContent = lines[i];
    } else if (b.attr.startsWith('s.')) {
      (b.el as HTMLElement | SVGElement).style.setProperty(b.attr.slice(2), value);
    } else {
      b.el.setAttribute(b.attr, value);
    }
  }
}
