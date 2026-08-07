import { describe, expect, it } from 'vitest';

import { ch03JointGenerators } from '../../../src/engine/generators/ch03-joint';

import { mulberry32 } from '../../../src/engine/rng';

const SEEDS = 250;

const byId = (id: string) => {
  const t = ch03JointGenerators.find((g) => g.id === id);

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

/**
 * Rebuilds the 3x2 table from the flattened `params.w`, computing the total and
 * both marginals by explicit iteration rather than by the closed forms the
 * generator uses, so a mistake there cannot cancel out on both sides.
 */
const rebuild = (flat: number[]) => {
  const w = [
    [flat[0], flat[1]],

    [flat[2], flat[3]],

    [flat[4], flat[5]],
  ];

  let total = 0;

  for (const row of w) for (const v of row) total += v;

  const gx = w.map((row) => row.reduce((s, v) => s + v, 0));

  const hy = [0, 1].map((y) => w.reduce((s, row) => s + row[y], 0));

  return { w, total, gx, hy };
};

/** Every joint generator draws a table whose cells are all positive and sum to 1. */
const assertValidTable = (flat: number[]) => {
  expect(flat.length).toBe(6);

  const { w, total, gx, hy } = rebuild(flat);

  for (const v of flat) expect(v).toBeGreaterThanOrEqual(1);

  // Both marginals account for the whole distribution.
  expect(gx.reduce((s, v) => s + v, 0)).toBe(total);

  expect(hy.reduce((s, v) => s + v, 0)).toBe(total);

  // Every cell is a genuine probability strictly inside (0, 1).
  for (const row of w) {
    for (const v of row) {
      expect(v / total).toBeGreaterThan(0);

      expect(v / total).toBeLessThan(1);
    }
  }

  return { w, total, gx, hy };
};

describe('ch03 jointPmfConstant', () => {
  const t = byId('ch03-gen-joint-pmf-constant');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('c normalises the joint pmf summed the long way, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { n } = inst.params as Record<string, number>;

      // The ellipsis in "y = 1, 2, ..., n" must actually skip something.
      expect(n).toBeGreaterThanOrEqual(4);

      // Double-sum (x + y) explicitly rather than using the n(n + 4) closed form.
      let total = 0;

      for (let x = 1; x <= 2; x++) {
        for (let y = 1; y <= n; y++) total += x + y;
      }

      const c = 1 / total;

      expectNumericParts(inst.parts, [c, c * (2 + n)]);

      // The whole distribution really is a pmf.
      let mass = 0;

      for (let x = 1; x <= 2; x++) {
        for (let y = 1; y <= n; y++) {
          expect(c * (x + y)).toBeGreaterThan(0);

          mass += c * (x + y);
        }
      }

      expect(mass).toBeCloseTo(1, 10);
    }
  });
});

describe('ch03 jointTableRegion', () => {
  const t = byId('ch03-gen-joint-table-region');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('reads the right cell and sums exactly the region x + y <= 1, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const params = inst.params as Record<string, number | number[]>;

      const { w, total } = assertValidTable(params.w as number[]);

      const a = params.a as number;

      const b = params.b as number;

      expect(a).toBeGreaterThanOrEqual(0);

      expect(a).toBeLessThanOrEqual(2);

      expect(b).toBeGreaterThanOrEqual(0);

      expect(b).toBeLessThanOrEqual(1);

      // Collect the region by testing the predicate on every cell, rather than
      // by hardcoding which three cells satisfy it.
      let regionWeight = 0;

      for (let x = 0; x <= 2; x++) {
        for (let y = 0; y <= 1; y++) {
          if (x + y <= 1) regionWeight += w[x][y];
        }
      }

      const region = regionWeight / total;

      expect(region).toBeGreaterThan(0);

      expect(region).toBeLessThan(1);

      expectNumericParts(inst.parts, [w[a][b] / total, region]);
    }
  });
});

describe('ch03 marginalDistribution', () => {
  const t = byId('ch03-gen-marginal-distribution');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('g and h are the row and column totals and each is itself a pmf, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const params = inst.params as Record<string, number | number[]>;

      const { total, gx, hy } = assertValidTable(params.w as number[]);

      const a = params.a as number;

      const b = params.b as number;

      // Each marginal is a distribution in its own right.
      expect(gx.reduce((s, v) => s + v / total, 0)).toBeCloseTo(1, 10);

      expect(hy.reduce((s, v) => s + v / total, 0)).toBeCloseTo(1, 10);

      for (const v of [gx[a] / total, hy[b] / total]) {
        expect(v).toBeGreaterThan(0);

        expect(v).toBeLessThan(1);
      }

      expectNumericParts(inst.parts, [gx[a] / total, hy[b] / total]);
    }
  });
});

describe('ch03 conditionalDiscrete', () => {
  const t = byId('ch03-gen-conditional-discrete');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('each conditional divides by the marginal of the conditioning variable, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const params = inst.params as Record<string, number | number[]>;

      const { w, total, gx, hy } = assertValidTable(params.w as number[]);

      const a = params.a as number;

      const b = params.b as number;

      const xGivenY = w[a][b] / hy[b];

      const yGivenX = w[a][b] / gx[a];

      // Neither collapses: every row has two positive cells and every column three.
      for (const v of [xGivenY, yGivenX]) {
        expect(v).toBeGreaterThan(0);

        expect(v).toBeLessThan(1);
      }

      // Conditioning on Y = b gives a distribution over the three values of X.
      let column = 0;

      for (let x = 0; x <= 2; x++) column += w[x][b] / hy[b];

      expect(column).toBeCloseTo(1, 10);

      // Conditioning on X = a gives a distribution over the two values of Y.
      let row = 0;

      for (let y = 0; y <= 1; y++) row += w[a][y] / gx[a];

      expect(row).toBeCloseTo(1, 10);

      // Bayes ties the two directions together: f(x|y) h(y) = f(y|x) g(x).
      expect(xGivenY * (hy[b] / total)).toBeCloseTo(yGivenX * (gx[a] / total), 10);

      expectNumericParts(inst.parts, [xGivenY, yGivenX]);
    }
  });
});

describe('ch03 jointDensityConstant', () => {
  const t = byId('ch03-gen-joint-density-constant');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('c gives the surface volume 1 under a numerically integrated density, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { A, B, p, q } = inst.params as Record<string, number>;

      // Guards: the inner rectangle sits strictly inside the support in both
      // coordinates, so the probability never collapses to 0 or 1.
      expect(p).toBeGreaterThan(0);

      expect(p).toBeLessThan(A);

      expect(q).toBeGreaterThan(0);

      expect(q).toBeLessThan(B);

      const c = 2 / (A * B * (A + B));

      // Midpoint rule over the rectangle, computed without the closed form.
      const volume = (x1: number, y1: number) => {
        const steps = 400;

        const dx = x1 / steps;

        const dy = y1 / steps;

        let v = 0;

        for (let i = 0; i < steps; i++) {
          const x = (i + 0.5) * dx;

          for (let j = 0; j < steps; j++) v += c * (x + (j + 0.5) * dy) * dx * dy;
        }

        return v;
      };

      expect(volume(A, B)).toBeCloseTo(1, 6);

      const rect = volume(p, q);

      expect(rect).toBeGreaterThan(0);

      expect(rect).toBeLessThan(1);

      expectNumericParts(inst.parts, [c, rect]);
    }
  });
});

describe('ch03 independenceCheck', () => {
  const t = byId('ch03-gen-independence-check');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('always draws a genuinely dependent table, so the question has one answer, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const params = inst.params as Record<string, number | number[]>;

      const { w, total, gx, hy } = assertValidTable(params.w as number[]);

      const joint = w[0][0] / total;

      const product = (gx[0] / total) * (hy[0] / total);

      // The point of this generator: f(0,0) and g(0)h(0) must actually differ,
      // and by enough that a student rounding to 4 dp still sees two numbers.
      expect(joint).not.toBeCloseTo(product, 10);

      // The construction guarantees the exact size of the gap:
      //   total * w[0][0] - g(0) * h(0) = delta * (R - r0) * (C - c0),
      // with R and C the row- and column-weight sums of the product table.
      const r0 = params.r0 as number;

      const r1 = params.r1 as number;

      const r2 = params.r2 as number;

      const c0 = params.c0 as number;

      const c1 = params.c1 as number;

      const delta = params.delta as number;

      expect(delta).toBeGreaterThanOrEqual(1);

      const gap = total * w[0][0] - gx[0] * hy[0];

      expect(gap).toBe(delta * (r1 + r2) * c1);

      expect(gap).toBeGreaterThan(0);

      // Sanity: stripping delta back out recovers an exactly independent table.
      const base = [
        [r0 * c0, r0 * c1],

        [r1 * c0, r1 * c1],

        [r2 * c0, r2 * c1],
      ];

      const baseTotal = (r0 + r1 + r2) * (c0 + c1);

      for (let x = 0; x <= 2; x++) {
        for (let y = 0; y <= 1; y++) {
          const rowSum = base[x][0] + base[x][1];

          const colSum = base[0][y] + base[1][y] + base[2][y];

          expect(base[x][y] / baseTotal).toBeCloseTo((rowSum / baseTotal) * (colSum / baseTotal), 10);
        }
      }

      expect(w[0][0]).toBe(base[0][0] + delta);

      expectNumericParts(inst.parts, [joint, product]);
    }
  });
});

describe('ch03 jointDensityMarginal', () => {
  const t = byId('ch03-gen-joint-density-marginal');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('c, g and h agree with numerically integrated marginals, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { A, a, x0, y0 } = inst.params as Record<string, number>;

      // Guards: both evaluation points sit strictly inside the rectangular support.
      expect(x0).toBeGreaterThan(0);

      expect(x0).toBeLessThan(A);

      expect(y0).toBeGreaterThan(0);

      expect(y0).toBeLessThan(1);

      const c = 6 / (A ** 2 * (3 + a));

      const density = (x: number, y: number) => c * x * (1 + a * y * y);

      const steps = 4000;

      // g(x0) = integral of f(x0, y) dy over 0 < y < 1.
      let g = 0;

      for (let j = 0; j < steps; j++) g += density(x0, (j + 0.5) / steps) / steps;

      // h(y0) = integral of f(x, y0) dx over 0 < x < A.
      let h = 0;

      for (let i = 0; i < steps; i++) h += density((i + 0.5) * (A / steps), y0) * (A / steps);

      // The joint density really integrates to 1 over the whole rectangle.
      let volume = 0;

      const coarse = 400;

      for (let i = 0; i < coarse; i++) {
        const x = (i + 0.5) * (A / coarse);

        for (let j = 0; j < coarse; j++) {
          volume += density(x, (j + 0.5) / coarse) * (A / coarse) * (1 / coarse);
        }
      }

      expect(volume).toBeCloseTo(1, 5);

      // This density factors over a rectangular support, so it is independent:
      // g(x) h(y) must reproduce f(x, y) exactly.
      expect(g * h).toBeCloseTo(density(x0, y0), 5);

      expectNumericParts(inst.parts, [c, g, h]);
    }
  });
});
