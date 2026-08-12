import type { QuestionTemplate } from '../types';

import { generatedQuestion } from '../authoring';

import { nPr, nCr, round, factorial } from '../mathx';

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

// --- Additive rules (§2.5): direct two-event additive rule -----------------
//
// pA and pB are each drawn from [0.20, 0.50] and pAB is drawn strictly below
// min(pA, pB) - 0.04 (with a floor of 0.05), so P(A ∩ B) is always a genuine
// proper subset of both P(A) and P(B) -- never equal to either -- and
// P(A ∪ B) = pA + pB - pAB stays comfortably below 1 (at most 0.5+0.5-0.05
// = 0.95) for every draw.
const additiveRuleBasicTemplate = generatedQuestion({
  id: 'ch02-gen-additive-rule-basic',

  chapter: 'probability',

  topic: 'Additive rules',

  difficulty: 'easy',

  generate: (rng) => {
    const pAPct = rng.int(20, 50);

    const pBPct = rng.int(20, 50);

    const minPct = Math.min(pAPct, pBPct);

    const pABPct = rng.int(5, minPct - 4);

    const pA = pAPct / 100;

    const pB = pBPct / 100;

    const pAB = pABPct / 100;

    const answer = round(pA + pB - pAB, 4);

    return {
      prompt:
        `For two events $A$ and $B$, $P(A)=${pA}$, $P(B)=${pB}$, and $P(A\\cap B)=${pAB}$. Find $P(A\\cup B)$.`,

      params: { pA, pB, pAB },

      parts: [{ kind: 'numeric', answer, tol: 0.001 }],

      solution: [
        { text: `Additive rule: $P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$.` },

        { text: `$=${pA}+${pB}-${pAB}=${answer}$.` },
      ],
    };
  },
});

// --- Additive rules (§2.5): additive rule from a two-training headcount ----
//
// onlyA, onlyB, and both are each drawn from disjoint positive ranges (8-20,
// 8-20, 3-10), and extra (people who took neither) from 10-30, so a = onlyA
// + both and b = onlyB + both are always strictly greater than both alone
// (the overlap is always a proper subset of each group), and N = onlyA +
// onlyB + both + extra always exceeds a + b - both, keeping every derived
// probability strictly between 0 and 1.
const additiveRuleCountsTemplate = generatedQuestion({
  id: 'ch02-gen-additive-rule-counts',

  chapter: 'probability',

  topic: 'Additive rules',

  difficulty: 'medium',

  generate: (rng) => {
    const onlyA = rng.int(8, 20);

    const onlyB = rng.int(8, 20);

    const both = rng.int(3, 10);

    const extra = rng.int(10, 30);

    const a = onlyA + both;

    const b = onlyB + both;

    const N = onlyA + onlyB + both + extra;

    const pA = round(a / N, 4);

    const pB = round(b / N, 4);

    const pAB = round(both / N, 4);

    const pUnion = round(pA + pB - pAB, 4);

    return {
      prompt:
        `At a company with ${N} employees, ${a} completed the Excel training (event $A$), ${b} completed the ` +
        `Python training (event $B$), and ${both} completed both. Find $P(A)$, $P(B)$, and, using the additive ` +
        `rule, $P(A\\cup B)$.`,

      params: { onlyA, onlyB, both, extra },

      parts: [
        { kind: 'numeric', label: 'P(A)', answer: pA, tol: 0.001 },

        { kind: 'numeric', label: 'P(B)', answer: pB, tol: 0.001 },

        { kind: 'numeric', label: 'P(A ∪ B)', answer: pUnion, tol: 0.001 },
      ],

      solution: [
        { text: `$P(A)=\\dfrac{${a}}{${N}}=${pA}$, and $P(B)=\\dfrac{${b}}{${N}}=${pB}$.` },

        { text: `$P(A\\cap B)=\\dfrac{${both}}{${N}}=${pAB}$.` },

        { text: `Additive rule: $P(A\\cup B)=P(A)+P(B)-P(A\\cap B)=${pA}+${pB}-${pAB}=${pUnion}$.` },
      ],
    };
  },
});

// --- Sample space and events (§2.1/2.4): counting a two-factor sample space
//
// colors is drawn from [3, 6] and sizes from [3, 5], so total = colors *
// sizes is always well-defined. warmColors is drawn from [1, colors - 1], a
// strict proper subset of colors, so the favorable count favorable =
// warmColors * sizes is always strictly between 0 and total.
const sampleSpaceBasicTemplate = generatedQuestion({
  id: 'ch02-gen-sample-space-basic',

  chapter: 'probability',

  topic: 'Sample space and events',

  difficulty: 'easy',

  generate: (rng) => {
    const colors = rng.int(3, 6);

    const sizes = rng.int(3, 5);

    const warmColors = rng.int(1, colors - 1);

    const total = colors * sizes;

    const favorable = warmColors * sizes;

    const answer = round(favorable / total, 4);

    return {
      prompt:
        `A clothing store stocks shirts in ${colors} colors and ${sizes} sizes, with every color-size combination ` +
        `in stock. A shirt is selected at random from the full sample space. ${warmColors} of the colors are ` +
        `classified as "warm" colors. Using the multiplication rule to count the sample space, find the total ` +
        `number of distinct shirts and the probability the selected shirt is a warm color.`,

      params: { colors, sizes, warmColors },

      parts: [
        { kind: 'numeric', label: 'Total sample points', answer: total, tol: 0 },

        { kind: 'numeric', label: 'P(warm color)', answer, tol: 0.001 },
      ],

      solution: [
        { text: `Sample space size: $${colors}\\times${sizes}=${total}$.` },

        { text: `Favorable outcomes (warm color, any size): $${warmColors}\\times${sizes}=${favorable}$.` },

        { text: `Each shirt is equally likely, so $P(\\text{warm})=\\dfrac{${favorable}}{${total}}=${answer}$.` },
      ],
    };
  },
});

// --- Sample space and events (§2.1): complement rule over a dice sum -------
//
// k is drawn from [5, 9], strictly inside the possible-sum range [2, 12] with
// margin on both ends, so counting outcomes with sum >= k over the fixed
// 36-point sample space {1,...,6} x {1,...,6} always yields a count strictly
// between 0 and 36 (verified directly by enumeration below, not by a
// formula) -- P(A) and its complement are both guaranteed strictly inside
// (0, 1).
const sampleSpaceComplementTemplate = generatedQuestion({
  id: 'ch02-gen-sample-space-complement',

  chapter: 'probability',

  topic: 'Sample space and events',

  difficulty: 'medium',

  generate: (rng) => {
    const k = rng.int(5, 9);

    let count = 0;

    for (let i = 1; i <= 6; i++) {
      for (let j = 1; j <= 6; j++) {
        if (i + j >= k) count++;
      }
    }

    const pA = round(count / 36, 4);

    const pAcomplement = round(1 - pA, 4);

    return {
      prompt:
        `Two fair dice are rolled, giving a sample space of 36 equally likely outcomes. Let $A$ be the event ` +
        `that the sum of the two dice is at least ${k}. Find $P(A)$, and, using the complement rule, find $P(A')$.`,

      params: { k, count },

      parts: [
        { kind: 'numeric', label: 'P(A)', answer: pA, tol: 0.001 },

        { kind: 'numeric', label: "P(A')", answer: pAcomplement, tol: 0.001 },
      ],

      solution: [
        {
          text: `Counting the pairs $(i,j)$ with $i+j\\ge ${k}$ out of the 36 equally likely outcomes gives ${count}: $P(A)=\\dfrac{${count}}{36}=${pA}$.`,
        },

        { text: `By the complement rule, $P(A')=1-P(A)=1-${pA}=${pAcomplement}$.` },
      ],
    };
  },
});

// --- Additive rules (§2.5): inclusion-exclusion for three events -----------
//
// Every region of a 3-event Venn diagram is built directly as a count out of
// a fixed population of 100, and the marginal / pairwise / triple
// probabilities are all *read off* that partition rather than chosen
// independently. Because they come from one consistent partition, the
// three-event inclusion-exclusion identity holds exactly when recomputed
// from the exposed probabilities: the "solve for the missing triple overlap"
// step can never come out negative, and rABC >= 1 by construction keeps the
// answer from being trivially zero.
const inclusionExclusionThreeTemplate = generatedQuestion({
  id: 'ch02-gen-inclusion-exclusion-three',

  chapter: 'probability',

  topic: 'Additive rules',

  difficulty: 'hard',

  generate: (rng) => {
    const rOnlyA = rng.int(3, 10);

    const rOnlyB = rng.int(3, 10);

    const rOnlyC = rng.int(3, 10);

    const rAB = rng.int(2, 6); // A ∩ B, excluding C

    const rAC = rng.int(2, 6); // A ∩ C, excluding B

    const rBC = rng.int(2, 6); // B ∩ C, excluding A

    const rABC = rng.int(1, 4); // all three -- kept >= 1 so the triple overlap is never trivially 0

    const used = rOnlyA + rOnlyB + rOnlyC + rAB + rAC + rBC + rABC; // at most 52 of 100

    const N = 100;

    const pA = round((rOnlyA + rAB + rAC + rABC) / N, 4);

    const pB = round((rOnlyB + rAB + rBC + rABC) / N, 4);

    const pC = round((rOnlyC + rAC + rBC + rABC) / N, 4);

    const pAB = round((rAB + rABC) / N, 4);

    const pAC = round((rAC + rABC) / N, 4);

    const pBC = round((rBC + rABC) / N, 4);

    const pUnion = round(used / N, 4); // everyone outside "none of the three"

    const answer = round(pUnion - pA - pB - pC + pAB + pAC + pBC, 4);

    return {
      prompt:
        `Among 100 audited engineering projects, events $A$, $B$, $C$ are "over budget", "behind schedule", ` +
        `and "failed inspection" respectively. $P(A)=${pA}$, $P(B)=${pB}$, $P(C)=${pC}$, ` +
        `$P(A\\cap B)=${pAB}$, $P(A\\cap C)=${pAC}$, $P(B\\cap C)=${pBC}$, and $P(A\\cup B\\cup C)=${pUnion}$. ` +
        `Find $P(A\\cap B\\cap C)$.`,

      params: { pA, pB, pC, pAB, pAC, pBC, pUnion },

      parts: [{ kind: 'numeric', answer, tol: 0.001 }],

      solution: [
        {
          text: `Rearrange the three-event additive rule: $P(A\\cap B\\cap C)=P(A\\cup B\\cup C)-P(A)-P(B)-P(C)+P(A\\cap B)+P(A\\cap C)+P(B\\cap C)$.`,
        },

        {
          text: `$=${pUnion}-${pA}-${pB}-${pC}+${pAB}+${pAC}+${pBC}=${answer}$.`,
        },
      ],
    };
  },
});

// --- Additive rules (§2.5): complement rule over a hypergeometric sample ---
//
// n is drawn well below the pool of non-defective boards, so "choose all n
// from the good boards" is always a well-defined count and P(none) stays a
// number worth asking for.
//
// The margin has to be generous, and the reason is worth stating because the
// first attempt at this guard got it wrong. Requiring only one spare good
// board (n <= N - d - 1) does keep P(none) strictly above zero, and the test
// here asserted exactly that -- but "above zero" is the wrong bar. At
// N = 25, d = 5, n = 19 the true P(none) is 0.000113, which displays as
// 0.0001 against a tolerance of 0.001: a learner who answers 0, or who
// guesses, is graded correct. An answer must clear its own tolerance, not
// merely clear zero.
//
// P(none) = C(N - n, d) / C(N, d), so it shrinks fast as n approaches N - d.
// Capping n at 8 and at N - d - 4 holds P(none) above 0.02 across the whole
// (N, d) range -- twenty times the tolerance, and still a wide spread of
// sample sizes. Enforced for every generator by
// tests/engine/generators/no-degenerate-answers.test.ts.
const hypergeometricAtLeastOneTemplate = generatedQuestion({
  id: 'ch02-gen-hypergeometric-at-least-one',

  chapter: 'probability',

  topic: 'Additive rules',

  difficulty: 'hard',

  generate: (rng) => {
    const N = rng.int(15, 25);

    const d = rng.int(2, 5);

    const n = rng.int(2, Math.min(8, N - d - 4));

    const totalWays = nCr(N, n);

    const noneWays = nCr(N - d, n);

    const pNone = round(noneWays / totalWays, 4);

    const pAtLeastOne = round(1 - pNone, 4);

    return {
      prompt:
        `A shipment of ${N} circuit boards contains ${d} defective boards. An inspector samples ${n} boards at ` +
        `random without replacement. Find the probability that at least one of the sampled boards is defective.`,

      params: { N, d, n },

      parts: [
        { kind: 'numeric', label: 'P(no defectives)', answer: pNone, tol: 0.001 },

        { kind: 'numeric', label: 'P(at least one defective)', answer: pAtLeastOne, tol: 0.001 },
      ],

      solution: [
        { text: `Total ways to choose ${n} boards from ${N}: $\\binom{${N}}{${n}}=${totalWays}$.` },

        {
          text: `Ways with no defectives: choose all ${n} from the ${N - d} good boards: $\\binom{${N - d}}{${n}}=${noneWays}$.`,
        },

        { text: `$P(\\text{none defective})=\\dfrac{${noneWays}}{${totalWays}}=${pNone}$.` },

        { text: `By the complement rule, $P(\\text{at least one})=1-${pNone}=${pAtLeastOne}$.` },
      ],
    };
  },
});

// --- Set operations (§2.2/2.5): De Morgan over a two-event region count ---
//
// The four region counts (onlyA, onlyB, both, neither) are drawn independently
// and positive, so N is always their genuine sum and every probability below
// is strictly between 0 and 1. P(A ∪ B) and P((A ∪ B)') = neither / N are
// computed two different ways (the additive rule, and De Morgan + the direct
// count) and are algebraically forced to agree, which is exactly the point
// of the question.
const setIdentityTemplate = generatedQuestion({
  id: 'ch02-gen-set-identity-demorgan',

  chapter: 'probability',

  topic: 'Sample space and events',

  difficulty: 'hard',

  generate: (rng) => {
    const onlyA = rng.int(5, 20);

    const onlyB = rng.int(5, 20);

    const both = rng.int(3, 12);

    const neither = rng.int(5, 20);

    const N = onlyA + onlyB + both + neither;

    const pA = (onlyA + both) / N;

    const pB = (onlyB + both) / N;

    const pAB = both / N;

    const pUnion = round(pA + pB - pAB, 4);

    const pNeither = round(neither / N, 4);

    return {
      prompt:
        `Among ${N} students surveyed, ${onlyA} take only Calculus, ${onlyB} take only Physics, ${both} take both, ` +
        `and ${neither} take neither. Let $A$ be "takes Calculus" and $B$ be "takes Physics". Using the additive ` +
        `rule, find $P(A\\cup B)$. Then use De Morgan's law to express "takes neither course" in set notation and ` +
        `find its probability.`,

      params: { onlyA, onlyB, both, neither },

      parts: [
        { kind: 'numeric', label: 'P(A ∪ B)', answer: pUnion, tol: 0.001 },

        { kind: 'numeric', label: "P((A ∪ B)') = P(neither)", answer: pNeither, tol: 0.001 },
      ],

      solution: [
        {
          text: `$P(A)=\\dfrac{${onlyA}+${both}}{${N}}$, $P(B)=\\dfrac{${onlyB}+${both}}{${N}}$, $P(A\\cap B)=\\dfrac{${both}}{${N}}$.`,
        },

        { text: `Additive rule: $P(A\\cup B)=P(A)+P(B)-P(A\\cap B)=${pUnion}$.` },

        { text: `"Neither course" is $(A\\cup B)'$; by De Morgan, $(A\\cup B)' = A' \\cap B'$.` },

        {
          text: `By the complement rule, $P((A\\cup B)')=1-${pUnion}=${round(1 - pUnion, 4)}$, matching the direct count $\\dfrac{${neither}}{${N}}=${pNeither}$.`,
        },
      ],
    };
  },
});

// --- Sample spaces (§2.1/2.4): generalized multiplication rule over a tree -
//
// premium1 is drawn from [1, g1 - 1] and premium2 from [1, g2 - 1] -- each
// strictly less than its own grade count -- so "premium" is always a genuine
// proper subset of each machine's grades. That keeps the final probability
// strictly between 0 and 1 no matter what the seed draws.
const sampleSpaceTreeTemplate = generatedQuestion({
  id: 'ch02-gen-sample-space-tree',

  chapter: 'probability',

  topic: 'Sample space and events',

  difficulty: 'hard',

  generate: (rng) => {
    const m = rng.int(3, 5);

    const g1 = rng.int(4, 6);

    const g2 = rng.int(2, 3);

    const premium1 = rng.int(1, g1 - 1);

    const premium2 = rng.int(1, g2 - 1);

    const total = g1 + (m - 1) * g2;

    const premium = premium1 + (m - 1) * premium2;

    const answer = round(premium / total, 4);

    return {
      prompt:
        `A factory has ${m} machines producing parts. Machine 1 makes parts in ${g1} distinct grades; each of the ` +
        `other ${m - 1} machines makes parts in ${g2} distinct grades. A (machine, grade) pair is chosen uniformly ` +
        `at random from the full sample space of parts. Machine 1 has ${premium1} premium grades, and each other ` +
        `machine has ${premium2} premium grades. Using the generalized multiplication rule to count the sample ` +
        `space, find the probability the chosen pair is a premium grade.`,

      params: { m, g1, g2, premium1, premium2 },

      parts: [
        { kind: 'numeric', label: 'Total sample points', answer: total, tol: 0 },

        { kind: 'numeric', label: 'P(premium)', answer, tol: 0.001 },
      ],

      solution: [
        {
          text: `Total sample points: machine 1 contributes ${g1}, and each of the other ${m - 1} machines contributes ${g2}: $${g1}+(${m - 1})(${g2})=${total}$.`,
        },

        { text: `Premium sample points: $${premium1}+(${m - 1})(${premium2})=${premium}$.` },

        { text: `Each sample point is equally likely, so $P(\\text{premium})=\\dfrac{${premium}}{${total}}=${answer}$.` },
      ],
    };
  },
});

// --- Counting techniques (§2.3): circular permutation with an adjacency ---
//
// n ranges over [6, 9], so n - 1 and n - 2 are always positive and the
// closed form 2/(n-1) is always a valid probability strictly between 0 and 1.
const circularAdjacentTemplate = generatedQuestion({
  id: 'ch02-gen-circular-adjacent',

  chapter: 'probability',

  topic: 'Counting techniques',

  difficulty: 'hard',

  generate: (rng) => {
    const n = rng.int(6, 9);

    const totalArrangements = factorial(n - 1);

    const togetherArrangements = 2 * factorial(n - 2);

    const answer = round(togetherArrangements / totalArrangements, 4);

    return {
      prompt:
        `${n} people are seated at random around a circular table. Two of them, Amir and Bea, insist on sitting ` +
        `next to each other. Find the total number of distinct circular seatings, the number of those seatings ` +
        `with Amir and Bea together, and the probability Amir and Bea end up together.`,

      params: { n },

      parts: [
        { kind: 'numeric', label: 'Total circular seatings', answer: totalArrangements, tol: 0 },

        { kind: 'numeric', label: 'Seatings with the pair together', answer: togetherArrangements, tol: 0 },

        { kind: 'numeric', label: 'P(together)', answer, tol: 0.0005 },
      ],

      solution: [
        { text: `Circular permutations of ${n} distinct people: $(${n}-1)! = ${totalArrangements}$.` },

        {
          text: `Treat Amir and Bea as one block: ${n - 1} units seated in a circle in $(${n - 1}-1)! = ${factorial(n - 2)}$ ways, times $2$ for their internal order: $2\\cdot ${factorial(n - 2)} = ${togetherArrangements}$.`,
        },

        { text: `$P(\\text{together})=\\dfrac{${togetherArrangements}}{${totalArrangements}}=\\dfrac{2}{${n - 1}}=${answer}$.` },
      ],
    };
  },
});

// --- Counting techniques (§2.3): partitioning n objects into labeled cells -
//
// n1, n2, n3 are each drawn from [2, 4], so n never exceeds 12 -- every
// factorial involved stays far below the range where floating-point
// precision could matter, and every cell size is always positive.
const partitionCellsTemplate = generatedQuestion({
  id: 'ch02-gen-partition-cells',

  chapter: 'probability',

  topic: 'Counting techniques',

  difficulty: 'hard',

  generate: (rng) => {
    const n1 = rng.int(2, 4);

    const n2 = rng.int(2, 4);

    const n3 = rng.int(2, 4);

    const n = n1 + n2 + n3;

    const answer = factorial(n) / (factorial(n1) * factorial(n2) * factorial(n3));

    return {
      prompt:
        `${n} conference attendees must be split into three groups for breakout sessions: a group of ${n1} for ` +
        `Room A, ${n2} for Room B, and ${n3} for Room C. In how many ways can the attendees be partitioned into ` +
        `these three labeled rooms?`,

      params: { n1, n2, n3 },

      parts: [{ kind: 'numeric', answer, tol: 0 }],

      solution: [
        {
          text: `Partitioning into labeled cells of sizes ${n1}, ${n2}, ${n3}: $\\dbinom{${n}}{${n1},${n2},${n3}}=\\dfrac{${n}!}{${n1}!\\,${n2}!\\,${n3}!}$.`,
        },

        { text: `$=${answer}$.` },
      ],
    };
  },
});

// --- Conditional probability (§2.6): testing independence from a table ----
//
// The four cell counts are drawn independently from [3, 15], so N, P(A), and
// P(B) are always strictly between 0 and N / 1. Independence is decided by
// an *exact* integer comparison (a * N vs (a+b)(a+c)) rather than comparing
// rounded floats, so the verdict is never a floating-point artifact -- true
// ties resolve to "independent" exactly when they mathematically are.
const independenceTestTemplate = generatedQuestion({
  id: 'ch02-gen-independence-test',

  chapter: 'probability',

  topic: 'Conditional probability',

  difficulty: 'hard',

  generate: (rng) => {
    const a = rng.int(3, 15); // A ∩ B

    const b = rng.int(3, 15); // A ∩ B'

    const c = rng.int(3, 15); // A' ∩ B

    const d = rng.int(3, 15); // A' ∩ B'

    const N = a + b + c + d;

    const pA = round((a + b) / N, 4);

    const pB = round((a + c) / N, 4);

    const pAB = round(a / N, 4);

    // Rounded from the exact unrounded product (a+b)/N * (a+c)/N, not from
    // the already-rounded pA * pB display values above -- multiplying two
    // numbers each pre-rounded to 4dp can drift the product's 4th decimal
    // away from P(A ∩ B) even when A and B are exactly independent, which
    // would make the displayed pair of numbers visibly "not match" while
    // the solution text (driven by the exact integer test below) still
    // says they do.
    const pAtimespB = round(((a + b) / N) * ((a + c) / N), 4);

    const independent = a * N === (a + b) * (a + c);

    return {
      prompt:
        `A survey of ${N} customers cross-tabulates whether they bought product $A$ and product $B$: ${a} bought ` +
        `both, ${b} bought only $A$, ${c} bought only $B$, and ${d} bought neither. Find $P(A\\cap B)$ and ` +
        `$P(A)P(B)$, and decide whether $A$ and $B$ are independent.`,

      params: { a, b, c, d },

      parts: [
        { kind: 'numeric', label: 'P(A ∩ B)', answer: pAB, tol: 0.001 },

        { kind: 'numeric', label: 'P(A)P(B)', answer: pAtimespB, tol: 0.001 },

        { kind: 'tf', label: 'A and B independent', answer: independent },
      ],

      solution: [
        { text: `$P(A)=\\dfrac{${a}+${b}}{${N}}=${pA}$, $P(B)=\\dfrac{${a}+${c}}{${N}}=${pB}$.` },

        { text: `$P(A\\cap B)=\\dfrac{${a}}{${N}}=${pAB}$, while $P(A)P(B)=${pAtimespB}$.` },

        {
          text: independent
            ? `These match, so $A$ and $B$ are independent.`
            : `These differ, so $A$ and $B$ are not independent — knowing one occurred changes the chance of the other.`,
        },
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

  additiveRuleBasicTemplate,

  additiveRuleCountsTemplate,

  sampleSpaceBasicTemplate,

  sampleSpaceComplementTemplate,

  inclusionExclusionThreeTemplate,

  hypergeometricAtLeastOneTemplate,

  setIdentityTemplate,

  sampleSpaceTreeTemplate,

  circularAdjacentTemplate,

  partitionCellsTemplate,

  independenceTestTemplate,
];
