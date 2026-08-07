import type { QuestionTemplate } from '../types';

import { bookQuestion } from '../authoring';

export const ch03Book: QuestionTemplate[] = [
  bookQuestion({
    id: 'ch03-book-classify',

    chapter: 'random-variables',

    topic: 'Random variables',

    difficulty: 'easy',

    citation: 'Walpole Ex. 3.1 (discrete vs continuous)',

    instance: {
      prompt:
        'Consider these random variables: $X$, the number of automobile accidents per year in a state; ' +
        '$Y$, the time taken to play $18$ holes of golf; $M$, the amount of milk produced yearly by a ' +
        'particular cow; $N$, the number of eggs laid each month by a hen. Which are **discrete**?',

      parts: [
        {
          kind: 'mcq',

          choices: ['$X$ and $N$', '$Y$ and $M$', '$X$, $M$ and $N$', 'All four'],

          answer: 0,
        },
      ],

      solution: [
        {
          text: 'Discrete variables carry **count** data; continuous variables carry **measurement** data.',
        },

        {
          text: '$X$ (accidents) and $N$ (eggs) are counts — whole numbers, listable. $Y$ (time) and $M$ (litres of milk) are measurements, taking any value in an interval.',
        },

        {
          text: 'So $X$ and $N$ are discrete, $Y$ and $M$ continuous. The unit is the tell: things you *count* are discrete, things you *measure* are continuous.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-laptop-pmf',

    chapter: 'random-variables',

    topic: 'Discrete distributions',

    difficulty: 'medium',

    citation: 'Walpole §3.2, Example 3.8',

    instance: {
      prompt:
        'A shipment of $20$ similar laptop computers to a retail outlet contains $3$ that are defective. ' +
        'A school makes a random purchase of $2$ of these computers. With $X$ the number of defectives ' +
        'purchased, find $P(X=1)$.',

      parts: [{ kind: 'numeric', answer: 51 / 190, tol: 0.001 }],

      solution: [
        {
          text: 'There are $\\binom{20}{2}=190$ equally likely purchases.',
        },

        {
          text: 'Exactly one defective means choosing $1$ of the $3$ defective and $1$ of the $17$ good: $\\binom{3}{1}\\binom{17}{1}=51$.',
        },

        {
          text: '$P(X=1)=\\dfrac{51}{190}\\approx0.268$. (Checking the whole pmf, $\\tfrac{136}{190}+\\tfrac{51}{190}+\\tfrac{3}{190}=1$.)',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-reaction-temp-density',

    chapter: 'random-variables',

    topic: 'Continuous distributions',

    difficulty: 'medium',

    citation: 'Walpole §3.3, Examples 3.11–3.12',

    instance: {
      prompt:
        'The error in the reaction temperature, in $^{\\circ}\\mathrm{C}$, for a controlled experiment is a ' +
        'continuous random variable $X$ with $f(x)=\\dfrac{x^2}{3}$ for $-1<x<2$ and $f(x)=0$ elsewhere. ' +
        'Find $P(0<X\\le1)$.',

      parts: [{ kind: 'numeric', answer: 1 / 9, tol: 0.001 }],

      solution: [
        {
          text: 'First confirm $f$ is a density: $\\displaystyle\\int_{-1}^{2}\\dfrac{x^2}{3}\\,dx=\\dfrac{x^3}{9}\\bigg|_{-1}^{2}=\\dfrac{8}{9}+\\dfrac{1}{9}=1$.',
        },

        {
          text: '$P(0<X\\le1)=\\displaystyle\\int_{0}^{1}\\dfrac{x^2}{3}\\,dx=\\dfrac{x^3}{9}\\bigg|_{0}^{1}=\\dfrac{1}{9}\\approx0.111$.',
        },

        {
          text: 'Equivalently via the CDF $F(x)=\\dfrac{x^3+1}{9}$ on $[-1,2)$: $F(1)-F(0)=\\dfrac{2}{9}-\\dfrac{1}{9}=\\dfrac{1}{9}$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-pen-joint',

    chapter: 'random-variables',

    topic: 'Joint distributions',

    difficulty: 'medium',

    citation: 'Walpole §3.4, Example 3.14',

    instance: {
      prompt:
        'Two ballpoint pens are selected at random from a box containing $3$ blue pens, $2$ red pens ' +
        'and $3$ green pens. Let $X$ be the number of blue pens selected and $Y$ the number of red pens ' +
        'selected. Find $P[(X,Y)\\in A]$, where $A$ is the region $\\{(x,y)\\mid x+y\\le1\\}$.',

      parts: [{ kind: 'numeric', answer: 9 / 14, tol: 0.001 }],

      solution: [
        {
          text: 'There are $\\binom{8}{2}=28$ equally likely selections, and $f(x,y)=\\dfrac{\\binom{3}{x}\\binom{2}{y}\\binom{3}{2-x-y}}{\\binom{8}{2}}$.',
        },

        {
          text: 'The region $x+y\\le1$ holds exactly $(0,0)$, $(0,1)$ and $(1,0)$: two greens, one red and one green, or one blue and one green.',
        },

        {
          text: '$f(0,0)=\\dfrac{3}{28}$, $f(0,1)=\\dfrac{6}{28}$, $f(1,0)=\\dfrac{9}{28}$.',
        },

        {
          text: '$P[(X,Y)\\in A]=\\dfrac{3+6+9}{28}=\\dfrac{18}{28}=\\dfrac{9}{14}\\approx0.643$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-pen-conditional',

    chapter: 'random-variables',

    topic: 'Joint distributions',

    difficulty: 'medium',

    citation: 'Walpole §3.4, Example 3.18',

    instance: {
      prompt:
        'For the two pens of the previous problem ($3$ blue, $2$ red, $3$ green; $X$ blue selected, ' +
        '$Y$ red selected), find $P(X=0\\mid Y=1)$.',

      parts: [{ kind: 'numeric', answer: 1 / 2, tol: 0.001 }],

      solution: [
        {
          text: 'Conditioning on $Y=1$ needs the marginal $h(1)=\\sum_x f(x,1)=\\dfrac{6}{28}+\\dfrac{6}{28}+0=\\dfrac{12}{28}=\\dfrac{3}{7}$.',
        },

        {
          text: 'The conditional distribution is $f(x\\mid1)=\\dfrac{f(x,1)}{h(1)}$, so $f(0\\mid1)=\\dfrac{6/28}{12/28}=\\dfrac{1}{2}$.',
        },

        {
          text: 'Read it back in words: given that exactly one of the two pens is red, the chance the other is *not* blue is $\\tfrac{1}{2}$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-pen-independence',

    chapter: 'random-variables',

    topic: 'Joint distributions',

    difficulty: 'hard',

    citation: 'Walpole §3.4, Example 3.21',

    instance: {
      prompt:
        'For the same two pens ($X$ blue selected, $Y$ red selected), the marginals are ' +
        '$g(0)=\\dfrac{5}{14}$ and $h(1)=\\dfrac{3}{7}$, while $f(0,1)=\\dfrac{3}{14}$. ' +
        'Are $X$ and $Y$ statistically independent?',

      parts: [
        {
          kind: 'mcq',

          choices: [
            'No — $f(0,1)\\neq g(0)h(1)$, and one failing point is enough',

            'Yes — the joint distribution sums to $1$',

            'Yes — every marginal is a valid pmf',

            'Cannot be decided without checking all nine points',
          ],

          answer: 0,
        },
      ],

      solution: [
        {
          text: 'Independence requires $f(x,y)=g(x)h(y)$ at **every** point of the range.',
        },

        {
          text: 'At $(0,1)$: $g(0)h(1)=\\dfrac{5}{14}\\cdot\\dfrac{3}{7}=\\dfrac{15}{98}$, but $f(0,1)=\\dfrac{3}{14}=\\dfrac{21}{98}$.',
        },

        {
          text: 'These differ, so $X$ and $Y$ are not statistically independent. A single counterexample settles it — there is no need to check the rest.',
        },

        {
          text: 'The reverse is not true: agreement at one point proves nothing, which is why checking discrete independence properly means checking every point.',
        },
      ],
    },
  }),
];
