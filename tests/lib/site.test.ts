import { describe, expect, it } from 'vitest';

import { chapters, modes, navItems } from '../../src/lib/site';

import { topicsForChapter } from '../../src/engine/registry';

describe('site.ts', () => {
  it('lists both Phase-1 chapters in order', () => {
    expect(chapters.map((c) => c.number)).toEqual([1, 2]);
  });

  it('uses chapter slugs that resolve to real engine templates', () => {
    for (const c of chapters) {
      expect(topicsForChapter(c.slug).length).toBeGreaterThan(0);
    }
  });

  it('exposes the three practice modes as nav children', () => {
    expect(modes.map((m) => m.href)).toEqual(['exam', 'worksheet', 'drill']);
  });

  it('puts Practice as a parent with the mode children', () => {
    const practice = navItems.find((n) => n.label === 'Practice');

    expect(practice?.children?.length).toBe(3);
  });
});
