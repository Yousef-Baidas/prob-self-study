export type SeededRng = {
  /** Uniform float in [0, 1). */
  next(): number;

  /** Uniform integer in [min, max], inclusive. */
  int(min: number, max: number): number;

  /** A uniformly chosen element of `arr`. */
  pick<T>(arr: readonly T[]): T;

  /** True with probability `p` (default 0.5). */
  bool(p?: number): boolean;
};

/** mulberry32 — a small, fast, fully-deterministic seeded PRNG. */
export function mulberry32(seed: number): SeededRng {
  let a = seed >>> 0;

  const next = (): number => {
    a = (a + 0x6d2b79f5) | 0;

    let t = Math.imul(a ^ (a >>> 15), 1 | a);

    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  return {
    next,

    int: (min, max) => min + Math.floor(next() * (max - min + 1)),

    pick: (arr) => arr[Math.floor(next() * arr.length)],

    bool: (p = 0.5) => next() < p,
  };
}
