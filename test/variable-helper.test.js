import assert from 'assert';
import Decimal from 'decimal.js';
import { test } from 'vitest';
import { decimalToDmsLatex } from '../src/variable/helper/index.js';

test('carries rounded seconds into minutes', () => {
  assert.strictEqual(
    decimalToDmsLatex(new Decimal('0.833333333333333')),
    "0^\\circ 50' 0'' ", // not 0°49' 60''
  );
});

test('carries rounded minutes into degrees', () => {
  assert.strictEqual(
    decimalToDmsLatex(new Decimal('12.999999')),
    "13^\\circ 0' 0'' ",
  );
});
