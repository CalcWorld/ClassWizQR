import localforage from 'localforage';

export const HISTORY_FORMAT = 'classwiz-qr-history';
export const HISTORY_VERSION = 1;
export const MAX_HISTORY_ITEMS = 500;
export const MAX_HISTORY_NOTE_LENGTH = 500;

const MAX_URL_LENGTH = 32768;
const MAX_SUMMARY_LENGTH = 200;
const MAX_DATE_TIMESTAMP = 8.64e15;
const RECORD_PREFIX = 'record:';

const historyStorage = localforage.createInstance({
  name: 'ClassWizQR',
  storeName: 'parse_history',
  description: 'Local QR parsing history',
});

function finiteTimestamp(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 && number <= MAX_DATE_TIMESTAMP
    ? number
    : fallback;
}

function cleanText(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function normalizeUrl(value) {
  if (typeof value !== 'string') return '';
  const url = value.replace(/[\r\n]+/g, '').trim();
  if (!url || url.length > MAX_URL_LENGTH) return '';
  try {
    new URL(url);
    return url;
  } catch {
    return '';
  }
}

function normalizeSummary(summary) {
  const value = summary && typeof summary === 'object' ? summary : {};
  return {
    model: cleanText(value.model, MAX_SUMMARY_LENGTH),
    mode: cleanText(value.mode, MAX_SUMMARY_LENGTH),
    subMode: cleanText(value.subMode, MAX_SUMMARY_LENGTH),
  };
}

export function normalizeHistoryRecord(value, now = Date.now()) {
  const url = normalizeUrl(value?.url);
  if (!url) return null;

  return {
    url,
    lastParsedAt: finiteTimestamp(value.lastParsedAt, now),
    note: cleanText(value.note, MAX_HISTORY_NOTE_LENGTH),
    summary: normalizeSummary(value.summary),
  };
}

function recordKey(url) {
  return `${RECORD_PREFIX}${url}`;
}

function newestFirst(left, right) {
  return right.lastParsedAt - left.lastParsedAt;
}

export function parseHistoryImport(text) {
  const data = JSON.parse(text);
  if (data?.format !== HISTORY_FORMAT || data?.version !== HISTORY_VERSION) {
    throw new Error('Unsupported history file');
  }
  if (!Array.isArray(data.records)) throw new Error('Invalid history file');

  const recordsByUrl = new Map();
  let skipped = 0;
  for (const value of data.records) {
    const record = normalizeHistoryRecord(value);
    if (!record) {
      skipped += 1;
      continue;
    }

    const current = recordsByUrl.get(record.url);
    if (!current || record.lastParsedAt >= current.lastParsedAt) {
      recordsByUrl.set(record.url, record);
    }
  }

  const records = Array.from(recordsByUrl.values()).sort(newestFirst);
  return {
    records: records.slice(0, MAX_HISTORY_ITEMS),
    skipped: skipped + Math.max(0, records.length - MAX_HISTORY_ITEMS),
  };
}

export function serializeHistory(records) {
  return JSON.stringify({
    format: HISTORY_FORMAT,
    version: HISTORY_VERSION,
    exportedAt: new Date().toISOString(),
    records,
  }, null, 2);
}

function mergeRecords(current, incoming) {
  if (!current) return incoming;
  const newer = incoming.lastParsedAt >= current.lastParsedAt ? incoming : current;
  const older = newer === incoming ? current : incoming;

  return {
    url: incoming.url,
    lastParsedAt: Math.max(current.lastParsedAt, incoming.lastParsedAt),
    note: newer.note || older.note,
    summary: {
      model: newer.summary.model || older.summary.model,
      mode: newer.summary.mode || older.summary.mode,
      subMode: newer.summary.subMode || older.summary.subMode,
    },
  };
}

export function createHistoryRepository(storage = historyStorage) {
  async function list() {
    const records = [];
    await storage.iterate(value => {
      const record = normalizeHistoryRecord(value);
      if (record) records.push(record);
    });
    return records.sort(newestFirst);
  }

  async function trim() {
    const records = await list();
    await Promise.all(
      records.slice(MAX_HISTORY_ITEMS).map(record => storage.removeItem(recordKey(record.url))),
    );
    return records.slice(0, MAX_HISTORY_ITEMS);
  }

  return {
    list,

    async upsert(url, summary, now = Date.now()) {
      const incoming = normalizeHistoryRecord({
        url,
        lastParsedAt: now,
        summary,
      }, now);
      if (!incoming) return null;

      const key = recordKey(incoming.url);
      const current = normalizeHistoryRecord(await storage.getItem(key), now);
      const record = mergeRecords(current, incoming);
      await storage.setItem(key, record);
      if (await storage.length() > MAX_HISTORY_ITEMS) await trim();
      return record;
    },

    async updateNote(url, note) {
      const normalizedUrl = normalizeUrl(url);
      if (!normalizedUrl) return null;
      const key = recordKey(normalizedUrl);
      const current = normalizeHistoryRecord(await storage.getItem(key));
      if (!current) return null;
      const record = {
        ...current,
        note: cleanText(note, MAX_HISTORY_NOTE_LENGTH),
      };
      await storage.setItem(key, record);
      return record;
    },

    async remove(url) {
      const normalizedUrl = normalizeUrl(url);
      if (normalizedUrl) await storage.removeItem(recordKey(normalizedUrl));
    },

    async clear() {
      await storage.clear();
    },

    async importJson(text) {
      const parsed = parseHistoryImport(text);
      for (const incoming of parsed.records) {
        const key = recordKey(incoming.url);
        const current = normalizeHistoryRecord(await storage.getItem(key));
        await storage.setItem(key, mergeRecords(current, incoming));
      }
      const records = await trim();
      return { ...parsed, records };
    },

    async exportJson() {
      return serializeHistory(await list());
    },
  };
}

export const parseHistoryRepository = createHistoryRepository();
