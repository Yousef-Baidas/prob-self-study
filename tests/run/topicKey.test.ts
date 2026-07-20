import { describe, expect, test } from 'vitest';
import { decodeTopicKey, encodeTopicKey } from '../../src/run/topicKey';

// A drill setup form submits chapter and topic as one value because a single
// HTML <select> can only carry one value per name. Encode and decode are two
// halves of one format, so they live together and are tested together.

describe('encodeTopicKey', () => {
  test('joins a chapter and topic into one submittable value', () => {
    expect(encodeTopicKey('probability', 'Bayes theorem')).toBe('probability::Bayes theorem');
  });
});

describe('decodeTopicKey', () => {
  test('recovers the chapter and topic from an encoded key', () => {
    expect(decodeTopicKey('probability::Bayes theorem')).toEqual({
      chapter: 'probability',
      topic: 'Bayes theorem',
    });
  });

  test('round-trips every shape the form can produce', () => {
    const pairs = [
      { chapter: 'intro', topic: 'Descriptive statistics' },
      { chapter: 'probability', topic: 'Counting techniques' },
      { chapter: 'probability', topic: "Bayes' theorem" },
    ];
    for (const pair of pairs) {
      expect(decodeTopicKey(encodeTopicKey(pair.chapter, pair.topic))).toEqual(pair);
    }
  });

  test('returns null when the key is absent', () => {
    expect(decodeTopicKey(null)).toBeNull();
  });

  test('returns null when the separator is missing', () => {
    expect(decodeTopicKey('probability')).toBeNull();
  });

  test('returns null when the chapter half is empty', () => {
    expect(decodeTopicKey('::Bayes theorem')).toBeNull();
  });

  test('returns null when the topic half is empty', () => {
    expect(decodeTopicKey('probability::')).toBeNull();
  });

  test('keeps a separator that appears inside the topic', () => {
    // Splits on the first separator only, so a topic is never truncated.
    expect(decodeTopicKey('probability::odds::evens')).toEqual({
      chapter: 'probability',
      topic: 'odds::evens',
    });
  });
});
