// The island's half of the run seam — the only place in src/run that touches
// the browser. Every decision has already been made by the pure run modules;
// what is left here is carrying it out.
//
// Deliberately free of branching logic: this is the code the node test suite
// cannot reach, so it is kept too dull to be worth reaching. Anything that grows
// a rule belongs back behind the seam in a pure module.

/**
 * Settle the static setup panel once the run module has decided what was asked
 * for. The page hides it before paint on any run-ish query string to avoid a
 * flash; an idle run means nothing was really requested, so it is given back.
 */
export function reconcileSetup(id: string, status: 'idle' | 'error' | 'ready'): void {
  const el = document.getElementById(id);
  if (!el) return;
  if (status === 'idle') el.hidden = false;
  else el.remove();
}

/** Make the address bar match the run, so the link is shareable and reproducible. */
export function applyUrl(url: string): void {
  if (url && url !== window.location.search) history.replaceState(null, '', url);
}

export function readStoredNumber(key: string): number | undefined {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? undefined : Number(raw) || 0;
  } catch {
    return undefined; // private mode
  }
}

export function writeStored(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode: persistence is best-effort */
  }
}
