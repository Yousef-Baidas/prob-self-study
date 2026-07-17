import { describe, expect, it } from 'vitest';

import { ch01Book } from '../../../src/engine/questions/ch01.book';

import { ch02Book } from '../../../src/engine/questions/ch02.book';

import { gradePart } from '../../../src/engine/grade';

import { mulberry32 } from '../../../src/engine/rng';

const all = [...ch01Book, ...ch02Book];

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
