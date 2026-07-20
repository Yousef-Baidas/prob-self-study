import { describe, it, expect } from 'vitest';
import { buildWorksheetSession, type WorksheetSpec } from '../../src/modes/worksheet';

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

