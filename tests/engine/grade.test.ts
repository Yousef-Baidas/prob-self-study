import { describe, expect, it } from 'vitest';

import { gradePart, gradeInstance } from '../../src/engine/grade';

import type { QuestionInstance } from '../../src/engine/types';

describe('gradePart', () => {
  it('numeric: accepts within tolerance, rejects outside', () => {
    const part = { kind: 'numeric', answer: 0.25, tol: 0.001 } as const;

    expect(gradePart(part, 0.25)).toBe(true);

    expect(gradePart(part, 0.2515)).toBe(false);

    expect(gradePart(part, 0.2495)).toBe(true);
  });

  it('numeric: non-number given is wrong', () => {
    expect(gradePart({ kind: 'numeric', answer: 1, tol: 0 }, 'x')).toBe(false);
  });

  it('mcq: exact index match', () => {
    const part = { kind: 'mcq' as const, choices: ['a', 'b', 'c'], answer: 1 };

    expect(gradePart(part, 1)).toBe(true);

    expect(gradePart(part, 0)).toBe(false);
  });

  it('tf: exact boolean match', () => {
    expect(gradePart({ kind: 'tf', answer: true }, true)).toBe(true);

    expect(gradePart({ kind: 'tf', answer: true }, false)).toBe(false);
  });

  it('short: returns null (self-graded)', () => {
    expect(gradePart({ kind: 'short', answer: 'because' }, 'anything')).toBeNull();
  });
});

describe('gradeInstance', () => {
  const inst: QuestionInstance = {
    prompt: 'Find E[X] and Var(X).',

    parts: [
      { kind: 'numeric', label: 'E[X]', answer: 2, tol: 0.001 },
      { kind: 'numeric', label: 'Var(X)', answer: 1, tol: 0.001 },
    ],

    solution: [{ text: 'steps' }],
  };

  it('all parts correct → correct', () => {
    expect(gradeInstance(inst, [2, 1])).toEqual({ correct: true, parts: [true, true] });
  });

  it('one part wrong → not correct', () => {
    expect(gradeInstance(inst, [2, 5])).toEqual({ correct: false, parts: [true, false] });
  });

  it('self-graded short part does not block correct', () => {
    const withShort: QuestionInstance = {
      prompt: 'Find E[X] and explain why.',

      parts: [
        { kind: 'numeric', label: 'E[X]', answer: 2, tol: 0.001 },
        { kind: 'short', label: 'Explanation', answer: 'because' },
      ],

      solution: [{ text: 'steps' }],
    };

    const res = gradeInstance(withShort, [2, 'anything']);

    expect(res.parts).toEqual([true, null]);

    expect(res.correct).toBe(true);
  });
});
