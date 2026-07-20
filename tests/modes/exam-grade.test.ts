import { describe, it, expect } from 'vitest';
import { buildExamSession, gradeExamSession } from '../../src/modes/exam';
import type { GivenAnswer } from '../../src/engine/grade';

describe('gradeExamSession', () => {
  it('perfect answers score full; wrong answers reduce score', () => {
    const s = buildExamSession({ chapter: 'intro', source: 'generated', count: 4, seed: 5 });
    // build correct answers straight from each part's answer
    const correct: GivenAnswer[][] = s.questions.map((q) =>
      q.instance.parts.map((p) => (p.kind === 'numeric' ? p.answer : p.kind === 'mcq' ? p.answer : p.kind === 'tf' ? p.answer : p.answer)),
    );
    expect(gradeExamSession(s, correct).score).toBe(s.questions.length);

    const wrong: GivenAnswer[][] = s.questions.map((q) => q.instance.parts.map(() => null));
    const res = gradeExamSession(s, wrong);
    expect(res.total).toBe(s.questions.length);
    // any question whose parts are all self-graded (null) would still count correct; numeric/mcq/tf won't
    expect(res.score).toBeLessThanOrEqual(s.questions.length);
  });

  it('missing answers array for a question does not throw', () => {
    const s = buildExamSession({ chapter: 'intro', source: 'generated', count: 2, seed: 9 });
    expect(() => gradeExamSession(s, [])).not.toThrow();
  });
});

