import { describe, expect, it } from 'vitest';

import { chapterStatus, notedSlugs } from '../../src/lib/chapterNotes';

import { chapters } from '../../src/lib/site';

describe('chapterNotes', () => {
  it('reads the notes that exist rather than a hand-kept list', () => {
    expect([...notedSlugs].sort()).toEqual([
      'discrete-distributions',
      'expectation',
      'intro',
      'probability',
      'random-variables',
    ]);
  });

  it('calls a chapter available exactly when its notes exist', () => {
    // The old failure: the index badge and the chapter page disagreed, because
    // one read a `status` literal and the other looked up a notes map. Both now
    // ask this, so "Available" and a rendered page cannot come apart.
    for (const c of chapters) {
      expect(chapterStatus(c.slug)).toBe(notedSlugs.has(c.slug) ? 'available' : 'coming-soon');
    }
  });

  it('calls an unwritten chapter coming-soon', () => {
    expect(chapterStatus('regression')).toBe('coming-soon');
  });
});
