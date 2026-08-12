import { describe, expect, it } from 'vitest';

import { selectTemplates } from '../../../src/engine/registry';

import { gradePart } from '../../../src/engine/grade';

import { mulberry32 } from '../../../src/engine/rng';

// Sourced from the registry rather than a hand-kept list of chapter imports.
// This file used to import ch01Book and ch02Book by name, so Ch3's book
// questions were never integrity-checked at all, and Ch4's and Ch5's would have
// slipped through the same way — a new chapter's book bank was only covered if
// someone remembered this file. Asking the registry means it always is.
const all = selectTemplates({ source: 'book' });

describe('book bank integrity', () => {
  it('every book question is tagged source=book and has a citation', () => {
    for (const t of all) {
      expect(t.source).toBe('book');

      expect(typeof t.citation).toBe('string');
    }
  });

  it('grading each part with its own declared answer returns true (or null for short)', () => {
    for (const t of all) {
      const inst = t.generate(mulberry32(1));

      for (const part of inst.parts) {
        const declared =
          part.kind === 'numeric' ? part.answer
          : part.kind === 'mcq' ? part.answer
          : part.kind === 'tf' ? part.answer
          : 'x';

        const verdict = gradePart(part, declared);

        expect(verdict === true || verdict === null).toBe(true);
      }
    }
  });

  it('ids are unique', () => {
    const ids = all.map((t) => t.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});
