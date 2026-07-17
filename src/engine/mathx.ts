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
