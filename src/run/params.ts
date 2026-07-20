// Three-state query-parameter primitives.
//
// The site is statically built, so a practice link's query string is the only
// way state reaches a runner. Every parameter is therefore in one of three
// states — absent, present-but-invalid, or valid — and a guard like `!raw.source`
// silently merges the first two. These primitives keep them apart by construction
// so a mode cannot accidentally reject an omitted parameter it meant to default.

export type Parsed<T, R extends string = string> =
  | { ok: true; value: T }
  | { ok: false; reason: R };

/** A parameter the mode cannot run without: absent and unrecognised both fail. */
export function requireSlug<R extends string>(
  raw: string | null,
  allowed: readonly string[],
  reason: R,
): Parsed<string, R> {
  if (!raw || !allowed.includes(raw)) return { ok: false, reason };
  return { ok: true, value: raw };
}

/** A parameter with a default: absent takes the fallback, supplied-and-wrong fails. */
export function optionalEnum<T extends string, R extends string>(
  raw: string | null,
  allowed: readonly T[],
  fallback: T,
  reason: R,
): Parsed<T, R> {
  if (raw == null) return { ok: true, value: fallback };
  if (!allowed.includes(raw as T)) return { ok: false, reason };
  return { ok: true, value: raw as T };
}

/**
 * A bounded integer. Recovers rather than failing — an unreadable count still
 * yields a usable run, the same reasoning applied to an unreadable seed.
 */
export function optionalInt(raw: string | null, min: number, max: number, fallback: number): number {
  if (raw == null || !/^\d+$/.test(raw)) return fallback;
  const n = Number(raw);
  if (!Number.isInteger(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}
