import type { QuestionTemplate } from '../types';

import { bookQuestion } from '../authoring';

export const ch05Book: QuestionTemplate[] = [
  bookQuestion({
    id: 'ch05-book-shock-test',

    chapter: 'discrete-distributions',

    topic: 'Binomial and multinomial',

    difficulty: 'easy',

    citation: 'Walpole Example 5.1',

    instance: {
      prompt:
        'The probability that a certain kind of component will survive a shock test is $3/4$. Find the ' +
        'probability that exactly 2 of the next 4 components tested survive.',

      parts: [{ kind: 'numeric', answer: 27 / 128, tol: 0.001 }],

      solution: [
        {
          text: 'Survival is independent across the 4 tests, each with the same chance $p=3/4$ — a binomial experiment with $n=4$.',
        },

        {
          text: '$b\\!\\left(2;4,\\tfrac34\\right)=\\binom{4}{2}\\left(\\tfrac34\\right)^2\\left(\\tfrac14\\right)^2=6\\cdot\\tfrac{9}{16}\\cdot\\tfrac{1}{16}=\\tfrac{27}{128}\\approx0.211$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-airport-runways',

    chapter: 'discrete-distributions',

    topic: 'Binomial and multinomial',

    difficulty: 'medium',

    citation: 'Walpole Example 5.7',

    instance: {
      prompt:
        'A commercial jet arriving at an airport with three runways uses runway 1, 2, or 3 with probabilities ' +
        '$p_1=2/9$, $p_2=1/6$, and $p_3=11/18$. Find the probability that among $6$ randomly arriving jets, ' +
        'runway 1 is used $2$ times, runway 2 is used $1$ time, and runway 3 is used $3$ times.',

      parts: [{ kind: 'numeric', answer: 0.1127, tol: 0.0005 }],

      solution: [
        {
          text: 'Each arrival lands on one of three runways rather than two, so this is a multinomial experiment with $n=6$.',
        },

        {
          text: '$f\\!\\left(2,1,3;\\,\\tfrac29,\\tfrac16,\\tfrac{11}{18},\\,6\\right)=\\dfrac{6!}{2!\\,1!\\,3!}\\left(\\tfrac29\\right)^2\\left(\\tfrac16\\right)^1\\left(\\tfrac{11}{18}\\right)^3\\approx0.1127$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-injection-device',

    chapter: 'discrete-distributions',

    topic: 'Hypergeometric',

    difficulty: 'easy',

    citation: 'Walpole Example 5.8',

    instance: {
      prompt:
        'A particular part used as an injection device is sold in lots of 10. A sampling plan tests 3 of the ' +
        '10 parts at random, without replacement, and accepts the lot if none of the 3 is defective. If the ' +
        'lot truly has 2 defective parts, find the probability the sampling plan accepts it.',

      parts: [{ kind: 'numeric', answer: 28 / 60, tol: 0.001 }],

      solution: [
        {
          text: 'Testing is without replacement from a lot of 10, so the count of defectives found is hypergeometric with $N=10$, $n=3$, $k=2$.',
        },

        {
          text: '$P(X=0)=h(0;10,3,2)=\\dfrac{\\binom{2}{0}\\binom{8}{3}}{\\binom{10}{3}}=\\dfrac{56}{120}\\approx0.467$.',
        },

        {
          text: 'A plan that accepts a truly bad lot almost half the time is a faulty plan — the probability alone tells you the sampling scheme needs redesigning.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-nba-championship',

    chapter: 'discrete-distributions',

    topic: 'Geometric and negative binomial',

    difficulty: 'hard',

    citation: 'Walpole Example 5.14',

    instance: {
      prompt:
        'In an NBA championship series, the first team to win 4 games out of 7 wins the series. Team A has ' +
        'probability $0.55$ of winning any single game over team B. What is the probability that team A wins ' +
        'the championship series?',

      parts: [
        {
          kind: 'mcq',

          choices: ['0.1853', '0.4500', '0.6083', '0.9085'],

          answer: 2,
        },
      ],

      solution: [
        {
          text: 'Team A wins the series on game $x=4,5,6,$ or $7$ — the trial on which its 4th win lands — so $X$ is negative binomial with $k=4$, $p=0.55$.',
        },

        {
          text: '$P(\\text{A wins}) = b^*(4;4,0.55)+b^*(5;4,0.55)+b^*(6;4,0.55)+b^*(7;4,0.55)$.',
        },

        {
          text: '$=0.0915+0.1647+0.1853+0.1668=0.6083$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-radioactive-counter',

    chapter: 'discrete-distributions',

    topic: 'Poisson',

    difficulty: 'medium',

    citation: 'Walpole Example 5.17',

    instance: {
      prompt:
        'During a laboratory experiment, the average number of radioactive particles passing through a ' +
        'counter in 1 millisecond is 4. What is the probability that 6 particles enter the counter in a given ' +
        'millisecond?',

      parts: [{ kind: 'numeric', answer: 0.1042, tol: 0.0005 }],

      solution: [
        {
          text: 'The rate is already scaled to the interval asked about, so $\\lambda t=4$.',
        },

        {
          text: '$p(6;4)=\\dfrac{e^{-4}4^6}{6!}\\approx0.1042$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-oil-tankers',

    chapter: 'discrete-distributions',

    topic: 'Poisson',

    difficulty: 'hard',

    citation: 'Walpole Example 5.18',

    instance: {
      prompt:
        'On average, 10 oil tankers arrive each day at a certain port, whose facilities can handle at most 15 ' +
        'tankers per day. The probability that tankers must be turned away on a given day is $0.0487$. Is it ' +
        'more likely than not that tankers will be turned away on any given day?',

      parts: [{ kind: 'tf', answer: false }],

      solution: [
        {
          text: 'Let $X$ be the number of tankers arriving in a day; $X$ is Poisson with $\\lambda t=10$.',
        },

        {
          text: '$P(X>15)=1-P(X\\le15)=1-0.9513=0.0487$.',
        },

        {
          text: 'A probability of $0.0487$ is well under $0.5$, so it is **not** more likely than not — tankers are turned away on fewer than 1 day in 20, on average.',
        },
      ],
    },
  }),
];
