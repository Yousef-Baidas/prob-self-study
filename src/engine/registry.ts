import type { Difficulty, QuestionSource, QuestionTemplate } from './types';

import { ch01Generators } from './generators/ch01';

import { ch02Generators } from './generators/ch02';

import { ch03Generators } from './generators/ch03';

import { ch01Book } from './questions/ch01.book';

import { ch02Book } from './questions/ch02.book';

import { ch03Book } from './questions/ch03.book';

/** Every question template — book and generated, every chapter — in one array. */
export const allTemplates: QuestionTemplate[] = [
  ...ch01Generators,

  ...ch02Generators,

  ...ch03Generators,

  ...ch01Book,

  ...ch02Book,

  ...ch03Book,
];

export type SelectOptions = {
  /** One chapter slug, or several — a worksheet may span chapters. */
  chapter?: string | readonly string[];

  topic?: string;

  source?: QuestionSource | 'both';

  difficulty?: Difficulty;
};

/** Filter `allTemplates` by chapter/topic/source/difficulty. Omitted `opts` returns everything. */
export function selectTemplates(opts: SelectOptions = {}): QuestionTemplate[] {
  const { chapter, topic, source, difficulty } = opts;

  // An empty array means "no chapters selected", not "every chapter" — a caller
  // that wants everything omits the key entirely.
  const wanted = chapter == null ? null : typeof chapter === 'string' ? [chapter] : chapter;

  return allTemplates.filter((t) => {
    if (wanted && !wanted.includes(t.chapter)) return false;

    if (topic && t.topic !== topic) return false;

    if (difficulty && t.difficulty !== difficulty) return false;

    if (source && source !== 'both' && t.source !== source) return false;

    return true;
  });
}

/** The distinct topics present among templates for the given chapter. */
export function topicsForChapter(chapter: string): string[] {
  return [...new Set(selectTemplates({ chapter }).map((t) => t.topic))];
}
