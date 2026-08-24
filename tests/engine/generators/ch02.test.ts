import { describe, expect, it } from 'vitest';

import { ch02Generators } from '../../../src/engine/generators/ch02';

import { mulberry32 } from '../../../src/engine/rng';

const SEEDS = 250;

// Recomputed independently of `src/engine/mathx` so a bug there cannot
// corrupt both sides of a comparison identically.

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

const round = (x: number, dp: number): number => {
  const f = 10 ** dp;

  return Math.round(x * f) / f;
};

const byId = (id: string) => {
  const t = ch02Generators.find((g) => g.id === id);

  if (!t) throw new Error(`missing generator ${id}`);

  return t;
};

describe('ch02 passwordMultiplication', () => {
  const t = byId('ch02-gen-password-multiplication');

  it('total count matches 26^letters * 10^digits, and the mcq names the multiplication rule, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { letters, digits } = inst.params as Record<string, number>;

      const expected = 26 ** letters * 10 ** digits;

      const [partTotal, partPrinciple] = inst.parts;

      expect(partTotal.kind).toBe('numeric');

      expect(partPrinciple.kind).toBe('mcq');

      if (partTotal.kind === 'numeric') expect(partTotal.answer).toBe(expected);

      if (partPrinciple.kind === 'mcq') expect(partPrinciple.choices[partPrinciple.answer]).toBe('Multiplication rule');

      expect(expected).toBeGreaterThan(0);
    }
  });
});

describe('ch02 permCombDiscrimination', () => {
  const t = byId('ch02-gen-perm-comb-discrimination');

  it('the tf verdict and count match an independent recompute of nPr/nCr, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { n, r, orderMatters } = inst.params as Record<string, number>;

      const expectedOrderMatters = orderMatters === 1;

      const expected = expectedOrderMatters ? independentNPr(n, r) : independentNCr(n, r);

      const [partOrder, partCount] = inst.parts;

      expect(partOrder.kind).toBe('tf');

      expect(partCount.kind).toBe('numeric');

      if (partOrder.kind === 'tf') expect(partOrder.answer).toBe(expectedOrderMatters);

      if (partCount.kind === 'numeric') expect(partCount.answer).toBe(expected);
    }
  });
});

describe('ch02 mutuallyExclusiveDiscrimination', () => {
  const t = byId('ch02-gen-mutually-exclusive-discrimination');

  it('the tf verdict matches P(A ∩ B) = 0, and P(A ∪ B) matches the additive rule, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { pA, pB, pAB, mutuallyExclusive } = inst.params as Record<string, number>;

      const expectedME = mutuallyExclusive === 1;

      expect(pAB === 0).toBe(expectedME);

      const expectedUnion = round(pA + pB - pAB, 4);

      expect(expectedUnion).toBeGreaterThan(0);

      const [partME, partUnion] = inst.parts;

      expect(partME.kind).toBe('tf');

      expect(partUnion.kind).toBe('numeric');

      if (partME.kind === 'tf') expect(partME.answer).toBe(expectedME);

      if (partUnion.kind === 'numeric') expect(Math.abs(partUnion.answer - expectedUnion)).toBeLessThanOrEqual(partUnion.tol);
    }
  });
});

describe('ch02 complementVsDirect', () => {
  const t = byId('ch02-gen-complement-vs-direct');

  it('picks the complement-rule choice, and P(at least one) matches an independent recompute, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { n, p } = inst.params as Record<string, number>;

      expect(p).toBeGreaterThan(0);

      expect(p).toBeLessThan(1);

      const pNone = round((1 - p) ** n, 4);

      const pAtLeastOne = round(1 - pNone, 4);

      expect(pAtLeastOne).toBeGreaterThan(0);

      expect(pAtLeastOne).toBeLessThan(1);

      const [partChoice, partAnswer] = inst.parts;

      expect(partChoice.kind).toBe('mcq');

      expect(partAnswer.kind).toBe('numeric');

      if (partChoice.kind === 'mcq') expect(partChoice.choices[partChoice.answer]).toMatch(/Complement rule/);

      if (partAnswer.kind === 'numeric')
        expect(Math.abs(partAnswer.answer - pAtLeastOne)).toBeLessThanOrEqual(partAnswer.tol);
    }
  });
});

describe('ch02 findTheErrorAdditive', () => {
  const t = byId('ch02-gen-find-the-error-additive');

  it('always flags the shown work as wrong, and the correct P(A ∪ B) matches the additive rule, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { pA, pB, pAB } = inst.params as Record<string, number>;

      // Guard: same overlap discipline as additiveRuleBasic -- the overlap
      // is always a proper subset of both events.
      expect(pAB).toBeLessThan(Math.min(pA, pB));

      const correct = round(pA + pB - pAB, 4);

      expect(correct).toBeGreaterThan(0);

      expect(correct).toBeLessThan(1);

      // Guard: the flawed sum shown to the student is always strictly larger
      // than the true P(A ∪ B) -- that's the whole point of the question.
      expect(pA + pB).toBeGreaterThan(correct);

      const [partCorrectness, partCorrect] = inst.parts;

      expect(partCorrectness.kind).toBe('tf');

      expect(partCorrect.kind).toBe('numeric');

      if (partCorrectness.kind === 'tf') expect(partCorrectness.answer).toBe(false);

      if (partCorrect.kind === 'numeric') expect(Math.abs(partCorrect.answer - correct)).toBeLessThanOrEqual(partCorrect.tol);
    }
  });
});

describe('ch02 conditionalBasicTable', () => {
  const t = byId('ch02-gen-conditional-basic-table');

  it('P(corrupted | late) matches a direct recompute, always strictly inside (0,1), across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { lateCount, corruptLate } = inst.params as Record<string, number>;

      expect(corruptLate).toBeGreaterThanOrEqual(1);

      expect(corruptLate).toBeLessThanOrEqual(lateCount);

      const expected = round(corruptLate / lateCount, 4);

      const [part] = inst.parts;

      expect(part.kind).toBe('numeric');

      if (part.kind === 'numeric') expect(Math.abs(part.answer - expected)).toBeLessThanOrEqual(part.tol);
    }
  });
});

describe('ch02 productRuleForward', () => {
  const t = byId('ch02-gen-product-rule-forward');

  it('P(both) matches the product rule, comfortably above the degenerate-answer floor, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { p1, p2given1 } = inst.params as Record<string, number>;

      const expected = round(p1 * p2given1, 4);

      expect(expected).toBeGreaterThan(0.6);

      const [part] = inst.parts;

      expect(part.kind).toBe('numeric');

      if (part.kind === 'numeric') expect(Math.abs(part.answer - expected)).toBeLessThanOrEqual(part.tol);
    }
  });
});

describe('ch02 productRuleInverse', () => {
  const t = byId('ch02-gen-product-rule-inverse');

  it('the missing factor recovers pA within the double-rounding tolerance, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { pA, pCondGiven } = inst.params as Record<string, number>;

      const pIntersect = round(pA * pCondGiven, 4);

      const expected = round(pIntersect / pCondGiven, 4);

      const [part] = inst.parts;

      expect(part.kind).toBe('numeric');

      if (part.kind === 'numeric') {
        expect(Math.abs(part.answer - expected)).toBeLessThanOrEqual(part.tol);

        // Guard: the round-trip through the 4dp display never drifts far
        // from the original sampled pA (verified numerically up to 0.002).
        expect(Math.abs(part.answer - pA)).toBeLessThan(0.005);
      }
    }
  });
});

describe('ch02 bayesEasyTotal', () => {
  const t = byId('ch02-gen-bayes-easy-total');

  it('P(positive) matches the theorem of total probability, comfortably above the degenerate-answer floor, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { pA, pB, dA, dB } = inst.params as Record<string, number>;

      expect(round(pA + pB, 10)).toBe(1);

      const expected = round(pA * dA + pB * dB, 4);

      expect(expected).toBeGreaterThan(0.02);

      const [part] = inst.parts;

      expect(part.kind).toBe('numeric');

      if (part.kind === 'numeric') expect(Math.abs(part.answer - expected)).toBeLessThanOrEqual(part.tol);
    }
  });
});

describe('ch02 bayesInversePrior', () => {
  const t = byId('ch02-gen-bayes-inverse-prior');

  it('recovers the sampled prior x0 within the double-rounding tolerance, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { x0, l1, l2 } = inst.params as Record<string, number>;

      const pExact = (x0 * l1) / (x0 * l1 + (1 - x0) * l2);

      const p = round(pExact, 4);

      const expected = round((p * l2) / (l1 * (1 - p) + p * l2), 4);

      const [part] = inst.parts;

      expect(part.kind).toBe('numeric');

      if (part.kind === 'numeric') {
        expect(Math.abs(part.answer - expected)).toBeLessThanOrEqual(part.tol);

        // Guard: the round-trip through the 4dp posterior display never
        // drifts far from the original sampled prior (verified numerically
        // up to 0.003).
        expect(Math.abs(part.answer - x0)).toBeLessThan(0.006);
      }
    }
  });
});
