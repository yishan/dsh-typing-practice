import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import { createAudioPlayer } from '../src/audio-player.js';
import { audioHarness, samplePacks } from './helpers/audio-context.js';
import { entries } from '../src/practice-text.js';

const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8');

// Run the shipped plugin and its component handlers with controlled hooks and
// clock. This does not emulate DOM focus, layout, or the DSH module loader.
function mountClient(locale, initialStorage = {}, failSave = false, loadChunk = async () => ({
  annotate: text => Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text), (part, i) => ({
    char: part.segment, reading: 'hint', wordStart: i, wordEnd: i + 1,
  })),
}), apiFetch, transportFetch, audio = {}) {
  const hooks = [];
  const timers = new Set();
  const timeouts = new Map();
  const storage = new Map(Object.entries(initialStorage));
  let inputElement;
  let inputKey;
  let cursor = 0;
  let now = 0;
  let factory;
  let Page;
  let tree;
  let pendingEffects;
  let dirty;
  let nextPassage = null;
  const requests = [];
  const dialogElement = { open: false, showModal() { this.open = true; }, close() { this.open = false; } };
  const soundDialog = { open: false, showModal() { this.open = true; }, close() { this.open = false; } };
  const listeners = new Map();
  const addListener = (name, callback) => listeners.set(name, callback);
  const removeListener = name => listeners.delete(name);
  const dom = {
    activeElement: null, hidden: false, addEventListener: addListener, removeEventListener: removeListener,
    createElement: () => ({ setAttribute() {}, remove() {} }), head: { appendChild() {} },
  };
  const audioLoads = [];
  const React = {
    createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
    memo: (component) => component,
    useState(initial) {
      const index = cursor++;
      if (!(index in hooks)) hooks[index] = typeof initial === 'function' ? initial() : initial;
      return [hooks[index], (update) => {
        const next = typeof update === 'function' ? update(hooks[index]) : update;
        if (!Object.is(next, hooks[index])) dirty = true;
        hooks[index] = next;
      }];
    },
    useRef(initial) {
      const index = cursor++;
      return hooks[index] ??= { current: initial };
    },
    useEffect(effect, dependencies) {
      const index = cursor++;
      const previous = hooks[index];
      if (previous && dependencies.every((value, i) => Object.is(value, previous.dependencies[i]))) return;
      pendingEffects.push(() => {
        previous?.dispose?.();
        hooks[index] = { dependencies, dispose: effect() };
      });
    },
  };
  React.useLayoutEffect = React.useEffect;
  const context = vm.createContext({
    AbortController, URLSearchParams, setTimeout, clearTimeout,
    fetch: (url, options) => {
      requests.push({ url, options });
      return apiFetch ? apiFetch(url, options) : Promise.resolve({ ok: true, json: async () => ({ candidate: nextPassage, reason: 'empty' }) });
    },
    window: {
      AudioContext: audio.AudioContext,
      navigator: { platform: audio.platform || 'Linux' },
      setTimeout: (callback, delay) => { timeouts.set(callback, now + delay); return callback; },
      clearTimeout: callback => timeouts.delete(callback),
      addEventListener: addListener, removeEventListener: removeListener,
      __DSH_TRANSPORT__: transportFetch ? { fetch: transportFetch } : undefined,
      __ModuleLoader__: { load: (module) => { factory = module.factory; } },
      localStorage: {
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => { if (typeof failSave === 'function' ? failSave(key) : failSave) throw new Error('Storage unavailable'); storage.set(key, value); },
      },
      setInterval: (callback) => { timers.add(callback); return callback; },
      clearInterval: (callback) => timers.delete(callback),
    },
    performance: { now: () => now },
    document: dom,
  });
  vm.runInContext(source, context);
  const slots = {
    inject: (_name, register) => register(),
    register: (entry, component) => {
      if (entry.name === 'main') Page = component;
      return () => {};
    },
  };
  const require = (name) => {
    assert.equal(name, 'react');
    return React;
  };
  require.async = name => {
    if (name === './client.audio.js') {
      audioLoads.push(name);
      return audio.load ? audio.load() : Promise.resolve({ createAudioPlayer, samples: samplePacks });
    }
    return loadChunk(name);
  };
  factory(require).apply({ get: (name) => ({ slots, locale })[name], effect: (callback) => callback() });

  function render() {
    let renders = 0;
    do {
      assert.ok(++renders < 10, 'component effects must settle');
      cursor = 0;
      pendingEffects = [];
      dirty = false;
      tree = Page();
      const input = find((node) => node.type === 'textarea');
      if (inputKey !== input.props.key) {
        inputKey = input.props.key;
        inputElement = { value: '', selectionEnd: 0, blur() {}, focus() {}, parentElement: { scrollIntoView() {} } };
        dom.activeElement = inputElement;
      }
      input.props.ref.current = inputElement;
      find(node => node.type === 'dialog').props.ref.current = dialogElement;
      find(node => node.type === 'dialog' && node.props.className.includes('tp-settings-dialog')).props.ref.current = soundDialog;
      for (const effect of pendingEffects) effect();
    } while (dirty);
  }

  function find(predicate, node = tree) {
    if (!node || typeof node !== 'object') return undefined;
    if (predicate(node)) return node;
    for (const child of (node.children || []).flat(Infinity)) {
      const match = find(predicate, child);
      if (match) return match;
    }
  }

  render();
  function dispatchInput(value, at, inputType = 'insertText', data = null, isComposing = false) {
    now = at;
    inputElement.value = value;
    inputElement.selectionEnd = value.length;
    find((node) => node.type === 'textarea').props.onInput({ currentTarget: inputElement, nativeEvent: { inputType, data, isComposing } });
    render();
  }
  function openSettings(tab = '注音') {
    find(node => node.type === 'button' && node.children[0] === '设置').props.onClick();
    render();
    find(node => node.props.role === 'tab' && node.children[0] === tab).props.onClick();
    render();
  }
  function closeSettings() {
    find(node => node.type === 'dialog' && node.props.className.includes('tp-settings-dialog')).props.onCancel({ preventDefault() {} });
    render();
  }
  function setHints(value) {
    openSettings();
    assert.equal(soundDialog.open, true, 'pronunciation settings must be available');
    find(node => node.type === 'select' && node.props['aria-label'] === '拼音／粤拼').props.onChange({ currentTarget: { value } });
    render();
    closeSettings();
  }
  return {
    key(key, at, options = {}) {
      now = at;
      let prevented = false;
      let stopped = false;
      const event = {
        key, currentTarget: inputElement, target: inputElement, ...options,
        get defaultPrevented() { return prevented; },
        preventDefault() { prevented = true; }, stopPropagation() { stopped = true; },
      };
      tree.props.onKeyDownCapture(event);
      if (!stopped) find(node => node.type === 'textarea').props.onKeyDown(event);
      render();
      // Model the browser's default text edit. Browser/IME verification is
      // separate; these tests exercise the shipped component's input handlers.
      if (!prevented && !options.isComposing && !options.metaKey && !options.ctrlKey && !options.altKey) {
        if (key.length === 1) dispatchInput(inputElement.value + key, at, 'insertText', key);
        if (key === 'Backspace') {
          const chars = Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(inputElement.value), p => p.segment);
          dispatchInput(chars.slice(0, -1).join(''), at, 'deleteContentBackward');
        }
      }
      return prevented;
    },
    input: dispatchInput,
    audioLoads,
    openSettings,
    openSound() { openSettings('音效'); },
    soundOpen: () => soundDialog.open,
    soundPack(pack) { find(node => node.type === 'select' && node.props['aria-label'] === '声音').props.onChange({ currentTarget: { value: pack } }); render(); },
    soundVolume(volume) { find(node => node.type === 'input' && node.props.type === 'range').props.onChange({ currentTarget: { value: volume } }); render(); },
    previewSound() { find(node => node.type === 'button' && node.children[0] === '试听').props.onClick(); render(); },
    closeSound: closeSettings,
    soundMessage() { return find(node => node.props.role === 'status', find(node => node.type === 'dialog' && node.props.className.includes('tp-settings-dialog')))?.children[0]; },
    soundPreference: () => JSON.parse(storage.get('dsh.typing-practice.sound.v1') || 'null'),
    soundValue: () => find(node => node.type === 'select' && node.props['aria-label'] === '声音').props.value,
    focusInput() { dom.activeElement = inputElement; find(node => node.type === 'textarea').props.onFocus({ currentTarget: inputElement }); render(); },
    blurInput() { dom.activeElement = {}; find(node => node.type === 'textarea').props.onBlur(); render(); },
    hide() { dom.hidden = true; listeners.get('visibilitychange')?.(); render(); },
    unmount() { hooks.forEach(hook => hook?.dispose?.()); },
    compose(type, value, data, at) {
      now = at;
      inputElement.value = value;
      inputElement.selectionEnd = value.length;
      find((node) => node.type === 'textarea').props['onComposition' + type]({ currentTarget: inputElement, data });
      render();
    },
    staleInput() {
      const handler = find((node) => node.type === 'textarea').props.onCompositionEnd;
      const element = inputElement;
      return value => { element.value = value; handler({ currentTarget: element, data: value }); render(); };
    },
    language(label, hints = 'off') {
      find((node) => node.type === 'button' && node.children[0] === label).props.onClick();
      render();
      if (label !== '英文' && hints !== null) setHints(hints);
    },
    hints: setHints,
    mode(value) {
      find(node => node.props.role === 'radio' && node.children[0] === (value === 'passage' ? '短篇' : '30 秒')).props.onClick(); render();
    },
    length(label) {
      find(node => node.props.role === 'radio' && node.children[0] === label + '篇').props.onClick(); render();
    },
    preset: () => find(node => node.props.role === 'radio' && node.props['aria-checked'])?.children[0],
    presetOptions: () => find(node => node.props.role === 'radiogroup').children.flat(Infinity).map(node => ({ label: node.children[0], checked: node.props['aria-checked'], tabIndex: node.props.tabIndex })),
    presetKey(key) {
      const group = find(node => node.props.role === 'radiogroup');
      const radios = group.children.flat(Infinity);
      let focusIndex = -1, prevented = false;
      radios.find(node => node.props['aria-checked']).props.onKeyDown({ key, preventDefault() { prevented = true; },
        currentTarget: { parentElement: { querySelectorAll: () => radios.map((_, index) => ({ focus() { focusIndex = index; } })) } } });
      render(); return { focusIndex, prevented };
    },
    retryAnnotations() {
      find(node => node.type === 'button' && node.children[0] === '重试注音').props.onClick();
      render();
    },
    async settle() { await new Promise(resolve => setImmediate(resolve)); render(); },
    async usePassage(text, language = 'en', fingerprint = 'a'.repeat(64)) {
      find(node => node.props.role === 'radio' && node.children[0] === '短篇').props.onClick(); render();
      nextPassage = { text, language, source: { sessionId: 'fixture', seq: 5, role: 'user', fingerprint, title: '示例对话' } };
      const local = find(node => node.type === 'button' && node.children[0] === '本地对话语料');
      if (local.props['aria-pressed']) await find(node => node.type === 'button' && node.props.className?.includes('tp-corpus-next')).props.onClick();
      else { local.props.onClick(); render(); await new Promise(resolve => setImmediate(resolve)); }
      render();
    },
    builtin() { find(node => node.type === 'button' && node.children[0] === '默认语料').props.onClick(); render(); },
    source(label) { find(node => node.type === 'button' && node.children[0] === label).props.onClick(); render(); },
    sourceSelected: label => find(node => node.type === 'button' && node.children[0] === label).props['aria-pressed'],
    preferenceError: () => Boolean(find(node => node.props.className === 'tp-corpus-note tp-preference-error')),
    nextPassage() { const promise = find(node => node.type === 'button' && node.props.className?.includes('tp-corpus-next')).props.onClick(); render(); return promise; },
    requests,
    corpusMessage: () => find(node => node.props.className === 'tp-toast')?.children[0] || undefined,
    toastTimers: () => timeouts.size,
    shortcutLabel: () => find(node => node.props.id === 'tp-next-shortcut').children[0],
    shortcutAria: () => find(node => node.props.className?.includes('tp-corpus-next') && node.type === 'button').props['aria-keyshortcuts'],
    settingsTab: () => find(node => node.props.role === 'tab' && node.props['aria-selected'])?.children[0],
    settingsDisabled: () => find(node => node.type === 'button' && node.children[0] === '设置').props.disabled,
    settingsTabs: () => find(node => node.props.role === 'tablist').children.flat(Infinity).map(node => node.children[0]),
    hintControl: () => find(node => node.type === 'select' && node.props['aria-label'] === '拼音／粤拼')?.props,
    hintError: () => find(node => node.props.role === 'status', find(node => node.props.className === 'tp-sound-status tp-hint-status'))?.children[0],
    privacyInSubtitle: () => Boolean(find(node => node.props.className === 'tp-privacy-note', find(node => node.props.className === 'tp-subtitle'))),
    settingsTabKey(key) {
      const tabs = find(node => node.props.role === 'tablist').children.flat(Infinity);
      let focus = -1;
      tabs.find(node => node.props['aria-selected']).props.onKeyDown({ key, preventDefault() {},
        currentTarget: { parentElement: { querySelectorAll: () => tabs.map((_, i) => ({ focus() { focus = i; } })) } } });
      render(); return focus;
    },
    cursorShape(shape) { find(node => node.type === 'select' && node.props['aria-label'] === '形状').props.onChange({ currentTarget: { value: shape } }); render(); },
    cursorPreference: () => JSON.parse(storage.get('dsh.typing-practice.cursor.v1') || 'null'),
    restart() {
      find((node) => node.type === 'button' && node.props.className?.includes('tp-restart')).props.onClick();
      render();
    },
    duration(seconds) {
      find((node) => node.type === 'button' && node.children[0] === `${seconds} 秒`).props.onClick();
      render();
    },
    tick(at) {
      now = at;
      for (const callback of [...timers]) callback();
      for (const [callback, due] of [...timeouts]) { if (due <= now) { timeouts.delete(callback); callback(); } }
      render();
    },
    refresh: render,
    board: () => find((node) => typeof node.props.text === 'string').props,
    title: () => find((node) => node.type === 'h1').children[0],
    finished: () => Boolean(find((node) => node.props.className === 'tp-result')),
    saved: (language = 'en', hints = 'off') => {
      const best = JSON.parse(storage.get('dsh.typing-practice.v3') || storage.get('dsh.typing-practice.v2') || '{"best":{}}').best;
      return Object.fromEntries(Object.entries(best).filter(([key]) => key.startsWith(language + ':') && key.split(':')[3] === (hints === 'off' ? 'plain' : hints)).map(([key, value]) => [key.split(':')[1], value]));
    },
    rawStorage: key => storage.get(key),
    records: () => JSON.parse(storage.get('dsh.typing-practice.v3') || 'null'),
    comparison: () => find(node => node.props.className === 'tp-comparison')?.children[0],
    newRecord: () => find(node => node.props.className === 'tp-record')?.children[0],
    recordsDisabled: () => find(node => node.type === 'button' && node.props['aria-haspopup'] === 'dialog').props.disabled,
    openRecords() { find(node => node.type === 'button' && node.props['aria-haspopup'] === 'dialog').props.onClick(); render(); },
    recordsOpen: () => dialogElement.open,
    recordAction(label) { find(node => node.type === 'button' && node.children[0] === label).props.onClick(); render(); },
    recordsFilter(language) { find(node => node.type === 'select' && node.props['aria-label'] === '记录语言').props.onChange({ currentTarget: { value: language } }); render(); },
    recordsText() {
      function content(node) { if (typeof node === 'string' || typeof node === 'number') return String(node); return (node?.children || []).flat(Infinity).map(content).join(' '); }
      return content(find(node => node.type === 'dialog'));
    },
    recordsEscape() { find(node => node.type === 'dialog').props.onCancel({ preventDefault() {} }); render(); },
    stat: label => find((node) => node.props.label === label && node.props.value != null)?.props.value,
    bestText: () => find((node) => node.props.className === 'tp-best').children[0],
    saveError: () => Boolean(find((node) => node.props.className === 'tp-save-error')),
    inputValue: () => inputElement.value,
    readOnly: () => find(node => node.type === 'textarea').props.readOnly,
    annotationStatus: () => find(node => node.props.className === 'tp-annotation-status')?.children[0]?.children[0],
    composing: () => Boolean(find((node) => node.props.className === 'tp-composition')),
    activeTimers: () => timers.size,
  };
}

for (const duration of [15, 30, 60]) {
  test(`${duration}s: input before the deadline counts; input at the deadline does not`, () => {
    const app = mountClient();
    app.duration(duration);
    const text = app.board().text;
    app.key(text[0], 1000);
    app.key(text[1], 1000 + duration * 1000 - 1);
    assert.equal(app.board().typed, text.slice(0, 2));
    assert.equal(app.finished(), false);
    app.key('#', 1000 + duration * 1000);
    assert.equal(app.board().typed, text.slice(0, 2));
    assert.equal(app.finished(), true);
    assert.equal(app.saved()[duration].accuracy, 1);
    assert.equal(app.saved()[duration].speed, Math.round((2 / 5) / (duration / 60)));
    assert.equal(app.activeTimers(), 0);
  });

  for (const key of ['#', 'Backspace']) {
    for (const delay of [0, 50, 60000]) {
      test(`${duration}s: ${key} at deadline + ${delay}ms preserves the score without a timer tick`, () => {
        const app = mountClient();
        app.duration(duration);
        app.key(app.board().text[0], 1000);
        app.key('#', 1100);
        const typed = app.board().typed;
        app.key(key, 1000 + duration * 1000 + delay);
        assert.equal(app.board().typed, typed);
        assert.equal(app.finished(), true);
        assert.equal(app.saved()[duration].accuracy, 0.5);
        assert.equal(app.saved()[duration].speed, Math.round((1 / 5) / (duration / 60)));
      });
    }
  }
}

test('Backspace before the first character does not start the timer', () => {
  const app = mountClient();
  app.key('Backspace', 1000);
  app.tick(100000);
  assert.equal(app.board().typed, '');
  assert.equal(app.finished(), false);
  assert.equal(app.activeTimers(), 0);
});

test('correction before the deadline works; the timer finishes and freezes the result', () => {
  const app = mountClient();
  const first = app.board().text[0];
  app.key('#', 1000);
  app.key('Backspace', 1100);
  assert.equal(app.board().typed, '');
  app.key(first, 1200);
  app.tick(31000);
  const best = app.saved();
  assert.equal(app.finished(), true);
  assert.equal(best[30].accuracy, 0.5);
  app.key('Backspace', 32000);
  app.key('#', 32001);
  assert.equal(app.board().typed, first);
  assert.deepEqual(app.saved(), best);
  app.restart();
  assert.equal(app.finished(), false);
  assert.equal(app.board().typed, '');
  assert.equal(app.activeTimers(), 0);
  assert.deepEqual(app.saved(), best);
});

test('Tab and Shift+Tab preserve the run and allow native focus navigation', () => {
  const app = mountClient();
  const text = app.board().text;
  app.key(text[0], 1000);
  assert.equal(app.key('Tab', 1100), false);
  assert.equal(app.key('Tab', 1200, { shiftKey: true }), false);
  assert.equal(app.board().typed, text[0]);
  assert.equal(app.board().text, text);
  assert.equal(app.activeTimers(), 1);
});

test('the restart button can reset an unfinished run', () => {
  const app = mountClient();
  app.key(app.board().text[0], 1000);
  app.restart();
  assert.equal(app.board().typed, '');
  assert.equal(app.finished(), false);
  assert.equal(app.activeTimers(), 0);
});

function fallbackLocale(snapshot, binding = 'missing') {
  const listeners = new Set();
  return {
    getLocale: () => snapshot,
    register: () => () => {},
    bind: () => {
      if (binding === 'unavailable') throw new Error('binding unavailable');
      return (key) => {
        if (binding === 'throws') throw new Error('translation unavailable');
        return key;
      };
    },
    subscribe: (listener) => { listeners.add(listener); return () => listeners.delete(listener); },
    change(next) { snapshot = next; for (const listener of listeners) listener(); },
  };
}

for (const binding of ['missing', 'unavailable', 'throws']) {
  test(`English active locale selects English fallback when binding is ${binding}`, () => {
    assert.equal(mountClient(fallbackLocale({ active: 'en-US' }, binding)).title(), 'Typing practice');
  });
}

test('active takes priority over legacy locale fields', () => {
  assert.equal(mountClient(fallbackLocale({ active: 'en', id: 'zh' })).title(), 'Typing practice');
  assert.equal(mountClient(fallbackLocale({ active: 'zh', id: 'en' })).title(), '打字练习');
});

test('fallback text follows locale changes', () => {
  const locale = fallbackLocale({ active: 'zh' });
  const app = mountClient(locale);
  assert.equal(app.title(), '打字练习');
  locale.change({ active: 'en' });
  app.refresh();
  assert.equal(app.title(), 'Typing practice');
  locale.change({ active: 'zh' });
  app.refresh();
  assert.equal(app.title(), '打字练习');
});

test('legacy snapshots and absent locale service retain their existing defaults', () => {
  for (const field of ['id', 'locale', 'current']) {
    assert.equal(mountClient(fallbackLocale({ [field]: 'en' })).title(), 'Typing practice');
  }
  assert.equal(mountClient().title(), '打字练习');
});

for (const [label, language] of [['中文', 'zh'], ['粤语', 'yue']]) {
  test(`${language}: composition time counts, candidate keys do not; a word commits once`, () => {
    const app = mountClient();
    app.language(label);
    const word = app.board().text.slice(0, 4);
    app.compose('Start', '', '', 500);
    assert.equal(app.activeTimers(), 0);
    app.compose('Update', 'ceshi', 'ceshi', 1000);
    app.input('ceshi', 1001, 'insertCompositionText', 'ceshi', true);
    for (const key of [' ', '1', 'ArrowDown', 'Backspace', 'Enter']) {
      assert.equal(app.key(key, 1500, { isComposing: true }), false);
    }
    assert.equal(app.board().typed, '');
    assert.equal(app.stat('错误'), 0);
    assert.equal(app.activeTimers(), 1);
    app.compose('End', word, word, 2000);
    app.input(word, 2001, 'insertFromComposition', word);
    assert.equal(app.board().typed, word);
    assert.equal(app.composing(), false);
    app.tick(31000);
    assert.equal(app.saved(language)[30].speed, 8);
    assert.equal(app.saved(language)[30].accuracy, 1);
    assert.deepEqual(app.saved('en'), {});
  });
}

test('cancelled composition restores native text without adding errors or resetting time', () => {
  const app = mountClient();
  app.language('中文');
  app.compose('Start', '', '', 0);
  app.compose('Update', 'ni', 'ni', 1000);
  app.compose('End', '', '', 1500);
  app.input('', 1501, 'deleteCompositionText');
  assert.equal(app.board().typed, '');
  assert.equal(app.stat('错误'), 0);
  assert.equal(app.activeTimers(), 1);
  const first = app.board().text[0];
  app.input(first, 2000);
  app.tick(31000);
  assert.equal(app.saved('zh')[30].speed, 2);
  assert.equal(app.saved('zh')[30].accuracy, 1);
});

test('consecutive identical composition commits both count, but trailing input does not duplicate errors', () => {
  const app = mountClient();
  app.language('中文');
  app.compose('Start', '', '', 900);
  app.compose('Update', 'ren', 'ren', 1000);
  app.compose('End', '人', '人', 1100);
  app.input('人', 1101, 'insertText', '人');
  app.compose('Start', '人', '', 1200);
  app.compose('Update', '人ren', 'ren', 1300);
  app.compose('End', '人人', '人', 1400);
  app.input('人人', 1401, 'insertText', '人');
  assert.equal(app.board().typed, '人人');
  assert.equal(app.stat('错误'), 2);
});

for (const at of [30999, 31000, 31050]) {
  test(`IME batch commit at ${at}ms obeys the deadline without a timer tick`, () => {
    const app = mountClient();
    app.language('中文');
    const text = app.board().text.slice(0, 4);
    app.compose('Start', '', '', 900);
    app.compose('Update', 'test', 'test', 1000);
    app.compose('End', text, text, at);
    app.input(text, at + 1, 'insertFromComposition', text);
    assert.equal(app.board().typed, at < 31000 ? text : '');
    assert.equal(app.finished(), true);
    assert.equal(app.inputValue(), app.board().typed);
    assert.equal(app.composing(), false);
  });
}

test('timer expiry during composition freezes the result while letting the IME finish', () => {
  const app = mountClient();
  app.language('粤语');
  app.compose('Start', '', '', 1000);
  app.compose('Update', 'ngo', 'ngo', 1100);
  app.tick(31100);
  const saved = app.saved('yue');
  assert.equal(app.finished(), true);
  app.compose('End', '我', '我', 32000);
  assert.equal(app.board().typed, '');
  assert.equal(app.composing(), false);
  assert.deepEqual(app.saved('yue'), saved);
});

test('restart invalidates a composition on the old input element', () => {
  const app = mountClient();
  app.language('中文');
  app.compose('Start', '', '', 900);
  app.compose('Update', 'ni', 'ni', 1000);
  const finishOldInput = app.staleInput();
  app.restart();
  finishOldInput('你');
  assert.equal(app.board().typed, '');
  assert.equal(app.activeTimers(), 0);
  assert.equal(app.composing(), false);
  app.input(app.board().text[0], 1500);
  assert.equal(app.board().typed.length, 1);
});

test('visible characters, rather than UTF-16 code units, determine mistakes and deletion', () => {
  const app = mountClient();
  app.language('中文');
  app.input('𠮷e\u0301', 1000);
  assert.equal(app.stat('错误'), 2);
  app.key('Backspace', 1100);
  assert.equal(app.board().typed, '𠮷');
  app.key('Backspace', 1200);
  assert.equal(app.board().typed, '');
  assert.equal(app.stat('错误'), 2);
});

test('replacement and correction retain previous mistakes; punctuation is never silently dropped', () => {
  const app = mountClient();
  app.language('中文');
  const word = app.board().text.slice(0, 3);
  app.input(word[0] + '錯' + word[2], 1000);
  app.input(word, 1100, 'insertReplacementText', word[1]);
  assert.equal(app.stat('准确率'), 75);
  app.input(word + '“”', 1200);
  assert.equal(app.board().typed, word + '“”');
  assert.equal(app.stat('错误'), 3);
});

test('paste input fallback cannot enter a timed score', () => {
  const app = mountClient();
  app.language('中文');
  app.input(app.board().text.slice(0, 40), 1000, 'insertFromPaste');
  assert.equal(app.board().typed, '');
  assert.equal(app.inputValue(), '');
  assert.equal(app.activeTimers(), 0);
});

test('language switch invalidates old composition and keeps language-specific best scores', () => {
  const app = mountClient();
  app.language('中文');
  app.input(app.board().text[0], 1000);
  app.tick(31000);
  const chineseBest = app.saved('zh');
  app.restart();
  app.compose('Start', '', '', 32000);
  app.compose('Update', 'ni', 'ni', 32100);
  const stale = app.staleInput();
  app.language('粤语');
  stale('你');
  assert.equal(app.board().typed, '');
  assert.match(app.board().text, /嘅|唔|啲|咗/);
  app.input(app.board().text.slice(0, 2), 33000);
  app.tick(63000);
  assert.equal(app.saved('yue')[30].speed, 4);
  assert.deepEqual(app.saved('zh'), chineseBest);
});

test('an early text completion does not become a full-duration best', () => {
  const app = mountClient();
  app.language('中文');
  app.input(app.board().text, 1000);
  assert.equal(app.finished(), true);
  assert.deepEqual(app.saved('zh'), {});
});

test('legacy English scores remain intact and are visibly distinguished', () => {
  const old = JSON.stringify({ version: 1, best: { 30: { wpm: 85, accuracy: 0.98, at: 123 } } });
  const app = mountClient(undefined, { 'dsh.typing-practice.v1': old });
  assert.match(app.bestText(), /旧版最佳 85 WPM/);
  app.language('中文');
  assert.equal(app.bestText(), '暂无最佳记录');
  app.input(app.board().text[0], 1000);
  app.tick(31000);
  assert.equal(app.rawStorage('dsh.typing-practice.v1'), old);
  assert.match(app.bestText(), /最佳 2 字\/分钟/);
});

test('storage failure is reported without losing the current result', () => {
  const app = mountClient(undefined, {}, true);
  app.input(app.board().text[0], 1000);
  app.tick(31000);
  assert.equal(app.finished(), true);
  assert.equal(app.saveError(), true);
});

const annotationEngine = marker => ({ annotate: text => Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text), (part, i) => ({ char: part.segment, reading: marker, wordStart: i, wordEnd: i + 1 })) });

test('pronunciation loads lazily by language and reuses its engine', async () => {
  const calls = [];
  const app = mountClient(undefined, {}, false, async name => { calls.push(name); return annotationEngine(name); });
  await app.settle();
  assert.deepEqual(calls, []);
  app.language('中文', 'current');
  assert.equal(app.readOnly(), true);
  app.input('你', 1000);
  assert.equal(app.board().typed, '');
  assert.equal(app.activeTimers(), 0);
  await app.settle();
  assert.equal(app.board().hints, 'current');
  assert.equal(app.readOnly(), false);
  assert.equal(app.board().annotations.length, app.board().text.length);
  app.restart();
  await app.settle();
  assert.deepEqual(calls, ['./client.pinyin.js']);
  app.language('粤语', 'current');
  await app.settle();
  assert.deepEqual(calls, ['./client.pinyin.js', './client.jyutping.js']);
});

test('hint modes have distinct persistent bests and retain earlier plain scores', async () => {
  const app = mountClient();
  app.language('中文');
  for (const [i, hints] of ['off', 'current', 'all'].entries()) {
    app.hints(hints);
    await app.settle();
    app.input(app.board().text.slice(0, i + 1), 1000 + i * 40000);
    app.tick(31000 + i * 40000);
    assert.equal(app.saved('zh', hints)[30].speed, (i + 1) * 2);
  }
  const stored = app.rawStorage('dsh.typing-practice.v3');
  const restored = mountClient(undefined, { 'dsh.typing-practice.v3': stored });
  restored.language('中文');
  for (const [i, hints] of ['off', 'current', 'all'].entries()) {
    restored.hints(hints);
    await restored.settle();
    assert.match(restored.bestText(), new RegExp(`最佳 ${(i + 1) * 2} 字/分钟`));
  }
});

test('settings stay locked during composition; restart then change hints without accepting stale IME', async () => {
  const app = mountClient();
  app.language('中文', 'current');
  await app.settle();
  const text = app.board().text;
  app.compose('Start', '', '', 1000);
  app.compose('Update', 'ni', 'ni', 1000);
  const stale = app.staleInput();
  assert.equal(app.settingsDisabled(), true);
  app.restart();
  assert.equal(app.settingsDisabled(), false);
  app.hints('all');
  await app.settle();
  stale('你');
  assert.equal(app.board().text, text);
  assert.equal(app.board().typed, '');
  assert.equal(app.activeTimers(), 0);
  assert.equal(app.composing(), false);
  assert.deepEqual(app.saved('zh', 'current'), {});
});

test('late pronunciation results cannot replace another language', async () => {
  let completeChinese;
  const app = mountClient(undefined, {}, false, name => name.includes('pinyin')
    ? new Promise(resolve => { completeChinese = resolve; }) : Promise.resolve(annotationEngine('yue')));
  app.language('中文', 'current');
  await app.settle();
  app.language('粤语', 'current');
  await app.settle();
  completeChinese(annotationEngine('zh'));
  await app.settle();
  assert.equal(app.board().annotations[0].reading, 'yue');
});

test('a failed pronunciation load can retry without starting the timer', async () => {
  let attempts = 0;
  const app = mountClient(undefined, {}, false, async () => {
    if (++attempts === 1) throw new Error('Offline file unavailable');
    return annotationEngine('ready');
  });
  app.language('中文', 'current');
  await app.settle();
  assert.match(app.annotationStatus(), /暂时不可用/);
  assert.equal(app.readOnly(), true);
  app.retryAnnotations();
  await app.settle();
  assert.equal(attempts, 2);
  assert.equal(app.readOnly(), false);
  assert.equal(app.activeTimers(), 0);
});

test('turning hints off permits practice while an earlier load is pending', async () => {
  let complete;
  const app = mountClient(undefined, {}, false, () => new Promise(resolve => { complete = resolve; }));
  app.language('中文', 'current');
  await app.settle();
  app.hints('off');
  app.input(app.board().text[0], 1000);
  complete(annotationEngine('late'));
  await app.settle();
  assert.equal(app.board().annotations, null);
  assert.equal(app.board().hints, 'off');
  assert.equal(app.board().typed.length, 1);
  assert.equal(app.readOnly(), false);
});

test('conversation passage runs beyond timed duration and completes once without writing timed bests', async () => {
  const app = mountClient();
  await app.usePassage('A short passage.');
  assert.equal(app.board().text, 'A short passage.');
  app.input('A', 1000); app.tick(61000);
  assert.equal(app.finished(), false);
  assert.equal(app.stat('用时'), 60);
  app.input('A short passage.', 62000);
  assert.equal(app.finished(), true);
  assert.deepEqual(app.saved(), {});
  app.restart();
  assert.equal(app.board().text, 'A short passage.');
  assert.equal(app.inputValue(), '');
  await app.builtin();
  assert.ok(entries.some(entry => entry.language === 'en' && entry.length === 'short' && entry.text === app.board().text));
  assert.equal(app.stat('用时'), 0);
});

test('conversation selection and hint changes isolate old IME while retaining the chosen original', async () => {
  const app = mountClient(); app.language('中文');
  app.compose('Start', '', '', 1000); app.compose('Update', 'ni', 'ni', 1001);
  const old = app.staleInput();
  await app.usePassage('你好，周末。', 'zh'); old('旧文字');
  assert.equal(app.inputValue(), ''); assert.equal(app.board().text, '你好，周末。');
  app.hints('current'); await app.settle();
  assert.equal(app.board().text, '你好，周末。');
  app.input('你好，周末。', 2000);
  assert.equal(app.finished(), true); assert.deepEqual(app.saved('zh', 'current'), {});
  app.language('粤语');
  assert.notEqual(app.board().text, '你好，周末。'); assert.equal(app.stat('用时'), 0);
});

test('default source does not request history; local selection uses language and retains preference after fallback', async () => {
  const app = mountClient();
  assert.equal(app.requests.length, 0);
  app.language('粤语');
  await app.nextPassage();
  assert.equal(app.requests.length, 0);
  app.source('本地对话语料'); await app.settle();
  assert.match(app.requests[0].url, /language=yue/);
  assert.ok(app.board().text.length >= 1200); assert.equal(app.stat('剩余'), 30);
  assert.match(app.corpusMessage(), /未找到/);
  assert.equal(app.sourceSelected('本地对话语料'), true);
  await app.nextPassage(); await app.settle();
  assert.equal(app.requests.length, 2);
});

test('failed recent-history request falls back to built-in text without affecting saved scores', async () => {
  const app = mountClient(undefined, {}, false, undefined, async () => { throw new Error('network failure'); });
  app.source('本地对话语料'); await app.settle();
  assert.ok(app.board().text.length >= 1200); assert.equal(app.stat('剩余'), 30);
  assert.match(app.corpusMessage(), /暂不可用/);
  assert.deepEqual(app.saved(), {});
});

test('language change aborts an old local read and selects a passage in the new language', async () => {
  const resolutions = [];
  const app = mountClient(undefined, {}, false, undefined, () => new Promise(done => { resolutions.push(done); }));
  app.length('短'); app.source('本地对话语料');
  app.language('中文', null); // Change language only; opening settings cancels pending selection.
  assert.equal(app.requests[0].options.signal.aborted, true);
  assert.match(app.requests[1].url, /language=zh/);
  const target = app.board().text;
  resolutions[0]({ ok: true, json: async () => ({ candidate: { language: 'en', text: 'Late old text.', source: { sessionId: 'old' } } }) });
  await app.settle();
  assert.equal(app.board().text, target);
  resolutions[1]({ ok: true, json: async () => ({ candidate: { language: 'zh', text: '新的中文片段。', source: { sessionId: 'new' } } }) });
  await app.settle();
  assert.equal(app.board().text, '新的中文片段。');
  assert.equal(app.corpusMessage(), undefined);
});

test('selection button cancels an ongoing read and preserves the current run', async () => {
  let resolve;
  const app = mountClient(undefined, {}, false, undefined, () => new Promise(done => { resolve = done; }));
  app.source('本地对话语料');
  const target = app.board().text;
  await app.nextPassage();
  assert.equal(app.requests[0].options.signal.aborted, true);
  resolve({ ok: true, json: async () => ({ candidate: null, reason: 'empty' }) });
  await app.settle();
  assert.equal(app.board().text, target);
  assert.equal(app.corpusMessage(), undefined);
});

test('desktop uses the authenticated carrier instead of fetching its static app origin', async () => {
  const calls = [];
  const app = mountClient(undefined, {}, false, undefined, () => { throw new Error('Static origin must not be used'); }, async (url, options) => {
    calls.push({ url, options });
    return { ok: true, json: async () => ({ candidate: { language: 'en', text: 'A local passage.', source: { sessionId: 'desktop' } } }) };
  });
  app.length('短'); app.source('本地对话语料'); await app.settle();
  assert.equal(app.requests.length, 0);
  assert.match(calls[0].url, /^\/api\/typing-practice\/recent\?language=en/);
  assert.equal(app.board().text, 'A local passage.');
});

test('source preference survives remount without persisting conversation text or changing best scores', async () => {
  const preferenceKey = 'dsh.typing-practice.preferences.v1';
  const app = mountClient();
  await app.usePassage('Private passage content.');
  const stored = app.rawStorage(preferenceKey);
  assert.deepEqual(JSON.parse(stored), { version: 1, source: 'local' });
  const restored = mountClient(undefined, { [preferenceKey]: stored });
  assert.equal(restored.sourceSelected('本地对话语料'), true);
  await restored.settle();
  assert.equal(restored.requests.length, 1);
  assert.match(restored.corpusMessage(), /未找到/);
  restored.builtin();
  assert.equal(restored.sourceSelected('默认语料'), true);
  const again = mountClient(undefined, { [preferenceKey]: restored.rawStorage(preferenceKey) });
  await again.nextPassage();
  assert.equal(again.requests.length, 0);
  assert.deepEqual(again.saved(), {});
});

test('switching to default source aborts a local read and ignores its late response', async () => {
  let resolve;
  const app = mountClient(undefined, {}, false, undefined, () => new Promise(done => { resolve = done; }));
  app.source('本地对话语料');
  app.builtin();
  assert.equal(app.requests[0].options.signal.aborted, true);
  const target = app.board().text;
  resolve({ ok: true, json: async () => ({ candidate: { language: 'en', text: 'Late local text.', source: { sessionId: 'old' } } }) });
  await app.settle();
  assert.equal(app.board().text, target);
  assert.equal(app.sourceSelected('默认语料'), true);
  assert.equal(app.corpusMessage(), undefined);
  await app.nextPassage();
  assert.equal(app.requests.length, 1);
});

test('invalid saved preferences default safely and unavailable storage does not prevent source switching', async () => {
  const key = 'dsh.typing-practice.preferences.v1';
  for (const value of ['{', 'null', '{"version":2,"source":"local"}', '{"version":1,"source":"unknown"}']) {
    const app = mountClient(undefined, { [key]: value });
    assert.equal(app.sourceSelected('默认语料'), true);
    assert.equal(app.requests.length, 0);
  }
  const app = mountClient(undefined, {}, true);
  await app.usePassage('Local practice still works.');
  assert.equal(app.board().text, 'Local practice still works.');
  assert.equal(app.sourceSelected('本地对话语料'), true);
  assert.equal(app.preferenceError(), true);
});

test('completed runs are recorded once and compare against the best before the current run', () => {
  const app = mountClient();
  app.input(app.board().text.slice(0, 10), 1000); app.tick(31000);
  assert.equal(app.records().history.length, 1);
  assert.equal(app.records().history[0].speed, 4);
  assert.match(app.comparison(), /首次完成/);
  app.tick(90000); app.refresh();
  assert.equal(app.records().history.length, 1);
  app.restart();
  app.input(app.board().text.slice(0, 5), 100000); app.tick(130000);
  assert.equal(app.records().history.length, 2);
  assert.equal(app.records().history[0].speed, 2);
  assert.equal(app.saved()[30].speed, 4);
  assert.match(app.comparison(), /此前最佳 4 WPM.*本次 -2 WPM/);
  assert.equal(app.newRecord(), undefined);
  app.restart(); app.input(app.board().text.slice(0, 15), 140000); app.tick(170000);
  assert.equal(app.saved()[30].speed, 6);
  assert.match(app.comparison(), /此前最佳 4 WPM.*本次 \+2 WPM/);
  assert.equal(app.newRecord(), '新纪录');
});

test('v3 preserves old corpus bests without comparing them with new prose scores or rewriting old storage', () => {
  const v1 = JSON.stringify({ best: { 15: { wpm: 80, accuracy: .98, at: 123 } } });
  const v2 = JSON.stringify({ version: 2, best: { 'en:30:builtin:plain:2': { speed: 4, accuracy: .8, at: 123 } } });
  const app = mountClient(undefined, { 'dsh.typing-practice.v1': v1, 'dsh.typing-practice.v2': v2 });
  assert.equal(app.records(), null);
  app.openRecords(); assert.match(app.recordsText(), /完成一轮练习后/);
  app.recordAction('限时最佳'); assert.match(app.recordsText(), /旧版最佳/); assert.match(app.recordsText(), /80/);
  app.recordsEscape();
  app.input(app.board().text.slice(0, 10), 1000); app.tick(31000);
  assert.equal(app.saved()[30].accuracy, 1);
  assert.match(app.comparison(), /首次完成/);
  assert.equal(app.records().best['en:30:builtin:plain:2'].accuracy, .8);
  assert.equal(app.records().best['en:30:builtin:plain:2:corpus2'].accuracy, 1);
  assert.equal(app.records().history[0].corpusVersion, 2);
  assert.equal(app.newRecord(), '新纪录');
  assert.equal(app.records().legacy[15].wpm, 80);
  assert.equal(app.records().history.length, 1);
  assert.equal(app.rawStorage('dsh.typing-practice.v1'), v1);
  assert.equal(app.rawStorage('dsh.typing-practice.v2'), v2);
});

test('default passages avoid recently displayed paragraphs across changes and page reloads', async () => {
  const key = 'dsh.typing-practice.recent.v1';
  const app = mountClient();
  const first = JSON.parse(app.rawStorage(key)).builtin.en;
  assert.ok(first.length > 0);
  await app.nextPassage();
  assert.ok(first.every(id => !app.board().text.includes(entries.find(entry => entry.id === id).text)));
  const saved = app.rawStorage(key);
  const recent = JSON.parse(saved).builtin.en;
  const reopened = mountClient(undefined, { [key]: saved });
  assert.ok(recent.every(id => !reopened.board().text.includes(entries.find(entry => entry.id === id).text)));
  app.language('中文');
  const chinese = JSON.parse(app.rawStorage(key)).builtin.zh;
  const before = app.board().text;
  app.hints('all');
  assert.equal(app.board().text, before);
  assert.deepEqual(JSON.parse(app.rawStorage(key)).builtin.zh, chinese);
  assert.ok(JSON.parse(app.rawStorage(key)).builtin.en.length <= 16);
});

test('local recent fingerprints persist without text and are sent only to the local corpus route', async () => {
  const key = 'dsh.typing-practice.recent.v1';
  const app = mountClient(); app.language('中文');
  await app.usePassage('你好，周末。', 'zh');
  await app.usePassage('另一段中文。', 'zh', 'b'.repeat(64));
  const query = new URL(app.requests.at(-1).url, 'http://localhost').searchParams;
  assert.equal(query.get('exclude'), 'a'.repeat(64));
  assert.deepEqual(query.getAll('recent'), ['a'.repeat(64)]);
  const saved = app.rawStorage(key);
  assert.deepEqual(JSON.parse(saved).local.zh, ['a'.repeat(64), 'b'.repeat(64)]);
  assert.doesNotMatch(saved, /你好|另一段|示例对话|sessionId|fixture/);
  const reopened = mountClient(undefined, { [key]: saved }); reopened.language('中文');
  await reopened.usePassage('新的片段。', 'zh', 'c'.repeat(64));
  assert.deepEqual(new URL(reopened.requests.at(-1).url, 'http://localhost').searchParams.getAll('recent'), ['a'.repeat(64), 'b'.repeat(64)]);
});

test('recent selection tolerates invalid storage and still remembers in memory when saving fails', async () => {
  const key = 'dsh.typing-practice.recent.v1';
  const app = mountClient(undefined, { [key]: JSON.stringify({ version: 1, corpusVersion: 999, builtin: { en: ['en-travel-01'] }, local: { en: ['invalid'] } }) });
  assert.deepEqual(JSON.parse(app.rawStorage(key)).local.en, []);
  assert.equal(JSON.parse(app.rawStorage(key)).corpusVersion, 2);
  const blocked = mountClient(undefined, {}, true);
  const first = entries.filter(entry => entry.language === 'en' && blocked.board().text.includes(entry.text));
  await blocked.nextPassage();
  assert.ok(first.every(entry => !blocked.board().text.includes(entry.text)));
  assert.equal(blocked.rawStorage(key), undefined);
});

test('old v3 history stays available and explicitly identifies the previous corpus', () => {
  const old = { id: 'old-run', language: 'en', hints: 'off', rules: 2,
    mode: 'timed', source: 'builtin', duration: 30, status: 'completed', at: 123,
    elapsedMs: 30000, speed: 4, accuracy: 1, correct: 10, wrongKeys: 0, keystrokes: 10, targetLength: 1200, fingerprint: null };
  const app = mountClient(undefined, { 'dsh.typing-practice.v3': JSON.stringify({ version: 3, best: {}, legacy: {}, history: [old] }) });
  app.openRecords(); assert.match(app.recordsText(), /旧语料/); app.recordsEscape();
  app.input(app.board().text[0], 1000); app.tick(31000);
  assert.equal(app.records().history[1].id, old.id);
  assert.equal(app.records().history[1].corpusVersion, 1);
  assert.equal(app.records().history[0].corpusVersion, 2);
});

test('built-in passage mode completes whole short, medium and long texts without a timed deadline', async () => {
  for (const [label, language] of [['英文', 'en'], ['中文', 'zh'], ['粤语', 'yue']]) {
    const app = mountClient(); app.language(label); app.mode('passage');
    for (const [sizeLabel, length] of [['短', 'short'], ['中', 'medium'], ['长', 'long']]) {
      app.length(sizeLabel);
      const text = app.board().text;
      const entry = entries.find(entry => entry.language === language && entry.length === length && entry.text === text);
      assert.ok(entry);
      app.input(text[0], 1000); app.tick(91000);
      assert.equal(app.finished(), false); assert.equal(app.stat('用时'), 90);
      app.input(text, 92000);
      const record = app.records().history[0];
      assert.equal(record.mode, 'passage'); assert.equal(record.source, 'builtin');
      assert.equal(record.passageId, entry.id); assert.equal(record.length, length);
      assert.equal(record.elapsedMs, 91000); assert.equal(record.status, 'completed');
      assert.equal(record.duration, null); assert.deepEqual(app.saved(language), {});
      assert.equal(record.fingerprint, null);
    }
  }
});

test('built-in retries and hint changes retain passage identity; next passage changes the scene', async () => {
  const app = mountClient(); app.language('中文'); app.mode('passage'); app.length('中');
  const text = app.board().text, entry = entries.find(entry => entry.text === text);
  app.input(text[0], 1000); app.input(text, 61000);
  app.restart(); assert.equal(app.board().text, text);
  app.input(text[0], 70000); app.input(text, 100000);
  assert.match(app.comparison(), /近期同篇最佳/);
  app.hints('all'); await app.settle(); assert.equal(app.board().text, text);
  app.input(text, 110000);
  assert.match(app.comparison(), /还没有同篇/);
  assert.equal(app.records().history[0].passageId, entry.id);
  app.openRecords(); app.recordAction('同篇记录'); assert.match(app.recordsText(), /此片段的练习/); app.recordsEscape();
  await app.nextPassage();
  assert.notEqual(entries.find(row => row.text === app.board().text).family, entry.family);
});

test('passage preferences and history survive reload, clearing records preserves mode and length', () => {
  const key = 'dsh.typing-practice.exercise.v2';
  const app = mountClient(); app.mode('passage'); app.length('长');
  app.input(app.board().text, 1000);
  const preference = app.rawStorage(key), records = app.rawStorage('dsh.typing-practice.v3');
  const reopened = mountClient(undefined, { [key]: preference, 'dsh.typing-practice.v3': records });
  assert.ok(entries.some(entry => entry.language === 'en' && entry.length === 'long' && entry.text === reopened.board().text));
  reopened.openRecords(); assert.match(reopened.recordsText(), /长/);
  reopened.recordAction('清空全部记录'); reopened.recordAction('确认清空');
  assert.equal(reopened.rawStorage(key), preference);
  assert.equal(reopened.records().history.length, 0);
});

test('switching presets invalidates old composition and leaves timed bests intact', () => {
  const app = mountClient(); app.language('中文');
  app.input(app.board().text.slice(0, 10), 1000); app.tick(31000);
  const best = app.saved('zh');
  app.restart(); app.compose('Start', '', '', 40000); const stale = app.staleInput();
  app.mode('passage'); app.length('长'); stale('旧文字');
  assert.equal(app.inputValue(), ''); assert.deepEqual(app.saved('zh'), best);
  app.mode('timed'); assert.equal(app.stat('剩余'), 30);
  app.length('长');
  assert.ok(entries.some(entry => entry.language === 'zh' && entry.length === 'long' && entry.text === app.board().text));
});

test('changing local length cancels old reads, sends the tier, and falls back to a matching built-in passage', async () => {
  const resolutions = [];
  const app = mountClient(undefined, {}, false, undefined, () => new Promise(done => resolutions.push(done)));
  app.source('本地对话语料'); app.length('长');
  assert.equal(app.requests[0].options.signal.aborted, true);
  assert.match(app.requests[1].url, /length=long/);
  resolutions[0]({ ok: true, json: async () => ({ candidate: { text: 'Late text.', language: 'en', length: 'short', source: { sessionId: 'old' } } }) });
  await app.settle(); assert.notEqual(app.board().text, 'Late text.');
  resolutions[1]({ ok: true, json: async () => ({ candidate: null, reason: 'empty' }) });
  await app.settle();
  assert.ok(entries.some(entry => entry.language === 'en' && entry.length === 'long' && entry.text === app.board().text));
  assert.equal(app.sourceSelected('本地对话语料'), true); assert.equal(app.stat('用时'), 0);
  app.builtin(); assert.equal(app.stat('用时'), 0); assert.equal(app.preset(), '长篇');
});

test('invalid exercise preferences use defaults and saving failures do not block passage practice', () => {
  const key = 'dsh.typing-practice.exercise.v2';
  const invalid = mountClient(undefined, { [key]: JSON.stringify({ version: 1, mode: 'invalid', length: 'unknown' }) });
  assert.equal(invalid.stat('剩余'), 30);
  const app = mountClient(undefined, {}, name => name === key);
  app.mode('passage'); app.length('中'); assert.equal(app.preferenceError(), true);
  app.input(app.board().text, 1000); assert.equal(app.finished(), true);
  assert.equal(app.records().history[0].length, 'medium');
});

test('early completion is recorded separately; restart and language changes do not record unfinished runs', () => {
  const app = mountClient();
  app.input(app.board().text[0], 1000); app.restart();
  app.input(app.board().text[0], 2000); app.language('中文');
  assert.equal(app.records(), null);
  app.input(app.board().text, 3000);
  assert.equal(app.records().history[0].status, 'early');
  assert.equal(app.records().history[0].mode, 'timed');
  assert.deepEqual(app.saved('zh'), {});
  assert.equal(app.comparison(), undefined);
});

test('passage comparison isolates original text, language and hint setting and saves only statistics', async () => {
  const app = mountClient(); const text = '你好，周末。';
  app.language('中文');
  await app.usePassage(text, 'zh');
  app.input(text[0], 1000); app.input(text, 2000);
  const first = app.records().history[0];
  assert.equal(first.duration, null); assert.equal(first.status, 'completed');
  assert.match(app.comparison(), /还没有同篇/);
  app.restart(); app.input(text[0], 3000); app.input(text, 3500);
  assert.match(app.comparison(), new RegExp(`近期同篇最佳 ${first.speed} 字/分钟`));
  assert.equal(app.newRecord(), '同篇新纪录');
  app.hints('current'); await app.settle(); app.input(text[0], 4000); app.input(text, 5000);
  assert.match(app.comparison(), /还没有同篇/);
  await app.usePassage('另一段中文。', 'zh', 'b'.repeat(64)); await app.settle();
  app.input('另', 6000); app.input('另一段中文。', 7000);
  assert.match(app.comparison(), /还没有同篇/);
  assert.deepEqual(app.saved('zh'), {});
  const saved = app.rawStorage('dsh.typing-practice.v3');
  for (const forbidden of [text, '另一段中文', '示例对话', 'sessionId', 'fixture', 'title', 'typed', 'annotations']) assert.equal(saved.includes(forbidden), false);
  app.openRecords(); app.recordAction('同篇记录');
  assert.match(app.recordsText(), /此片段的练习/);
  assert.doesNotMatch(app.recordsText(), /6 字符.*6 字符/);
  app.recordAction('查看全部'); assert.match(app.recordsText(), /同篇记录/);
});

test('history survives remount, retains 100 newest runs and preserves all-time timed bests', () => {
  const app = mountClient(); app.input(app.board().text.slice(0, 10), 1000); app.tick(31000);
  const seed = app.records(); const sample = seed.history[0];
  seed.history = Array.from({ length: 100 }, (_, i) => ({ ...sample, id: 'old-' + i, at: sample.at - i }));
  const restored = mountClient(undefined, { 'dsh.typing-practice.v3': JSON.stringify(seed) });
  restored.input(restored.board().text[0], 1000); restored.tick(31000);
  assert.equal(restored.records().history.length, 100);
  assert.equal(restored.records().history[1].id, 'old-0');
  assert.equal(restored.records().history.at(-1).id, 'old-98');
  assert.equal(restored.saved()[30].speed, 4);
  restored.openRecords(); restored.recordsFilter('yue');
  assert.match(restored.recordsText(), /完成一轮练习后/);
  restored.recordsFilter('en'); assert.match(restored.recordsText(), /默认语料/);
});

test('clearing needs confirmation, is atomic, keeps source preference and does not resurrect legacy scores', () => {
  const preference = '{"version":1,"source":"builtin"}';
  const annotations = '{"version":1,"mode":"all"}';
  const initial = { 'dsh.typing-practice.preferences.v1': preference, 'dsh.typing-practice.annotations.v1': annotations, 'dsh.typing-practice.v1': '{"best":{"30":{"wpm":85,"accuracy":1}}}' };
  const app = mountClient(undefined, initial);
  app.input(app.board().text[0], 1000); app.tick(31000);
  app.openRecords(); app.recordAction('清空全部记录');
  assert.equal(app.records().history.length, 1);
  app.recordsEscape(); assert.equal(app.recordsOpen(), true); assert.equal(app.records().history.length, 1);
  app.recordAction('清空全部记录'); app.recordAction('确认清空');
  app.refresh();
  assert.deepEqual(app.records(), { version: 3, best: {}, legacy: {}, history: [] });
  assert.equal(app.rawStorage('dsh.typing-practice.preferences.v1'), preference);
  assert.equal(app.rawStorage('dsh.typing-practice.annotations.v1'), annotations);
  const restored = mountClient(undefined, { ...initial, 'dsh.typing-practice.v3': app.rawStorage('dsh.typing-practice.v3') });
  assert.equal(restored.bestText(), '暂无最佳记录');
  restored.openRecords(); restored.recordAction('限时最佳'); assert.doesNotMatch(restored.recordsText(), /旧版最佳/);
});

test('failed clear retains records and can be retried without a partial deletion', () => {
  let fail = false;
  const app = mountClient(undefined, {}, () => fail);
  app.input(app.board().text[0], 1000); app.tick(31000);
  const original = app.rawStorage('dsh.typing-practice.v3');
  app.openRecords(); app.recordAction('清空全部记录'); fail = true; app.recordAction('确认清空');
  assert.match(app.recordsText(), /未能清空/); assert.equal(app.rawStorage('dsh.typing-practice.v3'), original);
  fail = false; app.recordAction('确认清空'); assert.equal(app.records().history.length, 0);
});

test('failed completion save keeps the result and pending history in memory for a later successful save', () => {
  let fail = true;
  const app = mountClient(undefined, {}, () => fail);
  app.input(app.board().text[0], 1000); app.tick(31000);
  assert.equal(app.saveError(), true); assert.equal(app.records(), null);
  app.openRecords(); assert.match(app.recordsText(), /默认语料/); app.recordsEscape();
  fail = false; app.restart(); app.input(app.board().text[0], 40000); app.tick(70000);
  assert.equal(app.saveError(), false); assert.equal(app.records().history.length, 2);
});

test('record dialog refuses an active run and cancels a pending corpus request when opened', async () => {
  let resolve;
  const app = mountClient(undefined, {}, false, undefined, () => new Promise(done => { resolve = done; }));
  app.input(app.board().text[0], 1000); assert.equal(app.recordsDisabled(), true);
  app.openRecords(); assert.equal(app.recordsOpen(), false);
  app.restart(); assert.equal(app.recordsDisabled(), false);
  app.source('本地对话语料'); app.openRecords();
  assert.equal(app.recordsOpen(), true); assert.equal(app.requests[0].options.signal.aborted, true);
  resolve({ ok: true, json: async () => ({ candidate: { language: 'en', text: 'Late text.', source: { sessionId: 'old' } } }) });
  await app.settle(); assert.notEqual(app.board().text, 'Late text.');
  app.recordsEscape(); assert.equal(app.recordsOpen(), false);
});

test('malformed stored records are filtered and unknown text fields are removed on the next save', () => {
  const base = mountClient(); base.input(base.board().text[0], 1000); base.tick(31000);
  const seed = base.records(); const entry = seed.history[0];
  seed.history = [{ ...entry, text: 'PRIVATE BODY', title: 'PRIVATE TITLE' }, { ...entry },
    { ...entry, id: 'bad-language', language: 'constructor' }, { ...entry, id: 'bad-time', at: 1e20 },
    { ...entry, id: 'bad-duration', duration: 90 }, { ...entry, id: 'bad-errors', wrongKeys: 999 }, null];
  const app = mountClient(undefined, { 'dsh.typing-practice.v3': JSON.stringify(seed) });
  app.input(app.board().text[0], 1000); app.tick(31000);
  assert.equal(app.records().history.length, 2);
  assert.equal(app.rawStorage('dsh.typing-practice.v3').includes('PRIVATE'), false);
  for (const invalid of ['{', 'null', '{"version":3,"history":{},"best":null,"legacy":null}']) {
    const empty = mountClient(undefined, { 'dsh.typing-practice.v3': invalid });
    empty.openRecords(); assert.match(empty.recordsText(), /完成一轮练习后/);
  }
});

test('sounds default off, persist independently and do not create audio on page load', async () => {
  const audio = audioHarness(); const app = mountClient(undefined, {}, false, undefined, undefined, undefined, audio);
  app.focusInput(); app.key('a', 1000);
  assert.equal(audio.contexts.length, 0); assert.equal(app.audioLoads.length, 0);
  app.restart(); app.openSound(); app.soundPack('cream'); app.soundVolume(45); await app.settle();
  assert.deepEqual(app.soundPreference(), { version: 1, pack: 'cream', volume: 45 });
  assert.equal(app.audioLoads.length, 1); assert.equal(audio.contexts[0].sources.length, 0);
  const restoredAudio = audioHarness();
  const restored = mountClient(undefined, { 'dsh.typing-practice.sound.v1': JSON.stringify(app.soundPreference()) }, false, undefined, undefined, undefined, restoredAudio);
  assert.equal(restoredAudio.contexts.length, 0); restored.openSound(); assert.equal(restored.soundValue(), 'cream');
  restored.closeSound(); restored.focusInput(); await restored.settle(); restored.key(restored.board().text[0], 1000); restored.tick(31000);
  restored.openRecords(); restored.recordAction('清空全部记录'); restored.recordAction('确认清空');
  assert.deepEqual(restored.soundPreference(), { version: 1, pack: 'cream', volume: 45 });
});

test('one observable key makes one sound; IME composition and committed text do not replay characters', async () => {
  const audio = audioHarness(); const app = mountClient(undefined, {}, false, undefined, undefined, undefined, audio);
  app.language('中文'); app.openSound(); app.soundPack('mxblue'); await app.settle(); app.closeSound(); app.focusInput();
  app.key('n', 1000, { isComposing: true }); app.compose('Start', '', '', 1000); app.compose('Update', 'ni', 'ni', 1100);
  app.key('Process', 1200, { nativeEvent: { isComposing: true, keyCode: 229 } });
  app.key(' ', 1300, { isComposing: true });
  const count = audio.contexts[0].sources.length; assert.equal(count, 3);
  app.compose('End', '你好', '你好', 1500); app.input('你好', 1501, 'insertText', '你好');
  assert.equal(audio.contexts[0].sources.length, count); assert.equal(app.board().typed, '你好');
  app.input('你好很多个字', 1600); assert.equal(audio.contexts[0].sources.length, count);
});

test('audio excludes modifiers, navigation, held repeats, unfocused input and late keys without affecting timing', async () => {
  const audio = audioHarness(); const app = mountClient(undefined, {}, false, undefined, undefined, undefined, audio);
  app.openSound(); app.soundPack('mxbrown'); await app.settle(); app.closeSound(); app.focusInput();
  app.key(app.board().text[0], 1000); assert.equal(audio.contexts[0].sources.length, 1);
  for (const key of ['Tab', 'Shift', 'ArrowLeft', 'Enter']) app.key(key, 1100);
  for (const options of [{ repeat: true }, { metaKey: true }, { ctrlKey: true }, { altKey: true }]) app.key('a', 1200, options);
  assert.equal(audio.contexts[0].sources.length, 1);
  app.blurInput(); app.key('a', 1400); assert.equal(audio.contexts[0].sources.length, 1);
  app.focusInput(); app.key('Backspace', 1500); assert.equal(audio.contexts[0].sources.length, 2);
  app.key('x', 31000); assert.equal(app.finished(), true); assert.equal(audio.contexts[0].sources.length, 2);
  assert.ok(audio.contexts[0].sources.every(source => source.stopped));
});

test('pending preview is cancelled on close and disposal; loading never queues ordinary keys', async () => {
  let resolve;
  const audio = { ...audioHarness(), load: () => new Promise(done => { resolve = done; }) };
  const app = mountClient(undefined, {}, false, undefined, undefined, undefined, audio);
  app.openSound(); app.soundPack('mxblue'); app.previewSound(); app.closeSound();
  app.key('a', 1000); assert.equal(audio.contexts[0].sources.length, 0);
  resolve({ createAudioPlayer, samples: samplePacks }); await app.settle();
  assert.equal(audio.contexts[0].sources.length, 0);
  app.key('b', 1500); assert.equal(audio.contexts[0].sources.length, 1);
  app.unmount(); assert.equal(audio.contexts[0].closes, 1); assert.equal(audio.contexts[0].sources[0].stopped, true);

  let lateResolve;
  const delayed = { ...audioHarness(), load: () => new Promise(done => { lateResolve = done; }) };
  const removed = mountClient(undefined, {}, false, undefined, undefined, undefined, delayed);
  removed.openSound(); removed.soundPack('cream'); removed.previewSound(); removed.unmount();
  lateResolve({ createAudioPlayer, samples: samplePacks }); await new Promise(done => setImmediate(done));
  assert.equal(delayed.contexts[0].state, 'closed'); assert.equal(delayed.contexts[0].sources.length, 0);
});

test('sound errors remain local and explicit preview can retry a failed load', async () => {
  let fail = true;
  const audio = { ...audioHarness(), load: () => fail ? Promise.reject(new Error('Missing chunk')) : Promise.resolve({ createAudioPlayer, samples: samplePacks }) };
  const app = mountClient(undefined, {}, false, undefined, undefined, undefined, audio);
  app.openSound(); app.soundPack('cream'); await app.settle(); assert.match(app.soundMessage(), /音效暂不可用/);
  fail = false; app.previewSound(); await app.settle(); assert.equal(audio.contexts[0].sources.length, 4);
  app.closeSound(); app.key(app.board().text[0], 1000); app.tick(31000); assert.equal(app.finished(), true);
  for (const broken of [{}, audioHarness({ resumeError: true, state: 'suspended' }), audioHarness({ decodeError: true })]) {
    const run = mountClient(undefined, {}, false, undefined, undefined, undefined, broken);
    run.openSound(); run.soundPack('cream'); await run.settle(); assert.match(run.soundMessage(), /音效暂不可用/);
    run.closeSound(); run.key(run.board().text[0], 1000); run.tick(31000); assert.equal(run.finished(), true);
  }
});

test('mute, blur and hidden page stop preview; sound preferences tolerate storage failures', async () => {
  const audio = audioHarness(); const app = mountClient(undefined, {}, true, undefined, undefined, undefined, audio);
  app.openSound(); app.soundPack('mxblue'); await app.settle(); assert.match(app.soundMessage(), /选项未能保存/);
  app.previewSound(); await app.settle(); const ctx = audio.contexts[0]; assert.equal(ctx.sources.length, 4);
  app.soundVolume(0); assert.ok(ctx.sources.every(source => source.stopped));
  app.soundVolume(30); app.previewSound(); await app.settle(); app.hide(); assert.ok(ctx.sources.every(source => source.stopped));
  for (const value of ['{', '{"version":1,"pack":"unknown","volume":-3}', '{"version":5,"pack":"cream","volume":60}']) {
    const restored = mountClient(undefined, { 'dsh.typing-practice.sound.v1': value }); restored.openSound(); assert.equal(restored.soundValue(), 'off');
  }
});


test('unified presets have one selection and one tab stop, with standard radio arrow navigation', () => {
  const app = mountClient();
  assert.deepEqual(app.presetOptions().map(item => item.label), ['15 秒', '30 秒', '60 秒', '短篇', '中篇', '长篇']);
  assert.equal(app.preset(), '30 秒');
  for (const [key, label, index] of [['ArrowRight', '60 秒', 2], ['ArrowRight', '短篇', 3], ['End', '长篇', 5], ['ArrowRight', '15 秒', 0], ['ArrowLeft', '长篇', 5], ['Home', '15 秒', 0]]) {
    assert.deepEqual(app.presetKey(key), { focusIndex: index, prevented: true });
    assert.equal(app.preset(), label);
    assert.equal(app.presetOptions().filter(item => item.checked).length, 1);
    assert.equal(app.presetOptions().filter(item => item.tabIndex === 0).length, 1);
  }
  assert.deepEqual(app.presetKey('Tab'), { focusIndex: -1, prevented: false });
});

test('all six presets survive reload and source changes without restoring a hidden second selection', async () => {
  const key = 'dsh.typing-practice.exercise.v2';
  for (const preset of ['15', '30', '60', 'short', 'medium', 'long']) {
    const app = mountClient(undefined, { [key]: JSON.stringify({ version: 2, preset }) });
    const label = app.preset();
    app.source('本地对话语料'); await app.settle(); assert.equal(app.preset(), label);
    app.builtin(); assert.equal(app.preset(), label);
    const reopened = mountClient(undefined, { [key]: app.rawStorage(key) });
    assert.equal(reopened.preset(), label);
    if (Number(preset)) assert.equal(reopened.stat('剩余'), Number(preset));
    else assert.equal(reopened.stat('用时'), 0);
  }
});

test('v1 mode and length migrate once, local legacy defaults preserve passage mode, invalid or 10-second presets default to 30', () => {
  const key = 'dsh.typing-practice.exercise.v2', legacy = 'dsh.typing-practice.exercise.v1';
  for (const [old, source, expected] of [
    [{ version: 1, mode: 'passage', length: 'long' }, 'builtin', '长篇'],
    [{ version: 1, mode: 'timed', length: 'medium' }, 'builtin', '30 秒'],
    [{ version: 1, mode: 'timed', length: 'medium' }, 'local', '中篇'],
    [null, 'local', '短篇'],
  ]) {
    const stored = { [legacy]: JSON.stringify(old), 'dsh.typing-practice.preferences.v1': JSON.stringify({ version: 1, source }) };
    const app = mountClient(undefined, stored);
    assert.equal(app.preset(), expected);
    assert.equal(JSON.parse(app.rawStorage(key)).version, 2);
    assert.equal(app.rawStorage(legacy), JSON.stringify(old));
  }
  for (const preset of ['10', 'invalid', null, { mode: 'passage' }]) {
    assert.equal(mountClient(undefined, { [key]: JSON.stringify({ version: 2, preset }) }).preset(), '30 秒');
  }
});

function timedCandidate(language = 'en') {
  const selected = [];
  for (const entry of entries.filter(item => item.language === language && item.length === 'short')) {
    selected.push(entry.text);
    if (selected.join(' ').length >= 1200) break;
  }
  const text = selected.join(' '), hash = text => createHash('sha256').update(text).digest('hex');
  return { language, mode: 'timed', text, length: null, source: { fingerprint: hash(text), fingerprints: selected.map(hash) } };
}

test('local timed runs enforce all three deadlines, isolate bests by source and retain history on reload', async () => {
  const candidate = timedCandidate();
  const app = mountClient(undefined, {}, false, undefined, async () => ({ ok: true, json: async () => ({ candidate }) }));
  app.input(app.board().text[0], 1000); app.tick(31000);
  const builtin = app.records().best['en:30:builtin:plain:2:corpus2'];
  app.source('本地对话语料'); await app.settle();
  for (const [index, duration] of [15, 30, 60].entries()) {
    app.duration(duration); await app.settle();
    assert.equal(app.board().text, candidate.text); assert.equal(app.stat('剩余'), duration);
    const start = 100000 + index * 100000;
    app.input(candidate.text[0], start); app.input(candidate.text.slice(0, 2), start + duration * 1000);
    const record = app.records().history[0];
    assert.equal(record.source, 'local'); assert.equal(record.mode, 'timed'); assert.equal(record.duration, duration);
    assert.equal(record.correct, 1); assert.equal(record.elapsedMs, duration * 1000); assert.equal(record.corpusVersion, null);
    assert.equal(record.fingerprint, candidate.source.fingerprint);
    assert.ok(app.records().best[`en:${duration}:local:plain:2`]);
  }
  assert.deepEqual(app.records().best['en:30:builtin:plain:2:corpus2'], builtin);
  const restored = mountClient(undefined, { 'dsh.typing-practice.v3': app.rawStorage('dsh.typing-practice.v3') });
  restored.openRecords(); assert.match(restored.recordsText(), /本地对话语料/);
  restored.recordAction('限时最佳'); assert.match(restored.recordsText(), /本地对话语料/);
  assert.doesNotMatch(app.rawStorage('dsh.typing-practice.v3'), /The bus stop/);
  const recent = JSON.parse(app.rawStorage('dsh.typing-practice.recent.v1')).local.en;
  assert.deepEqual(recent, candidate.source.fingerprints);
  assert.deepEqual(new URL(app.requests.at(-1).url, 'http://localhost').searchParams.getAll('recent'), candidate.source.fingerprints);
});

test('local timed retry retains prepared text and excludes every current excerpt on next selection', async () => {
  const candidate = timedCandidate();
  const app = mountClient(undefined, {}, false, undefined, async () => ({ ok: true, json: async () => ({ candidate }) }));
  app.source('本地对话语料'); await app.settle();
  app.input(candidate.text[0], 1000); app.restart();
  assert.equal(app.board().text, candidate.text); assert.equal(app.requests.length, 1);
  await app.nextPassage(); await app.settle();
  const query = new URL(app.requests.at(-1).url, 'http://localhost').searchParams;
  assert.equal(query.get('mode'), 'timed'); assert.equal(query.get('length'), 'short');
  assert.deepEqual(query.getAll('exclude'), candidate.source.fingerprints);
});

test('insufficient or old-host local buffers fall back entirely, retain the selected timer and record actual source', async () => {
  for (const body of [{ candidate: null, reason: 'insufficient' }, { candidate: { ...timedCandidate(), text: 'Too short.' } },
    { candidate: { language: 'en', text: timedCandidate().text, source: { sessionId: 'old-host' } } }]) {
    const app = mountClient(undefined, {}, false, undefined, async () => ({ ok: true, json: async () => body }));
    app.duration(15); app.source('本地对话语料'); await app.settle();
    assert.equal(app.preset(), '15 秒'); assert.equal(app.stat('剩余'), 15);
    assert.equal(app.sourceSelected('本地对话语料'), true); assert.ok(app.board().text.length >= 1200);
    assert.ok(app.corpusMessage());
    app.input(app.board().text[0], 1000); app.tick(16000);
    assert.equal(app.records().history[0].source, 'builtin');
    assert.ok(app.records().best['en:15:builtin:plain:2:corpus2']);
    assert.equal(app.records().best['en:15:local:plain:2'], undefined);
  }
});

test('changing time or passage preset aborts a local request and ignores late results', async () => {
  const pending = [];
  const app = mountClient(undefined, {}, false, undefined, () => new Promise(resolve => pending.push(resolve)));
  app.source('本地对话语料'); app.duration(60); app.length('中');
  assert.equal(app.requests.length, 3); assert.ok(app.requests.slice(0, 2).every(item => item.options.signal.aborted));
  pending[0]({ ok: true, json: async () => ({ candidate: timedCandidate() }) });
  pending[1]({ ok: true, json: async () => ({ candidate: timedCandidate() }) });
  pending[2]({ ok: true, json: async () => ({ candidate: null, reason: 'empty' }) });
  await app.settle();
  assert.equal(app.preset(), '中篇'); assert.equal(app.stat('用时'), 0);
  assert.ok(entries.some(entry => entry.language === 'en' && entry.length === 'medium' && entry.text === app.board().text));
});

test('Escape restarts the same text and clears a running or completed attempt', () => {
  const app = mountClient();
  const text = app.board().text;
  app.key(text[0], 1000);
  assert.equal(app.key('Escape', 1500), true);
  assert.equal(app.board().text, text); assert.equal(app.board().typed, '');
  assert.equal(app.stat('剩余'), 30); assert.equal(app.activeTimers(), 0);
  app.key(text[0], 2000); app.tick(32000);
  assert.equal(app.finished(), true);
  assert.equal(app.key('Escape', 33000), true);
  assert.equal(app.finished(), false); assert.equal(app.board().text, text);
  assert.equal(app.records().history.length, 1);
});

for (const platform of ['MacIntel', 'Win32', 'Linux']) {
  test(`${platform}: new-passage shortcut uses the platform modifier, rejects repeats and preserves hard reload`, () => {
    const app = mountClient(undefined, {}, false, undefined, undefined, undefined, { platform });
    const apple = platform === 'MacIntel';
    assert.equal(app.shortcutLabel(), apple ? '⌘ R' : 'Ctrl+R');
    assert.equal(app.shortcutAria(), apple ? 'Meta+R' : 'Control+R');
    const options = apple ? { metaKey: true } : { ctrlKey: true };
    let text = app.board().text;
    app.key('r', 1000, { ...options, repeat: true }); assert.equal(app.board().text, text);
    app.key('R', 1000, { ...options, shiftKey: true }); assert.equal(app.board().text, text);
    app.key('r', 1000, apple ? { ctrlKey: true } : { metaKey: true }); assert.equal(app.board().text, text);
    assert.equal(app.key('r', 1000, options), true); assert.notEqual(app.board().text, text);
    text = app.board().text;
    app.restart(); assert.equal(app.board().text, text);
  });
}

test('composition and native candidate keys never restart or replace the passage', () => {
  const app = mountClient(); app.language('中文');
  const text = app.board().text;
  app.compose('Start', '', '', 1000); app.compose('Update', 'ni', 'ni', 1100);
  assert.equal(app.key('Escape', 1200, { isComposing: true }), false);
  assert.equal(app.key('r', 1200, { ctrlKey: true }), true);
  assert.equal(app.composing(), true); assert.equal(app.board().text, text);
  app.compose('End', '你', '你', 1300);
  app.key('Escape', 1400, { nativeEvent: { keyCode: 229 } }); assert.equal(app.board().typed, '你');
  app.key('Escape', 1500); assert.equal(app.board().typed, ''); assert.equal(app.board().text, text);
});

test('settings tabs preserve preferences, stop previews and isolate practice shortcuts', async () => {
  const audio = audioHarness(); const app = mountClient(undefined, {}, false, undefined, undefined, undefined, audio);
  app.openSound(); assert.equal(app.settingsTab(), '音效');
  app.soundPack('cream'); app.soundVolume(40); await app.settle();
  app.previewSound(); await app.settle(); assert.ok(audio.contexts[0].sources.length);
  const text = app.board().text;
  app.key('r', 0, { ctrlKey: true }); assert.equal(app.board().text, text); assert.equal(app.soundOpen(), true);
  app.key('Escape', 0); assert.equal(app.soundOpen(), true); // Native dialog cancel owns Escape.
  assert.equal(app.settingsTabKey('ArrowRight'), 2); assert.equal(app.settingsTab(), '光标');
  assert.ok(audio.contexts[0].sources.every(source => source.stopped));
  app.cursorShape('outline');
  assert.equal(app.settingsTabKey('Home'), 0); assert.equal(app.settingsTab(), '注音');
  assert.equal(app.settingsTabKey('ArrowRight'), 1); assert.equal(app.soundValue(), 'cream');
  assert.equal(app.cursorPreference().shape, 'outline'); assert.equal(app.soundPreference().volume, 40);
  app.closeSound(); assert.equal(app.soundOpen(), false); assert.equal(app.board().text, text);
});

test('pronunciation is always available in the first settings tab with wrapping keyboard navigation', async () => {
  const app = mountClient();
  app.openSettings();
  assert.deepEqual(app.settingsTabs(), ['注音', '音效', '光标']);
  assert.equal(app.settingsTab(), '注音');
  assert.equal(app.hintControl().value, 'current');
  assert.equal(app.settingsTabKey('ArrowLeft'), 2);
  assert.equal(app.settingsTab(), '光标');
  assert.equal(app.settingsTabKey('ArrowRight'), 0);
  assert.equal(app.settingsTabKey('End'), 2);
  assert.equal(app.settingsTabKey('Home'), 0);
  app.closeSound();
  for (const language of ['中文', '粤语']) {
    app.language(language, 'all');
    await app.settle();
    const text = app.board().text;
    app.openSettings();
    assert.equal(app.hintControl()['aria-label'], '拼音／粤拼');
    assert.equal(app.hintControl().value, 'all');
    app.settingsTabKey('End'); app.settingsTabKey('Home');
    assert.equal(app.hintControl().value, 'all');
    app.closeSound();
    assert.equal(app.board().text, text);
    app.input(text[0], 1000);
    assert.equal(app.settingsDisabled(), true);
    app.restart();
  }
});

test('all hint modes persist from English settings and apply to Chinese and Cantonese after remount', async () => {
  for (const mode of ['off', 'current', 'all']) {
    const calls = [];
    const app = mountClient(undefined, {}, false, async name => { calls.push(name); return annotationEngine('ready'); });
    const text = app.board().text;
    app.input(text[0], 1000); app.tick(31000);
    app.hints('off'); app.hints(mode);
    await app.settle();
    assert.equal(app.board().hints, 'off');
    assert.equal(app.board().text, text);
    assert.equal(app.finished(), true, 'changing the shared setting must not reset an English result');
    assert.deepEqual(calls, [], 'English preferences must not load a pronunciation engine');
    const stored = app.rawStorage('dsh.typing-practice.annotations.v1');
    assert.deepEqual(JSON.parse(stored), { version: 1, mode });
    const restored = mountClient(undefined, { 'dsh.typing-practice.annotations.v1': stored });
    restored.openSettings(); assert.equal(restored.hintControl().value, mode); restored.closeSound();
    for (const language of ['中文', '粤语']) {
      restored.language(language, null); await restored.settle();
      assert.equal(restored.board().hints, mode);
      assert.equal(Boolean(restored.board().annotations), mode !== 'off');
    }
    restored.language('英文'); assert.equal(restored.board().hints, 'off');
    restored.openSettings(); assert.equal(restored.hintControl().value, mode);
  }
});

test('invalid hint preferences use the default and failed saves still apply until a successful retry', async () => {
  const key = 'dsh.typing-practice.annotations.v1';
  for (const raw of ['broken json', 'null', '{"version":2,"mode":"all"}', '{"version":1,"mode":"invalid"}']) {
    const app = mountClient(undefined, { [key]: raw });
    app.openSettings(); assert.equal(app.hintControl().value, 'current');
  }
  let fail = true;
  const app = mountClient(undefined, {}, name => fail && name === key);
  app.hints('all'); app.openSettings(); assert.match(app.hintError(), /未能保存/); app.closeSound();
  assert.equal(app.rawStorage(key), undefined);
  app.language('中文', null); await app.settle(); assert.equal(app.board().hints, 'all');
  fail = false;
  app.hints('off'); app.openSettings(); assert.equal(app.hintError(), ''); app.closeSound();
  assert.equal(JSON.parse(app.rawStorage(key)).mode, 'off');
  app.language('粤语', null); assert.equal(app.board().hints, 'off');
});

test('the privacy note stays beside the subtitle for every language and corpus source', async () => {
  const app = mountClient();
  assert.equal(app.privacyInSubtitle(), true);
  await app.usePassage('This local passage is used only within the current practice session.');
  assert.equal(app.privacyInSubtitle(), true);
  app.builtin();
  assert.equal(app.privacyInSubtitle(), true);
  for (const language of ['中文', '粤语', '英文']) {
    app.language(language);
    assert.equal(app.privacyInSubtitle(), true);
  }
});

test('fallback toasts expire after three seconds, restart their timer on repeat and clean up on unmount', async () => {
  const app = mountClient(undefined, {}, false, undefined, async () => { throw new Error('unavailable'); });
  app.source('本地对话语料'); await app.settle();
  assert.match(app.corpusMessage(), /暂不可用/); assert.equal(app.toastTimers(), 1);
  app.tick(2999); assert.ok(app.corpusMessage());
  await app.nextPassage(); await app.settle();
  app.tick(3000); assert.ok(app.corpusMessage()); assert.equal(app.toastTimers(), 1);
  app.tick(5999); assert.equal(app.corpusMessage(), undefined); assert.equal(app.toastTimers(), 0);
  await app.nextPassage(); await app.settle(); assert.equal(app.toastTimers(), 1);
  app.unmount(); assert.equal(app.toastTimers(), 0);
});

test('a next-passage shortcut cancels an in-flight local selection without accepting its late result', async () => {
  let resolve;
  const app = mountClient(undefined, {}, false, undefined, () => new Promise(done => { resolve = done; }));
  app.source('本地对话语料'); const text = app.board().text;
  app.key('r', 1000, { ctrlKey: true }); assert.equal(app.requests[0].options.signal.aborted, true);
  resolve({ ok: true, json: async () => ({ reason: 'empty' }) }); await app.settle();
  assert.equal(app.board().text, text); assert.equal(app.corpusMessage(), undefined);
});
