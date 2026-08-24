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

  bookQuestion({
    id: 'ch03-book-blemish-sample-space',

    chapter: 'random-variables',

    topic: 'Random variables',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.2',

    instance: {
      prompt:
        'An overseas shipment of $5$ foreign automobiles contains $2$ that have slight paint blemishes. ' +
        'An agency receives $3$ of these automobiles at random, and $X$ is the number of blemished cars ' +
        'among the three. Find $P(X=1)$ and $P(X=2)$.',

      parts: [
        { kind: 'numeric', label: 'P(X = 1)', answer: 0.6, tol: 0.0005 },

        { kind: 'numeric', label: 'P(X = 2)', answer: 0.3, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'There are $\\binom{5}{3}=10$ equally likely ways to receive $3$ of the $5$ cars.',
        },

        {
          text: '$X=1$ means $1$ of the $2$ blemished and $2$ of the $3$ unblemished: $\\binom{2}{1}\\binom{3}{2}=6$, so $P(X=1)=\\tfrac{6}{10}=0.6$.',
        },

        {
          text: '$X=2$ means both blemished cars and $1$ unblemished: $\\binom{2}{2}\\binom{3}{1}=3$, so $P(X=2)=\\tfrac{3}{10}=0.3$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-heads-minus-tails',

    chapter: 'random-variables',

    topic: 'Random variables',

    difficulty: 'easy',

    citation: 'Walpole Exercise 3.3',

    instance: {
      prompt:
        'A fair coin is tossed three times. Let $W$ be the number of heads minus the number of tails. ' +
        'Find $P(W=1)$ and $P(W=-3)$.',

      parts: [
        { kind: 'numeric', label: 'P(W = 1)', answer: 0.375, tol: 0.0005 },

        { kind: 'numeric', label: 'P(W = -3)', answer: 0.125, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'Each of the $8$ equally likely outcomes assigns a value of $W$: $HHH\\to3$, $HHT,HTH,THH\\to1$, $HTT,THT,TTH\\to-1$, $TTT\\to-3$.',
        },

        {
          text: '$W=1$ happens for $3$ of the $8$ outcomes, so $P(W=1)=\\tfrac{3}{8}=0.375$.',
        },

        {
          text: '$W=-3$ happens only for $TTT$, so $P(W=-3)=\\tfrac{1}{8}=0.125$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-quadratic-pmf-constant',

    chapter: 'random-variables',

    topic: 'Discrete distributions',

    difficulty: 'easy',

    citation: 'Walpole Exercise 3.5(a)',

    instance: {
      prompt:
        'Determine the value $c$ so that $f(x)=c(x^2+4)$ for $x=0,1,2,3$ can serve as the probability ' +
        'mass function of a discrete random variable $X$. Then find $f(3)$.',

      parts: [
        { kind: 'numeric', label: 'c', answer: 1 / 30, tol: 0.0005 },

        { kind: 'numeric', label: 'f(3)', answer: 13 / 30, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'A pmf must sum to $1$: $\\sum_{x=0}^{3}(x^2+4)=4+5+8+13=30$, so $c=\\tfrac{1}{30}\\approx0.0333$.',
        },

        {
          text: '$f(3)=c(9+4)=\\tfrac{13}{30}\\approx0.4333$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-biased-coin-w',

    chapter: 'random-variables',

    topic: 'Discrete distributions',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.8',

    instance: {
      prompt:
        'Rework the coin-tossing problem of Exercise 3.3 ($W$ = heads minus tails in three tosses), but ' +
        'now the coin is biased so that a head is twice as likely as a tail, $P(H)=\\tfrac23$. Find $f(1)$ ' +
        'and $f(-3)$.',

      parts: [
        { kind: 'numeric', label: 'f(1)', answer: 4 / 9, tol: 0.0005 },

        { kind: 'numeric', label: 'f(-3)', answer: 1 / 27, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'Each outcome now carries a different weight: $P(H)=\\tfrac23$, $P(T)=\\tfrac13$, independent across the three tosses.',
        },

        {
          text: '$W=1$ happens for $HHT,HTH,THH$, each with probability $\\left(\\tfrac23\\right)^2\\tfrac13=\\tfrac{4}{27}$, so $f(1)=3\\cdot\\tfrac{4}{27}=\\tfrac{4}{9}\\approx0.4444$.',
        },

        {
          text: '$W=-3$ happens only for $TTT$, with probability $\\left(\\tfrac13\\right)^3=\\tfrac{1}{27}\\approx0.0370$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-tv-defectives-pmf',

    chapter: 'random-variables',

    topic: 'Discrete distributions',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.11',

    instance: {
      prompt:
        'A shipment of $7$ television sets contains $2$ defective sets. A hotel makes a random purchase ' +
        'of $3$ of the sets. Let $X$ be the number of defective sets purchased. Find $f(0)$ and $f(2)$.',

      parts: [
        { kind: 'numeric', label: 'f(0)', answer: 10 / 35, tol: 0.0005 },

        { kind: 'numeric', label: 'f(2)', answer: 5 / 35, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'There are $\\binom{7}{3}=35$ equally likely purchases, so $f(x)=\\dfrac{\\binom{2}{x}\\binom{5}{3-x}}{35}$.',
        },

        {
          text: '$f(0)=\\dfrac{\\binom{2}{0}\\binom{5}{3}}{35}=\\dfrac{10}{35}\\approx0.2857$.',
        },

        {
          text: '$f(2)=\\dfrac{\\binom{2}{2}\\binom{5}{1}}{35}=\\dfrac{5}{35}\\approx0.1429$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-tv-defectives-cdf',

    chapter: 'random-variables',

    topic: 'Discrete distributions',

    difficulty: 'hard',

    citation: 'Walpole Exercise 3.15',

    instance: {
      prompt:
        'Using the probability distribution of Exercise 3.11 (a shipment of $7$ televisions with $2$ ' +
        'defective, a hotel buying $3$), construct the cumulative distribution function of $X$, the number ' +
        'of defectives purchased, and use it to find $P(X=1)$ and $P(0<X\\le2)$.',

      parts: [
        { kind: 'numeric', label: 'P(X = 1)', answer: 4 / 7, tol: 0.0005 },

        { kind: 'numeric', label: 'P(0 < X <= 2)', answer: 5 / 7, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'From Exercise 3.11, $f(0)=\\tfrac{2}{7}$, $f(1)=\\tfrac{4}{7}$, $f(2)=\\tfrac{1}{7}$, so $F(0)=\\tfrac27$, $F(1)=\\tfrac67$, $F(2)=1$.',
        },

        {
          text: '$P(X=1)=F(1)-F(0)=\\tfrac67-\\tfrac27=\\tfrac47\\approx0.5714$.',
        },

        {
          text: '$P(0<X\\le2)=F(2)-F(0)=1-\\tfrac27=\\tfrac57\\approx0.7143$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-fabric-imperfections-cdf',

    chapter: 'random-variables',

    topic: 'Discrete distributions',

    difficulty: 'easy',

    citation: 'Walpole Exercise 3.13',

    instance: {
      prompt:
        'The number of imperfections per $10$ metres of a synthetic fabric, $X$, has probability ' +
        'distribution $f(0)=0.41$, $f(1)=0.37$, $f(2)=0.16$, $f(3)=0.05$, $f(4)=0.01$. Construct the ' +
        'cumulative distribution function and find $F(2)$ and $F(3)$.',

      parts: [
        { kind: 'numeric', label: 'F(2)', answer: 0.94, tol: 0.0005 },

        { kind: 'numeric', label: 'F(3)', answer: 0.99, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'The CDF accumulates the pmf in order: $F(0)=0.41$, $F(1)=0.78$, $F(2)=0.94$, $F(3)=0.99$, $F(4)=1.00$.',
        },

        {
          text: 'So $F(2)=0.41+0.37+0.16=0.94$ and $F(3)=F(2)+0.05=0.99$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-jazz-cds',

    chapter: 'random-variables',

    topic: 'Discrete distributions',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.24',

    instance: {
      prompt:
        'A collection of $10$ CDs has $5$ jazz, $2$ classical, and $3$ rock. Four CDs are selected at ' +
        'random. Let $X$ be the number of jazz CDs selected. Find a formula for $f(x)$, and use it to find ' +
        '$f(2)$ and $f(4)$.',

      parts: [
        { kind: 'numeric', label: 'f(2)', answer: 100 / 210, tol: 0.0005 },

        { kind: 'numeric', label: 'f(4)', answer: 5 / 210, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'The $5$ non-jazz CDs (classical and rock together) can be treated as one pool of $5$: choose $x$ of the $5$ jazz CDs and $4-x$ of the $5$ non-jazz, so $f(x)=\\dfrac{\\binom{5}{x}\\binom{5}{4-x}}{\\binom{10}{4}}$ for $x=0,1,2,3,4$.',
        },

        {
          text: '$f(2)=\\dfrac{\\binom{5}{2}\\binom{5}{2}}{210}=\\dfrac{10\\cdot10}{210}=\\dfrac{100}{210}\\approx0.4762$.',
        },

        {
          text: '$f(4)=\\dfrac{\\binom{5}{4}\\binom{5}{0}}{210}=\\dfrac{5\\cdot1}{210}=\\dfrac{5}{210}\\approx0.0238$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-dimes-nickels',

    chapter: 'random-variables',

    topic: 'Discrete distributions',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.25',

    instance: {
      prompt:
        'A box contains $4$ dimes and $2$ nickels. Three coins are selected at random without replacement. ' +
        'Let $T$ be the total value of the three coins, in cents. Find $P(T=20)$ and $P(T=25)$.',

      parts: [
        { kind: 'numeric', label: 'P(T = 20)', answer: 0.2, tol: 0.0005 },

        { kind: 'numeric', label: 'P(T = 25)', answer: 0.6, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'There are $\\binom{6}{3}=20$ equally likely selections. $T=20$ needs $1$ dime and $2$ nickels, $T=25$ needs $2$ dimes and $1$ nickel, $T=30$ needs $3$ dimes.',
        },

        {
          text: '$P(T=20)=\\dfrac{\\binom{4}{1}\\binom{2}{2}}{20}=\\dfrac{4}{20}=0.2$.',
        },

        {
          text: '$P(T=25)=\\dfrac{\\binom{4}{2}\\binom{2}{1}}{20}=\\dfrac{12}{20}=0.6$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-green-balls-replacement',

    chapter: 'random-variables',

    topic: 'Discrete distributions',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.26',

    instance: {
      prompt:
        'A box contains $4$ black balls and $2$ green balls. Three balls are drawn in succession, each ' +
        'replaced before the next draw. Let $X$ be the number of green balls drawn. Find $f(1)$ and $f(3)$.',

      parts: [
        { kind: 'numeric', label: 'f(1)', answer: 4 / 9, tol: 0.0005 },

        { kind: 'numeric', label: 'f(3)', answer: 1 / 27, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'With replacement, each draw is an independent trial with $P(\\text{green})=\\tfrac13$: $X$ is binomial, $f(x)=\\binom{3}{x}\\left(\\tfrac13\\right)^x\\left(\\tfrac23\\right)^{3-x}$.',
        },

        {
          text: '$f(1)=\\binom{3}{1}\\tfrac13\\left(\\tfrac23\\right)^2=3\\cdot\\tfrac13\\cdot\\tfrac49=\\tfrac49\\approx0.4444$.',
        },

        {
          text: '$f(3)=\\left(\\tfrac13\\right)^3=\\tfrac1{27}\\approx0.0370$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-magnetron-tubes',

    chapter: 'random-variables',

    topic: 'Discrete distributions',

    difficulty: 'hard',

    citation: 'Walpole Exercise 3.34',

    instance: {
      prompt:
        'Magnetron tubes meet length specification with probability $0.99$ per tube, independently. In a ' +
        'sample of $5$ tubes, let $Y$ be the number meeting specification, $f(y)=\\binom{5}{y}(0.99)^y(0.01)^{5-y}$. ' +
        'Find $f(5)$ and $f(3)$, and decide whether observing $3$ tubes outside spec (so $Y=2$) among $5$ ' +
        'supports the $0.99$ claim.',

      parts: [
        { kind: 'numeric', label: 'f(5)', answer: 0.95099, tol: 0.0005 },

        { kind: 'numeric', label: 'f(3)', answer: 0.00097, tol: 0.00005 },

        { kind: 'tf', label: 'observing 3 failures in 5 supports P = 0.99', answer: false },
      ],

      solution: [
        {
          text: '$f(5)=(0.99)^5\\approx0.9510$: under the claimed rate, nearly all samples of $5$ pass entirely.',
        },

        {
          text: '$f(3)=\\binom{5}{3}(0.99)^3(0.01)^2\\approx0.00097$ — already vanishingly small.',
        },

        {
          text: '$Y=2$ (three failures) is far rarer still, so seeing it happen is strong evidence *against* $P(\\text{meets spec})=0.99$, not support for it.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-radar-poisson',

    chapter: 'random-variables',

    topic: 'Discrete distributions',

    difficulty: 'hard',

    citation: 'Walpole Exercise 3.35',

    instance: {
      prompt:
        'The number of cars $X$ arriving at an intersection during a $20$-second period has probability ' +
        'distribution $f(x)=e^{-6}6^x/x!$, for $x=0,1,2,\\dots$. Find $P(X>8)$ and $P(X=2)$.',

      parts: [
        { kind: 'numeric', label: 'P(X > 8)', answer: 0.1528, tol: 0.0005 },

        { kind: 'numeric', label: 'P(X = 2)', answer: 0.0446, tol: 0.0005 },
      ],

      solution: [
        {
          text: '$P(X>8)=1-\\sum_{x=0}^{8}f(x)\\approx1-0.8472=0.1528$.',
        },

        {
          text: '$f(2)=e^{-6}\\dfrac{6^2}{2!}=18e^{-6}\\approx0.0446$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-airbag-cdf',

    chapter: 'random-variables',

    topic: 'Discrete distributions',

    difficulty: 'medium',

    citation: 'Walpole Examples 3.9–3.10',

    instance: {
      prompt:
        'A car agency sells $50\\%$ of its inventory with side airbags. Of the next $4$ cars sold, let $X$ ' +
        'be the number equipped with airbags, so $f(x)=\\binom{4}{x}/16$ for $x=0,1,2,3,4$. Find $F(2)$, and ' +
        'use it to recover $f(2)$.',

      parts: [
        { kind: 'numeric', label: 'F(2)', answer: 11 / 16, tol: 0.0005 },

        { kind: 'numeric', label: 'f(2)', answer: 0.375, tol: 0.0005 },
      ],

      solution: [
        {
          text: '$F(2)=f(0)+f(1)+f(2)=\\tfrac{1}{16}+\\tfrac{4}{16}+\\tfrac{6}{16}=\\tfrac{11}{16}\\approx0.6875$.',
        },

        {
          text: '$f(2)=F(2)-F(1)=\\tfrac{11}{16}-\\tfrac{5}{16}=\\tfrac{6}{16}=0.375$, matching $\\binom{4}{2}/16$ directly.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-solicitation-density',

    chapter: 'random-variables',

    topic: 'Continuous distributions',

    difficulty: 'easy',

    citation: 'Walpole Exercise 3.9',

    instance: {
      prompt:
        'The proportion of people responding to a mail-order solicitation, $X$, has density ' +
        '$f(x)=\\dfrac{2(x+2)}{5}$ for $0<x<1$. Show that the total area under $f$ is $1$, and find ' +
        '$P(1/4<X<1/2)$.',

      parts: [
        { kind: 'numeric', label: 'total area', answer: 1, tol: 0.0005 },

        { kind: 'numeric', label: 'P(1/4 < X < 1/2)', answer: 0.2375, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'An antiderivative is $\\dfrac{x^2+4x}{5}$, so $\\int_0^1 f(x)\\,dx=\\dfrac{1+4}{5}=1$.',
        },

        {
          text: '$P(1/4<X<1/2)=\\dfrac{(0.5)^2+4(0.5)}{5}-\\dfrac{(0.25)^2+4(0.25)}{5}\\approx0.2375$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-radar-waiting-time',

    chapter: 'random-variables',

    topic: 'Continuous distributions',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.14',

    instance: {
      prompt:
        'The waiting time in hours between successive speeders spotted by a radar unit has cumulative ' +
        'distribution function $F(x)=1-e^{-8x}$ for $x\\ge0$. Find the probability of waiting less than $12$ ' +
        'minutes ($0.2$ hours) two ways: (a) using $F(x)$ directly, (b) by integrating the density $f(x)$ ' +
        'from $0$ to $0.2$.',

      parts: [
        { kind: 'numeric', label: 'via F(x)', answer: 0.7981, tol: 0.0005 },

        { kind: 'numeric', label: 'via integrating f(x)', answer: 0.7981, tol: 0.0005 },
      ],

      solution: [
        {
          text: '(a) $P(X<0.2)=F(0.2)=1-e^{-1.6}\\approx0.7981$.',
        },

        {
          text: '(b) $f(x)=F\'(x)=8e^{-8x}$, so $\\int_0^{0.2}8e^{-8x}\\,dx=\\left[-e^{-8x}\\right]_0^{0.2}=1-e^{-1.6}\\approx0.7981$ — the same number, as it must be.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-uniform-basic',

    chapter: 'random-variables',

    topic: 'Continuous distributions',

    difficulty: 'easy',

    citation: 'Walpole Exercises 3.17, 3.19',

    instance: {
      prompt:
        'A continuous random variable $X$ on $1<x<3$ has density $f(x)=\\tfrac12$. Find $P(2<X<2.5)$ and ' +
        '$P(X\\le1.6)$.',

      parts: [
        { kind: 'numeric', label: 'P(2 < X < 2.5)', answer: 0.25, tol: 0.0005 },

        { kind: 'numeric', label: 'P(X <= 1.6)', answer: 0.3, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'The density is constant, so a probability is $\\tfrac12$ times the interval length.',
        },

        {
          text: '$P(2<X<2.5)=\\tfrac12(2.5-2)=0.25$.',
        },

        {
          text: '$P(X\\le1.6)=\\tfrac12(1.6-1)=0.3$ — equivalently $F(x)=\\tfrac{x-1}{2}$, and $F(1.6)=0.3$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-linear-density-2to5',

    chapter: 'random-variables',

    topic: 'Continuous distributions',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.18',

    instance: {
      prompt:
        'A continuous random variable $X$ on $2<x<5$ has density $f(x)=\\dfrac{2(1+x)}{27}$. Find $P(X<4)$ ' +
        'and $P(3\\le X<4)$.',

      parts: [
        { kind: 'numeric', label: 'P(X < 4)', answer: 0.5926, tol: 0.0005 },

        { kind: 'numeric', label: 'P(3 <= X < 4)', answer: 0.3333, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'An antiderivative of $f$ is $\\dfrac{x^2+2x}{27}$, so $P(X<4)=\\left.\\dfrac{x^2+2x}{27}\\right|_2^4=\\dfrac{24-8}{27}\\approx0.5926$.',
        },

        {
          text: '$P(3\\le X<4)=\\left.\\dfrac{x^2+2x}{27}\\right|_3^4=\\dfrac{24-15}{27}\\approx0.3333$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-linear-cdf-2to5',

    chapter: 'random-variables',

    topic: 'Continuous distributions',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.20',

    instance: {
      prompt:
        'For the density $f(x)=\\dfrac{2(1+x)}{27}$ on $2<x<5$ of the previous problem, find $F(x)$, and use ' +
        'it to evaluate $F(3)$ and $P(3\\le X<4)$.',

      parts: [
        { kind: 'numeric', label: 'F(3)', answer: 0.2593, tol: 0.0005 },

        { kind: 'numeric', label: 'P(3 <= X < 4)', answer: 0.3333, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'Integrating from the left end, $F(x)=\\dfrac{x^2+2x-8}{27}$ for $2\\le x<5$.',
        },

        {
          text: '$F(3)=\\dfrac{9+6-8}{27}=\\dfrac{7}{27}\\approx0.2593$.',
        },

        {
          text: '$P(3\\le X<4)=F(4)-F(3)=\\dfrac{16}{27}-\\dfrac{7}{27}=\\dfrac{9}{27}\\approx0.3333$, matching the direct integral.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-sqrt-density',

    chapter: 'random-variables',

    topic: 'Continuous distributions',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.21',

    instance: {
      prompt:
        'A continuous random variable has density $f(x)=k\\sqrt{x}$ for $0<x<1$. Evaluate $k$, and find ' +
        '$P(0.3<X<0.6)$.',

      parts: [
        { kind: 'numeric', label: 'k', answer: 1.5, tol: 0.0005 },

        { kind: 'numeric', label: 'P(0.3 < X < 0.6)', answer: 0.3004, tol: 0.0005 },
      ],

      solution: [
        {
          text: '$\\int_0^1 k\\sqrt{x}\\,dx=\\tfrac23k=1$, so $k=\\tfrac32$.',
        },

        {
          text: '$F(x)=\\tfrac32\\cdot\\tfrac23x^{3/2}=x^{3/2}$, so $P(0.3<X<0.6)=0.6^{1.5}-0.3^{1.5}\\approx0.3004$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-dvd-reliability',

    chapter: 'random-variables',

    topic: 'Continuous distributions',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.27',

    instance: {
      prompt:
        'The time to failure, in hours, of a DVD-player component has density $f(x)=\\dfrac{1}{2000}e^{-x/2000}$ ' +
        'for $x\\ge0$. Find the probability the component lasts more than $1000$ hours, and the probability ' +
        'it fails before $2000$ hours.',

      parts: [
        { kind: 'numeric', label: 'P(X > 1000)', answer: 0.6065, tol: 0.0005 },

        { kind: 'numeric', label: 'P(X < 2000)', answer: 0.6321, tol: 0.0005 },
      ],

      solution: [
        {
          text: '$F(x)=1-e^{-x/2000}$, so $P(X>1000)=e^{-0.5}\\approx0.6065$.',
        },

        {
          text: '$P(X<2000)=F(2000)=1-e^{-1}\\approx0.6321$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-particle-size',

    chapter: 'random-variables',

    topic: 'Continuous distributions',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.29',

    instance: {
      prompt:
        'The particle size (in micrometres) of a solid missile fuel has density $f(x)=3x^{-4}$ for $x>1$. ' +
        'Verify $f$ is a valid density (state the total area), and find the probability a random particle ' +
        'exceeds $4$ micrometres.',

      parts: [
        { kind: 'numeric', label: 'total area', answer: 1, tol: 0.0005 },

        { kind: 'numeric', label: 'P(X > 4)', answer: 0.015625, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'An antiderivative is $-x^{-3}$, so $\\int_1^{\\infty}3x^{-4}\\,dx=\\left[-x^{-3}\\right]_1^{\\infty}=0-(-1)=1$.',
        },

        {
          text: '$F(x)=1-x^{-3}$, so $P(X>4)=4^{-3}=\\dfrac{1}{64}\\approx0.0156$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-measurement-error',

    chapter: 'random-variables',

    topic: 'Continuous distributions',

    difficulty: 'hard',

    citation: 'Walpole Exercise 3.30',

    instance: {
      prompt:
        'A measurement error $X$ has density $f(x)=k(3-x^2)$ for $-1\\le x\\le1$. Find $k$, the probability ' +
        'the error is less than $\\tfrac12$, and the probability the magnitude of the error exceeds $0.8$.',

      parts: [
        { kind: 'numeric', label: 'k', answer: 0.1875, tol: 0.0005 },

        { kind: 'numeric', label: 'P(X < 0.5)', answer: 0.7734, tol: 0.0005 },

        { kind: 'numeric', label: 'P(|X| > 0.8)', answer: 0.164, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'An antiderivative of $3-x^2$ is $3x-\\tfrac{x^3}{3}$; over $[-1,1]$ that totals $\\tfrac{16}{3}$, so $k=\\tfrac{3}{16}=0.1875$.',
        },

        {
          text: '$P(X<0.5)=k\\left[3x-\\tfrac{x^3}{3}\\right]_{-1}^{0.5}\\approx0.7734$.',
        },

        {
          text: 'By symmetry, $P(|X|>0.8)=2k\\left[3x-\\tfrac{x^3}{3}\\right]_{0.8}^{1}\\approx0.164$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-washer-repair',

    chapter: 'random-variables',

    topic: 'Continuous distributions',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.31',

    instance: {
      prompt:
        'The time $Y$ in years before a washing machine needs a major repair has density $f(y)=\\tfrac14e^{-y/4}$ ' +
        'for $y\\ge0$. Find $P(Y>6)$ and $P(Y<1)$.',

      parts: [
        { kind: 'numeric', label: 'P(Y > 6)', answer: 0.2231, tol: 0.0005 },

        { kind: 'numeric', label: 'P(Y < 1)', answer: 0.2212, tol: 0.0005 },
      ],

      solution: [
        {
          text: '$F(y)=1-e^{-y/4}$, so $P(Y>6)=e^{-1.5}\\approx0.2231$.',
        },

        {
          text: '$P(Y<1)=1-e^{-0.25}\\approx0.2212$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-budget-proportion',

    chapter: 'random-variables',

    topic: 'Continuous distributions',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.32',

    instance: {
      prompt:
        'The proportion $Y$ of a firm\'s budget spent on pollution control has density $f(y)=5(1-y)^4$ for ' +
        '$0\\le y\\le1$. Verify $f$ is valid by checking $F(1)$, and find $P(Y<0.1)$ and $P(Y>0.5)$.',

      parts: [
        { kind: 'numeric', label: 'F(1)', answer: 1, tol: 0.0005 },

        { kind: 'numeric', label: 'P(Y < 0.1)', answer: 0.4095, tol: 0.0005 },

        { kind: 'numeric', label: 'P(Y > 0.5)', answer: 0.03125, tol: 0.0005 },
      ],

      solution: [
        {
          text: '$F(y)=1-(1-y)^5$, so $F(1)=1$, confirming the total area is $1$.',
        },

        {
          text: '$P(Y<0.1)=F(0.1)=1-(0.9)^5\\approx0.4095$.',
        },

        {
          text: '$P(Y>0.5)=1-F(0.5)=(0.5)^5\\approx0.03125$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-lab-triangular-density',

    chapter: 'random-variables',

    topic: 'Continuous distributions',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.36',

    instance: {
      prompt:
        'On a lab assignment, if the equipment is working, the observed outcome $X$ has density ' +
        '$f(x)=2(1-x)$ for $0<x<1$. Find $P(X\\le\\tfrac13)$, $P(X>0.5)$, and $P(X<0.75\\mid X\\ge0.5)$.',

      parts: [
        { kind: 'numeric', label: 'P(X <= 1/3)', answer: 0.5556, tol: 0.0005 },

        { kind: 'numeric', label: 'P(X > 0.5)', answer: 0.25, tol: 0.0005 },

        { kind: 'numeric', label: 'P(X < 0.75 | X >= 0.5)', answer: 0.75, tol: 0.0005 },
      ],

      solution: [
        {
          text: '$F(x)=2x-x^2$, so $P(X\\le\\tfrac13)=F(\\tfrac13)=\\tfrac23-\\tfrac19=\\tfrac59\\approx0.5556$.',
        },

        {
          text: '$P(X>0.5)=1-F(0.5)=1-0.75=0.25$.',
        },

        {
          text: '$P(X<0.75\\mid X\\ge0.5)=\\dfrac{F(0.75)-F(0.5)}{1-F(0.5)}=\\dfrac{0.9375-0.75}{0.25}=0.75$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-joint-constant-two-forms',

    chapter: 'random-variables',

    topic: 'Joint distributions',

    difficulty: 'easy',

    citation: 'Walpole Exercise 3.37',

    instance: {
      prompt:
        'Determine the values of $c$ so that each of the following can serve as a joint pmf: (a) ' +
        '$f(x,y)=cxy$ for $x=1,2,3$, $y=1,2,3$; (b) $f(x,y)=c|x-y|$ for $x\\in\\{-2,0,2\\}$, $y\\in\\{-2,3\\}$.',

      parts: [
        { kind: 'numeric', label: 'c for (a)', answer: 1 / 36, tol: 0.0005 },

        { kind: 'numeric', label: 'c for (b)', answer: 1 / 15, tol: 0.0005 },
      ],

      solution: [
        {
          text: '(a) $\\sum_{x=1}^{3}\\sum_{y=1}^{3}xy=\\left(\\sum x\\right)\\left(\\sum y\\right)=6\\cdot6=36$, so $c=\\tfrac{1}{36}$.',
        },

        {
          text: '(b) Summing $|x-y|$ over the $6$ pairs gives $15$, so $c=\\tfrac{1}{15}$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-joint-linear-region',

    chapter: 'random-variables',

    topic: 'Joint distributions',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.38',

    instance: {
      prompt:
        'The joint probability distribution of $X$ and $Y$ is $f(x,y)=\\dfrac{x+y}{30}$ for $x=0,1,2,3$ and ' +
        '$y=0,1,2$. Find $P(X\\le2,Y=1)$ and $P(X+Y=4)$.',

      parts: [
        { kind: 'numeric', label: 'P(X <= 2, Y = 1)', answer: 0.2, tol: 0.0005 },

        { kind: 'numeric', label: 'P(X + Y = 4)', answer: 0.2667, tol: 0.0005 },
      ],

      solution: [
        {
          text: '$P(X\\le2,Y=1)=f(0,1)+f(1,1)+f(2,1)=\\dfrac{1+2+3}{30}=\\dfrac{6}{30}=0.2$.',
        },

        {
          text: '$X+Y=4$ at $(2,2)$ and $(3,1)$: $f(2,2)+f(3,1)=\\dfrac{4+4}{30}=\\dfrac{8}{30}\\approx0.2667$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-fruit-sample',

    chapter: 'random-variables',

    topic: 'Joint distributions',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.39',

    instance: {
      prompt:
        'A random sample of $4$ pieces of fruit is selected from a sack containing $3$ oranges, $2$ apples, ' +
        'and $3$ bananas. Let $X$ be the number of oranges and $Y$ the number of apples selected. Find ' +
        '$f(1,1)$, and find $P[(X,Y)\\in A]$ where $A=\\{(x,y)\\mid x+y\\le2\\}$.',

      parts: [
        { kind: 'numeric', label: 'f(1, 1)', answer: 18 / 70, tol: 0.0005 },

        { kind: 'numeric', label: 'P[(X, Y) in A]', answer: 0.5, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'There are $\\binom{8}{4}=70$ equally likely samples, and $f(x,y)=\\dfrac{\\binom{3}{x}\\binom{2}{y}\\binom{3}{4-x-y}}{70}$.',
        },

        {
          text: '$f(1,1)=\\dfrac{\\binom{3}{1}\\binom{2}{1}\\binom{3}{2}}{70}=\\dfrac{3\\cdot2\\cdot3}{70}=\\dfrac{18}{70}\\approx0.2571$.',
        },

        {
          text: 'Summing $f(x,y)$ over every pair with $x+y\\le2$ gives $P[(X,Y)\\in A]=0.5$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-fastfood-marginal',

    chapter: 'random-variables',

    topic: 'Joint distributions',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.40',

    instance: {
      prompt:
        'On a randomly selected day, let $X$ and $Y$ be the proportions of time a drive-through and a ' +
        'walk-in facility are in use, with joint density $f(x,y)=\\tfrac23(x+2y)$ for $0\\le x,y\\le1$. Find ' +
        'the marginal density of $X$ evaluated at $x=0.5$, and find $P(X<0.5)$.',

      parts: [
        { kind: 'numeric', label: 'g(0.5)', answer: 1, tol: 0.0005 },

        { kind: 'numeric', label: 'P(X < 0.5)', answer: 0.4167, tol: 0.0005 },
      ],

      solution: [
        {
          text: '$g(x)=\\int_0^1\\tfrac23(x+2y)\\,dy=\\tfrac23(x+1)$, so $g(0.5)=\\tfrac23(1.5)=1$.',
        },

        {
          text: '$P(X<0.5)=\\int_0^{0.5}\\tfrac23(x+1)\\,dx\\approx0.4167$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-chocolate-box',

    chapter: 'random-variables',

    topic: 'Joint distributions',

    difficulty: 'hard',

    citation: 'Walpole Exercise 3.41',

    instance: {
      prompt:
        'A box of chocolates weighing $1$ kg mixes creams ($X$), toffees ($Y$), and cordials, with joint ' +
        'density $f(x,y)=24xy$ for $x,y\\ge0$, $x+y\\le1$. Find the probability the cordials exceed half the ' +
        'weight (that is, $P(X+Y<1/2)$), and find $P(Y<1/8\\mid X=3/4)$.',

      parts: [
        { kind: 'numeric', label: 'P(X + Y < 1/2)', answer: 0.0625, tol: 0.0005 },

        { kind: 'numeric', label: 'P(Y < 1/8 | X = 3/4)', answer: 0.25, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'Integrating $24xy$ over the triangular region $x+y<\\tfrac12$ gives $P(X+Y<\\tfrac12)=\\tfrac{1}{16}=0.0625$.',
        },

        {
          text: 'The marginal is $g(x)=12x(1-x)^2$, so $g(3/4)=12\\cdot\\tfrac34\\cdot\\left(\\tfrac14\\right)^2=\\tfrac{9}{16}$. Then $f(y\\mid x=3/4)=\\dfrac{24\\cdot\\tfrac34\\,y}{9/16}=32y$ on $0<y<\\tfrac14$.',
        },

        {
          text: '$P(Y<1/8\\mid X=3/4)=\\int_0^{1/8}32y\\,dy=16y^2\\Big|_0^{1/8}=0.25$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-component-lifetimes-conditional',

    chapter: 'random-variables',

    topic: 'Joint distributions',

    difficulty: 'easy',

    citation: 'Walpole Exercise 3.42',

    instance: {
      prompt:
        'Two components in an electronic system have lengths of life $X$ and $Y$, in years, with joint ' +
        'density $f(x,y)=e^{-(x+y)}$ for $x,y>0$. Find $P(0<X<1\\mid Y=2)$, and decide whether $X$ and $Y$ ' +
        'are statistically independent.',

      parts: [
        { kind: 'numeric', label: 'P(0 < X < 1 | Y = 2)', answer: 0.6321, tol: 0.0005 },

        { kind: 'tf', label: 'X and Y independent', answer: true },
      ],

      solution: [
        {
          text: '$f(x,y)=e^{-x}\\cdot e^{-y}$ factors over the rectangular support $x,y>0$, so $f(x\\mid y)=e^{-x}$ regardless of $y$.',
        },

        {
          text: '$P(0<X<1\\mid Y=2)=\\int_0^1e^{-x}\\,dx=1-e^{-1}\\approx0.6321$.',
        },

        {
          text: 'Since $f(x,y)=g(x)h(y)$ with $g(x)=e^{-x}$ and $h(y)=e^{-y}$ over a rectangular support, $X$ and $Y$ **are** independent.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-reaction-temp-joint',

    chapter: 'random-variables',

    topic: 'Joint distributions',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.43',

    instance: {
      prompt:
        'The reaction time $X$ and starting temperature $Y$ of a reaction have joint density $f(x,y)=4xy$ ' +
        'for $0<x<1$, $0<y<1$. Find $P(0\\le X\\le\\tfrac12,\\;\\tfrac14\\le Y\\le\\tfrac12)$ and $P(X<Y)$.',

      parts: [
        { kind: 'numeric', label: 'P(0 <= X <= 1/2, 1/4 <= Y <= 1/2)', answer: 0.046875, tol: 0.0005 },

        { kind: 'numeric', label: 'P(X < Y)', answer: 0.5, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'An antiderivative in each variable is $x^2y^2$, so the rectangle probability is $\\left(0.5^2-0^2\\right)\\left(0.5^2-0.25^2\\right)=0.046875$.',
        },

        {
          text: '$f(x,y)=4xy$ is symmetric in $x$ and $y$, so $P(X<Y)=P(Y<X)$, and together they must sum to $1$: $P(X<Y)=0.5$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-tire-pressure',

    chapter: 'random-variables',

    topic: 'Joint distributions',

    difficulty: 'hard',

    citation: 'Walpole Exercise 3.44',

    instance: {
      prompt:
        'Each rear tire on an experimental plane should be at $40$ psi. Let $X$ and $Y$ be the actual ' +
        'pressures of the right and left tires, with joint density $f(x,y)=k(x^2+y^2)$ for ' +
        '$30\\le x<50$, $30\\le y<50$. Find $k$, and find $P(30\\le X\\le40,\\,40\\le Y<50)$.',

      parts: [
        { kind: 'numeric', label: 'k', answer: 1 / 1306666.6667, tol: 5e-9 },

        { kind: 'numeric', label: 'P(30 <= X <= 40, 40 <= Y < 50)', answer: 0.25, tol: 0.0005 },
      ],

      solution: [
        {
          text: '$\\int_{30}^{50}\\int_{30}^{50}k(x^2+y^2)\\,dx\\,dy=2k\\cdot20\\cdot\\dfrac{50^3-30^3}{3}=k\\cdot1{,}306{,}666.\\overline{6}=1$, so $k\\approx7.653\\times10^{-7}$.',
        },

        {
          text: 'Splitting the rectangle integral the same way over $30\\le x\\le40$, $40\\le y<50$ gives $P=0.25$ — a clean quarter, since both sub-rectangles are symmetric halves of the full square.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-cable-mold',

    chapter: 'random-variables',

    topic: 'Joint distributions',

    difficulty: 'hard',

    citation: 'Walpole Exercise 3.45',

    instance: {
      prompt:
        'Let $X$ be the diameter of an armoured cable and $Y$ the diameter of the ceramic mould that makes ' +
        'it, both scaled to $(0,1)$, with joint density $f(x,y)=\\dfrac1y$ for $0<x<y<1$. Find $P(X+Y>\\tfrac12)$.',

      parts: [{ kind: 'numeric', label: 'P(X + Y > 1/2)', answer: 0.6534, tol: 0.0005 }],

      solution: [
        {
          text: 'For each $x$, $y$ ranges over $\\max(x,\\tfrac12-x)$ to $1$, so the double integral of $\\tfrac1y$ over that region works out to $P(X+Y>\\tfrac12)\\approx0.6534$.',
        },

        {
          text: 'The support is triangular, not rectangular, so this cannot be split into independent one-variable integrals — the coupling between $x$ and $y$ is exactly what makes the region non-rectangular.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-premium-table',

    chapter: 'random-variables',

    topic: 'Joint distributions',

    difficulty: 'easy',

    citation: 'Walpole Exercise 3.50',

    instance: {
      prompt:
        '$X$ and $Y$ have joint distribution $f(1,2)=0.10$, $f(1,4)=0.15$, $f(3,2)=0.20$, $f(3,4)=0.30$, ' +
        '$f(5,2)=0.10$, $f(5,4)=0.15$. Find the marginal values $g(3)$ and $h(4)$.',

      parts: [
        { kind: 'numeric', label: 'g(3)', answer: 0.5, tol: 0.0005 },

        { kind: 'numeric', label: 'h(4)', answer: 0.6, tol: 0.0005 },
      ],

      solution: [
        {
          text: '$g(3)=f(3,2)+f(3,4)=0.20+0.30=0.50$.',
        },

        {
          text: '$h(4)=f(1,4)+f(3,4)+f(5,4)=0.15+0.30+0.15=0.60$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-face-cards-joint',

    chapter: 'random-variables',

    topic: 'Joint distributions',

    difficulty: 'hard',

    citation: 'Walpole Exercise 3.51',

    instance: {
      prompt:
        'Three cards are drawn without replacement from the $12$ face cards ($4$ jacks, $4$ queens, $4$ ' +
        'kings) of a deck. Let $X$ be the number of kings and $Y$ the number of jacks drawn. Find $f(1,1)$, ' +
        'and find $P[(X,Y)\\in A]$ for $A=\\{(x,y)\\mid x+y\\ge2\\}$.',

      parts: [
        { kind: 'numeric', label: 'f(1, 1)', answer: 64 / 220, tol: 0.0005 },

        { kind: 'numeric', label: 'P[(X, Y) in A]', answer: 168 / 220, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'There are $\\binom{12}{3}=220$ equally likely draws, and $f(x,y)=\\dfrac{\\binom{4}{x}\\binom{4}{y}\\binom{4}{3-x-y}}{220}$.',
        },

        {
          text: '$f(1,1)=\\dfrac{\\binom{4}{1}\\binom{4}{1}\\binom{4}{1}}{220}=\\dfrac{64}{220}\\approx0.2909$.',
        },

        {
          text: 'Summing every cell with $x+y\\ge2$ gives $\\dfrac{168}{220}\\approx0.7636$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-biased-coin-joint',

    chapter: 'random-variables',

    topic: 'Joint distributions',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.52',

    instance: {
      prompt:
        'A coin with $P(H)=0.4$ is tossed twice. Let $Z$ be the number of heads on the first toss and $W$ ' +
        'the total number of heads. Find $P(Z=1,W=2)$ and the probability at least one head occurs.',

      parts: [
        { kind: 'numeric', label: 'P(Z = 1, W = 2)', answer: 0.16, tol: 0.0005 },

        { kind: 'numeric', label: 'P(at least 1 head)', answer: 0.64, tol: 0.0005 },
      ],

      solution: [
        {
          text: '$Z=1,W=2$ forces both tosses to land heads: $P=0.4\\times0.4=0.16$.',
        },

        {
          text: '$P(\\text{at least 1 head})=1-P(\\text{no heads})=1-0.6^2=0.64$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-process-conditional',

    chapter: 'random-variables',

    topic: 'Joint distributions',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.53',

    instance: {
      prompt:
        'Two process variables have joint density $f(x,y)=\\dfrac{6-x-y}{8}$ for $0<x<2$, $2<y<4$. Find ' +
        '$P(1<Y<3\\mid X=1)$.',

      parts: [{ kind: 'numeric', label: 'P(1 < Y < 3 | X = 1)', answer: 0.625, tol: 0.0005 }],

      solution: [
        {
          text: 'The marginal at $x=1$ is $g(1)=\\int_2^4\\tfrac{6-1-y}{8}\\,dy=0.5$.',
        },

        {
          text: 'Only $2<y<3$ of the requested interval lies in the support, and $\\int_2^3\\tfrac{5-y}{8}\\,dy/0.5=0.625$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-tobacco-conditional',

    chapter: 'random-variables',

    topic: 'Joint distributions',

    difficulty: 'medium',

    citation: 'Walpole Exercise 3.56',

    instance: {
      prompt:
        'Random variables $X$ and $Y$ have joint density $f(x,y)=6x$ for $0<x<1$, $0<y<1-x$. Find ' +
        '$P(X>0.3\\mid Y=0.5)$.',

      parts: [{ kind: 'numeric', label: 'P(X > 0.3 | Y = 0.5)', answer: 0.64, tol: 0.0005 }],

      solution: [
        {
          text: 'The marginal of $Y$ is $h(y)=\\int_0^{1-y}6x\\,dx=3(1-y)^2$, so $h(0.5)=0.75$.',
        },

        {
          text: '$f(x\\mid Y=0.5)=\\dfrac{6x}{0.75}=8x$ on $0<x<0.5$, so $P(X>0.3\\mid Y=0.5)=\\int_{0.3}^{0.5}8x\\,dx=0.64$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-tobacco-blend',

    chapter: 'random-variables',

    topic: 'Joint distributions',

    difficulty: 'medium',

    citation: 'Walpole Review Exercise 3.61',

    instance: {
      prompt:
        'A tobacco blend mixes Turkish ($X$) and domestic ($Y$) tobacco with joint density $f(x,y)=24xy$ ' +
        'for $x,y\\ge0$, $x+y\\le1$. Find the probability Turkish tobacco is over half the blend, and find ' +
        '$P(X<1/8\\mid Y=3/4)$.',

      parts: [
        { kind: 'numeric', label: 'P(X > 1/2)', answer: 0.3125, tol: 0.0005 },

        { kind: 'numeric', label: 'P(X < 1/8 | Y = 3/4)', answer: 0.25, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'Integrating $24xy$ over the region $x>\\tfrac12$ within the triangle gives $P(X>\\tfrac12)=\\tfrac{5}{16}=0.3125$.',
        },

        {
          text: 'The marginal is $h(y)=12y(1-y)^2$, so $h(3/4)=0.5625$; then $f(x\\mid y=3/4)=32x$ on $0<x<\\tfrac14$, and $\\int_0^{1/8}32x\\,dx=0.25$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-insurance-cdf',

    chapter: 'random-variables',

    topic: 'Discrete distributions',

    difficulty: 'easy',

    citation: 'Walpole Review Exercise 3.62',

    instance: {
      prompt:
        'A policyholder\'s months between payments, $X$, has step cumulative distribution function ' +
        '$F(x)=0$ for $x<1$, $0.4$ for $1\\le x<3$, $0.6$ for $3\\le x<5$, $0.8$ for $5\\le x<7$, and $1.0$ ' +
        'for $x\\ge7$. Find $f(3)$ and $P(4<X\\le7)$.',

      parts: [
        { kind: 'numeric', label: 'f(3)', answer: 0.2, tol: 0.0005 },

        { kind: 'numeric', label: 'P(4 < X <= 7)', answer: 0.4, tol: 0.0005 },
      ],

      solution: [
        {
          text: 'The pmf is the jump height of $F$: $f(1)=0.4$, $f(3)=0.6-0.4=0.2$, $f(5)=0.8-0.6=0.2$, $f(7)=1.0-0.8=0.2$.',
        },

        {
          text: '$P(4<X\\le7)=F(7)-F(4)=1.0-0.6=0.4$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-switchboard-poisson',

    chapter: 'random-variables',

    topic: 'Discrete distributions',

    difficulty: 'easy',

    citation: 'Walpole Review Exercise 3.65',

    instance: {
      prompt:
        'The number of phone calls received by a switchboard during a $5$-minute interval, $X$, has ' +
        'probability function $f(x)=e^{-2}2^x/x!$ for $x=0,1,2,\\dots$. Find $f(0)$ and $f(2)$.',

      parts: [
        { kind: 'numeric', label: 'f(0)', answer: 0.1353, tol: 0.0005 },

        { kind: 'numeric', label: 'f(2)', answer: 0.2707, tol: 0.0005 },
      ],

      solution: [
        {
          text: '$f(0)=e^{-2}\\approx0.1353$.',
        },

        {
          text: '$f(2)=e^{-2}\\dfrac{2^2}{2!}=2e^{-2}\\approx0.2707$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-xy-density-joint',

    chapter: 'random-variables',

    topic: 'Joint distributions',

    difficulty: 'medium',

    citation: 'Walpole Review Exercise 3.66',

    instance: {
      prompt:
        'Random variables $X$ and $Y$ have joint density $f(x,y)=x+y$ for $0\\le x,y\\le1$. Find the ' +
        'marginal of $X$ evaluated at $x=0.5$, and find $P(X>0.5,\\,Y>0.5)$.',

      parts: [
        { kind: 'numeric', label: 'g(0.5)', answer: 1, tol: 0.0005 },

        { kind: 'numeric', label: 'P(X > 0.5, Y > 0.5)', answer: 0.375, tol: 0.0005 },
      ],

      solution: [
        {
          text: '$g(x)=\\int_0^1(x+y)\\,dy=x+\\tfrac12$, so $g(0.5)=1$.',
        },

        {
          text: '$P(X>0.5,Y>0.5)=\\int_{0.5}^{1}\\int_{0.5}^{1}(x+y)\\,dy\\,dx=0.375$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-electrical-lifespan',

    chapter: 'random-variables',

    topic: 'Continuous distributions',

    difficulty: 'medium',

    citation: 'Walpole Review Exercise 3.69',

    instance: {
      prompt:
        'The lifespan in hours of an electrical component has cumulative distribution function ' +
        '$F(x)=1-e^{-x/50}$ for $x>0$. Find the density $f(x)$ evaluated at $x=50$, and find $P(X>70)$.',

      parts: [
        { kind: 'numeric', label: 'f(50)', answer: 0.007358, tol: 0.00005 },

        { kind: 'numeric', label: 'P(X > 70)', answer: 0.2466, tol: 0.0005 },
      ],

      solution: [
        {
          text: '$f(x)=F\'(x)=\\tfrac{1}{50}e^{-x/50}$, so $f(50)=\\tfrac{1}{50}e^{-1}\\approx0.00736$.',
        },

        {
          text: '$P(X>70)=1-F(70)=e^{-1.4}\\approx0.2466$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-bakery-shelf-life',

    chapter: 'random-variables',

    topic: 'Continuous distributions',

    difficulty: 'easy',

    citation: 'Walpole Review Exercise 3.71',

    instance: {
      prompt:
        'The shelf life $Y$, in days, of a bakery product has density $f(y)=\\tfrac12e^{-y/2}$ for $y\\ge0$. ' +
        'What fraction of loaves stocked today are expected to still be sellable $3$ days from now, that is, ' +
        '$P(Y>3)$?',

      parts: [{ kind: 'numeric', label: 'P(Y > 3)', answer: 0.2231, tol: 0.0005 }],

      solution: [
        {
          text: '$F(y)=1-e^{-y/2}$, so $P(Y>3)=e^{-1.5}\\approx0.2231$ — about $22\\%$ of today\'s stock.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-airport-train',

    chapter: 'random-variables',

    topic: 'Continuous distributions',

    difficulty: 'easy',

    citation: 'Walpole Review Exercise 3.72',

    instance: {
      prompt:
        'The time $X$ in minutes to travel from the main terminal to a concourse by train has density ' +
        '$f(x)=\\tfrac{1}{10}$ for $0\\le x\\le10$. Show $f$ is a valid density, and find $P(X\\le7)$.',

      parts: [
        { kind: 'numeric', label: 'total area', answer: 1, tol: 0.0005 },

        { kind: 'numeric', label: 'P(X <= 7)', answer: 0.7, tol: 0.0005 },
      ],

      solution: [
        {
          text: '$\\int_0^{10}\\tfrac{1}{10}\\,dx=1$, so $f$ is valid.',
        },

        {
          text: '$P(X\\le7)=\\tfrac{1}{10}(7-0)=0.7$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch03-book-calls-exponential',

    chapter: 'random-variables',

    topic: 'Continuous distributions',

    difficulty: 'medium',

    citation: 'Walpole Review Exercise 3.74',

    instance: {
      prompt:
        'The time $Z$ in minutes between calls to an electrical supply system has density ' +
        '$f(z)=\\tfrac{1}{10}e^{-z/10}$ for $z>0$. Find the probability of no calls within a $20$-minute ' +
        'interval, and the probability the first call comes within $10$ minutes of opening.',

      parts: [
        { kind: 'numeric', label: 'P(no calls in 20 min)', answer: 0.1353, tol: 0.0005 },

        { kind: 'numeric', label: 'P(first call within 10 min)', answer: 0.6321, tol: 0.0005 },
      ],

      solution: [
        {
          text: '$P(Z>20)=e^{-2}\\approx0.1353$.',
        },

        {
          text: '$P(Z<10)=1-e^{-1}\\approx0.6321$.',
        },
      ],
    },
  }),
];
