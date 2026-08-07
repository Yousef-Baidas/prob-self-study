import type { Difficulty, QuestionInstance, QuestionTemplate } from '../engine/types';

export type ExamSource = 'book' | 'generated' | 'both';

// 'any' is the current, pre-difficulty behaviour — every difficulty, unfiltered.
// It is a mode-layer concept only: selectTemplates() knows just the three real
// difficulties, so every read of this filter narrows 'any' to `undefined` right
// before calling it.
export type DifficultyFilter = 'any' | Difficulty;

export interface ExamSpec {
  chapter: string;   // 'intro' | 'probability' | 'random-variables'
  source: ExamSource;
  count: number;     // requested N
  seed: number;      // master seed (uint32)
  difficulty?: DifficultyFilter; // defaults to 'any' where read
}

export interface ExamQuestion {
  template: QuestionTemplate;
  seed: number;               // per-question derived seed
  instance: QuestionInstance; // generated with that seed (read-only)
}

export interface ExamSession {
  spec: ExamSpec;
  questions: ExamQuestion[];
  requested: number;
  delivered: number;  // may be < requested for a short Book pool
  capped: boolean;    // delivered < requested
}

export interface ExamQuestionResult {
  correct: boolean;
  parts: (boolean | null)[];  // null = self-graded 'short'
}

export interface ExamResult {
  score: number;   // # fully-correct questions
  total: number;   // delivered
  perQuestion: ExamQuestionResult[];
}
