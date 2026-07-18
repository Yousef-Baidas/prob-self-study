const MAX_SEED = 0xffffffff; // 2^32 - 1

export function rollSeed(): number {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    return crypto.getRandomValues(new Uint32Array(1))[0];
  }
  return Math.floor(Math.random() * (MAX_SEED + 1));
}

export function parseSeed(raw: string | null): number | null {
  if (raw == null || !/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 && n <= MAX_SEED ? n : null;
}

export function coerceCount(raw: string | null, fallback = 10, max = 50): number {
  if (raw == null) return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n)) return fallback;
  if (n < 1) return 1;
  if (n > max) return max;
  return n;
}
