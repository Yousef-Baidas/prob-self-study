import { describe, expect, it } from 'vitest';

import { ch05Generators } from '../../../src/engine/generators/ch05';

import { mulberry32 } from '../../../src/engine/rng';

const SEEDS = 250;

// Recomputed independently of ch05.ts's own `choose`/pmf helpers, and of
// `src/engine/mathx`, so a bug in either cannot corrupt both sides of a
// comparison identically.

const independentFactorial = (n: number): number => {
  let r = 1;

  for (let i = 2; i <= n; i++) r *= i;

  return r;
};

const independentChoose = (n: number, r: number): number => {
  if (r < 0 || r > n) return 0;

  let c = 1;

  for (let i = 0; i < r; i++) c = (c * (n - i)) / (i + 1);

  return c;
};

const independentBinomialPmf = (n: number, p: number, x: number): number =>
  independentChoose(n, x) * p ** x * (1 - p) ** (n - x);

const independentHyperPmf = (N: number, n: number, k: number, x: number): number =>
  (independentChoose(k, x) * independentChoose(N - k, n - x)) / independentChoose(N, n);

const independentPoissonPmf = (lambdaT: number, x: number): number =>
  (Math.exp(-lambdaT) * lambdaT ** x) / independentFactorial(x);

const byId = (id: string) => {
  const t = ch05Generators.find((g) => g.id === id);

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

describe('ch05 multinomialTriple', () => {
  const t = byId('ch05-gen-multinomial-triple');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('the probability matches an independent recompute, and the category weights and counts always sum correctly', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { w1, w2, w3, n, x1, x2, x3 } = inst.params as Record<string, number>;

      // Guards: the three category weights sum to the fixed denominator 12,
      // and the three sampled counts sum to n, so both probability
      // conditions are satisfied by construction.
      expect(w1 + w2 + w3).toBe(12);

      expect(x1 + x2 + x3).toBe(n);

      for (const w of [w1, w2, w3]) {
        expect(w).toBeGreaterThanOrEqual(1);
      }

      for (const x of [x1, x2, x3]) {
        expect(x).toBeGreaterThanOrEqual(1);
      }

      const coeff = independentFactorial(n) / (independentFactorial(x1) * independentFactorial(x2) * independentFactorial(x3));

      const p1 = w1 / 12;

      const p2 = w2 / 12;

      const p3 = w3 / 12;

      const answer = coeff * p1 ** x1 * p2 ** x2 * p3 ** x3;

      expect(answer).toBeGreaterThan(0);

      expect(answer).toBeLessThan(1);

      const part = inst.parts[0];

      expect(part.kind).toBe('numeric');

      if (part.kind === 'numeric') expect(Math.abs(part.answer - answer)).toBeLessThanOrEqual(part.tol);

      // Summing the multinomial distribution over every way to split n into
      // three non-negative counts reaches exactly 1 -- checked by exhaustion
      // rather than trusted from the closed form.
      let mass = 0;

      for (let a = 0; a <= n; a++) {
        for (let b = 0; b <= n - a; b++) {
          const c = n - a - b;

          const multinomialCoeff = independentFactorial(n) / (independentFactorial(a) * independentFactorial(b) * independentFactorial(c));

          mass += multinomialCoeff * p1 ** a * p2 ** b * p3 ** c;
        }
      }

      expect(mass).toBeCloseTo(1, 6);
    }
  });
});

describe('ch05 binomialApproxHypergeometric', () => {
  const t = byId('ch05-gen-binomial-approx-hypergeometric');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('the exact hypergeometric and the binomial approximation both match an independent recompute and stay close, with n/N always small', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { N, k, n, x, p0 } = inst.params as Record<string, number>;

      // Guard: the approximation this question asks about is only valid
      // because n/N is always well under the 0.05 rule of thumb.
      expect(n / N).toBeLessThan(0.05);

      // x is windowed to within 1 of the rounded mean n*p0, clamped to
      // [0, n], rather than drawn uniformly over [1, n-1]: away from the
      // mean, both exact and approximate probabilities can underflow 4dp
      // rounding at once (e.g. N=5260, k=526, n=10, p0=0.1, x=9 -> ~9e-9
      // for both), which defeats the point of comparing them.
      const meanRoundGuard = Math.round(n * p0);

      expect(x).toBeGreaterThanOrEqual(Math.max(0, meanRoundGuard - 1));

      expect(x).toBeLessThanOrEqual(Math.min(n, meanRoundGuard + 1));

      expect(k / N).toBeCloseTo(p0, 10);

      const exact = independentHyperPmf(N, n, k, x);

      const approx = independentBinomialPmf(n, p0, x);

      expect(exact).toBeGreaterThan(0);

      expect(exact).toBeLessThan(1);

      expect(approx).toBeGreaterThan(0);

      expect(approx).toBeLessThan(1);

      // The whole point of the question: exact and approximate values sit
      // close together because n/N is small.
      expect(Math.abs(exact - approx)).toBeLessThan(0.01);

      const parts = inst.parts;

      expect(parts.length).toBe(2);

      expect(parts[0].kind).toBe('numeric');

      if (parts[0].kind === 'numeric') expect(Math.abs(parts[0].answer - exact)).toBeLessThanOrEqual(parts[0].tol);

      expect(parts[1].kind).toBe('numeric');

      if (parts[1].kind === 'numeric') expect(Math.abs(parts[1].answer - approx)).toBeLessThanOrEqual(parts[1].tol);

      // Regression guard against the underflow-to-0 defect class.
      for (const part of parts) {
        if (part.kind !== 'numeric') continue;

        expect(Math.abs(part.answer)).toBeGreaterThan(part.tol * 2);
      }
    }
  });
});

describe('ch05 poissonBinomialApprox', () => {
  const t = byId('ch05-gen-poisson-binomial-approx');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('the Poisson approximation and the exact binomial both match an independent recompute and stay close, with n large and p small', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { n, p, x, mu } = inst.params as Record<string, number>;

      // Guards: this is exactly the regime the binomial-to-Poisson limit
      // theorem describes -- n large, p close to 0, np held to a moderate
      // size.
      expect(n).toBeGreaterThanOrEqual(200);

      expect(p).toBeLessThanOrEqual(0.005);

      expect(Math.abs(n * p - mu)).toBeLessThan(1e-6);

      // x is windowed to within [round(mu)-2, round(mu)+3], clamped at 0,
      // rather than drawn uniformly over [0, min(6, ceil(mu)+3)]: away from
      // the mean both the approximation and the exact value can underflow
      // 4dp rounding at once, defeating the comparison the question asks
      // students to make.
      const meanRoundGuard = Math.round(mu);

      expect(x).toBeGreaterThanOrEqual(Math.max(0, meanRoundGuard - 2));

      expect(x).toBeLessThanOrEqual(meanRoundGuard + 3);

      const approx = independentPoissonPmf(mu, x);

      const exact = independentBinomialPmf(n, p, x);

      expect(approx).toBeGreaterThan(0);

      expect(approx).toBeLessThanOrEqual(1);

      expect(exact).toBeGreaterThan(0);

      expect(exact).toBeLessThanOrEqual(1);

      // The two stay close because n is large and p is small -- the whole
      // content of Theorem 5.5.
      expect(Math.abs(approx - exact)).toBeLessThan(0.01);

      const parts = inst.parts;

      expect(parts.length).toBe(2);

      expect(parts[0].kind).toBe('numeric');

      if (parts[0].kind === 'numeric') expect(Math.abs(parts[0].answer - approx)).toBeLessThanOrEqual(parts[0].tol);

      expect(parts[1].kind).toBe('numeric');

      if (parts[1].kind === 'numeric') expect(Math.abs(parts[1].answer - exact)).toBeLessThanOrEqual(parts[1].tol);

      // Regression guard against the underflow-to-0 defect class.
      for (const part of parts) {
        if (part.kind !== 'numeric') continue;

        expect(Math.abs(part.answer)).toBeGreaterThan(part.tol * 2);
      }
    }
  });
});
