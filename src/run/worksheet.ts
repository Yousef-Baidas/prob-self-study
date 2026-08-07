// The worksheet run: a fixed sheet of questions with their solutions, built once
// and printed. No paging and no grading — the learner works on paper.

import { buildWorksheetSession } from '../modes/worksheet';
import type { WorksheetSession, WorksheetSpec } from '../modes/worksheet';
import { chapters } from '../lib/site';
import { buildSearch, resolveSeed } from './core';
import { COUNT_MAX, COUNT_MIN, DIFFICULTIES, SOURCES, WORKSHEET_DEFAULTS } from './defaults';
import { optionalEnum, optionalInt, requireSlugs } from './params';

export type WorksheetRunError = 'chapter' | 'source' | 'topic' | 'difficulty' | 'empty';

export type WorksheetRunState =
  | { status: 'idle' }
  | { status: 'error'; reason: WorksheetRunError }
  | { status: 'ready'; session: WorksheetSession; url: string };

export type ReadyWorksheetRun = Extract<WorksheetRunState, { status: 'ready' }>;

export type WorksheetRunDeps = { roll: () => number };

function build(spec: WorksheetSpec, search: string): WorksheetRunState {
  const session = buildWorksheetSession(spec);
  if (session.delivered === 0) return { status: 'error', reason: 'empty' };
  return { status: 'ready', session, url: buildSearch(search, { seed: String(spec.seed) }) };
}

export function startWorksheetRun(search: string, deps: WorksheetRunDeps): WorksheetRunState {
  const params = new URLSearchParams(search);
  if (!params.has('chapter')) return { status: 'idle' };

  const slugs = requireSlugs(params.getAll('chapter'), chapters.map((c) => c.slug), 'chapter' as const);
  if (!slugs.ok) return { status: 'error', reason: slugs.reason };
  // A topic belongs to one chapter, so across a multi-chapter sheet the valid
  // topics are the union — picking one narrows the sheet to that chapter.
  const topics = new Set(
    chapters.filter((c) => slugs.value.includes(c.slug)).flatMap((c) => c.topics),
  );

  const source = optionalEnum(
    params.get('source'),
    SOURCES,
    WORKSHEET_DEFAULTS.source,
    'source' as const,
  );
  if (!source.ok) return { status: 'error', reason: source.reason };

  const difficulty = optionalEnum(
    params.get('difficulty'),
    DIFFICULTIES,
    WORKSHEET_DEFAULTS.difficulty,
    'difficulty' as const,
  );
  if (!difficulty.ok) return { status: 'error', reason: difficulty.reason };

  // The setup form's "All topics" option submits an empty value, which means
  // every topic in the chapter rather than a topic that failed to validate.
  const rawTopic = params.get('topic');
  const topic = rawTopic ? rawTopic : undefined;
  if (topic && !topics.has(topic)) return { status: 'error', reason: 'topic' };

  const seed = resolveSeed(params.get('seed'), deps.roll);
  const count = optionalInt(params.get('count'), COUNT_MIN, COUNT_MAX, WORKSHEET_DEFAULTS.count);

  return build(
    { chapters: slugs.value, topic, source: source.value, count, seed, difficulty: difficulty.value },
    search,
  );
}

/** Same spec, fresh seed, a new sheet. */
export function rerollWorksheet(run: ReadyWorksheetRun, roll: () => number): ReadyWorksheetRun {
  const next = build({ ...run.session.spec, seed: roll() }, run.url);
  if (next.status !== 'ready') return run;
  return next;
}
