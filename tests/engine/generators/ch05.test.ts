import { describe, expect, it } from 'vitest';

import { ch05Generators } from '../../../src/engine/generators/ch05';

import { mulberry32 } from '../../../src/engine/rng';

const SEEDS = 250;

// Recomputed independently of ch05.ts's own `choose`/pmf helpers, and of
// `src/engine/mathx`, so a bug in either cannot corrupt both sides of a
// comparison identically.

const independentChoose = (n: number, r: number): number => {
  if (r < 0 || r > n) return 0;

  let c = 1;

  for (let i = 0; i < r; i++) c = (c * (n - i)) / (i + 1);

  return c;
};

const independentFactorial = (n: number): number => {
  let r = 1;

  for (let i = 2; i <= n; i++) r *= i;

  return r;
};

const independentBinomialPmf = (n: number, p: number, x: number): number =>
  independentChoose(n, x) * p ** x * (1 - p) ** (n - x);

const independentHyperPmf = (N: number, n: number, k: number, x: number): number =>
  (independentChoose(k, x) * independentChoose(N - k, n - x)) / independentChoose(N, n);

const independentGeometricPmf = (p: number, x: number): number => p * (1 - p) ** (x - 1);

const independentNegBinomialPmf = (x: number, k: number, p: number): number =>
  independentChoose(x - 1, k - 1) * p ** k * (1 - p) ** (x - k);

const independentPoissonPmf = (lambdaT: number, x: number): number =>
  (Math.exp(-lambdaT) * lambdaT ** x) / independentFactorial(x);

const independentBinomialCdf = (n: number, p: number, x: number): number => {
  let s = 0;

  for (let i = 0; i <= x; i++) s += independentBinomialPmf(n, p, i);

  return s;
};

const independentHyperCdf = (N: number, n: number, k: number, x: number, lower: number): number => {
  let s = 0;

  for (let i = lower; i <= x; i++) s += independentHyperPmf(N, n, k, i);

  return s;
};

const independentPoissonCdf = (lambdaT: number, x: number): number => {
  let s = 0;

  for (let i = 0; i <= x; i++) s += independentPoissonPmf(lambdaT, i);

  return s;
};

const byId = (id: string) => {
  const t = ch05Generators.find((g) => g.id === id);

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
  expect(parts.filter((p) => p.kind === 'numeric').length).toBe(expected.length);

  let i = 0;

  for (const part of parts) {
    if (part.kind !== 'numeric') continue;

    expect(Math.abs(part.answer - expected[i])).toBeLessThanOrEqual(part.tol);

    i++;
  }
};

// Regression guard: a numeric answer that rounds to 0 (or lands inside its
// own tol) is gradable by a guess without ever computing anything. Every
// numeric part must clear tol*2 in absolute value.
const expectMaterialNumericParts = (parts: ReturnType<ReturnType<typeof byId>['generate']>['parts']) => {
  for (const part of parts) {
    if (part.kind !== 'numeric') continue;

    expect(Math.abs(part.answer)).toBeGreaterThan(part.tol * 2);
  }
};

describe('ch05 binomialPmfMeanVariance', () => {
  const t = byId('ch05-gen-binomial-pmf-mean-variance');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(X = x), mean and variance match an independent recompute, and the full pmf sums to 1', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { n, p, x } = inst.params as Record<string, number>;

      // Guards: p strictly inside (0, 1), and x within a window of at most 1
      // around the rounded mean n*p, clamped to the support [0, n].
      expect(p).toBeGreaterThan(0);

      expect(p).toBeLessThan(1);

      const meanRoundGuard = Math.round(n * p);

      expect(x).toBeGreaterThanOrEqual(Math.max(0, meanRoundGuard - 1));

      expect(x).toBeLessThanOrEqual(Math.min(n, meanRoundGuard + 1));

      const pmf = independentBinomialPmf(n, p, x);

      expect(pmf).toBeGreaterThan(0);

      expect(pmf).toBeLessThanOrEqual(1);

      const mean = n * p;

      const variance = n * p * (1 - p);

      expectNumericParts(inst.parts, [pmf, mean, variance]);

      // Regression guard: x sampled near the mean must keep P(X=x) material,
      // not just present -- a bug here would have both sides agree on a
      // rounded-to-0 value.
      expectMaterialNumericParts(inst.parts);

      let mass = 0;

      for (let i = 0; i <= n; i++) mass += independentBinomialPmf(n, p, i);

      expect(mass).toBeCloseTo(1, 6);
    }
  });
});

describe('ch05 hypergeometricPmf', () => {
  const t = byId('ch05-gen-hypergeometric-pmf');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(X = x) matches an independent recompute and the full support sums to 1, with support bounds respected', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { total, defective, sample, x } = inst.params as Record<string, number>;

      const lower = Math.max(0, sample - (total - defective));

      const upper = Math.min(sample, defective);

      // x is windowed to within 1 of the rounded mean sample*defective/total,
      // clamped to the support [lower, upper], rather than drawn all the way
      // up to the extreme upper bound where mass can fall inside tol.
      const meanRoundGuard = Math.round((sample * defective) / total);

      expect(x).toBeGreaterThanOrEqual(Math.max(lower, meanRoundGuard - 1));

      expect(x).toBeLessThanOrEqual(Math.min(upper, meanRoundGuard + 1));

      const pmf = independentHyperPmf(total, sample, defective, x);

      expect(pmf).toBeGreaterThan(0);

      expect(pmf).toBeLessThanOrEqual(1);

      expectNumericParts(inst.parts, [pmf]);

      // Regression guard against the underflow-to-0 defect class.
      expectMaterialNumericParts(inst.parts);

      let mass = 0;

      for (let i = lower; i <= upper; i++) mass += independentHyperPmf(total, sample, defective, i);

      expect(mass).toBeCloseTo(1, 6);
    }
  });
});

describe('ch05 hypergeometricMeanVariance', () => {
  const t = byId('ch05-gen-hypergeometric-mean-variance');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('mean and variance match the closed forms, with the finite population correction at most 1', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { total, defective, sample } = inst.params as Record<string, number>;

      expect(sample).toBeLessThan(total);

      expect(defective).toBeLessThan(total);

      const mean = (sample * defective) / total;

      const kOverN = defective / total;

      const fpc = (total - sample) / (total - 1);

      expect(fpc).toBeGreaterThan(0);

      expect(fpc).toBeLessThanOrEqual(1);

      const variance = fpc * sample * kOverN * (1 - kOverN);

      expectNumericParts(inst.parts, [mean, variance]);
    }
  });
});

describe('ch05 recognizeDistribution', () => {
  const t = byId('ch05-gen-recognize-distribution');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('always identifies the hypergeometric, since the scenario is always sampling without replacement', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { total, defective, sample } = inst.params as Record<string, number>;

      expect(defective).toBeLessThan(total);

      expect(sample).toBeLessThan(total);

      const part = inst.parts[0];

      expect(part.kind).toBe('mcq');

      if (part.kind === 'mcq') {
        expect(part.choices[part.answer]).toBe('Hypergeometric');

        // Choice order itself must never depend on the seed.
        expect(part.choices).toEqual(['Binomial', 'Hypergeometric', 'Geometric', 'Poisson']);
      }
    }
  });
});

describe('ch05 geometricPmf', () => {
  const t = byId('ch05-gen-geometric-pmf');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(X = x) and the mean match an independent recompute, and masses strictly decrease', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { m, x } = inst.params as Record<string, number>;

      expect(x).toBeGreaterThanOrEqual(2);

      const p = 1 / m;

      const pmf = independentGeometricPmf(p, x);

      expect(pmf).toBeGreaterThan(0);

      expect(pmf).toBeLessThan(1);

      const mean = 1 / p;

      expectNumericParts(inst.parts, [pmf, mean]);

      // Geometric masses are strictly decreasing in x.
      for (let i = 1; i < 10; i++) {
        expect(independentGeometricPmf(p, i + 1)).toBeLessThan(independentGeometricPmf(p, i));
      }
    }
  });
});

describe('ch05 negativeBinomialPmf', () => {
  const t = byId('ch05-gen-negative-binomial-pmf');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(X = x) matches an independent recompute, with x always at least k', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { p, k, x } = inst.params as Record<string, number>;

      // Guard: the kth success cannot land before the kth trial.
      expect(x).toBeGreaterThanOrEqual(k);

      expect(p).toBeGreaterThan(0);

      expect(p).toBeLessThan(1);

      const pmf = independentNegBinomialPmf(x, k, p);

      expect(pmf).toBeGreaterThan(0);

      expect(pmf).toBeLessThan(1);

      expectNumericParts(inst.parts, [pmf]);

      // The negative binomial with k = 1 collapses to the geometric -- a
      // structural identity, checked directly rather than assumed.
      expect(independentNegBinomialPmf(x, 1, p)).toBeCloseTo(independentGeometricPmf(p, x), 10);
    }
  });
});

describe('ch05 poissonPmf', () => {
  const t = byId('ch05-gen-poisson-pmf');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(X = x) matches an independent recompute, and the mean equals the variance', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { lambda, t: tt, x } = inst.params as Record<string, number>;

      const lambdaT = lambda * tt;

      expect(lambdaT).toBeGreaterThan(0);

      // x is windowed to within [round(lambdaT)-2, round(lambdaT)+3] rather
      // than the full [0, lambdaT+4]: for larger lambdaT the low end of that
      // range sits several standard deviations below the mean, where the
      // true probability underflows 4dp rounding to 0.
      expect(x).toBeGreaterThanOrEqual(Math.max(0, Math.round(lambdaT) - 2));

      expect(x).toBeLessThanOrEqual(Math.round(lambdaT) + 3);

      const pmf = independentPoissonPmf(lambdaT, x);

      expect(pmf).toBeGreaterThan(0);

      expect(pmf).toBeLessThanOrEqual(1);

      expectNumericParts(inst.parts, [pmf, lambdaT, lambdaT]);

      // Regression guard against the underflow-to-0 defect class.
      expectMaterialNumericParts(inst.parts);

      // The full support sums to 1 -- summed far enough past lambdaT that the
      // remaining tail is negligible for every draw in range.
      let mass = 0;

      for (let i = 0; i <= lambdaT + 60; i++) mass += independentPoissonPmf(lambdaT, i);

      expect(mass).toBeCloseTo(1, 6);

      // Mean and variance both equal lambdaT -- verified here by summing the
      // distribution directly, not by trusting the closed form twice.
      let mean = 0;

      for (let i = 0; i <= lambdaT + 60; i++) mean += i * independentPoissonPmf(lambdaT, i);

      let variance = 0;

      for (let i = 0; i <= lambdaT + 60; i++) variance += (i - mean) ** 2 * independentPoissonPmf(lambdaT, i);

      expect(mean).toBeCloseTo(lambdaT, 4);

      expect(variance).toBeCloseTo(lambdaT, 4);
    }
  });
});

describe('ch05 uniformPmfMeanVariance', () => {
  const t = byId('ch05-gen-uniform-pmf-mean-variance');

  // No assertStableWording here: the value list's length (k = 4..6) varies
  // by seed, so the prose itself has a different shape, not just different
  // numbers -- the same reason ch05-hard's multinomialTriple test skips it.

  it('P(X = chosen), mean and variance match an independent recompute over the sampled value list', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { k, start, step, chosen, mean, variance } = inst.params as Record<string, number>;

      const values = Array.from({ length: k }, (_, i) => start + i * step);

      expect(values).toContain(chosen);

      const indepMean = values.reduce((a, v) => a + v, 0) / k;

      const indepVariance = values.reduce((a, v) => a + (v - indepMean) ** 2, 0) / k;

      expect(mean).toBeCloseTo(indepMean, 4);

      expect(variance).toBeCloseTo(indepVariance, 4);

      expectNumericParts(inst.parts, [1 / k, indepMean, indepVariance]);

      expectMaterialNumericParts(inst.parts);
    }
  });
});

describe('ch05 uniformConsecutiveIntegers', () => {
  const t = byId('ch05-gen-uniform-consecutive-integers');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('mean, variance and the tail probability match an independent recompute', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { a, N, b, c } = inst.params as Record<string, number>;

      expect(b).toBe(a + N - 1);

      expect(c).toBeGreaterThan(a);

      expect(c).toBeLessThanOrEqual(b - 2);

      const mean = (a + b) / 2;

      const variance = (N ** 2 - 1) / 12;

      const favourable = b - c + 1;

      const tailProb = favourable / N;

      expectNumericParts(inst.parts, [mean, variance, tailProb]);

      expectMaterialNumericParts(inst.parts);
    }
  });
});

describe('ch05 uniformDiscrimination', () => {
  const t = byId('ch05-gen-uniform-discrimination');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('always identifies the discrete uniform, with the correct mean', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { N } = inst.params as Record<string, number>;

      const mcq = inst.parts[0];

      expect(mcq.kind).toBe('mcq');

      if (mcq.kind === 'mcq') {
        expect(mcq.choices[mcq.answer]).toBe('Discrete uniform');

        expect(mcq.choices).toEqual(['Discrete uniform', 'Binomial', 'Hypergeometric', 'Poisson']);
      }

      const mean = (1 + N) / 2;

      const numeric = inst.parts[1];

      expect(numeric.kind).toBe('numeric');

      if (numeric.kind === 'numeric') expect(Math.abs(numeric.answer - mean)).toBeLessThanOrEqual(numeric.tol);
    }
  });
});

describe('ch05 binomialCumulative', () => {
  const t = byId('ch05-gen-binomial-cumulative');

  it('the cumulative probability matches an independent recompute for whichever direction was drawn', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { n, p, meanRound } = inst.params as Record<string, number>;

      const part = inst.parts[0];

      expect(part.kind).toBe('numeric');

      if (part.kind !== 'numeric') continue;

      // Recompute all three candidate directions and confirm the reported
      // answer matches at least one of them -- the direction itself is not
      // exposed in params, only through the label text.
      const atMost = independentBinomialCdf(n, p, meanRound);

      const atLeastC = Math.max(1, meanRound);

      const atLeast = 1 - independentBinomialCdf(n, p, atLeastC - 1);

      const lo = Math.max(0, meanRound - 1);

      const hi = Math.min(n, meanRound + 1);

      const between = independentBinomialCdf(n, p, hi) - independentBinomialCdf(n, p, lo - 1);

      const matchesOne = [atMost, atLeast, between].some((v) => Math.abs(part.answer - v) <= part.tol);

      expect(matchesOne).toBe(true);

      expect(Math.abs(part.answer)).toBeGreaterThan(part.tol * 2);
    }
  });
});

describe('ch05 binomialDiscrimination', () => {
  const t = byId('ch05-gen-binomial-discrimination');

  it('always identifies binomial, and P(X = x) matches an independent recompute', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { n, p, x } = inst.params as Record<string, number>;

      const mcq = inst.parts[0];

      expect(mcq.kind).toBe('mcq');

      if (mcq.kind === 'mcq') expect(mcq.choices[mcq.answer]).toBe('Binomial');

      const pmf = independentBinomialPmf(n, p, x);

      const numeric = inst.parts[1];

      expect(numeric.kind).toBe('numeric');

      if (numeric.kind === 'numeric') {
        expect(Math.abs(numeric.answer - pmf)).toBeLessThanOrEqual(numeric.tol);

        expect(Math.abs(numeric.answer)).toBeGreaterThan(numeric.tol * 2);
      }
    }
  });
});

describe('ch05 hypergeometricCumulative', () => {
  const t = byId('ch05-gen-hypergeometric-cumulative');

  it('the cumulative probability matches an independent recompute for whichever direction was drawn', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { total, defective, sample, meanRound } = inst.params as Record<string, number>;

      const lower = Math.max(0, sample - (total - defective));

      const upper = Math.min(sample, defective);

      expect(meanRound).toBeGreaterThanOrEqual(lower);

      expect(meanRound).toBeLessThanOrEqual(upper);

      const atMost = independentHyperCdf(total, sample, defective, meanRound, lower);

      const atLeast = 1 - independentHyperCdf(total, sample, defective, meanRound - 1, lower);

      const part = inst.parts[0];

      expect(part.kind).toBe('numeric');

      if (part.kind !== 'numeric') continue;

      const matchesOne = [atMost, atLeast].some((v) => Math.abs(part.answer - v) <= part.tol);

      expect(matchesOne).toBe(true);

      expect(Math.abs(part.answer)).toBeGreaterThan(part.tol * 2);
    }
  });
});

describe('ch05 discriminationGeometricNegativeBinomial', () => {
  const t = byId('ch05-gen-discrimination-geometric-negative-binomial');

  it('picks geometric when r = 1 and negative binomial otherwise, with P(X = x) matching an independent recompute', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { r, p, x } = inst.params as Record<string, number>;

      expect(x).toBeGreaterThanOrEqual(r);

      const mcq = inst.parts[0];

      expect(mcq.kind).toBe('mcq');

      if (mcq.kind === 'mcq') {
        expect(mcq.choices[mcq.answer]).toBe(r === 1 ? 'Geometric' : 'Negative binomial');
      }

      const pmf = r === 1 ? independentGeometricPmf(p, x) : independentNegBinomialPmf(x, r, p);

      const numeric = inst.parts[1];

      expect(numeric.kind).toBe('numeric');

      if (numeric.kind === 'numeric') {
        expect(Math.abs(numeric.answer - pmf)).toBeLessThanOrEqual(numeric.tol);

        expect(Math.abs(numeric.answer)).toBeGreaterThan(numeric.tol * 2);
      }
    }
  });
});

describe('ch05 poissonEasy', () => {
  const t = byId('ch05-gen-poisson-easy');

  it('P(X = x) matches an independent recompute', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { lambda, x } = inst.params as Record<string, number>;

      const pmf = independentPoissonPmf(lambda, x);

      expectNumericParts(inst.parts, [pmf]);

      expectMaterialNumericParts(inst.parts);
    }
  });
});

describe('ch05 poissonCumulative', () => {
  const t = byId('ch05-gen-poisson-cumulative');

  it('the cumulative probability matches an independent recompute for whichever direction was drawn', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { lambda, meanRound } = inst.params as Record<string, number>;

      const atMost = independentPoissonCdf(lambda, meanRound);

      const atLeast = 1 - independentPoissonCdf(lambda, meanRound - 1);

      const part = inst.parts[0];

      expect(part.kind).toBe('numeric');

      if (part.kind !== 'numeric') continue;

      const matchesOne = [atMost, atLeast].some((v) => Math.abs(part.answer - v) <= part.tol);

      expect(matchesOne).toBe(true);

      expect(Math.abs(part.answer)).toBeGreaterThan(part.tol * 2);
    }
  });
});

describe('ch05 poissonDiscrimination', () => {
  const t = byId('ch05-gen-poisson-discrimination');

  it('always identifies Poisson, with the rate correctly scaled to the length asked about', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { lambda, lengthMeters, lambdaT, x } = inst.params as Record<string, number>;

      expect(lambdaT).toBeCloseTo(lambda * lengthMeters, 10);

      const mcq = inst.parts[0];

      expect(mcq.kind).toBe('mcq');

      if (mcq.kind === 'mcq') expect(mcq.choices[mcq.answer]).toBe('Poisson');

      const pmf = independentPoissonPmf(lambdaT, x);

      const numeric = inst.parts[1];

      expect(numeric.kind).toBe('numeric');

      if (numeric.kind === 'numeric') {
        expect(Math.abs(numeric.answer - pmf)).toBeLessThanOrEqual(numeric.tol);

        expect(Math.abs(numeric.answer)).toBeGreaterThan(numeric.tol * 2);
      }
    }
  });
});

describe('ch05 poissonApproxValidity', () => {
  const t = byId('ch05-gen-poisson-approx-validity');

  it('both probabilities match an independent recompute, and validity tracks p <= 0.05 with mu = np held fixed', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { mu, n, p, x, legit } = inst.params as Record<string, number>;

      expect(n * p).toBeCloseTo(mu, 6);

      expect((p <= 0.05) === (legit === 1)).toBe(true);

      const approx = independentPoissonPmf(mu, x);

      const exact = independentBinomialPmf(n, p, x);

      const parts = inst.parts;

      expect(parts[0].kind).toBe('numeric');

      if (parts[0].kind === 'numeric') expect(Math.abs(parts[0].answer - approx)).toBeLessThanOrEqual(parts[0].tol);

      expect(parts[1].kind).toBe('numeric');

      if (parts[1].kind === 'numeric') expect(Math.abs(parts[1].answer - exact)).toBeLessThanOrEqual(parts[1].tol);

      expect(parts[2].kind).toBe('tf');

      if (parts[2].kind === 'tf') expect(parts[2].answer).toBe(p <= 0.05);

      for (const part of parts) {
        if (part.kind !== 'numeric') continue;

        expect(Math.abs(part.answer)).toBeGreaterThan(part.tol * 2);
      }
    }
  });
});
