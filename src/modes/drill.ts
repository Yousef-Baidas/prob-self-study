import { mulberry32 } from '../engine/rng';
import { selectTemplates } from '../engine/registry';
import { narrowDifficulty, orderByDifficulty } from './select';
import type { QuestionInstance, QuestionTemplate } from '../engine/types';
import type { DifficultyFilter } from './types';

const MAX_SEED = 0xffffffff;

export interface DrillTopic { chapter: string; topic: string }
export interface DrillSpec { chapter: string; topic: string; seed: number; difficulty?: DifficultyFilter }
export interface DrillQuestion { template: QuestionTemplate; seed: number; instance: QuestionInstance }

/**
 * Distinct chapter/topic pairs that have at least one generated template at the
 * given difficulty. Called with no argument (or 'any'), this returns exactly the
 * generator-backed topics regardless of difficulty — the pre-difficulty list.
 */
export function drillTopics(difficulty?: DifficultyFilter): DrillTopic[] {
  const seen = new Set<string>();
  const out: DrillTopic[] = [];
  for (const t of selectTemplates({ source: 'generated', difficulty: narrowDifficulty(difficulty) })) {
    const key = `${t.chapter} ${t.topic}`;
    if (!seen.has(key)) { seen.add(key); out.push({ chapter: t.chapter, topic: t.topic }); }
  }
  return out;
}

/** The generated templates for a topic, in a stable easy→hard order. */
export function drillPool(chapter: string, topic: string, difficulty?: DifficultyFilter): QuestionTemplate[] {
  return orderByDifficulty(
    selectTemplates({ chapter, topic, source: 'generated', difficulty: narrowDifficulty(difficulty) }),
  );
}

/** Deterministic per-question seed for the index-th slot of a drill stream. */
export function drillQuestionSeed(masterSeed: number, index: number): number {
  const mixed = (masterSeed ^ Math.imul(index + 1, 0x9e3779b1)) >>> 0;
  return mulberry32(mixed).int(0, MAX_SEED);
}

/** The index-th question of an endless, reproducible, never-repeating stream. */
export function buildDrillQuestion(
  chapter: string,
  topic: string,
  seed: number,
  index: number,
  difficulty?: DifficultyFilter,
): DrillQuestion {
  const pool = drillPool(chapter, topic, difficulty);
  const template = pool[index % pool.length]; // round-robin generators
  const qSeed = drillQuestionSeed(seed, index);
  return { template, seed: qSeed, instance: template.generate(mulberry32(qSeed)) };
}

// Reading a spec out of a practice link — including decoding the topic key —
// is lifecycle, not compute. It lives in src/run/drill.ts.
