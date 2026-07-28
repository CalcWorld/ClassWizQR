import assert from 'node:assert/strict';
import { test } from 'vitest';
import { translate } from '../web/src/scripts/i18n.js';

test('translate preserves calls without parameters', () => {
  assert.equal(translate('loading'), 'Loading......');
  assert.equal(translate('loading', 'zh'), '加载中......');
  assert.equal(translate('loading', 'unknown'), 'Loading......');
  assert.equal(translate('missing-key', 'zh'), 'missing-key');
});

test('translate substitutes named parameters', () => {
  assert.equal(
    translate('camera-sequence-title', 'en', { count: 3 }),
    'Scan 3 QR codes',
  );
  assert.equal(
    translate('screen-title-sequence', 'zh', { pending: '2|4' }),
    '【[2|4] 待扫描】',
  );
  assert.equal(
    translate('pwa-caching-progress', 'zh', { current: 12, total: 34 }),
    '已缓存 12/34 个文件',
  );
});

test('translate preserves missing placeholders and stringifies supplied values', () => {
  assert.equal(
    translate('camera-sequence-title', 'en'),
    'Scan {count} QR codes',
  );
  assert.equal(
    translate('camera-sequence-title', 'en', { count: 0 }),
    'Scan 0 QR codes',
  );
  assert.equal(
    translate('camera-sequence-title', 'en', { count: '$&' }),
    'Scan $& QR codes',
  );
});
