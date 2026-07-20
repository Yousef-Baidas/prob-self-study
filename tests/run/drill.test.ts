import { describe, expect, test } from 'vitest';
import {
  checkDrillAnswer,
  nextDrillQuestion,
  startDrillRun,
  type ReadyDrillRun,
} from '../../src/run/drill';
import { encodeTopicKey } from '../../src/run/topicKey';

const roll = (n: number) => () => n;
const TK = encodeTopicKey('probability', 'Bayes theorem');

function ready(search = `?tk=${encodeURIComponent(TK)}`): ReadyDrillRun {
  const run = startDrillRun(search, { roll: roll(42) });
  if (run.status !== 'ready') throw new Error(`expected ready, got ${run.status}`);
  return run;
}

/** The answers that grade the current question correct. */
const correctAnswers = (run: ReadyDrillRun) =>
  run.current.instance.parts.map((p) => (p.kind === 'numeric' ? p.answer : null));

const wrongAnswers = (run: ReadyDrillRun) =>
  run.current.instance.parts.map((p) => (p.kind === 'numeric' ? p.answer + 1 : null));

describe('startDrillRun', () => {
  test('is idle when no run was requested', () => {
    expect(startDrillRun('', { roll: roll(42) })).toEqual({ status: 'idle' });
  });

  test('starts from a topic key submitted by the setup form', () => {
    const run = ready();
    expect(run.spec.chapter).toBe('probability');
    expect(run.spec.topic).toBe('Bayes theorem');
  });

  test('starts from an explicit chapter and topic', () => {
    const run = startDrillRun('?chapter=probability&topic=Bayes%20theorem', { roll: roll(42) });
    expect(run.status).toBe('ready');
  });

  test('shows an error rather than a blank page for a malformed topic key', () => {
    // Regression: a hand-edited tk used to leave the page empty, because the
    // setup panel was already hidden and nothing rendered in its place.
    expect(startDrillRun('?tk=garbage', { roll: roll(42) })).toEqual({
      status: 'error',
      reason: 'topic',
    });
  });

  test('rejects a topic that has no generator behind it', () => {
    expect(startDrillRun('?chapter=probability&topic=Astrology', { roll: roll(42) })).toEqual({
      status: 'error',
      reason: 'topic',
    });
  });

  test('leaves the address bar alone when the run is rejected', () => {
    // See the matching test in exam.test.ts: only a ready run carries a url.
    expect(startDrillRun('?tk=garbage', { roll: roll(42) })).not.toHaveProperty('url');
  });

  test('trades the topic key for explicit parameters in the url', () => {
    const run = ready();
    expect(run.url).toContain('chapter=probability');
    expect(run.url).toContain('seed=42');
    expect(run.url).not.toContain('tk=');
  });

  test('opens with an unanswered question and a clean scoreboard', () => {
    const run = ready();
    expect(run.checked).toBe(false);
    expect(run.graded).toBeNull();
    expect(run.streak).toBe(0);
    expect(run.answered).toBe(0);
    expect(run.accuracy).toBe(0);
  });

  test('adopts a previously stored best streak', () => {
    const run = startDrillRun(`?tk=${encodeURIComponent(TK)}`, { roll: roll(42), readBest: () => 9 });
    if (run.status !== 'ready') throw new Error('expected ready');
    expect(run.best).toBe(9);
  });

  test('looks the stored best up against the resolved topic', () => {
    // The storage key depends on the topic, which is only known once the topic
    // key has been decoded — so the module does the lookup, not the caller.
    const asked: Array<[string, string]> = [];
    startDrillRun(`?tk=${encodeURIComponent(TK)}`, {
      roll: roll(42),
      readBest: (chapter, topic) => {
        asked.push([chapter, topic]);
        return 0;
      },
    });
    expect(asked).toEqual([['probability', 'Bayes theorem']]);
  });
});

describe('checkDrillAnswer', () => {
  test('counts a correct answer and extends the streak', () => {
    const run = checkDrillAnswer(ready(), correctAnswers(ready()));
    expect(run.checked).toBe(true);
    expect(run.streak).toBe(1);
    expect(run.answered).toBe(1);
    expect(run.accuracy).toBe(100);
  });

  test('breaks the streak on a wrong answer but keeps the best', () => {
    let run = ready();
    run = checkDrillAnswer(run, correctAnswers(run));
    run = nextDrillQuestion(run);
    run = checkDrillAnswer(run, correctAnswers(run));
    expect(run.streak).toBe(2);
    run = nextDrillQuestion(run);
    run = checkDrillAnswer(run, wrongAnswers(run));
    expect(run.streak).toBe(0);
    expect(run.best).toBe(2);
    expect(run.answered).toBe(3);
  });

  test('reports accuracy across everything answered', () => {
    let run = ready();
    run = checkDrillAnswer(run, correctAnswers(run));
    run = nextDrillQuestion(run);
    run = checkDrillAnswer(run, wrongAnswers(run));
    run = nextDrillQuestion(run);
    run = checkDrillAnswer(run, correctAnswers(run));
    expect(run.accuracy).toBe(67);
  });

  test('offers a new best streak for storage', () => {
    const run = checkDrillAnswer(ready(), correctAnswers(ready()));
    expect(run.storeBest).toBe(1);
  });

  test('offers nothing for storage when the best did not improve', () => {
    const start = startDrillRun(`?tk=${encodeURIComponent(TK)}`, { roll: roll(42), readBest: () => 9 });
    if (start.status !== 'ready') throw new Error('expected ready');
    expect(checkDrillAnswer(start, correctAnswers(start)).storeBest).toBeUndefined();
  });

  test('ignores a second check of the same question', () => {
    let run = checkDrillAnswer(ready(), correctAnswers(ready()));
    run = checkDrillAnswer(run, correctAnswers(run));
    expect(run.answered).toBe(1);
  });
});

describe('nextDrillQuestion', () => {
  test('advances to an unanswered question', () => {
    const run = nextDrillQuestion(checkDrillAnswer(ready(), correctAnswers(ready())));
    expect(run.index).toBe(1);
    expect(run.checked).toBe(false);
    expect(run.graded).toBeNull();
    expect(run.answers).toEqual(run.current.instance.parts.map(() => null));
  });

  test('keeps the scoreboard across questions', () => {
    const run = nextDrillQuestion(checkDrillAnswer(ready(), correctAnswers(ready())));
    expect(run.streak).toBe(1);
    expect(run.answered).toBe(1);
  });

  test('never runs out of questions', () => {
    let run = ready();
    for (let i = 0; i < 25; i++) run = nextDrillQuestion(run);
    expect(run.current.instance.prompt).toBeTruthy();
    expect(run.index).toBe(25);
  });
});
