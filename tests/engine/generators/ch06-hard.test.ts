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

const independentFactorial = (n: number): number => {
  let r = 1;

  for (let i = 2; i <= n; i++) r *= i;

  return r;
};

const independentPoissonPmf = (lambda: number, x: number): number =>
  (Math.exp(-lambda) * lambda ** x) / independentFactorial(x);

/** P(Gamma(alpha, beta) <= x) for integer alpha, via the gamma-Poisson tail
 * relationship -- the same identity ch06.ts uses, reimplemented from scratch
 * here rather than imported, so a shared bug cannot cancel out. */
const independentGammaCdf = (alpha: number, beta: number, x: number): number => {
  const lambda = x / beta;

  let tailBelow = 0;

  for (let k = 0; k < alpha; k++) tailBelow += independentPoissonPmf(lambda, k);

  return 1 - tailBelow;
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

describe('ch06 gammaPoissonCdf', () => {
  const t = byId('ch06-gen-gamma-poisson-cdf');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(X<=x) matches the gamma-Poisson relationship, cross-checked against Walpole Example 6.18', () => {
    // alpha=2, beta=1/5, x=1 -> 0.9596, the book's own worked value (rounds to 0.96).
    expect(independentGammaCdf(2, 1 / 5, 1)).toBeCloseTo(0.9596, 4);

    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { alpha, beta, x } = inst.params as Record<string, number>;

      expect(alpha).toBeGreaterThanOrEqual(2);

      expect(alpha).toBeLessThanOrEqual(5);

      expect(x).toBeGreaterThan(0);

      const probability = independentGammaCdf(alpha, beta, x);

      expect(probability).toBeGreaterThan(0);

      expect(probability).toBeLessThan(1);

      const part = inst.parts[0];

      expect(part.kind).toBe('numeric');

      if (part.kind === 'numeric') expect(Math.abs(part.answer - probability)).toBeLessThanOrEqual(part.tol);

      expectMaterialNumericParts(inst.parts);
    }
  });
});

describe('ch06 chiSquaredGammaLink', () => {
  const t = byId('ch06-gen-chi-squared-gamma-link');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('v is always even so alpha=v/2 is a positive integer, and P(X<=x) matches the gamma-Poisson relationship', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { v, alpha, beta, x } = inst.params as Record<string, number>;

      expect(v % 2).toBe(0);

      expect(alpha).toBe(v / 2);

      expect(Number.isInteger(alpha)).toBe(true);

      expect(beta).toBe(2);

      const probability = independentGammaCdf(alpha, beta, x);

      expect(probability).toBeGreaterThan(0);

      expect(probability).toBeLessThan(1);

      const part = inst.parts[0];

      expect(part.kind).toBe('numeric');

      if (part.kind === 'numeric') expect(Math.abs(part.answer - probability)).toBeLessThanOrEqual(part.tol);

      expectMaterialNumericParts(inst.parts);
    }
  });
});
