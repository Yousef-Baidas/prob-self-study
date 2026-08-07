import { describe, expect, it } from 'vitest';

import { ch03Generators } from '../../../src/engine/generators/ch03';

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
  const t = ch03Generators.find((g) => g.id === id);

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

/** Every numeric part's stated answer sits within its own tolerance of `expected`. */
const expectNumericParts = (
  parts: ReturnType<ReturnType<typeof byId>['generate']>['parts'],
  expected: number[],
) => {
  expect(parts.length).toBe(expected.length);

  parts.forEach((part, i) => {
    expect(part.kind).toBe('numeric');

    if (part.kind === 'numeric') expect(Math.abs(part.answer - expected[i])).toBeLessThanOrEqual(part.tol);
  });
};

describe('ch03 sampleSpaceValues', () => {
  const t = byId('ch03-gen-sample-space-values');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('|S| and the fibre over X = r match an independent recompute, with r strictly inside (0, n)', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { n, r } = inst.params as Record<string, number>;

      // Guard: r names a genuinely mixed outcome, so neither count degenerates
      // to the whole sample space or to a single point.
      expect(r).toBeGreaterThan(0);

      expect(r).toBeLessThan(n);

      const points = 2 ** n;

      const mapped = independentNCr(n, r);

      expectNumericParts(inst.parts, [points, mapped]);

      // The fibre is a proper, non-empty subset of S.
      expect(mapped).toBeGreaterThan(0);

      expect(mapped).toBeLessThan(points);
    }
  });
});

describe('ch03 pmfConstant', () => {
  const t = byId('ch03-gen-pmf-constant');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('c normalises the pmf and P(X = n) is the largest mass, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { n } = inst.params as Record<string, number>;

      // Sum 1..n the long way rather than by the closed form the generator uses.
      let total = 0;

      for (let x = 1; x <= n; x++) total += x;

      const c = 1 / total;

      expectNumericParts(inst.parts, [c, n / total]);

      // The whole distribution c*x, x = 1..n, is a genuine pmf.
      let mass = 0;

      for (let x = 1; x <= n; x++) {
        expect(c * x).toBeGreaterThan(0);

        mass += c * x;
      }

      expect(mass).toBeCloseTo(1, 10);
    }
  });
});

describe('ch03 hypergeometricPmf', () => {
  const t = byId('ch03-gen-hypergeometric-pmf');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(X = x) matches an independent recompute and the full pmf sums to 1, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { total, defective, bought, x } = inst.params as Record<string, number>;

      // Guards: x defectives must actually be available and actually purchasable,
      // and the non-defective remainder must cover the rest of the purchase.
      expect(x).toBeGreaterThanOrEqual(1);

      expect(x).toBeLessThanOrEqual(defective);

      expect(x).toBeLessThanOrEqual(bought);

      expect(bought - x).toBeLessThanOrEqual(total - defective);

      const denom = independentNCr(total, bought);

      const answer = (independentNCr(defective, x) * independentNCr(total - defective, bought - x)) / denom;

      expect(answer).toBeGreaterThan(0);

      expect(answer).toBeLessThan(1);

      expectNumericParts(inst.parts, [answer]);

      // The hypergeometric pmf over every reachable count sums to 1.
      let mass = 0;

      for (let i = 0; i <= Math.min(defective, bought); i++) {
        mass += (independentNCr(defective, i) * independentNCr(total - defective, bought - i)) / denom;
      }

      expect(mass).toBeCloseTo(1, 10);
    }
  });
});

describe('ch03 discreteCdf', () => {
  const t = byId('ch03-gen-discrete-cdf');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('F(k) and P(X > k) are complementary, both strictly inside (0, 1), across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { w0, w1, w2, w3, k } = inst.params as Record<string, number>;

      const weights = [w0, w1, w2, w3];

      // Guard: every value carries positive mass, so each step of F is a real jump.
      for (const w of weights) expect(w).toBeGreaterThanOrEqual(1);

      // Guard: k is strictly inside 0..3, so neither part collapses to 0 or 1.
      expect(k).toBeGreaterThanOrEqual(1);

      expect(k).toBeLessThanOrEqual(2);

      const total = weights.reduce((s, w) => s + w, 0);

      const upTo = weights.slice(0, k + 1).reduce((s, w) => s + w, 0);

      const cdf = upTo / total;

      const above = 1 - cdf;

      expect(cdf).toBeGreaterThan(0);

      expect(cdf).toBeLessThan(1);

      expectNumericParts(inst.parts, [cdf, above]);
    }
  });
});

describe('ch03 densityConstant', () => {
  const t = byId('ch03-gen-density-constant');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('c integrates the density to 1 and the tail probability is strictly inside (0, 1), across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { b, m } = inst.params as Record<string, number>;

      // Guard: the cut point sits strictly inside the support.
      expect(m).toBeGreaterThan(0);

      expect(m).toBeLessThan(b);

      const c = 2 / (b * b);

      // Independent check that c really normalises: Riemann-sum the density.
      const steps = 20000;

      let area = 0;

      for (let i = 0; i < steps; i++) area += c * ((i + 0.5) * (b / steps)) * (b / steps);

      expect(area).toBeCloseTo(1, 6);

      const tail = 1 - (m * m) / (b * b);

      expect(tail).toBeGreaterThan(0);

      expect(tail).toBeLessThan(1);

      expectNumericParts(inst.parts, [c, tail]);
    }
  });
});

describe('ch03 densityInterval', () => {
  const t = byId('ch03-gen-density-interval');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('k normalises x^2/k over (a, b) and P(X <= d) is strictly inside (0, 1), across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { a, b, d } = inst.params as Record<string, number>;

      // Guard: the support is non-degenerate and d sits strictly inside it, so
      // the question never asks for a probability of 0 or 1.
      expect(a).toBeGreaterThan(0);

      expect(b - a).toBeGreaterThanOrEqual(2);

      expect(d).toBeGreaterThan(a);

      expect(d).toBeLessThan(b);

      const k = (b ** 3 - a ** 3) / 3;

      // Independent check: Riemann-sum x^2/k over (a, b) and expect area 1.
      const steps = 20000;

      const dx = (b - a) / steps;

      let area = 0;

      for (let i = 0; i < steps; i++) {
        const x = a + (i + 0.5) * dx;

        area += ((x * x) / k) * dx;
      }

      expect(area).toBeCloseTo(1, 6);

      const upTo = (d ** 3 - a ** 3) / (b ** 3 - a ** 3);

      expect(upTo).toBeGreaterThan(0);

      expect(upTo).toBeLessThan(1);

      expectNumericParts(inst.parts, [k, upTo]);
    }
  });
});
