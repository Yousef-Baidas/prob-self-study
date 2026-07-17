import type { Difficulty, QuestionSource, QuestionTemplate } from './types';

import { ch01Generators } from './generators/ch01';

import { ch02Generators } from './generators/ch02';

import { ch01Book } from './questions/ch01.book';

import { ch02Book } from './questions/ch02.book';

/** Every question template — book and generated, both chapters — in one array. */
export const allTemplates: QuestionTemplate[] = [
  ...ch01Generators,

  ...ch02Generators,

  ...ch01Book,

  ...ch02Book,
];

export type SelectOptions = {
  chapter?: string;

  topic?: string;

  source?: QuestionSource | 'both';

  difficulty?: Difficulty;
};

/** Filter `allTemplates` by chapter/topic/source/difficulty. Omitted `opts` returns everything. */
export function selectTemplates(opts: SelectOptions = {}): QuestionTemplate[] {
  const { chapter, topic, source, difficulty } = opts;

  return allTemplates.filter((t) => {
    if (chapter && t.chapter !== chapter) return false;

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
