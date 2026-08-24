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

describe('ch04 nonlinearGSensor', () => {
  const t = byId('ch04-gen-nonlinear-g-sensor');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('E[g(X)] matches an independent recompute over the signed-error support, and the tf answer matches whether it equals [E(X)]^2, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { w0, w1, w2, w3, w4 } = inst.params as Record<string, number>;

      const weights = [w0, w1, w2, w3, w4];

      for (const w of weights) expect(w).toBeGreaterThanOrEqual(1);

      const values = [-2, -1, 0, 1, 2];

      const total = weights.reduce((s, w) => s + w, 0);

      let mu = 0;

      let eg = 0;

      for (let i = 0; i < values.length; i++) {
        const f = weights[i] / total;

        mu += values[i] * f;

        eg += values[i] * values[i] * f;
      }

      const numericPart = inst.parts[0];

      expect(numericPart.kind).toBe('numeric');

      if (numericPart.kind === 'numeric') {
        expect(Math.abs(numericPart.answer - eg)).toBeLessThanOrEqual(numericPart.tol + 1e-9);
      }

      const tfPart = inst.parts[1];

      expect(tfPart.kind).toBe('tf');

      // Round the same way the generator does before comparing equality --
      // otherwise a genuine near-miss at 4dp could disagree with the
      // generator's own (correct) rounded judgement.
      const round4 = (x: number) => Math.round(x * 10000) / 10000;

      if (tfPart.kind === 'tf') expect(tfPart.answer).toBe(Math.abs(round4(eg) - round4(mu * mu)) < 1e-9);
    }
  });
});

describe('ch04 linearVarianceTrapMcq', () => {
  const t = byId('ch04-gen-linear-variance-trap-mcq');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('the mcq answer index points at Theorem 4.9 recomputed independently, and every distractor differs from it, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { vx, vy, a, b, cov } = inst.params as Record<string, number>;

      expect(vx).toBeGreaterThan(0);

      expect(vy).toBeGreaterThan(0);

      expect(a).toBeGreaterThan(0);

      expect(b).toBeGreaterThan(0);

      expect(cov).not.toBe(0);

      const correct = a * a * vx + b * b * vy + 2 * a * b * cov;

      const part = inst.parts[0];

      expect(part.kind).toBe('mcq');

      if (part.kind !== 'mcq') return;

      expect(part.answer).toBe(0);

      expect(part.choices[part.answer]).toContain(String(correct));

      // Every distractor is textually distinct from the correct choice, so
      // no two answer options collapse onto the same number.
      const distinctChoices = new Set(part.choices);

      expect(distinctChoices.size).toBe(part.choices.length);
    }
  });
});
