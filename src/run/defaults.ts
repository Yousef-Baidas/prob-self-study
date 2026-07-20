// The defaults a setup form pre-selects and the defaults a parser falls back to
// are the same fact. They are written once here and imported by both, so a bare
// practice link always behaves like clicking through the form.

import type { ExamSource } from '../modes/types';

export const SOURCES: readonly ExamSource[] = ['book', 'generated', 'both'];

export const COUNT_MIN = 1;
export const COUNT_MAX = 50;

export const EXAM_DEFAULTS = {
  source: 'both' as ExamSource,
  count: 10,
} as const;

/** Eight fits a printed sheet better than ten; deliberately not the exam default. */
export const WORKSHEET_DEFAULTS = {
  source: 'both' as ExamSource,
  count: 8,
} as const;
