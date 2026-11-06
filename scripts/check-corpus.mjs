import { pathToFileURL } from 'node:url';
import corpus from '../data/passages.json' with { type: 'json' };
import { LANGUAGES, LENGTHS, measure, normalizeText, qualityIssues, nearDuplicate } from '../src/text-policy.js';

export function validateCorpus(data = corpus) {
  const errors = [];
  const ids = new Set();
  if (data.version !== 2 || data.license !== 'MIT' || data.provenance?.kind !== 'original') errors.push('Invalid corpus provenance or version');
  for (const entry of data.entries) {
    const { id, language, topic, text } = entry;
    if (!/^(en|zh|yue)-[a-z]+-\d{2}$/.test(id) || ids.has(id) || !id.startsWith(language + '-') || !topic) errors.push(`${id}: invalid metadata`);
    ids.add(id);
    if (!LANGUAGES.includes(language) || typeof text !== 'string') { errors.push(`${id}: invalid text`); continue; }
    if (text !== normalizeText(text, language)) errors.push(`${id}: noncanonical typography`);
    const count = measure(text, language), [min, max] = LENGTHS[language];
    if (count < min || count > max) errors.push(`${id}: length ${count}, expected ${min}-${max}`);
    errors.push(...qualityIssues(text, language).map(issue => `${id}: ${issue}`));
  }
  for (const language of LANGUAGES) {
    const rows = data.entries.filter(entry => entry.language === language);
    if (rows.length < 30 || new Set(rows.map(entry => entry.topic)).size < 6) errors.push(`${language}: insufficient variety`);
    for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) {
      if (nearDuplicate(rows[i].text, rows[j].text)) errors.push(`${rows[i].id} and ${rows[j].id}: duplicate`);
    }
  }
  if (errors.length) throw new Error('Corpus validation failed:\n' + errors.join('\n'));
  return Object.fromEntries(LANGUAGES.map(language => [language, data.entries.filter(entry => entry.language === language).length]));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) console.log(validateCorpus());
