import { describe, expect, it } from 'vitest';

import { ch06Generators } from '../../../src/engine/generators/ch06';

import { mulberry32 } from '../../../src/engine/rng';

const SEEDS = 250; // bisection-based independent Phi^-1 is comparatively slow

// Recomputed independently of both ch06.ts's own helpers and of
// `src/engine/mathx`: a numerical-integration Phi, a bisection Phi^-1, and a
// from-scratch Poisson pmf, none shared with the generator file.
const stdNormalPdf = (z: number): number => Math.exp(-(z * z) / 2) / Math.sqrt(2 * Math.PI);

const independentNormalCdf = (z: number): number => {
  const a = -8;

  if (z <= a) return 0;

  const n = 400;

  const h = (z - a) / n;

  let sum = stdNormalPdf(a) + stdNormalPdf(z);

  for (let i = 1; i < n; i++) {
    sum += (i % 2 === 0 ? 2 : 4) * stdNormalPdf(a + i * h);
  }

  return (h / 3) * sum;
};

const independentInvNormalCdf = (p: number): number => {
  let lo = -8;

  let hi = 8;

  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;

    if (independentNormalCdf(mid) < p) lo = mid;
    else hi = mid;
  }

  return (lo + hi) / 2;
};

const byId = (id: string) => {
  const t = ch06Generators.find((g) => g.id === id);

  if (!t) throw new Error(`missing generator ${id}`);

  return t;
};

const wordingOf = (prompt: string) => prompt.replace(/-?\d+(\.\d+)?/g, '<N>');

const assertStableWording = (t: ReturnType<typeof byId>) => {
  const first = wordingOf(t.generate(mulberry32(0)).prompt);

  for (let seed = 1; seed < SEEDS; seed++) {
    expect(wordingOf(t.generate(mulberry32(seed)).prompt)).toBe(first);
  }
};

const expectMaterialNumericParts = (parts: ReturnType<ReturnType<typeof byId>['generate']>['parts']) => {
  for (const part of parts) {
    if (part.kind !== 'numeric') continue;

    expect(Math.abs(part.answer)).toBeGreaterThan(part.tol * 2);
  }
};

describe('ch06 normalApplicationInverse', () => {
  const t = byId('ch06-gen-normal-application-inverse');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('z matches an independently-bisected Phi^-1 and x0 = sigma*z + mu, with the area kept outside 45-55%', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { mu, sigma, pct } = inst.params as Record<string, number>;

      // Guard: pct is drawn from 5..44 or 56..95, so |pct/100 - 0.5| >= 0.06.
      expect(Math.abs(pct / 100 - 0.5)).toBeGreaterThanOrEqual(0.06 - 1e-9);

      const p = pct / 100;

      const z = independentInvNormalCdf(p);

      const x0 = sigma * z + mu;

      const parts = inst.parts;

      expect(parts.length).toBe(2);

      expect(parts[0].kind).toBe('numeric');

      if (parts[0].kind === 'numeric') expect(Math.abs(parts[0].answer - z)).toBeLessThanOrEqual(0.01);

      expect(parts[1].kind).toBe('numeric');

      if (parts[1].kind === 'numeric') expect(Math.abs(parts[1].answer - x0)).toBeLessThanOrEqual(0.05);

      expectMaterialNumericParts(parts);
    }
  });
});

describe('ch06 normalApproxBinomialRange', () => {
  const t = byId('ch06-gen-normal-approx-binomial-range');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(x1<=X<=x2) with the continuity correction matches an independently-integrated Phi, and np, nq >= 5', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { n, p, x1, x2 } = inst.params as Record<string, number>;

      expect(n * p).toBeGreaterThanOrEqual(5);

      expect(n * (1 - p)).toBeGreaterThanOrEqual(5);

      expect(x1).toBeGreaterThanOrEqual(1);

      expect(x2).toBeLessThanOrEqual(n - 1);

      expect(x2).toBeGreaterThan(x1);

      const mu = n * p;

      const sigma = Math.sqrt(n * p * (1 - p));

      const zLo = Math.round(((x1 - 0.5 - mu) / sigma) * 100) / 100;

      const zHi = Math.round(((x2 + 0.5 - mu) / sigma) * 100) / 100;

      const probability = independentNormalCdf(zHi) - independentNormalCdf(zLo);

      const part = inst.parts[0];

      expect(part.kind).toBe('numeric');

      if (part.kind === 'numeric') expect(Math.abs(part.answer - probability)).toBeLessThanOrEqual(0.0005);

      expectMaterialNumericParts(inst.parts);
    }
  });
});

// Asserts one numeric part against an independently recomputed value, by
// position. The hard file has no bulk `expectNumericParts`, so each template
// below states the order of its own answers explicitly.
const expectNumericAt = (
  parts: ReturnType<ReturnType<typeof byId>['generate']>['parts'],
  index: number,
  expected: number,
  tolPad = 0,
) => {
  const part = parts.filter((p) => p.kind === 'numeric')[index];

  expect(part?.kind).toBe('numeric');

  if (part?.kind === 'numeric') {
    expect(Math.abs(part.answer - expected)).toBeLessThanOrEqual(part.tol + tolPad);
  }
};

describe('ch06 exponentialSeriesSystem', () => {
  const t = byId('ch06-gen-exponential-series-system');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('rates add for a series system, and the system mean falls below every component mean', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { rate1, rate2, rate3, t: time } = inst.params as Record<string, number>;

      const lambdaTotal = rate1 + rate2 + rate3;

      expectNumericAt(inst.parts, 0, lambdaTotal);

      expectNumericAt(inst.parts, 1, 1 / lambdaTotal, 0.05);

      expectNumericAt(inst.parts, 2, Math.exp(-lambdaTotal * time), 0.0005);

      // The examinable trap: a series system is worse than its worst part.
      // Adding rates means the system mean is strictly below the shortest
      // individual mean -- never the average of the three means.
      const shortestComponentMean = 1 / Math.max(rate1, rate2, rate3);

      expect(1 / lambdaTotal).toBeLessThan(shortestComponentMean);

      expectMaterialNumericParts(inst.parts);
    }
  });
});

describe('ch06 exponentialParallelRedundancy', () => {
  const t = byId('ch06-gen-exponential-parallel-redundancy');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('the redundant station always outlasts a single unit, via 1-(1-p)^2', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { lambda, t: time } = inst.params as Record<string, number>;

      const survivesOne = Math.exp(-lambda * time);

      const stationSurvives = 1 - (1 - survivesOne) ** 2;

      expectNumericAt(inst.parts, 0, survivesOne, 0.0005);

      expectNumericAt(inst.parts, 1, stationSurvives, 0.0005);

      // Parallel redundancy must help, and must not manufacture certainty.
      expect(stationSurvives).toBeGreaterThan(survivesOne);

      expect(stationSurvives).toBeLessThan(1);

      expectMaterialNumericParts(inst.parts);
    }
  });
});

describe('ch06 normalSolveMeanFromTail', () => {
  const t = byId('ch06-gen-normal-solve-mean-from-tail');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('recovers mu from a stated lower-tail percentage, with a negative z', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { sigma, lowerLimit, pct } = inst.params as Record<string, number>;

      const z = Math.round(independentInvNormalCdf(pct / 100) * 100) / 100;

      // A lower-tail percentage under 50% must give a negative z, so the mean
      // sits above the specification limit. Adding z instead of z*sigma, or
      // dropping the sign, is the classic wrong answer here.
      expect(z).toBeLessThan(0);

      expectNumericAt(inst.parts, 0, z, 0.005);

      expectNumericAt(inst.parts, 1, lowerLimit - z * sigma, 0.05);

      expect(lowerLimit - z * sigma).toBeGreaterThan(lowerLimit);

      expectMaterialNumericParts(inst.parts);
    }
  });
});

describe('ch06 normalSolveSigmaFromTail', () => {
  const t = byId('ch06-gen-normal-solve-sigma-from-tail');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('recovers sigma as the raw deviation divided by z, never the raw deviation itself', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { mu, upperLimit, pct } = inst.params as Record<string, number>;

      const z = Math.round(independentInvNormalCdf(1 - pct / 100) * 100) / 100;

      expect(z).toBeGreaterThan(0);

      expectNumericAt(inst.parts, 0, z, 0.005);

      expectNumericAt(inst.parts, 1, (upperLimit - mu) / z, 0.05);

      expectMaterialNumericParts(inst.parts);
    }
  });
});
