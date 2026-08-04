import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'vitest';
import { prepareZXingModule, readBarcodes } from 'zxing-wasm/reader';
import { parse } from './support/parser.js';
import { consumeQrResult, createEmptySequence, getPendingSequenceIndexes, } from '../web/src/scripts/qrSequence.js';
import { addQrImageResults, createEmptyImageSequenceSession, } from '../web/src/scripts/qrImageSequence.js';
import { filterValidQrResults, resolveInitialQrResults, } from '../web/src/scripts/qrMultiResult.js';
import { MULTI_QR_LIMIT } from '../web/src/scripts/qrReader.js';
import { calculatePreparedImageSize, calculateQrSquareCrop, } from '../web/src/scripts/qrPreview.js';
import { readClipboardContent } from '../web/src/scripts/clipboardContent.js';

const wasmBinary = readFileSync(
  new URL('../node_modules/zxing-wasm/dist/reader/zxing_reader.wasm', import.meta.url),
);
prepareZXingModule({ overrides: { wasmBinary } });

test('multi-QR scanning is capped at sixteen symbols', () => {
  assert.equal(MULTI_QR_LIMIT, 16);
});

test('scanner helpers retain only valid QR codes and report pending indexes', () => {
  const valid = qrResult({ text: 'valid' });
  assert.deepEqual(filterValidQrResults([
    valid,
    { ...valid, isValid: false },
    { ...valid, isValid: undefined },
    { ...valid, symbology: 'DataMatrix' },
  ]), [valid]);
  assert.deepEqual(getPendingSequenceIndexes({
    parts: ['first', null, 'third', null],
  }), [2, 4]);
});

const decodeFixture = async filename => {
  const [result] = await readBarcodes(
    readFileSync(new URL(`img/${filename}`, import.meta.url)),
    {
      formats: ['QRCode'],
      maxNumberOfSymbols: 1,
      textMode: 'Plain',
    },
  );
  return result;
};

const qrResult = (
  {
    text,
    sequenceId = '',
    sequenceIndex = -1,
    sequenceSize = -1,
  }
) => ({
  isValid: true,
  format: 'QRCode',
  symbology: 'QRCode',
  text,
  sequenceId,
  sequenceIndex,
  sequenceSize,
});

test('a non-sequence QR completes immediately and resets sequence progress', () => {
  const inProgress = consumeQrResult(
    createEmptySequence(),
    qrResult({
      text: 'first',
      sequenceId: '90',
      sequenceIndex: 0,
      sequenceSize: 2,
    }),
  ).sequence;
  const consumed = consumeQrResult(inProgress, qrResult({ text: 'ordinary' }));

  assert.equal(consumed.completedText, 'ordinary');
  assert.deepEqual(consumed.sequence, createEmptySequence());
});

test('structured append parts are deduplicated and joined by zero-based index', () => {
  const first = consumeQrResult(
    createEmptySequence(),
    qrResult({
      text: 'left-',
      sequenceId: '90',
      sequenceIndex: 0,
      sequenceSize: 2,
    }),
  );
  assert.equal(first.sequenceStarted, true);
  assert.deepEqual(first.sequence.parts, ['left-', null]);

  const duplicate = consumeQrResult(
    first.sequence,
    qrResult({
      text: 'left-',
      sequenceId: '90',
      sequenceIndex: 0,
      sequenceSize: 2,
    }),
  );
  assert.equal(duplicate.acceptedIndex, null);
  assert.deepEqual(duplicate.sequence.parts, ['left-', null]);

  const completed = consumeQrResult(
    duplicate.sequence,
    qrResult({
      text: 'right',
      sequenceId: '90',
      sequenceIndex: 1,
      sequenceSize: 2,
    }),
  );
  assert.equal(completed.completedText, 'left-right');
  assert.deepEqual(completed.sequence, createEmptySequence());
});

test('structured append parts distinguish exact duplicates from conflicts', () => {
  const firstResult = qrResult({
    text: 'left-',
    sequenceId: '90',
    sequenceIndex: 0,
    sequenceSize: 2,
  });
  const first = consumeQrResult(createEmptySequence(), firstResult);
  const duplicate = consumeQrResult(first.sequence, firstResult);
  const conflict = consumeQrResult(first.sequence, {
    ...firstResult,
    text: 'different',
  });

  assert.equal(Boolean(duplicate.conflict), false);
  assert.equal(duplicate.acceptedIndex, null);
  assert.equal(conflict.conflict, true);
  assert.strictEqual(conflict.sequence, first.sequence);
  assert.equal(conflict.completedText, null);
});

test('a changed sequence identity starts fresh from the current QR', () => {
  const oldSequence = consumeQrResult(
    createEmptySequence(),
    qrResult({
      text: 'old',
      sequenceId: '1',
      sequenceIndex: 0,
      sequenceSize: 2,
    }),
  ).sequence;
  const changed = consumeQrResult(
    oldSequence,
    qrResult({
      text: 'new-second',
      sequenceId: '2',
      sequenceIndex: 1,
      sequenceSize: 2,
    }),
  );

  assert.equal(changed.sequenceStarted, true);
  assert.equal(changed.sequence.sequenceId, '2');
  assert.deepEqual(changed.sequence.parts, [null, 'new-second']);
});

test('image sequence sessions retain previews by sequence index', () => {
  const initial = createEmptyImageSequenceSession('file');
  const secondFirst = addQrImageResults(initial, [{
    result: qrResult({
      text: 'right',
      sequenceId: '90',
      sequenceIndex: 1,
      sequenceSize: 2,
    }),
    preview: 'second.png',
  }]);

  assert.equal(secondFirst.status, 'pending');
  assert.deepEqual(secondFirst.session.previews, [null, 'second.png']);

  const completed = addQrImageResults(secondFirst.session, [{
    result: qrResult({
      text: 'left-',
      sequenceId: '90',
      sequenceIndex: 0,
      sequenceSize: 2,
    }),
    preview: 'first.png',
  }]);
  assert.equal(completed.status, 'complete');
  assert.equal(completed.completedText, 'left-right');
});

test('image batches reject QR codes from different sequences', () => {
  const consumed = addQrImageResults(
    createEmptyImageSequenceSession('clipboard'),
    [
      {
        result: qrResult({
          text: 'one',
          sequenceId: '11',
          sequenceIndex: 0,
          sequenceSize: 2,
        }),
        preview: 'one.png',
      },
      {
        result: qrResult({
          text: 'two',
          sequenceId: '12',
          sequenceIndex: 1,
          sequenceSize: 2,
        }),
        preview: 'two.png',
      },
    ],
  );

  assert.equal(consumed.status, 'mixed');
  assert.deepEqual(consumed.rejectedPreviews, ['one.png', 'two.png']);
});

test('ordinary image QR results complete without opening a sequence session', () => {
  const consumed = addQrImageResults(
    createEmptyImageSequenceSession('file'),
    [{
      result: qrResult({ text: 'https://example.test/' }),
      preview: 'ordinary.png',
    }],
  );

  assert.equal(consumed.status, 'complete');
  assert.equal(consumed.completedText, 'https://example.test/');
});

test('initial multi-QR reads prioritize the first ordinary QR', () => {
  const sequence = qrResult({
    text: 'sequence',
    sequenceId: '10',
    sequenceIndex: 0,
    sequenceSize: 2,
  });
  const firstOrdinary = qrResult({ text: 'ordinary-first' });
  const secondOrdinary = qrResult({ text: 'ordinary-second' });
  const resolved = resolveInitialQrResults([
    sequence,
    firstOrdinary,
    secondOrdinary,
  ]);

  assert.equal(resolved.status, 'complete');
  assert.equal(resolved.kind, 'ordinary');
  assert.equal(resolved.text, 'ordinary-first');
});

test('initial multi-QR reads assemble a complete sequence by index', () => {
  const second = qrResult({
    text: 'right',
    sequenceId: '10',
    sequenceIndex: 1,
    sequenceSize: 2,
  });
  const first = qrResult({
    text: 'left-',
    sequenceId: '10',
    sequenceIndex: 0,
    sequenceSize: 2,
  });
  const resolved = resolveInitialQrResults([second, first]);

  assert.equal(resolved.status, 'complete');
  assert.equal(resolved.kind, 'sequence');
  assert.equal(resolved.text, 'left-right');
});

test('a complete sequence wins over an earlier incomplete sequence', () => {
  const partial = qrResult({
    text: 'partial',
    sequenceId: '10',
    sequenceIndex: 0,
    sequenceSize: 2,
  });
  const completeFirst = qrResult({
    text: 'complete-left-',
    sequenceId: '20',
    sequenceIndex: 0,
    sequenceSize: 2,
  });
  const completeSecond = qrResult({
    text: 'complete-right',
    sequenceId: '20',
    sequenceIndex: 1,
    sequenceSize: 2,
  });
  const resolved = resolveInitialQrResults([
    partial,
    completeFirst,
    completeSecond,
  ]);

  assert.equal(resolved.status, 'complete');
  assert.equal(resolved.text, 'complete-left-complete-right');
});

test('the earliest detected complete sequence wins when several are complete', () => {
  const bFirst = qrResult({
    text: 'B1-',
    sequenceId: '20',
    sequenceIndex: 0,
    sequenceSize: 2,
  });
  const aFirst = qrResult({
    text: 'A1-',
    sequenceId: '10',
    sequenceIndex: 0,
    sequenceSize: 2,
  });
  const aSecond = qrResult({
    text: 'A2',
    sequenceId: '10',
    sequenceIndex: 1,
    sequenceSize: 2,
  });
  const bSecond = qrResult({
    text: 'B2',
    sequenceId: '20',
    sequenceIndex: 1,
    sequenceSize: 2,
  });
  const resolved = resolveInitialQrResults([
    bFirst,
    aFirst,
    aSecond,
    bSecond,
  ]);

  assert.equal(resolved.status, 'complete');
  assert.equal(resolved.text, 'B1-B2');
});

test('all detected parts of the earliest incomplete sequence are retained', () => {
  const first = qrResult({
    text: 'A1',
    sequenceId: '10',
    sequenceIndex: 0,
    sequenceSize: 4,
  });
  const third = qrResult({
    text: 'A3',
    sequenceId: '10',
    sequenceIndex: 2,
    sequenceSize: 4,
  });
  const other = qrResult({
    text: 'B1',
    sequenceId: '20',
    sequenceIndex: 0,
    sequenceSize: 3,
  });
  const resolved = resolveInitialQrResults([first, other, third]);

  assert.equal(resolved.status, 'partial');
  assert.deepEqual(resolved.results, [first, third]);
});

test('conflicting duplicate sequence indexes cannot produce a complete result', () => {
  const first = qrResult({
    text: 'first',
    sequenceId: '10',
    sequenceIndex: 0,
    sequenceSize: 2,
  });
  const conflictingFirst = qrResult({
    text: 'different',
    sequenceId: '10',
    sequenceIndex: 0,
    sequenceSize: 2,
  });
  const second = qrResult({
    text: 'second',
    sequenceId: '10',
    sequenceIndex: 1,
    sequenceSize: 2,
  });
  const resolved = resolveInitialQrResults([
    first,
    conflictingFirst,
    second,
  ]);

  assert.equal(resolved.status, 'conflict');
  assert.deepEqual(resolved.results, [first, second]);
});

test('a later conflicting group does not displace the earliest clean partial sequence', () => {
  const partial = qrResult({
    text: 'partial',
    sequenceId: '10',
    sequenceIndex: 0,
    sequenceSize: 2,
  });
  const conflict = qrResult({
    text: 'conflict-a',
    sequenceId: '20',
    sequenceIndex: 0,
    sequenceSize: 2,
  });
  const conflictingDuplicate = { ...conflict, text: 'conflict-b' };
  const resolved = resolveInitialQrResults([
    partial,
    conflict,
    conflictingDuplicate,
  ]);

  assert.equal(resolved.status, 'partial');
  assert.deepEqual(resolved.results, [partial]);
});

test('image sequence sessions reject conflicting continuation parts', () => {
  const first = addQrImageResults(
    createEmptyImageSequenceSession('file'),
    [{
      result: qrResult({
        text: 'left-',
        sequenceId: '90',
        sequenceIndex: 0,
        sequenceSize: 2,
      }),
      preview: 'first.png',
    }],
  );
  const conflict = addQrImageResults(first.session, [{
    result: qrResult({
      text: 'different',
      sequenceId: '90',
      sequenceIndex: 0,
      sequenceSize: 2,
    }),
    preview: 'different.png',
  }]);

  assert.equal(conflict.status, 'mixed');
  assert.strictEqual(conflict.session, first.session);
  assert.deepEqual(conflict.rejectedPreviews, ['different.png']);
});

test('clipboard content preserves explicit text priority and uses rich text as image fallback', async () => {
  const textItem = text => ({
    types: ['text/plain'],
    async getType() {
      return { text: async () => text };
    },
  });
  const image = { type: 'image/png' };
  const richImageItem = {
    types: ['image/png', 'text/plain'],
    async getType(type) {
      return type === 'image/png'
        ? image
        : { text: async () => 'image source' };
    },
  };

  assert.deepEqual(
    await readClipboardContent([richImageItem, textItem('ClassWiz URL')]),
    { text: 'ClassWiz URL', images: [], fallbackText: '' },
  );
  assert.deepEqual(
    await readClipboardContent([richImageItem]),
    { text: '', images: [image], fallbackText: 'image source' },
  );

  assert.deepEqual(
    await readClipboardContent([{
      types: ['image/png', 'text/plain'],
      async getType(type) {
        if (type === 'text/plain') throw new Error('Text flavor unavailable');
        return image;
      },
    }]),
    { text: '', images: [image], fallbackText: '' },
  );
});

test('QR preview crop is square, padded, and clamped to the image', () => {
  const centered = calculateQrSquareCrop({
    topLeft: { x: 100, y: 80 },
    topRight: { x: 300, y: 80 },
    bottomLeft: { x: 100, y: 280 },
    bottomRight: { x: 300, y: 280 },
  }, 500, 400, 0.1);
  assert.deepEqual(centered, {
    x: 80,
    y: 60,
    size: 240,
  });

  const edge = calculateQrSquareCrop({
    topLeft: { x: 0, y: 0 },
    topRight: { x: 100, y: 0 },
    bottomLeft: { x: 0, y: 100 },
    bottomRight: { x: 100, y: 100 },
  }, 300, 200, 0.2);
  assert.deepEqual(edge, {
    x: 0,
    y: 0,
    size: 140,
  });
});

test('QR preview crop rejects missing or degenerate positions', () => {
  assert.equal(calculateQrSquareCrop(null, 500, 500), null);
  assert.equal(calculateQrSquareCrop({
    topLeft: { x: 10, y: 10 },
    topRight: { x: 10, y: 10 },
    bottomLeft: { x: 10, y: 10 },
    bottomRight: { x: 10, y: 10 },
  }, 500, 500), null);
});

test('large QR images are proportionally reduced before the first scan attempt', () => {
  assert.deepEqual(calculatePreparedImageSize(6000, 4000), {
    width: 2560,
    height: 1707,
    scaled: true,
  });
  assert.deepEqual(calculatePreparedImageSize(1200, 800), {
    width: 1200,
    height: 800,
    scaled: false,
  });
  assert.deepEqual(
    calculatePreparedImageSize(6000, 4000, Number.POSITIVE_INFINITY),
    {
      width: 6000,
      height: 4000,
      scaled: false,
    },
  );
});

test('provided QR fixtures expose expected sequence metadata and assemble', async () => {
  const ordinary = await decodeFixture('qr-1-1.png');
  const firstPart = await decodeFixture('qr-1-2.png');
  const secondPart = await decodeFixture('qr-2-2.png');

  assert.equal(ordinary.sequenceSize, -1);
  assert.equal(firstPart.sequenceId, '90');
  assert.equal(firstPart.sequenceIndex, 0);
  assert.equal(firstPart.sequenceSize, 2);
  assert.equal(secondPart.sequenceId, '90');
  assert.equal(secondPart.sequenceIndex, 1);
  assert.equal(secondPart.sequenceSize, 2);
  assert.deepEqual(Object.keys(firstPart.position).sort(), [
    'bottomLeft',
    'bottomRight',
    'topLeft',
    'topRight',
  ]);

  const started = consumeQrResult(createEmptySequence(), firstPart);
  const completed = consumeQrResult(started.sequence, secondPart);
  assert.equal(completed.completedText, firstPart.text + secondPart.text);
  assert.match(completed.completedText, /^http:\/\/wes\.casio\.com\/ncal\//);

  const parsed = parse(completed.completedText);
  assert.equal(parsed.model.name, 'fx-991CW');
  assert.equal(parsed.spreadsheet.array.length, 45);

  const reverseStarted = consumeQrResult(createEmptySequence(), secondPart);
  const reverseCompleted = consumeQrResult(reverseStarted.sequence, firstPart);
  assert.equal(reverseCompleted.completedText, completed.completedText);
});

test('six-part QR fixtures assemble by index in arbitrary scan order', async () => {
  const parts = await Promise.all(
    Array.from({ length: 6 }, (_, index) => decodeFixture(`qr-${index + 1}-6.png`)),
  );

  for (const [index, part] of parts.entries()) {
    assert.equal(part.isValid, true);
    assert.equal(part.symbology, 'QRCode');
    assert.equal(part.sequenceId, '19');
    assert.equal(part.sequenceIndex, index);
    assert.equal(part.sequenceSize, 6);
  }

  const expectedUrl = parts.map(part => part.text).join('');
  const scanOrder = [5, 1, 3, 0, 4, 2];
  let sequence = createEmptySequence();
  let completedText = null;

  for (const index of scanOrder) {
    const consumed = consumeQrResult(sequence, parts[index]);
    sequence = consumed.sequence;
    completedText = consumed.completedText;
  }

  assert.equal(completedText, expectedUrl);
  assert.match(completedText, /^http:\/\/wes\.casio\.com\/ncal\//);

  const parsed = parse(completedText);
  assert.equal(parsed.model.name, 'fx-991CW');
  assert.equal(parsed.spreadsheet.array.length, 45);
});

test('six-part image sessions sort previews and complete across batches', async () => {
  const parts = await Promise.all(
    Array.from({ length: 6 }, (_, index) => decodeFixture(`qr-${index + 1}-6.png`)),
  );
  const item = index => ({
    result: parts[index],
    preview: `qr-${index + 1}-6.png`,
  });

  const firstBatch = addQrImageResults(
    createEmptyImageSequenceSession('file'),
    [item(4), item(0), item(2)],
  );

  assert.equal(firstBatch.status, 'pending');
  assert.deepEqual(firstBatch.session.previews, [
    'qr-1-6.png',
    null,
    'qr-3-6.png',
    null,
    'qr-5-6.png',
    null,
  ]);

  const completed = addQrImageResults(
    firstBatch.session,
    [item(5), item(1), item(3)],
  );

  assert.equal(completed.status, 'complete');
  assert.equal(completed.completedText, parts.map(part => part.text).join(''));
});

test('real image fixtures from two-part and six-part sequences cannot be mixed', async () => {
  const sixPart = await decodeFixture('qr-1-6.png');
  const twoPart = await decodeFixture('qr-1-2.png');
  const mixedBatch = addQrImageResults(
    createEmptyImageSequenceSession('file'),
    [
      { result: sixPart, preview: 'qr-1-6.png' },
      { result: twoPart, preview: 'qr-1-2.png' },
    ],
  );

  assert.equal(sixPart.sequenceId, '19');
  assert.equal(twoPart.sequenceId, '90');
  assert.equal(mixedBatch.status, 'mixed');
  assert.deepEqual(mixedBatch.rejectedPreviews, [
    'qr-1-6.png',
    'qr-1-2.png',
  ]);
  assert.deepEqual(
    mixedBatch.session,
    createEmptyImageSequenceSession('file'),
  );

  const activeSixPartSession = addQrImageResults(
    createEmptyImageSequenceSession('clipboard'),
    [{ result: sixPart, preview: 'qr-1-6.png' }],
  );
  const mixedContinuation = addQrImageResults(
    activeSixPartSession.session,
    [{ result: twoPart, preview: 'qr-1-2.png' }],
  );

  assert.equal(activeSixPartSession.status, 'pending');
  assert.equal(mixedContinuation.status, 'mixed');
  assert.strictEqual(mixedContinuation.session, activeSixPartSession.session);
  assert.deepEqual(mixedContinuation.session.previews, [
    'qr-1-6.png',
    null,
    null,
    null,
    null,
    null,
  ]);
  assert.deepEqual(mixedContinuation.rejectedPreviews, ['qr-1-2.png']);
});
