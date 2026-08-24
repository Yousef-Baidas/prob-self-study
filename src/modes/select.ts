import type { QuestionTemplate } from '../engine/types';
import { selectTemplates } from '../engine/registry';
import { mulberry32 } from '../engine/rng';
import type { DifficultyFilter, ExamSource } from './types';

/** 'any' (and an absent filter) both mean "every difficulty" to selectTemplates. */
export function narrowDifficulty(difficulty: DifficultyFilter | undefined) {
  return difficulty && difficulty !== 'any' ? difficulty : undefined;
}

const DIFF_RANK: Record<string, number> = { easy: 0, medium: 1, hard: 2 };

export function orderByDifficulty(templates: QuestionTemplate[]): QuestionTemplate[] {
  return [...templates].sort((a, b) => {
    const d = (DIFF_RANK[a.difficulty] ?? 99) - (DIFF_RANK[b.difficulty] ?? 99);
    return d !== 0 ? d : a.id.localeCompare(b.id);
  });
}

/**
 * Fisher-Yates, driven by the run's own seed. Returns a copy — `selectTemplates`
 * hands back a fresh array, but shuffling in place would still be a trap for the
 * next caller who passes something they did not build.
 */
function shuffled(templates: readonly QuestionTemplate[], seed: number): QuestionTemplate[] {
  const out = [...templates];

  const rng = mulberry32(seed);

  for (let i = out.length - 1; i > 0; i--) {
    const j = rng.int(0, i);

    [out[i], out[j]] = [out[j], out[i]];
  }

  return out;
}

export interface DrawResult {
  templates: QuestionTemplate[];
  requested: number;
  delivered: number;
  capped: boolean;
}

/**
 * Which templates a run gets, and how many.
 *
 * `seed` decides WHICH templates are drawn; the caller separately seeds each
 * drawn template to decide what its numbers are. Both matter, and for a long
 * while only the second one existed: the draw was `slice(0, count)` over a
 * stable id order, so every seed returned the same questions. For generated
 * templates that at least reskinned the numbers, but book templates ignore the
 * rng by construction (see `bookQuestion` in engine/authoring.ts), so a
 * book-source exam on a chapter was the same exam every single time — and the
 * larger a chapter's bank grew, the smaller the reachable fraction of it got.
 *
 * Omitting `seed` keeps the old first-N behaviour. That is not a deprecated
 * path: it is what a caller wants when it needs a stable, inspectable draw,
 * and it is what most of this module's own tests assert against.
 */
export function drawTemplates(
  chapter: string | readonly string[],
  source: ExamSource,
  count: number,
  topic?: string,
  difficulty?: DifficultyFilter,
  seed?: number,
): DrawResult {
  const matching = selectTemplates({ chapter, topic, source, difficulty: narrowDifficulty(difficulty) });
  // Order for the *pick*: shuffled when seeded, easy→hard otherwise. Whatever
  // survives the pick is re-ordered easy→hard at the end, so a sheet still
  // ramps up regardless of which branch chose its contents.
  const pool = seed === undefined ? orderByDifficulty(matching) : shuffled(matching, seed);
  let templates: QuestionTemplate[];
  if (source === 'book' || pool.length === 0 || pool.length >= count) {
    templates = pool.slice(0, count); // book caps here; generated/both with enough distinct also take first N
  } else {
    // generated/both, pool < count: deliver every distinct template once, then
    // fill the remainder by reusing GENERATED templates only (a reused book
    // template would render identically — book generate ignores the seed).
    const gens = pool.filter((t) => t.source === 'generated');
    if (gens.length === 0) {
      templates = pool.slice(0, count); // no generators to reuse → cap at distinct
    } else {
      const filled = [...pool];
      for (let i = 0; filled.length < count; i++) filled.push(gens[i % gens.length]);
      templates = filled;
    }
  }
  return {
    templates: orderByDifficulty(templates),
    requested: count,
    delivered: templates.length,
    capped: templates.length < count,
  };
}
