import { describe, it, expect } from 'vitest';
import { drillTopics, drillPool, buildDrillQuestion } from '../../src/modes/drill';
import { selectTemplates } from '../../src/engine/registry';

describe('drillTopics', () => {
  it('returns exactly the generator-backed topics', () => {
    const keys = drillTopics().map((d) => `${d.chapter}/${d.topic}`).sort();
    // Deliberately a literal list, not a derived one. Every other assertion here
    // checks a property; this one is the canary that makes a change to the
    // drillable surface visible in a diff — adding a topic, renaming one, or
    // dropping the last generator behind one all land here first.
    //
    // Chebyshev's theorem is absent on purpose: the course deck teaches 4.1-4.3
    // only, so it was cut from the chapter along with its generators.
    expect(keys).toEqual([
      'continuous-distributions/Applications of the normal distribution',
      'continuous-distributions/Areas under the normal curve',
      'continuous-distributions/Continuous uniform',
      'continuous-distributions/Exponential distribution',
      'continuous-distributions/Normal approximation to the binomial',
      'continuous-distributions/Normal distribution',
      'discrete-distributions/Binomial and multinomial',
      'discrete-distributions/Discrete uniform',
      'discrete-distributions/Geometric and negative binomial',
      'discrete-distributions/Hypergeometric',
      'discrete-distributions/Poisson',
      'expectation/Expected value',
      'expectation/Linear combinations',
      'expectation/Variance and covariance',
      'intro/Descriptive statistics',
      'intro/Populations and samples',
      'intro/Study design',
      'intro/Types of data',
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
    // This used to name 'Types of data' and 'Populations and samples' as the
    // two book-only topics. Both since gained generators — closing exactly the
    // gap that made them examples — which turned a property test into a list
    // that had to be maintained by hand. So ask the registry which topics are
    // book-only right now, and assert the property about those.
    //
    // If every topic has generator coverage the loop is empty and the test is
    // vacuous. That is the intended end state, not a failure, so the invariant
    // is stated from the other side too, below.
    const drillable = new Set(drillTopics().map((d) => `${d.chapter}/${d.topic}`));

    const generatorBacked = new Set(
      selectTemplates({ source: 'generated' }).map((t) => `${t.chapter}/${t.topic}`),
    );

    for (const t of selectTemplates({ source: 'book' })) {
      const key = `${t.chapter}/${t.topic}`;

      if (generatorBacked.has(key)) continue; // not book-only

      expect(drillable.has(key)).toBe(false);
    }

    // The other direction: nothing is offered for drilling that has no
    // generator behind it, so picking any listed topic can never dead-end.
    for (const key of drillable) expect(generatorBacked.has(key)).toBe(true);
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

