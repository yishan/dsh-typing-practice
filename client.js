// Typing practice client half: a sidebar panel entry plus its timed typing page.
//
// Loaded as a classic-script plugin through window.__ModuleLoader__; the only
// external module it imports is the platform React runtime. Pronunciation
// engines arrive as package-local DSH chunks. Practice text is generated locally,
// timing uses performance.now(), and the
// best scores are kept locally, separated by language and scoring rules.

window.__ModuleLoader__.load({
  id: 'typing-practice',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const NS = 'typing-practice';
    const LEGACY_STORE_KEY = 'dsh.typing-practice.v1';
    const STORE_KEY = 'dsh.typing-practice.v2';
    const LANGUAGES = ['en', 'zh', 'yue'];
    const HINT_MODES = ['off', 'current', 'all'];
    const RULES_VERSION = 2;
    const DURATIONS = [15, 30, 60];
    const DEFAULT_DURATION = 30;
    const TEXT_CHARS = 1200;

    // ---------- copy ----------

    const zh = {
      panelLabel: '打字练习',
      panelTitle: '打字练习',
      panelSubtitle: '限时测速，实时统计速度与准确率',
      bestValue: '最佳 {speed} {unit} · {acc}%',
      legacyBestValue: '旧版最佳 {speed} WPM · {acc}%',
      bestNone: '暂无最佳记录',
      languageLabel: '语料语言',
      language_en: '英文',
      language_zh: '中文',
      language_yue: '粤语',
      statsCpm: '字/分钟',
      cpmTip: '按正确上屏的可见字符计速，含标点；组字和选词时间计入用时。',
      storageError: '本次成绩未能保存到浏览器。',
      hint_zh: '拼音',
      hint_yue: '粤拼',
      hint_off: '关闭',
      hint_current: '当前词',
      hint_all: '全部',
      hintChange: '更改提示会开始新一轮',
      hintLoading: '正在准备注音…',
      hintError: '注音暂时不可用，可重试或关闭提示继续练习。',
      hintRetry: '重试注音',
      durationLabel: '练习时长',
      durationOption: '{n} 秒',
      statsWpm: 'WPM',
      statsAccuracy: '准确率',
      statsErrors: '错误',
      statsRemaining: '剩余',
      unitSeconds: '秒',
      unitPercent: '%',
      timebarLabel: '本轮进度',
      focusHint: '点击或用 Tab 聚焦后输入',
      inputLabel: '打字练习输入区',
      resultTitle: '本轮成绩',
      resultEarly: '提前完成 · {seconds} 秒（不计入限时最佳）',
      resultAccuracy: '准确率',
      resultCorrect: '正确字符',
      resultErrors: '错误',
      newRecordBadge: '新纪录',
      restart: '再来一次',
      restartRun: '重新开始',
      restartHint: '开始打字即计时',
      restartHintIme: '开始组字即计时，上屏后判分',
      footerTip: '输入错误可退格修正；最佳成绩只保存在本机浏览器。',
      inputPlaceholder: '',
    };

    const en = {
      panelLabel: 'Typing practice',
      panelTitle: 'Typing practice',
      panelSubtitle: 'Timed runs with live speed and accuracy',
      bestValue: 'Best {speed} {unit} · {acc}%',
      legacyBestValue: 'Legacy best {speed} WPM · {acc}%',
      bestNone: 'No best score yet',
      languageLabel: 'Text language',
      language_en: 'English',
      language_zh: '中文',
      language_yue: '粵語',
      statsCpm: 'CPM',
      cpmTip: 'Correct committed characters per minute, including punctuation. Composition and candidate selection count toward time.',
      storageError: 'This score could not be saved in the browser.',
      hint_zh: 'Pinyin',
      hint_yue: 'Jyutping',
      hint_off: 'Off',
      hint_current: 'Current word',
      hint_all: 'All',
      hintChange: 'Changing hints starts a new run',
      hintLoading: 'Preparing pronunciation…',
      hintError: 'Pronunciation is unavailable. Retry or turn hints off to continue.',
      hintRetry: 'Retry pronunciation',
      durationLabel: 'Test duration',
      durationOption: '{n}s',
      statsWpm: 'WPM',
      statsAccuracy: 'Accuracy',
      statsErrors: 'Errors',
      statsRemaining: 'Left',
      unitSeconds: 's',
      unitPercent: '%',
      timebarLabel: 'Test progress',
      focusHint: 'Click or Tab here to type',
      inputLabel: 'Typing practice input',
      resultTitle: 'Result',
      resultEarly: 'Completed early · {seconds}s (excluded from timed best)',
      resultAccuracy: 'Accuracy',
      resultCorrect: 'Correct chars',
      resultErrors: 'Errors',
      newRecordBadge: 'New record',
      restart: 'Try again',
      restartRun: 'Restart',
      restartHint: 'Timing starts on the first key',
      restartHintIme: 'Time starts with composition; committed text is scored',
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
        const id = String(snapshot && (snapshot.active || snapshot.id || snapshot.locale || snapshot.current) || '');
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

    // Original short passages. Repeat complete sentences to keep timed runs
    // supplied with text; annotation and imported corpora are a later stage.
    const PASSAGES = {
      zh: [
        '今天的天气很好，我打算下班后去公园散步。路上可以买些水果，回家再慢慢准备晚饭。',
        '把窗户打开，让新鲜空气进来。桌上的书还没有看完，先读几页，再开始今天的工作。',
        '学习新东西时，不必急着追求速度。先把每一步做准确，多练几次，就会越来越熟悉。',
        '周末和朋友约好一起吃饭。大家各带一道菜，坐下来聊聊最近的生活，也商量下次去哪里。',
        '雨停以后，街上的灯映在水面上。我收起雨伞，沿着熟悉的小路走回家。',
        '遇到不明白的问题，可以先记下来。等手头的事情做完，再找一个安静的时间认真研究。',
      ],
      yue: [
        '我今日想早啲收工，返屋企煮飯。你得閒嘅話，一齊食啦。食完飯仲可以落街行個圈。',
        '出面落緊雨，出門口記得帶遮。唔使咁趕，慢慢行，最緊要平平安安返到屋企。',
        '呢間茶餐廳嘅奶茶幾好飲，下次帶你嚟試吓。我哋坐埋窗邊，一邊食嘢一邊傾偈。',
        '聽日朝早你得唔得閒？我想去街市買啲餸，順便睇吓有冇新鮮生果。',
        '呢件事唔使急住決定。你諗清楚先，有咩唔明就問，大家一齊搵辦法。',
        '搭車嗰陣見到個老朋友，原來佢搬咗嚟附近住。我哋交換咗電話，約好下個星期飲茶。',
      ],
    };
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    function characters(text) {
      return Array.from(segmenter.segment(text), (part) => part.segment);
    }
    function practiceText(language) {
      if (language === 'en') return generateText(TEXT_CHARS);
      const passages = PASSAGES[language];
      const offset = Math.floor(Math.random() * passages.length);
      let text = '';
      for (let i = 0; text.length < TEXT_CHARS; i++) text += passages[(offset + i) % passages.length];
      return text;
    }

    // Load only the chosen language. Reuse engines and prepared passages;
    // rejected loads are forgotten so retry is a real attempt.
    const engines = new Map();
    const annotationsCache = new Map();
    function loadAnnotations(language, text) {
      const key = language + ':' + text;
      if (annotationsCache.has(key)) return Promise.resolve(annotationsCache.get(key));
      if (!engines.has(language)) {
        const name = language === 'zh' ? 'pinyin' : 'jyutping';
        engines.set(language, Promise.resolve().then(() => require.async(`./client.${name}.js`)).catch(error => {
          engines.delete(language);
          throw error;
        }));
      }
      return engines.get(language).then(engine => {
        const tokens = engine.annotate(text);
        if (!Array.isArray(tokens) || tokens.map(token => token.char).join('') !== text
          || tokens.length !== characters(text).length) throw new Error('Invalid pronunciation alignment');
        annotationsCache.set(key, tokens);
        if (annotationsCache.size > 24) annotationsCache.delete(annotationsCache.keys().next().value);
        return tokens;
      });
    }

    // ---------- best score ----------

    function recordKey(language, duration, hints = 'off') {
      return `${language}:${duration}:builtin:${hints === 'off' ? 'plain' : hints}:${RULES_VERSION}`;
    }

    function loadBest() {
      try {
        const raw = window.localStorage.getItem(STORE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        const stored = parsed && typeof parsed === 'object' ? parsed.best : null;
        if (!stored || typeof stored !== 'object') return {};
        const best = {};
        if (parsed.version !== 2) return {};
        for (const language of LANGUAGES) for (const duration of DURATIONS) for (const hints of language === 'en' ? ['off'] : HINT_MODES) {
          const key = recordKey(language, duration, hints);
          const entry = stored[key];
          if (!entry || !Number.isFinite(entry.speed) || entry.speed < 0) continue;
          best[key] = {
            speed: Math.round(entry.speed),
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
        window.localStorage.setItem(STORE_KEY, JSON.stringify({ version: 2, best }));
        return true;
      } catch {
        return false;
      }
    }

    function loadLegacyBest() {
      try {
        return JSON.parse(window.localStorage.getItem(LEGACY_STORE_KEY) || '{}').best || {};
      } catch {
        return {};
      }
    }

    // ---------- session engine ----------

    let nextSessionId = 0;
    function createSession(duration, language = 'en', hints = language === 'en' ? 'off' : 'current', originalText) {
      const text = originalText || practiceText(language);
      return {
        id: ++nextSessionId,
        language,
        hints,
        annotations: null,
        annotationState: hints === 'off' ? 'off' : 'loading',
        duration,
        text,
        target: characters(text),
        typed: '',
        keystrokes: 0,
        wrongKeys: 0,
        startAt: null,
        nowMs: 0,
        result: null,
      };
    }

    function countCorrect(text, typed) {
      text = characters(text);
      typed = characters(typed);
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
      const divisor = session.language === 'en' ? 5 : 1;
      const speed = ms > 0 ? Math.round((correct / divisor) / (ms / 60000)) : 0;
      return { ms, correct, accuracy, speed };
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
          speed: Math.round((correct / (session.language === 'en' ? 5 : 1)) / (ms / 60000)),
          language: session.language,
          hints: session.hints,
          eligible: ms >= session.duration * 1000,
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

    function checkDeadline(session, now) {
      if (session.result) return session;
      if (session.startAt != null && now - session.startAt >= session.duration * 1000) {
        return finishSession({ ...session, nowMs: now }, now - session.startAt);
      }
      return session;
    }

    // Reconcile the native buffer, not event.data: compositionend and input may
    // report the same edit. An unchanged buffer is a no-op, while a new identical
    // word is still an insertion. Native selection replacements work as well.
    function reconcileText(session, value, now) {
      session = checkDeadline(session, now);
      if (session.result) return session;
      const before = characters(session.typed);
      const after = characters(value).slice(0, session.target.length);
      let start = 0;
      while (start < before.length && start < after.length && before[start] === after[start]) start++;
      let oldEnd = before.length;
      let newEnd = after.length;
      while (oldEnd > start && newEnd > start && before[oldEnd - 1] === after[newEnd - 1]) { oldEnd--; newEnd--; }
      if (start === oldEnd && start === newEnd) return session;
      const inserted = after.slice(start, newEnd);
      const next = {
        ...session,
        typed: after.join(''),
        keystrokes: session.keystrokes + inserted.length,
        wrongKeys: session.wrongKeys + inserted.filter((char, i) => char !== session.target[start + i]).length,
        startAt: session.startAt == null && inserted.length ? now : session.startAt,
        nowMs: now,
      };
      return after.length >= session.target.length ? finishSession(next) : next;
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
  flex-wrap: wrap;
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
  min-height: 44px;
  min-width: 44px;
  padding: 0 14px;
  border-radius: 7px;
  cursor: pointer;
  transition: background 120ms ease, color 120ms ease;
}
.tp-seg-btn.active {
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
}
.tp-toolbar-hint {
  font-size: 11.5px;
  color: var(--dsw-alias-label-secondary);
}
.tp-hint-control { display: inline-flex; align-items: center; gap: 8px; color: var(--dsw-alias-label-secondary); }
.tp-hint-control select {
  min-height: 44px;
  max-width: 100%;
  padding: 0 10px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font: inherit;
}
.tp-hint-control select:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 3px; }
.tp-annotation-status { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; color: var(--dsw-alias-label-secondary); }
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
  cursor: text;
}
.tp-board-wrap:focus-within, .tp-seg-btn:focus-visible, .tp-btn:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 3px;
}
.tp-viewport {
  height: calc(4 * 1.85em + 4px);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  font-size: 21px;
  line-height: 1.85;
}
.tp-board {
  padding: 2px;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  font-size: inherit;
  line-height: inherit;
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
  position: fixed;
  top: 0;
  left: 0;
  width: 2px;
  height: 24px;
  margin: 0;
  padding: 0;
  border: 0;
  resize: none;
  overflow: hidden;
  pointer-events: none;
  background: transparent;
  color: transparent;
  caret-color: transparent;
  cursor: text;
  font-size: 16px;
  line-height: 24px;
}
.tp-ime .tp-viewport { height: calc(3 * 2.7em + 4px); line-height: 2.7; }
.tp-ime .tp-board { font-family: inherit; letter-spacing: 0.1em; }
.tp-annotated .tp-board { padding-top: 12px; letter-spacing: 0; }
.tp-ruby { ruby-align: center; margin-inline: 0.12em; line-height: 1; }
.tp-ruby .tp-char { display: inline-block; min-width: 1em; text-align: center; line-height: 1.2; }
.tp-ruby rt {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1;
  color: var(--dsw-alias-label-secondary);
  user-select: none;
}
.tp-ruby rt.tp-reading-hidden { visibility: hidden; }
.tp-composition {
  position: fixed;
  z-index: 2;
  max-width: min(360px, calc(100vw - 24px));
  padding: 1px 4px;
  border-bottom: 2px solid var(--dsw-alias-brand-primary);
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  line-height: 20px;
  overflow-wrap: anywhere;
  pointer-events: none;
}
.tp-save-error { color: var(--dsw-alias-state-error-primary); }
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
.tp-actions { display: flex; justify-content: flex-end; }
.tp-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  min-width: 44px;
  padding: 0 14px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font-family: inherit;
  font-size: 12.5px;
  cursor: pointer;
}
.tp-seg-btn, .tp-btn, .tp-input { touch-action: manipulation; }
@media (hover: hover) and (pointer: fine) {
  .tp-seg-btn:hover { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2); }
  .tp-btn:hover {
    background: var(--dsw-alias-bg-layer-2);
    border-color: var(--dsw-alias-border-l2);
  }
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
  .tp-viewport { font-size: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .tp-seg-btn, .tp-timebar-fill { transition: none; }
}
`;

    // ---------- board ----------

    function revealCaret(viewport) {
      if (!viewport) return;
      const caret = viewport.querySelector('.tp-char.caret');
      if (!caret) return;
      const bounds = viewport.getBoundingClientRect();
      const cursor = caret.getBoundingClientRect();
      const lineHeight = parseFloat(window.getComputedStyle(viewport).lineHeight);
      const top = cursor.top - bounds.top - viewport.clientTop;
      const bottom = cursor.bottom - bounds.top - viewport.clientTop;
      // Keep a line of context above and below the cursor; scroll only this
      // viewport so typing never moves the page or the surrounding DSH shell.
      if (top < lineHeight || bottom > viewport.clientHeight - lineHeight) {
        const first = viewport.querySelector('.tp-char').getBoundingClientRect();
        const row = Math.round((cursor.top - first.top) / lineHeight);
        viewport.scrollTop = Math.max(0, (row - 1) * lineHeight);
      }
    }

    function positionInput(viewport, input, preview) {
      if (!viewport || !input) return;
      const anchor = viewport.querySelector('[data-input-anchor]');
      if (!anchor) return;
      const bounds = viewport.getBoundingClientRect();
      const rect = anchor.getBoundingClientRect();
      const left = Math.max(12, Math.min(rect.left, bounds.right - 4, window.innerWidth - 16));
      const top = Math.max(12, Math.min(rect.top, bounds.bottom - 24, window.innerHeight - 28));
      input.style.left = `${left}px`;
      input.style.top = `${top}px`;
      if (preview) {
        preview.style.left = `${Math.min(left, Math.max(12, window.innerWidth - 160))}px`;
        preview.style.top = `${Math.min(top + rect.height + 2, window.innerHeight - 48)}px`;
      }
    }

    const TextBoard = React.memo(function TextBoard({ text, typed, caretIndex, finished, annotations, hints }) {
      const nodes = [];
      const target = characters(text);
      const entered = characters(typed);
      for (let i = 0; i <= target.length; i++) {
        const ch = target[i] || '\u200b';
        let className = 'tp-char';
        if (i < entered.length) {
          className += entered[i] === ch ? ' correct' : ' wrong';
        }
        if (i === caretIndex && !finished) className += ' caret';
        const character = h('span', { className, key: i, 'data-input-anchor': i === caretIndex ? '' : undefined }, ch);
        const token = annotations && annotations[i];
        if (hints !== 'off' && token && token.reading) {
          const visible = hints === 'all' || (caretIndex >= token.wordStart && caretIndex < token.wordEnd);
          nodes.push(h('ruby', { className: 'tp-ruby', key: i }, character,
            h('rt', { className: visible ? 'tp-reading' : 'tp-reading tp-reading-hidden', 'aria-hidden': !visible }, token.reading),
          ));
        } else nodes.push(character);
      }
      return h('div', { className: 'tp-board' }, nodes);
    });

    function Stat({ label, value, unit, accent, description }) {
      return h('div', { className: accent ? 'tp-stat accent' : 'tp-stat', title: description },
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
      const [saveError, setSaveError] = React.useState(false);
      const [hintPreference, setHintPreference] = React.useState('current');
      const [annotationAttempt, setAnnotationAttempt] = React.useState(0);
      const [legacyBest] = React.useState(loadLegacyBest);
      const [caretIndex, setCaretIndex] = React.useState(0);
      const [composition, setComposition] = React.useState({ active: false, text: '' });
      const compositionRef = React.useRef({ active: false, anchor: 0 });
      const inputRef = React.useRef(null);
      const previewRef = React.useRef(null);
      const viewportRef = React.useRef(null);
      const sessionRef = React.useRef(session);
      const focusAfterRestart = React.useRef(false);
      const bestRef = React.useRef(best);
      const handledResultRef = React.useRef(null);

      function updateSession(update) {
        const next = update(sessionRef.current);
        sessionRef.current = next;
        setSession(next);
        return next;
      }

      function position() {
        positionInput(viewportRef.current, inputRef.current, previewRef.current);
      }

      React.useEffect(() => {
        bestRef.current = best;
      }, [best]);

      React.useLayoutEffect(() => {
        if (viewportRef.current) viewportRef.current.scrollTop = 0;
        if (focusAfterRestart.current) {
          focusAfterRestart.current = false;
          focusInput();
        }
      }, [session.id]);

      React.useLayoutEffect(() => {
        revealCaret(viewportRef.current);
        position();
      }, [session.id, session.typed, session.annotations, caretIndex, composition.text]);

      React.useEffect(() => {
        if (session.hints === 'off') return undefined;
        let cancelled = false;
        const id = session.id;
        loadAnnotations(session.language, session.text).then(annotations => {
          if (cancelled || sessionRef.current.id !== id) return;
          updateSession(previous => ({ ...previous, annotations, annotationState: 'ready' }));
        }).catch(() => {
          if (cancelled || sessionRef.current.id !== id) return;
          updateSession(previous => ({ ...previous, annotationState: 'error' }));
        });
        return () => { cancelled = true; };
      }, [session.id, annotationAttempt]);

      React.useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return undefined;
        const resize = () => {
          revealCaret(viewport);
          if (document.activeElement === inputRef.current) {
            viewport.parentElement.scrollIntoView({ block: 'nearest' });
          }
          position();
        };
        const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
        if (observer) observer.observe(viewport);
        window.addEventListener('scroll', position, true);
        window.addEventListener('resize', resize);
        return () => {
          if (observer) observer.disconnect();
          window.removeEventListener('scroll', position, true);
          window.removeEventListener('resize', resize);
        };
      }, []);

      React.useEffect(() => {
        if (session.startAt == null || session.result) return undefined;
        const id = window.setInterval(() => {
          updateSession((previous) => {
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
        if (!result || !result.eligible) {
          handledResultRef.current = null;
          return;
        }
        if (handledResultRef.current === result) return;
        handledResultRef.current = result;
        const key = recordKey(result.language, result.duration, result.hints);
        const current = bestRef.current[key];
        const accuracyPct = Math.round(result.accuracy * 100);
        const better = !current
          || result.speed > current.speed
          || (result.speed === current.speed && accuracyPct > Math.round(current.accuracy * 100));
        if (!better) {
          setIsRecord(false);
          return;
        }
        const next = {
          ...bestRef.current,
          [key]: { speed: result.speed, accuracy: result.accuracy, at: result.at },
        };
        bestRef.current = next;
        setBest(next);
        setSaveError(!saveBest(next));
        setIsRecord(true);
      }, [session.result]);

      function restart(nextDuration, focus = false, language = session.language, hints = language === 'en' ? 'off' : hintPreference, originalText) {
        const duration = nextDuration || session.duration;
        // Change the epoch before blurring. Some IMEs commit on blur; that
        // commit belongs to the old input node and must not enter the new run.
        updateSession(() => createSession(duration, language, hints, originalText));
        if (inputRef.current) inputRef.current.blur();
        compositionRef.current = { active: false, anchor: 0 };
        setComposition({ active: false, text: '' });
        setCaretIndex(0);
        setIsRecord(false);
        setSaveError(false);
        focusAfterRestart.current = focus;
      }

      function currentEvent() {
        return session.id === sessionRef.current.id;
      }

      function nativeEvent(event) { return event.nativeEvent || event; }

      function inputReady() {
        return ['off', 'ready'].includes(sessionRef.current.annotationState);
      }

      function startComposition(text) {
        if (text) updateSession((previous) => {
          const now = performance.now();
          const checked = checkDeadline(previous, now);
          return checked.result || checked.startAt != null ? checked
            : { ...checked, startAt: now, nowMs: now };
        });
        setComposition({ active: true, text });
      }

      function handleCompositionStart(event) {
        if (!currentEvent() || sessionRef.current.result || !inputReady()) return;
        compositionRef.current = { active: true, anchor: caretIndex };
        startComposition(event.data || '');
      }

      function handleCompositionUpdate(event) {
        if (!currentEvent()) return;
        if (!compositionRef.current.active) return;
        startComposition(event.data || '');
      }

      function updateCaret(element) {
        if (!element || compositionRef.current.active) return;
        const end = element.selectionEnd == null ? element.value.length : element.selectionEnd;
        setCaretIndex(characters(element.value.slice(0, end)).length);
      }

      function acceptBuffer(element) {
        if (!inputReady()) {
          element.value = sessionRef.current.typed;
          return;
        }
        const now = performance.now();
        const next = updateSession((previous) => reconcileText(previous, element.value, now));
        if (element.value !== next.typed) element.value = next.typed;
        updateCaret(element);
      }

      function handleCompositionEnd(event) {
        if (!currentEvent() || !compositionRef.current.active) return;
        compositionRef.current.active = false;
        setComposition({ active: false, text: '' });
        // The native buffer already contains the confirmed text (or the
        // restored pre-composition text after cancellation). Do not guess a
        // candidate from the target text or append event.data a second time.
        acceptBuffer(event.currentTarget);
      }

      function handleInput(event) {
        if (!currentEvent()) return;
        if (!inputReady()) { event.currentTarget.value = sessionRef.current.typed; return; }
        const input = nativeEvent(event);
        if (input.isComposing || compositionRef.current.active) {
          if (!compositionRef.current.active) compositionRef.current = { active: true, anchor: caretIndex };
          startComposition(input.data || '');
          return;
        }
        if (['insertFromPaste', 'insertFromDrop', 'insertFromYank'].includes(input.inputType)) {
          event.currentTarget.value = sessionRef.current.typed;
          updateCaret(event.currentTarget);
          return;
        }
        acceptBuffer(event.currentTarget);
      }

      function handleKeyDown(event) {
        if (!currentEvent()) return;
        if (event.key === 'Tab') return;
        if (!inputReady()) { event.preventDefault(); return; }
        const input = nativeEvent(event);
        // React's keyboard event and the browser's native event can disagree
        // at the edges of a composition. Let the IME own candidate keys.
        if (compositionRef.current.active || input.isComposing || event.isComposing || input.keyCode === 229) return;
        const checked = updateSession((previous) => checkDeadline(previous, performance.now()));
        if (checked.result || event.key === 'Enter') event.preventDefault();
      }

      function focusInput() {
        const element = inputRef.current;
        if (element) element.focus({ preventScroll: true });
      }

      function blockEvent(event) {
        event.preventDefault();
      }

      const stats = sessionStats(session);
      const result = session.result;
      const shownSpeed = result ? result.speed : stats.speed;
      const isIme = session.language !== 'en';
      const speedUnit = t(isIme ? 'statsCpm' : 'statsWpm');
      const shownAccuracy = Math.round((result ? result.accuracy : stats.accuracy) * 100);
      const remaining = Math.max(0, Math.ceil((session.duration * 1000 - stats.ms) / 1000));
      const progress = Math.max(0, Math.min(1, stats.ms / (session.duration * 1000)));
      const bestForDuration = best[recordKey(session.language, session.duration, session.hints)] || null;
      const legacy = !isIme && legacyBest[session.duration];

      return h('div', { className: 'tp-root' + (isIme ? ' tp-ime' : '') + (session.hints !== 'off' ? ' tp-annotated' : '') },
        h('div', { className: 'tp-page' },
          h('header', { className: 'tp-header' },
            h('div', null,
              h('h1', { className: 'tp-title' }, t('panelTitle')),
              h('p', { className: 'tp-subtitle' }, t('panelSubtitle')),
            ),
            h('div', { className: 'tp-best' },
              bestForDuration
                ? t('bestValue', { speed: bestForDuration.speed, unit: speedUnit, acc: Math.round(bestForDuration.accuracy * 100) })
                : legacy && Number.isFinite(legacy.wpm) && Number.isFinite(legacy.accuracy)
                  ? t('legacyBestValue', { speed: legacy.wpm, acc: Math.round(legacy.accuracy * 100) }) : t('bestNone'),
            ),
          ),
          h('div', { className: 'tp-toolbar' },
            h('div', { className: 'tp-seg', role: 'group', 'aria-label': t('languageLabel') },
              LANGUAGES.map((language) => h('button', {
                key: language,
                type: 'button',
                className: 'tp-seg-btn' + (language === session.language ? ' active' : ''),
                'aria-pressed': language === session.language,
                onClick: () => restart(session.duration, false, language),
              }, t('language_' + language))),
            ),
            h('div', { className: 'tp-seg', role: 'group', 'aria-label': t('durationLabel') },
              DURATIONS.map((duration) => h('button', {
                key: duration,
                type: 'button',
                className: 'tp-seg-btn' + (duration === session.duration ? ' active' : ''),
                'aria-pressed': duration === session.duration,
                onClick: () => restart(duration),
              }, t('durationOption', { n: duration }))),
            ),
            isIme ? h('label', { className: 'tp-hint-control' },
              h('span', null, t('hint_' + session.language)),
              h('select', {
                value: session.hints,
                'aria-label': t('hint_' + session.language),
                title: t('hintChange'),
                onChange: event => {
                  const hints = event.currentTarget.value;
                  if (!HINT_MODES.includes(hints) || hints === session.hints) return;
                  setHintPreference(hints);
                  restart(session.duration, false, session.language, hints, session.text);
                },
              }, HINT_MODES.map(mode => h('option', { key: mode, value: mode }, t('hint_' + mode)))),
            ) : null,
            h('span', { className: 'tp-toolbar-hint', id: 'tp-start-hint' }, t(isIme ? 'restartHintIme' : 'restartHint')),
          ),
          !inputReady() ? h('div', { className: 'tp-annotation-status', role: 'status' },
            h('span', null, t(session.annotationState === 'error' ? 'hintError' : 'hintLoading')),
            session.annotationState === 'error' ? h('button', {
              className: 'tp-btn', type: 'button',
              onClick: () => {
                updateSession(previous => ({ ...previous, annotationState: 'loading' }));
                setAnnotationAttempt(attempt => attempt + 1);
              },
            }, t('hintRetry')) : null,
          ) : null,
          h('div', { className: 'tp-stats' },
            h(Stat, { label: speedUnit, value: shownSpeed, accent: true, description: isIme ? t('cpmTip') : undefined }),
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
            h('div', { className: 'tp-board-wrap', onClick: focusInput },
              h('div', { className: 'tp-viewport', ref: viewportRef, tabIndex: -1 },
                h(TextBoard, {
                  text: session.text,
                  typed: session.typed,
                  caretIndex: composition.active ? compositionRef.current.anchor : caretIndex,
                  finished: Boolean(result),
                  annotations: session.annotations,
                  hints: session.hints,
                }),
              ),
              h('textarea', {
                key: session.id,
                ref: inputRef,
                className: 'tp-input',
                'aria-label': t('inputLabel'),
                'aria-describedby': 'tp-start-hint',
                readOnly: !inputReady() || Boolean(result) && !composition.active,
                wrap: 'off',
                autoComplete: 'off',
                autoCorrect: 'off',
                autoCapitalize: 'off',
                spellCheck: false,
                onKeyDown: handleKeyDown,
                onPaste: blockEvent,
                onDrop: blockEvent,
                onInput: handleInput,
                onCompositionStart: handleCompositionStart,
                onCompositionUpdate: handleCompositionUpdate,
                onCompositionEnd: handleCompositionEnd,
                onSelect: (event) => { if (currentEvent()) updateCaret(event.currentTarget); },
                onFocus: (event) => {
                  setFocused(true);
                  revealCaret(viewportRef.current);
                  event.currentTarget.parentElement.scrollIntoView({ block: 'nearest' });
                  position();
                },
                onBlur: () => setFocused(false),
              }),
              composition.active && composition.text ? h('div', {
                className: 'tp-composition', ref: previewRef, 'aria-hidden': true,
              }, composition.text) : null,
              (!focused && !result) ? h('div', { className: 'tp-focus-hint' }, t('focusHint')) : null,
            ),
            result ? h('div', { className: 'tp-result', role: 'status', 'aria-live': 'polite' },
              h('div', { className: 'tp-result-title' },
                h('span', null, result.eligible ? t('resultTitle') : t('resultEarly', { seconds: (result.elapsedMs / 1000).toFixed(1) })),
                isRecord ? h('span', { className: 'tp-record' }, t('newRecordBadge')) : null,
              ),
              h('div', { className: 'tp-result-grid' },
                h(ResultItem, { label: speedUnit, value: result.speed }),
                h(ResultItem, { label: t('resultAccuracy'), value: Math.round(result.accuracy * 100) + '%' }),
                h(ResultItem, { label: t('resultCorrect'), value: result.correct }),
                h(ResultItem, { label: t('resultErrors'), value: result.wrongKeys }),
              ),
            ) : null,
            h('div', { className: 'tp-actions' },
              h('button', {
                type: 'button',
                className: 'tp-btn primary',
                onClick: () => restart(session.duration, true),
              }, t(result ? 'restart' : 'restartRun')),
            ),
          ),
          h('div', { className: 'tp-foot' },
            h('span', null, t('footerTip')),
            saveError ? h('span', { className: 'tp-save-error', role: 'status' }, t('storageError')) : null,
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
