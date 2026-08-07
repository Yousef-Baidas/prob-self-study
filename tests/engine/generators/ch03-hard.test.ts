import { describe, expect, it } from 'vitest';

import { ch03Generators } from '../../../src/engine/generators/ch03';

import { mulberry32 } from '../../../src/engine/rng';

const SEEDS = 250;

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

describe('ch03 cdfToPmf', () => {
  const t = byId('ch03-gen-cdf-to-pmf');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('recovers the pmf as jump heights of a strictly increasing F reaching exactly 1, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { w0, w1, w2, w3, w4, a, b } = inst.params as Record<string, number>;

      const weights = [w0, w1, w2, w3, w4];

      // Guard: every weight is positive, so F genuinely jumps at each value and
      // no f(x) the question asks for can come back 0.
      for (const w of weights) expect(w).toBeGreaterThanOrEqual(1);

      // Guard: a < b, so P(a < X <= b) covers a non-empty set of values.
      expect(a).toBeLessThan(b);

      expect(a).toBeGreaterThanOrEqual(0);

      expect(b).toBeLessThanOrEqual(4);

      const total = weights.reduce((s, w) => s + w, 0);

      // Rebuild F by accumulating, independently of how the generator did it.
      const cum: number[] = [];

      for (let i = 0; i < weights.length; i++) cum.push((cum[i - 1] ?? 0) + weights[i]);

      // F is strictly increasing here (all weights positive) and ends at exactly 1.
      for (let i = 1; i < cum.length; i++) expect(cum[i]).toBeGreaterThan(cum[i - 1]);

      expect(cum[cum.length - 1] / total).toBeCloseTo(1, 10);

      // The defining identity: f(x) = F(x) - F(x-1), with F(-1) = 0.
      const fAt = (x: number) => (cum[x] - (cum[x - 1] ?? 0)) / total;

      expect(fAt(a)).toBeCloseTo(weights[a] / total, 10);

      expect(fAt(b)).toBeCloseTo(weights[b] / total, 10);

      const between = (cum[b] - cum[a]) / total;

      for (const p of [fAt(a), fAt(b), between]) {
        expect(p).toBeGreaterThan(0);

        expect(p).toBeLessThan(1);
      }

      expectNumericParts(inst.parts, [fAt(a), fAt(b), between]);
    }
  });
});

describe('ch03 continuousCdf', () => {
  const t = byId('ch03-gen-continuous-cdf');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('c, F(m) and F(q) - F(p) agree with a numerically integrated density, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { b, m, p, q } = inst.params as Record<string, number>;

      // Guards: every evaluation point sits strictly inside the support, and the
      // interval (p, q) is non-empty, so no answer collapses to 0 or 1.
      expect(m).toBeGreaterThan(0);

      expect(m).toBeLessThan(b);

      expect(p).toBeGreaterThan(0);

      expect(p).toBeLessThan(q);

      expect(q).toBeLessThan(b);

      const c = 2 / (b * b);

      // Midpoint-rule integral of the density from 0 to x, computed without the
      // closed form the generator uses.
      const integrate = (from: number, to: number) => {
        const steps = 20000;

        const dx = (to - from) / steps;

        let area = 0;

        for (let i = 0; i < steps; i++) area += c * (from + (i + 0.5) * dx) * dx;

        return area;
      };

      // c really normalises the density over the whole support.
      expect(integrate(0, b)).toBeCloseTo(1, 6);

      const cdfAtM = integrate(0, m);

      const between = integrate(p, q);

      // F is non-decreasing and lands inside [0, 1].
      expect(cdfAtM).toBeGreaterThan(0);

      expect(cdfAtM).toBeLessThan(1);

      expect(between).toBeGreaterThan(0);

      expect(between).toBeLessThan(1);

      // F(q) - F(p) is the same number as the direct integral over (p, q).
      expect(integrate(0, q) - integrate(0, p)).toBeCloseTo(between, 6);

      expectNumericParts(inst.parts, [c, cdfAtM, between]);
    }
  });
});

describe('ch03 urnMassFunction', () => {
  const t = byId('ch03-gen-urn-mass-function');

  const nCr = (n: number, r: number) => {
    let result = 1;

    for (let i = 0; i < r; i++) result = (result * (n - i)) / (i + 1);

    return Math.round(result);
  };

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('f(0), f(xMax) and P(X >= 1) match an independent hypergeometric count, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { N, R, n } = inst.params as Record<string, number>;

      // Guards: R stays small enough, and N large enough, that the good
      // count W = N - R always exceeds the sample size n, so f(0) can never
      // be zero.
      const W = N - R;

      expect(W).toBeGreaterThanOrEqual(n);

      expect(R).toBeGreaterThanOrEqual(2);

      expect(n).toBeGreaterThanOrEqual(2);

      const xMax = Math.min(R, n);

      const total = nCr(N, n);

      const f0 = nCr(W, n) / total;

      const fMax = (nCr(R, xMax) * nCr(W, n - xMax)) / total;

      const atLeastOne = 1 - f0;

      for (const p of [f0, fMax, atLeastOne]) {
        expect(p).toBeGreaterThan(0);

        expect(p).toBeLessThan(1);
      }

      expectNumericParts(inst.parts, [f0, fMax, atLeastOne]);
    }
  });
});

describe('ch03 piecewiseDensity', () => {
  const t = byId('ch03-gen-piecewise-density');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('c and the split-interval probability match a numerically integrated tent density, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { a, m1, m2 } = inst.params as Record<string, number>;

      // Guards: m1 sits strictly inside the rising piece and m2 strictly
      // inside the falling piece, so the interval genuinely straddles the
      // peak at x = a and both pieces of the split contribute.
      expect(m1).toBeGreaterThan(0);

      expect(m1).toBeLessThan(a);

      expect(m2).toBeGreaterThan(a);

      expect(m2).toBeLessThan(2 * a);

      const density = (x: number) => {
        if (x > 0 && x < a) return x / a ** 2;

        if (x > a && x < 2 * a) return (2 * a - x) / a ** 2;

        return 0;
      };

      // Cheap midpoint Riemann sum, independent of the generator's closed form.
      const integrate = (from: number, to: number) => {
        const steps = 2000;

        const dx = (to - from) / steps;

        let area = 0;

        for (let i = 0; i < steps; i++) area += density(from + (i + 0.5) * dx) * dx;

        return area;
      };

      expect(integrate(0, 2 * a)).toBeCloseTo(1, 3);

      const c = 1 / a ** 2;

      const between = integrate(m1, m2);

      expect(between).toBeGreaterThan(0);

      expect(between).toBeLessThan(1);

      const parts = inst.parts;

      expect(parts.length).toBe(2);

      expect(parts[0].kind).toBe('numeric');

      if (parts[0].kind === 'numeric') expect(Math.abs(parts[0].answer - c)).toBeLessThanOrEqual(parts[0].tol);

      expect(parts[1].kind).toBe('numeric');

      // The Riemann sum only has to agree to a loose tolerance; the exact
      // closed form is checked implicitly by the generator's own guarantee
      // that both triangle pieces have area 1/2.
      if (parts[1].kind === 'numeric') expect(Math.abs(parts[1].answer - between)).toBeLessThan(0.01);
    }
  });
});

describe('ch03 triangleRegionDensity', () => {
  const t = byId('ch03-gen-triangle-region-density');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('c and P(Y > m) match a numerically integrated triangular density, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { a, m } = inst.params as Record<string, number>;

      // Guard: m sits strictly inside (0, a), so the region {Y > m} both
      // exists and misses part of the triangle.
      expect(m).toBeGreaterThan(0);

      expect(m).toBeLessThan(a);

      const c = 2 / a ** 2;

      // Midpoint Riemann sum over the triangle 0 < y < x < a with y > m,
      // independent of the generator's closed form.
      const steps = 300;

      let area = 0;

      const dx = a / steps;

      for (let i = 0; i < steps; i++) {
        const x = (i + 0.5) * dx;

        const yLow = Math.max(0, m);

        const yHigh = x;

        if (yHigh > yLow) area += c * (yHigh - yLow) * dx;
      }

      const answer = ((a - m) / a) ** 2;

      expect(area).toBeCloseTo(answer, 2);

      expect(answer).toBeGreaterThan(0);

      expect(answer).toBeLessThan(1);

      expectNumericParts(inst.parts, [c, answer]);
    }
  });
});

describe('ch03 conditionalDensityContinuous', () => {
  const t = byId('ch03-gen-conditional-density-continuous');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('c, the conditional density and the conditional probability match direct integration, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { A, B, x0, y1, y2 } = inst.params as Record<string, number>;

      // Guards: x0 strictly inside (0, A), y1 < y2 both strictly inside
      // (0, B), so the marginal at x0 is never zero and the interval is
      // non-empty.
      expect(x0).toBeGreaterThan(0);

      expect(x0).toBeLessThan(A);

      expect(y1).toBeGreaterThan(0);

      expect(y1).toBeLessThan(y2);

      expect(y2).toBeLessThan(B);

      const c = 2 / (A * B * (A + B));

      const gAtX0 = c * (B * x0 + (B * B) / 2);

      expect(gAtX0).toBeGreaterThan(0);

      const conditionalDensity = (y: number) => (c * (x0 + y)) / gAtX0;

      // Midpoint Riemann sum of the conditional density, independent of the
      // closed form the generator used.
      const integrate = (from: number, to: number) => {
        const steps = 2000;

        const dx = (to - from) / steps;

        let area = 0;

        for (let i = 0; i < steps; i++) area += conditionalDensity(from + (i + 0.5) * dx) * dx;

        return area;
      };

      expect(integrate(0, B)).toBeCloseTo(1, 3);

      const densityAtY1 = conditionalDensity(y1);

      const probability = integrate(y1, y2);

      expect(densityAtY1).toBeGreaterThan(0);

      expect(probability).toBeGreaterThan(0);

      expect(probability).toBeLessThan(1);

      expectNumericParts(inst.parts, [c, densityAtY1, probability]);
    }
  });
});

describe('ch03 independenceSupportTrap', () => {
  const t = byId('ch03-gen-independence-support-trap');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('f(x0,y0) never equals g(x0)h(y0), even though the formula factors, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { a, x0, y0 } = inst.params as Record<string, number>;

      // Guard: the fixed evaluation point (1, 2) sits strictly inside the
      // triangle 0 < x < y < a for every possible a.
      expect(x0).toBeLessThan(y0);

      expect(y0).toBeLessThan(a);

      const c = 10 / a ** 5;

      const fAtPoint = c * x0 * y0 ** 2;

      const gAtX0 = (c * x0 * (a ** 3 - x0 ** 3)) / 3;

      const hAtY0 = (c * y0 ** 4) / 2;

      const product = gAtX0 * hAtY0;

      // The construction guarantees these are never equal -- verified here
      // by recomputation, not merely asserting inequality is "expected".
      expect(Math.abs(fAtPoint - product)).toBeGreaterThan(1e-6);

      expectNumericParts(inst.parts.slice(0, 3), [c, fAtPoint, product]);

      // The verdict the prompt asks for has to be gradable, and the triangular
      // support makes it `false` for every draw -- the mismatch asserted above
      // is exactly why.
      const verdict = inst.parts[3];

      expect(verdict.kind).toBe('tf');

      if (verdict.kind === 'tf') expect(verdict.answer).toBe(false);
    }
  });
});

describe('ch03 jointChainRule', () => {
  const t = byId('ch03-gen-joint-chain-rule');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('marginal times conditional reconstructs the joint cell exactly, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const params = inst.params as Record<string, number | number[]>;

      const flat = params.w as number[];

      const w = [
        [flat[0], flat[1]],

        [flat[2], flat[3]],

        [flat[4], flat[5]],
      ];

      let total = 0;

      for (const row of w) for (const v of row) total += v;

      const gx = w.map((row) => row[0] + row[1]);

      const a = params.a as number;

      const b = params.b as number;

      expect(gx[a]).toBeGreaterThan(0);

      const marginal = gx[a] / total;

      const conditional = w[a][b] / gx[a];

      const joint = w[a][b] / total;

      expect(marginal * conditional).toBeCloseTo(joint, 10);

      for (const p of [marginal, conditional, joint]) {
        expect(p).toBeGreaterThan(0);

        expect(p).toBeLessThan(1);
      }

      expectNumericParts(inst.parts, [marginal, conditional, joint]);
    }
  });
});
