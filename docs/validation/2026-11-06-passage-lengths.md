# Passage length and mixed-script typography validation — 2026-11-06

## Delivered behavior

- 288 built-in texts: English, Simplified Chinese, and Traditional Cantonese each have 32 short, 32 medium, and 32 long entries.
- The existing 32 short scenes per language are retained verbatim, with original IDs. Each scene has an authored medium continuation and a further long continuation. Metadata records `family` and `length`; these are 96 variants per language across 32 scenes, not 96 unrelated stories.
- Built-in practice offers Timed and Passage. Passage uses one complete article, with Short / Medium / Long replacing the duration buttons. Restart and hint changes retain the article; length/language changes and New passage select another scene.
- Mode and length persist independently from source, sound, cursor, and records. Timed practice retains its short-text pool and `corpus2` bests. Built-in and local passage runs do not update timed bests.
- Local conversation requests include the chosen length; changing it cancels an older request. Empty/unavailable history falls back to a built-in article of the same language and length, retaining the local-source preference.
- Latin letters, digits, and ASCII punctuation use English practice's monospace stack in Chinese/Cantonese too. Han characters and ruby readings retain their previous families. No remote fonts or new dependencies were added.

## Automated evidence

`npm run build` validates all 288 entries and embeds them in the shipped client. `npm test` passes 134 tests, including all existing timing, IME-handler, sound, cursor, record, and source-selection checks.

New and updated coverage includes all three length ranges, complete-family coverage, cross-tier scene deduplication, selector exhaustion, embedded-source equivalence, every built-in Han character's reading alignment and coverage, all nine language/length extraction combinations, route validation, mode/length persistence, history reload, record clearing, storage failures, stale composition and requests, and same-passage identity across restarts and hint changes.

Controlled-clock tests confirm that each language and length can continue beyond 90 seconds and finish only when the full article is entered. A new article's score does not update timed bests or compare with another length variant. A separate comparison against the previous committed JSON verified that all 96 original short texts and IDs remain unchanged.

## Browser evidence

An isolated fixture at `127.0.0.1:4192` used the actual plugin, DSH theme CSS, local React, pronunciation chunks, and updated Host route. Conversation messages used corpus examples; the user's actual records and chats were not touched.

- Changing Timed to Passage exposed Short / Medium / Long and changed Remaining to Elapsed. Switching back restored the 30-second duration.
- An English short article completed at 295 correct characters, 100% accuracy, and zero errors. Restart retained its text. Medium and Long selected appropriately longer whole articles. Reload restored Passage and Long.
- Local Chinese Long returned 345 characters, including `PDF`, with all Pinyin hints. It continued past the previous 30-second duration and completed after 40.4 seconds with 100% accuracy and zero errors.
- Local Cantonese Long returned 352 characters, retained Cantonese prose and Jyutping, and displayed mixed Latin text consistently.
- English text and the `P` in Chinese/Cantonese `PDF` all computed to the same font stack, `21px` font size, `0.3px` letter spacing, and `12.9453125px` glyph width in this browser. Han text retained the host sans-serif stack; ruby readings retained their existing sans-serif stack.
- At the `D` of `PDF`, the native input anchor matched the visible caret rectangle with zero horizontal or vertical offset. The internal viewport had scrolled 227px; the outer page did not need to follow individual characters.
- Empty local results retained Long and local-source selection while showing the existing fallback message. The resulting practice remained passage mode.
- History displayed the built-in English short article and local Chinese long article with source, size tier, elapsed time, statistics, and same-passage links.
- At 1024px and 360px widths, document scroll width equalled viewport width. In the 360px English UI, all visible toolbar controls remained within the viewport. Tab moved from the mode selector to Short; Space selected Short without entering practice text.
- No warning/error console entries were observed at the end. The temporary viewport override was reset and the fixture tab closed. Screenshots were retained as local task artifacts.

## Packaging and boundaries

`npm pack --dry-run --json` passed, including its `prepack` build. The manifest contains 17 files, including `src/passage-lengths.js`, all existing Host modules, and the self-contained client. The dry-run package is approximately 551 KiB compressed and 1.10 MiB unpacked. `node --check client.js` and `git diff --check` also passed. An installed, running DSH Host needs a plugin reload for the updated extraction endpoint.

No runtime model calls, user API quota, external text fetching, or remote fonts are involved. This round did not repeat operating-system IME or native DSH candidate-window acceptance; automated input and the real component handlers were exercised. The font check verifies the installed browser's computed metrics, not every operating system's font fallback.

Language classification and local near-duplicate filtering remain heuristic. Built-in family deduplication is explicit; local hashes do not recognize every overlapping excerpt or paraphrase. Content and pronunciation coverage checks do not replace independent native-language editing. Long texts share their shorter variant's opening by design.
