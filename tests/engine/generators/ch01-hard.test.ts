import { describe, expect, it } from 'vitest';

import { ch01Generators, ch01StudyScenarios, studyTypeChoices } from '../../../src/engine/generators/ch01';

import { mulberry32 } from '../../../src/engine/rng';

const SEEDS = 250;

// A brute-force sweep once found IQR = 0 at seeds 5098, 11607, and 19447 for
// `ch01-gen-quartile-fence` (fixed by clustering the offsets — see
// `quartileClusterOffsets` in src/engine/generators/ch01.ts). This template's
// own sweep is raised well past all three so the "IQR > 0" assertion below
// carries real force, not luck.
const QUARTILE_FENCE_SEEDS = 20000;

const QUARTILE_FENCE_REGRESSION_SEEDS = [5098, 11607, 19447];

// Recomputed independently of `src/engine/mathx` (plain inline arithmetic)
// so a bug in mathx cannot corrupt both sides of the comparison identically.

const independentMean = (xs: number[]): number => {
  let sum = 0;

  for (const x of xs) sum += x;

  return sum / xs.length;
};

const independentMedian = (xs: number[]): number => {
  const sorted = [...xs].sort((a, b) => a - b);

  const n = sorted.length;

  const mid = Math.floor(n / 2);

  return n % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const independentSampleStdDev = (xs: number[]): number => {
  const n = xs.length;

  let sum = 0;

  for (const x of xs) sum += x;

  const xBar = sum / n;

  let sumSquaredDiff = 0;

  for (const x of xs) sumSquaredDiff += (x - xBar) ** 2;

  return Math.sqrt(sumSquaredDiff / (n - 1));
};

// R type-6 quantile, written independently of `src/engine/mathx#quartile`.
const independentQuartile = (xs: number[], k: 1 | 2 | 3): number => {
  const s = [...xs].sort((a, b) => a - b);

  const n = s.length;

  const L = (k * (n + 1)) / 4;

  if (L <= 1) return s[0];

  if (L >= n) return s[n - 1];

  const j = Math.floor(L);

  const f = L - j;

  return f === 0 ? s[j - 1] : s[j - 1] + f * (s[j] - s[j - 1]);
};

const byId = (id: string) => {
  const t = ch01Generators.find((g) => g.id === id);

  if (!t) throw new Error(`missing generator ${id}`);

  return t;
};

describe('ch01 cvTwoLines', () => {
  const t = byId('ch01-gen-cv-compare');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    const wording = (prompt: string) =>
      prompt.replace(/\*\*[^*]+\*\*/g, '<DATA>');

    const first = wording(t.generate(mulberry32(0)).prompt);

    for (let seed = 1; seed < SEEDS; seed++) {
      expect(wording(t.generate(mulberry32(seed)).prompt)).toBe(first);
    }
  });

  it('both CVs match an independent recompute, and the winner is well-posed with no tie possible, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { dataA, dataB } = inst.params as unknown as { dataA: number[]; dataB: number[] };

      // Guard: both lines have strictly positive spread (never degenerate to s = 0).
      expect(independentSampleStdDev(dataA)).toBeGreaterThan(0);

      expect(independentSampleStdDev(dataB)).toBeGreaterThan(0);

      const cvA = (independentSampleStdDev(dataA) / independentMean(dataA)) * 100;

      const cvB = (independentSampleStdDev(dataB) / independentMean(dataB)) * 100;

      // Guard: same offsets on both lines ⇒ identical spread ⇒ never a tie in CV.
      expect(cvA).not.toBeCloseTo(cvB, 6);

      const [partA, partB, partWinner] = inst.parts;

      expect(partA.kind).toBe('numeric');

      expect(partB.kind).toBe('numeric');

      expect(partWinner.kind).toBe('mcq');

      if (partA.kind === 'numeric') expect(Math.abs(partA.answer - cvA)).toBeLessThanOrEqual(partA.tol);

      if (partB.kind === 'numeric') expect(Math.abs(partB.answer - cvB)).toBeLessThanOrEqual(partB.tol);

      if (partWinner.kind === 'mcq') {
        const expectedWinner = cvA > cvB ? 0 : 1;

        expect(partWinner.answer).toBe(expectedWinner);
      }
    }
  });
});

describe('ch01 quartileFence', () => {
  const t = byId('ch01-gen-quartile-fence');

  it('the fixed scenario prose does not vary across seeds, only the numbers', () => {
    const wording = (prompt: string) =>
      prompt.replace(/\*\*[^*]+\*\*/g, '<DATA>').replace(/\d+(\.\d+)?/g, '<N>');

    const first = wording(t.generate(mulberry32(0)).prompt);

    for (let seed = 1; seed < SEEDS; seed++) {
      expect(wording(t.generate(mulberry32(seed)).prompt)).toBe(first);
    }
  });

  it('Q1/Q3/IQR match an independent recompute and the outlier verdict is well-posed, across seeds', () => {
    for (let seed = 0; seed < QUARTILE_FENCE_SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { data, testValue } = inst.params as unknown as { data: number[]; testValue: number };

      const q1 = independentQuartile(data, 1);

      const q3 = independentQuartile(data, 3);

      const iqrValue = q3 - q1;

      // Guard: IQR is never zero — the dataset always has real spread. This
      // is now a true invariant (see `quartileClusterOffsets`), not a
      // by-luck pass: seed 5098 (data [47, 50, 50, 52, 50, 50, 50] under the
      // old offset generator) used to fail this exact assertion.
      expect(iqrValue).toBeGreaterThan(0);

      const lowerFence = q1 - 1.5 * iqrValue;

      const upperFence = q3 + 1.5 * iqrValue;

      const [partQ1, partQ3, partIqr, partOutlier] = inst.parts;

      expect(partQ1.kind).toBe('numeric');

      expect(partQ3.kind).toBe('numeric');

      expect(partIqr.kind).toBe('numeric');

      expect(partOutlier.kind).toBe('tf');

      if (partQ1.kind === 'numeric') expect(Math.abs(partQ1.answer - q1)).toBeLessThanOrEqual(partQ1.tol);

      if (partQ3.kind === 'numeric') expect(Math.abs(partQ3.answer - q3)).toBeLessThanOrEqual(partQ3.tol);

      if (partIqr.kind === 'numeric')
        expect(Math.abs(partIqr.answer - iqrValue)).toBeLessThanOrEqual(partIqr.tol);

      // Guard: the test value is always unambiguously inside or outside the
      // fences (built with a real margin), so the stated verdict is correct.
      if (partOutlier.kind === 'tf') {
        if (partOutlier.answer) {
          expect(testValue).toBeGreaterThan(upperFence);
        } else {
          expect(testValue).toBeGreaterThanOrEqual(lowerFence);

          expect(testValue).toBeLessThanOrEqual(upperFence);
        }
      }
    }
  });

  it('regression: seeds 5098, 11607, and 19447 (once produced IQR = 0) now produce a strictly positive IQR', () => {
    for (const seed of QUARTILE_FENCE_REGRESSION_SEEDS) {
      const inst = t.generate(mulberry32(seed));

      const { data } = inst.params as unknown as { data: number[] };

      const q1 = independentQuartile(data, 1);

      const q3 = independentQuartile(data, 3);

      expect(q3 - q1).toBeGreaterThan(0);

      const [, , partIqr] = inst.parts;

      expect(partIqr.kind).toBe('numeric');

      if (partIqr.kind === 'numeric') expect(partIqr.answer).toBeGreaterThan(0);
    }
  });
});

describe('ch01 trimmedMean', () => {
  const t = byId('ch01-gen-trimmed-mean');

  it('mean, median and 10% trimmed mean match an independent recompute, and the outlier is never trimmed away by mistake, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { data } = inst.params as unknown as { data: number[] };

      expect(data).toHaveLength(10);

      const sorted = [...data].sort((a, b) => a - b);

      // Guard: the top sorted value is a genuine outlier, well clear of the
      // rest, so trimming "the largest 10%" always removes it specifically.
      const rest = sorted.slice(0, -1);

      const maxRest = Math.max(...rest);

      expect(sorted[sorted.length - 1] - maxRest).toBeGreaterThanOrEqual(15);

      const m = independentMean(data);

      const md = independentMedian(data);

      const trimmed = sorted.slice(1, -1);

      const trimmedMean = independentMean(trimmed);

      const [partMean, partMedian, partTrimmed, partCloser] = inst.parts;

      expect(partMean.kind).toBe('numeric');

      if (partMean.kind === 'numeric') expect(Math.abs(partMean.answer - m)).toBeLessThanOrEqual(partMean.tol);

      expect(partMedian.kind).toBe('numeric');

      if (partMedian.kind === 'numeric')
        expect(Math.abs(partMedian.answer - md)).toBeLessThanOrEqual(partMedian.tol);

      expect(partTrimmed.kind).toBe('numeric');

      if (partTrimmed.kind === 'numeric')
        expect(Math.abs(partTrimmed.answer - trimmedMean)).toBeLessThanOrEqual(partTrimmed.tol);

      // The "closer to the median" verdict is computed from the draw, not
      // asserted to a fixed value — check it matches, and that it is never
      // an unanswerable tie (the generator nudges the outlier by 1 to break
      // any exact tie deterministically; see the comment in the source).
      expect(partCloser.kind).toBe('tf');

      if (partCloser.kind === 'tf') {
        expect(Math.abs(trimmedMean - md)).not.toBeCloseTo(Math.abs(m - md), 6);

        expect(partCloser.answer).toBe(Math.abs(trimmedMean - md) < Math.abs(m - md));
      }
    }
  });
});

describe('ch01 rescaleShift', () => {
  const t = byId('ch01-gen-rescale-shift');

  it('rescaled mean/median/s match an independent recompute, and a is never 1, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { data, a, b } = inst.params as unknown as { data: number[]; a: number; b: number };

      expect(a).not.toBe(1);

      const xMean = independentMean(data);

      const xMedian = independentMedian(data);

      const xStd = independentSampleStdDev(data);

      // Guard: never degenerate — spreadOffsets guarantees s_x > 0, so s_y = a*s_x is
      // strictly different from s_x since a != 1.
      expect(xStd).toBeGreaterThan(0);

      const [partMean, partMedian, partStd] = inst.parts;

      expect(partMean.kind).toBe('numeric');

      if (partMean.kind === 'numeric')
        expect(Math.abs(partMean.answer - (a * xMean + b))).toBeLessThanOrEqual(partMean.tol);

      expect(partMedian.kind).toBe('numeric');

      if (partMedian.kind === 'numeric')
        expect(Math.abs(partMedian.answer - (a * xMedian + b))).toBeLessThanOrEqual(partMedian.tol);

      expect(partStd.kind).toBe('numeric');

      if (partStd.kind === 'numeric') expect(Math.abs(partStd.answer - a * xStd)).toBeLessThanOrEqual(partStd.tol);
    }
  });
});

describe('ch01 missingValue', () => {
  const t = byId('ch01-gen-missing-value');

  it('the reconstructed reading is always positive and matches n*M - sum(known), and the corrected mean is consistent, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { known, M, n } = inst.params as unknown as { known: number[]; M: number; n: number };

      expect(known).toHaveLength(n - 1);

      const total = n * M;

      const missing = total - known.reduce((s, x) => s + x, 0);

      // Guard: never a degenerate non-positive "missing measurement."
      expect(missing).toBeGreaterThan(0);

      const correctedMean = M + missing / n;

      const [partMissing, partCorrected] = inst.parts;

      expect(partMissing.kind).toBe('numeric');

      if (partMissing.kind === 'numeric')
        expect(Math.abs(partMissing.answer - missing)).toBeLessThanOrEqual(partMissing.tol);

      expect(partCorrected.kind).toBe('numeric');

      if (partCorrected.kind === 'numeric')
        expect(Math.abs(partCorrected.answer - correctedMean)).toBeLessThanOrEqual(partCorrected.tol);
    }
  });
});

describe('ch01 pooledMean', () => {
  const t = byId('ch01-gen-pooled-mean');

  it('the pooled mean matches an independent recompute and is never equal to the naive simple average, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { n1, n2, totalA, totalB } = inst.params as unknown as {
        n1: number;
        n2: number;
        totalA: number;
        totalB: number;
      };

      // Guard: never degenerate — the two group sizes are always distinct.
      expect(n1).not.toBe(n2);

      const m1 = totalA / n1;

      const m2 = totalB / n2;

      // Guard: never degenerate — the two group means are always distinct.
      expect(m1).not.toBe(m2);

      const pooledMean = (totalA + totalB) / (n1 + n2);

      const simpleAvg = (m1 + m2) / 2;

      expect(pooledMean).not.toBeCloseTo(simpleAvg, 6);

      const [partPooled, partEqual] = inst.parts;

      expect(partPooled.kind).toBe('numeric');

      if (partPooled.kind === 'numeric')
        expect(Math.abs(partPooled.answer - pooledMean)).toBeLessThanOrEqual(partPooled.tol);

      expect(partEqual.kind).toBe('tf');

      if (partEqual.kind === 'tf') expect(partEqual.answer).toBe(false);
    }
  });
});

describe('ch01 stemLeafQuartile', () => {
  const t = byId('ch01-gen-stem-leaf-quartile');

  it('Q1/Q3/IQR/fences match an independent recompute and IQR is never zero, across seeds', () => {
    for (let seed = 0; seed < QUARTILE_FENCE_SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { data } = inst.params as unknown as { data: number[] };

      // Every value must be a genuine two-digit number so stem/leaf splitting is well-defined.
      for (const v of data) {
        expect(v).toBeGreaterThanOrEqual(10);

        expect(v).toBeLessThan(100);
      }

      const q1 = independentQuartile(data, 1);

      const q3 = independentQuartile(data, 3);

      const iqrValue = q3 - q1;

      expect(iqrValue).toBeGreaterThan(0);

      const lowerFence = q1 - 1.5 * iqrValue;

      const upperFence = q3 + 1.5 * iqrValue;

      const [partQ1, partQ3, partIqr, partLower, partUpper] = inst.parts;

      expect(partQ1.kind).toBe('numeric');

      if (partQ1.kind === 'numeric') expect(Math.abs(partQ1.answer - q1)).toBeLessThanOrEqual(partQ1.tol);

      expect(partQ3.kind).toBe('numeric');

      if (partQ3.kind === 'numeric') expect(Math.abs(partQ3.answer - q3)).toBeLessThanOrEqual(partQ3.tol);

      expect(partIqr.kind).toBe('numeric');

      if (partIqr.kind === 'numeric')
        expect(Math.abs(partIqr.answer - iqrValue)).toBeLessThanOrEqual(partIqr.tol);

      expect(partLower.kind).toBe('numeric');

      if (partLower.kind === 'numeric')
        expect(Math.abs(partLower.answer - lowerFence)).toBeLessThanOrEqual(partLower.tol);

      expect(partUpper.kind).toBe('numeric');

      if (partUpper.kind === 'numeric')
        expect(Math.abs(partUpper.answer - upperFence)).toBeLessThanOrEqual(partUpper.tol);
    }
  });

  it('the stem-and-leaf display in the prompt encodes exactly the sampled data', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { data } = inst.params as unknown as { data: number[] };

      const match = /```\n([\s\S]*?)\n```/.exec(inst.prompt);

      expect(match).not.toBeNull();

      const lines = match![1].split('\n');

      const decoded: number[] = [];

      for (const line of lines) {
        const [stemPart, leafPart] = line.split('|').map((s) => s.trim());

        const stem = Number(stemPart);

        for (const leafChar of leafPart.split(' ').filter(Boolean)) {
          decoded.push(stem * 10 + Number(leafChar));
        }
      }

      expect(decoded.sort((a, b) => a - b)).toEqual([...data].sort((a, b) => a - b));
    }
  });
});

describe('ch01 studyDesign', () => {
  const t = byId('ch01-gen-study-design');

  it('every scenario in the bank has a self-consistent, unambiguous answer key (exhaustive, not seed-sampled)', () => {
    expect(ch01StudyScenarios.length).toBeGreaterThanOrEqual(14);

    for (const s of ch01StudyScenarios) {
      expect(s.studyType).toBeGreaterThanOrEqual(0);

      expect(s.studyType).toBeLessThan(studyTypeChoices.length);

      expect(s.confounderAnswer).toBeGreaterThanOrEqual(0);

      expect(s.confounderAnswer).toBeLessThan(s.confounderChoices.length);

      // Every scenario's MCQ choices are pairwise distinct.
      expect(new Set(s.confounderChoices).size).toBe(s.confounderChoices.length);

      // A designed experiment (randomized assignment) is the only study type
      // in this bank that supports a causal conclusion.
      expect(s.causal).toBe(s.studyType === 0);
    }

    // Guard: the bank is not degenerate to a single study type.
    const distinctTypes = new Set(ch01StudyScenarios.map((s) => s.studyType));

    expect(distinctTypes.size).toBeGreaterThan(1);
  });

  it('the three study types are balanced in the bank (no type is the base rate)', () => {
    const counts = [0, 1, 2].map(
      (type) => ch01StudyScenarios.filter((s) => s.studyType === type).length,
    );

    const total = ch01StudyScenarios.length;

    // Each type should be roughly a third of the bank — loosely bounded so
    // small future additions don't make this brittle, but tight enough that
    // no type can dominate (which would make classification guessable from
    // the base rate alone).
    for (const count of counts) {
      expect(count).toBeGreaterThanOrEqual(Math.floor(total / 3) - 1);

      expect(count).toBeLessThanOrEqual(Math.ceil(total / 3) + 1);
    }

    expect(counts.reduce((a, b) => a + b, 0)).toBe(total);
  });

  it('the correct confounder MCQ answer is not identifiable by position (every position 0-3 is used, none dominates)', () => {
    const positionCounts = [0, 0, 0, 0];

    for (const s of ch01StudyScenarios) positionCounts[s.confounderAnswer]++;

    // Every position must be used at least once...
    for (const count of positionCounts) expect(count).toBeGreaterThan(0);

    // ...and no single position may hold a majority of the correct answers.
    for (const count of positionCounts) {
      expect(count).toBeLessThan(Math.ceil(ch01StudyScenarios.length / 2));
    }
  });

  it('the correct confounder MCQ answer is not identifiable by being the longest or shortest option', () => {
    let alwaysLongest = true;

    let alwaysShortest = true;

    for (const s of ch01StudyScenarios) {
      const lengths = s.confounderChoices.map((c) => c.length);

      const correctLen = lengths[s.confounderAnswer];

      if (correctLen !== Math.max(...lengths)) alwaysLongest = false;

      if (correctLen !== Math.min(...lengths)) alwaysShortest = false;
    }

    expect(alwaysLongest).toBe(false);

    expect(alwaysShortest).toBe(false);
  });

  it('every scenario in the bank is reachable across a seed sweep (no dead content)', () => {
    const seen = new Set<number>();

    for (let seed = 0; seed < 4000; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { scenarioIndex } = inst.params as unknown as { scenarioIndex: number };

      seen.add(scenarioIndex);

      if (seen.size === ch01StudyScenarios.length) break;
    }

    expect(seen.size).toBe(ch01StudyScenarios.length);
  });

  it('every draw reproduces the parts recorded for its scenario, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = t.generate(mulberry32(seed));

      const { scenarioIndex } = inst.params as unknown as { scenarioIndex: number };

      const s = ch01StudyScenarios[scenarioIndex];

      expect(s).toBeDefined();

      const [partType, partCausal, partConfounder] = inst.parts;

      expect(partType.kind).toBe('mcq');

      if (partType.kind === 'mcq') expect(partType.answer).toBe(s.studyType);

      expect(partCausal.kind).toBe('tf');

      if (partCausal.kind === 'tf') expect(partCausal.answer).toBe(s.causal);

      expect(partConfounder.kind).toBe('mcq');

      if (partConfounder.kind === 'mcq') expect(partConfounder.answer).toBe(s.confounderAnswer);
    }
  });
});

describe('ch01 studyDesign easy/medium templates', () => {
  const easy = byId('ch01-gen-study-design-easy');

  const medium = byId('ch01-gen-study-design-medium');

  const hard = byId('ch01-gen-study-design');

  it('uses the same topic string as the hard template (no new drill-topic string introduced)', () => {
    expect(easy.topic).toBe('Study design');

    expect(medium.topic).toBe('Study design');

    expect(hard.topic).toBe('Study design');
  });

  it('is differentiated by difficulty', () => {
    expect(easy.difficulty).toBe('easy');

    expect(medium.difficulty).toBe('medium');

    expect(hard.difficulty).toBe('hard');
  });

  it('easy template asks only for classification, matching the scenario bank, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = easy.generate(mulberry32(seed));

      const { scenarioIndex } = inst.params as unknown as { scenarioIndex: number };

      const s = ch01StudyScenarios[scenarioIndex];

      expect(inst.parts).toHaveLength(1);

      const [partType] = inst.parts;

      expect(partType.kind).toBe('mcq');

      if (partType.kind === 'mcq') expect(partType.answer).toBe(s.studyType);
    }
  });

  it('medium template asks for classification and the causal verdict, but not the confounder MCQ, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const inst = medium.generate(mulberry32(seed));

      const { scenarioIndex } = inst.params as unknown as { scenarioIndex: number };

      const s = ch01StudyScenarios[scenarioIndex];

      expect(inst.parts).toHaveLength(2);

      const [partType, partCausal] = inst.parts;

      expect(partType.kind).toBe('mcq');

      if (partType.kind === 'mcq') expect(partType.answer).toBe(s.studyType);

      expect(partCausal.kind).toBe('tf');

      if (partCausal.kind === 'tf') expect(partCausal.answer).toBe(s.causal);
    }
  });

  it('the three templates agree with each other on the classification of any given scenario, across seeds', () => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const easyInst = easy.generate(mulberry32(seed));

      const mediumInst = medium.generate(mulberry32(seed));

      const hardInst = hard.generate(mulberry32(seed));

      const easyIdx = (easyInst.params as unknown as { scenarioIndex: number }).scenarioIndex;

      const mediumIdx = (mediumInst.params as unknown as { scenarioIndex: number }).scenarioIndex;

      const hardIdx = (hardInst.params as unknown as { scenarioIndex: number }).scenarioIndex;

      const easyType = ch01StudyScenarios[easyIdx].studyType;

      const mediumType = ch01StudyScenarios[mediumIdx].studyType;

      const hardType = ch01StudyScenarios[hardIdx].studyType;

      // Same seed, same rng draw sequence up to the scenario pick ⇒ all
      // three templates land on the same scenario, hence the same type.
      expect(easyIdx).toBe(mediumIdx);

      expect(mediumIdx).toBe(hardIdx);

      expect(easyType).toBe(mediumType);

      expect(mediumType).toBe(hardType);
    }
  });

  it('every scenario is reachable by the easy and medium templates too, across a seed sweep', () => {
    for (const template of [easy, medium]) {
      const seen = new Set<number>();

      for (let seed = 0; seed < 4000; seed++) {
        const inst = template.generate(mulberry32(seed));

        const { scenarioIndex } = inst.params as unknown as { scenarioIndex: number };

        seen.add(scenarioIndex);

        if (seen.size === ch01StudyScenarios.length) break;
      }

      expect(seen.size).toBe(ch01StudyScenarios.length);
    }
  });
});
