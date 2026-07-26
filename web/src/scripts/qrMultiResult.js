import { getQrSequenceIdentity, isStructuredQrResult, } from './qrSequence.js';

function isValidQrResult(result) {
  return (
    result
    && result.isValid !== false
    && result.symbology === 'QRCode'
    && typeof result.text === 'string'
  );
}

/**
 * Resolve the first multi-symbol read for screen, file, and clipboard scans.
 *
 * Ordinary QR codes take precedence. Structured-append QR codes are grouped
 * by identity, completed by sequence index, and prioritized by the first
 * result ZXing returned for each group.
 */
export function resolveInitialQrResults(results) {
  const valid = results.filter(isValidQrResult);
  if (!valid.length) return { status: 'empty', results: [] };

  const ordinary = valid.find(result => !isStructuredQrResult(result));
  if (ordinary) {
    return {
      status: 'complete',
      kind: 'ordinary',
      text: ordinary.text,
      results: [ordinary],
    };
  }

  const groups = new Map();
  for (const result of valid) {
    if (
      !Number.isInteger(result.sequenceIndex)
      || result.sequenceIndex < 0
      || result.sequenceIndex >= result.sequenceSize
    ) {
      continue;
    }

    const identity = getQrSequenceIdentity(result);
    if (!groups.has(identity)) {
      groups.set(identity, {
        sequenceSize: result.sequenceSize,
        parts: Array(result.sequenceSize).fill(null),
        results: [],
        conflicted: false,
      });
    }

    const group = groups.get(identity);
    const existing = group.parts[result.sequenceIndex];
    if (existing) {
      if (existing.text !== result.text) group.conflicted = true;
      continue;
    }
    group.parts[result.sequenceIndex] = result;
    group.results.push(result);
  }

  const orderedGroups = [...groups.values()].filter(group => group.results.length);
  const complete = orderedGroups.find(group => (
    !group.conflicted
    && group.parts.every(Boolean)
  ));
  if (complete) {
    return {
      status: 'complete',
      kind: 'sequence',
      text: complete.parts.map(result => result.text).join(''),
      results: complete.results,
    };
  }

  const partial = orderedGroups[0];
  if (!partial) return { status: 'empty', results: [] };
  return {
    status: 'partial',
    results: partial.conflicted ? [partial.results[0]] : partial.results,
  };
}
