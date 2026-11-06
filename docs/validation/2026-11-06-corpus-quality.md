# Offline corpus quality validation — 2026-11-06

## Scope

Replaced random English word combinations and the six-paragraph Chinese/Cantonese samples with 32 original paragraphs per language. Added common typography normalization, quality checks, bounded recent selection, and corpus-version isolation for timed bests. No UI controls were added. Existing input, timing, sound, cursor, source selection, and hint modes remain in use.

The corpus is project-original and follows the repository MIT license. No third-party text was imported. There are no new dependencies, model requests, remote generation calls, or user-quota requirements. Runtime defaults are embedded in `client.js`; local conversation extraction uses the current-profile Host service.

## Automated checks

- `npm run check:corpus`: 32 English, 32 Chinese, 32 Cantonese passages; eight topics each. English 53–58 words, Chinese 100–113 graphemes, Cantonese 97–107 graphemes.
- `npm run build`: corpus validation succeeds; the client embeds the canonical source. Annotation and audio artifacts rebuild without content changes.
- `npm test`: 123 passing tests. The previous 104 checks were retained or updated for the new corpus behavior; 19 new checks cover the policy, corpus, recent selection, and migration.
- Every built-in Chinese/Cantonese Han character has an aligned nonempty pronunciation in the installed engine. This verifies coverage and alignment, not a full linguistic review of the readings.
- Normalization tests cover language-specific double quotes, English contractions, fullwidth Latin/digits, emoji and format characters, idempotence, and equal fingerprints for equivalent quote styles.
- Quality tests cover unsupported meaningful symbols, invalid punctuation, incomplete endings, context-dependent openings, canonical lengths, metadata and near duplicates. Local extraction does not join short fragments across a rejected sentence.
- Recency tests cover fresh paragraph selection over repeated runs, reload persistence, separate languages, no within-run duplicates, bounded histories, storage failure, searching past a recent local match, oldest-first reuse, current-passage exclusion, and request validation.
- Record tests preserve old v1/v2 storage and v3 history/bests. New timed scores use `corpus2`, old timed history defaults to corpus version 1, and old results do not become a new-corpus comparison baseline.

## Browser checks

Used an isolated local fixture at `127.0.0.1:4191`. It loads the actual plugin, local React, DSH theme CSS, annotation chunks, and the actual updated Host extraction route. Conversation messages and legacy records were synthetic. No user's actual conversation data or records were changed.

- Default English shows coherent paragraphs. “换一段” changes the selected passage; unit tests verify exclusion of all recent paragraph IDs.
- Default Chinese and Cantonese load their reading chunks and show the expanded passages with all hints enabled.
- A synthetic Chinese message containing corner quotes and a sentence with `⌘` yields canonical `“”` quotes and omits the unsuitable sentence. Entering the cleaned 108-character target completes with 100% accuracy and zero errors.
- Cantonese remains original Cantonese text, with canonical quotes and Jyutping hints.
- English curly quotes and apostrophes become ASCII `"` and `'`; the `⌘` instruction is excluded.
- An empty local result falls back to the new built-in prose while retaining the local-source selection.
- Seeded old history and bests show “旧语料”; older v1 bests remain separately labeled “旧版最佳”.
- At a 360px viewport, the document scroll width remains 360px; long default Cantonese text and all hints wrap in the existing viewport. The temporary viewport override was reset.
- No warning/error console entries were observed at the end of verification. The fixture was closed after testing.

The screenshot saved for this task shows the expanded Cantonese corpus in the existing interface. Fixture controls above and below the plugin are test-only and are not shipped.

## Packaging and limits

`npm pack --dry-run --json` rebuilds the artifacts and includes `src/text-policy.js` alongside the Host extraction modules and the self-contained client. Installing from the checkout uses these files; a running DSH Host must reload the plugin to pick up the changed extraction modules.

This round did not repeat native DSH IME/candidate-window acceptance; the user had previously confirmed candidate positioning, and the input engine was not changed. The browser test uses ordinary automated input and a local Host fixture. It does not establish behavior for every operating-system input method, host version, or real conversation history.

Language and near-duplicate detection remain heuristics. Recent hashes detect identical canonical text across requests, not all semantic rewrites. Automated quality checks do not replace independent native-language editing. Multi-window recent-selection coordination is not implemented, consistent with the existing local-record storage model.
