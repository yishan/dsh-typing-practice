// Typing practice client half: sidebar entry, timed practice and local passages.
//
// Loaded as a classic-script plugin through window.__ModuleLoader__; the only
// external module it imports is the platform React runtime. Pronunciation
// engines and keyboard recordings arrive as package-local DSH chunks. The Host can select local conversation
// text; timing uses performance.now(). Records and preferences are
// kept locally, separated from ephemeral conversation text.

window.__ModuleLoader__.load({
  id: 'typing-practice',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const NS = 'typing-practice';
    const LEGACY_STORE_KEY = 'dsh.typing-practice.v1';
    const STORE_KEY = 'dsh.typing-practice.v2';
    const RECORDS_KEY = 'dsh.typing-practice.v3';
    const HISTORY_LIMIT = 100;
    const PREFERENCES_KEY = 'dsh.typing-practice.preferences.v1';
    const SOUND_KEY = 'dsh.typing-practice.sound.v1';
    const SOUND_PACKS = ['off', 'mxblue', 'mxbrown', 'cream', 'holypanda'];
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
      panelSubtitle: '实时统计速度与准确率',
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
      corpusNext: '换一段', corpusCancel: '取消选取', corpusBuiltin: '默认语料',
      corpusSource: '语料来源', corpusLocal: '本地对话语料',
      corpusPreferenceError: '语料来源已切换，但未能保存，下次打开时需要重新选择。',
      corpusRecent: '近 30 天对话', corpusLoading: '正在选取近 30 天的语料…',
      corpusEmpty: '本次未找到合适的近期语料，已使用默认语料。',
      corpusUnavailable: '本地对话暂不可用，已使用默认语料。',
      corpusPassage: '完成一段', corpusElapsed: '用时', corpusCompleted: '已完成 · {seconds} 秒',
      corpusCount: '{n} 字符', corpusFooter: '仅保存练习统计与片段指纹，不保存对话正文。',
      records: '记录', recordsTitle: '练习记录', recordsClose: '关闭记录',
      recordsRunning: '完成或重新开始后可查看记录', recordsRecent: '最近练习', recordsBest: '限时最佳',
      recordsAll: '全部语言', recordsLanguage: '记录语言', recordsEmpty: '完成一轮练习后，成绩会出现在这里。',
      recordsBestEmpty: '还没有符合条件的限时最佳。', recordsLimit: '保留最近 100 次练习；同篇比较仅使用这些记录。',
      recordsLegacy: '旧版最佳', recordsHints: '提示：{mode}', recordsTimed: '{n} 秒限时',
      recordsCompleted: '已完成', recordsEarly: '提前完成', recordsDetails: '用时 {seconds} 秒 · 正确 {correct} · 错误 {errors}',
      recordsSame: '同篇记录', recordsSameTitle: '此片段的练习', recordsShowAll: '查看全部',
      recordsClear: '清空全部记录', recordsClearTitle: '清空练习记录？',
      recordsClearBody: '将清空练习历史和新旧最佳成绩，无法撤销。语料来源选项会保留。',
      recordsClearConfirm: '确认清空', recordsCancel: '取消', recordsClearError: '未能清空记录，请重试。现有记录仍保留。',
      compareFirst: '首次完成此条件的限时练习', compareFirstPassage: '近期还没有同篇、同提示档位的完成记录',
      compareTimed: '此前最佳 {speed} {unit} · {acc}% · 本次 {delta} {unit}',
      comparePassage: '近期同篇最佳 {speed} {unit} · {acc}% · 本次 {delta} {unit}',
      newPassageRecord: '同篇新纪录',
      sound: '音效', soundTitle: '键盘音效', soundClose: '关闭音效设置', soundPack: '声音', soundVolume: '音量', soundPreview: '试听',
      sound_off: '关闭', sound_mxblue: 'Cherry MX Blue · 青轴', sound_mxbrown: 'Cherry MX Brown · 茶轴',
      sound_cream: 'NovelKeys Cream · 奶油轴', sound_holypanda: 'Holy Panda · 圣熊猫',
      soundRunning: '完成或重新开始后可设置音效', soundLoading: '正在准备音效…',
      soundError: '音效暂不可用，可点击试听重试。练习不受影响。', soundSaveError: '音效选项未能保存，下次打开可能需要重新选择。',
      soundCredit: '录音：kbsim / Thomas Lai · MIT',
    };

    const en = {
      panelLabel: 'Typing practice',
      panelTitle: 'Typing practice',
      panelSubtitle: 'Live speed and accuracy',
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
      corpusNext: 'New passage', corpusCancel: 'Cancel selection', corpusBuiltin: 'Built-in text',
      corpusSource: 'Text source', corpusLocal: 'Local conversations',
      corpusPreferenceError: 'Text source changed but could not be saved. Select it again next time.',
      corpusRecent: 'Conversations · past 30 days', corpusLoading: 'Choosing text from the past 30 days…',
      corpusEmpty: 'No suitable recent text found. Using built-in text.',
      corpusUnavailable: 'Local history is unavailable. Using built-in text.',
      corpusPassage: 'Complete a passage', corpusElapsed: 'Elapsed', corpusCompleted: 'Completed · {seconds}s',
      corpusCount: '{n} characters', corpusFooter: 'Only statistics and a passage fingerprint are saved, never conversation text.',
      records: 'Records', recordsTitle: 'Practice records', recordsClose: 'Close records',
      recordsRunning: 'Finish or restart this run to view records', recordsRecent: 'Recent practice', recordsBest: 'Timed bests',
      recordsAll: 'All languages', recordsLanguage: 'Record language', recordsEmpty: 'Complete a practice run to see your results here.',
      recordsBestEmpty: 'No matching timed bests yet.', recordsLimit: 'Keeps the latest 100 runs. Same-passage comparisons use only these records.',
      recordsLegacy: 'Legacy bests', recordsHints: 'Hints: {mode}', recordsTimed: '{n}s timed',
      recordsCompleted: 'Completed', recordsEarly: 'Completed early', recordsDetails: '{seconds}s elapsed · {correct} correct · {errors} errors',
      recordsSame: 'Same passage', recordsSameTitle: 'Practice on this passage', recordsShowAll: 'Show all',
      recordsClear: 'Clear all records', recordsClearTitle: 'Clear practice records?',
      recordsClearBody: 'This permanently clears practice history and current and legacy bests. Your text source preference is kept.',
      recordsClearConfirm: 'Confirm clear', recordsCancel: 'Cancel', recordsClearError: 'Could not clear records. Your existing records are kept. Try again.',
      compareFirst: 'First completed timed run with these settings', compareFirstPassage: 'No recent completed run with this passage and hint setting',
      compareTimed: 'Previous best {speed} {unit} · {acc}% · This run {delta} {unit}',
      comparePassage: 'Recent same-passage best {speed} {unit} · {acc}% · This run {delta} {unit}',
      newPassageRecord: 'New passage best',
      sound: 'Sound', soundTitle: 'Keyboard sounds', soundClose: 'Close sound settings', soundPack: 'Sound', soundVolume: 'Volume', soundPreview: 'Preview',
      sound_off: 'Off', sound_mxblue: 'Cherry MX Blue', sound_mxbrown: 'Cherry MX Brown',
      sound_cream: 'NovelKeys Cream', sound_holypanda: 'Holy Panda',
      soundRunning: 'Finish or restart this run to change sounds', soundLoading: 'Preparing sounds…',
      soundError: 'Sound is unavailable. Preview to retry. Practice still works.', soundSaveError: 'Sound settings could not be saved. You may need to choose again next time.',
      soundCredit: 'Recordings: kbsim / Thomas Lai · MIT',
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

    // ---------- local records ----------

    function recordKey(language, duration, hints = 'off') {
      return `${language}:${duration}:builtin:${hints === 'off' ? 'plain' : hints}:${RULES_VERSION}`;
    }

    function sanitizeBest(stored) {
      if (!stored || typeof stored !== 'object') return {};
      const best = {};
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
    }

    function readStored(key) {
      try { return JSON.parse(window.localStorage.getItem(key) || 'null'); }
      catch { return null; }
    }

    function sanitizeLegacy(stored) {
      const legacy = {};
      for (const duration of DURATIONS) {
        const item = stored?.[duration];
        if (!item || !Number.isFinite(item.wpm) || item.wpm < 0 || !Number.isFinite(item.accuracy)) continue;
        legacy[duration] = { wpm: Math.round(item.wpm), accuracy: Math.max(0, Math.min(1, item.accuracy)), at: Number.isFinite(item.at) ? item.at : 0 };
      }
      return legacy;
    }

    function sanitizeHistory(stored) {
      if (!Array.isArray(stored)) return [];
      const ids = new Set();
      return stored.slice(0, HISTORY_LIMIT).flatMap(item => {
        if (!item || typeof item.id !== 'string' || item.id.length > 100 || !item.id || ids.has(item.id)
          || !LANGUAGES.includes(item.language) || !HINT_MODES.includes(item.hints) || item.language === 'en' && item.hints !== 'off'
          || item.rules !== RULES_VERSION || !['timed', 'passage'].includes(item.mode)
          || !['completed', 'early'].includes(item.status) || !Number.isFinite(item.accuracy) || item.accuracy < 0 || item.accuracy > 1
          || !['at', 'elapsedMs', 'speed', 'correct', 'wrongKeys', 'keystrokes', 'targetLength'].every(key => Number.isSafeInteger(item[key]) && item[key] >= 0)
          || item.at > 8640000000000000 || item.elapsedMs < 1 || item.targetLength < 1 || item.wrongKeys > item.keystrokes
          || item.correct > item.targetLength || item.correct > item.keystrokes
          || item.mode === 'timed' && (item.source !== 'builtin' || !DURATIONS.includes(item.duration)
            || item.elapsedMs > item.duration * 1000 || item.status === 'completed' && item.elapsedMs !== item.duration * 1000)
          || item.mode === 'passage' && (item.source !== 'local' || item.status !== 'completed')) return [];
        ids.add(item.id);
        // Whitelist fields: never retain text, chat titles, paths or message IDs.
        return [{ id: item.id, language: item.language, hints: item.hints, rules: item.rules,
          mode: item.mode, source: item.source, duration: item.mode === 'timed' ? item.duration : null,
          status: item.status, at: item.at, elapsedMs: item.elapsedMs, speed: item.speed, accuracy: item.accuracy,
          correct: item.correct, wrongKeys: item.wrongKeys, keystrokes: item.keystrokes, targetLength: item.targetLength,
          fingerprint: item.mode === 'passage' && /^[a-f0-9]{64}$/.test(item.fingerprint || '') ? item.fingerprint : null }];
      });
    }

    function loadRecords() {
      const current = readStored(RECORDS_KEY);
      if (current?.version === 3) return { version: 3, best: sanitizeBest(current.best), legacy: sanitizeLegacy(current.legacy), history: sanitizeHistory(current.history) };
      const previous = readStored(STORE_KEY);
      return { version: 3, best: previous?.version === 2 ? sanitizeBest(previous.best) : {}, legacy: sanitizeLegacy(readStored(LEGACY_STORE_KEY)?.best), history: [] };
    }

    function saveRecords(records) {
      try {
        // One write makes migration, completion and clearing atomic. Old keys
        // remain untouched; a valid v3 (including an empty one) is authoritative.
        window.localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
        return true;
      } catch { return false; }
    }

    function isBetter(result, previous) {
      return !previous || result.speed > previous.speed
        || result.speed === previous.speed && Math.round(result.accuracy * 100) > Math.round(previous.accuracy * 100);
    }

    function historyEntry(session) {
      const result = session.result;
      return { id: session.recordId, language: result.language, hints: result.hints, rules: RULES_VERSION,
        mode: session.source ? 'passage' : 'timed', source: session.source ? 'local' : 'builtin',
        duration: session.source ? null : result.duration, status: session.source || result.eligible ? 'completed' : 'early',
        at: result.at, elapsedMs: result.elapsedMs, speed: result.speed, accuracy: result.accuracy,
        correct: result.correct, wrongKeys: result.wrongKeys, keystrokes: result.keystrokes, targetLength: session.target.length,
        fingerprint: session.source && /^[a-f0-9]{64}$/.test(session.source.fingerprint || '') ? session.source.fingerprint : null };
    }

    function samePassageBest(history, entry) {
      if (!entry.fingerprint) return null;
      return history.filter(item => item.mode === 'passage' && item.fingerprint === entry.fingerprint
        && item.language === entry.language && item.hints === entry.hints && item.rules === entry.rules)
        .reduce((best, item) => isBetter(item, best) ? item : best, null);
    }

    function formatRecordDate(at) {
      if (!at || !Number.isFinite(at) || Math.abs(at) > 8640000000000000) return '—';
      return new Intl.DateTimeFormat(activeLanguage === 'en' ? 'en-US' : 'zh-CN', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      }).format(new Date(at));
    }

    function loadCorpusPreference() {
      try {
        const stored = JSON.parse(window.localStorage.getItem(PREFERENCES_KEY) || '{}');
        return stored?.version === 1 && stored.source === 'local' ? 'local' : 'builtin';
      } catch { return 'builtin'; }
    }

    function saveCorpusPreference(source) {
      try {
        window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ version: 1, source }));
        return true;
      } catch { return false; }
    }

    function loadSoundPreference() {
      const saved = readStored(SOUND_KEY);
      return { version: 1, pack: saved?.version === 1 && SOUND_PACKS.includes(saved.pack) ? saved.pack : 'off',
        volume: saved?.version === 1 && Number.isFinite(saved.volume) ? Math.max(0, Math.min(100, Math.round(saved.volume))) : 30 };
    }

    let audioModule;
    function loadAudioModule() {
      if (!audioModule) audioModule = require.async('./client.audio.js').catch(error => { audioModule = null; throw error; });
      return audioModule;
    }

    // ---------- session engine ----------

    let nextSessionId = 0;
    function createSession(duration, language = 'en', hints = language === 'en' ? 'off' : 'current', originalText, source = null) {
      const text = originalText || practiceText(language);
      return {
        id: ++nextSessionId,
        recordId: window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}-${nextSessionId}`,
        language,
        hints,
        source,
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
      const ms = Math.max(1, session.source ? raw : Math.min(raw, session.duration * 1000));
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
          eligible: !session.source && ms >= session.duration * 1000,
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
      if (!session.source && session.startAt != null && now - session.startAt >= session.duration * 1000) {
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
  -webkit-font-smoothing: antialiased;
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
.tp-header-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
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
  justify-content: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}
.tp-duration-slot { display: grid; }
.tp-duration-slot > * { grid-area: 1 / 1; }
.tp-passage-mode { display: flex; align-items: center; padding: 0 14px; color: var(--dsw-alias-label-secondary); font-size: 12.5px; }
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
  font-weight: 500;
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
}
.tp-hint-control { display: inline-flex; align-items: center; gap: 8px; color: var(--dsw-alias-label-secondary); }
.tp-select { position: relative; display: inline-flex; }
.tp-hint-control select, .tp-records-filter select, .tp-sound-field select {
  appearance: none;
  -webkit-appearance: none;
  min-height: 44px;
  max-width: 100%;
  padding: 0 36px 0 12px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  cursor: pointer;
}
.tp-select-chevron { position: absolute; right: 12px; top: 50%; width: 12px; height: 12px; transform: translateY(-50%); pointer-events: none; }
.tp-hint-control select:focus-visible, .tp-records-filter select:focus-visible, .tp-sound-field select:focus-visible { outline: 2px solid var(--dsw-alias-label-primary); outline-offset: 3px; }
.tp-annotation-status { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; color: var(--dsw-alias-label-secondary); }
.tp-corpus-bar { display: flex; gap: 8px 12px; flex-wrap: wrap; align-items: center; }
.tp-corpus-status { display: grid; flex: 1 1 260px; min-width: 0; min-height: 36px; align-items: center; font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-secondary); }
.tp-corpus-status > *, .tp-instructions > * { grid-area: 1 / 1; margin: 0; overflow-wrap: anywhere; }
.tp-status-size { visibility: hidden; pointer-events: none; user-select: none; }
.tp-corpus-name { font-variant-numeric: tabular-nums; }
.tp-corpus-controls { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-left: auto; }
.tp-corpus-controls .tp-seg-btn { padding: 0 10px; }
.tp-btn.tp-corpus-next { display: grid; justify-items: center; }
.tp-corpus-next > * { grid-area: 1 / 1; }
.tp-corpus-note { margin: 0; font-size: 12px; color: var(--dsw-alias-label-secondary); overflow-wrap: anywhere; }
.tp-corpus-note:empty { pointer-events: none; }
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
  outline: 2px solid var(--dsw-alias-label-primary);
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
  color: var(--dsw-alias-label-secondary);
  font-size: 11.5px;
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
.tp-comparison { flex-basis: 100%; margin: 0; font-size: 12px; color: var(--dsw-alias-label-secondary); }
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
.tp-actions { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.tp-instructions { display: grid; min-width: 0; flex: 1; font-size: 11.5px; line-height: 18px; }
.tp-actions > .tp-btn { flex: none; }
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
.tp-btn:disabled { opacity: .45; cursor: not-allowed; }
.tp-records-dialog { width: min(760px, calc(100vw - 32px)); height: min(680px, calc(100vh - 32px)); max-height: calc(100vh - 32px); padding: 0; margin: auto; border: 1px solid var(--dsw-alias-border-l1); border-radius: 14px; color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-base); font: inherit; }
.tp-records-dialog[open] { display: flex; flex-direction: column; }
.tp-records-dialog::backdrop { background: rgb(0 0 0 / .35); }
.tp-records-header, .tp-records-toolbar, .tp-records-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding: 12px 20px; flex: none; }
.tp-records-header h2 { margin: 0; font-size: 18px; }
.tp-records-toolbar { padding-top: 0; border-bottom: 1px solid var(--dsw-alias-border-l1); }
.tp-records-body { min-height: 0; flex: 1; overflow-y: auto; overscroll-behavior: contain; padding: 0 20px; }
.tp-records-footer { border-top: 1px solid var(--dsw-alias-border-l1); }
.tp-records-footer p { margin: 0; flex: 1 1 240px; color: var(--dsw-alias-label-secondary); font-size: 12px; }
.tp-record-list { padding: 0; margin: 0; list-style: none; }
.tp-record-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 12px; padding: 16px 0; border-bottom: 1px solid var(--dsw-alias-border-l1); font-variant-numeric: tabular-nums; }
.tp-record-row:last-child { border-bottom: 0; }
.tp-record-title { margin: 0; font-weight: 500; }
.tp-record-meta, .tp-record-detail { margin: 5px 0 0; color: var(--dsw-alias-label-secondary); font-size: 12px; overflow-wrap: anywhere; }
.tp-record-score { text-align: right; }
.tp-record-speed { font-size: 21px; font-weight: 600; }
.tp-record-unit { margin-left: 4px; font-size: 11.5px; color: var(--dsw-alias-label-secondary); }
.tp-record-link { min-height: 44px; padding: 0; margin: 0; background: transparent; border: 0; color: var(--dsw-alias-label-primary); font: inherit; font-size: 12px; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
.tp-record-link:focus-visible { outline: 2px solid var(--dsw-alias-label-primary); outline-offset: 3px; }
.tp-record-link:disabled { opacity: .45; cursor: not-allowed; }
.tp-records-context { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 10px; }
.tp-records-empty { padding: 48px 16px; text-align: center; color: var(--dsw-alias-label-secondary); }
.tp-records-legacy { margin: 22px 0 0; font-size: 13px; font-weight: 500; color: var(--dsw-alias-label-secondary); }
.tp-clear-confirm { padding: 32px 0; max-width: 480px; }
.tp-clear-confirm h3 { margin-top: 0; }
.tp-clear-confirm p { color: var(--dsw-alias-label-secondary); }
.tp-clear-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 24px; }
.tp-sound-dialog { width: min(440px, calc(100vw - 32px)); height: fit-content; }
.tp-sound-body { padding: 4px 20px 20px; overflow-y: auto; }
.tp-sound-field { display: grid; gap: 8px; margin-bottom: 18px; font-size: 13px; }
.tp-sound-field .tp-select, .tp-sound-field select { width: 100%; min-width: 0; }
.tp-sound-volume { display: flex; align-items: center; gap: 16px; }
.tp-sound-volume input { flex: 1; min-width: 0; min-height: 44px; margin: 0; accent-color: var(--dsw-alias-label-primary); }
.tp-sound-volume output { width: 4ch; text-align: right; font-variant-numeric: tabular-nums; }
.tp-sound-status { display: grid; margin: 10px 0; color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 18px; }
.tp-sound-status > span { grid-area: 1 / 1; }
.tp-sound-credit { font-size: 11px; color: var(--dsw-alias-label-secondary); text-underline-offset: 3px; }
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
  .tp-corpus-controls { order: -1; }
  .tp-corpus-status { min-height: 18px; }
  .tp-records-header, .tp-records-toolbar, .tp-records-footer { padding-left: 14px; padding-right: 14px; }
  .tp-records-body { padding: 0 14px; }
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
      const [records, setRecords] = React.useState(loadRecords);
      const best = records.best;
      const legacyBest = records.legacy;
      const [isRecord, setIsRecord] = React.useState(false);
      const [comparison, setComparison] = React.useState(null);
      const [recordsOpen, setRecordsOpen] = React.useState(false);
      const [recordsView, setRecordsView] = React.useState('recent');
      const [recordsLanguage, setRecordsLanguage] = React.useState('all');
      const [recordsPassage, setRecordsPassage] = React.useState(null);
      const [clearConfirm, setClearConfirm] = React.useState(false);
      const [clearError, setClearError] = React.useState(false);
      const recordsDialogRef = React.useRef(null);
      const recordsButtonRef = React.useRef(null);
      const recordsCloseRef = React.useRef(null);
      const recordsShowAllRef = React.useRef(null);
      const clearCancelRef = React.useRef(null);
      const clearButtonRef = React.useRef(null);
      const [soundPreference, setSoundPreference] = React.useState(loadSoundPreference);
      const soundPreferenceRef = React.useRef(soundPreference);
      const [soundOpen, setSoundOpen] = React.useState(false);
      const [soundStatus, setSoundStatus] = React.useState('idle');
      const [soundSaveError, setSoundSaveError] = React.useState(false);
      const soundDialogRef = React.useRef(null);
      const soundButtonRef = React.useRef(null);
      const soundCloseRef = React.useRef(null);
      const audioRef = React.useRef({ context: null, player: null, pack: null, preparing: null, epoch: 0, disposed: false, status: 'idle' });
      const [focused, setFocused] = React.useState(false);
      const [saveError, setSaveError] = React.useState(false);
      const [hintPreference, setHintPreference] = React.useState('current');
      const [annotationAttempt, setAnnotationAttempt] = React.useState(0);
      const [corpusBusy, setCorpusBusy] = React.useState(false);
      const [corpusMessage, setCorpusMessage] = React.useState('');
      const [corpusPreference, setCorpusPreference] = React.useState(loadCorpusPreference);
      const [corpusPreferenceError, setCorpusPreferenceError] = React.useState(false);
      const corpusRequest = React.useRef(null);
      const [caretIndex, setCaretIndex] = React.useState(0);
      const [composition, setComposition] = React.useState({ active: false, text: '' });
      const compositionRef = React.useRef({ active: false, anchor: 0 });
      const inputRef = React.useRef(null);
      const previewRef = React.useRef(null);
      const viewportRef = React.useRef(null);
      const sessionRef = React.useRef(session);
      const focusAfterRestart = React.useRef(false);
      const recordsRef = React.useRef(records);
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

      React.useLayoutEffect(() => {
        const dialog = recordsDialogRef.current;
        if (!dialog) return;
        if (recordsOpen && !dialog.open) { dialog.showModal(); recordsCloseRef.current?.focus(); }
        else if (!recordsOpen && dialog.open) { dialog.close(); recordsButtonRef.current?.focus({ preventScroll: true }); }
      }, [recordsOpen]);

      React.useEffect(() => {
        if (clearConfirm) clearCancelRef.current?.focus();
      }, [clearConfirm]);

      React.useLayoutEffect(() => {
        const dialog = soundDialogRef.current;
        if (!dialog) return;
        if (soundOpen && !dialog.open) { dialog.showModal(); soundCloseRef.current?.focus(); }
        else if (!soundOpen && dialog.open) { dialog.close(); soundButtonRef.current?.focus({ preventScroll: true }); }
      }, [soundOpen]);

      function stopSound() {
        audioRef.current.epoch++;
        audioRef.current.player?.stop();
      }

      function audioStatus(status) {
        if (audioRef.current.disposed) return;
        audioRef.current.status = status;
        setSoundStatus(status);
      }

      async function prepareSound(preview = false) {
        const state = audioRef.current;
        const settings = soundPreferenceRef.current;
        if (state.disposed || settings.pack === 'off' || !settings.volume) return false;
        const epoch = state.epoch;
        let context;
        try {
          // Construct/resume synchronously in the click, focus or key gesture.
          if (!state.context) {
            const Audio = window.AudioContext || window.webkitAudioContext;
            if (!Audio) throw new Error('Web Audio unavailable');
            state.context = new Audio({ latencyHint: 'interactive' });
          }
          context = state.context;
          const resumed = context.state === 'running' ? Promise.resolve() : context.resume();
          // Handle rejection immediately, even while the local chunk is loading.
          const resumeResult = Promise.resolve(resumed).then(() => true, () => false);
          if (!state.player) {
            audioStatus('loading');
            const module = await loadAudioModule();
            if (state.disposed || state.context !== context) return false;
            if (!state.player) state.player = module.createAudioPlayer(context, module.samples, status => {
              if (state.context === context) audioStatus(status);
            });
          }
          if (state.disposed || state.context !== context || settings.pack !== soundPreferenceRef.current.pack) return false;
          state.player.setVolume(soundPreferenceRef.current.volume);
          if (state.pack !== settings.pack || state.status === 'error') {
            state.pack = settings.pack;
            state.preparing = state.player.select(settings.pack);
          }
          const ready = await state.preparing;
          const resumedOk = await resumeResult;
          if (state.disposed || state.context !== context || settings.pack !== soundPreferenceRef.current.pack) return false;
          if (!resumedOk || context.state !== 'running') { audioStatus('error'); return false; }
          if (preview && ready && epoch === state.epoch && !document.hidden) return state.player.preview();
          return Boolean(ready);
        } catch { if (!context || state.context === context) audioStatus('error'); return false; }
      }

      function changeSound(patch) {
        const next = { ...soundPreferenceRef.current, ...patch };
        if (!SOUND_PACKS.includes(next.pack) || !Number.isFinite(next.volume)) return;
        next.volume = Math.max(0, Math.min(100, Math.round(next.volume)));
        soundPreferenceRef.current = next; setSoundPreference(next);
        stopSound();
        try { window.localStorage.setItem(SOUND_KEY, JSON.stringify(next)); setSoundSaveError(false); }
        catch { setSoundSaveError(true); }
        const state = audioRef.current;
        state.player?.setVolume(next.volume);
        if (next.pack === 'off') {
          state.pack = 'off'; state.player?.select('off'); audioStatus('idle');
        } else if (next.volume) void prepareSound();
      }

      function playKeySound(event, input) {
        const current = sessionRef.current;
        const state = audioRef.current;
        if (document.hidden || document.activeElement !== event.currentTarget || current.result || !inputReady()
          || !current.source && current.startAt != null && performance.now() - current.startAt >= current.duration * 1000
          || event.repeat || input.repeat || event.ctrlKey || event.metaKey || event.altKey
          || soundPreferenceRef.current.pack === 'off' || !soundPreferenceRef.current.volume) return;
        const key = event.key;
        const composing = compositionRef.current.active || input.isComposing || event.isComposing || input.keyCode === 229;
        if (!(key?.length === 1 || ['Backspace', 'Delete', 'Process', 'Unidentified'].includes(key) || key === 'Enter' && composing)) return;
        const kind = key === ' ' || input.code === 'Space' ? 'space' : key === 'Backspace' || key === 'Delete' ? 'backspace' : key === 'Enter' ? 'enter' : 'generic';
        if (state.player && state.context.state === 'running' && state.status === 'ready' && state.pack === soundPreferenceRef.current.pack) state.player.play(kind);
        else if (state.status !== 'error') void prepareSound(); // Drop unready keystrokes, never replay a burst.
      }

      React.useEffect(() => {
        const state = audioRef.current;
        state.disposed = false;
        const hidden = () => { if (document.hidden) stopSound(); };
        document.addEventListener('visibilitychange', hidden);
        window.addEventListener('blur', stopSound);
        return () => {
          state.disposed = true; stopSound();
          document.removeEventListener('visibilitychange', hidden);
          window.removeEventListener('blur', stopSound);
          if (state.player) state.player.dispose();
          else if (state.context) { try { Promise.resolve(state.context.close()).catch(() => {}); } catch { /* Already closed. */ } }
          state.player = null; state.context = null; state.pack = null;
        };
      }, []);

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
            if (!previous.source && elapsed >= previous.duration * 1000) {
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
        stopSound();
        const entry = historyEntry(session);
        const previous = recordsRef.current;
        const key = recordKey(result.language, result.duration, result.hints);
        const current = result.eligible ? previous.best[key] : entry.mode === 'passage' ? samePassageBest(previous.history, entry) : null;
        const better = isBetter(result, current);
        setComparison(result.eligible || entry.mode === 'passage' ? { previous: current || null, mode: entry.mode } : null);
        setIsRecord(result.eligible ? better : entry.mode === 'passage' && Boolean(current) && better);
        const next = {
          ...previous,
          history: [entry, ...previous.history.filter(item => item.id !== entry.id)].slice(0, HISTORY_LIMIT),
          best: result.eligible && better ? { ...previous.best, [key]: { speed: result.speed, accuracy: result.accuracy, at: result.at } } : previous.best,
        };
        recordsRef.current = next;
        setRecords(next);
        setSaveError(!saveRecords(next));
      }, [session.result]);

      function openRecords() {
        const current = sessionRef.current;
        if (current.startAt != null && !current.result || compositionRef.current.active) return;
        stopSound();
        cancelCorpus();
        setRecordsPassage(null);
        setClearConfirm(false); setClearError(false); setRecordsOpen(true);
      }

      function closeRecords() {
        setClearConfirm(false); setClearError(false); setRecordsOpen(false);
      }

      React.useLayoutEffect(() => {
        if (recordsPassage) recordsShowAllRef.current?.focus();
      }, [recordsPassage]);

      function clearRecords() {
        const empty = { version: 3, best: {}, legacy: {}, history: [] };
        if (!saveRecords(empty)) { setClearError(true); return; }
        recordsRef.current = empty; setRecords(empty);
        setSaveError(false); setIsRecord(false); setComparison(null);
        setRecordsPassage(null); setClearConfirm(false); setClearError(false);
        recordsCloseRef.current?.focus();
      }

      React.useEffect(() => () => { corpusRequest.current?.abort(); corpusRequest.current = null; }, []);

      // A remembered local source also applies when the page is reopened or
      // the practice language changes. Fallback never changes this preference.
      React.useEffect(() => {
        if (corpusPreference === 'local') nextPassage(false);
      }, [corpusPreference, session.language]);

      function changeCorpusPreference(source) {
        if (!['builtin', 'local'].includes(source) || source === corpusPreference) return;
        restart(session.duration, false, session.language, session.hints, undefined, null);
        setCorpusPreference(source);
        setCorpusPreferenceError(!saveCorpusPreference(source));
      }

      function cancelCorpus() {
        corpusRequest.current?.abort(); corpusRequest.current = null;
        setCorpusBusy(false); setCorpusMessage('');
      }

      async function nextPassage(focus = true) {
        if (corpusRequest.current) { cancelCorpus(); return; }
        if (corpusPreference === 'builtin') {
          restart(session.duration, focus, session.language, session.hints, undefined, null);
          return;
        }
        const controller = new AbortController();
        corpusRequest.current = controller;
        const current = sessionRef.current;
        setCorpusBusy(true); setCorpusMessage('');
        let timeout;
        const deadline = new Promise((_, reject) => {
          timeout = setTimeout(() => { controller.abort(); reject(new Error('timeout')); }, 12000);
        });
        let candidate = null;
        let fallback = 'corpusEmpty';
        try {
          const params = new URLSearchParams({ language: current.language, exclude: current.source?.fingerprint || '' });
          // Desktop owns an authenticated carrier; relative global fetch there
          // addresses the static dsh-app page rather than its Host API.
          const transport = window.__DSH_TRANSPORT__;
          const send = transport?.fetch ? transport.fetch.bind(transport) : fetch;
          const body = await Promise.race([deadline, (async () => {
            const response = await send('/api/typing-practice/recent?' + params, { signal: controller.signal, cache: 'no-store' });
            if (!response.ok) throw new Error('unavailable');
            return response.json();
          })()]);
          const item = body.candidate;
          if (item && item.language === current.language && typeof item.text === 'string' && item.text.length > 0
            && item.text.length <= 3000 && item.source?.sessionId) candidate = item;
          if (!candidate && !['empty', 'limited'].includes(body.reason)) fallback = 'corpusUnavailable';
        } catch { fallback = 'corpusUnavailable'; }
        finally { clearTimeout(timeout); }
        if (corpusRequest.current !== controller || sessionRef.current.id !== current.id) return;
        corpusRequest.current = null;
        setCorpusBusy(false);
        if (candidate) {
          restart(current.duration, focus, current.language, current.hints, candidate.text, candidate.source);
        } else {
          restart(current.duration, focus, current.language, current.hints, undefined, null);
          setCorpusMessage(fallback);
        }
      }

      function restart(nextDuration, focus = false, language = session.language, hints = language === 'en' ? 'off' : hintPreference, originalText, source = language === session.language ? session.source : null) {
        stopSound();
        cancelCorpus();
        const duration = nextDuration || session.duration;
        // Change the epoch before blurring. Some IMEs commit on blur; that
        // commit belongs to the old input node and must not enter the new run.
        updateSession(() => createSession(duration, language, hints, originalText || (source ? session.text : undefined), source));
        if (inputRef.current) inputRef.current.blur();
        compositionRef.current = { active: false, anchor: 0 };
        setComposition({ active: false, text: '' });
        setCaretIndex(0);
        setIsRecord(false);
        setComparison(null);
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
        playKeySound(event, input);
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

      function renderRecordScore(speed, accuracy, language) {
        return h('div', { className: 'tp-record-score' },
          h('span', { className: 'tp-record-speed' }, speed),
          h('span', { className: 'tp-record-unit' }, t(language === 'en' ? 'statsWpm' : 'statsCpm')),
          h('p', { className: 'tp-record-meta' }, t('statsAccuracy') + ' ' + Math.round(accuracy * 100) + '%'));
      }

      function closeSound() { stopSound(); setSoundOpen(false); }

      function renderSound() {
        const props = { className: 'tp-records-dialog tp-sound-dialog', ref: soundDialogRef, onClose: closeSound };
        if (!soundOpen) return h('dialog', props);
        return h('dialog', { ...props, 'aria-labelledby': 'tp-sound-title',
          onCancel: event => { event.preventDefault(); closeSound(); }, onKeyDown: event => event.stopPropagation() },
          h('div', { className: 'tp-records-header' }, h('h2', { id: 'tp-sound-title' }, t('soundTitle')),
            h('button', { className: 'tp-btn', type: 'button', ref: soundCloseRef, onClick: closeSound, 'aria-label': t('soundClose') }, '×')),
          h('div', { className: 'tp-sound-body' },
            h('label', { className: 'tp-sound-field' }, h('span', null, t('soundPack')),
              h('span', { className: 'tp-select' }, h('select', { value: soundPreference.pack, 'aria-label': t('soundPack'), onChange: event => changeSound({ pack: event.currentTarget.value }) },
                SOUND_PACKS.map(pack => h('option', { key: pack, value: pack }, t('sound_' + pack)))),
                h('svg', { className: 'tp-select-chevron', viewBox: '0 0 12 12', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false }, h('path', { d: 'M3 4.5 6 7.5 9 4.5' })))),
            h('label', { className: 'tp-sound-field' }, h('span', null, t('soundVolume')),
              h('span', { className: 'tp-sound-volume' }, h('input', { type: 'range', min: 0, max: 100, step: 5, value: soundPreference.volume,
                'aria-valuetext': soundPreference.volume + '%', onChange: event => changeSound({ volume: Number(event.currentTarget.value) }) }),
              h('output', { 'aria-hidden': true }, soundPreference.volume + '%'))),
            h('button', { className: 'tp-btn', type: 'button', disabled: soundPreference.pack === 'off' || !soundPreference.volume,
              onClick: () => { stopSound(); void prepareSound(true); } }, t('soundPreview')),
            h('div', { className: 'tp-sound-status' },
              ['soundLoading', 'soundError', 'soundSaveError'].map(key => h('span', { className: 'tp-status-size', 'aria-hidden': true, key }, t(key))),
              h('span', { role: 'status' }, soundSaveError ? t('soundSaveError') : soundStatus === 'loading' ? t('soundLoading') : soundStatus === 'error' ? t('soundError') : '')),
            h('a', { className: 'tp-sound-credit', href: 'https://github.com/tplai/kbsim', target: '_blank', rel: 'noreferrer' }, t('soundCredit')),
          ));
      }

      function renderRecords() {
        // Keep history rendering off the keystroke path while the dialog is closed.
        if (!recordsOpen) return h('dialog', { className: 'tp-records-dialog', ref: recordsDialogRef, onClose: closeRecords });
        const history = records.history.filter(item => (recordsLanguage === 'all' || item.language === recordsLanguage)
          && (!recordsPassage || item.fingerprint === recordsPassage));
        const bestRows = Object.entries(best).filter(([key]) => recordsLanguage === 'all' || key.startsWith(recordsLanguage + ':')).sort(([a], [b]) => a.localeCompare(b));
        const legacyRows = ['all', 'en'].includes(recordsLanguage) ? Object.entries(legacyBest) : [];
        const hasRecords = records.history.length || Object.keys(best).length || Object.keys(legacyBest).length;
        return h('dialog', { className: 'tp-records-dialog', ref: recordsDialogRef,
          'aria-labelledby': 'tp-records-title', 'aria-describedby': 'tp-records-limit',
          onCancel: event => {
            event.preventDefault();
            if (clearConfirm) { setClearConfirm(false); setClearError(false); recordsCloseRef.current?.focus(); }
            else closeRecords();
          },
          onClose: closeRecords,
          onKeyDown: event => event.stopPropagation(),
        },
          h('div', { className: 'tp-records-header' },
            h('h2', { id: 'tp-records-title' }, t('recordsTitle')),
            h('button', { className: 'tp-btn', type: 'button', ref: recordsCloseRef, onClick: closeRecords, 'aria-label': t('recordsClose') }, '×')),
          !clearConfirm ? h('div', { className: 'tp-records-toolbar' },
            h('div', { className: 'tp-seg', role: 'group', 'aria-label': t('recordsTitle') },
              ['recent', 'best'].map(view => h('button', { type: 'button', key: view,
                className: 'tp-seg-btn' + (recordsView === view ? ' active' : ''), 'aria-pressed': recordsView === view,
                onClick: () => { setRecordsView(view); setRecordsPassage(null); },
              }, t(view === 'recent' ? 'recordsRecent' : 'recordsBest')))),
            h('span', { className: 'tp-select tp-records-filter' },
              h('select', { value: recordsLanguage, 'aria-label': t('recordsLanguage'), onChange: event => {
                const language = event.currentTarget.value;
                if (language === 'all' || LANGUAGES.includes(language)) { setRecordsLanguage(language); setRecordsPassage(null); }
              } }, ['all', ...LANGUAGES].map(language => h('option', { key: language, value: language }, t(language === 'all' ? 'recordsAll' : 'language_' + language)))),
              h('svg', { className: 'tp-select-chevron', viewBox: '0 0 12 12', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false }, h('path', { d: 'M3 4.5 6 7.5 9 4.5' }))),
          ) : null,
          h('div', { className: 'tp-records-body' },
            clearConfirm ? h('div', { className: 'tp-clear-confirm' },
              h('h3', null, t('recordsClearTitle')),
              h('p', null, t('recordsClearBody')),
              clearError ? h('p', { className: 'tp-save-error', role: 'alert' }, t('recordsClearError')) : null,
              h('div', { className: 'tp-clear-actions' },
                h('button', { className: 'tp-btn', type: 'button', ref: clearCancelRef, onClick: () => {
                  setClearConfirm(false); setClearError(false); recordsCloseRef.current?.focus();
                } }, t('recordsCancel')),
                h('button', { className: 'tp-btn', type: 'button', onClick: clearRecords }, t('recordsClearConfirm'))),
            ) : recordsView === 'recent' ? h('div', null,
              recordsPassage ? h('div', { className: 'tp-records-context' }, h('span', null, t('recordsSameTitle')),
                h('button', { className: 'tp-record-link', type: 'button', ref: recordsShowAllRef, onClick: () => {
                  setRecordsPassage(null); recordsCloseRef.current?.focus();
                } }, t('recordsShowAll'))) : null,
              history.length ? h('ol', { className: 'tp-record-list' }, history.map(item => h('li', { className: 'tp-record-row', key: item.id },
                h('div', null,
                  h('p', { className: 'tp-record-title' }, t('language_' + item.language) + ' · ' + t(item.source === 'local' ? 'corpusLocal' : 'corpusBuiltin')),
                  h('p', { className: 'tp-record-meta' },
                    (item.mode === 'timed' ? t('recordsTimed', { n: item.duration }) : t('corpusCount', { n: item.targetLength }))
                    + ' · ' + t('recordsHints', { mode: t('hint_' + item.hints) }) + ' · ' + t(item.status === 'early' ? 'recordsEarly' : 'recordsCompleted')),
                  h('p', { className: 'tp-record-detail' }, t('recordsDetails', { seconds: (item.elapsedMs / 1000).toFixed(1), correct: item.correct, errors: item.wrongKeys })),
                  h('p', { className: 'tp-record-meta' }, formatRecordDate(item.at)),
                  item.fingerprint && !recordsPassage ? h('button', { type: 'button', className: 'tp-record-link', onClick: () => setRecordsPassage(item.fingerprint) }, t('recordsSame')) : null,
                ), renderRecordScore(item.speed, item.accuracy, item.language),
              ))) : h('p', { className: 'tp-records-empty' }, t('recordsEmpty')),
            ) : h('div', null,
              bestRows.length ? h('ul', { className: 'tp-record-list' }, bestRows.map(([key, item]) => {
                const [language, duration, , hints] = key.split(':');
                return h('li', { className: 'tp-record-row', key }, h('div', null,
                  h('p', { className: 'tp-record-title' }, t('language_' + language) + ' · ' + t('recordsTimed', { n: duration })),
                  h('p', { className: 'tp-record-meta' }, t('recordsHints', { mode: t('hint_' + (hints === 'plain' ? 'off' : hints)) })),
                  h('p', { className: 'tp-record-meta' }, formatRecordDate(item.at))), renderRecordScore(item.speed, item.accuracy, language));
              })) : h('p', { className: 'tp-records-empty' }, t('recordsBestEmpty')),
              legacyRows.length ? h('div', null, h('h3', { className: 'tp-records-legacy' }, t('recordsLegacy')),
                h('ul', { className: 'tp-record-list' }, legacyRows.map(([duration, item]) => h('li', { className: 'tp-record-row', key: duration },
                  h('div', null, h('p', { className: 'tp-record-title' }, t('language_en') + ' · ' + t('recordsTimed', { n: duration })),
                    h('p', { className: 'tp-record-meta' }, formatRecordDate(item.at))), renderRecordScore(item.wpm, item.accuracy, 'en'))))) : null,
            ),
          ),
          h('div', { className: 'tp-records-footer' },
            h('p', { id: 'tp-records-limit' }, t('recordsLimit')),
            !clearConfirm ? h('button', { className: 'tp-record-link', type: 'button', ref: clearButtonRef, disabled: !hasRecords,
              onClick: () => { setClearError(false); setClearConfirm(true); },
            }, t('recordsClear')) : null),
        );
      }

      const stats = sessionStats(session);
      const result = session.result;
      const shownSpeed = result ? result.speed : stats.speed;
      const isIme = session.language !== 'en';
      const speedUnit = t(isIme ? 'statsCpm' : 'statsWpm');
      const shownAccuracy = Math.round((result ? result.accuracy : stats.accuracy) * 100);
      const remaining = Math.max(0, Math.ceil((session.duration * 1000 - stats.ms) / 1000));
      const progress = Math.max(0, Math.min(1, session.source ? characters(session.typed).length / session.target.length : stats.ms / (session.duration * 1000)));
      const bestForDuration = best[recordKey(session.language, session.duration, session.hints)] || null;
      const legacy = !isIme && legacyBest[session.duration];
      const running = session.startAt != null && !result || composition.active;

      return h('div', { className: 'tp-root' + (isIme ? ' tp-ime' : '') + (session.hints !== 'off' ? ' tp-annotated' : '') },
        h('div', { className: 'tp-page' },
          h('header', { className: 'tp-header' },
            h('div', null,
              h('h1', { className: 'tp-title' }, t('panelTitle')),
              h('p', { className: 'tp-subtitle' }, t('panelSubtitle')),
            ),
            h('div', { className: 'tp-header-actions' },
              h('div', { className: 'tp-best', style: { visibility: session.source ? 'hidden' : 'visible' } },
              session.source ? t('corpusPassage') : bestForDuration
                ? t('bestValue', { speed: bestForDuration.speed, unit: speedUnit, acc: Math.round(bestForDuration.accuracy * 100) })
                : legacy && Number.isFinite(legacy.wpm) && Number.isFinite(legacy.accuracy)
                  ? t('legacyBestValue', { speed: legacy.wpm, acc: Math.round(legacy.accuracy * 100) }) : t('bestNone'),
              ),
              h('button', { className: 'tp-btn', type: 'button', ref: recordsButtonRef, onClick: openRecords,
                disabled: running, title: running ? t('recordsRunning') : undefined, 'aria-haspopup': 'dialog',
              }, t('records')),
              h('button', { className: 'tp-btn', type: 'button', ref: soundButtonRef, disabled: running,
                title: running ? t('soundRunning') : undefined, 'aria-haspopup': 'dialog', onClick: () => {
                  const current = sessionRef.current;
                  if (current.startAt != null && !current.result || compositionRef.current.active) return;
                  cancelCorpus(); stopSound(); setSoundOpen(true);
                } }, t('sound')),
            ),
          ),
          h('div', { className: 'tp-corpus-bar' },
            h('div', { className: 'tp-corpus-status' },
              // Invisible size guides keep translated/wrapped status text from
              // moving the controls or practice area when a request settles.
              ['corpusLoading', 'corpusEmpty', 'corpusUnavailable'].map(key => h('span', {
                key, className: 'tp-status-size', 'aria-hidden': true,
              }, t(key))),
              h('span', { className: 'tp-corpus-name', title: session.source?.title || undefined,
                style: { visibility: corpusBusy || corpusMessage ? 'hidden' : 'visible' },
              }, session.source ? t('corpusRecent') + ' · ' + t('corpusCount', { n: session.target.length }) : ''),
              h('p', { className: 'tp-corpus-note', role: 'status', 'aria-atomic': true }, corpusBusy || corpusMessage ? t(corpusBusy ? 'corpusLoading' : corpusMessage) : ''),
            ),
            h('div', { className: 'tp-corpus-controls' },
              h('div', { className: 'tp-seg', role: 'group', 'aria-label': t('corpusSource') },
                ['builtin', 'local'].map(source => h('button', {
                  key: source, type: 'button',
                  className: 'tp-seg-btn' + (source === corpusPreference ? ' active' : ''),
                  'aria-pressed': source === corpusPreference,
                  onClick: () => changeCorpusPreference(source),
                }, t(source === 'builtin' ? 'corpusBuiltin' : 'corpusLocal')))),
              h('button', { type: 'button', className: 'tp-btn tp-corpus-next', onClick: () => nextPassage() },
                h('span', null, t(corpusBusy ? 'corpusCancel' : 'corpusNext')),
                h('span', { className: 'tp-status-size', 'aria-hidden': true }, t('corpusNext')),
                h('span', { className: 'tp-status-size', 'aria-hidden': true }, t('corpusCancel')),
              ))),
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
            h('div', { className: 'tp-duration-slot' },
              h('div', { className: 'tp-seg', role: 'group', 'aria-label': t('durationLabel'),
                'aria-hidden': Boolean(session.source), style: { visibility: session.source ? 'hidden' : 'visible' },
              },
              DURATIONS.map((duration) => h('button', {
                key: duration,
                type: 'button',
                className: 'tp-seg-btn' + (duration === session.duration ? ' active' : ''),
                'aria-pressed': duration === session.duration,
                disabled: Boolean(session.source),
                onClick: () => restart(duration),
              }, t('durationOption', { n: duration }))),
              ),
              session.source ? h('span', { className: 'tp-passage-mode' }, t('corpusPassage')) : null,
            ),
            isIme ? h('label', { className: 'tp-hint-control' },
              h('span', null, t('hint_' + session.language)),
              h('span', { className: 'tp-select' }, h('select', {
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
                h('svg', { className: 'tp-select-chevron', viewBox: '0 0 12 12', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false },
                  h('path', { d: 'M3 4.5 6 7.5 9 4.5' })),
              ),
            ) : null,
          ),
          h('div', { className: 'tp-stats' },
            h(Stat, { label: speedUnit, value: shownSpeed, accent: true, description: isIme ? t('cpmTip') : undefined }),
            h(Stat, { label: t('statsAccuracy'), value: shownAccuracy, unit: t('unitPercent') }),
            h(Stat, { label: t('statsErrors'), value: result ? result.wrongKeys : session.wrongKeys }),
            h(Stat, { label: t(session.source ? 'corpusElapsed' : 'statsRemaining'), value: session.source ? Math.floor(stats.ms / 1000) : remaining, unit: t('unitSeconds') }),
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
                  void prepareSound();
                  revealCaret(viewportRef.current);
                  event.currentTarget.parentElement.scrollIntoView({ block: 'nearest' });
                  position();
                },
                onBlur: () => { setFocused(false); stopSound(); },
              }),
              composition.active && composition.text ? h('div', {
                className: 'tp-composition', ref: previewRef, 'aria-hidden': true,
              }, composition.text) : null,
            ),
            result ? h('div', { className: 'tp-result', role: 'status', 'aria-live': 'polite' },
              h('div', { className: 'tp-result-title' },
                h('span', null, session.source ? t('corpusCompleted', { seconds: (result.elapsedMs / 1000).toFixed(1) }) : result.eligible ? t('resultTitle') : t('resultEarly', { seconds: (result.elapsedMs / 1000).toFixed(1) })),
                isRecord ? h('span', { className: 'tp-record' }, t(session.source ? 'newPassageRecord' : 'newRecordBadge')) : null,
              ),
              h('div', { className: 'tp-result-grid' },
                h(ResultItem, { label: speedUnit, value: result.speed }),
                h(ResultItem, { label: t('resultAccuracy'), value: Math.round(result.accuracy * 100) + '%' }),
                h(ResultItem, { label: t('resultCorrect'), value: result.correct }),
                h(ResultItem, { label: t('resultErrors'), value: result.wrongKeys }),
              ),
              comparison ? h('p', { className: 'tp-comparison' }, comparison.previous
                ? t(comparison.mode === 'passage' ? 'comparePassage' : 'compareTimed', {
                  speed: comparison.previous.speed, unit: speedUnit, acc: Math.round(comparison.previous.accuracy * 100),
                  delta: (result.speed > comparison.previous.speed ? '+' : '') + (result.speed - comparison.previous.speed),
                }) : t(comparison.mode === 'passage' ? 'compareFirstPassage' : 'compareFirst')) : null,
            ) : null,
            h('div', { className: 'tp-actions' },
              h('div', { className: 'tp-instructions' },
                ['focusHint', 'restartHint', 'restartHintIme', 'hintLoading'].map(key => h('span', {
                  key, className: 'tp-status-size', 'aria-hidden': true,
                }, t(key))),
                h('span', { className: 'tp-focus-hint', id: 'tp-start-hint',
                  style: { visibility: result || !inputReady() ? 'hidden' : 'visible' },
                }, t(focused ? (isIme ? 'restartHintIme' : 'restartHint') : 'focusHint')),
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
              ),
              h('button', {
                type: 'button',
                className: 'tp-btn primary',
                onClick: () => restart(session.duration, true),
              }, t(result ? 'restart' : 'restartRun')),
            ),
          ),
          h('div', { className: 'tp-foot' },
            h('span', null, t(session.source ? 'corpusFooter' : 'footerTip')),
            corpusPreferenceError ? h('span', { className: 'tp-corpus-note tp-preference-error', role: 'status' }, t('corpusPreferenceError')) : null,
            saveError ? h('span', { className: 'tp-save-error', role: 'status' }, t('storageError')) : null,
          ),
          renderRecords(),
          renderSound(),
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
