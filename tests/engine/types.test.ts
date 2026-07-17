import { describe, expect, it } from 'vitest';

import type { AnswerPart, QuestionInstance, QuestionTemplate } from '../../src/engine/types';

import { mulberry32 } from '../../src/engine/rng';

describe('engine types', () => {
  it('an AnswerPart union member is well-formed', () => {
    const p: AnswerPart = { kind: 'numeric', answer: 0.5, tol: 0.001 };

    expect(p.kind).toBe('numeric');
  });

  it('a QuestionTemplate can be generated into an instance', () => {
    const t: QuestionTemplate = {
      id: 't1',

      chapter: 'probability',

      topic: 'demo',

      difficulty: 'easy',

      source: 'generated',

      generate: (): QuestionInstance => ({
        prompt: 'What is $1+1$?',

        parts: [{ kind: 'numeric', answer: 2, tol: 0 }],

        solution: [{ text: '$1+1=2$.' }],
      }),
    };

    const inst = t.generate(mulberry32(1));

    expect(inst.parts).toHaveLength(1);
  });
});
