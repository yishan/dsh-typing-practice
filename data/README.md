# Offline practice passages

`passages.json` is the editable source of the built-in practice corpus. Version 2 contains 96 original passages written for this project during development and distributed under the repository's [MIT license](../LICENSE). No third-party book excerpts, downloaded datasets, or user conversations are included. The prose was prepared with coding-assistant assistance; automated checks are not a substitute for independent language editing.

| Language | Passages | Actual length range | Topics |
|---|---:|---|---:|
| English (`en`) | 32 | 53–58 words | 8 |
| Simplified Chinese (`zh`) | 32 | 100–113 graphemes | 8 |
| Traditional written Cantonese (`yue`) | 32 | 97–107 graphemes | 8 |

Each topic has four independent passages: travel, food, work, learning, reading, home, hobbies, and nature. Sentences within each passage describe one situation in order. Cantonese is written as Cantonese prose, not Mandarin with Cantonese pronunciation labels.

## Runtime behavior

`src/practice-text.js` selects whole paragraphs, shuffles topic order, and retains the authored order within a topic. A timed run contains at least 1,200 UTF-16 code units, ending at a complete paragraph. No paragraph repeats within a run. The most recent 16 paragraph IDs for that language are avoided when possible; an exhausted pool reuses its oldest entries. The current corpus has enough unused paragraphs to fill the normal target.

The build embeds the corpus and selector in the marked `GENERATED PRACTICE CORPUS` block in `client.js`. Runtime selection is synchronous and offline. There is no model invocation, API key, remote text generation, translation request, or external corpus fetch. Annotation dictionaries are separate local chunks, as before.

Local conversation extraction uses the shared `src/text-policy.js`. Normalization occurs before sentence splitting, length checks, pronunciation, and SHA-256 fingerprinting. A sentence with unsupported meaningful symbols is excluded as a boundary; surrounding fragments are not joined across it. Original Markdown line references remain source references; `cleanStart` and `cleanEnd` refer to the normalized prose run, not offsets in raw Markdown.

Recent local passages are tracked separately using at most 16 hashes per language. Search prefers a fresh hash within the existing 30-session / 8-second cooperative budget. If only recent matches remain, the oldest eligible match is reused. The current passage is always excluded. Local passage bodies are not persisted. Near-duplicate text is filtered within an extraction; cross-request recency uses exact canonical-text hashes and does not detect every paraphrase.

## Editorial rules

- Use ordinary daily-life prose with a clear subject, event, and ending. Avoid references that require an earlier answer, a screenshot, a code block, or a missing list.
- Keep English between 40 and 100 words, Chinese and Cantonese between 80 and 200 graphemes. The current narrower ranges are intentional for consistent short practice.
- Use English `"` and `'`, Chinese and Cantonese `“”`. Do not use corner quotes. Use ordinary punctuation; avoid hotkey glyphs, mathematical notation, decorative symbols, paths, URLs, emoji, and invisible formatting characters.
- Keep each passage self-contained. Do not shuffle words or sentences, cut a sentence to reach a size target, translate Mandarin into Cantonese at runtime, or silently remove a meaningful symbol from an instruction.
- Use common vocabulary. Check contractions, paired punctuation, repeated wording, Cantonese usage, and contextual pronunciation when editing. Reading coverage alone does not establish that each pronunciation is correct.
- Keep IDs stable for unchanged passages. Changes that materially alter corpus difficulty need a corpus version change and an explicit record migration. Currently versions 1 and 2 are accepted by the client; adding a later version also requires extending that migration so earlier records remain readable.
- If third-party prose is introduced later, record the exact source, revision, author, text license, and required attribution. A software repository's license is not sufficient evidence for the license of every bundled text. Update the provenance schema and validator before mixing sources. Current data is entirely project-original.

## Validation and builds

```sh
npm run check:corpus
npm run build
npm test
```

The corpus validator rejects noncanonical typography, unsupported characters, invalid or duplicate IDs, missing provenance, out-of-range lengths, language-feature mismatches, unbalanced punctuation, incomplete sentence endings, obvious context-dependent openings, and highly similar passages. It also requires at least 30 passages and six topics per language. The build runs this validator before embedding data.

Tests verify selection and recency, the embedded artifact's equivalence to the source, all built-in Han characters' reading alignment and coverage, canonical local fingerprints, sentence boundaries, storage failures, and old-record compatibility. The checks cannot determine all grammatical, factual, stylistic, or pronunciation problems. Content review remains part of adding passages.

Do not edit the generated block in `client.js` by hand. Commit the data, selector/policy changes, tests, and rebuilt client together. The installable package contains the embedded corpus and the Host text policy; the JSON authoring source is maintained in this repository.
