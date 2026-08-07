import { describe, expect, it } from 'vitest';

import { allTemplates, selectTemplates, topicsForChapter } from '../../src/engine/registry';

import { mulberry32 } from '../../src/engine/rng';

describe('registry', () => {
  it('collects both generated and book templates', () => {
    expect(allTemplates.length).toBeGreaterThanOrEqual(8);

    expect(allTemplates.some((t) => t.source === 'generated')).toBe(true);

    expect(allTemplates.some((t) => t.source === 'book')).toBe(true);
  });

  it('filters by chapter', () => {
    const intro = selectTemplates({ chapter: 'intro' });

    expect(intro.length).toBeGreaterThan(0);

    expect(intro.every((t) => t.chapter === 'intro')).toBe(true);
  });

  it('source "book" returns only book, "generated" only generated, "both" (or omitted) returns all', () => {
    expect(selectTemplates({ source: 'book' }).every((t) => t.source === 'book')).toBe(true);

    expect(selectTemplates({ source: 'generated' }).every((t) => t.source === 'generated')).toBe(true);

    expect(selectTemplates({ source: 'both' }).length).toBe(allTemplates.length);

    expect(selectTemplates().length).toBe(allTemplates.length);
  });

  it('filters by chapter and difficulty together', () => {
    const res = selectTemplates({ chapter: 'probability', difficulty: 'hard' });

    expect(res.length).toBeGreaterThan(0);

    expect(res.every((t) => t.chapter === 'probability' && t.difficulty === 'hard')).toBe(true);
  });

  it('filters by topic', () => {
    const someTopic = allTemplates[0].topic;

    const res = selectTemplates({ topic: someTopic });

    expect(res.length).toBeGreaterThan(0);

    expect(res.every((t) => t.topic === someTopic)).toBe(true);
  });

  it('topicsForChapter returns a de-duplicated list', () => {
    const topics = topicsForChapter('probability');

    expect(new Set(topics).size).toBe(topics.length);

    expect(topics).toContain('Counting techniques');
  });

  it('ids are unique across the whole registry, not just within a bank', () => {
    // The book bank checks its own ids, and the generators check none at all, so
    // a collision across the two would slip through both. Everything downstream
    // — reroll, the worksheet solution bank, the drill's "not that one again" —
    // treats an id as the name of exactly one template.
    const ids = allTemplates.map((t) => t.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('ids name the chapter and bank they came from', () => {
    // ch02-gen-combinations, ch01-book-classify: the id is the only place a
    // template says where it lives, and it is read by humans far more than by
    // code, so a mislabelled one is worth failing over.
    for (const t of allTemplates) {
      const bank = t.source === 'book' ? 'book' : 'gen';

      expect(t.id).toMatch(new RegExp(`^ch\\d{2}-${bank}-[a-z0-9-]+$`));
    }
  });

  it('a prompt that asks for a verdict has a part that grades one', () => {
    // A per-template test checks that every part carries the right answer. It
    // cannot see a part that should exist and doesn't — the parts array is all
    // it looks at, and the promise to the student lives in the prompt. This
    // caught ch03-gen-independence-support-trap asking "decide whether X and Y
    // are independent" while grading only the three numbers leading up to it.
    const asksVerdict = /\b(decide|state|say)\s+whether\b|\bis it\b|\bdoes it support\b/i;

    for (const t of allTemplates) {
      for (const seed of [0, 7, 1234]) {
        const instance = t.generate(mulberry32(seed));

        if (!asksVerdict.test(instance.prompt)) continue;

        const gradesVerdict = instance.parts.some((p) => p.kind === 'tf' || p.kind === 'mcq');

        expect(gradesVerdict, `${t.id} asks for a verdict but grades none`).toBe(true);
      }
    }
  });
});
