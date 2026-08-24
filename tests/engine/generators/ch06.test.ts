import { describe, expect, it } from 'vitest';

import { ch06Generators } from '../../../src/engine/generators/ch06';

import { mulberry32 } from '../../../src/engine/rng';

const SEEDS = 400;

// Recomputed independently of both ch06.ts's own helpers and of
// `src/engine/mathx` (which already has its own dedicated tests) -- a
// numerical-integration Phi and a bisection Phi^-1, rather than the
// Abramowitz-Stegun/Acklam approximations mathx uses, so a bug shared by
// generator and mathx cannot pass silently.
const stdNormalPdf = (z: number): number => Math.exp(-(z * z) / 2) / Math.sqrt(2 * Math.PI);

const independentNormalCdf = (z: number): number => {
  const a = -8;

  if (z <= a) return 0;

  const n = 400; // even, Simpson's rule

  const h = (z - a) / n;

  let sum = stdNormalPdf(a) + stdNormalPdf(z);

  for (let i = 1; i < n; i++) {
    sum += (i % 2 === 0 ? 2 : 4) * stdNormalPdf(a + i * h);
  }

  return (h / 3) * sum;
};

const independentInvNormalCdf = (p: number): number => {
  let lo = -8;

  let hi = 8;

  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;

    if (independentNormalCdf(mid) < p) lo = mid;
    else hi = mid;
  }

  return (lo + hi) / 2;
};

const byId = (id: string) => {
  const t = ch06Generators.find((g) => g.id === id);

  if (!t) throw new Error(`missing generator ${id}`);

  return t;
};

const wordingOf = (prompt: string) => prompt.replace(/-?\d+(\.\d+)?/g, '<N>');

const assertStableWording = (t: ReturnType<typeof byId>) => {
  const first = wordingOf(t.generate(mulberry32(0)).prompt);

  for (let seed = 1; seed < SEEDS; seed++) {
    expect(wordingOf(t.generate(mulberry32(seed)).prompt)).toBe(first);
  }
};

const expectNumericParts = (
  parts: ReturnType<ReturnType<typeof byId>['generate']>['parts'],
  expected: number[],
  tolPad = 0,
) => {
  expect(parts.filter((p) => p.kind === 'numeric').length).toBe(expected.length);

  let i = 0;

  for (const part of parts) {
    if (part.kind !== 'numeric') continue;

    expect(Math.abs(part.answer - expected[i])).toBeLessThanOrEqual(part.tol + tolPad);

    i++;
  }
};

// Regression guard: an answer that rounds to 0 (or lands inside its own tol)
// is gradable by a guess without ever computing anything -- see
// no-degenerate-answers.test.ts for the system-wide version of this check.
const expectMaterialNumericParts = (parts: ReturnType<ReturnType<typeof byId>['generate']>['parts']) => {
  for (const part of parts) {
    if (part.kind !== 'numeric') continue;

    expect(Math.abs(part.answer)).toBeGreaterThan(part.tol * 2);
  }
};

describe('ch06 uniformProbabilityMeanVariance', () => {
  const t = byId('ch06-gen-uniform-probability-mean-variance');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(c<X<d), mean and variance all match closed forms, with c<d strictly inside (A,B)', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { A, B, c, d } = inst.params as Record<string, number>;

      expect(A).toBeLessThan(c);

      expect(c).toBeLessThan(d);

      expect(d).toBeLessThan(B);

      expect(d - c).toBeGreaterThanOrEqual(2);

      const probability = (d - c) / (B - A);

      const mean = (A + B) / 2;

      const variance = (B - A) ** 2 / 12;

      expectNumericParts(inst.parts, [probability, mean, variance]);

      expectMaterialNumericParts(inst.parts);
    }
  });
});

describe('ch06 uniformWaitingTime', () => {
  const t = byId('ch06-gen-uniform-waiting-time');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('both probabilities match closed forms, with t1, t2 at least 2 minutes from either end', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { m, t1, t2 } = inst.params as Record<string, number>;

      expect(t1).toBeGreaterThanOrEqual(2);

      expect(t1).toBeLessThanOrEqual(m - 2);

      expect(t2).toBeGreaterThanOrEqual(2);

      expect(t2).toBeLessThanOrEqual(m - 2);

      expectNumericParts(inst.parts, [t1 / m, (m - t2) / m]);

      expectMaterialNumericParts(inst.parts);
    }
  });
});

describe('ch06 normalTwoSidedArea', () => {
  const t = byId('ch06-gen-normal-two-sided-area');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(x1<X<x2) matches an independently-integrated Phi, with x1<mu<x2', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { mu, sigma, x1, x2 } = inst.params as Record<string, number>;

      expect(x1).toBeLessThan(mu);

      expect(x2).toBeGreaterThan(mu);

      // The generator rounds z to 2dp before consulting Phi, matching the
      // book's table-lookup convention -- replicated here exactly, since
      // that rounding (not just the Phi algorithm) is part of the answer.
      const z1 = Math.round(((x1 - mu) / sigma) * 100) / 100;

      const z2 = Math.round(((x2 - mu) / sigma) * 100) / 100;

      const probability = independentNormalCdf(z2) - independentNormalCdf(z1);

      expectNumericParts(inst.parts, [probability], 0.0005);

      expectMaterialNumericParts(inst.parts);
    }
  });
});

describe('ch06 normalCurveInReverse', () => {
  const t = byId('ch06-gen-normal-curve-in-reverse');

  const SMALL_SEEDS = 250; // bisection-based independent Phi^-1 is comparatively slow

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    const first = wordingOf(t.generate(mulberry32(0)).prompt);

    for (let seed = 1; seed < SMALL_SEEDS; seed++) {
      expect(wordingOf(t.generate(mulberry32(seed)).prompt)).toBe(first);
    }
  });

  it('both k values match an independently bisected Phi^-1, with p1 < 0.5 < p2', () => {
    for (let seed = 0; seed < SMALL_SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { p1, p2 } = inst.params as Record<string, number>;

      expect(p1).toBeLessThan(0.5);

      expect(p2).toBeGreaterThan(0.5);

      const k1 = independentInvNormalCdf(1 - p1);

      const k2 = independentInvNormalCdf(p2);

      expectNumericParts(inst.parts, [k1, k2], 0.01);

      expectMaterialNumericParts(inst.parts);
    }
  });
});

describe('ch06 normalApplicationForward', () => {
  const t = byId('ch06-gen-normal-application-forward');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(X<x0) matches an independently-integrated Phi', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { mu, sigma, x0 } = inst.params as Record<string, number>;

      const z = Math.round(((x0 - mu) / sigma) * 100) / 100;

      expect(Math.abs(z)).toBeGreaterThanOrEqual(0.4 - 1e-9);

      expect(Math.abs(z)).toBeLessThanOrEqual(2.5 + 1e-9);

      const probability = independentNormalCdf(z);

      expectNumericParts(inst.parts, [probability], 0.0005);

      expectMaterialNumericParts(inst.parts);
    }
  });
});

describe('ch06 normalApproxBinomialSingle', () => {
  const t = byId('ch06-gen-normal-approx-binomial-single');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(X<x0) with the continuity correction matches an independently-integrated Phi, and np, nq >= 5', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { n, p, x0 } = inst.params as Record<string, number>;

      // Guards: the approximation this question relies on is only valid
      // because np and n(1-p) are always comfortably at least 5.
      expect(n * p).toBeGreaterThanOrEqual(5);

      expect(n * (1 - p)).toBeGreaterThanOrEqual(5);

      expect(x0).toBeGreaterThanOrEqual(1);

      expect(x0).toBeLessThanOrEqual(n - 1);

      const mu = n * p;

      const sigma = Math.sqrt(n * p * (1 - p));

      const z = Math.round(((x0 - 0.5 - mu) / sigma) * 100) / 100;

      const probability = independentNormalCdf(z);

      expectNumericParts(inst.parts, [probability], 0.0005);

      expectMaterialNumericParts(inst.parts);
    }
  });
});

describe('ch06 exponentialProbability', () => {
  const t = byId('ch06-gen-exponential-probability');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(T>t) and P(T<t) match the exponential cdf and are complementary', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { lambda, t: tVal } = inst.params as Record<string, number>;

      // The deck parameterizes by the rate lambda, so the dimensionless
      // exponent is lambda*t -- not t/beta. Getting this backwards yields the
      // reciprocal, which is the single most common exam error here.
      const ratio = lambda * tVal;

      // t is rounded to 2dp after being derived from the target ratio, so the
      // realized ratio drifts slightly off the intended [0.3, 2.0] band.
      expect(ratio).toBeGreaterThanOrEqual(0.3 - 0.02);

      expect(ratio).toBeLessThanOrEqual(2.0 + 0.02);

      const probMore = Math.exp(-ratio);

      const probLess = 1 - probMore;

      expectNumericParts(inst.parts, [probMore, probLess], 0.0005);

      expectMaterialNumericParts(inst.parts);

      const numeric = inst.parts.filter((p) => p.kind === 'numeric');

      if (numeric[0].kind === 'numeric' && numeric[1].kind === 'numeric') {
        expect(numeric[0].answer + numeric[1].answer).toBeCloseTo(1, 3);
      }
    }
  });
});

describe('ch06 exponentialMemoryless', () => {
  const t = byId('ch06-gen-exponential-memoryless');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('the declared answer equals P(T>t), and the memoryless identity holds against t0 directly', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { lambda, t0, t: tVal } = inst.params as Record<string, number>;

      const answer = Math.exp(-lambda * tVal);

      expectNumericParts(inst.parts, [answer], 0.0005);

      expectMaterialNumericParts(inst.parts);

      // The memoryless property itself, checked directly rather than assumed:
      // P(T > t0+t | T > t0) = P(T>t0+t)/P(T>t0) must equal P(T>t) exactly.
      // The t0 factors cancel algebraically, which is precisely why the
      // elapsed wait t0 cannot influence the answer.
      const conditional = Math.exp(-lambda * (t0 + tVal)) / Math.exp(-lambda * t0);

      expect(conditional).toBeCloseTo(answer, 10);
    }
  });
});

describe('ch06 exponentialMedianVsMean', () => {
  const t = byId('ch06-gen-exponential-median-vs-mean');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('mean = 1/lambda, median = ln2/lambda, and the median is always the smaller', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { lambda } = inst.params as Record<string, number>;

      expect(lambda).toBeGreaterThan(0);

      expectNumericParts(inst.parts, [1 / lambda, Math.LN2 / lambda]);

      expectMaterialNumericParts(inst.parts);

      // The whole point of the template: the exponential is right-skewed, so
      // the long upper tail drags the mean above the median. ln2 < 1 makes
      // this true for every lambda, which is why the true/false part is not
      // seed-dependent.
      const tfPart = inst.parts.find((p) => p.kind === 'tf');

      expect(tfPart?.kind).toBe('tf');

      if (tfPart?.kind === 'tf') expect(tfPart.answer).toBe(true);

      expect(Math.LN2 / lambda).toBeLessThan(1 / lambda);
    }
  });
});

describe('ch06 uniformConditional', () => {
  const t = byId('ch06-gen-uniform-conditional');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(X>a|X>b) matches the closed form, and the tf part is always false', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { M, a, b } = inst.params as Record<string, number>;

      expect(b).toBeGreaterThanOrEqual(2);

      expect(a).toBeGreaterThanOrEqual(b + 2);

      expect(a).toBeLessThanOrEqual(M - 2);

      const probability = (M - a) / (M - b);

      expectNumericParts(inst.parts, [probability]);

      expectMaterialNumericParts(inst.parts);

      const tfPart = inst.parts.find((p) => p.kind === 'tf');

      expect(tfPart?.kind).toBe('tf');

      if (tfPart?.kind === 'tf') expect(tfPart.answer).toBe(false);
    }
  });
});

describe('ch06 normalDiffersFromMean', () => {
  const t = byId('ch06-gen-normal-differs-from-mean');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(|X-mu|>k*sigma) matches an independently-integrated Phi, and the tf part is always true', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { k } = inst.params as Record<string, number>;

      expect(k).toBeGreaterThanOrEqual(0.5 - 1e-9);

      expect(k).toBeLessThanOrEqual(2.8 + 1e-9);

      const probability = 2 * (1 - independentNormalCdf(k));

      expectNumericParts(inst.parts, [probability], 0.0005);

      expectMaterialNumericParts(inst.parts);

      const tfPart = inst.parts.find((p) => p.kind === 'tf');

      expect(tfPart?.kind).toBe('tf');

      if (tfPart?.kind === 'tf') expect(tfPart.answer).toBe(true);
    }
  });
});

describe('ch06 normalApplicationEasyLatency', () => {
  const t = byId('ch06-gen-normal-application-easy-latency');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(X<x0) matches an independently-integrated Phi', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { mu, sigma, x0 } = inst.params as Record<string, number>;

      const z = Math.round(((x0 - mu) / sigma) * 100) / 100;

      const probability = independentNormalCdf(z);

      expectNumericParts(inst.parts, [probability], 0.0005);

      expectMaterialNumericParts(inst.parts);
    }
  });
});

describe('ch06 normalApplicationTwoSidedMcq', () => {
  const t = byId('ch06-gen-normal-application-two-sided-mcq');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('the mcq choice at the declared answer index matches an independently-integrated Phi', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { mu, sigma, x1, x2 } = inst.params as Record<string, number>;

      const z1 = Math.round(((x1 - mu) / sigma) * 100) / 100;

      const z2 = Math.round(((x2 - mu) / sigma) * 100) / 100;

      const probability = independentNormalCdf(z2) - independentNormalCdf(z1);

      const part = inst.parts[0];

      expect(part.kind).toBe('mcq');

      if (part.kind === 'mcq') {
        expect(part.choices.length).toBe(4);

        const declared = Number.parseFloat(part.choices[part.answer]);

        expect(Math.abs(declared - probability)).toBeLessThanOrEqual(0.0006);

        expect(Math.abs(declared)).toBeGreaterThan(0.001);
      }
    }
  });
});

describe('ch06 normalApproxLegitimacy', () => {
  const t = byId('ch06-gen-normal-approx-binomial-legitimacy');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('np, n(1-p) and the legitimacy verdict all match independent recomputation', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { n, p } = inst.params as Record<string, number>;

      const npVal = n * p;

      const nq = n * (1 - p);

      expectNumericParts(inst.parts, [npVal, nq], 0.06);

      expectMaterialNumericParts(inst.parts);

      const tfPart = inst.parts.find((p2) => p2.kind === 'tf');

      expect(tfPart?.kind).toBe('tf');

      if (tfPart?.kind === 'tf') expect(tfPart.answer).toBe(npVal >= 5 && nq >= 5);
    }
  });
});

describe('ch06 normalApproxCorrectionComparison', () => {
  const t = byId('ch06-gen-normal-approx-binomial-correction-comparison');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('both the corrected and uncorrected probabilities match independent recomputation', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { n, p, x0 } = inst.params as Record<string, number>;

      const mu = n * p;

      const sigma = Math.sqrt(n * p * (1 - p));

      const zCorrected = Math.round(((x0 - 0.5 - mu) / sigma) * 100) / 100;

      const zUncorrected = Math.round(((x0 - mu) / sigma) * 100) / 100;

      const probCorrected = independentNormalCdf(zCorrected);

      const probUncorrected = independentNormalCdf(zUncorrected);

      expectNumericParts(inst.parts, [probCorrected, probUncorrected], 0.0005);

      expectMaterialNumericParts(inst.parts);
    }
  });
});

describe('ch06 areasForwardLookup', () => {
  const t = byId('ch06-gen-areas-forward-lookup');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('the mcq choice at the declared answer index matches an independently-integrated Phi difference', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { z1, z2 } = inst.params as Record<string, number>;

      const area = independentNormalCdf(z2) - independentNormalCdf(z1);

      const part = inst.parts[0];

      expect(part.kind).toBe('mcq');

      if (part.kind === 'mcq') {
        expect(part.choices.length).toBe(4);

        const declared = Number.parseFloat(part.choices[part.answer]);

        expect(Math.abs(declared - area)).toBeLessThanOrEqual(0.0006);
      }
    }
  });
});

describe('ch06 areasSymmetryFact', () => {
  const t = byId('ch06-gen-areas-symmetry-fact');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('P(Z>z) matches an independently-integrated Phi, and the symmetry tf is always true', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { z } = inst.params as Record<string, number>;

      expect(z).toBeGreaterThanOrEqual(0.5 - 1e-9);

      expect(z).toBeLessThanOrEqual(2.8 + 1e-9);

      const probRight = 1 - independentNormalCdf(z);

      expectNumericParts(inst.parts, [probRight], 0.0005);

      expectMaterialNumericParts(inst.parts);

      const tfPart = inst.parts.find((p) => p.kind === 'tf');

      expect(tfPart?.kind).toBe('tf');

      if (tfPart?.kind === 'tf') expect(tfPart.answer).toBe(true);
    }
  });
});

describe('ch06 areasInverseSymmetric', () => {
  const t = byId('ch06-gen-areas-inverse-symmetric');

  const SMALL_SEEDS = 250;

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    const first = wordingOf(t.generate(mulberry32(0)).prompt);

    for (let seed = 1; seed < SMALL_SEEDS; seed++) {
      expect(wordingOf(t.generate(mulberry32(seed)).prompt)).toBe(first);
    }
  });

  it('k matches an independently bisected Phi^-1 for P(-k<Z<k)=p', () => {
    for (let seed = 0; seed < SMALL_SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { p } = inst.params as Record<string, number>;

      const k = independentInvNormalCdf(0.5 + p / 2);

      expectNumericParts(inst.parts, [k], 0.01);

      expectMaterialNumericParts(inst.parts);
    }
  });
});

describe('ch06 exponentialPoissonReverse', () => {
  const t = byId('ch06-gen-exponential-poisson-reverse');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('the mean matches 1/lambda and the Poisson probability matches an independently computed pmf', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { lambda, k, t: time } = inst.params as Record<string, number>;

      const meanWait = 1 / lambda;

      const lambdaT = lambda * time;

      let factorialK = 1;

      for (let i = 2; i <= k; i++) factorialK *= i;

      const poissonProb = (Math.exp(-lambdaT) * lambdaT ** k) / factorialK;

      expectNumericParts(inst.parts, [meanWait, poissonProb], 0.001);

      expectMaterialNumericParts(inst.parts);
    }
  });
});

describe('ch06 exponentialPoissonEquivalence', () => {
  const t = byId('ch06-gen-exponential-poisson-equivalence');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    assertStableWording(t);
  });

  it('the exponential survival and the Poisson zero-event probability agree exactly', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { lambda, tMinutes } = inst.params as Record<string, number>;

      const tHours = tMinutes / 60;

      // Computed the long way round -- the Poisson pmf at k=0 with mean
      // lambda*t -- rather than reusing exp(-lambda*t), so that the identity
      // P(X > t) = P(N = 0) is genuinely re-derived rather than assumed.
      const poissonZero = ((lambda * tHours) ** 0 / 1) * Math.exp(-(lambda * tHours));

      expectNumericParts(inst.parts, [poissonZero, poissonZero], 0.0006);

      expectMaterialNumericParts(inst.parts);
    }
  });
});
