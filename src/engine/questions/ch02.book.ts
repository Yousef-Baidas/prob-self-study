import type { QuestionTemplate } from '../types';

import { bookQuestion } from '../authoring';

export const ch02Book: QuestionTemplate[] = [
  bookQuestion({
    id: 'ch02-book-committee',

    chapter: 'probability',

    topic: 'Counting techniques',

    difficulty: 'easy',

    citation: 'Walpole §2.3 (combinations)',

    instance: {
      prompt: 'In how many ways can a committee of $3$ be selected from $10$ people?',

      parts: [{ kind: 'numeric', answer: 120, tol: 0 }],

      solution: [
        {
          text: 'Order does not matter: $\\binom{10}{3}=\\dfrac{10!}{3!\\,7!}=120$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-dice-conditional',

    chapter: 'probability',

    topic: 'Conditional probability',

    difficulty: 'medium',

    citation: 'Walpole §2.6 (conditional)',

    instance: {
      prompt: 'Two fair dice are rolled. Given that the sum is $7$, what is the probability the first die shows a $4$?',

      parts: [{ kind: 'numeric', answer: 1 / 6, tol: 0.001 }],

      solution: [
        {
          text: 'Sum $=7$ has 6 equally likely outcomes: $(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$.',
        },

        {
          text: 'Exactly one has first die $=4$, namely $(4,3)$, so the probability is $\\tfrac{1}{6}\\approx0.167$.',
        },
      ],
    },
  }),
];
