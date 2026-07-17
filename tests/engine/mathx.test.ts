import { describe, expect, it } from 'vitest';

import {
  factorial, nPr, nCr, mean, median,
  sampleVariance, populationVariance, sampleStdDev,
  round, normalCdf,
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

describe('round', () => {
  it('rounds to dp decimals', () => {
    expect(round(0.12345, 3)).toBe(0.123);

    expect(round(2.5, 0)).toBe(3);
  });
});

describe('normalCdf', () => {
  it('Φ(0) = 0.5', () => expect(normalCdf(0)).toBeCloseTo(0.5, 6));

  it('Φ(1.96) ≈ 0.975', () => expect(normalCdf(1.96)).toBeCloseTo(0.975, 3));

  it('Φ(-1.96) ≈ 0.025', () => expect(normalCdf(-1.96)).toBeCloseTo(0.025, 3));

  it('is symmetric: Φ(z) + Φ(-z) = 1', () => {
    for (const z of [0.3, 1.0, 2.2]) {
      expect(normalCdf(z) + normalCdf(-z)).toBeCloseTo(1, 6);
    }
  });
});
