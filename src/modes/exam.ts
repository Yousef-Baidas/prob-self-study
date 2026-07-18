import { mulberry32 } from '../engine/rng';
import { drawTemplates } from './select';
import type { ExamSpec, ExamSession } from './types';

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
