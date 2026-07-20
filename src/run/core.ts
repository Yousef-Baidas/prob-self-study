// Shared run lifecycle pieces. Nothing outside src/run imports this directly —
// each mode's run module is the interface an island learns.
//
// Everything here is pure. Effects a run implies (rewriting the address bar,
// storing a best streak) are returned as data for the island to perform, which
// is what lets the whole lifecycle be tested without a DOM.

import { parseSeed } from '../lib/seed';

/**
 * An unreadable seed is replaced rather than treated as fatal: a corrupt link
 * still gives a working run, and the caller writes the resolved seed back so the
 * link becomes shareable again. Absent and unreadable are handled the same way
 * on purpose — a seed is the one parameter where a wrong value still produces a
 * perfectly good run.
 */
export function resolveSeed(raw: string | null, roll: () => number): number {
  return parseSeed(raw) ?? roll();
}

/** Apply a patch to a search string; a null value removes the parameter. */
export function buildSearch(search: string, patch: Record<string, string | null>): string {
  const params = new URLSearchParams(search);
  for (const [key, value] of Object.entries(patch)) {
    if (value == null) params.delete(key);
    else params.set(key, value);
  }
  const next = params.toString();
  return next ? `?${next}` : '';
}
