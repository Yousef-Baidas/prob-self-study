import { describe, it, expect } from 'vitest';
import { buildExamSession, deriveQuestionSeeds } from '../../src/modes/exam';
import type { ExamSpec } from '../../src/modes/types';

const spec = (over: Partial<ExamSpec> = {}): ExamSpec =>
  ({ chapter: 'intro', source: 'generated', count: 6, seed: 8412, ...over });

describe('deriveQuestionSeeds', () => {
  it('is deterministic and length-n', () => {
    expect(deriveQuestionSeeds(8412, 5)).toEqual(deriveQuestionSeeds(8412, 5));
    expect(deriveQuestionSeeds(8412, 5)).toHaveLength(5);
  });
});

describe('buildExamSession', () => {
  it('same spec → identical prompts and answers', () => {
    const a = buildExamSession(spec());
    const b = buildExamSession(spec());
    expect(a.questions.map((q) => q.instance.prompt)).toEqual(b.questions.map((q) => q.instance.prompt));
  });

  it('different seed changes at least one generated instance', () => {
    const a = buildExamSession(spec({ seed: 1 }));
    const b = buildExamSession(spec({ seed: 2 }));
    expect(a.questions.map((q) => q.instance.prompt)).not.toEqual(b.questions.map((q) => q.instance.prompt));
  });

  it('propagates delivered/capped from the draw', () => {
    const s = buildExamSession(spec({ source: 'book', count: 10 }));
    expect(s.delivered).toBe(s.questions.length);
    expect(s.capped).toBe(s.delivered < 10);
  });
});
