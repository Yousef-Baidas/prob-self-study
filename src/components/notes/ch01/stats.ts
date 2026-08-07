// Shared arithmetic for the ch01 charts, so a chart's Q1/median/fences are
// computed from the same values the prose quotes rather than retyped by hand.
// Uses the position-and-interpolate quartile rule from Walpole §1.4
// (L_k = k(n+1)/4), matching the worked examples in intro.mdx.

export const mean = (values: number[]): number => values.reduce((sum, v) => sum + v, 0) / values.length;

export const median = (sorted: number[]): number => {
  const n = sorted.length;

  const mid = Math.floor(n / 2);

  return n % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

export const quartile = (sorted: number[], k: 1 | 2 | 3): number => {
  const n = sorted.length;

  const position = (k * (n + 1)) / 4;

  const j = Math.floor(position);

  const f = position - j;

  const lower = sorted[Math.min(Math.max(j - 1, 0), n - 1)];

  const upper = sorted[Math.min(j, n - 1)];

  return f === 0 ? lower : lower + f * (upper - lower);
};

export interface IqrStats {
  q1: number;

  q2: number;

  q3: number;

  iqr: number;

  lowerFence: number;

  upperFence: number;
}

export const iqrStats = (sorted: number[]): IqrStats => {
  const q1 = quartile(sorted, 1);

  const q2 = quartile(sorted, 2);

  const q3 = quartile(sorted, 3);

  const iqr = q3 - q1;

  return { q1, q2, q3, iqr, lowerFence: q1 - 1.5 * iqr, upperFence: q3 + 1.5 * iqr };
};
