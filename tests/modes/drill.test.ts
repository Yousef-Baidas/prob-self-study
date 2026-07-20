import { describe, it, expect } from 'vitest';
import { drillTopics, drillPool, buildDrillQuestion } from '../../src/modes/drill';

describe('drillTopics', () => {
  it('returns exactly the generator-backed topics', () => {
    const keys = drillTopics().map((d) => `${d.chapter}/${d.topic}`).sort();
    expect(keys).toEqual([
      'intro/Descriptive statistics',
      'probability/Bayes theorem',
      'probability/Conditional probability',
      'probability/Counting techniques',
    ]);
  });

  it('excludes book-only topics', () => {
    const topics = drillTopics().map((d) => d.topic);
    expect(topics).not.toContain('Types of data');
    expect(topics).not.toContain('Populations and samples');
  });
});

describe('buildDrillQuestion', () => {
  it('is reproducible per (chapter, topic, seed, index)', () => {
    const a = buildDrillQuestion('probability', 'Counting techniques', 777, 3);
    const b = buildDrillQuestion('probability', 'Counting techniques', 777, 3);
    expect(a.seed).toBe(b.seed);
    expect(a.instance.prompt).toBe(b.instance.prompt);
  });

  it('gives consecutive questions distinct seeds', () => {
    const seeds = Array.from({ length: 10 }, (_, i) => buildDrillQuestion('probability', 'Bayes theorem', 42, i).seed);
    expect(new Set(seeds).size).toBe(seeds.length);
  });

  it('round-robins the generators of a multi-generator topic', () => {
    const pool = drillPool('probability', 'Counting techniques');
    expect(pool.length).toBeGreaterThan(1);
    const id0 = buildDrillQuestion('probability', 'Counting techniques', 1, 0).template.id;
    const id1 = buildDrillQuestion('probability', 'Counting techniques', 1, 1).template.id;
    expect(id0).not.toBe(id1);
  });
});

