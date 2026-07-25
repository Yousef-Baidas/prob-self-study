import type { QuestionTemplate } from '../types';

import type { SeededRng } from '../rng';

import { generatedQuestion } from '../authoring';

import { mean, median, sampleStdDev, quartile, iqr, round } from '../mathx';

/** A small random integer dataset, printed as bold markdown "**a, b, c, …**" in prompts. */
function sampleData(rng: SeededRng, n: number, lo: number, hi: number): number[] {
  return Array.from({ length: n }, () => rng.int(lo, hi));
}

/**
 * n offsets in [0, maxOffset], with the first two forced apart by at least 1.
 * Adding these to any base yields a dataset that never has zero spread
 * (s = 0) no matter how the remaining draws land — non-degeneracy of the
 * sample standard deviation is ruled out by construction, not by re-rolling
 * until a non-degenerate draw appears. This does NOT guarantee a non-zero
 * interquartile range: Q1 and Q3 are read off specific ranks of the sorted
 * sample, and those ranks can still coincide in value when enough of the
 * other draws collide with them. A template that needs IQR > 0 must
 * guarantee that itself — see `quartileClusterOffsets` below.
 */
function spreadOffsets(rng: SeededRng, n: number, maxOffset: number): number[] {
  const offsets = Array.from({ length: n }, () => rng.int(0, maxOffset));

  offsets[0] = 0;

  offsets[1] = rng.int(1, maxOffset);

  return offsets;
}

/**
 * Offsets for the quartile-fence template, built as two clusters — the 3
 * smallest offsets ("low") and the remaining n - 3 ("high") — separated by a
 * forced gap, then shuffled. This course computes quartile position as
 * L = k(n+1)/4 and interpolates to the exact position; for every n this
 * template draws (7, 8, or 9) that puts Q1's interpolation entirely on ranks
 * 1-3 of the sorted sample (the low cluster: L1 = 2 exactly for n = 7, and
 * interpolates ranks 2-3 for n = 8, 9) and Q3's interpolation entirely on
 * rank 4 or later (the high cluster: L3 lands on rank 6 for n = 7, ranks
 * 6-7 for n = 8, ranks 7-8 for n = 9). So Q1 never exceeds the low cluster's
 * largest offset, Q3 never falls below the high cluster's smallest offset,
 * and the forced gap between the two clusters makes IQR >= gap for every
 * possible draw — not just typically. The shuffle afterward only hides the
 * cluster split from the printed data; it doesn't touch the ranks the
 * guarantee relies on, since those are ranks of the *sorted* sample.
 */
function quartileClusterOffsets(rng: SeededRng, n: number, maxOffset: number): number[] {
  const gap = 2;

  const lowMax = Math.floor((maxOffset - gap) / 2);

  const highMin = lowMax + gap;

  const offsets = [
    ...Array.from({ length: 3 }, () => rng.int(0, lowMax)),

    ...Array.from({ length: n - 3 }, () => rng.int(highMin, maxOffset)),
  ];

  for (let i = offsets.length - 1; i > 0; i--) {
    const j = rng.int(0, i);

    [offsets[i], offsets[j]] = [offsets[j], offsets[i]];
  }

  return offsets;
}

const descriptiveSummaryTemplate = generatedQuestion({
  id: 'ch01-gen-descriptive-summary',

  chapter: 'intro',

  topic: 'Descriptive statistics',

  difficulty: 'easy',

  generate: (rng) => {
    const n = rng.int(5, 7);

    const data = sampleData(rng, n, 1, 12);

    const m = round(mean(data), 2);

    const md = round(median(data), 2);

    return {
      prompt: `For the sample **${data.join(', ')}**, compute the mean and the median.`,

      params: { data },

      parts: [
        { kind: 'numeric', label: 'Mean', answer: m, tol: 0.01 },

        { kind: 'numeric', label: 'Median', answer: md, tol: 0.01 },
      ],

      solution: [
        { text: `Mean $=\\dfrac{\\sum x_i}{n}=\\dfrac{${data.reduce((a, b) => a + b, 0)}}{${n}}=${m}$.` },

        { text: `Median: sort the data and take the middle value $=${md}$.` },
      ],
    };
  },
});

const sampleStdDevTemplate = generatedQuestion({
  id: 'ch01-gen-sample-std-dev',

  chapter: 'intro',

  topic: 'Descriptive statistics',

  difficulty: 'medium',

  generate: (rng) => {
    const n = rng.int(5, 6);

    const data = sampleData(rng, n, 2, 10);

    const s = round(sampleStdDev(data), 3);

    const m = round(mean(data), 3);

    return {
      prompt: `Find the sample standard deviation $s$ of the data **${data.join(', ')}**.`,

      params: { data },

      parts: [{ kind: 'numeric', label: 's', answer: s, tol: 0.01 }],

      solution: [
        { text: `Sample mean $\\bar{x}=${m}$.` },

        { text: `$s=\\sqrt{\\dfrac{\\sum (x_i-\\bar{x})^2}{n-1}}=${s}$ (divide by $n-1=${n - 1}$).` },
      ],
    };
  },
});

const cvTwoLinesTemplate = generatedQuestion({
  id: 'ch01-gen-cv-compare',

  chapter: 'intro',

  topic: 'Descriptive statistics',

  difficulty: 'hard',

  generate: (rng) => {
    const n = rng.int(5, 6);

    const maxOffset = rng.int(4, 7);

    const offsets = spreadOffsets(rng, n, maxOffset);

    // Same offsets on both lines ⇒ identical absolute spread (s is
    // translation-invariant), so whichever line has the smaller mean is
    // guaranteed to have the larger CV — no tie is possible.
    const aIsLarger = rng.bool();

    const bigBase = rng.int(60, 90);

    const gap = rng.int(15, 30);

    const smallBase = bigBase - gap;

    const baseA = aIsLarger ? bigBase : smallBase;

    const baseB = aIsLarger ? smallBase : bigBase;

    const dataA = offsets.map((o) => baseA + o);

    const dataB = offsets.map((o) => baseB + o);

    const meanA = round(mean(dataA), 3);

    const meanB = round(mean(dataB), 3);

    const sA = round(sampleStdDev(dataA), 3);

    const sB = round(sampleStdDev(dataB), 3);

    const cvA = round((sA / meanA) * 100, 2);

    const cvB = round((sB / meanB) * 100, 2);

    const winnerIsA = baseA < baseB;

    const winnerLabel = winnerIsA ? 'Line A' : 'Line B';

    return {
      prompt:
        `A bottling plant runs two filling lines at different target volumes. A sample of fill volumes (mL) was ` +
        `taken from each line: Line A: **${dataA.join(', ')}**. Line B: **${dataB.join(', ')}**. Compute the ` +
        `coefficient of variation $CV=\\dfrac{s}{\\bar{x}}\\times100\\%$ for each line, and state which line has the ` +
        `greater relative variability.`,

      params: { dataA, dataB },

      parts: [
        { kind: 'numeric', label: 'CV of Line A (%)', answer: cvA, tol: 0.05 },

        { kind: 'numeric', label: 'CV of Line B (%)', answer: cvB, tol: 0.05 },

        {
          kind: 'mcq',
          label: 'Greater relative variability',
          choices: ['Line A', 'Line B'],
          answer: winnerIsA ? 0 : 1,
        },
      ],

      solution: [
        { text: `Line A: $\\bar{x}_A=${meanA}$, $s_A=${sA}$, so $CV_A=\\dfrac{${sA}}{${meanA}}\\times100=${cvA}\\%$.` },

        { text: `Line B: $\\bar{x}_B=${meanB}$, $s_B=${sB}$, so $CV_B=\\dfrac{${sB}}{${meanB}}\\times100=${cvB}\\%$.` },

        {
          text: `Both lines vary by the same absolute amount, but ${winnerLabel} has the smaller mean, so ${winnerLabel} has the larger $CV$ — the more relatively variable line.`,
        },
      ],
    };
  },
});

const quartileFenceTemplate = generatedQuestion({
  id: 'ch01-gen-quartile-fence',

  chapter: 'intro',

  topic: 'Descriptive statistics',

  difficulty: 'hard',

  generate: (rng) => {
    const n = rng.int(7, 9);

    const base = rng.int(20, 60);

    const maxOffset = rng.int(6, 12);

    const offsets = quartileClusterOffsets(rng, n, maxOffset);

    const data = offsets.map((o) => base + o);

    const q1 = round(quartile(data, 1), 2);

    const q3 = round(quartile(data, 3), 2);

    const iqrValue = round(iqr(data), 2);

    const lowerFence = round(q1 - 1.5 * iqrValue, 2);

    const upperFence = round(q3 + 1.5 * iqrValue, 2);

    // The test value is built directly from the fences, not compared after
    // the fact: past the upper fence it is always an outlier, and the median
    // — always between Q1 and Q3 — is always inside them. Either way the
    // question stays well-posed regardless of the draw.
    const isOutlierDraw = rng.bool();

    const margin = rng.int(3, 8);

    const testValue = isOutlierDraw ? round(upperFence + margin, 1) : round(quartile(data, 2), 1);

    return {
      prompt:
        `A quality-control engineer records the following chemical concentration readings (ppm) from ${n} ` +
        `samples: **${data.join(', ')}**. Find $Q_1$, $Q_3$, and the IQR. Then, using the $1.5\\times IQR$ rule, ` +
        `determine whether a new reading of ${testValue} ppm should be flagged as an outlier.`,

      params: { data, testValue },

      parts: [
        { kind: 'numeric', label: 'Q1', answer: q1, tol: 0.05 },

        { kind: 'numeric', label: 'Q3', answer: q3, tol: 0.05 },

        { kind: 'numeric', label: 'IQR', answer: iqrValue, tol: 0.05 },

        { kind: 'tf', label: 'Is it an outlier?', answer: isOutlierDraw },
      ],

      solution: [
        {
          text: `Sort the data and locate $Q_1$ (position $\\frac{n+1}{4}$) and $Q_3$ (position $\\frac{3(n+1)}{4}$): $Q_1=${q1}$, $Q_3=${q3}$.`,
        },

        { text: `$IQR=Q_3-Q_1=${q3}-${q1}=${iqrValue}$.` },

        { text: `Fences: lower $=Q_1-1.5\\,IQR=${lowerFence}$, upper $=Q_3+1.5\\,IQR=${upperFence}$.` },

        {
          text: `${testValue} ppm is ${isOutlierDraw ? '' : 'not '}outside $[${lowerFence}, ${upperFence}]$, so it ${isOutlierDraw ? 'is' : 'is not'} flagged as an outlier.`,
        },
      ],
    };
  },
});

export const ch01Generators: QuestionTemplate[] = [
  descriptiveSummaryTemplate,

  sampleStdDevTemplate,

  cvTwoLinesTemplate,

  quartileFenceTemplate,
];
