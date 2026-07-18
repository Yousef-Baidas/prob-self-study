// Pure base-path join helper — takes `base` as an argument (never reads
// import.meta.env at module scope) so it stays unit-testable without Astro.
// Usage: joinBase(import.meta.env.BASE_URL, `chapters/${slug}`) for every
// internal link/asset so nothing 404s under the GitHub Pages base path.
export function joinBase(base: string, path: string): string {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;

  const normalizedPath = path.replace(/^\/+/, '');

  return `${normalizedBase}${normalizedPath}`;
}
