import { drawTemplates } from './select';
import { deriveQuestionSeeds } from './exam';
import { mulberry32 } from '../engine/rng';
import { chapters } from '../lib/site';
import { coerceCount } from '../lib/seed';
import type { ExamSource, ExamQuestion } from './types';

export interface WorksheetSpec {
  chapter: string;
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
  const draw = drawTemplates(spec.chapter, spec.source, spec.count, spec.topic);
  const seeds = deriveQuestionSeeds(spec.seed, draw.templates.length);
  const questions = draw.templates.map((template, i) => ({
    template,
    seed: seeds[i],
    instance: template.generate(mulberry32(seeds[i])),
  }));
  return { spec, questions, requested: draw.requested, delivered: draw.delivered, capped: draw.capped };
}

const VALID_SOURCES: readonly ExamSource[] = ['book', 'generated', 'both'];

export type ParseWorksheetResult =
  | { ok: true; spec: WorksheetSpec }
  | { ok: false; reason: 'chapter' | 'source' | 'topic' };

export function parseWorksheetSpec(
  raw: { chapter: string | null; topic: string | null; source: string | null; count: string | null },
  seed: number,
): ParseWorksheetResult {
  const chapter = chapters.find((c) => c.slug === raw.chapter);
  if (!chapter) return { ok: false, reason: 'chapter' };
  if (!raw.source || !VALID_SOURCES.includes(raw.source as ExamSource)) return { ok: false, reason: 'source' };
  const topic = raw.topic || undefined;
  if (topic && !chapter.topics.includes(topic)) return { ok: false, reason: 'topic' };
  return { ok: true, spec: { chapter: chapter.slug, topic, source: raw.source as ExamSource, count: coerceCount(raw.count), seed } };
}
