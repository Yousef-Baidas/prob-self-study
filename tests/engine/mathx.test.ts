import { describe, expect, it } from 'vitest';

import {
  factorial, nPr, nCr, mean, median,
  sampleVariance, populationVariance, sampleStdDev,
  quartile, iqr,
  round, normalCdf, erf,
} from '../../src/engine/mathx';

describe('combinatorics', () => {
  it('factorial matches known values', () => {
    expect(factorial(0)).toBe(1);

    expect(factorial(5)).toBe(120);
  });

  it('nPr(5,2) = 20 and nCr(5,2) = 10', () => {
    expect(nPr(5, 2)).toBe(20);

    expect(nCr(5, 2)).toBe(10);
  });

  it('nCr is symmetric: nCr(10,3) = nCr(10,7) = 120', () => {
    expect(nCr(10, 3)).toBe(120);

    expect(nCr(10, 7)).toBe(120);
  });
});

describe('descriptive stats', () => {
  const xs = [2, 4, 4, 4, 5, 5, 7, 9]; // Wikipedia std-dev example

  it('mean', () => expect(mean(xs)).toBe(5));

  it('median (even count averages the middle two)', () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);

    expect(median([1, 2, 3])).toBe(2);
  });

  it('populationVariance = 4, sampleVariance uses n-1', () => {
    expect(populationVariance(xs)).toBeCloseTo(4, 10);

    expect(sampleVariance(xs)).toBeCloseTo(32 / 7, 10);
  });

  it('sampleStdDev is sqrt of sampleVariance', () => {
    expect(sampleStdDev(xs)).toBeCloseTo(Math.sqrt(32 / 7), 10);
  });
});

describe('quartiles', () => {
  const xs = [1, 5, 6, 7, 9, 12, 14, 15, 18, 22]; // n = 10, the notes' worked example

  it('reads the value at a fractional position instead of a neighbouring one', () => {
    // L1 = 11/4 = 2.75 -> three quarters of the way from x2 = 5 to x3 = 6
    expect(quartile(xs, 1)).toBeCloseTo(5.75, 10);

    // L3 = 33/4 = 8.25 -> a quarter of the way from x8 = 15 to x9 = 18
    expect(quartile(xs, 3)).toBeCloseTo(15.75, 10);
  });

  it('takes the observation outright when the position is whole', () => {
    const seven = [3, 8, 11, 14, 20, 25, 31]; // n = 7 -> L1 = 2, L3 = 6

    expect(quartile(seven, 1)).toBe(8);

    expect(quartile(seven, 3)).toBe(25);
  });

  it('sorts the sample rather than trusting the caller', () => {
    const shuffled = [22, 1, 15, 6, 9, 5, 18, 7, 14, 12];

    expect(quartile(shuffled, 1)).toBeCloseTo(5.75, 10);

    expect(shuffled[0]).toBe(22); // the argument is left alone
  });

  it('Q2 is the median at every sample size', () => {
    // L2 = (n+1)/2, which is whole for odd n and exactly j + 0.5 for even n
    // -- the two branches of the median formula. This must hold for all n.
    for (let n = 1; n <= 40; n++) {
      const data = Array.from({ length: n }, (_, i) => (i * 37) % 101);

      expect(quartile(data, 2)).toBeCloseTo(median(data), 10);
    }
  });

  it('clamps when the position falls outside the sample', () => {
    expect(quartile([4, 9], 1)).toBe(4); // L1 = 0.75, before the first value

    expect(quartile([4, 9], 3)).toBe(9); // L3 = 2.25, past the last value

    expect(quartile([7], 1)).toBe(7);
  });

  it('iqr is the width of the middle half', () => {
    expect(iqr(xs)).toBeCloseTo(10, 10); // 15.75 - 5.75
  });

  it('disagrees with the median-of-halves rule, as the notes warn', () => {
    expect(median(xs.slice(0, 5))).toBe(6); // school method reports Q1 = 6

    expect(quartile(xs, 1)).toBeCloseTo(5.75, 10); // this course reports 5.75
  });
});

describe('round', () => {
  it('rounds to dp decimals', () => {
    expect(round(0.12345, 3)).toBe(0.123);

    expect(round(2.5, 0)).toBe(3);
  });
});

describe('erf', () => {
  it('matches known reference values', () => {
    expect(erf(0)).toBeCloseTo(0, 6);

    expect(erf(0.5)).toBeCloseTo(0.5204998778, 4);

    expect(erf(1)).toBeCloseTo(0.8427007929, 4);

    expect(erf(2)).toBeCloseTo(0.9953222650, 4);
  });
});

describe('normalCdf', () => {
  it('Φ(0) = 0.5', () => expect(normalCdf(0)).toBeCloseTo(0.5, 6));

  it('Φ(1.96) ≈ 0.975', () => expect(normalCdf(1.96)).toBeCloseTo(0.975, 4));

  it('Φ(-1.96) ≈ 0.025', () => expect(normalCdf(-1.96)).toBeCloseTo(0.025, 4));

  it('is symmetric: Φ(z) + Φ(-z) = 1', () => {
    for (const z of [0.3, 1.0, 2.2]) {
      expect(normalCdf(z) + normalCdf(-z)).toBeCloseTo(1, 6);
    }
  });
});
