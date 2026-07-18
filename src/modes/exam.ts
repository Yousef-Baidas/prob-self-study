import { mulberry32 } from '../engine/rng';
import { drawTemplates } from './select';
import type { ExamSpec, ExamSession } from './types';
import { gradeInstance, type GivenAnswer } from '../engine/grade';
import { chapters } from '../lib/site';
import { coerceCount } from '../lib/seed';
import type { ExamSource, ExamResult } from './types';

const MAX_SEED = 0xffffffff;

export function deriveQuestionSeeds(masterSeed: number, n: number): number[] {
  const rng = mulberry32(masterSeed);
  return Array.from({ length: n }, () => rng.int(0, MAX_SEED));
}

export function buildExamSession(spec: ExamSpec): ExamSession {
  const draw = drawTemplates(spec.chapter, spec.source, spec.count);
  const seeds = deriveQuestionSeeds(spec.seed, draw.templates.length);
  const questions = draw.templates.map((template, i) => ({
    template,
    seed: seeds[i],
    instance: template.generate(mulberry32(seeds[i])),
  }));
  return { spec, questions, requested: draw.requested, delivered: draw.delivered, capped: draw.capped };
}

export function gradeExamSession(session: ExamSession, answers: GivenAnswer[][]): ExamResult {
  const perQuestion = session.questions.map((q, i) => {
    const graded = gradeInstance(q.instance, answers[i] ?? q.instance.parts.map(() => null));
    return { correct: graded.correct, parts: graded.parts };
  });
  return { score: perQuestion.filter((r) => r.correct).length, total: session.questions.length, perQuestion };
}

const VALID_SOURCES: readonly ExamSource[] = ['book', 'generated', 'both'];

export type ParseSpecResult =
  | { ok: true; spec: ExamSpec }
  | { ok: false; reason: 'chapter' | 'source' };

export function parseExamSpec(
  raw: { chapter: string | null; source: string | null; count: string | null },
  seed: number,
): ParseSpecResult {
  if (!raw.chapter || !chapters.some((c) => c.slug === raw.chapter)) return { ok: false, reason: 'chapter' };
  if (!raw.source || !VALID_SOURCES.includes(raw.source as ExamSource)) return { ok: false, reason: 'source' };
  return { ok: true, spec: { chapter: raw.chapter, source: raw.source as ExamSource, count: coerceCount(raw.count), seed } };
}
