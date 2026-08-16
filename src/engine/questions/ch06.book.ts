import type { QuestionTemplate } from '../types';

import { bookQuestion } from '../authoring';

export const ch06Book: QuestionTemplate[] = [
  bookQuestion({
    id: 'ch06-book-conference-room',

    chapter: 'continuous-distributions',

    topic: 'Continuous uniform',

    difficulty: 'easy',

    citation: 'Walpole Example 6.1',

    instance: {
      prompt:
        'A large conference room at a certain company can be reserved for no more than 4 hours. Both long and ' +
        'short conferences occur quite often. The length $X$ of a conference has a uniform distribution on ' +
        'the interval $[0,4]$. What is the probability that any given conference lasts at least 3 hours?',

      parts: [{ kind: 'numeric', answer: 0.25, tol: 0.0005 }],

      solution: [
        {
          text: 'The density is $f(x)=\\tfrac14$ on $[0,4]$, so a probability is just the length of the sub-interval divided by 4.',
        },

        {
          text: '$P(X\\ge3)=\\displaystyle\\int_3^4\\tfrac14\\,dx=\\tfrac14$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-standard-normal-area',

    chapter: 'continuous-distributions',

    topic: 'Normal distribution',

    difficulty: 'easy',

    citation: 'Walpole Example 6.2',

    instance: {
      prompt: 'Given a standard normal distribution, find the area under the curve that lies between $z=-1.97$ and $z=0.86$.',

      parts: [{ kind: 'numeric', answer: 0.7807, tol: 0.0005 }],

      solution: [
        {
          text: 'The area between two z values is the difference of their areas to the left: $P(Z<0.86)-P(Z<-1.97)$.',
        },

        {
          text: 'From Table A.3, $0.8051-0.0244=0.7807$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-normal-between',

    chapter: 'continuous-distributions',

    topic: 'Normal distribution',

    difficulty: 'medium',

    citation: 'Walpole Example 6.4',

    instance: {
      prompt:
        'A random variable $X$ has a normal distribution with $\\mu=50$ and $\\sigma=10$. Find the probability ' +
        'that $X$ assumes a value between 45 and 62.',

      parts: [{ kind: 'numeric', answer: 0.5764, tol: 0.0005 }],

      solution: [
        {
          text: 'Standardize both endpoints: $z_1=\\dfrac{45-50}{10}=-0.5$ and $z_2=\\dfrac{62-50}{10}=1.2$.',
        },

        {
          text: '$P(45<X<62)=P(-0.5<Z<1.2)=P(Z<1.2)-P(Z<-0.5)=0.8849-0.3085=0.5764$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-ball-bearing-scrap',

    chapter: 'continuous-distributions',

    topic: 'Applications of the normal distribution',

    difficulty: 'medium',

    citation: 'Walpole Example 6.9',

    instance: {
      prompt:
        'A ball bearing diameter must fall within the specification $3.0\\pm0.01$ cm to be accepted. The diameter ' +
        'is normally distributed with $\\mu=3.0$ and $\\sigma=0.005$. What proportion of manufactured ball ' +
        'bearings will be scrapped, on average?',

      parts: [{ kind: 'numeric', answer: 0.0456, tol: 0.0005 }],

      solution: [
        {
          text: 'The acceptance limits $x_1=2.99$ and $x_2=3.01$ give $z_1=-2.0$ and $z_2=2.0$.',
        },

        {
          text: 'By symmetry, $P(Z<-2.0)+P(Z>2.0)=2(0.0228)=0.0456$ — 4.56% of bearings will be scrapped.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-exam-grade-curve',

    chapter: 'continuous-distributions',

    topic: 'Applications of the normal distribution',

    difficulty: 'hard',

    citation: 'Walpole Example 6.13',

    instance: {
      prompt:
        'The average grade for an exam is 74, and the standard deviation is 7. If 12% of the class is given As, ' +
        'and grades are curved to follow a normal distribution, find the lowest possible score that earns an A ' +
        '(rounded to the nearest whole number).',

      parts: [
        {
          kind: 'mcq',

          choices: ['79', '81', '83', '86'],

          answer: 2,
        },
      ],

      solution: [
        {
          text: 'The 12% of students with the highest grades leaves 0.88 of the area to the left of the cutoff, so we need $z$ with $P(Z<z)=0.88$: from Table A.3, $z\\approx1.18$.',
        },

        {
          text: '$x=(7)(1.18)+74=82.26$, so the lowest possible A is 83.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-normal-approx-binomial-recovery',

    chapter: 'continuous-distributions',

    topic: 'Normal approximation to the binomial',

    difficulty: 'medium',

    citation: 'Walpole Example 6.15',

    instance: {
      prompt:
        'The probability that a patient recovers from a rare blood disease is 0.4. If 100 people are known to ' +
        'have contracted this disease, what is the probability that fewer than 30 survive?',

      parts: [{ kind: 'numeric', answer: 0.0162, tol: 0.0005 }],

      solution: [
        {
          text: '$\\mu=np=(100)(0.4)=40$ and $\\sigma=\\sqrt{npq}=\\sqrt{(100)(0.4)(0.6)}=4.899$.',
        },

        {
          text: 'With the continuity correction, $z=\\dfrac{29.5-40}{4.899}=-2.14$, so $P(X<30)\\approx P(Z<-2.14)=0.0162$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-exponential-components',

    chapter: 'continuous-distributions',

    topic: 'Exponential distribution',

    difficulty: 'hard',

    citation: 'Walpole Example 6.17',

    instance: {
      prompt:
        'A system component has time to failure $T$ modeled by an exponential distribution with mean $\\beta=5$ ' +
        'years. If 5 of these components are installed in different systems, what is the probability that at ' +
        'least 2 are still functioning at the end of 8 years?',

      // The book rounds P(T>8)=e^{-1.6} to 0.2 before entering the binomial
      // table; carrying the exact value instead gives 0.2666. The tolerance
      // admits both paths, as ch06-book-weibull already does for Example 6.24.
      parts: [{ kind: 'numeric', answer: 0.2627, tol: 0.005 }],

      solution: [
        {
          text: 'A single component survives past 8 years with probability $P(T>8)=e^{-8/5}\\approx0.2$.',
        },

        {
          text: 'The count of survivors among 5 is binomial with $p=0.2$: $P(X\\ge2)=1-\\sum_{x=0}^1 b(x;5,0.2)=1-0.7373=0.2627$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-washing-machine-repair',

    chapter: 'continuous-distributions',

    topic: 'Exponential distribution',

    difficulty: 'medium',

    citation: 'Walpole Example 6.21',

    instance: {
      prompt:
        'The time $Y$, in years, before a washing machine needs a major repair is exponential with mean 4 years. ' +
        'What is $P(Y>6)$, the probability it goes at least 6 years without a major repair?',

      parts: [{ kind: 'numeric', answer: 0.2231, tol: 0.0005 }],

      solution: [
        {
          text: 'The exponential cdf is $F(y)=1-e^{-y/\\beta}$, so $P(Y>6)=1-F(6)=e^{-6/4}=e^{-1.5}\\approx0.2231$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-weibull-machine-shop',

    chapter: 'continuous-distributions',

    topic: 'Weibull distribution',

    difficulty: 'medium',

    citation: 'Walpole Example 6.24',

    instance: {
      prompt:
        'The length of life $X$, in hours, of an item in a machine shop has a Weibull distribution with ' +
        '$\\alpha=0.01$ and $\\beta=2$. What is the probability that it fails before eight hours of usage?',

      parts: [{ kind: 'numeric', answer: 0.473, tol: 0.001 }],

      solution: [
        {
          text: 'The Weibull cdf is $F(t)=1-e^{-\\alpha t^\\beta}$.',
        },

        {
          text: '$P(X<8)=F(8)=1-e^{-(0.01)(8)^2}=1-e^{-0.64}\\approx1-0.527=0.473$.',
        },
      ],
    },
  }),
];
