import type { QuestionTemplate } from '../types';

import type { SeededRng } from '../rng';

import { generatedQuestion } from '../authoring';

import { mean, median, sampleStdDev, round } from '../mathx';

/** A small random integer dataset, printed as "$$a, b, c, …$$" in prompts. */
function sampleData(rng: SeededRng, n: number, lo: number, hi: number): number[] {
  return Array.from({ length: n }, () => rng.int(lo, hi));
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

export const ch01Generators: QuestionTemplate[] = [
  descriptiveSummaryTemplate,

  sampleStdDevTemplate,
];
