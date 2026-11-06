import { createHash } from 'node:crypto';
import { fromMarkdown } from 'mdast-util-from-markdown';

export const LENGTHS = { en: [40, 100], zh: [80, 200], yue: [80, 200] };
const graphemes = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
const sentences = new Intl.Segmenter(undefined, { granularity: 'sentence' });
const words = new Intl.Segmenter('en', { granularity: 'word' });
const cantonese = /我哋|你哋|佢哋|屋企|而家|聽日|尋日|噚日|傾偈|食嘢|唔|冇|咗|嘅|喺|嚟|啲|嗰|咁|佢|嘢|攞|睇|畀/gu;
const unsuitable = /(?:https?:\/\/|www\.)\S+|(?:\/(?:Users|home|tmp|etc|var)\/|[A-Z]:\\)\S+|\b(?:sk-[A-Za-z0-9_-]{12,}|gh[pousr]_[A-Za-z0-9_]{16,}|AKIA[A-Z0-9]{16})\b|(?:api[_ -]?key|access[_ -]?token|password|secret|密码|密钥)\s*[:=：]\s*\S+|-----BEGIN [A-Z ]*PRIVATE KEY|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|\x1b\[|^\s*(?:\[?(?:INFO|DEBUG|ERROR|WARN)\b|Traceback|at \S+\s*\()/imu;

export function measure(text, language) {
  return language === 'en'
    ? [...words.segment(text)].filter(part => part.isWordLike).length
    : [...graphemes.segment(text)].length;
}

export function matchesLanguage(text, language) {
  const han = (text.match(/\p{Script=Han}/gu) || []).length;
  const letters = (text.match(/\p{L}/gu) || []).length;
  const yue = [...text.matchAll(cantonese)].length >= 2;
  if (language === 'en') return han === 0 && /[A-Za-z]/.test(text) && letters / text.length > 0.5;
  return han / Math.max(1, letters) >= 0.6 && (language === 'yue' ? yue : !yue);
}

// Keep prose and link labels. Code, HTML, media, tables and headings are
// boundaries, not holes to silently concatenate across. Never render HTML.
function inline(node) {
  if (node.type === 'text') return node.value;
  if (node.type === 'break') return ' ';
  if (['emphasis', 'strong', 'link', 'linkReference'].includes(node.type)) {
    const parts = node.children.map(inline);
    return parts.some(part => part == null) ? null : parts.join('');
  }
  return null;
}

export function proseRuns(markdown) {
  const tree = fromMarkdown(markdown);
  const runs = [];
  let run;
  const flush = () => { if (run) runs.push(run); run = undefined; };
  function walk(nodes) {
    for (const node of nodes) {
      if (node.type === 'paragraph') {
        const pieces = node.children.map(inline);
        const text = pieces.some(piece => piece == null) ? '' : pieces.join('').replace(/\s+/gu, ' ').trim();
        if (!text || unsuitable.test(text) || /[|<>]|\u0000/u.test(text)) { flush(); continue; }
        if (run) { run.text += ' ' + text; run.lineEnd = node.position.end.line; }
        else run = { text, lineStart: node.position.start.line, lineEnd: node.position.end.line };
      } else if (['list', 'listItem', 'blockquote'].includes(node.type)) {
        flush(); walk(node.children); flush();
      } else flush();
    }
  }
  walk(tree.children);
  flush();
  return runs;
}

export function splitPassages(text, language) {
  const [min, max] = LENGTHS[language];
  const result = [];
  let start = 0;
  let end = 0;
  const flush = () => {
    const value = text.slice(start, end).trim();
    if (measure(value, language) >= min && matchesLanguage(value, language)) result.push({ text: value, start, end });
    start = end;
  };
  for (const part of sentences.segment(text)) {
    const nextEnd = part.index + part.segment.length;
    if (measure(part.segment.trim(), language) > max) { flush(); start = end = nextEnd; continue; }
    if (measure(text.slice(start, nextEnd).trim(), language) > max) { flush(); start = part.index; }
    end = nextEnd;
  }
  flush();
  return result;
}

export async function extractPassages(events, options, signal) {
  if (!Object.hasOwn(LENGTHS, options.language)) throw new Error('invalid_options');
  const completed = new Set(events.filter(event => event.type === 'turn/end' && event.data?.reason?.kind === 'completed').map(event => event.data.turn));
  const candidates = [];
  const seen = new Set();
  let budget = 200000;
  let limited = events.length > 20000;
  const recent = events.slice(-20000);
  for (let i = recent.length - 1; i >= 0; i--) {
    if (i % 64 === 0) { await new Promise(resolve => setImmediate(resolve)); signal?.throwIfAborted(); }
    const event = recent[i];
    if (!Number.isFinite(event.time) || event.time < options.since || event.time > options.until) continue;
    const role = event.type === 'user/message' ? 'user' : event.type === 'assistant/message' ? 'assistant' : null;
    if (!role) continue;
    const message = role === 'user' ? event.data : event.data?.message;
    if (message?.role !== role || message.source?.kind !== (role === 'user' ? 'user' : 'model') || !Array.isArray(message.content)) continue;
    if (role === 'assistant' && (!completed.has(event.data.turn) || message.content.some(block => block.type === 'tool-call'))) continue;
    for (let blockIndex = 0; blockIndex < message.content.length; blockIndex++) {
      const block = message.content[blockIndex];
      if (block.type !== 'text' || typeof block.text !== 'string') continue;
      if (block.text.length > 20000) { limited = true; continue; }
      budget -= block.text.length;
      if (budget < 0) return { candidates, limited: true };
      for (const run of proseRuns(block.text)) for (const part of splitPassages(run.text, options.language)) {
        const fingerprint = createHash('sha256').update(part.text).digest('hex');
        if (seen.has(fingerprint)) continue;
        seen.add(fingerprint);
        candidates.push({
          id: `${event.seq}:${blockIndex}:${part.start}:${fingerprint.slice(0, 12)}`,
          text: part.text, language: options.language,
          count: measure(part.text, options.language), chars: [...graphemes.segment(part.text)].length,
          source: { sessionId: options.sessionId, seq: event.seq, time: event.time, role, messageId: message.id,
            blockIndex, lineStart: run.lineStart, lineEnd: run.lineEnd,
            cleanStart: part.start, cleanEnd: part.end, fingerprint },
        });
        if (candidates.length === 30) return { candidates, limited: true };
      }
    }
  }
  signal?.throwIfAborted();
  return { candidates, limited };
}
