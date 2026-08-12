// A numeric answer is useless as a question if it is indistinguishable from
// zero at its own tolerance: the learner types 0, or guesses, and is graded
// correct. This is not a hypothetical. Five Chapter 5 generators shipped with
// it — one degenerate on 202 of 400 seeds — and every one of their own unit
// tests passed, because a generator and its test both round to 4 decimal places
// and so agree on the same dead number. An independent recompute catches a
// wrong formula; it cannot catch a well-posed formula asked at a pointless
// point.
//
// The cause is always the same shape: a value is sampled from a range far wider
// than the distribution's effective support, so the true probability underflows
// the rounding. P(X = 1) when the mean is 18. P(no defectives) when the sample
// is most of the population. Guard the property directly, once, for every
// generator in the registry, instead of trusting each new chapter to remember.
import { describe, expect, it } from 'vitest';

import { selectTemplates } from '../../../src/engine/registry';

import { mulberry32 } from '../../../src/engine/rng';

const SEEDS = 400;

/**
 * `gradePart` accepts a response within `tol` of the declared answer, so 0 is
 * graded correct exactly when `|answer| <= tol`. That inequality — not a padded
 * multiple of it — is the defect, so it is what this asserts: an answer of
 * 0.001 against a tolerance of 0.0005 is thin but sound, because 0 still misses.
 *
 * Generators should aim comfortably clear of this line rather than at it. A
 * probability of 0.0006 against a tolerance of 0.0005 passes here yet still
 * fails any learner who rounds to three decimals, which is a reason to sample
 * nearer the distribution's mean, not a reason to loosen the bar below.
 */
const ZERO_IS_ACCEPTED = (answer: number, tol: number): boolean => Math.abs(answer) <= tol;

/**
 * Generators whose answer is legitimately zero for some draws, with the reason.
 * A zero here is the point of the question, not a sampling accident — so these
 * are exempt by name, and adding a name requires stating why.
 */
const LEGITIMATELY_ZERO: Record<string, string> = {
  // X and Y are each 0/1, and some weight tables make them genuinely
  // independent, which is exactly when the covariance — and therefore the
  // correlation — is exactly 0. That draw teaches the chapter's real point:
  // independence forces zero covariance. Keeping it is deliberate.
  'ch04-gen-covariance-joint-table': 'independent draws give a covariance of exactly 0',

  'ch04-gen-correlation-coefficient': 'independent draws give a correlation of exactly 0',
};

describe('generated answers are worth asking for', () => {
  it('never declares a numeric answer that zero would satisfy', () => {
    const offenders: string[] = [];

    for (const t of selectTemplates({ source: 'generated' })) {
      if (t.id in LEGITIMATELY_ZERO) continue;

      let hits = 0;

      let worst = '';

      for (let seed = 0; seed < SEEDS; seed++) {
        const instance = t.generate(mulberry32(seed));

        for (const part of instance.parts) {
          if (part.kind !== 'numeric') continue;

          if (!ZERO_IS_ACCEPTED(part.answer, part.tol)) continue;

          hits++;

          if (!worst) {
            worst =
              `seed ${seed}: ${part.label ?? 'answer'} = ${part.answer} ` +
              `(tol ${part.tol}), params ${JSON.stringify(instance.params)}`;
          }
        }
      }

      if (hits > 0) offenders.push(`${t.id}: ${hits}/${SEEDS} draws — ${worst}`);
    }

    expect(offenders).toEqual([]);
  });

  it('exempts only generators whose zero is the lesson, each with a reason', () => {
    // Guards the exemption list itself: a name may not be parked here without a
    // stated reason, and a name that no longer exists must not linger and
    // silently excuse a future generator that happens to reuse the id.
    const ids = new Set(selectTemplates().map((t) => t.id));

    for (const [id, reason] of Object.entries(LEGITIMATELY_ZERO)) {
      expect(ids.has(id), `${id} is exempted but no longer exists`).toBe(true);

      expect(reason.length).toBeGreaterThan(20);
    }
  });
});
