import { extractPassages, LENGTHS } from './corpus.js';

const json = (body, status = 200) => Response.json(body, { status, headers: { 'cache-control': 'no-store' } });
const MONTH = 30 * 24 * 60 * 60 * 1000;
const RECENT_LIMIT = 16;
const fingerprint = /^[a-f0-9]{64}$/;

export function registerCorpusRoutes(ctx) {
  let activeReads = 0;
  // Rotate bounded searches to include old chats with recent messages.
  // Session creation time must not be mistaken for message time.
  const cursors = new Map();
  ctx.get('connection').fetch.register({
    path: '/api/typing-practice/recent', methods: ['GET'], requestBody: 'buffered',
    async fetch(request) {
      const params = new URL(request.url).searchParams;
      const language = params.get('language');
      const exclude = params.get('exclude') || '';
      const recent = params.getAll('recent');
      if (!Object.hasOwn(LENGTHS, language) || exclude && !fingerprint.test(exclude)
        || recent.length > RECENT_LIMIT || recent.some(id => !fingerprint.test(id))) return json({ error: 'invalid_options' }, 400);
      const engine = ctx.get('sessionQuery');
      if (!engine?.listSessions || !engine?.observeSession) return json({ candidate: null, reason: 'unavailable' });
      if (activeReads >= 2) return json({ candidate: null, reason: 'busy' });
      activeReads++;
      const controller = new AbortController();
      const cancel = () => controller.abort();
      const timeout = setTimeout(cancel, 8000);
      request.signal.addEventListener('abort', cancel, { once: true });
      if (request.signal.aborted) cancel();
      const { signal } = controller;
      const until = Date.now();
      let failures = 0;
      let limited = false;
      try {
        const rows = (await engine.listSessions(signal)).filter(row => row.header.origin !== 'subagent');
        const start = (cursors.get(language) || 0) % Math.max(1, rows.length);
        const candidates = [];
        const repeats = [];
        const seen = new Set([exclude]);
        let inspected = 0;
        for (; inspected < Math.min(rows.length, 30); inspected++) {
          signal.throwIfAborted();
          const row = rows[(start + inspected) % rows.length];
          cursors.set(language, (start + inspected + 1) % rows.length);
          let observation;
          try {
            observation = await engine.observeSession(row.header.id, { signal, projectionMode: 'none' });
            signal.throwIfAborted();
            if (observation.header.id !== row.header.id) { failures++; continue; }
            const events = observation.events;
            const result = await extractPassages(events, { language, sessionId: row.header.id, since: until - MONTH, until }, signal);
            limited ||= result.limited;
            const title = events.findLast(event => event.type === 'session/title')?.data?.title;
            for (const item of result.candidates) {
              if (seen.has(item.source.fingerprint)) continue;
              seen.add(item.source.fingerprint);
              const pool = recent.includes(item.source.fingerprint) ? repeats : candidates;
              pool.push({ ...item, source: { ...item.source, title: typeof title === 'string' ? title.slice(0, 160) : '' } });
            }
          } catch (error) { if (signal.aborted) throw error; failures++; }
          finally { observation?.[Symbol.dispose]?.(); }
          if (candidates.length) { inspected++; break; }
        }
        cursors.set(language, (start + inspected) % Math.max(1, rows.length));
        signal.throwIfAborted();
        if (candidates.length) return json({ candidate: candidates[Math.floor(Math.random() * candidates.length)] });
        // Exhaust the bounded search for fresh text before reusing the oldest
        // recent match. The current passage remains a hard exclusion.
        if (repeats.length) return json({ candidate: repeats.sort((a, b) => recent.indexOf(a.source.fingerprint) - recent.indexOf(b.source.fingerprint))[0] });
        return json({ candidate: null, reason: failures ? 'read_failed' : limited || inspected < rows.length ? 'limited' : 'empty' });
      } catch {
        return json({ candidate: null, reason: signal.aborted ? 'timeout' : 'read_failed' });
      } finally {
        activeReads--;
        clearTimeout(timeout);
        request.signal.removeEventListener('abort', cancel);
      }
    },
  });
}
