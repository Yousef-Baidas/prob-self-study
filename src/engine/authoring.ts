import type { Difficulty, QuestionInstance, QuestionTemplate } from './types';

import type { SeededRng } from './rng';

export function bookQuestion(meta: {
  id: string;

  chapter: string;

  topic: string;

  difficulty: Difficulty;

  citation?: string;

  instance: QuestionInstance;
}): QuestionTemplate {

  const { instance, ...rest } = meta;

  return { ...rest, source: 'book', generate: () => instance };
}

export function generatedQuestion(meta: {
  id: string;

  chapter: string;

  topic: string;

  difficulty: Difficulty;

  generate: (rng: SeededRng) => QuestionInstance;
}): QuestionTemplate {

  return { ...meta, source: 'generated' };
}
