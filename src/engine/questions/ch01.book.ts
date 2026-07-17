import type { QuestionTemplate } from '../types';

import { bookQuestion } from '../authoring';

export const ch01Book: QuestionTemplate[] = [
  bookQuestion({
    id: 'ch01-book-classify',

    chapter: 'intro',

    topic: 'Types of data',

    difficulty: 'easy',

    citation: 'Walpole §1.1 (concept)',

    instance: {
      prompt: 'Which of the following is a **discrete quantitative** variable?',

      parts: [
        {
          kind: 'mcq',

          choices: [
            'The height of a student (cm)',

            'The number of defective items in a batch',

            'Eye colour',

            'The temperature of a reactor (°C)',
          ],

          answer: 1,
        },
      ],

      solution: [
        {
          text: 'Counts (number of defective items) are **discrete quantitative**. Height and temperature are continuous; eye colour is qualitative.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-sample-vs-pop',

    chapter: 'intro',

    topic: 'Populations and samples',

    difficulty: 'easy',

    citation: 'Walpole §1.2 (concept)',

    instance: {
      prompt:
        'True or false: a **statistic** is computed from a sample, while a **parameter** describes a population.',

      parts: [{ kind: 'tf', answer: true }],

      solution: [
        {
          text: 'True. A parameter (e.g. $\\mu$) describes the whole population; a statistic (e.g. $\\bar{x}$) is computed from a sample and estimates it.',
        },
      ],
    },
  }),
];
