import { describe, expect, test } from 'vitest';
import { rerollWorksheet, startWorksheetRun } from '../../src/run/worksheet';
import { WORKSHEET_DEFAULTS } from '../../src/run/defaults';

const roll = (n: number) => () => n;

function ready(search = '?chapter=probability') {
  const run = startWorksheetRun(search, { roll: roll(42) });
  if (run.status !== 'ready') throw new Error(`expected ready, got ${run.status}`);
  return run;
}

describe('startWorksheetRun', () => {
  test('is idle when no run was requested', () => {
    expect(startWorksheetRun('', { roll: roll(42) })).toEqual({ status: 'idle' });
  });

  test('starts a run from a chapter alone', () => {
    // Behaviour change: an absent source used to be rejected here while exam
    // defaulted it, so a bare worksheet link errored and a bare exam link did not.
    const run = startWorksheetRun('?chapter=probability', { roll: roll(42) });
    expect(run.status).toBe('ready');
  });

  test('takes its defaults from the same constant the setup form renders', () => {
    const run = ready();
    expect(run.session.spec.source).toBe(WORKSHEET_DEFAULTS.source);
    expect(run.session.spec.count).toBe(WORKSHEET_DEFAULTS.count);
  });

  test('asks for eight questions, not the exam default of ten', () => {
    expect(ready().session.spec.count).toBe(8);
  });

  test('rejects a chapter that does not exist', () => {
    expect(startWorksheetRun('?chapter=astrology', { roll: roll(42) })).toEqual({
      status: 'error',
      reason: 'chapter',
    });
  });

  test('rejects a source that was supplied but is unrecognised', () => {
    expect(startWorksheetRun('?chapter=probability&source=vibes', { roll: roll(42) })).toEqual({
      status: 'error',
      reason: 'source',
    });
  });

  test('rejects a topic that is not in the chapter', () => {
    expect(startWorksheetRun('?chapter=probability&topic=Astrology', { roll: roll(42) })).toEqual({
      status: 'error',
      reason: 'topic',
    });
  });

  test('treats the form’s "All topics" option as no topic filter', () => {
    // That option submits an empty value, which means "everything", not "invalid".
    const run = startWorksheetRun('?chapter=probability&topic=', { roll: roll(42) });
    expect(run.status).toBe('ready');
    if (run.status !== 'ready') return;
    expect(run.session.spec.topic).toBeUndefined();
  });

  test('narrows to a single topic when one is given', () => {
    const run = startWorksheetRun('?chapter=probability&topic=Counting%20techniques', {
      roll: roll(42),
    });
    if (run.status !== 'ready') throw new Error('expected ready');
    expect(run.session.spec.topic).toBe('Counting techniques');
  });

  test('writes the resolved seed into the url', () => {
    expect(ready().url).toContain('seed=42');
  });

  test('produces the same sheet for the same seed', () => {
    const a = ready('?chapter=probability&seed=5');
    const b = ready('?chapter=probability&seed=5');
    expect(a.session.questions.map((q) => q.instance.prompt)).toEqual(
      b.session.questions.map((q) => q.instance.prompt),
    );
  });
});

describe('rerollWorksheet', () => {
  test('builds a different sheet and puts the new seed in the url', () => {
    const run = rerollWorksheet(ready(), roll(4242));
    expect(run.session.spec.seed).toBe(4242);
    expect(run.url).toContain('seed=4242');
  });
});
