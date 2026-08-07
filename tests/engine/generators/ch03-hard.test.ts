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
