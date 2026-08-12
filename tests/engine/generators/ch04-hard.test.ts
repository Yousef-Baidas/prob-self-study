import { describe, expect, it } from 'vitest';

import { ch04Generators } from '../../../src/engine/generators/ch04';

import { mulberry32 } from '../../../src/engine/rng';

const SEEDS = 250;

const byId = (id: string) => {
  const t = ch04Generators.find((g) => g.id === id);

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

const expectNumericParts = (
  parts: ReturnType<ReturnType<typeof byId>['generate']>['parts'],
  expected: number[],
) => {
  expect(parts.length).toBe(expected.length);

  parts.forEach((part, i) => {
    expect(part.kind).toBe('numeric');

    if (part.kind === 'numeric') expect(Math.abs(part.answer - expected[i])).toBeLessThanOrEqual(part.tol + 1e-9);
  });
};

describe('ch04 correlationCoefficient', () => {
  const t = byId('ch04-gen-correlation-coefficient');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('rho matches an independent recompute and always lands in [-1, 1], across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { v00, v01, v10, v11 } = inst.params as Record<string, number>;

      const weights = [v00, v01, v10, v11];

      for (const w of weights) expect(w).toBeGreaterThanOrEqual(1);

      const total = weights.reduce((s, w) => s + w, 0);

      const f = (x: number, y: number) => {
        if (x === 0 && y === 0) return v00 / total;

        if (x === 0 && y === 1) return v01 / total;

        if (x === 1 && y === 0) return v10 / total;

        return v11 / total;
      };

      let exy = 0;

      let muX = 0;

      let muY = 0;

      let ex2 = 0;

      let ey2 = 0;

      for (const x of [0, 1]) {
        for (const y of [0, 1]) {
          const p = f(x, y);

          exy += x * y * p;

          muX += x * p;

          muY += y * p;

          ex2 += x * x * p;

          ey2 += y * y * p;
        }
      }

      const cov = exy - muX * muY;

      const varX = ex2 - muX * muX;

      const varY = ey2 - muY * muY;

      // Guard: both marginals genuinely split their mass between 0 and 1,
      // so neither variance can be zero and the division below is safe.
      expect(varX).toBeGreaterThan(0);

      expect(varY).toBeGreaterThan(0);

      const rho = cov / Math.sqrt(varX * varY);

      expect(rho).toBeGreaterThanOrEqual(-1 - 1e-9);

      expect(rho).toBeLessThanOrEqual(1 + 1e-9);

      expectNumericParts(inst.parts, [rho]);
    }
  });
});

describe('ch04 linearVarianceCovariance', () => {
  const t = byId('ch04-gen-linear-variance-covariance');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('Var(aX - bY + c) matches Theorem 4.9 recomputed independently, and the covariance never exceeds sigmaX*sigmaY, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { sx, sy, absCov, a, b, c } = inst.params as Record<string, number>;

      // Guards: standard deviations are strictly positive, the coefficients
      // are strictly positive, and the covariance's magnitude never exceeds
      // the Cauchy-Schwarz ceiling sigmaX * sigmaY -- otherwise no real joint
      // distribution could produce it.
      expect(sx).toBeGreaterThan(0);

      expect(sy).toBeGreaterThan(0);

      expect(a).toBeGreaterThan(0);

      expect(b).toBeGreaterThan(0);

      expect(absCov).toBeGreaterThan(0);

      expect(absCov).toBeLessThanOrEqual(sx * sy);

      expect(Number.isFinite(c)).toBe(true);

      const vx = sx * sx;

      const vy = sy * sy;

      const cov = -absCov;

      // Theorem 4.9 for Z = aX + (-b)Y + c, recomputed by expanding the
      // covariance term directly rather than trusting the generator's own
      // arithmetic.
      const variance = a * a * vx + (-b) * (-b) * vy + 2 * a * -b * cov;

      expect(variance).toBeGreaterThanOrEqual(0);

      expectNumericParts(inst.parts, [variance]);
    }
  });
});

describe('ch04 chebyshevBound', () => {
  const t = byId('ch04-gen-chebyshev-bound');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('the lower and upper bounds are complementary, both in [0, 1), and k is always > 1, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { mu, sigma, k } = inst.params as Record<string, number>;

      // Guards: sigma is strictly positive (a variance-free bound is
      // meaningless), and k > 1, so the bound is genuinely informative
      // rather than vacuous (k <= 1 gives a bound of 0 or less).
      expect(sigma).toBeGreaterThan(0);

      expect(k).toBeGreaterThan(1);

      const lowerBound = 1 - 1 / (k * k);

      const upperBound = 1 / (k * k);

      expect(lowerBound).toBeGreaterThan(0);

      expect(lowerBound).toBeLessThan(1);

      expect(upperBound).toBeGreaterThan(0);

      expect(upperBound).toBeLessThan(1);

      expect(lowerBound + upperBound).toBeCloseTo(1, 10);

      // The bound depends only on k, never on mu or sigma directly --
      // that is the distribution-free property the notes make of it.
      expect(Number.isFinite(mu)).toBe(true);

      expectNumericParts(inst.parts, [lowerBound, upperBound]);
    }
  });
});
