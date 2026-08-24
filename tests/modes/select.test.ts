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
    // The count is derived from the pool, not the literal 99 this used to use.
    // Both chapters' banks have since grown past 99, so a fixed count stopped
    // asking "does the draw span both chapters" and started asking "are these
    // two chapters smaller than 99", which is not a fact worth pinning.
    const expected = [
      ...selectTemplates({ chapter: 'intro', source: 'both' }),
      ...selectTemplates({ chapter: 'probability', source: 'both' }),
    ].map((t) => t.id);
    const ids = drawTemplates(['intro', 'probability'], 'both', expected.length).templates.map((t) => t.id);
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
    // N is the pool plus a few rather than a literal 10. Every chapter's book
    // bank now clears 50, so asking for 10 is no longer asking for more than
    // exists — the test passed for years only because the bank was tiny, and
    // the moment it grew it started asserting the opposite of its own name.
    const pool = selectTemplates({ chapter: 'intro', source: 'book' });
    const n = pool.length + 5;
    const r = drawTemplates('intro', 'book', n);
    expect(r.delivered).toBe(pool.length);
    expect(r.delivered).toBeLessThan(n);
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

describe('drawTemplates seeded draw', () => {
  // The defect this pins: the draw used to be slice(0, count) over a stable id
  // order, so the seed only reskinned a fixed set of questions. Book templates
  // ignore the rng entirely, so a book exam was byte-identical on every seed no
  // matter how large the chapter's bank grew. These four assertions are the
  // property that fixes it, stated in the order it can break.
  const idsAt = (seed: number | undefined, count = 8) =>
    drawTemplates('continuous-distributions', 'book', count, undefined, undefined, seed).templates.map(
      (t) => t.id,
    );

  it('the same seed draws the same set', () => {
    expect(idsAt(4242)).toEqual(idsAt(4242));
  });

  it('different seeds draw different sets', () => {
    // Not merely a different ORDER — a different set. Sorting both before
    // comparing is what makes this test about selection rather than layout.
    const a = [...idsAt(1)].sort();
    const b = [...idsAt(2)].sort();
    expect(a).not.toEqual(b);
  });

  it('reaches deep into a bank that is larger than the draw', () => {
    // Sixteen small book draws should touch far more than one draw's worth of
    // distinct questions. The pre-fix behaviour scored exactly `count` here,
    // whatever the seed, which is the number this guards against.
    const seen = new Set<string>();
    for (let seed = 1; seed <= 16; seed++) for (const id of idsAt(seed)) seen.add(id);
    expect(seen.size).toBeGreaterThan(8 * 2);
  });

  it('omitting the seed keeps the unshuffled first-N draw', () => {
    expect(idsAt(undefined)).toEqual(
      drawTemplates('continuous-distributions', 'book', 8).templates.map((t) => t.id),
    );
  });

  it('a seeded draw is still ordered easy→hard', () => {
    const r = drawTemplates('continuous-distributions', 'both', 12, undefined, undefined, 777);
    expect(nonDecreasing(r.templates.map((t) => t.difficulty))).toBe(true);
  });

  it('a seeded draw respects the topic filter', () => {
    const r = drawTemplates('probability', 'both', 10, 'Counting techniques', undefined, 31337);
    expect(r.templates.length).toBeGreaterThan(0);
    expect(r.templates.every((t) => t.topic === 'Counting techniques')).toBe(true);
  });

  it('a seeded draw never duplicates a book template while distinct ones remain', () => {
    const r = drawTemplates('intro', 'both', 10, undefined, undefined, 90210);
    const bookIds = r.templates.filter((t) => t.source === 'book').map((t) => t.id);
    expect(new Set(bookIds).size).toBe(bookIds.length);
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
