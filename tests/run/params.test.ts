import { describe, expect, test } from 'vitest';
import { optionalEnum, optionalInt, requireSlug } from '../../src/run/params';

// The query string is the only way state reaches a runner, so every parameter
// has three distinct states: absent, present-but-invalid, and valid. Conflating
// the first two is what produced the exam-source and drill blank-page bugs, so
// each primitive is pinned against all three separately.

const SOURCES = ['book', 'generated', 'both'] as const;

describe('requireSlug', () => {
  test('accepts a slug that is in the allowed set', () => {
    expect(requireSlug('probability', ['intro', 'probability'], 'chapter')).toEqual({
      ok: true,
      value: 'probability',
    });
  });

  test('rejects an absent slug', () => {
    expect(requireSlug(null, ['intro', 'probability'], 'chapter')).toEqual({
      ok: false,
      reason: 'chapter',
    });
  });

  test('rejects a slug that is not in the allowed set', () => {
    expect(requireSlug('astrology', ['intro', 'probability'], 'chapter')).toEqual({
      ok: false,
      reason: 'chapter',
    });
  });

  test('rejects an empty string rather than treating it as absent', () => {
    expect(requireSlug('', ['intro'], 'chapter')).toEqual({ ok: false, reason: 'chapter' });
  });
});

describe('optionalEnum', () => {
  test('takes the fallback when the value is absent', () => {
    expect(optionalEnum(null, SOURCES, 'both', 'source')).toEqual({ ok: true, value: 'both' });
  });

  test('rejects a value that was supplied but is unrecognised', () => {
    expect(optionalEnum('vibes', SOURCES, 'both', 'source')).toEqual({
      ok: false,
      reason: 'source',
    });
  });

  test('keeps a supplied value that is recognised', () => {
    expect(optionalEnum('book', SOURCES, 'both', 'source')).toEqual({ ok: true, value: 'book' });
  });

  test('rejects an empty string rather than falling back', () => {
    // An empty value was still supplied; only a missing key means "no preference".
    expect(optionalEnum('', SOURCES, 'both', 'source')).toEqual({ ok: false, reason: 'source' });
  });
});

describe('optionalInt', () => {
  test('takes the fallback when the value is absent', () => {
    expect(optionalInt(null, 1, 50, 8)).toBe(8);
  });

  test('takes the fallback for a non-numeric value', () => {
    // Recovers rather than erroring, for the same reason a corrupt seed is
    // re-rolled: a bad count still yields a perfectly good run.
    expect(optionalInt('abc', 1, 50, 8)).toBe(8);
  });

  test('keeps a value inside the range', () => {
    expect(optionalInt('12', 1, 50, 8)).toBe(12);
  });

  test('clamps a value above the maximum', () => {
    expect(optionalInt('999', 1, 50, 8)).toBe(50);
  });

  test('clamps a value below the minimum', () => {
    expect(optionalInt('0', 1, 50, 8)).toBe(1);
  });

  test('takes the fallback for anything that is not plain digits', () => {
    // Inherited from the count coercion this replaced: hex, exponent and empty
    // forms are all "unreadable" rather than clever.
    expect(optionalInt('', 1, 50, 8)).toBe(8);
    expect(optionalInt('0x10', 1, 50, 8)).toBe(8);
    expect(optionalInt('1e1', 1, 50, 8)).toBe(8);
    expect(optionalInt('-5', 1, 50, 8)).toBe(8);
    expect(optionalInt('3.5', 1, 50, 8)).toBe(8);
  });
});
