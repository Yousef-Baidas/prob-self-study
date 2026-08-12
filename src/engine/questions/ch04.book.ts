import type { QuestionTemplate } from '../types';

import { bookQuestion } from '../authoring';

export const ch04Book: QuestionTemplate[] = [
  bookQuestion({
    id: 'ch04-book-lot-mean',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'easy',

    citation: 'Walpole §4.1, Example 4.1',

    instance: {
      prompt:
        'A lot containing $7$ components is sampled by a quality inspector; the lot contains $4$ good ' +
        'components and $3$ defective components. A sample of $3$ is taken by the inspector. Let $X$ be the ' +
        'number of good components in this sample. Find the expected value of $X$.',

      parts: [{ kind: 'numeric', answer: 12 / 7, tol: 0.005 }],

      solution: [
        {
          text: 'The distribution is hypergeometric: $f(x)=\\dfrac{\\binom{4}{x}\\binom{3}{3-x}}{\\binom{7}{3}}$, $x=0,1,2,3$.',
        },

        {
          text: 'Direct calculation gives $f(0)=\\tfrac{1}{35}$, $f(1)=\\tfrac{12}{35}$, $f(2)=\\tfrac{18}{35}$, $f(3)=\\tfrac{4}{35}$.',
        },

        {
          text: '$\\mu=E(X)=(0)\\tfrac{1}{35}+(1)\\tfrac{12}{35}+(2)\\tfrac{18}{35}+(3)\\tfrac{4}{35}=\\tfrac{60}{35}=\\tfrac{12}{7}\\approx1.7$.',
        },

        {
          text: 'So a sample of $3$ drawn over and over from this lot contains, on average, $1.7$ good components — a value $X$ itself never actually takes.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-defective-parts-variance',

    chapter: 'expectation',

    topic: 'Variance and covariance',

    difficulty: 'medium',

    citation: 'Walpole §4.2, Example 4.9',

    instance: {
      prompt:
        'The number $X$ of defective parts for a machine when $3$ parts are sampled from a production line ' +
        'has distribution $f(0)=0.51$, $f(1)=0.38$, $f(2)=0.10$, $f(3)=0.01$. Using $\\sigma^2=E(X^2)-\\mu^2$, ' +
        'find the variance of $X$.',

      parts: [{ kind: 'numeric', answer: 0.4979, tol: 0.0005 }],

      solution: [
        {
          text: '$\\mu=(0)(0.51)+(1)(0.38)+(2)(0.10)+(3)(0.01)=0.61$.',
        },

        {
          text: '$E(X^2)=(0)(0.51)+(1)(0.38)+(4)(0.10)+(9)(0.01)=0.87$.',
        },

        {
          text: '$\\sigma^2=E(X^2)-\\mu^2=0.87-(0.61)^2=0.4979$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-pen-covariance',

    chapter: 'expectation',

    topic: 'Variance and covariance',

    difficulty: 'medium',

    citation: 'Walpole §4.2, Example 4.13',

    instance: {
      prompt:
        'For the two-pen joint distribution of Chapter 3 (blue refills $X$, red refills $Y$), $E(XY)=\\tfrac{3}{14}$, ' +
        '$\\mu_X=\\tfrac{3}{4}$ and $\\mu_Y=\\tfrac{1}{2}$. Find the covariance $\\sigma_{XY}$.',

      parts: [{ kind: 'numeric', answer: -9 / 56, tol: 0.002 }],

      solution: [
        {
          text: 'By Theorem 4.4, $\\sigma_{XY}=E(XY)-\\mu_X\\mu_Y$.',
        },

        {
          text: '$\\sigma_{XY}=\\dfrac{3}{14}-\\left(\\dfrac{3}{4}\\right)\\left(\\dfrac{1}{2}\\right)=\\dfrac{3}{14}-\\dfrac{3}{8}=-\\dfrac{9}{56}\\approx-0.161$.',
        },

        {
          text: 'The sign is negative: drawing more blue pens leaves fewer red ones available, so the two counts move in opposite directions.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-pen-correlation',

    chapter: 'expectation',

    topic: 'Variance and covariance',

    difficulty: 'hard',

    citation: 'Walpole §4.2, Example 4.15',

    instance: {
      prompt:
        'Continuing the two-pen example, $\\sigma_{XY}=-\\tfrac{9}{56}$, $\\sigma_X^2=\\tfrac{45}{112}$ and ' +
        '$\\sigma_Y^2=\\tfrac{9}{28}$. Which of these is the correlation coefficient $\\rho_{XY}$?',

      parts: [
        {
          kind: 'mcq',

          choices: [
            '$-\\dfrac{1}{\\sqrt{5}}\\approx-0.447$',

            '$-\\dfrac{9}{56}\\approx-0.161$',

            '$\\dfrac{1}{\\sqrt{5}}\\approx0.447$',

            '$-1$ (exact linear dependence)',
          ],

          answer: 0,
        },
      ],

      solution: [
        {
          text: 'By Definition 4.5, $\\rho_{XY}=\\dfrac{\\sigma_{XY}}{\\sigma_X\\sigma_Y}$.',
        },

        {
          text: '$\\sigma_X\\sigma_Y=\\sqrt{\\left(\\tfrac{45}{112}\\right)\\left(\\tfrac{9}{28}\\right)}$, so $\\rho_{XY}=\\dfrac{-9/56}{\\sqrt{(45/112)(9/28)}}=-\\dfrac{1}{\\sqrt{5}}\\approx-0.447$.',
        },

        {
          text: 'Unlike the covariance, $\\rho_{XY}$ is unit-free and bounded by $\\pm1$ — that is what makes it comparable across problems with different scales.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-linear-combination-variance',

    chapter: 'expectation',

    topic: 'Linear combinations',

    difficulty: 'medium',

    citation: 'Walpole §4.3, Example 4.22',

    instance: {
      prompt:
        'Random variables $X$ and $Y$ have variances $\\sigma_X^2=2$ and $\\sigma_Y^2=4$ and covariance ' +
        '$\\sigma_{XY}=-2$. Find the variance of $Z=3X-4Y+8$.',

      parts: [{ kind: 'numeric', answer: 130, tol: 0 }],

      solution: [
        {
          text: 'The constant $+8$ does not affect the variance (Corollary 4.7), so only $3X-4Y$ matters.',
        },

        {
          text: 'By Theorem 4.9 with $a=3$, $b=-4$: $\\sigma_Z^2=9\\sigma_X^2+16\\sigma_Y^2+2(3)(-4)\\sigma_{XY}$.',
        },

        {
          text: '$\\sigma_Z^2=(9)(2)+(16)(4)-(24)(-2)=18+64+48=130$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-chebyshev-true-false',

    chapter: 'expectation',

    topic: "Chebyshev's theorem",

    difficulty: 'easy',

    citation: 'Walpole §4.4, Theorem 4.10',

    instance: {
      prompt:
        'A random variable has mean $\\mu=8$ and variance $\\sigma^2=9$, but its distribution is otherwise ' +
        'unknown. True or false: Chebyshev\'s theorem guarantees $P(-4<X<20)\\ge\\tfrac{15}{16}$.',

      parts: [{ kind: 'tf', answer: true }],

      solution: [
        {
          text: 'Here $\\sigma=3$, and $-4=8-(4)(3)$ while $20=8+(4)(3)$, so the interval is exactly $\\mu\\pm k\\sigma$ with $k=4$.',
        },

        {
          text: 'Chebyshev\'s theorem gives $P(\\mu-k\\sigma<X<\\mu+k\\sigma)\\ge1-\\dfrac{1}{k^2}=1-\\dfrac{1}{16}=\\dfrac{15}{16}$.',
        },

        {
          text: 'The statement matches that guaranteed floor exactly, so it is true — though the actual probability could be higher; the theorem only promises "at least".',
        },
      ],
    },
  }),
];
