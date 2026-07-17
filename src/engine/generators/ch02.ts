import type { QuestionTemplate } from '../types';

import { generatedQuestion } from '../authoring';

import { nPr, nCr } from '../mathx';

const permutationsTemplate = generatedQuestion({
  id: 'ch02-gen-permutations',

  chapter: 'probability',

  topic: 'Counting techniques',

  difficulty: 'medium',

  generate: (rng) => {
    const n = rng.int(5, 9);

    const r = rng.int(2, 4);

    const answer = nPr(n, r);

    return {
      prompt: `From ${n} distinct candidates, in how many ordered ways can ${r} positions be filled?`,

      params: { n, r },

      parts: [{ kind: 'numeric', answer, tol: 0 }],

      solution: [
        { text: `Order matters, so use permutations: $_{${n}}P_{${r}}=\\dfrac{${n}!}{(${n}-${r})!}$.` },

        { text: `$=\\dfrac{${n}!}{${n - r}!}=${answer}$.` },
      ],
    };
  },
});

const combinationsTemplate = generatedQuestion({
  id: 'ch02-gen-combinations',

  chapter: 'probability',

  topic: 'Counting techniques',

  difficulty: 'medium',

  generate: (rng) => {
    const n = rng.int(6, 10);

    const r = rng.int(2, 4);

    const answer = nCr(n, r);

    return {
      prompt: `From ${n} people, how many different committees of ${r} can be chosen?`,

      params: { n, r },

      parts: [{ kind: 'numeric', answer, tol: 0 }],

      solution: [
        { text: `Order does not matter, so use combinations: $\\binom{${n}}{${r}}=\\dfrac{${n}!}{${r}!\\,(${n}-${r})!}$.` },

        { text: `$=${answer}$.` },
      ],
    };
  },
});

export const ch02Generators: QuestionTemplate[] = [
  permutationsTemplate,

  combinationsTemplate,
];
