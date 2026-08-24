// Properties every question must have, asserted once over the whole registry
// rather than per chapter.
//
// The existing guards each watch one thing: book.test.ts checks that a book
// question grades its own declared answer, no-degenerate-answers.test.ts checks
// that the answer is worth asking for. Neither notices a question that renders
// as "P(X = undefined)", an mcq whose correct index is off the end of its own
// choices, or a template that silently duplicates another. Those are the
// failures that survive a passing chapter suite and are found by a person
// reading the site, which is the expensive way to find them.
//
// Sourced from the registry, so a new chapter is covered the day it lands
// without anyone remembering this file exists.
import { describe, expect, it } from 'vitest';

import { selectTemplates } from '../../src/engine/registry';

import { mulberry32 } from '../../src/engine/rng';

/**
 * Generated templates are re-drawn across many seeds; book templates ignore the
 * rng, so one draw is the whole story for them. Twenty-five is enough to catch a
 * placeholder that only leaks on an unlucky branch without making the suite slow.
 */
const SEEDS = 25;

const draws = () =>
  selectTemplates({}).flatMap((template) => {
    const count = template.source === 'book' ? 1 : SEEDS;

    return Array.from({ length: count }, (_, seed) => ({
      template,
      seed,
      instance: template.generate(mulberry32(seed)),
    }));
  });

describe('every question is renderable', () => {
  it('has a prompt, at least one part, and a worked solution', () => {
    const offenders: string[] = [];

    for (const { template, seed, instance } of draws()) {
      const where = `${template.id} (seed ${seed})`;

      if (!instance.prompt?.trim()) offenders.push(`${where}: empty prompt`);

      if (!instance.parts?.length) offenders.push(`${where}: no answerable parts`);

      if (!instance.solution?.length) offenders.push(`${where}: no solution steps`);

      if (instance.solution?.some((step) => !step.text?.trim())) {
        offenders.push(`${where}: a blank solution step`);
      }
    }

    expect(offenders).toEqual([]);
  });

  it('never leaks a placeholder into prose a learner reads', () => {
    // A template string that interpolated a missing param renders the words
    // "undefined" or "NaN" straight into the question. It grades as normal and
    // every arithmetic test still passes, so nothing else catches it.
    const leak = /undefined|NaN|\[object Object\]/;

    const offenders: string[] = [];

    for (const { template, seed, instance } of draws()) {
      const prose = [instance.prompt, ...instance.solution.map((s) => s.text)].join('\n');

      if (leak.test(prose)) offenders.push(`${template.id} (seed ${seed})`);
    }

    expect(offenders).toEqual([]);
  });
});

describe('every part is answerable', () => {
  it('numeric answers are finite and their tolerance is not negative', () => {
    // A tolerance of exactly 0 is deliberate and common here — it is how an
    // exact integer answer (a count, a number of arrangements) is stated. Only
    // a negative tolerance is incoherent, since it can never be satisfied.
    const offenders: string[] = [];

    for (const { template, seed, instance } of draws()) {
      for (const part of instance.parts) {
        if (part.kind !== 'numeric') continue;

        if (!Number.isFinite(part.answer)) {
          offenders.push(`${template.id} (seed ${seed}): answer ${part.answer}`);
        }

        if (part.tol < 0) offenders.push(`${template.id} (seed ${seed}): tolerance ${part.tol}`);
      }
    }

    expect(offenders).toEqual([]);
  });

  it('multiple choice offers distinct options and points at one of them', () => {
    const offenders: string[] = [];

    for (const { template, seed, instance } of draws()) {
      for (const part of instance.parts) {
        if (part.kind !== 'mcq') continue;

        const where = `${template.id} (seed ${seed})`;

        if (part.choices.length < 2) offenders.push(`${where}: only ${part.choices.length} choice(s)`);

        if (new Set(part.choices).size !== part.choices.length) {
          offenders.push(`${where}: repeats a choice, so two options are both correct`);
        }

        if (!(part.answer >= 0 && part.answer < part.choices.length)) {
          offenders.push(`${where}: answer index ${part.answer} is off the end of ${part.choices.length} choices`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it('no single option index holds most of the correct answers', () => {
    // Not a style preference: if the right answer were nearly always the first
    // option, guessing beats reading, and exam mode stops measuring anything.
    // The bar is deliberately loose — this is a guard against drift toward a
    // guessable bank, not a demand for a uniform distribution.
    const perIndex = new Map<number, number>();

    let total = 0;

    // One draw per template, not one per seed: counting a generated template
    // twenty-five times would let a handful of generators outvote the whole
    // book bank and turn this into a measure of the wrong thing.
    for (const template of selectTemplates({})) {
      const instance = template.generate(mulberry32(0));

      for (const part of instance.parts) {
        if (part.kind !== 'mcq') continue;

        perIndex.set(part.answer, (perIndex.get(part.answer) ?? 0) + 1);

        total++;
      }
    }

    if (total === 0) return; // no mcq parts in the bank yet

    const largest = Math.max(...perIndex.values());

    expect(largest / total).toBeLessThan(0.5);
  });
});

describe('the bank has no dead weight', () => {
  it('no two templates render the identical question', () => {
    // Two ids pointing at the same question waste a slot in every draw and make
    // a worksheet look like it is repeating itself. A shared *stem* with
    // different questions asked of it is fine and common, which is why the key
    // includes the parts and not just the prompt.
    const byKey = new Map<string, string[]>();

    for (const template of selectTemplates({})) {
      const instance = template.generate(mulberry32(0));

      const key = `${instance.prompt.trim()}||${instance.parts.map((p) => `${p.kind}:${p.label ?? ''}`).join(',')}`;

      byKey.set(key, [...(byKey.get(key) ?? []), template.id]);
    }

    const collisions = [...byKey.values()].filter((ids) => ids.length > 1).map((ids) => ids.join(' + '));

    expect(collisions).toEqual([]);
  });

  it('ids are unique across the whole registry, not just within a chapter', () => {
    const ids = selectTemplates({}).map((t) => t.id);

    const seen = new Set<string>();

    const repeated = ids.filter((id) => (seen.has(id) ? true : (seen.add(id), false)));

    expect(repeated).toEqual([]);
  });
});
