import { consumeQrResult, createEmptySequence, getQrSequenceIdentity, isStructuredQrResult, } from './qrSequence.js';

export function createEmptyImageSequenceSession(source) {
  return {
    source,
    sequence: createEmptySequence(),
    previews: [],
  };
}

/**
 * Add decoded image results to an image-backed structured append session.
 *
 * `preview` is deliberately opaque so the state machine remains testable
 * without a browser. The UI passes object URLs while tests can pass strings.
 */
export function addQrImageResults(current, items) {
  if (!items.length) {
    return {
      status: 'empty',
      session: current,
      completedText: null,
      rejectedPreviews: [],
    };
  }

  const ordinary = items.find(({ result }) => !isStructuredQrResult(result));
  if (ordinary) {
    return {
      status: 'complete',
      session: null,
      completedText: ordinary.result.text,
      rejectedPreviews: items.map(item => item.preview),
    };
  }

  const identities = new Set(items.map(({ result }) => getQrSequenceIdentity(result)));
  const currentIdentity = getQrSequenceIdentity(current.sequence);
  if (currentIdentity) identities.add(currentIdentity);

  if (identities.size !== 1 || identities.has(null)) {
    return {
      status: 'mixed',
      session: current,
      completedText: null,
      rejectedPreviews: items.map(item => item.preview),
    };
  }

  let sequence = current.sequence;
  let previews = current.previews.length
    ? [...current.previews]
    : Array(items[0].result.sequenceSize).fill(null);
  const rejectedPreviews = [];

  for (const item of items) {
    const consumed = consumeQrResult(sequence, item.result);
    if (consumed.conflict) {
      return {
        status: 'mixed',
        session: current,
        completedText: null,
        rejectedPreviews: items.map(({ preview }) => preview),
      };
    }
    if (consumed.acceptedIndex === null) {
      rejectedPreviews.push(item.preview);
      continue;
    }

    previews[consumed.acceptedIndex] = item.preview;
    if (consumed.completedText !== null) {
      return {
        status: 'complete',
        session: null,
        completedText: consumed.completedText,
        rejectedPreviews,
      };
    }
    sequence = consumed.sequence;
  }

  return {
    status: 'pending',
    session: {
      ...current,
      sequence,
      previews,
    },
    completedText: null,
    rejectedPreviews,
  };
}
