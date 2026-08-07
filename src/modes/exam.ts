import { mulberry32 } from '../engine/rng';
import { drawTemplates } from './select';
import type { ExamSpec, ExamSession } from './types';
import { gradeInstance, type GivenAnswer } from '../engine/grade';
import type { ExamResult } from './types';

const MAX_SEED = 0xffffffff;

export function deriveQuestionSeeds(masterSeed: number, n: number): number[] {
  const rng = mulberry32(masterSeed);
  return Array.from({ length: n }, () => rng.int(0, MAX_SEED));
}

export function buildExamSession(spec: ExamSpec): ExamSession {
  const draw = drawTemplates(spec.chapter, spec.source, spec.count, undefined, spec.difficulty);
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

// Reading a spec out of a practice link is lifecycle, not compute — it lives in
// src/run/exam.ts alongside seeding and the rest of the run.
