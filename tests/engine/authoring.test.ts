import { describe, expect, it } from 'vitest';

import { bookQuestion, generatedQuestion } from '../../src/engine/authoring';

import { mulberry32 } from '../../src/engine/rng';

describe('bookQuestion', () => {
  it('tags source book and returns the same instance regardless of seed', () => {
    const t = bookQuestion({
      id: 'b1',

      chapter: 'probability',

      topic: 'counting',

      difficulty: 'easy',

      citation: 'Walpole Ex. 2.1',

      instance: {
        prompt: 'How many outcomes?',

        parts: [{ kind: 'numeric', answer: 6, tol: 0 }],

        solution: [{ text: 'six.' }],
      },
    });

    expect(t.source).toBe('book');

    expect(t.citation).toBe('Walpole Ex. 2.1');

    expect(t.generate(mulberry32(1))).toEqual(t.generate(mulberry32(999)));
  });
});

describe('generatedQuestion', () => {
  it('tags source generated and is deterministic per seed', () => {
    const t = generatedQuestion({
      id: 'g1',

      chapter: 'probability',

      topic: 'counting',

      difficulty: 'medium',

      generate: (rng) => {
        const n = rng.int(1, 100);

        return { prompt: `n=${n}`, parts: [{ kind: 'numeric', answer: n, tol: 0 }], solution: [] };
      },
    });

    expect(t.source).toBe('generated');

    expect(t.generate(mulberry32(5))).toEqual(t.generate(mulberry32(5)));
  });
});
