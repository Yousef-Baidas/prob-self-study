import { describe, expect, test } from 'vitest';
import {
  gotoExamQuestion,
  rerollExam,
  retryExam,
  startExamRun,
  submitExam,
  type ReadyExamRun,
} from '../../src/run/exam';
import { EXAM_DEFAULTS } from '../../src/run/defaults';

const roll = (n: number) => () => n;

/** Start a run that is known to be ready, so transition tests can get on with it. */
function ready(search = '?chapter=probability&source=generated&count=3') {
  const run = startExamRun(search, { roll: roll(42) });
  if (run.status !== 'ready') throw new Error(`expected ready, got ${run.status}`);
  return run;
}

/**
 * Answers are written straight into the run by the answer inputs' two-way
 * binding, so tests fill them the same way rather than through a setter.
 */
const answeredCorrectly = (run: ReadyExamRun): ReadyExamRun => ({
  ...run,
  answers: run.session.questions.map((q) =>
    q.instance.parts.map((p) => (p.kind === 'numeric' ? p.answer : null)),
  ),
});

describe('startExamRun', () => {
  test('is idle when no run was requested', () => {
    // Nothing in the URL means the static setup form should stay on screen.
    expect(startExamRun('', { roll: roll(42) })).toEqual({ status: 'idle' });
  });

  test('starts a run from a chapter alone', () => {
    // Regression: the "Practice this chapter" link carries no source, and used
    // to error because an absent source was treated as an invalid one.
    const run = startExamRun('?chapter=probability', { roll: roll(42) });
    expect(run.status).toBe('ready');
    if (run.status !== 'ready') return;
    expect(run.session.spec.source).toBe(EXAM_DEFAULTS.source);
    expect(run.session.spec.count).toBe(EXAM_DEFAULTS.count);
  });

  test('rejects a chapter that does not exist', () => {
    expect(startExamRun('?chapter=astrology', { roll: roll(42) })).toEqual({
      status: 'error',
      reason: 'chapter',
    });
  });

  test('rejects a source that was supplied but is unrecognised', () => {
    expect(startExamRun('?chapter=probability&source=vibes', { roll: roll(42) })).toEqual({
      status: 'error',
      reason: 'source',
    });
  });

  test('writes the resolved seed into the url', () => {
    const run = startExamRun('?chapter=probability', { roll: roll(42) });
    if (run.status !== 'ready') throw new Error('expected ready');
    expect(run.url).toContain('seed=42');
  });

  test('preserves a seed that was already valid', () => {
    const run = startExamRun('?chapter=probability&seed=99', {
      roll: () => {
        throw new Error('should not roll');
      },
    });
    if (run.status !== 'ready') throw new Error('expected ready');
    expect(run.session.spec.seed).toBe(99);
  });

  test('produces the same questions for the same seed', () => {
    const a = startExamRun('?chapter=probability&seed=7', { roll: roll(1) });
    const b = startExamRun('?chapter=probability&seed=7', { roll: roll(1) });
    if (a.status !== 'ready' || b.status !== 'ready') throw new Error('expected ready');
    expect(a.session.questions.map((q) => q.instance.prompt)).toEqual(
      b.session.questions.map((q) => q.instance.prompt),
    );
  });

  test('starts every answer blank, one slot per part', () => {
    const run = ready();
    expect(run.answers).toHaveLength(run.session.questions.length);
    run.session.questions.forEach((q, i) => {
      expect(run.answers[i]).toEqual(q.instance.parts.map(() => null));
    });
  });

  test('opens on the first question in the attempt phase', () => {
    const run = ready();
    expect(run.index).toBe(0);
    expect(run.phase).toBe('attempt');
  });
});

describe('gotoExamQuestion', () => {
  test('moves to another question', () => {
    expect(gotoExamQuestion(ready(), 1).index).toBe(1);
  });

  test('refuses to move past the last question', () => {
    const run = ready();
    expect(gotoExamQuestion(run, 99).index).toBe(run.session.questions.length - 1);
  });

  test('refuses to move before the first question', () => {
    expect(gotoExamQuestion(ready(), -3).index).toBe(0);
  });
});

describe('submitExam', () => {
  test('grades every question and moves to the graded phase', () => {
    const run = submitExam(ready());
    expect(run.phase).toBe('graded');
    expect(run.result?.total).toBe(run.session.questions.length);
  });

  test('scores a fully correct attempt', () => {
    const run = submitExam(answeredCorrectly(ready()));
    expect(run.result?.score).toBe(run.session.questions.length);
  });

  test('offers the score for storage against its chapter', () => {
    const run = submitExam(ready());
    expect(run.storeScore).toEqual({
      chapter: 'probability',
      score: run.result?.score,
      total: run.result?.total,
      seed: 42,
    });
  });

  test('scores an untouched attempt as zero', () => {
    expect(submitExam(ready()).result?.score).toBe(0);
  });
});

describe('retryExam', () => {
  test('clears the answers but keeps the same questions', () => {
    const run = submitExam(answeredCorrectly(ready()));
    const again = retryExam(run);
    expect(again.phase).toBe('attempt');
    expect(again.result).toBeNull();
    expect(again.index).toBe(0);
    expect(again.answers[0][0]).toBeNull();
    expect(again.session.questions.map((q) => q.instance.prompt)).toEqual(
      run.session.questions.map((q) => q.instance.prompt),
    );
  });
});

describe('rerollExam', () => {
  test('builds a different set and puts the new seed in the url', () => {
    const run = rerollExam(ready(), roll(4242));
    expect(run.session.spec.seed).toBe(4242);
    expect(run.url).toContain('seed=4242');
  });

  test('keeps the rest of the spec', () => {
    const before = ready();
    const after = rerollExam(before, roll(4242));
    expect(after.session.spec.chapter).toBe(before.session.spec.chapter);
    expect(after.session.spec.source).toBe(before.session.spec.source);
    expect(after.session.spec.count).toBe(before.session.spec.count);
  });
});
