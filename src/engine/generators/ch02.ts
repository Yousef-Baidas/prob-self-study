import type { QuestionTemplate } from '../types';

import { generatedQuestion } from '../authoring';

import { nPr, nCr, round } from '../mathx';

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

const conditionalTwoWayTemplate = generatedQuestion({
  id: 'ch02-gen-conditional-two-way',

  chapter: 'probability',

  topic: 'Conditional probability',

  difficulty: 'medium',

  generate: (rng) => {
    const aAndB = rng.int(5, 20);

    const bOnly = rng.int(5, 20);

    const b = aAndB + bOnly; // people with trait B

    const answer = round(aAndB / b, 4);

    return {
      prompt:
        `Of ${b} students who passed the midterm (event $B$), ${aAndB} also passed the final (event $A$). ` +
        `Find $P(A\\mid B)$.`,

      params: { aAndB, bOnly },

      parts: [{ kind: 'numeric', answer, tol: 0.001 }],

      solution: [
        { text: `$P(A\\mid B)=\\dfrac{n(A\\cap B)}{n(B)}=\\dfrac{${aAndB}}{${b}}$.` },

        { text: `$=${answer}$.` },
      ],
    };
  },
});

const bayesTwoBranchTemplate = generatedQuestion({
  id: 'ch02-gen-bayes-two-branch',

  chapter: 'probability',

  topic: 'Bayes theorem',

  difficulty: 'hard',

  generate: (rng) => {
    const pA = round(rng.int(1, 4) / 10, 2); // prior 0.1–0.4

    const pEgivenA = round(rng.int(7, 9) / 10, 2); // sensitivity 0.7–0.9

    const pEgivenNotA = round(rng.int(1, 3) / 10, 2); // false-positive 0.1–0.3

    const num = pEgivenA * pA;

    const den = num + pEgivenNotA * (1 - pA);

    const answer = round(num / den, 4);

    return {
      prompt:
        `A test detects a condition with probability $P(E\\mid A)=${pEgivenA}$ when present and gives a ` +
        `false positive $P(E\\mid A')=${pEgivenNotA}$ when absent. The condition has prevalence $P(A)=${pA}$. ` +
        `Given a positive test, find $P(A\\mid E)$.`,

      params: { pA, pEgivenA, pEgivenNotA },

      parts: [{ kind: 'numeric', answer, tol: 0.001 }],

      solution: [
        { text: `Bayes: $P(A\\mid E)=\\dfrac{P(E\\mid A)P(A)}{P(E\\mid A)P(A)+P(E\\mid A')P(A')}$.` },

        { text: `$=\\dfrac{${pEgivenA}\\cdot${pA}}{${pEgivenA}\\cdot${pA}+${pEgivenNotA}\\cdot${round(1 - pA, 2)}}=${answer}$.` },
      ],
    };
  },
});

export const ch02Generators: QuestionTemplate[] = [
  permutationsTemplate,

  combinationsTemplate,

  conditionalTwoWayTemplate,

  bayesTwoBranchTemplate,
];
