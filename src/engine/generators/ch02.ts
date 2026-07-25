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

const committeeAtLeastOneTemplate = generatedQuestion({
  id: 'ch02-gen-committee-at-least-one',

  chapter: 'probability',

  topic: 'Counting techniques',

  difficulty: 'hard',

  generate: (rng) => {
    const n = rng.int(8, 12);

    const k = rng.int(3, 5); // size of the senior-engineer subgroup

    const r = rng.int(2, Math.min(4, n - k)); // r <= n - k, so "none from the subgroup" stays defined

    const total = nCr(n, r);

    const none = nCr(n - k, r);

    const atLeastOne = total - none;

    return {
      prompt:
        `A ${n}-person engineering team includes ${k} certified senior engineers. A project committee of ${r} ` +
        `people is chosen at random from the team. How many different committees include at least one senior engineer?`,

      params: { n, k, r },

      parts: [
        { kind: 'numeric', label: 'Total committees', answer: total, tol: 0 },

        { kind: 'numeric', label: 'Committees with no senior engineer', answer: none, tol: 0 },

        { kind: 'numeric', label: 'Committees with at least one senior engineer', answer: atLeastOne, tol: 0 },
      ],

      solution: [
        { text: `Total ways to choose ${r} from ${n}: $\\binom{${n}}{${r}}=${total}$.` },

        {
          text: `Ways with no senior engineer: choose all ${r} from the remaining ${n - k} non-senior members: $\\binom{${n - k}}{${r}}=${none}$.`,
        },

        { text: `By the complement rule, at least one: $${total}-${none}=${atLeastOne}$.` },
      ],
    };
  },
});

const bayesThreeBranchTemplate = generatedQuestion({
  id: 'ch02-gen-bayes-three-branch',

  chapter: 'probability',

  topic: 'Bayes theorem',

  difficulty: 'hard',

  generate: (rng) => {
    const a1 = rng.int(20, 40);

    const a2 = rng.int(20, 90 - a1);

    const a3 = 100 - a1 - a2; // always >= 10: every supplier keeps a genuine share

    const pX = a1 / 100;

    const pY = a2 / 100;

    const pZ = a3 / 100;

    const dXpct = rng.int(1, 3);

    const dYpct = rng.int(4, 7);

    const dZpct = rng.int(8, 12);

    const dX = dXpct / 100;

    const dY = dYpct / 100;

    const dZ = dZpct / 100;

    const pDefective = round(pX * dX + pY * dY + pZ * dZ, 5);

    const pYgivenDefective = round((pY * dY) / pDefective, 4);

    return {
      prompt:
        `A factory stocks parts from three suppliers: X supplies ${a1}%, Y supplies ${a2}%, and Z supplies ` +
        `${a3}% of inventory. Their defect rates are ${dXpct}%, ${dYpct}%, and ${dZpct}% respectively. A ` +
        `part is chosen at random and found defective. Find $P(\\text{defective})$ and $P(Y\\mid \\text{defective})$.`,

      params: { pX, pY, pZ, dX, dY, dZ },

      parts: [
        { kind: 'numeric', label: 'P(defective)', answer: pDefective, tol: 0.0005 },

        { kind: 'numeric', label: 'P(Y | defective)', answer: pYgivenDefective, tol: 0.001 },
      ],

      solution: [
        { text: `Total probability: $P(D)=P(X)P(D\\mid X)+P(Y)P(D\\mid Y)+P(Z)P(D\\mid Z)$.` },

        { text: `$=${pX}\\cdot${dX}+${pY}\\cdot${dY}+${pZ}\\cdot${dZ}=${pDefective}$.` },

        {
          text: `Bayes: $P(Y\\mid D)=\\dfrac{P(Y)P(D\\mid Y)}{P(D)}=\\dfrac{${pY}\\cdot${dY}}{${pDefective}}=${pYgivenDefective}$.`,
        },
      ],
    };
  },
});

const atLeastOneDefectiveTemplate = generatedQuestion({
  id: 'ch02-gen-at-least-one-defective',

  chapter: 'probability',

  topic: 'Conditional probability',

  difficulty: 'hard',

  generate: (rng) => {
    const n = rng.int(4, 8);

    const pPct = rng.int(2, 15); // defect probability, percent

    const p = pPct / 100;

    const pNone = round((1 - p) ** n, 4);

    const pAtLeastOne = round(1 - pNone, 4);

    return {
      prompt:
        `A quality inspector tests ${n} independently manufactured components. Each component is defective with ` +
        `probability ${pPct}%, independently of the others. Find the probability that at least one of the ${n} ` +
        `components is defective.`,

      params: { n, p },

      parts: [
        { kind: 'numeric', label: 'P(no defectives)', answer: pNone, tol: 0.0005 },

        { kind: 'numeric', label: 'P(at least one defective)', answer: pAtLeastOne, tol: 0.0005 },
      ],

      solution: [
        {
          text: `By independence, $P(\\text{no defectives})=(1-p)^{${n}}=(${round(1 - p, 2)})^{${n}}=${pNone}$.`,
        },

        { text: `By the complement rule, $P(\\text{at least one})=1-${pNone}=${pAtLeastOne}$.` },
      ],
    };
  },
});

const sequentialNoReplacementTemplate = generatedQuestion({
  id: 'ch02-gen-sequential-no-replacement',

  chapter: 'probability',

  topic: 'Conditional probability',

  difficulty: 'hard',

  generate: (rng) => {
    const n = rng.int(10, 15);

    const k = rng.int(3, 6);

    const pFirst = round(k / n, 4);

    const pSecondGivenFirst = round((k - 1) / (n - 1), 4);

    const pBoth = round((k / n) * ((k - 1) / (n - 1)), 4);

    return {
      prompt:
        `A bag contains ${n} balls, of which ${k} are red and the rest blue. Two balls are drawn at random, one ` +
        `after another, without replacement. Find $P(\\text{first is red})$, $P(\\text{second is red}\\mid\\text{first is red})$, ` +
        `and $P(\\text{both red})$.`,

      params: { n, k },

      parts: [
        { kind: 'numeric', label: 'P(first red)', answer: pFirst, tol: 0.001 },

        { kind: 'numeric', label: 'P(second red | first red)', answer: pSecondGivenFirst, tol: 0.001 },

        { kind: 'numeric', label: 'P(both red)', answer: pBoth, tol: 0.0005 },
      ],

      solution: [
        { text: `$P(\\text{first red})=\\dfrac{${k}}{${n}}=${pFirst}$.` },

        {
          text: `Given the first was red, ${k - 1} red balls remain among ${n - 1}: $P(\\text{second red}\\mid\\text{first red})=\\dfrac{${k - 1}}{${n - 1}}=${pSecondGivenFirst}$.`,
        },

        { text: `By the product rule: $P(\\text{both red})=${pFirst}\\times${pSecondGivenFirst}=${pBoth}$.` },
      ],
    };
  },
});

export const ch02Generators: QuestionTemplate[] = [
  permutationsTemplate,

  combinationsTemplate,

  conditionalTwoWayTemplate,

  bayesTwoBranchTemplate,

  committeeAtLeastOneTemplate,

  bayesThreeBranchTemplate,

  atLeastOneDefectiveTemplate,

  sequentialNoReplacementTemplate,
];
