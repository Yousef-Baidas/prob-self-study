import { describe, expect, it } from 'vitest';

import { ch02Generators } from '../../../src/engine/generators/ch02';

import { mulberry32 } from '../../../src/engine/rng';

import { nPr, nCr } from '../../../src/engine/mathx';

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

      if (part.kind === 'numeric') expect(part.answer).toBe(nPr(n, r));
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

      if (part.kind === 'numeric') expect(part.answer).toBe(nCr(n, r));
    }
  });
});
