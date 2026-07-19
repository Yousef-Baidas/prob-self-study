import { describe, it, expect } from 'vitest';
import { buildWorksheetSession, parseWorksheetSpec, type WorksheetSpec } from '../../src/modes/worksheet';

const spec = (over: Partial<WorksheetSpec> = {}): WorksheetSpec =>
  ({ chapter: 'probability', source: 'both', count: 8, seed: 2026, ...over });

describe('buildWorksheetSession', () => {
  it('same spec → identical prompts', () => {
    expect(buildWorksheetSession(spec()).questions.map((q) => q.instance.prompt))
      .toEqual(buildWorksheetSession(spec()).questions.map((q) => q.instance.prompt));
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
});

describe('parseWorksheetSpec', () => {
  it('accepts a valid chapter/topic/source', () => {
    const r = parseWorksheetSpec({ chapter: 'probability', topic: 'Bayes theorem', source: 'both', count: '8' }, 1);
    expect(r.ok).toBe(true);
  });

  it('rejects a topic not in the chapter', () => {
    const r = parseWorksheetSpec({ chapter: 'intro', topic: 'Bayes theorem', source: 'both', count: '8' }, 1);
    expect(r).toEqual({ ok: false, reason: 'topic' });
  });

  it('treats a missing topic as all-topics (ok, topic undefined)', () => {
    const r = parseWorksheetSpec({ chapter: 'intro', topic: null, source: 'both', count: '8' }, 1);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.spec.topic).toBeUndefined();
  });
});
