import { describe, expect, test } from 'vitest';
import { buildSearch, resolveSeed } from '../../src/run/core';

// resolveSeed is the deliberate version of what `parseSeed(x) ?? rollSeed()` did
// incidentally: an unreadable seed is replaced rather than fatal, and the caller
// is told it happened so the link can be rewritten and shared again.

const never = () => {
  throw new Error('roll() should not have been called');
};

describe('resolveSeed', () => {
  test('preserves a valid seed exactly', () => {
    expect(resolveSeed('12345', never)).toBe(12345);
  });

  test('rolls a seed when none was supplied', () => {
    expect(resolveSeed(null, () => 777)).toBe(777);
  });

  test('replaces an unreadable seed rather than failing', () => {
    expect(resolveSeed('abc', () => 777)).toBe(777);
  });

  test('replaces an out-of-range seed', () => {
    expect(resolveSeed('4294967296', () => 777)).toBe(777);
  });

  test('accepts both ends of the valid range', () => {
    expect(resolveSeed('0', never)).toBe(0);
    expect(resolveSeed('4294967295', never)).toBe(4294967295);
  });
});

describe('buildSearch', () => {
  test('sets a parameter that was missing', () => {
    expect(buildSearch('?chapter=probability', { seed: '42' })).toBe('?chapter=probability&seed=42');
  });

  test('replaces a parameter that was present', () => {
    expect(buildSearch('?chapter=probability&seed=1', { seed: '42' })).toBe(
      '?chapter=probability&seed=42',
    );
  });

  test('removes a parameter when given null', () => {
    // Drill trades its submitted topic key for explicit chapter and topic.
    expect(buildSearch('?tk=probability%3A%3ABayes', { tk: null, chapter: 'probability' })).toBe(
      '?chapter=probability',
    );
  });

  test('leaves unrelated parameters untouched', () => {
    expect(buildSearch('?chapter=intro&count=8', { seed: '42' })).toBe(
      '?chapter=intro&count=8&seed=42',
    );
  });

  test('works from an empty search string', () => {
    expect(buildSearch('', { seed: '42' })).toBe('?seed=42');
  });
});
