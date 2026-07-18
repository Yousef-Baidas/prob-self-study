import { describe, expect, it } from 'vitest';

import { joinBase } from '../../src/lib/withBase';

describe('joinBase', () => {
  it('joins base and path with exactly one slash', () => {
    expect(joinBase('/prob-self-study/', 'exam')).toBe('/prob-self-study/exam');
  });

  it('adds a trailing slash to base when missing', () => {
    expect(joinBase('/prob-self-study', 'exam')).toBe('/prob-self-study/exam');
  });

  it('strips leading slashes from path so the join never doubles up', () => {
    expect(joinBase('/prob-self-study/', '/exam')).toBe('/prob-self-study/exam');
  });

  it('returns the base itself for an empty path (home link)', () => {
    expect(joinBase('/prob-self-study/', '')).toBe('/prob-self-study/');
  });
});
