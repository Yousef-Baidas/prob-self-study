import { describe, expect, it } from 'vitest';

import { ch01Generators } from '../../../src/engine/generators/ch01';

import { mulberry32 } from '../../../src/engine/rng';

const SEEDS = 250;

// A brute-force sweep once found IQR = 0 at seeds 5098, 11607, and 19447 for
// `ch01-gen-quartile-fence` (fixed by clustering the offsets — see
// `quartileClusterOffsets` in src/engine/generators/ch01.ts). This template's
// own sweep is raised well past all three so the "IQR > 0" assertion below
// carries real force, not luck.
const QUARTILE_FENCE_SEEDS = 20000;

const QUARTILE_FENCE_REGRESSION_SEEDS = [5098, 11607, 19447];

// Recomputed independently of `src/engine/mathx` (plain inline arithmetic)
// so a bug in mathx cannot corrupt both sides of the comparison identically.

const independentMean = (xs: number[]): number => {
  let sum = 0;

  for (const x of xs) sum += x;

  return sum / xs.length;
};

const independentSampleStdDev = (xs: number[]): number => {
  const n = xs.length;

  let sum = 0;

  for (const x of xs) sum += x;

  const xBar = sum / n;

  let sumSquaredDiff = 0;

  for (const x of xs) sumSquaredDiff += (x - xBar) ** 2;

  return Math.sqrt(sumSquaredDiff / (n - 1));
};

// R type-6 quantile, written independently of `src/engine/mathx#quartile`.
const independentQuartile = (xs: number[], k: 1 | 2 | 3): number => {
  const s = [...xs].sort((a, b) => a - b);

  const n = s.length;

  const L = (k * (n + 1)) / 4;

  if (L <= 1) return s[0];

  if (L >= n) return s[n - 1];

  const j = Math.floor(L);

  const f = L - j;

  return f === 0 ? s[j - 1] : s[j - 1] + f * (s[j] - s[j - 1]);
};

const byId = (id: string) => {
  const t = ch01Generators.find((g) => g.id === id);

  if (!t) throw new Error(`missing generator ${id}`);

  return t;
};

describe('ch01 cvTwoLines', () => {
  const t = byId('ch01-gen-cv-compare');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    const wording = (prompt: string) =>
      prompt.replace(/\*\*[^*]+\*\*/g, '<DATA>');

    const first = wording(t.generate(mulberry32(0)).prompt);

    for (let seed = 1; seed < SEEDS; seed++) {
      expect(wording(t.generate(mulberry32(seed)).prompt)).toBe(first);
    }
  });

  it('both CVs match an independent recompute, and the winner is well-posed with no tie possible, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { dataA, dataB } = inst.params as unknown as { dataA: number[]; dataB: number[] };

      // Guard: both lines have strictly positive spread (never degenerate to s = 0).
      expect(independentSampleStdDev(dataA)).toBeGreaterThan(0);

      expect(independentSampleStdDev(dataB)).toBeGreaterThan(0);

      const cvA = (independentSampleStdDev(dataA) / independentMean(dataA)) * 100;

      const cvB = (independentSampleStdDev(dataB) / independentMean(dataB)) * 100;

      // Guard: same offsets on both lines ⇒ identical spread ⇒ never a tie in CV.
      expect(cvA).not.toBeCloseTo(cvB, 6);

      const [partA, partB, partWinner] = inst.parts;

      expect(partA.kind).toBe('numeric');

      expect(partB.kind).toBe('numeric');

      expect(partWinner.kind).toBe('mcq');

      if (partA.kind === 'numeric') expect(Math.abs(partA.answer - cvA)).toBeLessThanOrEqual(partA.tol);

      if (partB.kind === 'numeric') expect(Math.abs(partB.answer - cvB)).toBeLessThanOrEqual(partB.tol);

      if (partWinner.kind === 'mcq') {
        const expectedWinner = cvA > cvB ? 0 : 1;

        expect(partWinner.answer).toBe(expectedWinner);
      }
    }
  });
});

describe('ch01 quartileFence', () => {
  const t = byId('ch01-gen-quartile-fence');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    const wording = (prompt: string) =>
      prompt.replace(/\*\*[^*]+\*\*/g, '<DATA>').replace(/\d+(\.\d+)?/g, '<N>');

    const first = wording(t.generate(mulberry32(0)).prompt);

    for (let seed = 1; seed < SEEDS; seed++) {
      expect(wording(t.generate(mulberry32(seed)).prompt)).toBe(first);
    }
  });

  it('Q1/Q3/IQR match an independent recompute and the outlier verdict is well-posed, across seeds', () => {
    for (let seed = 0; seed < QUARTILE_FENCE_SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { data, testValue } = inst.params as unknown as { data: number[]; testValue: number };

      const q1 = independentQuartile(data, 1);

      const q3 = independentQuartile(data, 3);

      const iqrValue = q3 - q1;

      // Guard: IQR is never zero — the dataset always has real spread. This
      // is now a true invariant (see `quartileClusterOffsets`), not a
      // by-luck pass: seed 5098 (data [47, 50, 50, 52, 50, 50, 50] under the
      // old offset generator) used to fail this exact assertion.
      expect(iqrValue).toBeGreaterThan(0);

      const lowerFence = q1 - 1.5 * iqrValue;

      const upperFence = q3 + 1.5 * iqrValue;

      const [partQ1, partQ3, partIqr, partOutlier] = inst.parts;

      expect(partQ1.kind).toBe('numeric');

      expect(partQ3.kind).toBe('numeric');

      expect(partIqr.kind).toBe('numeric');

      expect(partOutlier.kind).toBe('tf');

      if (partQ1.kind === 'numeric') expect(Math.abs(partQ1.answer - q1)).toBeLessThanOrEqual(partQ1.tol);

      if (partQ3.kind === 'numeric') expect(Math.abs(partQ3.answer - q3)).toBeLessThanOrEqual(partQ3.tol);

      if (partIqr.kind === 'numeric')
        expect(Math.abs(partIqr.answer - iqrValue)).toBeLessThanOrEqual(partIqr.tol);

      // Guard: the test value is always unambiguously inside or outside the
      // fences (built with a real margin), so the stated verdict is correct.
      if (partOutlier.kind === 'tf') {
        if (partOutlier.answer) {
          expect(testValue).toBeGreaterThan(upperFence);
        } else {
          expect(testValue).toBeGreaterThanOrEqual(lowerFence);

          expect(testValue).toBeLessThanOrEqual(upperFence);
        }
      }
    }
  });

  it('regression: seeds 5098, 11607, and 19447 (once produced IQR = 0) now produce a strictly positive IQR', () => {
    for (const seed of QUARTILE_FENCE_REGRESSION_SEEDS) {
      const inst = t.generate(mulberry32(seed));

      const { data } = inst.params as unknown as { data: number[] };

      const q1 = independentQuartile(data, 1);

      const q3 = independentQuartile(data, 3);

      expect(q3 - q1).toBeGreaterThan(0);

      const [, , partIqr] = inst.parts;

      expect(partIqr.kind).toBe('numeric');

      if (partIqr.kind === 'numeric') expect(partIqr.answer).toBeGreaterThan(0);
    }
  });
});
