// The worksheet run: a fixed sheet of questions with their solutions, built once
// and printed. No paging and no grading — the learner works on paper.

import { buildWorksheetSession } from '../modes/worksheet';
import type { WorksheetSession, WorksheetSpec } from '../modes/worksheet';
import { chapters } from '../lib/site';
import { buildSearch, resolveSeed } from './core';
import { COUNT_MAX, COUNT_MIN, SOURCES, WORKSHEET_DEFAULTS } from './defaults';
import { optionalEnum, optionalInt, requireSlug } from './params';

export type WorksheetRunError = 'chapter' | 'source' | 'topic' | 'empty';

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

  const slug = requireSlug(params.get('chapter'), chapters.map((c) => c.slug), 'chapter' as const);
  if (!slug.ok) return { status: 'error', reason: slug.reason };
  const chapter = chapters.find((c) => c.slug === slug.value)!;

  const source = optionalEnum(
    params.get('source'),
    SOURCES,
    WORKSHEET_DEFAULTS.source,
    'source' as const,
  );
  if (!source.ok) return { status: 'error', reason: source.reason };

  // The setup form's "All topics" option submits an empty value, which means
  // every topic in the chapter rather than a topic that failed to validate.
  const rawTopic = params.get('topic');
  const topic = rawTopic ? rawTopic : undefined;
  if (topic && !chapter.topics.includes(topic)) return { status: 'error', reason: 'topic' };

  const seed = resolveSeed(params.get('seed'), deps.roll);
  const count = optionalInt(params.get('count'), COUNT_MIN, COUNT_MAX, WORKSHEET_DEFAULTS.count);

  return build({ chapter: slug.value, topic, source: source.value, count, seed }, search);
}

/** Same spec, fresh seed, a new sheet. */
export function rerollWorksheet(run: ReadyWorksheetRun, roll: () => number): ReadyWorksheetRun {
  const next = build({ ...run.session.spec, seed: roll() }, run.url);
  if (next.status !== 'ready') return run;
  return next;
}
