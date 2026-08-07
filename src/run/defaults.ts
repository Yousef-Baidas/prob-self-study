// The defaults a setup form pre-selects and the defaults a parser falls back to
// are the same fact. They are written once here and imported by both, so a bare
// practice link always behaves like clicking through the form.

import type { DifficultyFilter, ExamSource } from '../modes/types';

export const SOURCES: readonly ExamSource[] = ['book', 'generated', 'both'];

/** 'any' is the default everywhere — no difficulty filter, today's behaviour. */
export const DIFFICULTIES: readonly DifficultyFilter[] = ['any', 'easy', 'medium', 'hard'];
export const DIFFICULTY_DEFAULT: DifficultyFilter = 'any';

export const COUNT_MIN = 1;
export const COUNT_MAX = 50;

export const EXAM_DEFAULTS = {
  source: 'both' as ExamSource,
  count: 10,
  difficulty: DIFFICULTY_DEFAULT,
} as const;

/** Eight fits a printed sheet better than ten; deliberately not the exam default. */
export const WORKSHEET_DEFAULTS = {
  source: 'both' as ExamSource,
  count: 8,
  difficulty: DIFFICULTY_DEFAULT,
} as const;
