import { describe, expect, it } from 'vitest';

import { ch02Generators } from '../../../src/engine/generators/ch02';

import { mulberry32 } from '../../../src/engine/rng';

// Recomputed independently of `src/engine/mathx` (no factorials) so a bug in
// mathx's factorial-based nPr/nCr cannot corrupt both sides identically.

const independentNPr = (n: number, r: number): number => {
  let p = 1;

  for (let i = 0; i < r; i++) p *= n - i;

  return p;
};

const independentNCr = (n: number, r: number): number => {
  let c = 1;

  for (let i = 1; i <= r; i++) c = (c * (n - r + i)) / i;

  return Math.round(c);
};

const byId = (id: string) => {
  const t = ch02Generators.find((g) => g.id === id);

  if (!t) throw new Error(`missing generator ${id}`);

  return t;
};

// Generators record their sampled n and r in `instance.params`.
describe('ch02 permutations', () => {
  it('answer equals nPr(n, r) from the sampled params, across seeds', () => {
    const t = byId('ch02-gen-permutations');

    for (let seed = 0; seed < 50; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { n, r } = inst.params as Record<string, number>;

      const part = inst.parts[0];

      expect(part.kind).toBe('numeric');

      if (part.kind === 'numeric') expect(part.answer).toBe(independentNPr(n, r));
    }
  });
});

describe('ch02 combinations', () => {
  it('answer equals nCr(n, r) from the sampled params, across seeds', () => {
    const t = byId('ch02-gen-combinations');

    for (let seed = 0; seed < 50; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { n, r } = inst.params as Record<string, number>;

      const part = inst.parts[0];

      expect(part.kind).toBe('numeric');

      if (part.kind === 'numeric') expect(part.answer).toBe(independentNCr(n, r));
    }
  });
});
