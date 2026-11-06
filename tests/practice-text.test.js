import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import corpus from '../data/passages.json' with { type: 'json' };
import { entries, selectPractice, CORPUS_VERSION, RECENT_LIMIT } from '../src/practice-text.js';
import { normalizeText, qualityIssues, nearDuplicate } from '../src/text-policy.js';
import { validateCorpus } from '../scripts/check-corpus.mjs';

test('offline corpus contains 32 distinct, canonical and complete passages per language', () => {
  assert.deepEqual(validateCorpus(), { en: 32, zh: 32, yue: 32 });
});

test('corpus validation rejects missing provenance, duplicate IDs, short prose, symbols and near duplicates', () => {
  for (const change of [
    data => { data.provenance.kind = 'unknown'; },
    data => { data.entries[0].id = data.entries[1].id; },
    data => { data.entries[0].text = 'Too short.'; },
    data => { data.entries[0].text += ' Press ⌘ now.'; },
    data => { data.entries[0].text = data.entries[1].text.replace('early', 'late'); },
    data => { data.entries[0].text = data.entries[0].text.replace(/\.$/, ''); },
  ]) {
    const invalid = structuredClone(corpus); change(invalid);
    assert.throws(() => validateCorpus(invalid), /Corpus validation failed/);
  }
});

test('typography cleanup is idempotent, preserves contractions and uses language-specific quotes', () => {
  const samples = [
    ['en', '“It’s ready,” she said. 「Let’s go!」 Ａ１２', '"It\'s ready," she said. "Let\'s go!" A12'],
    ['zh', '他说：「今天去公园。」她说："好。"', '他说：“今天去公园。”她说：“好。”'],
    ['yue', '佢話：『我哋返屋企啦。』', '佢話：“我哋返屋企啦。”'],
    ['en', 'A\u200b quiet 👨‍👩‍👧‍👦  🇭🇰 1️⃣ afternoon.\u202e', 'A quiet afternoon.'],
  ];
  for (const [language, input, expected] of samples) {
    assert.equal(normalizeText(input, language), expected);
    assert.equal(normalizeText(expected, language), expected);
  }
});

test('quality gate rejects meaningful unsupported symbols, incomplete quotes and dependent fragments', () => {
  const en = entries[0].text;
  for (const symbol of ['⌘', '→', '≤', '∑']) {
    // These symbols must not be silently erased or turn into a different instruction.
    const text = normalizeText(en + ' Press ' + symbol + ' now.', 'en');
    assert.ok(text.includes(symbol));
    assert.ok(qualityIssues(text, 'en').includes('characters'));
  }
  assert.ok(qualityIssues('"' + en, 'en').includes('punctuation'));
  assert.ok(qualityIssues('As mentioned above, ' + en, 'en').includes('context'));
  assert.ok(qualityIssues(en.slice(0, -1), 'en').includes('incomplete'));
});

test('near duplicate detection ignores case and punctuation but retains unrelated passages', () => {
  assert.equal(nearDuplicate(entries[0].text, entries[0].text.toUpperCase().replaceAll(',', '')), true);
  assert.equal(nearDuplicate(entries[0].text, entries[0].text.replace('bus stop', 'tram stop')), true);
  assert.equal(nearDuplicate(entries[0].text, entries[8].text), false);
});

for (const language of ['en', 'zh', 'yue']) {
  test(`${language}: selects complete authored paragraphs and avoids the recent sixteen`, () => {
    let recent = [];
    for (let i = 0; i < 12; i++) {
      const { text, ids } = selectPractice(language, recent, 1200, () => .5);
      assert.ok(text.length >= 1200);
      assert.equal(new Set(ids).size, ids.length);
      assert.ok(ids.every(id => !recent.includes(id)));
      assert.equal(text, ids.map(id => entries.find(entry => entry.id === id).text).join(language === 'en' ? ' ' : ''));
      recent = [...recent.filter(id => !ids.includes(id)), ...ids].slice(-RECENT_LIMIT);
    }
  });
}

test('small or exhausted selection pools reuse the oldest first and never loop or duplicate within a run', () => {
  const ids = entries.filter(entry => entry.language === 'en').map(entry => entry.id);
  assert.equal(selectPractice('en', ids, 1).ids[0], ids[0]);
  const huge = selectPractice('en', ids, 100000);
  assert.deepEqual(huge.ids, ids);
});

test('shipped corpus block is self-contained and matches the authored source', () => {
  const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8');
  const block = source.split('// BEGIN GENERATED PRACTICE CORPUS')[1].split('// END GENERATED PRACTICE CORPUS')[0];
  const shipped = vm.runInNewContext(block + ';PracticeCorpus');
  assert.equal(shipped.CORPUS_VERSION, CORPUS_VERSION);
  assert.deepEqual(JSON.parse(JSON.stringify(shipped.entries)), entries);
  for (const language of ['en', 'zh', 'yue']) {
    assert.deepEqual(JSON.parse(JSON.stringify(shipped.selectPractice(language, [], 1200, () => .2))), selectPractice(language, [], 1200, () => .2));
  }
});
