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

/**
 * A trimmed-mean scenario built as nine "ordinary" values clustered within
 * `maxOffset` of `base`, plus one forced outlier at least 15 above the
 * highest possible ordinary value (base + maxOffset). Because the outlier
 * always exceeds every ordinary value, it is always the unique maximum of
 * the ten-value sample, so trimming away "the largest 10%" (exactly one
 * value for n = 10) always removes the outlier itself — never an ordinary
 * value by mistake. This is a guarantee by construction, not a property
 * that happens to hold: no draw can put the outlier anywhere but last.
 *
 * The "which is closer to the median" verdict is *not* forced to one
 * answer — it is computed from the actual draw, exactly the way the
 * grader will recompute it. What is guaranteed is that the comparison is
 * never a tie: `outlier` only ever appears in `mean`, not in `median` or
 * `trimmedMeanVal`, so nudging it by 1 (done only in the vanishingly rare
 * case of an exact tie) changes `mean` without touching the other two,
 * which deterministically breaks the tie.
 */
const trimmedMeanTemplate = generatedQuestion({
  id: 'ch01-gen-trimmed-mean',

  chapter: 'intro',

  topic: 'Descriptive statistics',

  difficulty: 'hard',

  generate: (rng) => {
    const n = 10;

    const base = rng.int(20, 45);

    const maxOffset = rng.int(4, 8);

    const ordinaryOffsets = spreadOffsets(rng, n - 1, maxOffset);

    const ordinaryValues = ordinaryOffsets.map((o) => base + o);

    const sortedOrdinary = [...ordinaryValues].sort((a, b) => a - b);

    // Median and the trimmed mean depend only on the ordinary cluster (the
    // outlier is always trimmed away below), so both are fixed before the
    // outlier — and any tie-break nudge to it — are decided. n = 10 is
    // even, so the sample median is the average of the 5th and 6th sorted
    // values (indices 4, 5 of 10) — both of which fall among the 9 sorted
    // ordinary values (indices 0-8), never on the outlier at index 9.
    const md = round((sortedOrdinary[4] + sortedOrdinary[5]) / 2, 3);

    const trimmedMeanVal = round(mean(sortedOrdinary.slice(1)), 3);

    let outlierBonus = rng.int(15, 30);

    let outlier = base + maxOffset + outlierBonus;

    let m = round(mean([...ordinaryValues, outlier]), 3);

    if (Math.abs(round(m - md, 3)) === Math.abs(round(trimmedMeanVal - md, 3))) {
      outlierBonus += 1;

      outlier += 1;

      m = round(mean([...ordinaryValues, outlier]), 3);
    }

    const unshuffled = [...ordinaryValues, outlier];

    const positions = Array.from({ length: n }, (_, i) => i);

    for (let i = positions.length - 1; i > 0; i--) {
      const j = rng.int(0, i);

      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    const data = positions.map((i) => unshuffled[i]);

    const sorted = [...data].sort((a, b) => a - b);

    // Computed, not asserted: whichever of {trimmed mean, mean} actually
    // lands nearer the median for this draw.
    const closerToMedian = Math.abs(trimmedMeanVal - md) < Math.abs(m - md);

    return {
      prompt:
        `A courier company logs the delivery times (minutes) for ${n} packages: **${data.join(', ')}**. ` +
        `Compute the sample mean, the sample median, and the $10\\%$ trimmed mean. Then state whether the ` +
        `trimmed mean sits closer to the median than the untrimmed mean does.`,

      params: { data },

      parts: [
        { kind: 'numeric', label: 'Mean', answer: m, tol: 0.01 },

        { kind: 'numeric', label: 'Median', answer: md, tol: 0.01 },

        { kind: 'numeric', label: '10% trimmed mean', answer: trimmedMeanVal, tol: 0.01 },

        { kind: 'tf', label: 'Trimmed mean closer to the median than the mean is', answer: closerToMedian },
      ],

      solution: [
        { text: `Mean $\\bar{x}=\\dfrac{\\sum x_i}{${n}}=${m}$.` },

        { text: `Median: sort the data and average the two middle values $=${md}$.` },

        {
          text: `$10\\%$ of $${n}$ is $1$, so drop the smallest and largest sorted value, leaving $${n - 2}$ values: $\\bar{x}_{\\mathrm{tr}(10)}=${trimmedMeanVal}$.`,
        },

        {
          text: `The largest value (${sorted[n - 1]}) is a clear outlier, far above the rest. Removing it ${closerToMedian ? 'pulls the trimmed mean back toward the median, away from the outlier-inflated mean' : 'still leaves the trimmed mean on the far side of the median from the mean, though not necessarily closer for every draw'}.`,
        },
      ],
    };
  },
});

/**
 * A linear rescale y = a*x + b applied to a spread-guaranteed dataset. `a`
 * is drawn from {2, 3, 4} so it is never 1 (a no-op scale), which keeps the
 * "how does s change" question non-trivial on every draw: s_y = |a|*s_x is
 * always strictly different from s_x since a != 1 and s_x > 0 (guaranteed
 * by `spreadOffsets`).
 */
const rescaleShiftTemplate = generatedQuestion({
  id: 'ch01-gen-rescale-shift',

  chapter: 'intro',

  topic: 'Descriptive statistics',

  difficulty: 'hard',

  generate: (rng) => {
    const n = rng.int(5, 6);

    const base = rng.int(10, 30);

    const maxOffset = rng.int(4, 9);

    const offsets = spreadOffsets(rng, n, maxOffset);

    const data = offsets.map((o) => base + o);

    const a = rng.pick([2, 3, 4]);

    const b = rng.int(-15, 15);

    const xMean = round(mean(data), 3);

    const xMedian = round(median(data), 3);

    const xStd = round(sampleStdDev(data), 3);

    const yMean = round(a * xMean + b, 3);

    const yMedian = round(a * xMedian + b, 3);

    const yStd = round(a * xStd, 3);

    return {
      prompt:
        `A lab measures a batch of ${n} samples: **${data.join(', ')}** (in original units). Every reading is ` +
        `then converted with $y = ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}$. Without recomputing from the ` +
        `converted values, find the mean, median, and sample standard deviation of $y$.`,

      params: { data, a, b },

      parts: [
        { kind: 'numeric', label: 'Mean of y', answer: yMean, tol: 0.01 },

        { kind: 'numeric', label: 'Median of y', answer: yMedian, tol: 0.01 },

        { kind: 'numeric', label: 'Sample std dev of y', answer: yStd, tol: 0.01 },
      ],

      solution: [
        { text: `Original: $\\bar{x}=${xMean}$, $\\tilde{x}=${xMedian}$, $s_x=${xStd}$.` },

        {
          text: `A linear transform carries the mean and median along with it: $\\bar{y}=${a}\\bar{x}${b >= 0 ? '+' : '-'}${Math.abs(b)}=${yMean}$, and likewise $\\tilde{y}=${a}\\tilde{x}${b >= 0 ? '+' : '-'}${Math.abs(b)}=${yMedian}$.`,
        },

        {
          text: `The shift $${b >= 0 ? '+' : '-'}${Math.abs(b)}$ moves every value the same amount, so it cannot change the spread: $s_y=|${a}|\\,s_x=${yStd}$ — the additive constant drops out entirely.`,
        },
      ],
    };
  },
});

/**
 * Reconstructs one missing observation from a reported (exact-integer)
 * sample mean. `knownOffsets` are drawn within `maxDev` of the target mean
 * `M`, and `M` is drawn well above `(n-1) * maxDev`, so the algebraic
 * solution `missing = n*M - sum(known)` is always strictly positive —
 * never a degenerate zero-or-negative "missing measurement." n*M is exact
 * (both integers), so the reconstruction carries no rounding error.
 */
const missingValueTemplate = generatedQuestion({
  id: 'ch01-gen-missing-value',

  chapter: 'intro',

  topic: 'Descriptive statistics',

  difficulty: 'hard',

  generate: (rng) => {
    const n = rng.int(4, 6);

    const maxDev = 5;

    const M = rng.int(50, 70);

    const knownOffsets = Array.from({ length: n - 1 }, () => rng.int(-maxDev, maxDev));

    const known = knownOffsets.map((o) => M + o);

    const total = n * M;

    const missing = total - known.reduce((s, x) => s + x, 0);

    // A second, chained part: a transcription error means the true value is
    // double what was reconstructed. The corrected total simply gains one
    // extra copy of `missing`, so the corrected mean is M + missing/n exactly.
    const correctedMean = round(M + missing / n, 3);

    return {
      prompt:
        `A sample of $${n}$ sensor readings has a reported mean of $${M}$, but only $${n - 1}$ of the readings ` +
        `were recorded: **${known.join(', ')}**. (a) Find the missing reading. (b) It turns out the missing ` +
        `reading was mistakenly recorded at half its true value — the true reading is double what you found in ` +
        `(a). Find the corrected sample mean.`,

      params: { known, M, n },

      parts: [
        { kind: 'numeric', label: 'Missing reading', answer: missing, tol: 0.01 },

        { kind: 'numeric', label: 'Corrected mean', answer: correctedMean, tol: 0.01 },
      ],

      solution: [
        {
          text: `The mean satisfies $\\sum x_i = n\\bar{x} = ${n}\\times${M}=${total}$. The known readings sum to $${known.reduce((s, x) => s + x, 0)}$, so the missing reading is $${total}-${known.reduce((s, x) => s + x, 0)}=${missing}$.`,
        },

        {
          text: `If the true reading is $2\\times${missing}=${2 * missing}$ instead, the total gains one extra copy of ${missing}: new total $=${total}+${missing}=${total + missing}$, so the corrected mean is $\\dfrac{${total + missing}}{${n}}=${correctedMean}$.`,
        },
      ],
    };
  },
});

/**
 * Pooled (combined) mean of two groups. `n1` and `n2` are forced apart by a
 * gap of at least 3, and `m1`/`m2` by a gap of at least 10, so the weighted
 * (pooled) mean is always strictly different from the naive simple average
 * (m1+m2)/2 — the two coincide only when either the weights or the group
 * means are equal, both of which are ruled out by construction.
 */
const pooledMeanTemplate = generatedQuestion({
  id: 'ch01-gen-pooled-mean',

  chapter: 'intro',

  topic: 'Descriptive statistics',

  difficulty: 'hard',

  generate: (rng) => {
    const n1 = rng.int(8, 15);

    const n2 = n1 + rng.int(3, 10);

    const m1 = rng.int(40, 60);

    const m2 = m1 + rng.int(10, 20) * (rng.bool() ? 1 : -1);

    const totalA = m1 * n1;

    const totalB = m2 * n2;

    const pooledMean = round((totalA + totalB) / (n1 + n2), 3);

    const simpleAvg = round((m1 + m2) / 2, 3);

    return {
      prompt:
        `Line A ran $${n1}$ units with fill weights summing to $${totalA}$ g. Line B ran $${n2}$ units with fill ` +
        `weights summing to $${totalB}$ g. Find the pooled (combined) mean fill weight across both lines, and ` +
        `state whether it equals the simple average of the two lines' individual means.`,

      params: { n1, n2, totalA, totalB },

      parts: [
        { kind: 'numeric', label: 'Pooled mean (g)', answer: pooledMean, tol: 0.01 },

        { kind: 'tf', label: 'Equal to the simple average of the two means', answer: false },
      ],

      solution: [
        { text: `Line A mean $=\\dfrac{${totalA}}{${n1}}=${m1}$; Line B mean $=\\dfrac{${totalB}}{${n2}}=${m2}$.` },

        {
          text: `Pooled mean $=\\dfrac{n_1\\bar{x}_1+n_2\\bar{x}_2}{n_1+n_2}=\\dfrac{${totalA}+${totalB}}{${n1}+${n2}}=${pooledMean}$.`,
        },

        {
          text: `The simple average of the means is $\\dfrac{${m1}+${m2}}{2}=${simpleAvg}$, which differs from the pooled mean whenever the group sizes differ (here $${n1}\\ne ${n2}$) — the pooled mean weights each group by its size, so it is **not** the plain average of the two means.`,
        },
      ],
    };
  },
});

/**
 * Same non-degeneracy guarantee as `quartileFenceTemplate`
 * (`quartileClusterOffsets` forces IQR > 0 for every draw), reused here so
 * the *presentation* changes — the data arrives as a stem-and-leaf display
 * that must be read back into a list before Q1/Q3/IQR can be computed —
 * while the underlying arithmetic guarantee stays identical.
 */
function buildStemLeaf(data: number[]): string {
  const sorted = [...data].sort((a, b) => a - b);

  const groups = new Map<number, number[]>();

  for (const v of sorted) {
    const stem = Math.floor(v / 10);

    const leaf = v % 10;

    if (!groups.has(stem)) groups.set(stem, []);

    groups.get(stem)!.push(leaf);
  }

  const stems = [...groups.keys()].sort((a, b) => a - b);

  return stems.map((s) => `${s} | ${groups.get(s)!.join(' ')}`).join('\n');
}

const stemLeafQuartileTemplate = generatedQuestion({
  id: 'ch01-gen-stem-leaf-quartile',

  chapter: 'intro',

  topic: 'Descriptive statistics',

  difficulty: 'hard',

  generate: (rng) => {
    const n = rng.int(7, 9);

    const base = rng.int(30, 55);

    const maxOffset = rng.int(6, 12);

    const offsets = quartileClusterOffsets(rng, n, maxOffset);

    const data = offsets.map((o) => base + o);

    const display = buildStemLeaf(data);

    const q1 = round(quartile(data, 1), 2);

    const q3 = round(quartile(data, 3), 2);

    const iqrValue = round(iqr(data), 2);

    const lowerFence = round(q1 - 1.5 * iqrValue, 2);

    const upperFence = round(q3 + 1.5 * iqrValue, 2);

    return {
      prompt:
        `A stem-and-leaf display (stem = tens digit, leaf = units digit) records ${n} bolt-torque readings ` +
        `(N·m):\n\n\`\`\`\n${display}\n\`\`\`\n\nRead off the ${n} readings, then find $Q_1$, $Q_3$, the IQR, and ` +
        `the lower and upper $1.5\\times IQR$ outlier fences.`,

      params: { data },

      parts: [
        { kind: 'numeric', label: 'Q1', answer: q1, tol: 0.05 },

        { kind: 'numeric', label: 'Q3', answer: q3, tol: 0.05 },

        { kind: 'numeric', label: 'IQR', answer: iqrValue, tol: 0.05 },

        { kind: 'numeric', label: 'Lower fence', answer: lowerFence, tol: 0.05 },

        { kind: 'numeric', label: 'Upper fence', answer: upperFence, tol: 0.05 },
      ],

      solution: [
        {
          text: `Reading the display stem by stem gives the sorted list $${[...data].sort((a, b) => a - b).join(', ')}$.`,
        },

        { text: `$Q_1=${q1}$ and $Q_3=${q3}$ by the position rule $L_k=k(n+1)/4$, so $IQR=${iqrValue}$.` },

        { text: `Fences: lower $=Q_1-1.5\\,IQR=${lowerFence}$, upper $=Q_3+1.5\\,IQR=${upperFence}$.` },
      ],
    };
  },
});

/** Choices shared by every draw of `studyDesignTemplate`. */
export const studyTypeChoices = ['Designed experiment', 'Observational study', 'Retrospective study'];

/**
 * A small, hand-verified bank of study-design scenarios rather than
 * randomly generated ones — classifying a study and spotting its
 * confounder is a judgment call that a procedural generator cannot
 * responsibly fabricate. Non-degeneracy here means something different
 * from the numeric templates above: every entry has one unambiguous
 * correct study type, one unambiguous correct causal verdict, and exactly
 * one defensible "biggest threat" among its four confounder choices —
 * checked exhaustively in tests (every entry), not just sampled by seed.
 * Exported so the test file can recompute the expected parts from
 * `params.scenarioIndex` without duplicating this bank.
 *
 * The bank is deliberately balanced across the three study types (see the
 * balance test) and the correct MCQ index is deliberately scattered across
 * positions 0-3 and across short/long option strings, so the confounder
 * question cannot be answered by "pick the longest option" or "pick
 * position N" heuristics — see the position/length checks in the test file.
 */
export const ch01StudyScenarios: Array<{
  prompt: string;

  studyType: number;

  causal: boolean;

  confounderChoices: string[];

  confounderAnswer: number;

  explanation: string;
}> = [
  {
    prompt:
      'Engineers randomly assign 40 identical steel beams to one of two coatings (galvanized vs. uncoated) and ' +
      'measure corrosion after a fixed exposure period.',

    studyType: 0,

    causal: true,

    confounderChoices: [
      'Ambient humidity during exposure',

      'The beams’ manufacturing batch',

      'None — random assignment balances these across groups',

      'The technician who applied the coating',
    ],

    confounderAnswer: 2,

    explanation:
      'Treatments (coatings) are assigned to experimental units (beams) at random, so this is a designed experiment. Randomization balances nuisance factors like humidity, batch, and technician across both groups, so a corrosion difference can be attributed to the coating itself.',
  },

  {
    prompt:
      'Researchers record blood pressure and self-reported daily salt intake in 500 hospital patients over a ' +
      'year, without controlling either variable.',

    studyType: 1,

    causal: false,

    confounderChoices: [
      "Patients' body weight, which independently affects blood pressure",

      'The season in which data were recorded',

      "The hospital's electronic records system",

      'None — the study design already controls for outside factors',
    ],

    confounderAnswer: 0,

    explanation:
      'Salt intake is only observed, not assigned, so this is an observational study. Body weight plausibly affects blood pressure independently of salt intake, so it can confound the salt–blood pressure relationship; without randomization, no causal claim about salt intake is justified.',
  },

  {
    prompt:
      'An analyst pulls five years of archived maintenance logs to compare failure rates between two pump models ' +
      'that were never randomly assigned to different plants.',

    studyType: 2,

    causal: false,

    confounderChoices: [
      'Missing or inconsistent historical records across plants',

      'The current price of replacement pumps',

      'None — retrospective data is as reliable as a designed experiment',

      "The analyst's preferred spreadsheet software",
    ],

    confounderAnswer: 0,

    explanation:
      'The data are purely historical, collected for another purpose with no random assignment, so this is a retrospective study. Historical records are often incomplete or inconsistent across sites, which threatens validity; no causal claim about pump model is justified.',
  },

  {
    prompt:
      'A food scientist randomly assigns 60 bread loaves to one of three proofing times and measures loaf volume.',

    studyType: 0,

    causal: true,

    confounderChoices: [
      'Oven temperature drift over the day',

      'Flour batch differences',

      'None — random assignment balances these across groups',

      'Loaf shape before baking',
    ],

    confounderAnswer: 2,

    explanation:
      'Proofing time (the treatment) is assigned to loaves (the experimental units) at random, so this is a designed experiment. Randomization balances nuisance factors like oven drift, flour batch, and starting shape across proofing times, so a volume difference can be attributed to proofing time.',
  },

  {
    prompt:
      'A materials lab randomly assigns 48 concrete cylinders to one of four curing temperatures and measures ' +
      'compressive strength after 28 days.',

    studyType: 0,

    causal: true,

    confounderChoices: [
      'None — random assignment balances these across the four temperature groups',

      'Cylinder mold batch',

      'Curing-room humidity settings',

      'The technician who mixed the concrete',
    ],

    confounderAnswer: 0,

    explanation:
      'Curing temperature (the treatment) is assigned to cylinders (the experimental units) at random, so this is a designed experiment. Randomization balances nuisance factors like mold batch, humidity, and mixing technician across temperatures, so a strength difference can be attributed to curing temperature.',
  },

  {
    prompt:
      'A pharmaceutical trial randomly assigns 200 volunteers to receive either a new antihypertensive drug or a ' +
      'placebo, then measures blood pressure change after 8 weeks.',

    studyType: 0,

    causal: true,

    confounderChoices: [
      'Baseline blood pressure variability among volunteers',

      'The pharmacy that dispensed the pills',

      'None — random assignment balances these across the drug and placebo groups',

      'Time of day the dose was taken',
    ],

    confounderAnswer: 2,

    explanation:
      'The drug (the treatment) is assigned to volunteers (the experimental units) at random, so this is a designed experiment. Randomization balances nuisance factors like baseline blood pressure, dispensing pharmacy, and dosing time across the drug and placebo groups, so a blood-pressure difference can be attributed to the drug.',
  },

  {
    prompt:
      'An agronomist randomly assigns 36 field plots to one of three irrigation schedules and measures crop yield ' +
      'at harvest.',

    studyType: 0,

    causal: true,

    confounderChoices: [
      'Soil type differences between plots',

      'Seed supplier',

      'Weather during the growing season',

      'None — random assignment balances these across irrigation schedules',
    ],

    confounderAnswer: 3,

    explanation:
      'Irrigation schedule (the treatment) is assigned to field plots (the experimental units) at random, so this is a designed experiment. Randomization balances nuisance factors like soil type, seed supplier, and weather across schedules, so a yield difference can be attributed to the irrigation schedule.',
  },

  {
    prompt:
      'A wildlife biologist records bark-beetle infestation levels and observed tree mortality across 80 ' +
      'naturally growing pine stands, without controlling either variable.',

    studyType: 1,

    causal: false,

    confounderChoices: [
      'The season in which stands were surveyed',

      'Stand age, which independently affects both susceptibility to beetles and mortality risk',

      'None — the study design already controls for outside factors',

      "The biologist's field notebook brand",
    ],

    confounderAnswer: 1,

    explanation:
      'Infestation level is only observed, not assigned, so this is an observational study. Stand age plausibly affects both beetle susceptibility and mortality risk independently, so it can confound the infestation–mortality relationship; without randomization, no causal claim about infestation is justified.',
  },

  {
    prompt:
      'An epidemiologist tracks cholesterol levels and self-reported dietary fat intake in 300 adults recruited ' +
      'from a community clinic, monitoring them as they go about their normal lives.',

    studyType: 1,

    causal: false,

    confounderChoices: [
      "The clinic's appointment scheduling software",

      'None — observational data eliminates the need for randomization',

      'Physical activity level, which independently affects cholesterol',

      'The season in which blood was drawn',
    ],

    confounderAnswer: 2,

    explanation:
      'Dietary fat intake is only observed, not assigned, so this is an observational study. Physical activity plausibly affects cholesterol independently of diet, so it can confound the diet–cholesterol relationship; without randomization, no causal claim about dietary fat is justified.',
  },

  {
    prompt:
      'A network engineer measures server response latency and simultaneously logs ambient data-center ' +
      'temperature across 150 servers already in production, taking no action to change either.',

    studyType: 1,

    causal: false,

    confounderChoices: [
      'The brand of network cable used',

      'Server workload (traffic volume), which independently affects latency',

      "The engineer's preferred monitoring dashboard",

      'None — logging both variables already isolates their relationship',
    ],

    confounderAnswer: 1,

    explanation:
      'Temperature is only observed, not assigned, so this is an observational study. Server workload plausibly affects latency independently of temperature, so it can confound the temperature–latency relationship; without randomization, no causal claim about temperature is justified.',
  },

  {
    prompt:
      'A sociologist surveys 400 factory workers about shift length and reported fatigue, recording whatever ' +
      'shift each worker happens to already be assigned by their employer.',

    studyType: 1,

    causal: false,

    confounderChoices: [
      "The survey's paper color",

      'None — self-report surveys are immune to confounding',

      'The day of the week the survey was administered',

      'Job role, which independently affects fatigue regardless of shift length',
    ],

    confounderAnswer: 3,

    explanation:
      'Shift length is only observed, not assigned, so this is an observational study. Job role plausibly affects fatigue independently of shift length, so it can confound the shift–fatigue relationship; without randomization, no causal claim about shift length is justified.',
  },

  {
    prompt:
      'A safety auditor reviews ten years of incident reports to compare injury rates between two forklift models ' +
      'that operations chose to purchase for unrelated reasons.',

    studyType: 2,

    causal: false,

    confounderChoices: [
      'The current retail price of each forklift model',

      'Missing or inconsistently reported incident details across the sites that use each model',

      'None — retrospective incident data is as reliable as a designed experiment',

      "The auditor's font choice in the report",
    ],

    confounderAnswer: 1,

    explanation:
      'The data are purely historical, collected for another purpose with no random assignment, so this is a retrospective study. Historical incident records are often incomplete or inconsistently reported across sites, which threatens validity; no causal claim about forklift model is justified.',
  },

  {
    prompt:
      'A financial analyst mines five years of archived transaction records to compare fraud rates between two ' +
      'payment processors that merchants adopted independently.',

    studyType: 2,

    causal: false,

    confounderChoices: [
      "The analyst's spreadsheet software",

      'None — archived transaction data eliminates the need for controls',

      'The current stock price of each payment processor',

      'Differences in merchant risk profile that led merchants to choose one processor over the other',
    ],

    confounderAnswer: 3,

    explanation:
      'The data are purely historical, collected for another purpose with no random assignment, so this is a retrospective study. Merchants self-selected a processor, so merchant risk profile can drive both that choice and the fraud rate; no causal claim about the processor is justified.',
  },

  {
    prompt:
      'A hospital administrator reviews archived patient charts from the last decade to compare recovery times ' +
      'between two surgical techniques that were never randomly assigned to patients.',

    studyType: 2,

    causal: false,

    confounderChoices: [
      'Patient severity at the time of surgery, which likely influenced which technique was chosen',

      "The hospital's chart filing cabinet color",

      'The current cost of each surgical technique',

      'None — retrospective chart review is as reliable as a designed experiment',
    ],

    confounderAnswer: 0,

    explanation:
      'The data are purely historical patient charts, collected for another purpose with no random assignment, so this is a retrospective study. Surgeons likely chose the technique based on patient severity, so severity can confound the technique–recovery relationship; no causal claim about technique is justified.',
  },

  {
    prompt:
      'A geologist examines decades-old seismic survey archives to compare fault-slip rates between two regions ' +
      'that were surveyed using different, now-discontinued instruments.',

    studyType: 2,

    causal: false,

    confounderChoices: [
      "The geologist's institutional affiliation",

      'The current market price of seismic equipment',

      'None — historical survey archives are as reliable as a designed experiment',

      'Instrument differences between the two now-discontinued survey systems, which affect measurement precision',
    ],

    confounderAnswer: 3,

    explanation:
      'The data are purely historical survey archives, collected for another purpose with no random assignment, so this is a retrospective study. The two regions were measured with different discontinued instruments, so instrument precision can confound the region–fault-slip relationship; no causal claim about region is justified.',
  },
];

/**
 * Generic, scenario-independent reasoning keyed only by study type — used by
 * the easy/medium templates so they explain the *defining feature* of the
 * classification and the causal rule, without leaking the scenario-specific
 * confounder that the hard template's `explanation` field reveals. This
 * keeps the three difficulties genuinely different in what they ask (1, 2,
 * then 3 graded parts), not just in how much prose they print.
 */
const classifyReasonByType: Record<number, string> = {
  0: 'The investigator assigns the treatment to experimental units at random — that random assignment is the defining feature of a designed experiment.',

  1: 'The factor of interest is only measured, never assigned by the investigator — subjects are simply observed as they naturally occur, which is the defining feature of an observational study.',

  2: 'The analysis works backward from existing historical records collected for another purpose, with no random assignment made — that reliance on the past record is the defining feature of a retrospective study.',
};

const causalReasonByType: Record<number, string> = {
  0: 'Random assignment balances nuisance factors across the treatment groups, so a difference found between groups can be attributed to the treatment itself — this supports a causal conclusion.',

  1: 'Without random assignment, an unmeasured confounding variable could explain an observed association just as well as the factor under study — this does not support a causal conclusion.',

  2: 'The data are historical and group membership was never randomized, so any difference could stem from whatever process produced the historical split rather than the factor itself — this does not support a causal conclusion.',
};

const studyDesignEasyTemplate = generatedQuestion({
  id: 'ch01-gen-study-design-easy',

  chapter: 'intro',

  topic: 'Study design',

  difficulty: 'easy',

  generate: (rng) => {
    const scenarioIndex = rng.int(0, ch01StudyScenarios.length - 1);

    const s = ch01StudyScenarios[scenarioIndex];

    return {
      prompt: `${s.prompt} Classify the study.`,

      params: { scenarioIndex },

      parts: [{ kind: 'mcq', label: 'Study type', choices: studyTypeChoices, answer: s.studyType }],

      solution: [{ text: classifyReasonByType[s.studyType] }],
    };
  },
});

const studyDesignMediumTemplate = generatedQuestion({
  id: 'ch01-gen-study-design-medium',

  chapter: 'intro',

  topic: 'Study design',

  difficulty: 'medium',

  generate: (rng) => {
    const scenarioIndex = rng.int(0, ch01StudyScenarios.length - 1);

    const s = ch01StudyScenarios[scenarioIndex];

    return {
      prompt: `${s.prompt} (a) Classify the study. (b) Does it support a causal conclusion?`,

      params: { scenarioIndex },

      parts: [
        { kind: 'mcq', label: 'Study type', choices: studyTypeChoices, answer: s.studyType },

        { kind: 'tf', label: 'Supports a causal conclusion', answer: s.causal },
      ],

      solution: [{ text: classifyReasonByType[s.studyType] }, { text: causalReasonByType[s.studyType] }],
    };
  },
});

const studyDesignTemplate = generatedQuestion({
  id: 'ch01-gen-study-design',

  chapter: 'intro',

  topic: 'Study design',

  difficulty: 'hard',

  generate: (rng) => {
    const scenarioIndex = rng.int(0, ch01StudyScenarios.length - 1);

    const s = ch01StudyScenarios[scenarioIndex];

    return {
      prompt: `${s.prompt} (a) Classify the study. (b) Does it support a causal conclusion? (c) What is the biggest threat to (or, for a designed experiment, the reason for) that conclusion?`,

      params: { scenarioIndex },

      parts: [
        { kind: 'mcq', label: 'Study type', choices: studyTypeChoices, answer: s.studyType },

        { kind: 'tf', label: 'Supports a causal conclusion', answer: s.causal },

        { kind: 'mcq', label: 'Biggest threat / reason', choices: s.confounderChoices, answer: s.confounderAnswer },
      ],

      solution: [{ text: s.explanation }],
    };
  },
});

export const ch01Generators: QuestionTemplate[] = [
  descriptiveSummaryTemplate,

  sampleStdDevTemplate,

  cvTwoLinesTemplate,

  quartileFenceTemplate,

  trimmedMeanTemplate,

  rescaleShiftTemplate,

  missingValueTemplate,

  pooledMeanTemplate,

  stemLeafQuartileTemplate,

  studyDesignEasyTemplate,

  studyDesignMediumTemplate,

  studyDesignTemplate,
];
