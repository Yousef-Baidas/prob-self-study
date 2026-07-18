import { describe, expect, it } from 'vitest';

import { nextTrapIndex } from '../../src/lib/focus-trap';

describe('nextTrapIndex', () => {
  it('advances forward on Tab', () => {
    expect(nextTrapIndex(3, 0, false)).toBe(1);
  });

  it('wraps to the first when tabbing past the last', () => {
    expect(nextTrapIndex(3, 2, false)).toBe(0);
  });

  it('goes backward on Shift+Tab', () => {
    expect(nextTrapIndex(3, 1, true)).toBe(0);
  });

  it('wraps to the last when shift-tabbing before the first', () => {
    expect(nextTrapIndex(3, 0, true)).toBe(2);
  });
});
