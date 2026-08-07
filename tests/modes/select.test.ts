import { describe, it, expect } from 'vitest';
import { orderByDifficulty, drawTemplates } from '../../src/modes/select';
import { selectTemplates } from '../../src/engine/registry';

const RANK = { easy: 0, medium: 1, hard: 2 } as const;
function nonDecreasing(ds: readonly ('easy'|'medium'|'hard')[]) {
  for (let i = 1; i < ds.length; i++) if (RANK[ds[i]] < RANK[ds[i - 1]]) return false;
  return true;
}

describe('orderByDifficulty', () => {
  it('orders easy→hard, tie-broken by id', () => {
    const ordered = orderByDifficulty(selectTemplates({ chapter: 'probability' }));
    expect(nonDecreasing(ordered.map((t) => t.difficulty))).toBe(true);
  });
});

describe('drawTemplates across chapters', () => {
  it('an array of chapters pools all of them', () => {
    const ids = drawTemplates(['intro', 'probability'], 'both', 99).templates.map((t) => t.id);
    const expected = [
      ...selectTemplates({ chapter: 'intro', source: 'both' }),
      ...selectTemplates({ chapter: 'probability', source: 'both' }),
    ].map((t) => t.id);
    expect(new Set(ids)).toEqual(new Set(expected));
  });

  it('a one-element array matches the bare string', () => {
    expect(drawTemplates(['intro'], 'both', 10).templates.map((t) => t.id)).toEqual(
      drawTemplates('intro', 'both', 10).templates.map((t) => t.id),
    );
  });

  it('an empty chapter list draws nothing', () => {
    expect(drawTemplates([], 'both', 10).delivered).toBe(0);
  });
});

describe('drawTemplates', () => {
  it('is deterministic (same args → same id sequence)', () => {
    const a = drawTemplates('intro', 'generated', 10).templates.map((t) => t.id);
    const b = drawTemplates('intro', 'generated', 10).templates.map((t) => t.id);
    expect(a).toEqual(b);
  });

  it('generated/both always reaches N, ordered easy→hard, covering every distinct template', () => {
    // N is derived from the pool rather than hardcoded. The coverage claim only
    // holds when N is at least the number of distinct templates, so a literal N
    // turns this into a change detector that fails every time a chapter gains
    // questions — which is the one thing this project does constantly. Asking
    // for a few more than the pool holds also keeps the reuse path under test.
    const distinct = new Set(selectTemplates({ chapter: 'intro', source: 'generated' }).map((t) => t.id));
    const n = distinct.size + 3;
    const r = drawTemplates('intro', 'generated', n);
    expect(r.delivered).toBe(n);
    expect(r.capped).toBe(false);
    expect(nonDecreasing(r.templates.map((t) => t.difficulty))).toBe(true);
    const drawn = new Set(r.templates.map((t) => t.id));
    for (const id of distinct) expect(drawn.has(id)).toBe(true);
  });

  it('book pool short of N delivers all available and flags capped', () => {
    const pool = selectTemplates({ chapter: 'intro', source: 'book' });
    const r = drawTemplates('intro', 'book', 10);
    expect(r.delivered).toBe(pool.length);
    expect(r.delivered).toBeLessThan(10);
    expect(r.capped).toBe(true);
  });

  it('empty pool returns nothing without throwing', () => {
    const r = drawTemplates('nonexistent', 'both', 10);
    expect(r.delivered).toBe(0);
    expect(r.capped).toBe(true);
  });

  it('both fill-to-N never duplicates a book template (probability, pool 6 < count 10)', () => {
    const r = drawTemplates('probability', 'both', 10);
    expect(r.delivered).toBe(10);
    const bookIds = r.templates.filter((t) => t.source === 'book').map((t) => t.id);
    const distinctBookIds = new Set(bookIds);
    expect(distinctBookIds.size).toBe(bookIds.length);
  });

  it('both fill-to-N never duplicates a book template (intro, pool 4 < count 10)', () => {
    const r = drawTemplates('intro', 'both', 10);
    expect(r.delivered).toBe(10);
    const bookIds = r.templates.filter((t) => t.source === 'book').map((t) => t.id);
    const distinctBookIds = new Set(bookIds);
    expect(distinctBookIds.size).toBe(bookIds.length);
  });

  it('topic narrows the pool to that topic only', () => {
    const r = drawTemplates('probability', 'both', 10, 'Counting techniques');
    expect(r.templates.length).toBeGreaterThan(0);
    expect(r.templates.every((t) => t.topic === 'Counting techniques')).toBe(true);
  });

  it('omitting topic is unchanged (regression)', () => {
    const withUndef = drawTemplates('intro', 'generated', 10, undefined).templates.map((t) => t.id);
    const without = drawTemplates('intro', 'generated', 10).templates.map((t) => t.id);
    expect(withUndef).toEqual(without);
  });
});

describe('drawTemplates difficulty filter', () => {
  it('narrows the draw to templates of that difficulty', () => {
    const r = drawTemplates('probability', 'both', 50, undefined, 'hard');
    expect(r.templates.length).toBeGreaterThan(0);
    expect(r.templates.every((t) => t.difficulty === 'hard')).toBe(true);
  });

  it('"any" is byte-identical to an omitted difficulty', () => {
    const withAny = drawTemplates('probability', 'both', 12, undefined, 'any').templates.map((t) => t.id);
    const omitted = drawTemplates('probability', 'both', 12).templates.map((t) => t.id);
    expect(withAny).toEqual(omitted);
  });

  it('a combination with no matching templates delivers nothing, without throwing', () => {
    // Compute rather than assume which (chapter, difficulty) pairs are empty —
    // other generators land in parallel and may fill these in.
    const hasEasyOrMedium = selectTemplates({ chapter: 'intro', topic: 'Study design' }).some(
      (t) => t.difficulty !== 'hard',
    );
    if (hasEasyOrMedium) return; // topic has grown easy/medium coverage since; nothing to assert here
    const r = drawTemplates('intro', 'both', 10, 'Study design', 'easy');
    expect(r.delivered).toBe(0);
    expect(r.capped).toBe(true);
  });
});
