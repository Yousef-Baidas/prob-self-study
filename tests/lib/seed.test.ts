import { describe, it, expect } from 'vitest';
import { rollSeed, parseSeed } from '../../src/lib/seed';

describe('parseSeed', () => {
  it('parses a valid uint32', () => expect(parseSeed('8412')).toBe(8412));
  it('rejects non-digits', () => expect(parseSeed('abc')).toBeNull());
  it('rejects null', () => expect(parseSeed(null)).toBeNull());
  it('rejects negatives and overflow', () => {
    expect(parseSeed('-1')).toBeNull();
    expect(parseSeed('4294967296')).toBeNull(); // 2^32
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
