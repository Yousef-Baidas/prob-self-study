// Pure base-path join helper — takes `base` as an argument (never reads
// import.meta.env at module scope) so it stays unit-testable without Astro.
// Callers should reach this through route() in ./routes instead of importing
// it directly; this file stays the testable seam underneath that.
export function joinBase(base: string, path: string): string {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;

  const normalizedPath = path.replace(/^\/+/, '');

  return `${normalizedBase}${normalizedPath}`;
}
