import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { prepareZXingModule, readBarcodes } from 'zxing-wasm/reader';
import { parseUrl } from '../src/index.js';
import {
  consumeQrResult,
  createEmptySequence,
} from '../web/src/scripts/qrSequence.js';

const wasmBinary = readFileSync(
  new URL('../node_modules/zxing-wasm/dist/reader/zxing_reader.wasm', import.meta.url),
);
prepareZXingModule({ overrides: { wasmBinary } });

const qrResult = ({
  text,
  sequenceId = '',
  sequenceIndex = -1,
  sequenceSize = -1,
}) => ({
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
      text: 'ignored',
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

test('provided QR fixtures expose expected sequence metadata and assemble', async () => {
  const decode = async filename => {
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

  const ordinary = await decode('qr-1-1.png');
  const firstPart = await decode('qr-1-2.png');
  const secondPart = await decode('qr-2-2.png');

  assert.equal(ordinary.sequenceSize, -1);
  assert.equal(firstPart.sequenceId, '90');
  assert.equal(firstPart.sequenceIndex, 0);
  assert.equal(firstPart.sequenceSize, 2);
  assert.equal(secondPart.sequenceId, '90');
  assert.equal(secondPart.sequenceIndex, 1);
  assert.equal(secondPart.sequenceSize, 2);

  const started = consumeQrResult(createEmptySequence(), firstPart);
  const completed = consumeQrResult(started.sequence, secondPart);
  assert.equal(completed.completedText, firstPart.text + secondPart.text);
  assert.match(completed.completedText, /^http:\/\/wes\.casio\.com\/ncal\//);

  const parsed = parseUrl(completed.completedText, 'en');
  assert.equal(parsed.model.name, 'fx-991CW');
  assert.equal(parsed.spreadsheet.array.length, 45);

  const reverseStarted = consumeQrResult(createEmptySequence(), secondPart);
  const reverseCompleted = consumeQrResult(reverseStarted.sequence, firstPart);
  assert.equal(reverseCompleted.completedText, completed.completedText);
});
