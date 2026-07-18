import { describe, it, expect } from 'vitest';
import { rollSeed, parseSeed, coerceCount } from '../../src/lib/seed';

describe('parseSeed', () => {
  it('parses a valid uint32', () => expect(parseSeed('8412')).toBe(8412));
  it('rejects non-digits', () => expect(parseSeed('abc')).toBeNull());
  it('rejects null', () => expect(parseSeed(null)).toBeNull());
  it('rejects negatives and overflow', () => {
    expect(parseSeed('-1')).toBeNull();
    expect(parseSeed('4294967296')).toBeNull(); // 2^32
  });
});

describe('coerceCount', () => {
  it('parses in range', () => expect(coerceCount('10')).toBe(10));
  it('defaults on garbage/null', () => {
    expect(coerceCount('abc')).toBe(10);
    expect(coerceCount(null)).toBe(10);
  });
  it('clamps to [1,50]', () => {
    expect(coerceCount('0')).toBe(1);
    expect(coerceCount('999')).toBe(50);
  });
});

describe('rollSeed', () => {
  it('returns an integer in [0, 2^32)', () => {
    const s = rollSeed();
    expect(Number.isInteger(s)).toBe(true);
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(0xffffffff);
  });
});
