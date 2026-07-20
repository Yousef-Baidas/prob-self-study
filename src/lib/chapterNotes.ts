// Whether a chapter has summary notes yet, answered by the notes directory
// itself rather than by a status anyone has to remember to update. The badge on
// the chapters index and the notes-vs-ComingSoon branch on the chapter page now
// read the same fact, so the index cannot advertise a page that isn't there.
//
// Adding a chapter's notes is one edit: drop in src/notes/<slug>.mdx.
//
// Import this from `.astro` only. The glob makes every notes file reachable, so
// pulling it into something an island imports would emit them all as client
// chunks — see the note in site.ts.
import type { MDXInstance } from 'astro';

const notes = import.meta.glob<MDXInstance<Record<string, unknown>>>('../notes/*.mdx');

const slugOf = (path: string): string => path.slice(path.lastIndexOf('/') + 1, -'.mdx'.length);

export type ChapterStatus = 'available' | 'coming-soon';

/** Chapter slugs that have notes written. */
export const notedSlugs: ReadonlySet<string> = new Set(Object.keys(notes).map(slugOf));

export const chapterStatus = (slug: string): ChapterStatus =>
  notedSlugs.has(slug) ? 'available' : 'coming-soon';

/**
 * The notes component for a chapter, or null if that chapter has none yet.
 * Lazy on purpose: only the chapter being rendered gets parsed.
 */
export async function loadChapterNotes(slug: string) {
  const found = Object.entries(notes).find(([path]) => slugOf(path) === slug);

  if (!found) return null;

  return (await found[1]()).default;
}
