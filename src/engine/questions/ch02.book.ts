import type { QuestionTemplate } from '../types';

import { bookQuestion } from '../authoring';

// --- Sample space and events (§2.1/2.2) ------------------------------------

const sampleSpaceEventsBook: QuestionTemplate[] = [
  bookQuestion({
    id: 'ch02-book-equal-sets',

    chapter: 'probability',

    topic: 'Sample space and events',

    difficulty: 'easy',

    citation: 'Walpole Ex. 2.3',

    instance: {
      prompt:
        'Which pair of these sets is equal? $A=\\{1,3\\}$; $B=\\{x\\mid x\\text{ is a number on a die}\\}$; ' +
        '$C=\\{x\\mid x^2-4x+3=0\\}$; $D=\\{x\\mid x\\text{ is the number of heads when six coins are tossed}\\}$.',

      parts: [{ kind: 'mcq', choices: ['A = B', 'A = C', 'B = D', 'C = D'], answer: 1 }],

      solution: [
        { text: 'Solving $x^2-4x+3=0$ gives $(x-1)(x-3)=0$, so $x=1$ or $x=3$: $C=\\{1,3\\}$.' },

        { text: 'That is exactly $A=\\{1,3\\}$, so $A=C$. $B=\\{1,2,3,4,5,6\\}$ and $D=\\{0,1,2,3,4,5,6\\}$ are both different from $A$ and from each other.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-set-intersection-disjoint',

    chapter: 'probability',

    topic: 'Sample space and events',

    difficulty: 'easy',

    citation: 'Walpole Ex. 2.14',

    instance: {
      prompt:
        'Let $S=\\{0,1,2,\\dots,9\\}$, $A=\\{0,2,4,6,8\\}$ (the evens), and $B=\\{1,3,5,7,9\\}$ (the odds). What is $A\\cap B$?',

      parts: [{ kind: 'mcq', choices: ['$\\{0,2,4,6,8\\}$', '$\\{1,3,5,7,9\\}$', '$\\varnothing$', '$S$'], answer: 2 }],

      solution: [
        { text: 'No number is both even and odd, so $A$ and $B$ share no outcomes: $A\\cap B=\\varnothing$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-interval-union',

    chapter: 'probability',

    topic: 'Sample space and events',

    difficulty: 'easy',

    citation: 'Walpole Ex. 2.16',

    instance: {
      prompt:
        'Let $S=\\{x\\mid 0<x<12\\}$, $M=\\{x\\mid 1<x<9\\}$, and $N=\\{x\\mid 0<x<5\\}$. Describe $M\\cup N$ and $M\\cap N$ using set-builder (rule) notation.',

      parts: [
        {
          kind: 'short',
          label: 'M ∪ N',
          answer: '{x | 0 < x < 9}',
        },

        {
          kind: 'short',
          label: 'M ∩ N',
          answer: '{x | 1 < x < 5}',
        },
      ],

      solution: [
        { text: '$M\\cup N$ is every point in either interval: the smaller lower bound (0 from $N$) to the larger upper bound (9 from $M$), so $M\\cup N=\\{x\\mid 0<x<9\\}$.' },

        { text: '$M\\cap N$ is only points in both: the larger lower bound (1 from $M$) to the smaller upper bound (5 from $N$), so $M\\cap N=\\{x\\mid 1<x<5\\}$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-mutually-exclusive-poker',

    chapter: 'probability',

    topic: 'Sample space and events',

    difficulty: 'medium',

    citation: 'Walpole Ex. 2.18(b)',

    instance: {
      prompt:
        'In a 5-card poker hand, are "getting a flush (all 5 cards the same suit)" and "getting 3 of a kind (3 cards of the same rank)" mutually exclusive events?',

      parts: [{ kind: 'tf', answer: true }],

      solution: [
        {
          text: 'A suit has only one card of each rank, so 3 cards sharing a rank must come from 3 different suits — those 3 cards alone already rule out a flush.',
        },

        { text: 'No hand can satisfy both descriptions at once, so the two events are mutually exclusive.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-loaded-die-event',

    chapter: 'probability',

    topic: 'Sample space and events',

    difficulty: 'medium',

    citation: 'Walpole Example 2.25',

    instance: {
      prompt:
        'A die is loaded so that an even number is twice as likely to occur as an odd number. Let $E$ be the event that a number less than 4 occurs on a single toss. Find $P(E)$.',

      parts: [{ kind: 'numeric', answer: 4 / 9, tol: 0.0005 }],

      solution: [
        { text: 'Assign weight $w$ to each odd number and $2w$ to each even number: $9w=1$, so $w=\\tfrac19$.' },

        { text: '$E=\\{1,2,3\\}$, so $P(E)=\\tfrac19+\\tfrac29+\\tfrac19=\\tfrac49\\approx0.444$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-loaded-die-union-intersection',

    chapter: 'probability',

    topic: 'Sample space and events',

    difficulty: 'medium',

    citation: 'Walpole Example 2.26',

    instance: {
      prompt:
        'Using the loaded die of the previous example ($P(\\text{odd})=\\tfrac19$ each, $P(\\text{even})=\\tfrac29$ each), let $A$ be "an even number turns up" and $B$ be "a number divisible by 3 occurs". Find $P(A\\cup B)$ and $P(A\\cap B)$.',

      parts: [
        { kind: 'numeric', label: 'P(A ∪ B)', answer: 7 / 9, tol: 0.0005 },

        { kind: 'numeric', label: 'P(A ∩ B)', answer: 2 / 9, tol: 0.0005 },
      ],

      solution: [
        { text: '$A=\\{2,4,6\\}$ and $B=\\{3,6\\}$, so $A\\cup B=\\{2,3,4,6\\}$ and $A\\cap B=\\{6\\}$.' },

        { text: '$P(A\\cup B)=\\tfrac29+\\tfrac19+\\tfrac29+\\tfrac29=\\tfrac79$, and $P(A\\cap B)=\\tfrac29$.' },
      ],
    },
  }),
];

// --- Counting techniques (§2.3) --------------------------------------------

const countingBook: QuestionTemplate[] = [
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
    id: 'ch02-book-convention-tours',

    chapter: 'probability',

    topic: 'Counting techniques',

    difficulty: 'easy',

    citation: 'Walpole Ex. 2.21',

    instance: {
      prompt:
        'A convention offers 6 different sightseeing tours on each of 3 days. A registrant attends exactly one tour, on one of the three days. How many different choices does the registrant have?',

      parts: [{ kind: 'numeric', answer: 18, tol: 0 }],

      solution: [
        {
          text: 'Choosing a day and choosing a tour that day are not independent steps to multiply — the registrant only ever attends one tour total, and "day 1 tour", "day 2 tour", "day 3 tour" are mutually exclusive choices.',
        },

        { text: 'Add the 6 options for each of the 3 days: $6+6+6=18$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-die-and-letter',

    chapter: 'probability',

    topic: 'Counting techniques',

    difficulty: 'easy',

    citation: 'Walpole Ex. 2.23',

    instance: {
      prompt: 'An experiment consists of throwing a die and then drawing a letter at random from the English alphabet. How many points are in the sample space?',

      parts: [{ kind: 'numeric', answer: 156, tol: 0 }],

      solution: [{ text: 'Multiplication rule: $6\\times26=156$.' }],
    },
  }),

  bookQuestion({
    id: 'ch02-book-house-designs',

    chapter: 'probability',

    topic: 'Counting techniques',

    difficulty: 'easy',

    citation: 'Walpole Ex. 2.27',

    instance: {
      prompt:
        'A developer offers a home buyer a choice of 4 designs, 3 different heating systems, a garage or carport, and a patio or screened porch. How many different plans are available?',

      parts: [{ kind: 'numeric', answer: 48, tol: 0 }],

      solution: [{ text: 'Multiplication rule: $4\\times3\\times2\\times2=48$.' }],
    },
  }),

  bookQuestion({
    id: 'ch02-book-fuel-study',

    chapter: 'probability',

    topic: 'Counting techniques',

    difficulty: 'medium',

    citation: 'Walpole Ex. 2.29',

    instance: {
      prompt:
        'A fuel economy study tests each of 3 race cars using 5 brands of gasoline at 7 test sites, with 2 drivers, and one run per distinct combination of conditions. How many test runs are needed?',

      parts: [{ kind: 'numeric', answer: 210, tol: 0 }],

      solution: [{ text: 'Multiplication rule: $3\\times5\\times7\\times2=210$.' }],
    },
  }),

  bookQuestion({
    id: 'ch02-book-license-witness',

    chapter: 'probability',

    topic: 'Counting techniques',

    difficulty: 'medium',

    citation: 'Walpole Ex. 2.31',

    instance: {
      prompt:
        'A witness told police that a hit-and-run license number contained the letters RLH followed by 3 digits, the first of which was a 5. The witness could not recall the last 2 digits but was certain all 3 digits were different. Find the maximum number of registrations police may have to check.',

      parts: [{ kind: 'numeric', answer: 72, tol: 0 }],

      solution: [
        { text: 'The first digit is fixed at 5; the last two digits are distinct and different from 5 and from each other, chosen from the remaining 9 digits.' },

        { text: 'Ordered choice of 2 from 9: $9\\times8=72$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-multiple-choice-test',

    chapter: 'probability',

    topic: 'Counting techniques',

    difficulty: 'medium',

    citation: 'Walpole Ex. 2.33',

    instance: {
      prompt:
        'A multiple-choice test has 5 questions, each with 4 possible answers of which only 1 is correct. (a) In how many different ways can a student check off one answer to each question? (b) In how many of those ways are all 5 answers wrong?',

      parts: [
        { kind: 'numeric', label: 'Total ways to answer', answer: 1024, tol: 0 },

        { kind: 'numeric', label: 'Ways to get every answer wrong', answer: 243, tol: 0 },
      ],

      solution: [
        { text: 'Each question has 4 choices, independently: $4^5=1024$ total ways.' },

        { text: 'Each question has 3 wrong choices: $3^5=243$ ways to miss every one.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-spelling-bee',

    chapter: 'probability',

    topic: 'Counting techniques',

    difficulty: 'medium',

    citation: 'Walpole Ex. 2.39',

    instance: {
      prompt:
        'A regional spelling bee has 8 finalists. Find the number of possible orders at the conclusion of the contest for (a) all 8 finalists, and (b) just the first 3 positions.',

      parts: [
        { kind: 'numeric', label: 'Orderings of all 8 finalists', answer: 40320, tol: 0 },

        { kind: 'numeric', label: 'Orderings of the first 3 positions', answer: 336, tol: 0 },
      ],

      solution: [
        { text: 'All 8 finalists ranked: $8!=40{,}320$.' },

        { text: 'Just the first 3 places, order matters: $_{8}P_{3}=\\dfrac{8!}{5!}=336$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-psychology-sections',

    chapter: 'probability',

    topic: 'Counting techniques',

    difficulty: 'medium',

    citation: 'Walpole Ex. 2.41',

    instance: {
      prompt:
        'In how many ways can 6 teachers be assigned to 4 sections of an introductory psychology course if no teacher is assigned to more than one section?',

      parts: [{ kind: 'numeric', answer: 360, tol: 0 }],

      solution: [{ text: 'Order matters (which teacher gets which section): $_{6}P_{4}=\\dfrac{6!}{2!}=360$.' }],
    },
  }),

  bookQuestion({
    id: 'ch02-book-circular-wagons',

    chapter: 'probability',

    topic: 'Counting techniques',

    difficulty: 'medium',

    citation: 'Walpole Ex. 2.43',

    instance: {
      prompt: 'In how many ways can 5 different trees be planted in a circle?',

      parts: [{ kind: 'numeric', answer: 24, tol: 0 }],

      solution: [{ text: 'Circular arrangements of $n$ distinct objects: $(n-1)! = 4! = 24$.' }],
    },
  }),

  bookQuestion({
    id: 'ch02-book-infinity-permutations',

    chapter: 'probability',

    topic: 'Counting techniques',

    difficulty: 'hard',

    citation: 'Walpole Ex. 2.45',

    instance: {
      prompt: 'How many distinct permutations can be made from the letters of the word INFINITY?',

      parts: [{ kind: 'numeric', answer: 3360, tol: 0 }],

      solution: [
        { text: 'INFINITY has 8 letters: I ×3, N ×2, F, T, Y ×1 each.' },

        { text: '$\\dfrac{8!}{3!\\,2!}=\\dfrac{40{,}320}{12}=3360$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-accounting-candidates',

    chapter: 'probability',

    topic: 'Counting techniques',

    difficulty: 'easy',

    citation: 'Walpole Ex. 2.47',

    instance: {
      prompt: 'How many ways are there to select 3 candidates from 8 equally qualified recent graduates for openings in an accounting firm?',

      parts: [{ kind: 'numeric', answer: 56, tol: 0 }],

      solution: [{ text: 'Order does not matter: $\\binom{8}{3}=56$.' }],
    },
  }),

  bookQuestion({
    id: 'ch02-book-poker-aces-jacks',

    chapter: 'probability',

    topic: 'Counting techniques',

    difficulty: 'hard',

    citation: 'Walpole Example 2.28',

    instance: {
      prompt: 'In a 5-card poker hand, find the probability of holding exactly 2 aces and 3 jacks.',

      parts: [{ kind: 'numeric', answer: 0.0000092, tol: 0.0000002 }],

      solution: [
        { text: '2 of the 4 aces: $\\binom{4}{2}=6$. 3 of the 4 jacks: $\\binom{4}{3}=4$. By the multiplication rule, $6\\times4=24$ such hands.' },

        { text: 'All 5-card hands: $\\binom{52}{5}=2{,}598{,}960$, so $P=\\dfrac{24}{2{,}598{,}960}\\approx0.0000092$.' },
      ],
    },
  }),
];

// --- Additive rules (§2.4/2.5) ----------------------------------------------

const additiveRulesBook: QuestionTemplate[] = [
  bookQuestion({
    id: 'ch02-book-industry-location',

    chapter: 'probability',

    topic: 'Additive rules',

    difficulty: 'easy',

    citation: 'Walpole Ex. 2.53',

    instance: {
      prompt:
        'The probability that an American industry will locate in Shanghai is 0.7, in Beijing is 0.4, and in either or both cities is 0.8. Find the probability the industry will locate (a) in both cities, and (b) in neither city.',

      parts: [
        { kind: 'numeric', label: 'P(both)', answer: 0.3, tol: 0.001 },

        { kind: 'numeric', label: 'P(neither)', answer: 0.2, tol: 0.001 },
      ],

      solution: [
        { text: 'Additive rule: $P(A\\cap B)=P(A)+P(B)-P(A\\cup B)=0.7+0.4-0.8=0.3$.' },

        { text: 'Complement rule: $P(\\text{neither})=1-P(A\\cup B)=1-0.8=0.2$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-catalog-codes',

    chapter: 'probability',

    topic: 'Additive rules',

    difficulty: 'medium',

    citation: 'Walpole Ex. 2.55',

    instance: {
      prompt:
        'Each coded catalog item begins with 3 distinct letters followed by 4 distinct nonzero digits. Find the probability of randomly selecting an item with the first letter a vowel and the last digit even.',

      parts: [{ kind: 'numeric', answer: 10 / 117, tol: 0.001 }],

      solution: [
        { text: 'By symmetry, $P(\\text{first letter is a vowel})=\\tfrac{5}{26}$ and $P(\\text{last digit even})=\\tfrac{4}{9}$ (4 of the 9 nonzero digits are even).' },

        { text: 'The letter positions and digit positions are chosen independently: $\\tfrac{5}{26}\\times\\tfrac{4}{9}=\\tfrac{20}{234}=\\tfrac{10}{117}\\approx0.0855$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-alphabet-letter',

    chapter: 'probability',

    topic: 'Additive rules',

    difficulty: 'easy',

    citation: 'Walpole Ex. 2.57',

    instance: {
      prompt:
        'A letter is chosen at random from the English alphabet. Find the probability that the letter (a) is a vowel exclusive of y, (b) is listed somewhere ahead of j, (c) is listed somewhere after g.',

      parts: [
        { kind: 'numeric', label: 'P(vowel, not y)', answer: 5 / 26, tol: 0.001 },

        { kind: 'numeric', label: 'P(ahead of j)', answer: 9 / 26, tol: 0.001 },

        { kind: 'numeric', label: 'P(after g)', answer: 19 / 26, tol: 0.001 },
      ],

      solution: [
        { text: 'There are 5 vowels (a, e, i, o, u) among 26 equally likely letters: $\\tfrac{5}{26}$.' },

        { text: 'Letters a–i (9 letters) come before j: $\\tfrac{9}{26}$.' },

        { text: 'Letters h–z (19 letters) come after g: $\\tfrac{19}{26}$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-math-history-students',

    chapter: 'probability',

    topic: 'Additive rules',

    difficulty: 'medium',

    citation: 'Walpole Ex. 2.61',

    instance: {
      prompt:
        'In a graduating class of 100 students, 54 studied mathematics, 69 studied history, and 35 studied both. If one student is selected at random, find the probability that the student (a) took mathematics or history, (b) took neither subject, (c) took history but not mathematics.',

      parts: [
        { kind: 'numeric', label: 'P(math or history)', answer: 0.88, tol: 0.001 },

        { kind: 'numeric', label: 'P(neither)', answer: 0.12, tol: 0.001 },

        { kind: 'numeric', label: 'P(history, not math)', answer: 0.34, tol: 0.001 },
      ],

      solution: [
        { text: 'Additive rule: $P(M\\cup H)=\\dfrac{54+69-35}{100}=\\dfrac{88}{100}=0.88$.' },

        { text: 'Complement rule: $P(\\text{neither})=1-0.88=0.12$.' },

        { text: '$P(H\\cap M\')=\\dfrac{69-35}{100}=\\dfrac{34}{100}=0.34$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-pc-location',

    chapter: 'probability',

    topic: 'Additive rules',

    difficulty: 'easy',

    citation: 'Walpole Ex. 2.63',

    instance: {
      prompt:
        'A home PC is located in the adult bedroom with probability 0.03, child bedroom 0.15, other bedroom 0.14, office/den 0.40, or other rooms 0.28. (a) Find the probability the PC is in a bedroom. (b) Find the probability it is not in a bedroom. (c) In which room would you expect to find a PC?',

      parts: [
        { kind: 'numeric', label: 'P(bedroom)', answer: 0.32, tol: 0.001 },

        { kind: 'numeric', label: 'P(not bedroom)', answer: 0.68, tol: 0.001 },

        { kind: 'mcq', label: 'Most likely room', choices: ['Adult bedroom', 'Child bedroom', 'Office or den', 'Other rooms'], answer: 2 },
      ],

      solution: [
        { text: 'The three bedroom categories are mutually exclusive: $0.03+0.15+0.14=0.32$.' },

        { text: 'Complement rule: $1-0.32=0.68$.' },

        { text: 'Office or den has the largest single probability, 0.40, so that is the single most likely room.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-component-strain',

    chapter: 'probability',

    topic: 'Additive rules',

    difficulty: 'medium',

    citation: 'Walpole Ex. 2.65',

    instance: {
      prompt:
        'An electronic component fails a test with probability 0.20 (event $A$) or displays strain without failing with probability 0.35 (event $B$); $A$ and $B$ are mutually exclusive. Find (a) $P(A\')$, (b) the probability the component works perfectly (neither strains nor fails), and (c) $P(A\\cup B)$.',

      parts: [
        { kind: 'numeric', label: "P(A')", answer: 0.8, tol: 0.001 },

        { kind: 'numeric', label: 'P(works perfectly)', answer: 0.45, tol: 0.001 },

        { kind: 'numeric', label: 'P(A ∪ B)', answer: 0.55, tol: 0.001 },
      ],

      solution: [
        { text: 'Complement rule: $P(A\')=1-0.20=0.80$.' },

        { text: '$A$, $B$, and "works perfectly" partition the outcomes: $P(\\text{perfect})=1-0.20-0.35=0.45$.' },

        { text: 'Since $A$ and $B$ are mutually exclusive, $P(A\\cup B)=0.20+0.35=0.55$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-filling-machine',

    chapter: 'probability',

    topic: 'Additive rules',

    difficulty: 'medium',

    citation: 'Walpole Ex. 2.69',

    instance: {
      prompt:
        'A filling machine can fill to specification (event $A$, $P(A)=0.990$), underfill (event $B$, $P(B)=0.001$), or overfill (event $C$). (a) Find $P(C)$. (b) Find the probability the machine does not underfill. (c) Find the probability the machine either overfills or underfills.',

      parts: [
        { kind: 'numeric', label: 'P(C)', answer: 0.009, tol: 0.0005 },

        { kind: 'numeric', label: "P(B')", answer: 0.999, tol: 0.0005 },

        { kind: 'numeric', label: 'P(B ∪ C)', answer: 0.01, tol: 0.0005 },
      ],

      solution: [
        { text: '$A$, $B$, $C$ partition every fill outcome: $P(C)=1-0.990-0.001=0.009$.' },

        { text: 'Complement rule: $P(B\')=1-0.001=0.999$.' },

        { text: '$B$ and $C$ are mutually exclusive: $P(B\\cup C)=0.001+0.009=0.01$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-weight-specification',

    chapter: 'probability',

    topic: 'Additive rules',

    difficulty: 'hard',

    citation: 'Walpole Ex. 2.71',

    instance: {
      prompt:
        'A packaged product meets weight specifications with probability 0.95 and is too light with probability 0.002. Production costs $20.00 per package and sells for $25.00. (a) Find the probability a randomly chosen package is too heavy. (b) For each 10,000 packages, what profit is received if every package met specification? (c) If defective packages are rejected and worthless, by how much is that ideal profit reduced due to packages that fail to meet specification?',

      parts: [
        { kind: 'numeric', label: 'P(too heavy)', answer: 0.048, tol: 0.0005 },

        { kind: 'numeric', label: 'Ideal profit on 10,000 packages', answer: 50000, tol: 0, unit: '$' },

        { kind: 'numeric', label: 'Reduction in profit', answer: 12500, tol: 0, unit: '$' },
      ],

      solution: [
        { text: '"Too light", "in spec", "too heavy" partition every package: $P(\\text{too heavy})=1-0.95-0.002=0.048$.' },

        { text: 'If every package met spec, profit per package is $\\$25-\\$20=\\$5$, so $10{,}000\\times\\$5=\\$50{,}000$.' },

        { text: 'A fraction $1-0.95=0.05$ of packages are rejected and earn no revenue, but production cost is already sunk, so the lost revenue is $10{,}000\\times0.05\\times\\$25=\\$12{,}500$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-gas-station-cars',

    chapter: 'probability',

    topic: 'Additive rules',

    difficulty: 'easy',

    citation: 'Walpole Review Ex. 2.106',

    instance: {
      prompt:
        'The probabilities that a service station pumps gas into 0, 1, 2, 3, 4, or 5-or-more cars during a 30-minute period are 0.03, 0.18, 0.24, 0.28, 0.10, and 0.17, respectively. Find the probability that in this period (a) more than 2 cars receive gas, (b) at most 4 cars receive gas, (c) 4 or more cars receive gas.',

      parts: [
        { kind: 'numeric', label: 'P(more than 2)', answer: 0.55, tol: 0.001 },

        { kind: 'numeric', label: 'P(at most 4)', answer: 0.83, tol: 0.001 },

        { kind: 'numeric', label: 'P(4 or more)', answer: 0.27, tol: 0.001 },
      ],

      solution: [
        { text: 'These outcomes are mutually exclusive, so probabilities add. $P(>2)=1-(0.03+0.18+0.24)=0.55$.' },

        { text: '$P(\\le4)=0.03+0.18+0.24+0.28+0.10=0.83$.' },

        { text: '$P(\\ge4)=0.10+0.17=0.27$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-prison-demographics',

    chapter: 'probability',

    topic: 'Additive rules',

    difficulty: 'hard',

    citation: 'Walpole Review Ex. 2.111',

    instance: {
      prompt:
        'In a federal prison, $\\tfrac{2}{3}$ of inmates are under 25, $\\tfrac{3}{5}$ are male, and $\\tfrac{5}{8}$ are female or 25 or older. What is the probability that a randomly selected prisoner is female and at least 25 years old?',

      parts: [{ kind: 'numeric', answer: 0.1083, tol: 0.001 }],

      solution: [
        { text: 'Let $F$ = female ($P(F)=\\tfrac{2}{5}$) and $G$ = at least 25 ($P(G)=\\tfrac{1}{3}$); we are given $P(F\\cup G)=\\tfrac{5}{8}$.' },

        { text: 'Rearranging the additive rule: $P(F\\cap G)=P(F)+P(G)-P(F\\cup G)=\\tfrac{2}{5}+\\tfrac{1}{3}-\\tfrac{5}{8}\\approx0.1083$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-injured-workers',

    chapter: 'probability',

    topic: 'Additive rules',

    difficulty: 'medium',

    citation: 'Walpole Review Ex. 2.123',

    instance: {
      prompt:
        'Of injured workers, 10% are admitted to a hospital, 15% are back on the job the next day, and 2% are both. If a worker is injured, find the probability the worker is either admitted to a hospital or back on the job the next day, or both.',

      parts: [{ kind: 'numeric', answer: 0.23, tol: 0.001 }],

      solution: [{ text: 'Additive rule: $0.10+0.15-0.02=0.23$.' }],
    },
  }),
];

// --- Conditional probability, independence, and the product rule (§2.6) ----

const conditionalBook: QuestionTemplate[] = [
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

  bookQuestion({
    id: 'ch02-book-education-by-sex',

    chapter: 'probability',

    topic: 'Conditional probability',

    difficulty: 'easy',

    citation: 'Walpole Ex. 2.75',

    instance: {
      prompt:
        'A random sample of 200 adults is classified by sex and education: Elementary: 38 male, 45 female; Secondary: 28 male, 50 female; College: 22 male, 17 female. Find the probability that a randomly picked person (a) is male, given secondary education, and (b) does not have a college degree, given that the person is female.',

      parts: [
        { kind: 'numeric', label: 'P(male | secondary)', answer: 14 / 39, tol: 0.001 },

        { kind: 'numeric', label: 'P(not college | female)', answer: 95 / 112, tol: 0.001 },
      ],

      solution: [
        { text: 'Restrict to the secondary row: $\\dfrac{28}{28+50}=\\dfrac{28}{78}=\\dfrac{14}{39}\\approx0.359$.' },

        { text: 'Restrict to the female column: $\\dfrac{45+50}{45+50+17}=\\dfrac{95}{112}\\approx0.848$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-sleepwear-survey',

    chapter: 'probability',

    topic: 'Conditional probability',

    difficulty: 'medium',

    citation: 'Walpole Ex. 2.79',

    instance: {
      prompt:
        'A survey of sleepwear habits gives $P(\\text{male})=0.614$ overall, and $P(\\text{male and pajamas})=0.102$. Find the probability a traveler is male, and the probability a male traveler sleeps in pajamas.',

      parts: [
        { kind: 'numeric', label: 'P(male)', answer: 0.614, tol: 0.001 },

        { kind: 'numeric', label: 'P(pajamas | male)', answer: 0.166, tol: 0.001 },
      ],

      solution: [
        { text: 'P(male) is given directly as the male column total: 0.614.' },

        { text: '$P(\\text{pajamas}\\mid\\text{male})=\\dfrac{P(\\text{male and pajamas})}{P(\\text{male})}=\\dfrac{0.102}{0.614}\\approx0.166$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-married-couples-tv',

    chapter: 'probability',

    topic: 'Conditional probability',

    difficulty: 'medium',

    citation: 'Walpole Ex. 2.81',

    instance: {
      prompt:
        'The probability a married man watches a certain TV show is 0.4, and for a married woman it is 0.5. The probability a man watches the show given his wife does is 0.7. Find (a) the probability a couple both watch the show, (b) the probability the wife watches given the husband watches, and (c) the probability at least one of the couple watches.',

      parts: [
        { kind: 'numeric', label: 'P(both watch)', answer: 0.35, tol: 0.001 },

        { kind: 'numeric', label: 'P(wife | husband)', answer: 0.875, tol: 0.001 },

        { kind: 'numeric', label: 'P(at least one)', answer: 0.55, tol: 0.001 },
      ],

      solution: [
        { text: 'Product rule: $P(\\text{man}\\cap\\text{woman})=P(\\text{woman})P(\\text{man}\\mid\\text{woman})=0.5\\times0.7=0.35$.' },

        { text: '$P(\\text{woman}\\mid\\text{man})=\\dfrac{P(\\text{man}\\cap\\text{woman})}{P(\\text{man})}=\\dfrac{0.35}{0.4}=0.875$.' },

        { text: 'Additive rule: $P(\\text{man}\\cup\\text{woman})=0.4+0.5-0.35=0.55$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-luray-caverns',

    chapter: 'probability',

    topic: 'Conditional probability',

    difficulty: 'medium',

    citation: 'Walpole Ex. 2.83',

    instance: {
      prompt:
        'A vehicle entering Luray Caverns has Canadian plates with probability 0.12, is a camper with probability 0.28, and is a camper with Canadian plates with probability 0.09. Find (a) the probability a camper has Canadian plates, (b) the probability a vehicle with Canadian plates is a camper, and (c) the probability a vehicle does not have Canadian plates or is not a camper.',

      parts: [
        { kind: 'numeric', label: 'P(Canadian | camper)', answer: 0.3214, tol: 0.001 },

        { kind: 'numeric', label: 'P(camper | Canadian)', answer: 0.75, tol: 0.001 },

        { kind: 'numeric', label: "P(not Canadian ∪ not camper)", answer: 0.91, tol: 0.001 },
      ],

      solution: [
        { text: '$P(\\text{Canadian}\\mid\\text{camper})=\\dfrac{0.09}{0.28}\\approx0.321$.' },

        { text: '$P(\\text{camper}\\mid\\text{Canadian})=\\dfrac{0.09}{0.12}=0.75$.' },

        { text: 'By De Morgan, "not Canadian or not camper" is the complement of "Canadian and camper": $1-0.09=0.91$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-doctor-lawsuit',

    chapter: 'probability',

    topic: 'Conditional probability',

    difficulty: 'easy',

    citation: 'Walpole Ex. 2.85',

    instance: {
      prompt:
        'The probability a doctor correctly diagnoses a particular illness is 0.7. Given an incorrect diagnosis, the probability the patient sues is 0.9. What is the probability the doctor misdiagnoses the patient and the patient sues?',

      parts: [{ kind: 'numeric', answer: 0.27, tol: 0.001 }],

      solution: [{ text: 'Product rule: $P(\\text{incorrect})\\,P(\\text{sue}\\mid\\text{incorrect})=0.3\\times0.9=0.27$.' }],
    },
  }),

  bookQuestion({
    id: 'ch02-book-master-keys',

    chapter: 'probability',

    topic: 'Conditional probability',

    difficulty: 'hard',

    citation: 'Walpole Ex. 2.87',

    instance: {
      prompt:
        'A real estate agent has 8 master keys, only 1 of which opens any given house. 40% of homes are left unlocked. What is the probability the agent can get into a specific home if they take 3 master keys at random before leaving the office?',

      parts: [{ kind: 'numeric', answer: 0.625, tol: 0.001 }],

      solution: [
        { text: 'If the house is unlocked (probability 0.4), the agent gets in for free.' },

        { text: 'Otherwise (probability 0.6), the agent needs the one correct key among the 3 chosen from 8: $P(\\text{correct key in 3})=\\tfrac{3}{8}$.' },

        { text: 'Total: $0.4+0.6\\times\\tfrac{3}{8}=0.4+0.225=0.625$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-fire-engines',

    chapter: 'probability',

    topic: 'Conditional probability',

    difficulty: 'easy',

    citation: 'Walpole Ex. 2.89',

    instance: {
      prompt:
        'A town has two fire engines operating independently, each available when needed with probability 0.96. Find (a) the probability neither is available when needed, and (b) the probability at least one is available.',

      parts: [
        { kind: 'numeric', label: 'P(neither available)', answer: 0.0016, tol: 0.0001 },

        { kind: 'numeric', label: 'P(at least one available)', answer: 0.9984, tol: 0.0001 },
      ],

      solution: [
        { text: 'By independence, $P(\\text{neither})=(1-0.96)^2=0.04^2=0.0016$.' },

        { text: 'Complement rule: $P(\\text{at least one})=1-0.0016=0.9984$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-milk-quarts',

    chapter: 'probability',

    topic: 'Conditional probability',

    difficulty: 'hard',

    citation: 'Walpole Ex. 2.91',

    instance: {
      prompt:
        'A cooler holds 20 quarts of milk, 5 of them spoiled. Find the probability of randomly selecting 4 good quarts in succession, without replacement, by applying the product rule to each successive draw.',

      parts: [{ kind: 'numeric', answer: 0.2817, tol: 0.001 }],

      solution: [
        { text: 'Each draw shrinks the population by one: $P=\\dfrac{15}{20}\\cdot\\dfrac{14}{19}\\cdot\\dfrac{13}{18}\\cdot\\dfrac{12}{17}$.' },

        { text: '$=\\dfrac{91}{323}\\approx0.2817$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-income-tax-mistakes',

    chapter: 'probability',

    topic: 'Conditional probability',

    difficulty: 'medium',

    citation: 'Walpole Review Ex. 2.108',

    instance: {
      prompt:
        'The probability a person makes a mistake on their state income tax return is 0.1, independently from person to person. Find the probability that (a) four unrelated people each make a mistake, and (b) two specific people (Jones and Clark) both make a mistake while two others (Roberts and Williams) do not.',

      parts: [
        { kind: 'numeric', label: 'P(all four make a mistake)', answer: 0.0001, tol: 0.00001 },

        { kind: 'numeric', label: 'P(Jones & Clark err, Roberts & Williams correct)', answer: 0.0081, tol: 0.0001 },
      ],

      solution: [
        { text: 'By independence, $0.1^4=0.0001$.' },

        { text: 'By independence, $0.1\\times0.1\\times0.9\\times0.9=0.0081$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-black-green-balls-replacement',

    chapter: 'probability',

    topic: 'Conditional probability',

    difficulty: 'medium',

    citation: 'Walpole Review Ex. 2.113',

    instance: {
      prompt:
        'A box has 6 black balls and 4 green balls. 3 balls are drawn in succession, each ball replaced before the next draw. Find the probability that (a) all 3 draws are the same color, and (b) both colors are represented among the 3 draws.',

      parts: [
        { kind: 'numeric', label: 'P(all same color)', answer: 0.28, tol: 0.001 },

        { kind: 'numeric', label: 'P(both colors represented)', answer: 0.72, tol: 0.001 },
      ],

      solution: [
        { text: 'With replacement, each draw is independent with $P(\\text{black})=0.6$, $P(\\text{green})=0.4$: $P(\\text{all same})=0.6^3+0.4^3=0.28$.' },

        { text: 'Complement rule: $P(\\text{both colors})=1-0.28=0.72$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-technological-displacement',

    chapter: 'probability',

    topic: 'Conditional probability',

    difficulty: 'hard',

    citation: 'Walpole Review Ex. 2.126',

    instance: {
      prompt:
        'Of 100 displaced workers, those who found a new job with a new company in the same field split 13 union / 10 nonunion; unemployed-for-a-year workers split 2 union / 5 nonunion; union members total 40+13+4+2=59 across all outcomes. Find (a) the probability a worker who found a new-company job in the same field is a union member, and (b) the probability a union member has been unemployed for a year.',

      parts: [
        { kind: 'numeric', label: 'P(union | new company, same field)', answer: 0.5652, tol: 0.001 },

        { kind: 'numeric', label: 'P(unemployed 1 year | union)', answer: 0.0339, tol: 0.001 },
      ],

      solution: [
        { text: 'Restrict to the "new company, same field" row: $\\dfrac{13}{13+10}\\approx0.565$.' },

        { text: 'Restrict to the union column (total 59): $\\dfrac{2}{59}\\approx0.034$.' },
      ],
    },
  }),
];

// --- Bayes' rule (§2.7) ------------------------------------------------------

const bayesBook: QuestionTemplate[] = [
  bookQuestion({
    id: 'ch02-book-cancer-diagnosis-total',

    chapter: 'probability',

    topic: 'Bayes theorem',

    difficulty: 'easy',

    citation: 'Walpole Ex. 2.95',

    instance: {
      prompt:
        'In a region, the probability of selecting an adult over 40 with cancer is 0.05. A doctor correctly diagnoses a person with cancer 78% of the time, and incorrectly diagnoses a cancer-free person as having cancer 6% of the time. What is the probability an adult over 40 is diagnosed as having cancer?',

      parts: [{ kind: 'numeric', answer: 0.096, tol: 0.0005 }],

      solution: [
        { text: 'Total probability: $P(\\text{diag})=P(\\text{cancer})P(\\text{diag}\\mid\\text{cancer})+P(\\text{no cancer})P(\\text{diag}\\mid\\text{no cancer})$.' },

        { text: '$=0.05\\times0.78+0.95\\times0.06=0.039+0.057=0.096$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-cancer-diagnosis-posterior',

    chapter: 'probability',

    topic: 'Bayes theorem',

    difficulty: 'medium',

    citation: 'Walpole Ex. 2.97',

    instance: {
      prompt: 'Referring to the cancer-diagnosis scenario above ($P(\\text{diag})=0.096$), what is the probability a person diagnosed as having cancer actually has it?',

      parts: [{ kind: 'numeric', answer: 0.40625, tol: 0.001 }],

      solution: [{ text: 'Bayes: $P(\\text{cancer}\\mid\\text{diag})=\\dfrac{0.05\\times0.78}{0.096}=\\dfrac{0.039}{0.096}\\approx0.406$.' }],
    },
  }),

  bookQuestion({
    id: 'ch02-book-film-inspectors',

    chapter: 'probability',

    topic: 'Bayes theorem',

    difficulty: 'hard',

    citation: 'Walpole Ex. 2.99',

    instance: {
      prompt:
        'Four inspectors stamp expiration dates on film packages. John stamps 20% of packages and misses once every 200; Tom stamps 60% and misses once every 100; Jeff stamps 15% and misses once every 90; Pat stamps 5% and misses once every 200. A customer finds a package with no expiration date. What is the probability it was inspected by John?',

      parts: [{ kind: 'numeric', answer: 0.1121, tol: 0.002 }],

      solution: [
        { text: 'Total probability of a miss: $P(\\text{miss})=0.20(\\tfrac1{200})+0.60(\\tfrac1{100})+0.15(\\tfrac1{90})+0.05(\\tfrac1{200})=\\tfrac{107}{12{,}000}\\approx0.00892$.' },

        { text: 'Bayes: $P(\\text{John}\\mid\\text{miss})=\\dfrac{0.20/200}{0.00892}=\\dfrac{12}{107}\\approx0.112$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-paint-store-roller',

    chapter: 'probability',

    topic: 'Bayes theorem',

    difficulty: 'medium',

    citation: 'Walpole Ex. 2.101',

    instance: {
      prompt:
        'A paint store sells latex paint (probability 0.75 of any purchase) or semigloss (0.25). 60% of latex buyers also buy a roller, but only 30% of semigloss buyers do. A random buyer purchases a roller and a can of paint. What is the probability the paint is latex?',

      parts: [{ kind: 'numeric', answer: 0.8571, tol: 0.001 }],

      solution: [
        { text: 'Total probability of buying a roller: $P(\\text{roller})=0.75\\times0.60+0.25\\times0.30=0.45+0.075=0.525$.' },

        { text: 'Bayes: $P(\\text{latex}\\mid\\text{roller})=\\dfrac{0.45}{0.525}\\approx0.857$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-truth-serum',

    chapter: 'probability',

    topic: 'Bayes theorem',

    difficulty: 'hard',

    citation: 'Walpole Review Ex. 2.103',

    instance: {
      prompt:
        'A truth serum properly judges 90% of guilty suspects (10% are wrongly found innocent), and misjudges innocent suspects as guilty 1% of the time. Only 5% of a suspect pool has ever committed a crime. If the serum indicates a randomly chosen suspect is guilty, what is the probability the suspect is actually innocent?',

      parts: [{ kind: 'numeric', answer: 0.1743, tol: 0.001 }],

      solution: [
        { text: 'Total probability of a "guilty" reading: $P(\\text{pos})=0.05\\times0.90+0.95\\times0.01=0.045+0.0095=0.0545$.' },

        { text: 'Bayes: $P(\\text{innocent}\\mid\\text{pos})=\\dfrac{0.95\\times0.01}{0.0545}\\approx0.174$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-motel-plumbing',

    chapter: 'probability',

    topic: 'Bayes theorem',

    difficulty: 'medium',

    citation: 'Walpole Review Ex. 2.109',

    instance: {
      prompt:
        'A firm assigns clients to 3 motels: 20% to the Ramada, 50% to the Sheraton, 30% to the Lakeview. Faulty plumbing occurs in 5% of Ramada rooms, 4% of Sheraton rooms, and 8% of Lakeview rooms. Find (a) the probability a client gets a room with faulty plumbing, and (b) given faulty plumbing, the probability the client was at the Lakeview.',

      parts: [
        { kind: 'numeric', label: 'P(faulty plumbing)', answer: 0.054, tol: 0.001 },

        { kind: 'numeric', label: 'P(Lakeview | faulty plumbing)', answer: 0.4444, tol: 0.001 },
      ],

      solution: [
        { text: 'Total probability: $0.20\\times0.05+0.50\\times0.04+0.30\\times0.08=0.01+0.02+0.024=0.054$.' },

        { text: 'Bayes: $P(\\text{Lakeview}\\mid\\text{faulty})=\\dfrac{0.30\\times0.08}{0.054}=\\dfrac{0.024}{0.054}\\approx0.444$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-consulting-firm-overrun',

    chapter: 'probability',

    topic: 'Bayes theorem',

    difficulty: 'hard',

    citation: 'Walpole Review Ex. 2.115',

    instance: {
      prompt:
        'A federal agency uses 3 consulting firms: A (probability 0.40 of being chosen, cost-overrun rate 0.05), B (0.35, rate 0.03), and C (0.25, rate 0.15). Given a cost overrun occurred, find the probability it was firm C, and the probability it was firm A.',

      parts: [
        { kind: 'numeric', label: 'P(C | overrun)', answer: 0.5515, tol: 0.001 },

        { kind: 'numeric', label: 'P(A | overrun)', answer: 0.2941, tol: 0.001 },
      ],

      solution: [
        { text: 'Total probability of an overrun: $0.40\\times0.05+0.35\\times0.03+0.25\\times0.15=0.02+0.0105+0.0375=0.068$.' },

        { text: 'Bayes: $P(C\\mid\\text{overrun})=\\dfrac{0.0375}{0.068}\\approx0.552$, and $P(A\\mid\\text{overrun})=\\dfrac{0.02}{0.068}\\approx0.294$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-cancer-blood-test',

    chapter: 'probability',

    topic: 'Bayes theorem',

    difficulty: 'hard',

    citation: 'Walpole Review Ex. 2.118',

    instance: {
      prompt:
        'A form of cancer occurs in women over 60 with probability 0.07. A blood test gives a false negative 10% of the time and a false positive 5% of the time. A woman over 60 takes the test and receives a negative result. What is the probability she has the disease?',

      parts: [{ kind: 'numeric', answer: 0.00786, tol: 0.0002 }],

      solution: [
        { text: 'Total probability of a negative result: $P(\\text{neg})=0.07\\times0.10+0.93\\times0.95=0.007+0.8835=0.8905$.' },

        { text: 'Bayes: $P(\\text{disease}\\mid\\text{neg})=\\dfrac{0.007}{0.8905}\\approx0.00786$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-electronic-lots',

    chapter: 'probability',

    topic: 'Bayes theorem',

    difficulty: 'hard',

    citation: 'Walpole Review Ex. 2.119',

    instance: {
      prompt:
        'Lots of 20 electronic components ship with 0 defectives (60% of lots), 1 defective (30%), or 2 defectives (10%). Two components are sampled from a lot without replacement, and neither is defective. Find the probability the lot had 0, 1, and 2 defectives, respectively.',

      parts: [
        { kind: 'numeric', label: 'P(0 defective | neither sampled defective)', answer: 0.6312, tol: 0.001 },

        { kind: 'numeric', label: 'P(1 defective | neither sampled defective)', answer: 0.2841, tol: 0.001 },

        { kind: 'numeric', label: 'P(2 defective | neither sampled defective)', answer: 0.0847, tol: 0.001 },
      ],

      solution: [
        { text: 'Given the lot composition, $P(\\text{neither defective})$ is $1$, $\\binom{19}{2}/\\binom{20}{2}$, or $\\binom{18}{2}/\\binom{20}{2}$ for 0, 1, or 2 defectives.' },

        { text: 'Total probability: $0.60(1)+0.30(0.9)+0.10(0.7947)\\approx0.9505$.' },

        { text: 'Bayes on each branch gives $\\approx0.6312$, $0.2841$, and $0.0847$, summing to 1.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-rare-disease-test',

    chapter: 'probability',

    topic: 'Bayes theorem',

    difficulty: 'medium',

    citation: 'Walpole Review Ex. 2.120',

    instance: {
      prompt:
        'A rare disease affects 1 in 500 people. A test correctly returns positive for a diseased person 95% of the time, and incorrectly returns positive for a healthy person 1% of the time. If a random person tests positive, what is the probability they have the disease?',

      parts: [{ kind: 'numeric', answer: 0.1599, tol: 0.001 }],

      solution: [
        { text: 'Total probability of a positive result: $\\tfrac1{500}(0.95)+\\tfrac{499}{500}(0.01)\\approx0.00190+0.00998=0.01188$.' },

        { text: 'Bayes: $P(\\text{disease}\\mid\\text{pos})=\\dfrac{0.0019}{0.01188}\\approx0.160$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-construction-engineers',

    chapter: 'probability',

    topic: 'Bayes theorem',

    difficulty: 'medium',

    citation: 'Walpole Review Ex. 2.121',

    instance: {
      prompt:
        'Engineer 1 estimates costs for 70% of a company\'s jobs, with an error rate of 2%; Engineer 2 estimates the other 30%, with an error rate of 4%. A serious estimation error occurs. Which engineer more likely did the work — find both posterior probabilities.',

      parts: [
        { kind: 'numeric', label: 'P(Engineer 1 | error)', answer: 0.5385, tol: 0.001 },

        { kind: 'numeric', label: 'P(Engineer 2 | error)', answer: 0.4615, tol: 0.001 },
      ],

      solution: [
        { text: 'Total probability of an error: $0.70\\times0.02+0.30\\times0.04=0.014+0.012=0.026$.' },

        { text: 'Bayes: $P(\\text{Eng1}\\mid\\text{error})=\\dfrac{0.014}{0.026}\\approx0.538$, $P(\\text{Eng2}\\mid\\text{error})=\\dfrac{0.012}{0.026}\\approx0.462$ — Engineer 1 is (slightly) more likely, despite the lower individual error rate, because they do more of the work.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-operator-training',

    chapter: 'probability',

    topic: 'Bayes theorem',

    difficulty: 'medium',

    citation: 'Walpole Review Ex. 2.124',

    instance: {
      prompt:
        'Trained operators meet their production quota 90% of the time; untrained operators meet it 65% of the time. Half of new operators attend the training course. Given that a new operator meets her quota, what is the probability she attended the training?',

      parts: [{ kind: 'numeric', answer: 0.5806, tol: 0.001 }],

      solution: [
        { text: 'Total probability of meeting quota: $0.5\\times0.90+0.5\\times0.65=0.45+0.325=0.775$.' },

        { text: 'Bayes: $P(\\text{trained}\\mid\\text{quota})=\\dfrac{0.45}{0.775}\\approx0.581$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch02-book-hemophilia-queen',

    chapter: 'probability',

    topic: 'Bayes theorem',

    difficulty: 'hard',

    citation: 'Walpole Review Ex. 2.127',

    instance: {
      prompt:
        'There is a 50-50 chance the queen carries the hemophilia gene. If she is a carrier, each prince independently has hemophilia with probability 0.5; if not, no prince has it. The queen has had 3 princes, none with the disease. What is the probability the queen is a carrier?',

      parts: [{ kind: 'numeric', answer: 0.1111, tol: 0.001 }],

      solution: [
        { text: 'If a carrier, $P(\\text{3 unaffected})=0.5^3=0.125$; if not a carrier, $P(\\text{3 unaffected})=1$.' },

        { text: 'Total probability: $0.5\\times0.125+0.5\\times1=0.5625$.' },

        { text: 'Bayes: $P(\\text{carrier}\\mid\\text{3 unaffected})=\\dfrac{0.5\\times0.125}{0.5625}=\\dfrac{0.0625}{0.5625}\\approx0.111$.' },
      ],
    },
  }),
];

export const ch02Book: QuestionTemplate[] = [
  ...sampleSpaceEventsBook,

  ...countingBook,

  ...additiveRulesBook,

  ...conditionalBook,

  ...bayesBook,
];
