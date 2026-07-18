import type { QuestionTemplate } from '../engine/types';
import { selectTemplates } from '../engine/registry';
import type { ExamSource } from './types';

const DIFF_RANK: Record<string, number> = { easy: 0, medium: 1, hard: 2 };

export function orderByDifficulty(templates: QuestionTemplate[]): QuestionTemplate[] {
  return [...templates].sort((a, b) => {
    const d = (DIFF_RANK[a.difficulty] ?? 99) - (DIFF_RANK[b.difficulty] ?? 99);
    return d !== 0 ? d : a.id.localeCompare(b.id);
  });
}

export interface DrawResult {
  templates: QuestionTemplate[];
  requested: number;
  delivered: number;
  capped: boolean;
}

export function drawTemplates(chapter: string, source: ExamSource, count: number): DrawResult {
  const pool = orderByDifficulty(selectTemplates({ chapter, source }));
  let templates: QuestionTemplate[];
  if (source === 'book' || pool.length === 0 || pool.length >= count) {
    templates = pool.slice(0, count); // book caps here; generated/both with enough distinct also take first N
  } else {
    // generated/both, pool < count: round-robin to full coverage, then re-order easy→hard
    const filled = Array.from({ length: count }, (_, i) => pool[i % pool.length]);
    templates = orderByDifficulty(filled);
  }
  return { templates, requested: count, delivered: templates.length, capped: templates.length < count };
}
