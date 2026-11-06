# Controls, shortcuts and settings — 2026-11-06

## Delivered behavior

- Removed the standard footer sentence about Backspace and browser-only records. Local-source privacy information and actual storage errors remain available.
- Moved New passage directly to the left of Restart below the text. Both use the same transparent button style as Records and Settings: no visible resting background or border, hover reveals them, and keyboard focus retains a neutral outline.
- Added shortcut tooltips above the two practice actions. They are hidden at rest, appear on hover or keyboard focus, and have accessible descriptions. macOS shows `⌘ R`; Windows/Linux show `Ctrl+R`; Restart shows `Esc`.
- Escape restarts the current text in every practice mode. The platform-specific primary-modifier R chord selects another passage, or cancels a pending local selection just like its button. Shortcuts are handled only inside the plugin root, preserve native IME/select Escape, ignore held repeats, and do not reset practice through a modal. The matching R chord is prevented from reloading the browser while composition/modal/select guards are active. Shift-modified hard reload remains untouched.
- Kept language and exercise selection together on the left, with the source switcher aligned to the right. The desktop control columns size to their content so both English and Chinese interface labels fit. Narrow screens wrap the groups without truncating controls.
- Merged sound and cursor into one Settings dialog, with accessible Sound/Cursor tabs. ArrowLeft/ArrowRight/Home/End select and focus tabs. Native modal focus containment and Escape dismissal remain; closing restores focus to Settings. Changing tabs or closing stops pending sound previews. Existing sound and cursor preferences remain independently persisted.
- Added 14px margin above and below the text wrapper, doubling each adjacent 14px flex gap to 28px without changing text-line geometry.
- Local-source unavailability and empty-result fallback messages now appear as a top toast. It uses a zero-height sticky layer, enters downward over 220ms, exits over the final 160ms, and is removed at 3000ms. Repeated messages get a fresh timer; a new action or unmount clears it. Reduced-motion mode disables both animations.

## Automated validation

`npm run build` passed. `npm test` passed all 158 tests, including eight new cases for Escape reset, the Mac/Windows/Linux shortcut modifiers, composition protection, tab/preferences/preview isolation, toast lifetime and cancellation of late local results. The harness now exercises the root capture handler as part of keyboard input and controls toast timers explicitly. After a final CSS-only control-width adjustment, `node --check client.js` and `git diff --check` passed; browser alignment was rechecked.

The automated suite does not emulate browser keyboard dispatch, DOM layout or a system IME candidate window.

## Browser validation

Used the existing isolated localhost fixture with the actual client, React and DSH theme CSS. Conversation examples and browser storage were fixture-only.

- Desktop: source and practice controls had identical top coordinates in both interface languages. The English control group measured 545.67px and the source group 240px inside the 820px content area.
- Resting buttons had transparent backgrounds/borders. Actual pointer interaction revealed the New passage border and the `⌘ R` tooltip above it. The instructional footer was absent.
- Typed text, pressed Escape, and confirmed the same article, an empty input, reset statistics and focus in the new input node. Pressed Meta+R and confirmed a different article while a marker in the fixture host input survived, demonstrating that the browser did not reload.
- Settings: ArrowRight activated and focused Cursor; selecting another shape updated the preview/root. Escape closed the dialog and returned focus to Settings. Both tabs were inspected, including the native sound selector and volume slider.
- Error fixture: fallback displayed the requested unavailability text at the top. The toast disappeared automatically. During one observed appearance/disappearance cycle, statistics stayed at y=212.75px, or 231.75px including root scroll. The layer measured 0px high; reduced-motion mode computed `animation-name: none`.
- At 360×850: the toolbar/practice region measured 332px with no internal horizontal overflow, source region 240px, bottom action group 168px, and settings dialog 326px of inner width without horizontal overflow. Chinese labels and pronunciation controls remained usable.
- Inspected light/dark themes. The native input anchor and visual caret had zero vertical offset after the spacing change. Browser warning/error logs were empty.

Screenshots: `typing-controls-shortcuts-dark.png`, `typing-settings-tabs-dark.png`, and `typing-controls-toast-dark.png`. The temporary viewport override was reset, the browser tab closed, and the local fixture server stopped.

## Verification boundary

Native shortcut verification was on the available macOS browser. Windows/Linux modifier routing was covered by the component tests, not physical Windows/Linux sessions. This pass did not repeat operating-system candidate-window acceptance or install a new native DSH build.
