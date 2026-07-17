import { describe, expect, it } from 'vitest';

import { mulberry32 } from '../../src/engine/rng';

describe('mulberry32', () => {
  it('is deterministic: same seed yields the same sequence', () => {
    const a = mulberry32(42);

    const b = mulberry32(42);

    const seqA = [a.next(), a.next(), a.next()];

    const seqB = [b.next(), b.next(), b.next()];

    expect(seqA).toEqual(seqB);
  });

  it('different seeds yield different sequences', () => {
    const a = mulberry32(1).next();

    const b = mulberry32(2).next();

    expect(a).not.toEqual(b);
  });

  it('next() stays in [0, 1)', () => {
    const rng = mulberry32(7);

    for (let i = 0; i < 1000; i++) {
      const x = rng.next();

      expect(x).toBeGreaterThanOrEqual(0);

      expect(x).toBeLessThan(1);
    }
  });

  it('int(min, max) is inclusive and within range', () => {
    const rng = mulberry32(9);

    const seen = new Set<number>();

    for (let i = 0; i < 2000; i++) {
      const n = rng.int(3, 6);

      expect(n).toBeGreaterThanOrEqual(3);

      expect(n).toBeLessThanOrEqual(6);

      seen.add(n);
    }

    expect(seen).toEqual(new Set([3, 4, 5, 6]));
  });

  it('pick() returns an element of the array', () => {
    const rng = mulberry32(11);

    const arr = ['a', 'b', 'c'] as const;

    for (let i = 0; i < 100; i++) expect(arr).toContain(rng.pick(arr));
  });
});
