import type { QuestionInstance, QuestionTemplate } from '../engine/types';

export type ExamSource = 'book' | 'generated' | 'both';

export interface ExamSpec {
  chapter: string;   // 'intro' | 'probability'
  source: ExamSource;
  count: number;     // requested N
  seed: number;      // master seed (uint32)
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
