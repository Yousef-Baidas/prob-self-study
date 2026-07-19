import { mulberry32 } from '../engine/rng';
import { selectTemplates } from '../engine/registry';
import { orderByDifficulty } from './select';
import type { QuestionInstance, QuestionTemplate } from '../engine/types';

const MAX_SEED = 0xffffffff;

export interface DrillTopic { chapter: string; topic: string }
export interface DrillSpec { chapter: string; topic: string; seed: number }
export interface DrillQuestion { template: QuestionTemplate; seed: number; instance: QuestionInstance }

/** Distinct chapter/topic pairs that have at least one generated template. */
export function drillTopics(): DrillTopic[] {
  const seen = new Set<string>();
  const out: DrillTopic[] = [];
  for (const t of selectTemplates({ source: 'generated' })) {
    const key = `${t.chapter} ${t.topic}`;
    if (!seen.has(key)) { seen.add(key); out.push({ chapter: t.chapter, topic: t.topic }); }
  }
  return out;
}

/** The generated templates for a topic, in a stable easy→hard order. */
export function drillPool(chapter: string, topic: string): QuestionTemplate[] {
  return orderByDifficulty(selectTemplates({ chapter, topic, source: 'generated' }));
}

/** Deterministic per-question seed for the index-th slot of a drill stream. */
export function drillQuestionSeed(masterSeed: number, index: number): number {
  const mixed = (masterSeed ^ Math.imul(index + 1, 0x9e3779b1)) >>> 0;
  return mulberry32(mixed).int(0, MAX_SEED);
}

/** The index-th question of an endless, reproducible, never-repeating stream. */
export function buildDrillQuestion(chapter: string, topic: string, seed: number, index: number): DrillQuestion {
  const pool = drillPool(chapter, topic);
  const template = pool[index % pool.length]; // round-robin generators
  const qSeed = drillQuestionSeed(seed, index);
  return { template, seed: qSeed, instance: template.generate(mulberry32(qSeed)) };
}

export type ParseDrillResult =
  | { ok: true; spec: DrillSpec }
  | { ok: false; reason: 'topic' };

export function parseDrillSpec(
  raw: { chapter: string | null; topic: string | null },
  seed: number,
): ParseDrillResult {
  const ok = drillTopics().some((d) => d.chapter === raw.chapter && d.topic === raw.topic);
  if (!ok) return { ok: false, reason: 'topic' };
  return { ok: true, spec: { chapter: raw.chapter as string, topic: raw.topic as string, seed } };
}
