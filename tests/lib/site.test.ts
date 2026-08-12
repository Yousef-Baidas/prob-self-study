import { describe, expect, it } from 'vitest';

import { chapters, modes, navItems } from '../../src/lib/site';

import { topicsForChapter } from '../../src/engine/registry';

describe('site.ts', () => {
  it('lists every written chapter in order', () => {
    expect(chapters.map((c) => c.number)).toEqual([1, 2, 3, 4, 5]);
  });

  it('uses chapter slugs that resolve to real engine templates', () => {
    for (const c of chapters) {
      expect(topicsForChapter(c.slug).length).toBeGreaterThan(0);
    }
  });

  it('takes each chapter’s topics from the engine rather than a second copy', () => {
    // The topic list used to be typed out again here as display copy, so a new
    // template could add a topic the chapter card never mentioned. Now the card
    // shows whatever practice can actually serve.
    for (const c of chapters) {
      expect(c.topics).toEqual(topicsForChapter(c.slug));
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
