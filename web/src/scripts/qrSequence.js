export function createEmptySequence() {
  return {
    sequenceId: null,
    sequenceSize: 0,
    format: null,
    parts: [],
  };
}

export function isStructuredQrResult(result) {
  return Number.isInteger(result.sequenceSize) && result.sequenceSize >= 1;
}

export function getQrSequenceIdentity(result) {
  if (!isStructuredQrResult(result)) return null;
  return `${result.format || 'QRCode'}\u0000${result.sequenceId}\u0000${result.sequenceSize}`;
}

/**
 * Consume one valid ZXing QR result.
 *
 * The returned state is immutable so it can be stored directly in component
 * state. A non-sequence QR always completes immediately and clears an
 * in-progress structured append sequence.
 */
export function consumeQrResult(current, result) {
  if (!result || result.isValid === false || typeof result.text !== 'string') {
    return {
      sequence: current,
      completedText: null,
      acceptedIndex: null,
      sequenceStarted: false,
    };
  }

  if (!isStructuredQrResult(result)) {
    return {
      sequence: createEmptySequence(),
      completedText: result.text,
      acceptedIndex: null,
      sequenceStarted: false,
    };
  }

  const { sequenceId, sequenceIndex, sequenceSize } = result;
  if (
    !Number.isInteger(sequenceIndex)
    || sequenceIndex < 0
    || sequenceIndex >= sequenceSize
  ) {
    return {
      sequence: current,
      completedText: null,
      acceptedIndex: null,
      sequenceStarted: false,
    };
  }

  const format = result.format || 'QRCode';
  const startsNewSequence = (
    current.sequenceId !== sequenceId
    || current.sequenceSize !== sequenceSize
    || current.format !== format
  );
  const next = startsNewSequence
    ? {
      sequenceId,
      sequenceSize,
      format,
      parts: Array(sequenceSize).fill(null),
    }
    : {
      ...current,
      parts: [...current.parts],
    };
  const isDuplicate = next.parts[sequenceIndex] !== null;

  if (!isDuplicate) next.parts[sequenceIndex] = result.text;

  if (next.parts.every(part => part !== null)) {
    return {
      sequence: createEmptySequence(),
      completedText: next.parts.join(''),
      acceptedIndex: isDuplicate ? null : sequenceIndex,
      sequenceStarted: startsNewSequence && sequenceSize > 1,
    };
  }

  return {
    sequence: next,
    completedText: null,
    acceptedIndex: isDuplicate ? null : sequenceIndex,
    sequenceStarted: startsNewSequence,
  };
}
