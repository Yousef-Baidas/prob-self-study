import type { SeededRng } from './rng';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type QuestionSource = 'book' | 'generated';

/** One gradable part of a question. Multi-part questions have several. */
export type AnswerPart =
  | { kind: 'numeric'; label?: string; answer: number; tol: number; unit?: string }

  | { kind: 'mcq'; label?: string; choices: string[]; answer: number }

  | { kind: 'tf'; label?: string; answer: boolean }

  | { kind: 'short'; label?: string; answer: string }; // self-graded

/** One step of a worked solution. `text` is KaTeX-enabled markdown. */
export type SolutionStep = {
  text: string;
};

/** A concrete question a mode can display and grade. */
export type QuestionInstance = {
  prompt: string; // KaTeX-enabled markdown

  parts: AnswerPart[];

  solution: SolutionStep[];

  /**
   * The sampled inputs behind this instance (dataset, n, r, probabilities…).
   * For verification/analytics only — modes MUST NOT render it. Lets generator
   * tests re-derive the answer independently without parsing the prompt string.
   */
  params?: Record<string, number | number[]>;
};

/**
 * A question producer. `generate` is a pure function of the passed rng:
 * (template, seed) always yields the identical instance. Book questions
 * ignore the rng and return a fixed instance.
 */
export type QuestionTemplate = {
  id: string;

  chapter: string; // chapter slug

  topic: string;

  difficulty: Difficulty;

  source: QuestionSource;

  citation?: string; // e.g. "Walpole Ex. 2.15" (book questions)

  generate(rng: SeededRng): QuestionInstance;
};
