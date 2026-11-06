import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8');

// Run the shipped plugin and its component handlers with controlled hooks and
// clock. This does not emulate DOM focus, layout, or the DSH module loader.
function mountClient(locale, initialStorage = {}, failSave = false, loadChunk = async () => ({
  annotate: text => Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text), (part, i) => ({
    char: part.segment, reading: 'hint', wordStart: i, wordEnd: i + 1,
  })),
})) {
  const hooks = [];
  const timers = new Set();
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
    window: {
      __ModuleLoader__: { load: (module) => { factory = module.factory; } },
      localStorage: {
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => { if (failSave) throw new Error('Storage unavailable'); storage.set(key, value); },
      },
      setInterval: (callback) => { timers.add(callback); return callback; },
      clearInterval: (callback) => timers.delete(callback),
    },
    performance: { now: () => now },
    document: {
      createElement: () => ({ setAttribute() {}, remove() {} }),
      head: { appendChild() {} },
    },
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
  require.async = loadChunk;
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
        inputElement = { value: '', selectionEnd: 0, blur() {}, focus() {} };
      }
      input.props.ref.current = inputElement;
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
  return {
    key(key, at, options = {}) {
      now = at;
      let prevented = false;
      find((node) => node.type === 'textarea').props.onKeyDown({
        key, currentTarget: inputElement, ...options, preventDefault() { prevented = true; }, stopPropagation() {},
      });
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
      if (label !== '英文') {
        find(node => node.type === 'select').props.onChange({ currentTarget: { value: hints } });
        render();
      }
    },
    hints(value) {
      find(node => node.type === 'select').props.onChange({ currentTarget: { value } });
      render();
    },
    retryAnnotations() {
      find(node => node.type === 'button' && node.children[0] === '重试注音').props.onClick();
      render();
    },
    async settle() { await new Promise(resolve => setImmediate(resolve)); render(); },
    restart() {
      find((node) => node.type === 'button' && node.props.className === 'tp-btn primary').props.onClick();
      render();
    },
    duration(seconds) {
      find((node) => node.type === 'button' && node.children[0] === `${seconds} 秒`).props.onClick();
      render();
    },
    tick(at) {
      now = at;
      for (const callback of [...timers]) callback();
      render();
    },
    refresh: render,
    board: () => find((node) => typeof node.props.text === 'string').props,
    title: () => find((node) => node.type === 'h1').children[0],
    finished: () => Boolean(find((node) => node.props.className === 'tp-result')),
    saved: (language = 'en', hints = 'off') => {
      const best = JSON.parse(storage.get('dsh.typing-practice.v2') || '{"best":{}}').best;
      return Object.fromEntries(Object.entries(best).filter(([key]) => key.startsWith(language + ':') && key.split(':')[3] === (hints === 'off' ? 'plain' : hints)).map(([key, value]) => [key.split(':')[1], value]));
    },
    rawStorage: key => storage.get(key),
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
  const stored = app.rawStorage('dsh.typing-practice.v2');
  const restored = mountClient(undefined, { 'dsh.typing-practice.v2': stored });
  restored.language('中文');
  for (const [i, hints] of ['off', 'current', 'all'].entries()) {
    restored.hints(hints);
    await restored.settle();
    assert.match(restored.bestText(), new RegExp(`最佳 ${(i + 1) * 2} 字/分钟`));
  }
});

test('changing hints retains target text but starts a new run and invalidates old IME', async () => {
  const app = mountClient();
  app.language('中文', 'current');
  await app.settle();
  const text = app.board().text;
  app.compose('Start', '', '', 1000);
  app.compose('Update', 'ni', 'ni', 1000);
  const stale = app.staleInput();
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
