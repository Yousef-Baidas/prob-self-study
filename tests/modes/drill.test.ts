import { describe, it, expect } from 'vitest';
import { drillTopics, drillPool, buildDrillQuestion } from '../../src/modes/drill';

describe('drillTopics', () => {
  it('returns exactly the generator-backed topics', () => {
    const keys = drillTopics().map((d) => `${d.chapter}/${d.topic}`).sort();
    expect(keys).toEqual([
      'intro/Descriptive statistics',
      'intro/Study design',
      'probability/Additive rules',
      'probability/Bayes theorem',
      'probability/Conditional probability',
      'probability/Counting techniques',
      'probability/Sample space and events',
      'random-variables/Continuous distributions',
      'random-variables/Discrete distributions',
      'random-variables/Joint distributions',
      'random-variables/Random variables',
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

describe('difficulty filter', () => {
  it('drillPool narrows to the requested difficulty', () => {
    const all = drillPool('probability', 'Counting techniques');
    const difficulties = [...new Set(all.map((t) => t.difficulty))];
    expect(difficulties.length).toBeGreaterThan(0);
    const only = drillPool('probability', 'Counting techniques', difficulties[0]);
    expect(only.length).toBeGreaterThan(0);
    expect(only.every((t) => t.difficulty === difficulties[0])).toBe(true);
  });

  it('a no-argument call to drillPool is identical to "any"', () => {
    const bare = drillPool('probability', 'Counting techniques').map((t) => t.id);
    const any = drillPool('probability', 'Counting techniques', 'any').map((t) => t.id);
    expect(any).toEqual(bare);
  });

  it('drillTopics() with no argument is unchanged from the pre-difficulty list', () => {
    const bare = drillTopics().map((d) => `${d.chapter}/${d.topic}`).sort();
    const any = drillTopics('any').map((d) => `${d.chapter}/${d.topic}`).sort();
    expect(any).toEqual(bare);
  });

  it('drillTopics(difficulty) only lists topics that actually have that difficulty', () => {
    // Computed, not hardcoded: pools are uneven and other generators are landing
    // in parallel, so which topics qualify at "hard" can change under us.
    for (const t of drillTopics('hard')) {
      expect(drillPool(t.chapter, t.topic, 'hard').length).toBeGreaterThan(0);
    }
  });

  it('buildDrillQuestion only ever draws from the requested difficulty', () => {
    const difficulties = [...new Set(drillPool('probability', 'Bayes theorem').map((t) => t.difficulty))];
    const target = difficulties[0];
    for (let i = 0; i < 6; i++) {
      expect(buildDrillQuestion('probability', 'Bayes theorem', 5, i, target).template.difficulty).toBe(target);
    }
  });
});

