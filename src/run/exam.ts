// The exam run: paged, answered, then graded in one go.
//
// Everything here is pure. `url` and `storeScore` describe effects the island
// performs; nothing in this module touches window, history or localStorage.

import { buildExamSession, gradeExamSession } from '../modes/exam';
import type { DifficultyFilter, ExamResult, ExamSession, ExamSource } from '../modes/types';
import type { GivenAnswer } from '../engine/grade';
import { chapters } from '../lib/site';
import { buildSearch, resolveSeed } from './core';
import { COUNT_MAX, COUNT_MIN, DIFFICULTIES, EXAM_DEFAULTS, SOURCES } from './defaults';
import { optionalEnum, optionalInt, requireSlug } from './params';

export type ExamRunError = 'chapter' | 'source' | 'difficulty' | 'empty';

export type ExamRunState =
  | { status: 'idle' }
  | { status: 'error'; reason: ExamRunError }
  | {
      status: 'ready';
      session: ExamSession;
      answers: GivenAnswer[][];
      index: number;
      phase: 'attempt' | 'graded';
      result: ExamResult | null;
      /** The search string the island should replace the address bar with. */
      url: string;
      /** Present once graded: what the island should persist. */
      storeScore?: { chapter: string; score: number; total: number; seed: number };
    };

export type ReadyExamRun = Extract<ExamRunState, { status: 'ready' }>;

export type ExamRunDeps = { roll: () => number };

const blankAnswers = (session: ExamSession): GivenAnswer[][] =>
  session.questions.map((q) => q.instance.parts.map(() => null));

function build(
  spec: { chapter: string; source: ExamSource; count: number; seed: number; difficulty?: DifficultyFilter },
  search: string,
): ExamRunState {
  const session = buildExamSession(spec);
  if (session.delivered === 0) return { status: 'error', reason: 'empty' };
  return {
    status: 'ready',
    session,
    answers: blankAnswers(session),
    index: 0,
    phase: 'attempt',
    result: null,
    url: buildSearch(search, { seed: String(spec.seed) }),
  };
}

export function startExamRun(search: string, deps: ExamRunDeps): ExamRunState {
  const params = new URLSearchParams(search);
  // No chapter at all means no run was requested — the static setup form stands.
  if (!params.has('chapter')) return { status: 'idle' };

  const chapter = requireSlug(params.get('chapter'), chapters.map((c) => c.slug), 'chapter' as const);
  if (!chapter.ok) return { status: 'error', reason: chapter.reason };

  const source = optionalEnum(params.get('source'), SOURCES, EXAM_DEFAULTS.source, 'source' as const);
  if (!source.ok) return { status: 'error', reason: source.reason };

  const difficulty = optionalEnum(
    params.get('difficulty'),
    DIFFICULTIES,
    EXAM_DEFAULTS.difficulty,
    'difficulty' as const,
  );
  if (!difficulty.ok) return { status: 'error', reason: difficulty.reason };

  const seed = resolveSeed(params.get('seed'), deps.roll);
  const count = optionalInt(params.get('count'), COUNT_MIN, COUNT_MAX, EXAM_DEFAULTS.count);

  return build({ chapter: chapter.value, source: source.value, count, seed, difficulty: difficulty.value }, search);
}

export function gotoExamQuestion(run: ReadyExamRun, index: number): ReadyExamRun {
  const last = run.session.questions.length - 1;
  return { ...run, index: Math.min(last, Math.max(0, index)) };
}

export function submitExam(run: ReadyExamRun): ReadyExamRun {
  const result = gradeExamSession(run.session, run.answers);
  return {
    ...run,
    phase: 'graded',
    result,
    storeScore: {
      chapter: run.session.spec.chapter,
      score: result.score,
      total: result.total,
      seed: run.session.spec.seed,
    },
  };
}

/** Same questions, blank answers. */
export function retryExam(run: ReadyExamRun): ReadyExamRun {
  return {
    ...run,
    answers: blankAnswers(run.session),
    index: 0,
    phase: 'attempt',
    result: null,
    storeScore: undefined,
  };
}

/** Same spec, fresh seed, new questions. */
export function rerollExam(run: ReadyExamRun, roll: () => number): ReadyExamRun {
  const spec = { ...run.session.spec, seed: roll() };
  const next = build(spec, run.url);
  // A spec that produced questions a moment ago still will; the empty branch is
  // unreachable here, but the type has to be narrowed regardless.
  if (next.status !== 'ready') return run;
  return next;
}
