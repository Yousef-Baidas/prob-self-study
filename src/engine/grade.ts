import type { AnswerPart, QuestionInstance } from './types';

export type GivenAnswer = number | string | boolean | null;

/** Grade one part. Returns null for self-graded `short` parts. */
export function gradePart(part: AnswerPart, given: GivenAnswer): boolean | null {
  switch (part.kind) {
    case 'numeric':
      return typeof given === 'number' && Math.abs(given - part.answer) <= part.tol;

    case 'mcq':
      return given === part.answer;

    case 'tf':
      return given === part.answer;

    case 'short':
      return null;
  }
}

/** Grade a whole instance. `correct` is true iff every non-self-graded part is correct. */
export function gradeInstance(
  instance: QuestionInstance,
  given: GivenAnswer[],
): { correct: boolean; parts: (boolean | null)[] } {
  const parts = instance.parts.map((part, i) => gradePart(part, given[i] ?? null));

  const correct = parts.every((p) => p === true || p === null);

  return { correct, parts };
}
