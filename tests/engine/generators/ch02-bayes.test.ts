import { describe, expect, it } from 'vitest';

import { ch02Generators } from '../../../src/engine/generators/ch02';

import { mulberry32 } from '../../../src/engine/rng';

const byId = (id: string) => {
  const t = ch02Generators.find((g) => g.id === id);

  if (!t) throw new Error(`missing generator ${id}`);

  return t;
};

// Generators record their sampled probabilities/counts in `instance.params`,
// so the test recomputes the posterior a different way than the generator did.
describe('ch02 bayesTwoBranch', () => {
  it('posterior matches an independent Bayes recompute, across seeds', () => {
    const t = byId('ch02-gen-bayes-two-branch');

    for (let seed = 0; seed < 50; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { pA, pEgivenA, pEgivenNotA } = inst.params as Record<string, number>;

      const pAandE = pA * pEgivenA;

      const pNotAandE = (1 - pA) * pEgivenNotA;

      const pE = pAandE + pNotAandE;

      const expected = pAandE / pE;

      const part = inst.parts[0];

      if (part.kind === 'numeric') expect(Math.abs(part.answer - expected)).toBeLessThanOrEqual(part.tol);
    }
  });
});

describe('ch02 conditionalTwoWay', () => {
  it('P(A|B) matches count-based recompute, across seeds', () => {
    const t = byId('ch02-gen-conditional-two-way');

    for (let seed = 0; seed < 50; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { aAndB, bOnly } = inst.params as Record<string, number>;

      const b = aAndB + bOnly;

      const expected = aAndB / b; // P(A|B) = n(A∩B) / n(B)

      const part = inst.parts[0];

      if (part.kind === 'numeric') expect(Math.abs(part.answer - expected)).toBeLessThanOrEqual(part.tol);
    }
  });
});
