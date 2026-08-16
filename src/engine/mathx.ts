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
 * quartile(xs, 2) equals median(xs): L2 = (n+1)/2 is whole for odd n
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

/**
 * Φ⁻¹(p): the inverse CDF (probit) of the standard normal — "the normal curve
 * in reverse" (Walpole 9e §6.3), needed wherever a chapter asks for the value
 * of z (or x) that leaves a stated area under the curve, rather than the area
 * itself.
 *
 * Peter Acklam's rational-approximation coefficients, refined by one step of
 * Halley's method against `normalCdf` above so the result is the exact inverse
 * of this module's own Φ — forward and reverse questions stay mutually
 * consistent. That consistency costs absolute accuracy: raw Acklam is ~4e-9,
 * but `normalCdf` is A&S 7.1.26 (~1.5e-7), so the refined value inherits its
 * error (~1e-6 over the central range). Far inside the 2dp precision Table A.3
 * questions grade at.
 */
export function invNormalCdf(p: number): number {
  if (!(p > 0 && p < 1)) throw new RangeError('invNormalCdf: p must be strictly between 0 and 1');

  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.38357751867269e2, -3.066479806614716e1, 2.506628277459239,
  ];

  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1,
  ];

  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838,
    -2.549732539343734, 4.374664141464968, 2.938163982698783,
  ];

  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];

  const pLow = 0.02425;

  const pHigh = 1 - pLow;

  let x: number;

  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p));

    x =
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= pHigh) {
    const q = p - 0.5;

    const r = q * q;

    x =
      ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));

    x =
      -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }

  // One step of Halley's rational method, using normalCdf directly rather
  // than a second independent erf-based formula, tightens the already-small
  // error of the rational approximation above.
  const e = normalCdf(x) - p;

  const u = e * Math.sqrt(2 * Math.PI) * Math.exp((x * x) / 2);

  x = x - u / (1 + (x * u) / 2);

  return x;
}
