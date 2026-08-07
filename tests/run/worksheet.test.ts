import { describe, expect, test } from 'vitest';
import { rerollWorksheet, startWorksheetRun } from '../../src/run/worksheet';
import { WORKSHEET_DEFAULTS } from '../../src/run/defaults';
import { selectTemplates } from '../../src/engine/registry';

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
    expect(run.session.spec.difficulty).toBe(WORKSHEET_DEFAULTS.difficulty);
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

  test('accepts an explicit difficulty and narrows the sheet to it', () => {
    const run = startWorksheetRun('?chapter=probability&difficulty=hard&count=50', { roll: roll(42) });
    expect(run.status).toBe('ready');
    if (run.status !== 'ready') return;
    expect(run.session.questions.every((q) => q.template.difficulty === 'hard')).toBe(true);
  });

  test('rejects a difficulty that was supplied but is unrecognised', () => {
    expect(startWorksheetRun('?chapter=probability&difficulty=vibes', { roll: roll(42) })).toEqual({
      status: 'error',
      reason: 'difficulty',
    });
  });

  test('reports the selection as empty rather than silently widening the difficulty filter', () => {
    const chapters = ['intro', 'probability', 'random-variables'] as const;
    const difficulties = ['easy', 'medium', 'hard'] as const;
    let found: { chapter: string; difficulty: string } | undefined;
    outer: for (const chapter of chapters) {
      for (const difficulty of difficulties) {
        if (selectTemplates({ chapter, difficulty }).length === 0) {
          found = { chapter, difficulty };
          break outer;
        }
      }
    }
    if (!found) return; // every chapter now has full difficulty coverage
    expect(
      startWorksheetRun(`?chapter=${found.chapter}&difficulty=${found.difficulty}`, { roll: roll(42) }),
    ).toEqual({ status: 'error', reason: 'empty' });
  });

  test('rejects a topic that is not in the chapter', () => {
    expect(startWorksheetRun('?chapter=probability&topic=Astrology', { roll: roll(42) })).toEqual({
      status: 'error',
      reason: 'topic',
    });
  });

  test('leaves the address bar alone when the run is rejected', () => {
    // See the matching test in exam.test.ts: only a ready run carries a url.
    const run = startWorksheetRun('?chapter=probability&source=vibes', { roll: roll(42) });
    expect(run).not.toHaveProperty('url');
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

  test('accepts a repeated chapter parameter, the shape a checkbox group submits', () => {
    const run = ready('?chapter=intro&chapter=random-variables');
    expect(run.session.spec.chapters).toEqual(['intro', 'random-variables']);
  });

  test('accepts a comma-separated chapter list from a hand-written link', () => {
    expect(ready('?chapter=intro,random-variables').session.spec.chapters).toEqual([
      'intro',
      'random-variables',
    ]);
  });

  test('normalises order and duplicates so equivalent links build the same sheet', () => {
    const a = ready('?chapter=random-variables&chapter=intro&chapter=intro&seed=7');
    const b = ready('?chapter=intro&chapter=random-variables&seed=7');
    expect(a.session.spec.chapters).toEqual(b.session.spec.chapters);
    expect(a.session.questions.map((q) => q.instance.prompt)).toEqual(
      b.session.questions.map((q) => q.instance.prompt),
    );
  });

  test('a single chapter still works, so old links keep building', () => {
    expect(ready('?chapter=probability').session.spec.chapters).toEqual(['probability']);
  });

  test('rejects the whole selection if any chapter is unknown', () => {
    expect(startWorksheetRun('?chapter=intro&chapter=astrology', { roll: roll(42) })).toEqual({
      status: 'error',
      reason: 'chapter',
    });
  });

  test('rejects a chapter parameter that is present but empty', () => {
    expect(startWorksheetRun('?chapter=', { roll: roll(42) })).toEqual({
      status: 'error',
      reason: 'chapter',
    });
  });

  test('accepts a topic belonging to any one of the chosen chapters', () => {
    const run = ready('?chapter=intro&chapter=probability&topic=Counting%20techniques');
    expect(run.session.spec.topic).toBe('Counting techniques');
    expect(run.session.questions.every((q) => q.template.topic === 'Counting techniques')).toBe(true);
  });

  test('rejects a topic from a chapter that was not chosen', () => {
    expect(
      startWorksheetRun('?chapter=intro&topic=Counting%20techniques', { roll: roll(42) }),
    ).toEqual({ status: 'error', reason: 'topic' });
  });

  test('a reroll keeps every chapter that was chosen', () => {
    const run = rerollWorksheet(ready('?chapter=intro&chapter=random-variables'), roll(4242));
    expect(run.session.spec.chapters).toEqual(['intro', 'random-variables']);
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
