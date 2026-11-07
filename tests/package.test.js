import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFile, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { entries } from '../src/practice-text.js';

test('the shipped Host activates and parses local Markdown without node_modules or source files', async t => {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const directory = await mkdtemp(join(tmpdir(), 'typing-practice-package-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  for (const file of ['index.js', 'package.json']) await copyFile(join(root, file), join(directory, file));
  const manifest = JSON.parse(await readFile(join(directory, 'package.json'), 'utf8'));
  assert.deepEqual(manifest.dependencies || {}, {});
  const text = entries.find(entry => entry.id === 'zh-travel-01').text;
  const script = `
    import assert from 'node:assert/strict';
    import { existsSync } from 'node:fs';
    const { apply } = await import(process.argv[1]);
    const text = process.argv[2];
    assert.equal(existsSync('node_modules'), false);
    assert.equal(existsSync('src'), false);
    let route;
    const engine = {
      async listSessions() { return [{ header: { id: 'package-fixture' } }]; },
      async observeSession() {
        return { header: { id: 'package-fixture' }, events: [{
          type: 'user/message', seq: 1, time: Date.now(),
          data: { role: 'user', source: { kind: 'user' }, content: [{ type: 'text', text: '**' + text + '**' }] },
        }], [Symbol.dispose]() {} };
      },
    };
    const ctx = {
      inject(names, callback) { assert.deepEqual(names, ['connection']); callback(this); },
      get(name) { return name === 'sessionQuery' ? engine : { fetch: { register(value) { route = value; } } }; },
    };
    apply(ctx);
    assert.equal(route.path, '/api/typing-practice/recent');
    const response = await route.fetch(new Request('http://localhost' + route.path + '?language=zh&mode=passage&length=short'));
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.equal(result.candidate.text, text);
    assert.equal(result.candidate.source.fingerprint.length, 64);
  `;
  const result = spawnSync(process.execPath, ['--input-type=module', '--eval', script,
    pathToFileURL(join(directory, 'index.js')).href, text], {
    cwd: directory, encoding: 'utf8', env: { ...process.env, NODE_PATH: '' }, timeout: 15000,
  });
  assert.equal(result.status, 0, result.stderr || result.error?.message);
});
