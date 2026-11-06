import corpus from '../data/passages.json' with { type: 'json' };

export const CORPUS_VERSION = corpus.version;
export const RECENT_LIMIT = 16;
export const entries = corpus.entries;

// Shuffle topics, preserving the authored order of paragraphs within a topic.
// Prefer unseen paragraphs, then the least recent ones only if needed to fill
// the run. Never repeat an entry within a run, even for an oversized request.
export function selectPractice(language, recent = [], minChars = 1200, random = Math.random) {
  const rows = entries.filter(entry => entry.language === language);
  const topics = [...new Set(rows.map(entry => entry.topic))];
  for (let i = topics.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [topics[i], topics[j]] = [topics[j], topics[i]];
  }
  const seen = new Set(recent);
  const ordered = topics.flatMap(topic => rows.filter(entry => entry.topic === topic && !seen.has(entry.id)));
  ordered.push(...rows.filter(entry => seen.has(entry.id)).sort((a, b) => recent.indexOf(a.id) - recent.indexOf(b.id)));
  const chosen = [];
  let text = '';
  for (const entry of ordered) {
    text += (text && language === 'en' ? ' ' : '') + entry.text;
    chosen.push(entry.id);
    if (text.length >= minChars) break;
  }
  return { text, ids: chosen };
}
