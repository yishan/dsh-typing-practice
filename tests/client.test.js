import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../client.js', import.meta.url), 'utf8');

// Run the shipped plugin and its component handlers with controlled hooks and
// clock. This does not emulate DOM focus, layout, or the DSH module loader.
function mountClient(locale) {
  const hooks = [];
  const timers = new Set();
  const storage = new Map();
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
        setItem: (key, value) => storage.set(key, value),
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
  factory((name) => {
    assert.equal(name, 'react');
    return React;
  }).apply({ get: (name) => ({ slots, locale })[name], effect: (callback) => callback() });

  function render() {
    let renders = 0;
    do {
      assert.ok(++renders < 10, 'component effects must settle');
      cursor = 0;
      pendingEffects = [];
      dirty = false;
      tree = Page();
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
  return {
    key(key, at, options = {}) {
      now = at;
      let prevented = false;
      find((node) => node.type === 'textarea').props.onKeyDown({
        key, ...options, preventDefault() { prevented = true; }, stopPropagation() {},
      });
      render();
      return prevented;
    },
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
    saved: () => JSON.parse(storage.get('dsh.typing-practice.v1') || '{"best":{}}').best,
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
    assert.equal(app.saved()[duration].wpm, Math.round((2 / 5) / (duration / 60)));
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
        assert.equal(app.saved()[duration].wpm, Math.round((1 / 5) / (duration / 60)));
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
