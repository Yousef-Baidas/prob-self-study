import { describe, it, expect } from 'vitest';
import { buildExamSession, deriveQuestionSeeds } from '../../src/modes/exam';
import { selectTemplates } from '../../src/engine/registry';
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

  it('difficulty filter restricts questions to that difficulty', () => {
    const s = buildExamSession(spec({ chapter: 'probability', source: 'both', difficulty: 'hard', count: 50 }));
    expect(s.questions.length).toBeGreaterThan(0);
    expect(s.questions.every((q) => q.template.difficulty === 'hard')).toBe(true);
  });

  it('"any" difficulty is byte-identical to an omitted one', () => {
    const withAny = buildExamSession(spec({ difficulty: 'any' })).questions.map((q) => q.template.id);
    const omitted = buildExamSession(spec()).questions.map((q) => q.template.id);
    expect(withAny).toEqual(omitted);
  });

  it('reports zero delivered, capped, for a (chapter, difficulty) pair with nothing behind it', () => {
    // Look for a chapter with no templates at some difficulty rather than
    // assuming one, since other agents are filling coverage in as this runs.
    const chapters = ['intro', 'probability', 'random-variables'] as const;
    const difficulties = ['easy', 'medium', 'hard'] as const;
    let target: { chapter: string; difficulty: 'easy' | 'medium' | 'hard' } | undefined;
    outer: for (const chapter of chapters) {
      for (const difficulty of difficulties) {
        if (selectTemplates({ chapter, difficulty }).length === 0) {
          target = { chapter, difficulty };
          break outer;
        }
      }
    }
    if (!target) return; // every chapter now has full difficulty coverage
    const s = buildExamSession(spec({ chapter: target.chapter, difficulty: target.difficulty, count: 5 }));
    expect(s.delivered).toBe(0);
    expect(s.capped).toBe(true);
  });
});
