// The drill run: one topic, endless questions, a streak to keep alive.
//
// Unlike exam and worksheet there is no session — a drill never ends, so each
// question is built on demand from the master seed and the question index.
// Pure throughout: `url` and `storeBest` describe effects, they do not perform them.

import { buildDrillQuestion, drillPool, drillTopics } from '../modes/drill';
import type { DrillQuestion, DrillSpec } from '../modes/drill';
import { gradeInstance, type GivenAnswer } from '../engine/grade';
import { buildSearch, resolveSeed } from './core';
import { decodeTopicKey } from './topicKey';

export type DrillRunError = 'topic' | 'empty';

export type DrillRunState =
  | { status: 'idle' }
  | { status: 'error'; reason: DrillRunError }
  | {
      status: 'ready';
      spec: DrillSpec;
      index: number;
      current: DrillQuestion;
      answers: GivenAnswer[];
      graded: (boolean | null)[] | null;
      checked: boolean;
      streak: number;
      best: number;
      answered: number;
      correct: number;
      accuracy: number;
      url: string;
      /** Present only when this answer set a new best worth persisting. */
      storeBest?: number;
    };

export type ReadyDrillRun = Extract<DrillRunState, { status: 'ready' }>;

export type DrillRunDeps = {
  roll: () => number;
  /**
   * Looks up a previously stored best streak. Taken as a function rather than a
   * value because the storage key depends on the topic, which is not known until
   * the topic key has been decoded.
   */
  readBest?: (chapter: string, topic: string) => number | undefined;
};

const accuracyOf = (correct: number, answered: number) =>
  answered === 0 ? 0 : Math.round((correct / answered) * 100);

/** Load question `index` and clear whatever was typed against the last one. */
function load(run: ReadyDrillRun, index: number): ReadyDrillRun {
  const current = buildDrillQuestion(run.spec.chapter, run.spec.topic, run.spec.seed, index);
  return {
    ...run,
    index,
    current,
    answers: current.instance.parts.map(() => null),
    graded: null,
    checked: false,
    storeBest: undefined,
  };
}

export function startDrillRun(search: string, deps: DrillRunDeps): DrillRunState {
  const params = new URLSearchParams(search);
  const tk = params.get('tk');
  let chapter = params.get('chapter');
  let topic = params.get('topic');

  // The setup form submits one combined value; explicit parameters win if present.
  if (tk && (!chapter || !topic)) {
    const decoded = decodeTopicKey(tk);
    chapter = decoded?.chapter ?? null;
    topic = decoded?.topic ?? null;
  }

  if (!chapter || !topic) {
    // Something was asked for but could not be resolved — say so, rather than
    // rendering nothing over a setup panel the page has already hidden.
    const requested = tk != null || params.has('chapter') || params.has('topic');
    return requested ? { status: 'error', reason: 'topic' } : { status: 'idle' };
  }

  const known = drillTopics().some((t) => t.chapter === chapter && t.topic === topic);
  if (!known) return { status: 'error', reason: 'topic' };
  if (drillPool(chapter, topic).length === 0) return { status: 'error', reason: 'empty' };

  const seed = resolveSeed(params.get('seed'), deps.roll);
  const spec: DrillSpec = { chapter, topic, seed };

  const base: ReadyDrillRun = {
    status: 'ready',
    spec,
    index: 0,
    current: buildDrillQuestion(chapter, topic, seed, 0),
    answers: [],
    graded: null,
    checked: false,
    streak: 0,
    best: deps.readBest?.(chapter, topic) ?? 0,
    answered: 0,
    correct: 0,
    accuracy: 0,
    url: buildSearch(search, { tk: null, chapter, topic, seed: String(seed) }),
  };
  return load(base, 0);
}

export function checkDrillAnswer(run: ReadyDrillRun, answers: GivenAnswer[]): ReadyDrillRun {
  if (run.checked) return run;
  const graded = gradeInstance(run.current.instance, answers);

  const streak = graded.correct ? run.streak + 1 : 0;
  const correct = run.correct + (graded.correct ? 1 : 0);
  const answered = run.answered + 1;
  const improved = streak > run.best;

  return {
    ...run,
    answers,
    graded: graded.parts,
    checked: true,
    streak,
    correct,
    answered,
    best: improved ? streak : run.best,
    accuracy: accuracyOf(correct, answered),
    storeBest: improved ? streak : undefined,
  };
}

export function nextDrillQuestion(run: ReadyDrillRun): ReadyDrillRun {
  return load(run, run.index + 1);
}
