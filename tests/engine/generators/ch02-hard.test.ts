import { describe, expect, it } from 'vitest';

import { ch02Generators } from '../../../src/engine/generators/ch02';

import { mulberry32 } from '../../../src/engine/rng';

const SEEDS = 250;

// Recomputed independently of `src/engine/mathx` so a bug there cannot
// corrupt both sides of a comparison identically.

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

const wordingOf = (prompt: string) => prompt.replace(/\d+(\.\d+)?/g, '<N>');

const assertStableWording = (t: ReturnType<typeof byId>) => {
  const first = wordingOf(t.generate(mulberry32(0)).prompt);

  for (let seed = 1; seed < SEEDS; seed++) {
    expect(wordingOf(t.generate(mulberry32(seed)).prompt)).toBe(first);
  }
};

describe('ch02 committeeAtLeastOne', () => {
  const t = byId('ch02-gen-committee-at-least-one');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('total/none/at-least-one match an independent recompute, with r always <= n - k, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { n, k, r } = inst.params as Record<string, number>;

      // Guard: enough non-subgroup members exist to fill a "none from the
      // subgroup" committee, and r never exceeds the team size.
      expect(r).toBeLessThanOrEqual(n - k);

      expect(r).toBeLessThanOrEqual(n);

      const total = independentNCr(n, r);

      const none = independentNCr(n - k, r);

      const atLeastOne = total - none;

      const [partTotal, partNone, partAtLeastOne] = inst.parts;

      expect(partTotal.kind).toBe('numeric');

      expect(partNone.kind).toBe('numeric');

      expect(partAtLeastOne.kind).toBe('numeric');

      if (partTotal.kind === 'numeric') expect(partTotal.answer).toBe(total);

      if (partNone.kind === 'numeric') expect(partNone.answer).toBe(none);

      if (partAtLeastOne.kind === 'numeric') expect(partAtLeastOne.answer).toBe(atLeastOne);

      expect(atLeastOne).toBeGreaterThan(0);

      expect(atLeastOne).toBeLessThan(total);
    }
  });
});

describe('ch02 bayesThreeBranch', () => {
  const t = byId('ch02-gen-bayes-three-branch');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(defective) and P(Y|defective) match an independent recompute, with priors summing to 1, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { pX, pY, pZ, dX, dY, dZ } = inst.params as Record<string, number>;

      // Guard: the three supplier shares always partition the whole inventory.
      expect(pX + pY + pZ).toBeCloseTo(1, 10);

      // Guard: every prior and defect rate is strictly inside (0, 1).
      for (const p of [pX, pY, pZ, dX, dY, dZ]) {
        expect(p).toBeGreaterThan(0);

        expect(p).toBeLessThan(1);
      }

      const pDefective = pX * dX + pY * dY + pZ * dZ;

      const pYgivenDefective = (pY * dY) / pDefective;

      // Guard: the posterior is strictly inside (0, 1) too.
      expect(pYgivenDefective).toBeGreaterThan(0);

      expect(pYgivenDefective).toBeLessThan(1);

      const [partDefective, partPosterior] = inst.parts;

      expect(partDefective.kind).toBe('numeric');

      expect(partPosterior.kind).toBe('numeric');

      if (partDefective.kind === 'numeric')
        expect(Math.abs(partDefective.answer - pDefective)).toBeLessThanOrEqual(partDefective.tol);

      if (partPosterior.kind === 'numeric')
        expect(Math.abs(partPosterior.answer - pYgivenDefective)).toBeLessThanOrEqual(partPosterior.tol);
    }
  });
});

describe('ch02 atLeastOneDefective', () => {
  const t = byId('ch02-gen-at-least-one-defective');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(none) and P(at least one) match an independent recompute, both strictly inside (0,1), across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { n, p } = inst.params as Record<string, number>;

      expect(p).toBeGreaterThan(0);

      expect(p).toBeLessThan(1);

      const pNone = (1 - p) ** n;

      const pAtLeastOne = 1 - pNone;

      expect(pNone).toBeGreaterThan(0);

      expect(pNone).toBeLessThan(1);

      expect(pAtLeastOne).toBeGreaterThan(0);

      expect(pAtLeastOne).toBeLessThan(1);

      const [partNone, partAtLeastOne] = inst.parts;

      expect(partNone.kind).toBe('numeric');

      expect(partAtLeastOne.kind).toBe('numeric');

      if (partNone.kind === 'numeric') expect(Math.abs(partNone.answer - pNone)).toBeLessThanOrEqual(partNone.tol);

      if (partAtLeastOne.kind === 'numeric')
        expect(Math.abs(partAtLeastOne.answer - pAtLeastOne)).toBeLessThanOrEqual(partAtLeastOne.tol);
    }
  });
});

describe('ch02 sequentialNoReplacement', () => {
  const t = byId('ch02-gen-sequential-no-replacement');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('all three probabilities match an independent recompute, each strictly inside (0,1), across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { n, k } = inst.params as Record<string, number>;

      // Guard: at least 2 red balls, so the second-draw conditional stays
      // strictly positive; k is always < n so it stays strictly below 1.
      expect(k).toBeGreaterThanOrEqual(2);

      expect(k).toBeLessThan(n);

      const pFirst = k / n;

      const pSecondGivenFirst = (k - 1) / (n - 1);

      const pBoth = pFirst * pSecondGivenFirst;

      for (const p of [pFirst, pSecondGivenFirst, pBoth]) {
        expect(p).toBeGreaterThan(0);

        expect(p).toBeLessThan(1);
      }

      const [partFirst, partSecond, partBoth] = inst.parts;

      expect(partFirst.kind).toBe('numeric');

      expect(partSecond.kind).toBe('numeric');

      expect(partBoth.kind).toBe('numeric');

      if (partFirst.kind === 'numeric') expect(Math.abs(partFirst.answer - pFirst)).toBeLessThanOrEqual(partFirst.tol);

      if (partSecond.kind === 'numeric')
        expect(Math.abs(partSecond.answer - pSecondGivenFirst)).toBeLessThanOrEqual(partSecond.tol);

      if (partBoth.kind === 'numeric') expect(Math.abs(partBoth.answer - pBoth)).toBeLessThanOrEqual(partBoth.tol);
    }
  });
});
