import { drawTemplates } from './select';
import { deriveQuestionSeeds } from './exam';
import { mulberry32 } from '../engine/rng';
import type { ExamSource, ExamQuestion } from './types';

export interface WorksheetSpec {
  /** One or more chapter slugs — a sheet may mix chapters in any combination. */
  chapters: string[];
  topic?: string;
  source: ExamSource;
  count: number;
  seed: number;
}

export interface WorksheetSession {
  spec: WorksheetSpec;
  questions: ExamQuestion[];
  requested: number;
  delivered: number;
  capped: boolean;
}

export function buildWorksheetSession(spec: WorksheetSpec): WorksheetSession {
  const draw = drawTemplates(spec.chapters, spec.source, spec.count, spec.topic);
  const seeds = deriveQuestionSeeds(spec.seed, draw.templates.length);
  const questions = draw.templates.map((template, i) => ({
    template,
    seed: seeds[i],
    instance: template.generate(mulberry32(seeds[i])),
  }));
  return { spec, questions, requested: draw.requested, delivered: draw.delivered, capped: draw.capped };
}

// Reading a spec out of a practice link is lifecycle, not compute — it lives in
// src/run/worksheet.ts alongside seeding and the rest of the run.
