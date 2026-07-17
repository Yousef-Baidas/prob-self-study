import { describe, expect, it } from 'vitest';

import { ch01Generators } from '../../../src/engine/generators/ch01';

import { mulberry32 } from '../../../src/engine/rng';

import { mean, median, sampleStdDev } from '../../../src/engine/mathx';

const byId = (id: string) => {
  const t = ch01Generators.find((g) => g.id === id);

  if (!t) throw new Error(`missing generator ${id}`);

  return t;
};

// The generator records its sampled dataset in `instance.params.data`, so the
// test re-derives the answer independently instead of parsing the prompt.
describe('ch01 descriptiveSummary', () => {
  it('reported mean/median match an independent recompute, across seeds', () => {
    const t = byId('ch01-gen-descriptive-summary');

    for (let seed = 0; seed < 50; seed++) {
      const inst = t.generate(mulberry32(seed));

      const data = inst.params!.data as number[];

      const meanPart = inst.parts[0];

      const medianPart = inst.parts[1];

      expect(meanPart.kind).toBe('numeric');

      if (meanPart.kind === 'numeric') {
        expect(Math.abs(meanPart.answer - mean(data))).toBeLessThanOrEqual(meanPart.tol);
      }

      expect(medianPart.kind).toBe('numeric');

      if (medianPart.kind === 'numeric') {
        expect(Math.abs(medianPart.answer - median(data))).toBeLessThanOrEqual(medianPart.tol);
      }
    }
  });
});

describe('ch01 sampleStdDev', () => {
  it('reported s matches an independent recompute, across seeds', () => {
    const t = byId('ch01-gen-sample-std-dev');

    for (let seed = 0; seed < 50; seed++) {
      const inst = t.generate(mulberry32(seed));

      const data = inst.params!.data as number[];

      const part = inst.parts[0];

      expect(part.kind).toBe('numeric');

      if (part.kind === 'numeric') {
        expect(Math.abs(part.answer - sampleStdDev(data))).toBeLessThanOrEqual(part.tol);
      }
    }
  });
});
