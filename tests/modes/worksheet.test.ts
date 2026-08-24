import { describe, it, expect } from 'vitest';
import { buildWorksheetSession, type WorksheetSpec } from '../../src/modes/worksheet';
import { selectTemplates } from '../../src/engine/registry';

const spec = (over: Partial<WorksheetSpec> = {}): WorksheetSpec =>
  ({ chapters: ['probability'], source: 'both', count: 8, seed: 2026, ...over });

describe('buildWorksheetSession', () => {
  it('same spec → identical prompts', () => {
    expect(buildWorksheetSession(spec()).questions.map((q) => q.instance.prompt))
      .toEqual(buildWorksheetSession(spec()).questions.map((q) => q.instance.prompt));
  });

  it('re-rolling the seed hands back a different sheet, not the same sheet renumbered', () => {
    // Book-source, because book templates ignore the rng: if the seed reached
    // only the per-question numbers and not the draw, these two sheets would be
    // identical. Sorted, so this is about which questions, not their order.
    const ids = (seed: number) =>
      buildWorksheetSession(spec({ chapters: ['continuous-distributions'], source: 'book', count: 8, seed }))
        .questions.map((q) => q.template.id)
        .sort();
    expect(ids(11)).not.toEqual(ids(22));
  });

  it('topic filter restricts questions to that topic', () => {
    const s = buildWorksheetSession(spec({ topic: 'Counting techniques', count: 5 }));
    expect(s.questions.length).toBeGreaterThan(0);
    expect(s.questions.every((q) => q.template.topic === 'Counting techniques')).toBe(true);
  });

  it('no topic means all topics for the chapter', () => {
    const s = buildWorksheetSession(spec({ count: 3 }));
    expect(s.questions.length).toBe(3);
  });

  it('draws from every chapter named, not just the first', () => {
    const s = buildWorksheetSession(spec({ chapters: ['intro', 'random-variables'], count: 20 }));
    const drawn = new Set(s.questions.map((q) => q.template.chapter));
    expect(drawn).toEqual(new Set(['intro', 'random-variables']));
  });

  it('a chapter left out contributes nothing', () => {
    const s = buildWorksheetSession(spec({ chapters: ['intro', 'random-variables'], count: 20 }));
    expect(s.questions.some((q) => q.template.chapter === 'probability')).toBe(false);
  });

  it('a two-chapter sheet is a superset of each chapter alone', () => {
    // Only meaningful when both sheets are asked for more than their pools
    // hold, so each is the whole pool rather than a sample of it. The literal
    // 99 used to guarantee that and no longer does: the banks outgrew it, so
    // both draws became strict samples and the superset claim stopped being
    // about chapter selection at all. Ask for the combined pool plus a margin.
    const combined = selectTemplates({ chapter: ['intro', 'probability'], source: 'both' }).length;
    const count = combined + 10;
    const both = buildWorksheetSession(spec({ chapters: ['intro', 'probability'], count }));
    const one = buildWorksheetSession(spec({ chapters: ['intro'], count }));
    const ids = new Set(both.questions.map((q) => q.template.id));
    for (const q of one.questions) expect(ids.has(q.template.id)).toBe(true);
  });

  it('difficulty filter restricts questions to that difficulty', () => {
    const s = buildWorksheetSession(spec({ difficulty: 'hard', count: 99 }));
    expect(s.questions.length).toBeGreaterThan(0);
    expect(s.questions.every((q) => q.template.difficulty === 'hard')).toBe(true);
  });

  it('"any" difficulty is byte-identical to an omitted one', () => {
    const withAny = buildWorksheetSession(spec({ difficulty: 'any' })).questions.map((q) => q.template.id);
    const omitted = buildWorksheetSession(spec()).questions.map((q) => q.template.id);
    expect(withAny).toEqual(omitted);
  });

  it('a chapter/topic/difficulty combination with nothing behind it delivers zero, capped', () => {
    // additive rules is hard-only as of this writing; compute it rather than
    // assume, since other agents are filling in easy/medium in parallel.
    const anyEasy = buildWorksheetSession(
      spec({ chapters: ['probability'], topic: 'Additive rules', count: 99 }),
    ).questions.some((q) => q.template.difficulty !== 'hard');
    if (anyEasy) return;
    const s = buildWorksheetSession(
      spec({ chapters: ['probability'], topic: 'Additive rules', difficulty: 'easy', count: 5 }),
    );
    expect(s.delivered).toBe(0);
    expect(s.capped).toBe(true);
  });
});

