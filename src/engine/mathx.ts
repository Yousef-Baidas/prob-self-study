export function factorial(n: number): number {
  let r = 1;

  for (let i = 2; i <= n; i++) r *= i;

  return r;
}

export function nPr(n: number, r: number): number {
  return factorial(n) / factorial(n - r);
}

export function nCr(n: number, r: number): number {
  return factorial(n) / (factorial(r) * factorial(n - r));
}

export function mean(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);

  const n = s.length;

  const mid = n >> 1;

  return n % 2 === 1 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function populationVariance(xs: number[]): number {
  const m = mean(xs);

  return xs.reduce((a, x) => a + (x - m) ** 2, 0) / xs.length;
}

export function sampleVariance(xs: number[]): number {
  const m = mean(xs);

  return xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1);
}

export function sampleStdDev(xs: number[]): number {
  return Math.sqrt(sampleVariance(xs));
}

/**
 * The k-th quartile by position: sort, take the position L = k(n+1)/4, and
 * read the value at exactly that position, interpolating between neighbours
 * when L is fractional. A position of 2.75 means three quarters of the way
 * from x2 to x3 -- not the nearest observation, and not the median-of-halves
 * rule, which reports a different number on the same sample.
 *
 * For n <= 2 the outer positions fall outside the sample (L = 0.75 when
 * n = 2, so there is no x0 to interpolate from). Those clamp to the end
 * value, matching R's type-6 quantile, so a degenerate sample still returns
 * a number rather than forcing every caller to special-case it.
 *
 * quartile(xs, 2) is identically median(xs): L2 = (n+1)/2 is whole for odd n
 * and exactly j + 0.5 for even n, which are the two branches of the median.
 */
export function quartile(xs: number[], k: 1 | 2 | 3): number {
  const s = [...xs].sort((a, b) => a - b);

  const n = s.length;

  const L = (k * (n + 1)) / 4;

  if (L <= 1) return s[0];

  if (L >= n) return s[n - 1];

  const j = Math.floor(L);

  const f = L - j;

  return f === 0 ? s[j - 1] : s[j - 1] + f * (s[j] - s[j - 1]);
}

/** Spread as the width of the middle half of the sample: Q3 - Q1. */
export function iqr(xs: number[]): number {
  return quartile(xs, 3) - quartile(xs, 1);
}

/**
 * Rounds half-way values toward +∞ (`Math.round`'s convention), but `x * f`
 * is computed in binary floating point, so a decimal that looks exactly
 * half-way is not always represented that way: `round(1.005, 2)` yields `1`,
 * not `1.01`, because `1.005 * 100 === 100.49999999999999` (verified).
 */
export function round(x: number, dp: number): number {
  const f = 10 ** dp;

  return Math.round(x * f) / f;
}

/** Abramowitz & Stegun 7.1.26 approximation of the error function. */
export function erf(x: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));

  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-x * x);

  return x >= 0 ? y : -y;
}

/** Φ(z): CDF of the standard normal distribution. */
export function normalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}
