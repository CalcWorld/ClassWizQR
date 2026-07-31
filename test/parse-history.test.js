import assert from 'node:assert/strict';
import { test } from 'vitest';
import {
  createHistoryRepository,
  HISTORY_FORMAT,
  HISTORY_VERSION,
  MAX_HISTORY_ITEMS,
  normalizeHistoryRecord,
  parseHistoryImport,
  serializeHistory,
} from '../web/src/scripts/parseHistory.js';

class MemoryStorage {
  constructor() {
    this.values = new Map();
  }

  async getItem(key) {
    return this.values.get(key) ?? null;
  }

  async setItem(key, value) {
    this.values.set(key, structuredClone(value));
    return value;
  }

  async removeItem(key) {
    this.values.delete(key);
  }

  async clear() {
    this.values.clear();
  }

  async length() {
    return this.values.size;
  }

  async iterate(callback) {
    for (const [key, value] of this.values) callback(structuredClone(value), key);
  }
}

test('normalizes valid history records and rejects invalid URLs', () => {
  assert.equal(normalizeHistoryRecord({ url: 'not a url' }), null);
  assert.equal(normalizeHistoryRecord({
    url: `https://example.com/${'a'.repeat(32768)}`,
  }), null);
  assert.deepEqual(
    normalizeHistoryRecord({
      url: ' https://example.com/qr ',
      note: ' note ',
    }, 200),
    {
      url: 'https://example.com/qr',
      lastParsedAt: 200,
      note: 'note',
      summary: { model: '', mode: '', subMode: '' },
    },
  );
});

test('normalizes malformed summaries and out-of-range timestamps safely', () => {
  const record = normalizeHistoryRecord({
    url: 'https://example.com/qr',
    lastParsedAt: Number.MAX_VALUE,
    summary: null,
  }, 200);

  assert.equal(record.lastParsedAt, 200);
  assert.deepEqual(record.summary, { model: '', mode: '', subMode: '' });
});

test('upserts duplicate URLs without losing their note', async () => {
  const repository = createHistoryRepository(new MemoryStorage());
  await repository.upsert('https://example.com/one', { mode: 'Calculate' }, 100);
  await repository.updateNote('https://example.com/one', 'Practice');
  await repository.upsert('https://example.com/one', { mode: 'Equation' }, 200);

  assert.deepEqual(await repository.list(), [{
    url: 'https://example.com/one',
    lastParsedAt: 200,
    note: 'Practice',
    summary: { model: '', mode: 'Equation', subMode: '' },
  }]);
});

test('keeps only the newest 500 records', async () => {
  const repository = createHistoryRepository(new MemoryStorage());
  for (let index = 0; index <= MAX_HISTORY_ITEMS; index += 1) {
    await repository.upsert(`https://example.com/${index}`, {}, index + 1);
  }

  const records = await repository.list();
  assert.equal(records.length, MAX_HISTORY_ITEMS);
  assert.equal(records[0].url, `https://example.com/${MAX_HISTORY_ITEMS}`);
  assert.equal(records.at(-1).url, 'https://example.com/1');
});

test('imports versioned data, merges duplicates, and skips invalid entries', async () => {
  const repository = createHistoryRepository(new MemoryStorage());
  await repository.upsert('https://example.com/one', { mode: 'Old' }, 100);
  await repository.updateNote('https://example.com/one', 'Keep me');

  const result = await repository.importJson(JSON.stringify({
    format: HISTORY_FORMAT,
    version: HISTORY_VERSION,
    records: [
      {
        url: 'https://example.com/one',
        lastParsedAt: 200,
        note: '',
        summary: { mode: 'New' },
      },
      { url: 'invalid' },
    ],
  }));

  assert.equal(result.skipped, 1);
  const [record] = await repository.list();
  assert.equal(record.note, 'Keep me');
  assert.equal(record.summary.mode, 'New');
  assert.equal(record.lastParsedAt, 200);
});

test('limits imported data before writing it to storage', async () => {
  const storage = new MemoryStorage();
  const repository = createHistoryRepository(storage);
  const records = Array.from({ length: MAX_HISTORY_ITEMS + 2 }, (_, index) => ({
    url: `https://example.com/import-${index}`,
    lastParsedAt: index + 1,
  }));

  const result = await repository.importJson(JSON.stringify({
    format: HISTORY_FORMAT,
    version: HISTORY_VERSION,
    records,
  }));

  assert.equal(result.skipped, 2);
  assert.equal(storage.values.size, MAX_HISTORY_ITEMS);
  assert.equal((await repository.list())[0].url, 'https://example.com/import-501');
});

test('rejects history files with an unsupported format', () => {
  assert.throws(
    () => parseHistoryImport('{"format":"other","version":1,"records":[]}'),
    /Unsupported/,
  );
});

test('exports data in a versioned format that can be imported again', () => {
  const text = serializeHistory([{
    url: 'https://example.com/exported',
    lastParsedAt: 200,
    note: 'Exported note',
    summary: { model: 'Model', mode: 'Mode', subMode: '' },
  }]);
  const parsed = parseHistoryImport(text);

  assert.equal(parsed.records.length, 1);
  assert.equal(parsed.records[0].note, 'Exported note');
  assert.equal(JSON.parse(text).format, HISTORY_FORMAT);
});

test('removes individual records and clears the repository', async () => {
  const repository = createHistoryRepository(new MemoryStorage());
  await repository.upsert('https://example.com/one', {}, 100);
  await repository.upsert('https://example.com/two', {}, 200);

  await repository.remove('https://example.com/one');
  assert.deepEqual((await repository.list()).map(record => record.url), [
    'https://example.com/two',
  ]);

  await repository.clear();
  assert.deepEqual(await repository.list(), []);
});
