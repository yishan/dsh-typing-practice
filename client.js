// Typing practice client half: a sidebar panel entry plus its timed typing page.
//
// Loaded as a classic-script plugin through window.__ModuleLoader__; the only
// module it imports is the platform React runtime. The page is self-contained:
// practice text is generated locally, timing uses performance.now(), and the
// best score per duration is kept in localStorage under a namespaced key.

window.__ModuleLoader__.load({
  id: 'typing-practice',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const NS = 'typing-practice';
    const STORE_KEY = 'dsh.typing-practice.v1';
    const DURATIONS = [15, 30, 60];
    const DEFAULT_DURATION = 30;
    const TEXT_CHARS = 1200;

    // ---------- copy ----------

    const zh = {
      panelLabel: '打字练习',
      panelTitle: '打字练习',
      panelSubtitle: '限时测速，实时统计 WPM 与准确率',
      bestValue: '最佳 {wpm} WPM · {acc}%',
      bestNone: '暂无最佳记录',
      durationLabel: '练习时长',
      durationOption: '{n} 秒',
      statsWpm: 'WPM',
      statsAccuracy: '准确率',
      statsErrors: '错误',
      statsRemaining: '剩余',
      unitSeconds: '秒',
      unitPercent: '%',
      timebarLabel: '本轮进度',
      focusHint: '点击文本区继续输入',
      inputLabel: '打字练习输入区',
      resultTitle: '本轮成绩',
      resultAccuracy: '准确率',
      resultCorrect: '正确字符',
      resultErrors: '错误',
      newRecordBadge: '新纪录',
      restart: '再来一次',
      restartHint: '开始打字即计时 · Tab 重开',
      footerTip: '输入错误可退格修正；最佳成绩只保存在本机浏览器。',
      inputPlaceholder: '',
    };

    const en = {
      panelLabel: 'Typing practice',
      panelTitle: 'Typing practice',
      panelSubtitle: 'Timed runs with live WPM and accuracy',
      bestValue: 'Best {wpm} WPM · {acc}%',
      bestNone: 'No best score yet',
      durationLabel: 'Test duration',
      durationOption: '{n}s',
      statsWpm: 'WPM',
      statsAccuracy: 'Accuracy',
      statsErrors: 'Errors',
      statsRemaining: 'Left',
      unitSeconds: 's',
      unitPercent: '%',
      timebarLabel: 'Test progress',
      focusHint: 'Click the text to keep typing',
      inputLabel: 'Typing practice input',
      resultTitle: 'Result',
      resultAccuracy: 'Accuracy',
      resultCorrect: 'Correct chars',
      resultErrors: 'Errors',
      newRecordBadge: 'New record',
      restart: 'Try again',
      restartHint: 'Timing starts on the first key · Tab restarts',
      footerTip: 'Backspace fixes mistakes; best scores stay in this browser.',
      inputPlaceholder: '',
    };

    const dictionaries = { zh, en };
    let activeLanguage = 'zh';
    let localeService = null;

    function interpolate(text, vars) {
      return String(text == null ? '' : text).replace(/\{(\w+)\}/g, (match, key) => {
        if (vars && vars[key] != null) return String(vars[key]);
        return match;
      });
    }

    let t = (key, vars) => interpolate((dictionaries[activeLanguage] || zh)[key] ?? key, vars);

    function detectLanguage(locale) {
      try {
        const snapshot = locale && locale.getLocale ? locale.getLocale() : null;
        const id = String(snapshot && (snapshot.id || snapshot.locale || snapshot.current) || '');
        if (id.toLowerCase().startsWith('en')) return 'en';
      } catch {
        // fall through to the Chinese default
      }
      return 'zh';
    }

    // ---------- practice text ----------

    const WORDS = [
      'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it', 'that',
      'for', 'they', 'with', 'as', 'not', 'on', 'she', 'at', 'by', 'this',
      'we', 'you', 'do', 'but', 'from', 'or', 'which', 'one', 'would', 'all',
      'will', 'there', 'say', 'who', 'make', 'when', 'can', 'more', 'if', 'no',
      'man', 'out', 'other', 'so', 'what', 'time', 'up', 'go', 'about', 'than',
      'into', 'could', 'state', 'only', 'new', 'year', 'some', 'take', 'come',
      'these', 'know', 'see', 'use', 'get', 'like', 'then', 'first', 'any',
      'work', 'now', 'may', 'such', 'give', 'over', 'think', 'most', 'even',
      'find', 'day', 'also', 'after', 'way', 'many', 'must', 'look', 'before',
      'great', 'back', 'through', 'where', 'much', 'your', 'should', 'because',
      'each', 'just', 'those', 'people', 'small', 'between', 'both', 'under',
      'never', 'same', 'another', 'while', 'last', 'might', 'us', 'something',
      'thought', 'again', 'place', 'around', 'however', 'home', 'water', 'room',
      'mother', 'write', 'read', 'hand', 'high', 'keep', 'begin', 'seem', 'help',
      'talk', 'turn', 'start', 'city', 'play', 'move', 'light', 'live', 'point',
      'today', 'bring', 'happen', 'next', 'without', 'large', 'often', 'together',
      'ask', 'walk', 'young', 'important', 'few', 'open', 'close', 'possible',
      'side', 'kind', 'head', 'house', 'service', 'friend', 'father', 'power',
      'hour', 'game', 'line', 'end', 'member', 'car', 'community', 'name',
      'team', 'minute', 'idea', 'body', 'information', 'nothing', 'right',
      'lead', 'social', 'understand', 'watch', 'follow', 'stop', 'create',
      'speak', 'allow', 'add', 'spend', 'grow', 'win', 'offer', 'remember',
      'love', 'consider', 'appear', 'buy', 'wait', 'serve', 'send', 'expect',
      'build', 'stay', 'fall', 'cut', 'reach', 'remain', 'suggest', 'raise',
      'pass', 'sell', 'require', 'report', 'decide', 'pull',
    ];

    const SENTENCE_ENDINGS = ['.', '.', '.', '!', '?'];

    function pick(list) {
      return list[Math.floor(Math.random() * list.length)];
    }

    function capitalize(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }

    function generateText(minChars) {
      const parts = [];
      let length = 0;
      while (length < minChars) {
        const size = 6 + Math.floor(Math.random() * 5);
        const words = [];
        for (let i = 0; i < size; i++) {
          let word = pick(WORDS);
          if (i > 0 && i < size - 1 && Math.random() < 0.14) word += ',';
          words.push(word);
        }
        const sentence = capitalize(words[0]) + ' ' + words.slice(1).join(' ');
        const finished = sentence + pick(SENTENCE_ENDINGS);
        if (parts.length > 0) length += 1;
        length += finished.length;
        parts.push(finished);
      }
      return parts.join(' ');
    }

    // ---------- best score ----------

    function loadBest() {
      try {
        const raw = window.localStorage.getItem(STORE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        const stored = parsed && typeof parsed === 'object' ? parsed.best : null;
        if (!stored || typeof stored !== 'object') return {};
        const best = {};
        for (const duration of DURATIONS) {
          const entry = stored[duration];
          if (!entry || !Number.isFinite(entry.wpm)) continue;
          best[duration] = {
            wpm: Math.round(entry.wpm),
            accuracy: Number.isFinite(entry.accuracy) ? Math.max(0, Math.min(1, entry.accuracy)) : 0,
            at: Number.isFinite(entry.at) ? entry.at : 0,
          };
        }
        return best;
      } catch {
        return {};
      }
    }

    function saveBest(best) {
      try {
        window.localStorage.setItem(STORE_KEY, JSON.stringify({ version: 1, best }));
      } catch {
        // storage can be unavailable; the page still works without persistence
      }
    }

    // ---------- session engine ----------

    function createSession(duration) {
      return {
        duration,
        text: generateText(TEXT_CHARS),
        typed: '',
        keystrokes: 0,
        wrongKeys: 0,
        startAt: null,
        nowMs: 0,
        result: null,
      };
    }

    function countCorrect(text, typed) {
      let correct = 0;
      const length = Math.min(text.length, typed.length);
      for (let i = 0; i < length; i++) {
        if (typed[i] === text[i]) correct += 1;
      }
      return correct;
    }

    function sessionElapsed(session) {
      if (session.result) return session.result.elapsedMs;
      if (session.startAt == null) return 0;
      return Math.max(0, session.nowMs - session.startAt);
    }

    function sessionStats(session) {
      const ms = sessionElapsed(session);
      const correct = countCorrect(session.text, session.typed);
      const accuracy = session.keystrokes > 0
        ? (session.keystrokes - session.wrongKeys) / session.keystrokes
        : 1;
      const wpm = ms > 0 ? Math.round((correct / 5) / (ms / 60000)) : 0;
      return { ms, correct, accuracy, wpm };
    }

    function finishSession(session, elapsed) {
      const raw = elapsed != null ? elapsed : sessionElapsed(session);
      const ms = Math.max(1, Math.min(raw, session.duration * 1000));
      const correct = countCorrect(session.text, session.typed);
      const accuracy = session.keystrokes > 0
        ? (session.keystrokes - session.wrongKeys) / session.keystrokes
        : 0;
      return {
        ...session,
        result: {
          wpm: Math.round((correct / 5) / (ms / 60000)),
          accuracy: Math.max(0, Math.min(1, accuracy)),
          correct,
          keystrokes: session.keystrokes,
          wrongKeys: session.wrongKeys,
          duration: session.duration,
          elapsedMs: Math.round(ms),
          at: Date.now(),
        },
      };
    }

    // ---------- styles ----------

    const CSS = `
.tp-root {
  height: 100%;
  min-height: 100%;
  overflow-y: auto;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}
.tp-root, .tp-root * { box-sizing: border-box; }
.tp-panel-spark { stroke: var(--dsw-alias-brand-primary); }
.tp-page {
  max-width: 880px;
  margin: 0 auto;
  padding: 26px 30px 56px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.tp-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.tp-title {
  margin: 0;
  font-size: 20px;
  line-height: 1.2;
  font-weight: 650;
  letter-spacing: -0.015em;
}
.tp-subtitle {
  margin: 4px 0 0;
  font-size: 12.5px;
  color: var(--dsw-alias-label-secondary);
}
.tp-best {
  flex: none;
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.tp-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.tp-seg {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 10px;
}
.tp-seg-btn {
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font-family: inherit;
  font-size: 12.5px;
  height: 26px;
  padding: 0 14px;
  border-radius: 7px;
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
}
.tp-seg-btn:hover { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2); }
.tp-seg-btn.active {
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
}
.tp-toolbar-hint {
  font-size: 11.5px;
  color: var(--dsw-alias-label-secondary);
}
.tp-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}
.tp-stat {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  padding: 10px 14px 11px;
}
.tp-stat-label {
  font-size: 11.5px;
  color: var(--dsw-alias-label-secondary);
}
.tp-stat-value {
  margin-top: 2px;
  display: flex;
  align-items: baseline;
  gap: 3px;
  font-size: 24px;
  line-height: 1.15;
  font-weight: 650;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}
.tp-stat.accent .tp-stat-value { color: var(--dsw-alias-brand-primary); }
.tp-stat-unit {
  font-size: 11.5px;
  font-weight: 400;
  color: var(--dsw-alias-label-secondary);
}
.tp-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 22px 18px;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 14px;
}
.tp-timebar {
  height: 3px;
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
  overflow: hidden;
}
.tp-timebar-fill {
  height: 100%;
  border-radius: 999px;
  background: var(--dsw-alias-brand-primary);
  transition: width 120ms linear;
}
.tp-board-wrap {
  position: relative;
  border-radius: 10px;
  min-height: 132px;
}
.tp-board {
  min-height: 132px;
  padding: 2px;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 21px;
  line-height: 1.85;
  letter-spacing: 0.3px;
  user-select: none;
}
.tp-char { color: var(--dsw-alias-label-secondary); }
.tp-char.correct { color: var(--dsw-alias-label-primary); }
.tp-char.wrong {
  color: var(--dsw-alias-state-error-primary);
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}
.tp-char.caret { box-shadow: inset 2px 0 0 0 var(--dsw-alias-brand-primary); }
.tp-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  opacity: 0;
  resize: none;
  background: transparent;
  color: transparent;
  caret-color: transparent;
  cursor: text;
  font-size: 16px;
}
.tp-focus-hint {
  position: absolute;
  right: 8px;
  bottom: 6px;
  padding: 2px 10px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 999px;
  background: var(--dsw-alias-bg-overlay);
  color: var(--dsw-alias-label-secondary);
  font-size: 11.5px;
  pointer-events: none;
}
.tp-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 13px 15px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-2);
}
.tp-result-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
}
.tp-record {
  padding: 1px 8px;
  border: 1px solid var(--dsw-alias-state-success-primary);
  border-radius: 999px;
  color: var(--dsw-alias-state-success-primary);
  font-size: 11px;
  font-weight: 600;
}
.tp-result-grid {
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
}
.tp-result-item { min-width: 60px; }
.tp-result-label {
  font-size: 11px;
  color: var(--dsw-alias-label-secondary);
}
.tp-result-value {
  font-size: 20px;
  line-height: 1.2;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
}
.tp-result-actions { display: flex; gap: 8px; }
.tp-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 14px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font-family: inherit;
  font-size: 12.5px;
  cursor: pointer;
}
.tp-btn:hover {
  background: var(--dsw-alias-bg-layer-2);
  border-color: var(--dsw-alias-border-l2);
}
.tp-btn.primary {
  border-color: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-brand-primary);
  font-weight: 600;
}
.tp-foot {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 11.5px;
  color: var(--dsw-alias-label-secondary);
}
@media (max-width: 720px) {
  .tp-page { padding: 18px 14px 44px; }
  .tp-title { font-size: 18px; }
  .tp-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .tp-board { font-size: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .tp-seg-btn, .tp-timebar-fill { transition: none; }
}
`;

    // ---------- board ----------

    const TextBoard = React.memo(function TextBoard({ text, typed, caretIndex }) {
      const nodes = [];
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        let className = 'tp-char';
        if (i < typed.length) {
          className += typed[i] === ch ? ' correct' : ' wrong';
        }
        if (i === caretIndex) className += ' caret';
        nodes.push(h('span', { className, key: i }, ch === ' ' ? ' ' : ch));
      }
      return h('div', { className: 'tp-board' }, nodes);
    });

    function Stat({ label, value, unit, accent }) {
      return h('div', { className: accent ? 'tp-stat accent' : 'tp-stat' },
        h('div', { className: 'tp-stat-label' }, label),
        h('div', { className: 'tp-stat-value' },
          String(value),
          unit ? h('span', { className: 'tp-stat-unit' }, unit) : null,
        ),
      );
    }

    function ResultItem({ label, value }) {
      return h('div', { className: 'tp-result-item' },
        h('div', { className: 'tp-result-label' }, label),
        h('div', { className: 'tp-result-value' }, String(value)),
      );
    }

    // ---------- sidebar icon ----------

    function PanelIcon({ size = 20, active }) {
      const edge = size || 20;
      return h('svg', {
        width: edge,
        height: edge,
        viewBox: '0 0 24 24',
        fill: 'none',
        'aria-hidden': true,
        focusable: false,
        style: { display: 'block', opacity: active ? 1 : 0.85 },
      },
        h('rect', {
          x: 2.6, y: 5.4, width: 18.8, height: 13.2, rx: 3,
          stroke: 'currentColor', strokeWidth: 1.6,
        }),
        h('path', {
          d: 'M6.2 9.4v1.2M9.4 9.4v1.2M12.6 9.4v1.2M15.8 9.4v1.2M6.2 12.6v1.2M9.4 12.6v1.2M12.6 12.6v1.2M15.8 12.6v1.2',
          stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round',
        }),
        h('path', {
          d: 'M7.6 16.1h8.8',
          stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round',
        }),
        h('path', {
          className: 'tp-panel-spark',
          d: 'M4.2 2.9 2.8 1.7M6.8 2.2V.9',
          strokeWidth: 1.4, strokeLinecap: 'round',
        }),
      );
    }

    // ---------- page ----------

    function useLocaleVersion() {
      const [, setVersion] = React.useState(0);
      React.useEffect(() => {
        const service = localeService;
        if (!service || typeof service.subscribe !== 'function') return undefined;
        let dispose = null;
        try {
          dispose = service.subscribe(() => {
            activeLanguage = detectLanguage(service);
            setVersion((version) => version + 1);
          });
        } catch {
          return undefined;
        }
        return () => {
          if (typeof dispose === 'function') dispose();
        };
      }, []);
    }

    function TypingPage() {
      useLocaleVersion();
      const [session, setSession] = React.useState(() => createSession(DEFAULT_DURATION));
      const [best, setBest] = React.useState(loadBest);
      const [isRecord, setIsRecord] = React.useState(false);
      const [focused, setFocused] = React.useState(false);
      const inputRef = React.useRef(null);
      const bestRef = React.useRef(best);
      const handledResultRef = React.useRef(null);

      React.useEffect(() => {
        bestRef.current = best;
      }, [best]);

      React.useEffect(() => {
        const element = inputRef.current;
        if (element) element.focus();
      }, []);

      React.useEffect(() => {
        if (session.startAt == null || session.result) return undefined;
        const id = window.setInterval(() => {
          setSession((previous) => {
            if (previous.startAt == null || previous.result) return previous;
            const now = performance.now();
            const elapsed = now - previous.startAt;
            if (elapsed >= previous.duration * 1000) {
              return finishSession({ ...previous, nowMs: now }, elapsed);
            }
            return { ...previous, nowMs: now };
          });
        }, 100);
        return () => window.clearInterval(id);
      }, [session.startAt, session.result]);

      React.useEffect(() => {
        const result = session.result;
        if (!result) {
          handledResultRef.current = null;
          return;
        }
        if (handledResultRef.current === result) return;
        handledResultRef.current = result;
        const current = bestRef.current[result.duration];
        const accuracyPct = Math.round(result.accuracy * 100);
        const better = !current
          || result.wpm > current.wpm
          || (result.wpm === current.wpm && accuracyPct > Math.round(current.accuracy * 100));
        if (!better) {
          setIsRecord(false);
          return;
        }
        const next = {
          ...bestRef.current,
          [result.duration]: { wpm: result.wpm, accuracy: result.accuracy, at: result.at },
        };
        bestRef.current = next;
        setBest(next);
        saveBest(next);
        setIsRecord(true);
      }, [session.result]);

      function restart(nextDuration) {
        const duration = nextDuration || session.duration;
        setSession(createSession(duration));
        setIsRecord(false);
        const element = inputRef.current;
        if (element) element.focus();
      }

      function handleKeyDown(event) {
        if (event.metaKey || event.ctrlKey || event.altKey) return;
        if (event.isComposing) return;
        if (event.key === 'Tab' && !event.shiftKey && !event.repeat) {
          event.preventDefault();
          event.stopPropagation();
          restart(session.duration);
          return;
        }
        if (session.result) return;
        if (event.key === 'Backspace') {
          event.preventDefault();
          event.stopPropagation();
          setSession((previous) => {
            if (previous.result || previous.typed.length === 0) return previous;
            return { ...previous, typed: previous.typed.slice(0, -1) };
          });
          return;
        }
        if (event.key.length !== 1) return;
        event.preventDefault();
        event.stopPropagation();
        const character = event.key;
        const now = performance.now();
        setSession((previous) => {
          if (previous.result || previous.typed.length >= previous.text.length) return previous;
          const expected = previous.text[previous.typed.length];
          const typed = previous.typed + character;
          const next = {
            ...previous,
            typed,
            keystrokes: previous.keystrokes + 1,
            wrongKeys: previous.wrongKeys + (character === expected ? 0 : 1),
            startAt: previous.startAt == null ? now : previous.startAt,
            nowMs: now,
          };
          return typed.length >= previous.text.length ? finishSession(next) : next;
        });
      }

      function focusInput() {
        const element = inputRef.current;
        if (element) element.focus();
      }

      function keepFocus(event) {
        event.preventDefault();
      }

      function clearInput(event) {
        event.currentTarget.value = '';
      }

      function blockEvent(event) {
        event.preventDefault();
      }

      const stats = sessionStats(session);
      const result = session.result;
      const shownWpm = result ? result.wpm : stats.wpm;
      const shownAccuracy = Math.round((result ? result.accuracy : stats.accuracy) * 100);
      const remaining = Math.max(0, Math.ceil((session.duration * 1000 - stats.ms) / 1000));
      const progress = Math.max(0, Math.min(1, stats.ms / (session.duration * 1000)));
      const bestForDuration = best[session.duration] || null;

      return h('div', { className: 'tp-root' },
        h('div', { className: 'tp-page' },
          h('header', { className: 'tp-header' },
            h('div', null,
              h('h1', { className: 'tp-title' }, t('panelTitle')),
              h('p', { className: 'tp-subtitle' }, t('panelSubtitle')),
            ),
            h('div', { className: 'tp-best' },
              bestForDuration
                ? t('bestValue', { wpm: bestForDuration.wpm, acc: Math.round(bestForDuration.accuracy * 100) })
                : t('bestNone'),
            ),
          ),
          h('div', { className: 'tp-toolbar' },
            h('div', { className: 'tp-seg', role: 'group', 'aria-label': t('durationLabel') },
              DURATIONS.map((duration) => h('button', {
                key: duration,
                type: 'button',
                className: 'tp-seg-btn' + (duration === session.duration ? ' active' : ''),
                'aria-pressed': duration === session.duration,
                onMouseDown: keepFocus,
                onClick: () => restart(duration),
              }, t('durationOption', { n: duration }))),
            ),
            h('span', { className: 'tp-toolbar-hint' }, t('restartHint')),
          ),
          h('div', { className: 'tp-stats' },
            h(Stat, { label: t('statsWpm'), value: shownWpm, accent: true }),
            h(Stat, { label: t('statsAccuracy'), value: shownAccuracy, unit: t('unitPercent') }),
            h(Stat, { label: t('statsErrors'), value: result ? result.wrongKeys : session.wrongKeys }),
            h(Stat, { label: t('statsRemaining'), value: remaining, unit: t('unitSeconds') }),
          ),
          h('div', { className: 'tp-card' },
            h('div', {
              className: 'tp-timebar',
              role: 'progressbar',
              'aria-label': t('timebarLabel'),
              'aria-valuemin': 0,
              'aria-valuemax': 100,
              'aria-valuenow': Math.round(progress * 100),
            },
              h('div', { className: 'tp-timebar-fill', style: { width: (progress * 100).toFixed(1) + '%' } }),
            ),
            result ? h('div', { className: 'tp-result', role: 'status', 'aria-live': 'polite' },
              h('div', { className: 'tp-result-title' },
                h('span', null, t('resultTitle')),
                isRecord ? h('span', { className: 'tp-record' }, t('newRecordBadge')) : null,
              ),
              h('div', { className: 'tp-result-grid' },
                h(ResultItem, { label: t('statsWpm'), value: result.wpm }),
                h(ResultItem, { label: t('resultAccuracy'), value: Math.round(result.accuracy * 100) + '%' }),
                h(ResultItem, { label: t('resultCorrect'), value: result.correct }),
                h(ResultItem, { label: t('resultErrors'), value: result.wrongKeys }),
              ),
              h('div', { className: 'tp-result-actions' },
                h('button', {
                  type: 'button',
                  className: 'tp-btn primary',
                  onMouseDown: keepFocus,
                  onClick: () => restart(session.duration),
                }, t('restart')),
              ),
            ) : null,
            h('div', { className: 'tp-board-wrap', onClick: focusInput },
              h(TextBoard, {
                text: session.text,
                typed: session.typed,
                caretIndex: result ? -1 : session.typed.length,
              }),
              h('textarea', {
                ref: inputRef,
                className: 'tp-input',
                'aria-label': t('inputLabel'),
                autoComplete: 'off',
                autoCorrect: 'off',
                autoCapitalize: 'off',
                spellCheck: false,
                onKeyDown: handleKeyDown,
                onPaste: blockEvent,
                onDrop: blockEvent,
                onInput: clearInput,
                onFocus: () => setFocused(true),
                onBlur: () => setFocused(false),
              }),
              (!focused && !result) ? h('div', { className: 'tp-focus-hint' }, t('focusHint')) : null,
            ),
          ),
          h('div', { className: 'tp-foot' },
            h('span', null, t('footerTip')),
            h('span', null, t('restartHint')),
          ),
        ),
      );
    }

    // ---------- plugin ----------

    return {
      inject: ['slots'],
      apply(ctx) {
        const slots = ctx.get('slots');
        if (!slots) return;

        const locale = ctx.get('locale');
        if (locale) {
          localeService = locale;
          activeLanguage = detectLanguage(locale);
          try {
            const disposeLocale = locale.register(NS, dictionaries);
            if (typeof disposeLocale === 'function') ctx.effect(() => disposeLocale);
          } catch {
            // keep the built-in dictionary when the locale service rejects it
          }
          try {
            const bound = locale.bind(NS);
            if (typeof bound === 'function') {
              const fallback = (key) => (dictionaries[activeLanguage] || zh)[key] ?? key;
              t = (key, vars) => {
                let text;
                try {
                  text = bound(key);
                } catch {
                  text = undefined;
                }
                if (!text || text === key) text = fallback(key);
                return interpolate(text, vars);
              };
            }
          } catch {
            // fall back to the built-in dictionary
          }
        }

        ctx.effect(() => {
          const style = document.createElement('style');
          style.setAttribute('data-typing-practice-style', '');
          style.textContent = CSS;
          document.head.appendChild(style);
          return () => style.remove();
        });

        slots.inject('sidebar.panellist', () => slots.register({
          name: 'sidebar.panellist',
          id: 'typing-practice',
          order: 15,
          label: () => t('panelLabel'),
          locale: NS,
        }, PanelIcon));

        slots.inject('main', () => slots.register({
          name: 'main',
          key: 'typing-practice',
        }, TypingPage));
      },
    };
  },
});
