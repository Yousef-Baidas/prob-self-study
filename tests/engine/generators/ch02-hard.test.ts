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

const independentFactorial = (n: number): number => {
  let f = 1;

  for (let i = 2; i <= n; i++) f *= i;

  return f;
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

describe('ch02 additiveRuleBasic', () => {
  const t = byId('ch02-gen-additive-rule-basic');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(A ∪ B) matches a direct recompute, with A ∩ B always a proper subset of both A and B, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { pA, pB, pAB } = inst.params as Record<string, number>;

      // Guard: the overlap never equals or exceeds either individual event,
      // so the question is never a degenerate "A ⊆ B" or "B ⊆ A" case.
      expect(pAB).toBeLessThan(Math.min(pA, pB));

      const answer = pA + pB - pAB;

      expect(answer).toBeGreaterThan(0);

      expect(answer).toBeLessThan(1);

      const [part] = inst.parts;

      expect(part.kind).toBe('numeric');

      if (part.kind === 'numeric') expect(Math.abs(part.answer - answer)).toBeLessThanOrEqual(part.tol);
    }
  });
});

describe('ch02 additiveRuleCounts', () => {
  const t = byId('ch02-gen-additive-rule-counts');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(A), P(B), and P(A ∪ B) match an independent recompute from the region counts, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { onlyA, onlyB, both, extra } = inst.params as Record<string, number>;

      const a = onlyA + both;

      const b = onlyB + both;

      const N = onlyA + onlyB + both + extra;

      // Guard: the overlap is always a proper subset of each group.
      expect(both).toBeLessThan(Math.min(a, b));

      const pA = a / N;

      const pB = b / N;

      const pAB = both / N;

      const pUnion = pA + pB - pAB;

      for (const p of [pA, pB, pUnion]) {
        expect(p).toBeGreaterThan(0);

        expect(p).toBeLessThan(1);
      }

      const [partA, partB, partUnion] = inst.parts;

      expect(partA.kind).toBe('numeric');

      expect(partB.kind).toBe('numeric');

      expect(partUnion.kind).toBe('numeric');

      if (partA.kind === 'numeric') expect(Math.abs(partA.answer - pA)).toBeLessThanOrEqual(partA.tol);

      if (partB.kind === 'numeric') expect(Math.abs(partB.answer - pB)).toBeLessThanOrEqual(partB.tol);

      if (partUnion.kind === 'numeric') expect(Math.abs(partUnion.answer - pUnion)).toBeLessThanOrEqual(partUnion.tol);
    }
  });
});

describe('ch02 sampleSpaceBasic', () => {
  const t = byId('ch02-gen-sample-space-basic');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('total sample points and P(warm) match a brute-force enumeration of the color/size grid, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { colors, sizes, warmColors } = inst.params as Record<string, number>;

      // Guard: warmColors is always a proper, nonempty subset of colors.
      expect(warmColors).toBeGreaterThanOrEqual(1);

      expect(warmColors).toBeLessThan(colors);

      let total = 0;

      let favorable = 0;

      for (let c = 1; c <= colors; c++) {
        for (let s = 1; s <= sizes; s++) {
          total++;

          if (c <= warmColors) favorable++;
        }
      }

      const answer = favorable / total;

      expect(answer).toBeGreaterThan(0);

      expect(answer).toBeLessThan(1);

      const [partTotal, partAnswer] = inst.parts;

      expect(partTotal.kind).toBe('numeric');

      expect(partAnswer.kind).toBe('numeric');

      if (partTotal.kind === 'numeric') expect(partTotal.answer).toBe(total);

      if (partAnswer.kind === 'numeric') expect(Math.abs(partAnswer.answer - answer)).toBeLessThanOrEqual(partAnswer.tol);
    }
  });
});

describe('ch02 sampleSpaceComplement', () => {
  const t = byId('ch02-gen-sample-space-complement');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(A) matches a brute-force enumeration of the 36-point dice sample space, and P(A) + P(A′) = 1 exactly, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { k } = inst.params as Record<string, number>;

      // Guard: k stays inside the possible-sum range with margin, so the
      // brute-force count is never 0 or 36.
      expect(k).toBeGreaterThanOrEqual(5);

      expect(k).toBeLessThanOrEqual(9);

      let count = 0;

      for (let i = 1; i <= 6; i++) {
        for (let j = 1; j <= 6; j++) {
          if (i + j >= k) count++;
        }
      }

      expect(count).toBeGreaterThan(0);

      expect(count).toBeLessThan(36);

      const pA = count / 36;

      const [partA, partComplement] = inst.parts;

      expect(partA.kind).toBe('numeric');

      expect(partComplement.kind).toBe('numeric');

      if (partA.kind === 'numeric') expect(Math.abs(partA.answer - pA)).toBeLessThanOrEqual(partA.tol);

      // Guard: because P(A') is derived as 1 - P(A) from the displayed P(A)
      // (not independently rounded from (36 - count) / 36), the two
      // displayed numbers must sum to exactly 1 -- the same class of
      // rounding mismatch that was fixed in the independence-test template.
      if (partA.kind === 'numeric' && partComplement.kind === 'numeric') {
        expect(partA.answer + partComplement.answer).toBe(1);
      }
    }
  });
});

describe('ch02 inclusionExclusionThree', () => {
  const t = byId('ch02-gen-inclusion-exclusion-three');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(A∩B∩C) recomputed from the additive rule matches the answer, and stays inside every pairwise overlap it was built from', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { pA, pB, pC, pAB, pAC, pBC, pUnion } = inst.params as Record<string, number>;

      const answer = pUnion - pA - pB - pC + pAB + pAC + pBC;

      const [part] = inst.parts;

      expect(part.kind).toBe('numeric');

      if (part.kind === 'numeric') expect(Math.abs(part.answer - answer)).toBeLessThanOrEqual(part.tol);

      // Guard: never negative, never trivially zero, and never bigger than any
      // pairwise overlap it is a subset of.
      expect(answer).toBeGreaterThan(0);

      expect(answer).toBeLessThanOrEqual(pAB + 1e-9);

      expect(answer).toBeLessThanOrEqual(pAC + 1e-9);

      expect(answer).toBeLessThanOrEqual(pBC + 1e-9);

      for (const p of [pA, pB, pC, pAB, pAC, pBC, pUnion]) {
        expect(p).toBeGreaterThan(0);

        expect(p).toBeLessThan(1);
      }
    }
  });
});

describe('ch02 hypergeometricAtLeastOne', () => {
  const t = byId('ch02-gen-hypergeometric-at-least-one');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(none) and P(at least one) match an independent hypergeometric recompute, with n always <= N - d - 1', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { N, d, n } = inst.params as Record<string, number>;

      // Guard: at least one spare good board beyond an all-good sample of size
      // n -- n = N - d exactly drives P(none) below the 4dp display
      // resolution (see ch02-gen-hypergeometric-at-least-one comment), so a
      // margin of at least 1 is required, not just n <= N - d.
      expect(n).toBeLessThanOrEqual(N - d - 1);

      const pNone = independentNCr(N - d, n) / independentNCr(N, n);

      const pAtLeastOne = 1 - pNone;

      expect(pNone).toBeGreaterThan(0);

      expect(pNone).toBeLessThan(1);

      expect(pAtLeastOne).toBeGreaterThan(0);

      expect(pAtLeastOne).toBeLessThan(1);

      const [partNone, partAtLeastOne] = inst.parts;

      expect(partNone.kind).toBe('numeric');

      expect(partAtLeastOne.kind).toBe('numeric');

      if (partNone.kind === 'numeric') {
        expect(Math.abs(partNone.answer - pNone)).toBeLessThanOrEqual(partNone.tol);

        // Guard: the *displayed* (rounded) probabilities must themselves stay
        // strictly inside (0, 1) -- a true probability of 0.00003 still
        // rounds to a displayed 0.0000, which visibly contradicts "at least
        // one defective" being a real possibility.
        expect(partNone.answer).toBeGreaterThan(0);

        expect(partNone.answer).toBeLessThan(1);
      }

      if (partAtLeastOne.kind === 'numeric') {
        expect(Math.abs(partAtLeastOne.answer - pAtLeastOne)).toBeLessThanOrEqual(partAtLeastOne.tol);

        expect(partAtLeastOne.answer).toBeGreaterThan(0);

        expect(partAtLeastOne.answer).toBeLessThan(1);
      }
    }
  });
});

describe('ch02 setIdentityDeMorgan', () => {
  const t = byId('ch02-gen-set-identity-demorgan');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(A ∪ B) via the additive rule and P(neither) via De Morgan both match an independent recompute, and agree with each other', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { onlyA, onlyB, both, neither } = inst.params as Record<string, number>;

      const N = onlyA + onlyB + both + neither;

      const pA = (onlyA + both) / N;

      const pB = (onlyB + both) / N;

      const pAB = both / N;

      const pUnion = pA + pB - pAB;

      const pNeither = neither / N;

      const [partUnion, partNeither] = inst.parts;

      expect(partUnion.kind).toBe('numeric');

      expect(partNeither.kind).toBe('numeric');

      if (partUnion.kind === 'numeric') expect(Math.abs(partUnion.answer - pUnion)).toBeLessThanOrEqual(partUnion.tol);

      if (partNeither.kind === 'numeric')
        expect(Math.abs(partNeither.answer - pNeither)).toBeLessThanOrEqual(partNeither.tol);

      // De Morgan: P((A ∪ B)') must equal 1 - P(A ∪ B), which must equal the
      // directly-counted "neither" fraction.
      expect(Math.abs(1 - pUnion - pNeither)).toBeLessThan(1e-9);

      for (const p of [pA, pB, pAB, pUnion, pNeither]) {
        expect(p).toBeGreaterThan(0);

        expect(p).toBeLessThan(1);
      }
    }
  });
});

describe('ch02 sampleSpaceTree', () => {
  const t = byId('ch02-gen-sample-space-tree');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('total sample points and P(premium) match an independent recompute, with premium always a proper subset of every grade count', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { m, g1, g2, premium1, premium2 } = inst.params as Record<string, number>;

      // Guard: premium counts are always strictly less than the grade counts
      // they're drawn from.
      expect(premium1).toBeGreaterThanOrEqual(1);

      expect(premium1).toBeLessThan(g1);

      expect(premium2).toBeGreaterThanOrEqual(1);

      expect(premium2).toBeLessThan(g2);

      const total = g1 + (m - 1) * g2;

      const premium = premium1 + (m - 1) * premium2;

      const answer = premium / total;

      expect(answer).toBeGreaterThan(0);

      expect(answer).toBeLessThan(1);

      const [partTotal, partAnswer] = inst.parts;

      expect(partTotal.kind).toBe('numeric');

      expect(partAnswer.kind).toBe('numeric');

      if (partTotal.kind === 'numeric') expect(partTotal.answer).toBe(total);

      if (partAnswer.kind === 'numeric') expect(Math.abs(partAnswer.answer - answer)).toBeLessThanOrEqual(partAnswer.tol);
    }
  });
});

describe('ch02 circularAdjacent', () => {
  const t = byId('ch02-gen-circular-adjacent');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('total, together, and P(together) match an independent recompute, and P(together) equals the closed form 2/(n-1)', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { n } = inst.params as Record<string, number>;

      expect(n).toBeGreaterThanOrEqual(3);

      const total = independentFactorial(n - 1);

      const together = 2 * independentFactorial(n - 2);

      const answer = together / total;

      expect(Math.abs(answer - 2 / (n - 1))).toBeLessThan(1e-9);

      expect(answer).toBeGreaterThan(0);

      expect(answer).toBeLessThan(1);

      const [partTotal, partTogether, partAnswer] = inst.parts;

      expect(partTotal.kind).toBe('numeric');

      expect(partTogether.kind).toBe('numeric');

      expect(partAnswer.kind).toBe('numeric');

      if (partTotal.kind === 'numeric') expect(partTotal.answer).toBe(total);

      if (partTogether.kind === 'numeric') expect(partTogether.answer).toBe(together);

      if (partAnswer.kind === 'numeric') expect(Math.abs(partAnswer.answer - answer)).toBeLessThanOrEqual(partAnswer.tol);
    }
  });
});

describe('ch02 partitionCells', () => {
  const t = byId('ch02-gen-partition-cells');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('the multinomial coefficient matches an independent recompute, with every cell size positive', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { n1, n2, n3 } = inst.params as Record<string, number>;

      for (const size of [n1, n2, n3]) expect(size).toBeGreaterThanOrEqual(2);

      const n = n1 + n2 + n3;

      const answer = independentFactorial(n) / (independentFactorial(n1) * independentFactorial(n2) * independentFactorial(n3));

      const [part] = inst.parts;

      expect(part.kind).toBe('numeric');

      if (part.kind === 'numeric') expect(part.answer).toBe(answer);

      expect(answer).toBeGreaterThan(0);
    }
  });
});

describe('ch02 independenceTest', () => {
  const t = byId('ch02-gen-independence-test');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(A∩B), P(A)P(B), and the independence verdict match an independent recompute, using exact integer comparison for the verdict', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { a, b, c, d } = inst.params as Record<string, number>;

      for (const count of [a, b, c, d]) expect(count).toBeGreaterThanOrEqual(3);

      const N = a + b + c + d;

      const pA = (a + b) / N;

      const pB = (a + c) / N;

      const pAB = a / N;

      const independent = a * N === (a + b) * (a + c);

      const [partAB, partProduct, partVerdict] = inst.parts;

      expect(partAB.kind).toBe('numeric');

      expect(partProduct.kind).toBe('numeric');

      expect(partVerdict.kind).toBe('tf');

      if (partAB.kind === 'numeric') expect(Math.abs(partAB.answer - pAB)).toBeLessThanOrEqual(partAB.tol);

      if (partProduct.kind === 'numeric')
        expect(Math.abs(partProduct.answer - pA * pB)).toBeLessThanOrEqual(partProduct.tol);

      if (partVerdict.kind === 'tf') expect(partVerdict.answer).toBe(independent);

      expect(pAB).toBeGreaterThan(0);

      expect(pAB).toBeLessThan(1);

      // Guard: the solution text asserts "these match" / "these differ" based
      // on `independent`, so the *displayed* (rounded) P(A ∩ B) and P(A)P(B)
      // must actually agree exactly when independent, and disagree when not
      // -- otherwise a student comparing the two printed numbers reaches the
      // opposite conclusion from the graded verdict. This previously broke
      // when P(A)P(B) was rounded from two pre-rounded factors (pA * pB)
      // instead of from the exact unrounded product.
      if (partAB.kind === 'numeric' && partProduct.kind === 'numeric') {
        expect(partAB.answer === partProduct.answer).toBe(independent);
      }
    }
  });
});
