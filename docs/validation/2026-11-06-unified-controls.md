# Unified practice controls — 2026-11-06

## Behavior

The latest user choices are 15 / 30 / 60 seconds (no 10-second option), Short / Medium / Long with the Chinese labels 短篇 / 中篇 / 长篇, and the language controls in the same visual bar. Language remains an independent selection. The six exercise presets form one radio group with one checked item and one Tab stop; arrow keys move selection, Home/End select the endpoints. At 680px and below, the single container uses three rows. The former mode dropdown is removed.

The selected preset persists in `dsh.typing-practice.exercise.v2` as `{version:2,preset:"30"}` (or another supported string). Valid v2 data takes priority. Legacy v1 mode/length preferences are migrated without rewriting the old value; old local-source users retain passage practice. Invalid v2 presets, including `10`, default to 30 seconds. Source changes retain the preset. Record clearing retains preferences.

Both sources support all six presets. Local timed requests collect complete, distinct short excerpts, reaching at least 1,200 UTF-16 units before practice begins. The existing 30-chat, eight-second Host budget and two-read concurrency ceiling remain. If the buffer is insufficient or unavailable, the whole run falls back to built-in text with the selected time preserved. There is no timed network continuation, repeated excerpt padding, remote model call, or mixture of built-in and local text. Recent hashes are deprioritized and all current excerpt hashes are excluded on New passage.

Timed local bests use separate keys such as `en:30:local:plain:2`; existing built-in keys remain unchanged. History records the actual source, so a fallback goes into built-in records. Local text stays in memory; statistics and text hashes are persisted. A timed response omits chat titles and positions. Passage completion and same-passage comparisons retain their existing rules.

## Automated checks

- `npm test`: 144 passed, zero failed. This includes the prior corpus, timing, IME-handler, sound, cursor, privacy, recency, and history checks.
- Ten additional tests cover single radio selection and roving Tab focus, all six presets across reload/source changes, legacy preference migration, invalid presets, each local timed deadline and source-specific bests, retry and whole-batch exclusion, insufficient/old-Host fallback, stale request cancellation, three-language complete-buffer extraction, multi-chat selection, and bounded/invalid requests.
- `npm pack --dry-run --json` passed with its prepack build. The manifest contains 17 files, including the updated Host route and shared length module; the dry-run size was 565,381 bytes compressed and 1,162,687 bytes unpacked.
- `node --check client.js`, `node --check src/corpus-routes.js`, and `git diff --check` passed.

## Browser evidence

An isolated fixture at `127.0.0.1:4193` ran the actual plugin, local React, DSH theme CSS, pronunciation modules, and Host extraction route. Synthetic conversations used the original corpus. No user conversation bodies or records were read or modified.

- Desktop view shows English / Chinese / Cantonese and the six presets in one bordered bar with light separators. Chinese labels retain 篇. Light and dark appearances were inspected.
- Home from Long selected 15 seconds and retained keyboard focus. Tab from the final language button entered the currently selected 60-second radio.
- Local Chinese timed practice prepared 1,294 characters and completed at 15.0 seconds, with one correct character, zero errors, and a separate local best. The history and best dialog both identified the local source and duration.
- Reload retained the selected 15-second preset and local source. Selecting 60 seconds, then forcing empty results, retained 60 seconds and showed the built-in fallback; reload still restored 60 seconds.
- Local English Medium returned a finite article. Empty-result fallback retained Medium and elapsed-time scoring.
- An English Short article completed after 82.3 seconds with 307 correct characters, 100% accuracy, and zero errors. Its history row identified built-in source and Short, independently from the local timed entry. Browser automation entered the text in bounded chunks after a long typing call reached the automation deadline; the application's timer and input remained functional.
- At 681px width, all nine buttons fit and had no internal text overflow; document width equalled viewport width. At 360px the controls wrapped inside one container. At 320px all nine controls still fit without horizontal overflow.
- No warning/error console entries were recorded. The viewport override was reset, the fixture tab was closed, and the local server was stopped after verification.

Screenshots are retained in the task artifacts as `typing-unified-controls.png` and `typing-unified-controls-dark.png`.

## Boundaries

This round verified the simulated Host page and actual Host route with synthetic data, not a newly installed native DSH instance. Native operating-system IME candidate-window acceptance was not repeated. An existing installation needs a plugin reload to pick up the new Host timed-batch API. Older Hosts that return only a single passage safely fall back for timed practice. The selection heuristics and bounded history search do not guarantee that all suitable messages have been found.
