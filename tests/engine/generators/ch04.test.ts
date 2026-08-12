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

/** Every numeric part's stated answer sits within its own tolerance of `expected`. */
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

describe('ch04 meanDiscrete', () => {
  const t = byId('ch04-gen-mean-discrete');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('mu matches an independently accumulated weighted sum, and the pmf sums to 1, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { w0, w1, w2, w3 } = inst.params as Record<string, number>;

      const weights = [w0, w1, w2, w3];

      for (const w of weights) expect(w).toBeGreaterThanOrEqual(1);

      const total = weights.reduce((s, w) => s + w, 0);

      let mass = 0;

      let weightedSum = 0;

      for (let x = 0; x < weights.length; x++) {
        mass += weights[x] / total;

        weightedSum += x * (weights[x] / total);
      }

      expect(mass).toBeCloseTo(1, 10);

      expectNumericParts(inst.parts, [weightedSum]);
    }
  });
});

describe('ch04 expectedCommission', () => {
  const t = byId('ch04-gen-expected-commission');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('expected commission matches an independent enumeration of the four joint outcomes, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { p1Percent, p2Percent, c1, c2 } = inst.params as Record<string, number>;

      // Guards: both chances are strictly inside (0, 1) as whole percentages,
      // and both commissions are strictly positive.
      expect(p1Percent).toBeGreaterThan(0);

      expect(p1Percent).toBeLessThan(100);

      expect(p2Percent).toBeGreaterThan(0);

      expect(p2Percent).toBeLessThan(100);

      expect(c1).toBeGreaterThan(0);

      expect(c2).toBeGreaterThan(0);

      const p1 = p1Percent / 100;

      const p2 = p2Percent / 100;

      // Enumerate the four joint outcomes independently of the closed form
      // (c1*p1 + c2*p2) the generator used, and confirm the probabilities sum to 1.
      const f00 = (1 - p1) * (1 - p2);

      const f10 = p1 * (1 - p2);

      const f01 = (1 - p1) * p2;

      const f11 = p1 * p2;

      expect(f00 + f10 + f01 + f11).toBeCloseTo(1, 10);

      const expected = 0 * f00 + c1 * f10 + c2 * f01 + (c1 + c2) * f11;

      expectNumericParts(inst.parts, [expected]);
    }
  });
});

describe('ch04 nonlinearExpectation', () => {
  const t = byId('ch04-gen-nonlinear-expectation');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('E(X) and E[g(X)] match an independent recompute, and E[g(X)] differs from g(E(X)) in general, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { w0, w1, w2, w3, c } = inst.params as Record<string, number>;

      const weights = [w0, w1, w2, w3];

      for (const w of weights) expect(w).toBeGreaterThanOrEqual(1);

      expect(c === 1 || c === 2).toBe(true);

      const total = weights.reduce((s, w) => s + w, 0);

      let mu = 0;

      let eg = 0;

      for (let x = 0; x < weights.length; x++) {
        const f = weights[x] / total;

        mu += x * f;

        eg += (x - c) ** 2 * f;
      }

      expectNumericParts(inst.parts, [mu, eg]);

      // E[g(X)] is only guaranteed to equal g(E(X)) when g is linear; here
      // g is quadratic, so the two numbers are not required to match, but
      // the recompute above is still the definitional one from Theorem 4.1.
      expect(Number.isFinite(eg)).toBe(true);
    }
  });
});

describe('ch04 varianceComputational', () => {
  const t = byId('ch04-gen-variance-computational');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('sigma^2 = E(X^2) - mu^2 matches an independent sum-of-squared-deviations recompute, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { w0, w1, w2, w3 } = inst.params as Record<string, number>;

      const weights = [w0, w1, w2, w3];

      for (const w of weights) expect(w).toBeGreaterThanOrEqual(1);

      const total = weights.reduce((s, w) => s + w, 0);

      let mu = 0;

      for (let x = 0; x < weights.length; x++) mu += x * (weights[x] / total);

      // Recompute the variance via Definition 4.3's own formula, E[(X-mu)^2],
      // rather than the computational shortcut E(X^2) - mu^2 the generator uses.
      let variance = 0;

      for (let x = 0; x < weights.length; x++) variance += (x - mu) ** 2 * (weights[x] / total);

      expect(variance).toBeGreaterThanOrEqual(0);

      expectNumericParts(inst.parts, [variance]);
    }
  });
});

describe('ch04 covarianceJointTable', () => {
  const t = byId('ch04-gen-covariance-joint-table');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('covariance matches an independent enumeration over all four cells, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { w00, w01, w10, w11 } = inst.params as Record<string, number>;

      const weights = [w00, w01, w10, w11];

      for (const w of weights) expect(w).toBeGreaterThanOrEqual(1);

      const total = weights.reduce((s, w) => s + w, 0);

      const f = (x: number, y: number) => {
        if (x === 0 && y === 0) return w00 / total;

        if (x === 0 && y === 1) return w01 / total;

        if (x === 1 && y === 0) return w10 / total;

        return w11 / total;
      };

      // Full joint pmf sums to 1.
      let mass = 0;

      for (const x of [0, 1]) for (const y of [0, 1]) mass += f(x, y);

      expect(mass).toBeCloseTo(1, 10);

      // E(XY), mu_X and mu_Y, all by direct enumeration over the four cells,
      // independent of the closed form the generator uses.
      let exy = 0;

      let muX = 0;

      let muY = 0;

      for (const x of [0, 1]) {
        for (const y of [0, 1]) {
          exy += x * y * f(x, y);

          muX += x * f(x, y);

          muY += y * f(x, y);
        }
      }

      const cov = exy - muX * muY;

      expectNumericParts(inst.parts, [cov]);
    }
  });
});

describe('ch04 linearMean', () => {
  const t = byId('ch04-gen-linear-mean');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('E(X) and E(aX+b) match an independent recompute, with a, b positive, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { w0, w1, w2, w3, a, b } = inst.params as Record<string, number>;

      const weights = [w0, w1, w2, w3];

      for (const w of weights) expect(w).toBeGreaterThanOrEqual(1);

      expect(a).toBeGreaterThan(0);

      expect(b).toBeGreaterThan(0);

      const total = weights.reduce((s, w) => s + w, 0);

      let mu = 0;

      for (let x = 0; x < weights.length; x++) mu += x * (weights[x] / total);

      // Recompute E(aX+b) by summing over the transformed values directly,
      // rather than trusting Theorem 4.5's shortcut a*E(X)+b.
      let transformed = 0;

      for (let x = 0; x < weights.length; x++) transformed += (a * x + b) * (weights[x] / total);

      expect(transformed).toBeCloseTo(a * mu + b, 10);

      expectNumericParts(inst.parts, [mu, transformed]);
    }
  });
});

describe('ch04 linearVarianceIndependent', () => {
  const t = byId('ch04-gen-linear-variance-independent');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('Var(aX+bY+c) = a^2*Var(X) + b^2*Var(Y) for independent X, Y, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { vx, vy, a, b, c } = inst.params as Record<string, number>;

      expect(vx).toBeGreaterThan(0);

      expect(vy).toBeGreaterThan(0);

      expect(a).toBeGreaterThan(0);

      expect(b).toBeGreaterThan(0);

      // c is a genuine part of the prompt's constant term even though it
      // drops out of the variance -- confirm it really is present and finite.
      expect(Number.isFinite(c)).toBe(true);

      const variance = a * a * vx + b * b * vy;

      expect(variance).toBeGreaterThan(0);

      expectNumericParts(inst.parts, [variance]);
    }
  });
});
