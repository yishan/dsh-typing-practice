# Immersive typing viewport — 2026-11-06

## Delivered behavior

The practice text no longer has a card background, perimeter border, rounded input box, or whole-region focus outline. The existing DSH blue caret identifies the input position. The start hint becomes slightly stronger on focus, then hides when typing/composition begins while retaining its layout space. Buttons and selectors retain their normal keyboard focus indicators.

All languages use six row slots: one faded history row, the current row and two following rows at full opacity, then two progressively fading rows. The initial history row is blank. CSS opacity masking works with light and dark themes and fades ruby readings together with their characters. The typography and existing English monospace treatment remain unchanged.

The current row stays in slot two. Each wrapped row immediately moves into that slot, including reverse traversal, layout reflow, and the final row. Leading and trailing padding keep the same alignment at both ends of the article. The internal scrollbar is hidden. There is no new interpolation, spring, per-keystroke animation, or delayed input-anchor movement.

Ordinary typing only moves the internal text. On focus or resize, a clipped host can reveal the six-row region once; when the full region cannot fit, visibility of the current row takes priority. The native input and composition preview remain outside the visual mask and follow the current character rectangle.

## Automated checks

- `npm run build` passed, validating the unchanged 96-entry corpus per language and rebuilding the existing local chunks.
- `npm test`: 150 passed, zero failed. Six new geometry checks exercise first/last/reverse row traversal, mixed glyph offsets without jitter, reflow and restart, input/preview anchor alignment, visible versus clipped focus regions, and a clipped DSH host.
- The previous timing, Unicode, IME-handler, record, source, pronunciation, sound, cursor and unified-preset checks remain passing.
- `node --check client.js` and `git diff --check` passed.

The geometry tests invoke the shipped helpers with controlled DOM rectangles. They do not emulate browser font layout; browser evidence is recorded separately below.

## Browser evidence

An isolated fixture at `127.0.0.1:4194` used the actual plugin, local React, DSH theme CSS and pronunciation modules. It uses synthetic corpus text and does not touch real conversation history or user records.

- English long practice displayed three fully visible current/future rows, two fading future rows, and one fading history row after a wrap. The viewport was 233px high with a 38.85px line height. The card border was 0px and the focused board outline was `none`.
- Native typing across the first English wrap moved only the text: internal scroll advanced to 39px, the caret offset changed from 45.84375px to 45.6875px, outer scroll stayed at zero, and the input anchor had zero vertical offset from the caret. The instruction hint became hidden without collapsing its space.
- Seven Backspaces crossed back into the previous row, restoring internal scroll to zero and the original caret height.
- With all Chinese Pinyin hints visible, the first-row caret offset was 72.1953125px; the next row was 72.390625px. The native input remained aligned with zero offset.
- A 107-character Chinese short article reached its final row with internal scroll at its 170px maximum. The caret offset was 72.28125px and outer scroll stayed at zero. It completed after 33.1 seconds with 107 correct characters, 100% accuracy, and zero errors; the view did not jump back to the top on completion.
- Cantonese with all Jyutping hints also held the current line and native input anchor in place. At 360px width, the row height changed to 48.6px without horizontal overflow.
- After resize/focus revealed the narrow host's clipped text region, the entire six-row viewport was visible. A further 20 native Chinese characters crossed rows while outer scroll stayed exactly 173.5px; caret offset changed only from 62.28125px to 61.96875px, within browser subpixel rounding.
- Light and dark appearances were inspected. The reduced-motion fixture retained `0s` board transition duration and automatic, immediate internal scrolling. No warning/error console entries were observed.
- Screenshots were retained as `typing-immersive-english-dark.png`, `typing-immersive-chinese-light.png`, and `typing-immersive-chinese-dark.png`. The viewport override was reset and the fixture tab closed; the temporary local server was stopped after verification.

## Boundaries

Browser verification used the simulated Host and native automation text input. It verifies visual anchoring and real browser layout, not a new operating-system IME candidate-window acceptance pass or a newly installed native DSH version. Existing IME-handler regressions remain passing. Font fallback and rounding may vary slightly by operating system; measured line displacement here was below one CSS pixel.

## Follow-up: borderless statistics

The four live statistics and the completed-result container now use transparent, borderless layouts without rounded cards. Removing horizontal inset aligns the first statistic and result heading with the text area. Live statistics retain four equal columns on desktop and two columns at the existing narrow breakpoint, with a 24px column gap. Labels, units, numerical hierarchy and tabular digits are unchanged; scoring and record handling are unchanged.

The same isolated browser fixture verified light and dark themes, Chinese and English labels, live updates and a 15-second completion. Before and after that timed run, the live statistics remained at y=255.75px with a height of 69.84375px. Computed statistic/result backgrounds were transparent, borders were 0px, and radii were 0px. At a 360px viewport, each live-statistics column was 154px wide without content overflow; the completed result also fit its 332px container. Console warnings/errors were empty. The desktop screenshot was saved as `typing-immersive-stats-dark.png`.

`npm run build`, `node --check client.js`, and all 150 existing tests passed after the CSS adjustment. No new tests were added for this presentation-only change. The temporary viewport override was reset, the fixture tab closed, and the local server stopped.
