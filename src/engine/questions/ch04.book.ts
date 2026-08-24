import type { QuestionTemplate } from '../types';

import { bookQuestion } from '../authoring';

export const ch04Book: QuestionTemplate[] = [
  // ---- 4.1 Mean of a random variable ----

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
    id: 'ch04-book-imperfections-mean',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'easy',

    citation: 'Walpole §4.1, Exercise 4.1',

    instance: {
      prompt:
        'The number $X$ of imperfections per $10$ meters of a synthetic fabric has distribution $f(0)=0.41$, ' +
        '$f(1)=0.37$, $f(2)=0.16$, $f(3)=0.05$, $f(4)=0.01$. Find the average number of imperfections per $10$ ' +
        'meters of this fabric.',

      parts: [{ kind: 'numeric', answer: 0.88, tol: 0.005 }],

      solution: [
        {
          text: '$\\mu=E(X)=(0)(0.41)+(1)(0.37)+(2)(0.16)+(3)(0.05)+(4)(0.01)$.',
        },

        {
          text: '$=0+0.37+0.32+0.15+0.04=0.88$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-binomial-mean',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'medium',

    citation: 'Walpole §4.1, Exercise 4.2',

    instance: {
      prompt:
        'A discrete random variable $X$ has probability distribution $f(x)=\\dbinom{3}{x}\\left(\\dfrac14\\right)^x\\left(\\dfrac34\\right)^{3-x}$, ' +
        'for $x=0,1,2,3$. Find the mean of $X$.',

      parts: [{ kind: 'numeric', answer: 0.75, tol: 0.005 }],

      solution: [
        {
          text: 'This is a binomial pmf with $n=3$ trials and success probability $p=\\tfrac14$, so a direct sum works, but it is quicker to recognise the shape.',
        },

        {
          text: '$f(0)=\\tfrac{27}{64}$, $f(1)=\\tfrac{27}{64}$, $f(2)=\\tfrac{9}{64}$, $f(3)=\\tfrac{1}{64}$, and $\\mu=(0)\\tfrac{27}{64}+(1)\\tfrac{27}{64}+(2)\\tfrac{9}{64}+(3)\\tfrac{1}{64}=\\tfrac{48}{64}=0.75$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-coin-total-mean',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'easy',

    citation: 'Walpole §4.1, Exercise 4.3',

    instance: {
      prompt:
        'The total value $T$ (in cents) of three coins drawn has distribution $f(20)=\\tfrac15$, $f(25)=\\tfrac35$, ' +
        '$f(30)=\\tfrac15$. Find the mean of $T$.',

      parts: [{ kind: 'numeric', answer: 25, tol: 0.05 }],

      solution: [
        {
          text: '$\\mu=E(T)=(20)\\tfrac15+(25)\\tfrac35+(30)\\tfrac15=4+15+6=25$ cents.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-biased-coin-tails',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'easy',

    citation: 'Walpole §4.1, Exercise 4.4',

    instance: {
      prompt:
        'A coin is biased so that a head is three times as likely to occur as a tail. Find the expected number ' +
        'of tails when this coin is tossed twice.',

      parts: [{ kind: 'numeric', answer: 0.5, tol: 0.005 }],

      solution: [
        {
          text: '$P(\\text{tail})=\\tfrac14$ on each toss, so the number of tails $X$ in two tosses is binomial with $n=2$, $p=\\tfrac14$.',
        },

        {
          text: 'A binomial mean is $np$: $\\mu=(2)\\left(\\tfrac14\\right)=0.5$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-card-game-fair-price',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'easy',

    citation: 'Walpole §4.1, Exercise 4.5',

    instance: {
      prompt:
        'In a gambling game, a woman is paid $\\$3$ if she draws a jack or a queen and $\\$5$ if she draws a king ' +
        'or an ace from an ordinary deck of $52$ playing cards. If she draws any other card she loses (and is ' +
        'paid nothing). How much should she pay to play if the game is to be fair?',

      parts: [{ kind: 'numeric', answer: 16 / 13, tol: 0.01 }],

      solution: [
        {
          text: 'There are $8$ jacks/queens and $8$ kings/aces among $52$ cards, so her winnings $X$ has $E(X)=(3)\\dfrac{8}{52}+(5)\\dfrac{8}{52}$.',
        },

        {
          text: '$E(X)=\\dfrac{24+40}{52}=\\dfrac{64}{52}=\\dfrac{16}{13}\\approx\\$1.23$.',
        },

        {
          text: 'A fair game charges exactly the expected payout, so she should pay $\\dfrac{16}{13}\\approx\\$1.23$ to play.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-car-wash-earnings',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'medium',

    citation: 'Walpole §4.1, Exercise 4.6 (cf. deck Example 4.4)',

    instance: {
      prompt:
        'An attendant at a car wash is paid \\$7, \\$9, \\$11, \\$13, \\$15, or \\$17 with probabilities ' +
        '$\\tfrac1{12},\\tfrac1{12},\\tfrac14,\\tfrac14,\\tfrac16,\\tfrac16$ respectively, between 4 and 5 p.m. on any ' +
        'sunny Friday. Find the attendant\u2019s expected earnings for this period.',

      parts: [{ kind: 'numeric', answer: 41 / 3, tol: 0.01 }],

      solution: [
        {
          text: '$\\mu=(7)\\tfrac1{12}+(9)\\tfrac1{12}+(11)\\tfrac14+(13)\\tfrac14+(15)\\tfrac16+(17)\\tfrac16$.',
        },

        {
          text: '$=\\tfrac{7}{12}+\\tfrac{9}{12}+\\tfrac{11}{4}+\\tfrac{13}{4}+\\tfrac{15}{6}+\\tfrac{17}{6}=\\tfrac{41}{3}\\approx\\$13.67$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-stock-expected-gain',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'easy',

    citation: 'Walpole §4.1, Exercise 4.7',

    instance: {
      prompt:
        'By investing in a particular stock, a person can make a profit in one year of $\\$4000$ with probability ' +
        '$0.3$, or take a loss of $\\$1000$ with probability $0.7$. Find this person\u2019s expected gain.',

      parts: [{ kind: 'numeric', answer: 500, tol: 0.5 }],

      solution: [
        {
          text: '$E(X)=(4000)(0.3)+(-1000)(0.7)=1200-700=\\$500$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-jewelry-expected-profit',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'easy',

    citation: 'Walpole §4.1, Exercise 4.8',

    instance: {
      prompt:
        'An antique jewelry dealer is interested in a gold necklace for which the probabilities are $0.22$, ' +
        '$0.36$, $0.28$, and $0.14$ that she will sell it for a profit of $\\$250$, a profit of $\\$150$, break ' +
        'even, or sell it for a loss of $\\$150$, respectively. What is her expected profit?',

      parts: [{ kind: 'numeric', answer: 88, tol: 0.5 }],

      solution: [
        {
          text: '$E(X)=(250)(0.22)+(150)(0.36)+(0)(0.28)+(-150)(0.14)$.',
        },

        {
          text: '$=55+54+0-21=\\$88$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-airplane-insurance-premium',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'hard',

    citation: 'Walpole §4.1, Exercise 4.9',

    instance: {
      prompt:
        'A private pilot wishes to insure his airplane for $\\$200{,}000$. The insurance company estimates that a ' +
        'total loss will occur with probability $0.002$, a $50\\%$ loss with probability $0.01$, and a $25\\%$ ' +
        'loss with probability $0.1$. Ignoring all other partial losses, what premium should the insurance ' +
        'company charge each year to realize an average profit of $\\$500$?',

      parts: [{ kind: 'numeric', answer: 6900, tol: 5 }],

      solution: [
        {
          text: 'The company\u2019s expected payout is $E(\\text{payout})=(200{,}000)(0.002)+(100{,}000)(0.01)+(50{,}000)(0.1)$.',
        },

        {
          text: '$=400+1000+5000=\\$6400$.',
        },

        {
          text: 'A premium equal to the expected payout plus the target profit gives $6400+500=\\$6900$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-tire-rating-joint-means',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'medium',

    citation: 'Walpole §4.1, Exercise 4.10',

    instance: {
      prompt:
        'Two tire-quality experts each assign a rating on a $3$-point scale: $X$ for expert A, $Y$ for expert B. ' +
        'The joint distribution is $f(1,1)=0.10$, $f(1,2)=0.05$, $f(1,3)=0.02$, $f(2,1)=0.10$, $f(2,2)=0.35$, ' +
        '$f(2,3)=0.05$, $f(3,1)=0.03$, $f(3,2)=0.10$, $f(3,3)=0.20$. Find $\\mu_X$ and $\\mu_Y$.',

      parts: [
        { kind: 'numeric', label: 'μX', answer: 2.16, tol: 0.01 },

        { kind: 'numeric', label: 'μY', answer: 2.04, tol: 0.01 },
      ],

      solution: [
        {
          text: 'The marginal of $X$ collapses each row: $f_X(1)=0.17$, $f_X(2)=0.50$, $f_X(3)=0.33$, so $\\mu_X=(1)(0.17)+(2)(0.50)+(3)(0.33)=2.16$.',
        },

        {
          text: 'The marginal of $Y$ collapses each column: $f_Y(1)=0.23$, $f_Y(2)=0.50$, $f_Y(3)=0.27$, so $\\mu_Y=(1)(0.23)+(2)(0.50)+(3)(0.27)=2.04$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-pitch-diameter-mean',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'hard',

    citation: 'Walpole §4.1, Exercise 4.11',

    instance: {
      prompt:
        'The density function of coded measurements of the pitch diameter of threads of a fitting is ' +
        '$f(x)=\\dfrac{4}{\\pi(1+x^2)}$ for $0<x<1$, and $0$ elsewhere. Find the expected value of $X$.',

      parts: [{ kind: 'numeric', answer: (2 * Math.log(2)) / Math.PI, tol: 0.005 }],

      solution: [
        {
          text: '$\\mu=E(X)=\\displaystyle\\int_0^1 x\\cdot\\dfrac{4}{\\pi(1+x^2)}\\,dx=\\dfrac{4}{\\pi}\\int_0^1\\dfrac{x}{1+x^2}\\,dx$.',
        },

        {
          text: '$=\\dfrac{4}{\\pi}\\left[\\tfrac12\\ln(1+x^2)\\right]_0^1=\\dfrac{2}{\\pi}\\ln2=\\dfrac{\\ln4}{\\pi}\\approx0.4413$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-vacuum-hours-mean',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'medium',

    citation: 'Walpole §4.1, Exercise 4.13',

    instance: {
      prompt:
        'The total number of hours, in units of $100$ hours, that a family runs a vacuum cleaner over a year is ' +
        'a continuous random variable $X$ with density $f(x)=x$ for $0<x<1$, $f(x)=2-x$ for $1\\le x<2$, and $0$ ' +
        'elsewhere. Find the average number of hours per year that families run their vacuum cleaners.',

      parts: [{ kind: 'numeric', answer: 100, tol: 1 }],

      solution: [
        {
          text: '$\\mu=E(X)=\\displaystyle\\int_0^1 x\\cdot x\\,dx+\\int_1^2 x(2-x)\\,dx=\\tfrac13+\\tfrac23=1$.',
        },

        {
          text: '$X$ is measured in units of $100$ hours, so a mean of $1$ means $100$ hours per year.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-mailorder-response-mean',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'medium',

    citation: 'Walpole §4.1, Exercise 4.14',

    instance: {
      prompt:
        'The proportion $X$ of individuals who respond to a certain mail-order solicitation has density ' +
        '$f(x)=\\dfrac{2(x+2)}{5}$ for $0<x<1$, and $0$ elsewhere. Find the expected proportion of respondents.',

      parts: [{ kind: 'numeric', answer: 8 / 15, tol: 0.005 }],

      solution: [
        {
          text: '$\\mu=E(X)=\\displaystyle\\int_0^1 x\\cdot\\dfrac{2(x+2)}{5}\\,dx=\\dfrac25\\int_0^1(x^2+2x)\\,dx$.',
        },

        {
          text: '$=\\dfrac25\\left[\\tfrac{x^3}{3}+x^2\\right]_0^1=\\dfrac25\\left(\\tfrac13+1\\right)=\\dfrac25\\cdot\\dfrac43=\\dfrac{8}{15}\\approx0.5333$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-circle-uniform-symmetric-mean',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'easy',

    citation: 'Walpole §4.1, Exercise 4.15',

    instance: {
      prompt:
        '$X$ and $Y$ are uniformly distributed on a disk of radius $a$ centred at the origin, with joint density ' +
        '$f(x,y)=\\dfrac{1}{\\pi a^2}$ for $x^2+y^2\\le a^2$. Find $\\mu_X$, the expected value of $X$.',

      parts: [{ kind: 'numeric', answer: 0, tol: 0.005 }],

      solution: [
        {
          text: 'The disk is symmetric about the line $x=0$: for every point $(x,y)$ in the disk, $(-x,y)$ is also in the disk with the same density.',
        },

        {
          text: 'Positive and negative $x$-values contribute equal and opposite amounts to the integral $\\int\\int x f(x,y)\\,dx\\,dy$, which must cancel to $\\mu_X=0$ — no integration needed once the symmetry is seen.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-g-quadratic-mean',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'medium',

    citation: 'Walpole §4.1, Exercise 4.17',

    instance: {
      prompt:
        'A random variable $X$ has distribution $f(-3)=\\tfrac16$, $f(6)=\\tfrac12$, $f(9)=\\tfrac13$. Find ' +
        '$\\mu_{g(X)}$ where $g(X)=(2X+1)^2$.',

      parts: [{ kind: 'numeric', answer: 209, tol: 0.5 }],

      solution: [
        {
          text: '$g(-3)=(-5)^2=25$, $g(6)=13^2=169$, $g(9)=19^2=361$.',
        },

        {
          text: '$\\mu_{g(X)}=E[g(X)]=(25)\\tfrac16+(169)\\tfrac12+(361)\\tfrac13=4.1\\overline{6}+84.5+120.\\overline{3}=209$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-binomial-second-moment',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'medium',

    citation: 'Walpole §4.1, Exercise 4.18',

    instance: {
      prompt:
        'Find the expected value of $g(X)=X^2$, where $X$ has the distribution of Exercise 4.2, ' +
        '$f(x)=\\dbinom{3}{x}\\left(\\tfrac14\\right)^x\\left(\\tfrac34\\right)^{3-x}$, $x=0,1,2,3$.',

      parts: [{ kind: 'numeric', answer: 1.125, tol: 0.005 }],

      solution: [
        {
          text: '$f(0)=\\tfrac{27}{64}$, $f(1)=\\tfrac{27}{64}$, $f(2)=\\tfrac{9}{64}$, $f(3)=\\tfrac{1}{64}$.',
        },

        {
          text: '$E(X^2)=(0)\\tfrac{27}{64}+(1)\\tfrac{27}{64}+(4)\\tfrac{9}{64}+(9)\\tfrac{1}{64}=\\dfrac{27+36+9}{64}=\\dfrac{72}{64}=1.125$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-word-processor-expected-spend',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'hard',

    citation: 'Walpole §4.1, Exercise 4.19',

    instance: {
      prompt:
        'The number $X$ of word processors an industrial firm purchases each year has $f(0)=\\tfrac1{10}$, ' +
        '$f(1)=\\tfrac{3}{10}$, $f(2)=\\tfrac25$, $f(3)=\\tfrac15$. Each unit costs $\\$1200$, and at year end a ' +
        'refund of $50X^2$ dollars is issued. How much can the firm expect to spend on new word processors ' +
        'during the year?',

      parts: [{ kind: 'numeric', answer: 1855, tol: 1 }],

      solution: [
        {
          text: 'Net spending is $g(X)=1200X-50X^2$, so $E[g(X)]=1200E(X)-50E(X^2)$ by Theorem 4.6.',
        },

        {
          text: '$E(X)=(0)(0.1)+(1)(0.3)+(2)(0.4)+(3)(0.2)=1.7$, and $E(X^2)=(0)(0.1)+(1)(0.3)+(4)(0.4)+(9)(0.2)=3.7$.',
        },

        {
          text: '$E[g(X)]=1200(1.7)-50(3.7)=2040-185=\\$1855$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-exponential-transform-mean',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'medium',

    citation: 'Walpole §4.1, Exercise 4.20',

    instance: {
      prompt:
        'A continuous random variable $X$ has density $f(x)=e^{-x}$ for $x>0$, and $0$ elsewhere. Find the ' +
        'expected value of $g(X)=e^{2X/3}$.',

      parts: [{ kind: 'numeric', answer: 3, tol: 0.005 }],

      solution: [
        {
          text: '$E[g(X)]=\\displaystyle\\int_0^\\infty e^{2x/3}\\cdot e^{-x}\\,dx=\\int_0^\\infty e^{-x/3}\\,dx$.',
        },

        {
          text: '$=\\left[-3e^{-x/3}\\right]_0^\\infty=0-(-3)=3$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-dealer-profit-squared',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'medium',

    citation: 'Walpole §4.1, Exercise 4.21',

    instance: {
      prompt:
        'A dealer\u2019s profit, in units of $\\$5000$, on a new automobile is $X$, with density $f(x)=2(1-x)$ for ' +
        '$0<x<1$, and $0$ elsewhere. If the dealer\u2019s actual profit is $g(X)=X^2$ (units of $\\$5000$), find the ' +
        'average value of $g(X)$ in dollars.',

      parts: [{ kind: 'numeric', answer: 5000 / 6, tol: 1 }],

      solution: [
        {
          text: '$E[g(X)]=E(X^2)=\\displaystyle\\int_0^1 x^2\\cdot2(1-x)\\,dx=2\\int_0^1(x^2-x^3)\\,dx=2\\left(\\tfrac13-\\tfrac14\\right)=\\tfrac16$.',
        },

        {
          text: 'In units of $\\$5000$, that is $\\tfrac16\\cdot5000\\approx\\$833.33$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-hospitalization-mean',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'hard',

    citation: 'Walpole §4.1, Exercise 4.22',

    instance: {
      prompt:
        'The hospitalization period, in days, following treatment for a certain kidney disorder is $Y=X+4$, ' +
        'where $X$ has density $f(x)=\\dfrac{32}{(x+4)^3}$ for $x>0$. Find the average number of days a person is ' +
        'hospitalized.',

      parts: [{ kind: 'numeric', answer: 8, tol: 0.05 }],

      solution: [
        {
          text: 'Substituting $u=x+4$: $E(X)=\\displaystyle\\int_0^\\infty x\\cdot32(x+4)^{-3}\\,dx=32\\int_4^\\infty(u-4)u^{-3}\\,du$.',
        },

        {
          text: '$=32\\left[-u^{-1}+2u^{-2}\\right]_4^\\infty=32\\left(\\tfrac14-\\tfrac18\\right)=4$, so $E(X)=4$.',
        },

        {
          text: 'By Theorem 4.5, $E(Y)=E(X)+4=4+4=8$ days.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-joint-g-xy2',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'hard',

    citation: 'Walpole §4.1, Exercise 4.23',

    instance: {
      prompt:
        '$X$ and $Y$ have joint distribution $f(2,1)=0.10$, $f(4,1)=0.15$, $f(2,3)=0.20$, $f(4,3)=0.30$, ' +
        '$f(2,5)=0.10$, $f(4,5)=0.15$ (values of $X$ are $2,4$; values of $Y$ are $1,3,5$). Find the expected ' +
        'value of $g(X,Y)=XY^2$, and find $\\mu_X$ and $\\mu_Y$.',

      parts: [
        { kind: 'numeric', label: 'E(XY²)', answer: 35.2, tol: 0.05 },

        { kind: 'numeric', label: 'μX', answer: 3.2, tol: 0.01 },

        { kind: 'numeric', label: 'μY', answer: 3.0, tol: 0.01 },
      ],

      solution: [
        {
          text: 'By Definition 4.2, $E(XY^2)=\\sum_x\\sum_y xy^2 f(x,y)$; summing all six cells gives $35.2$.',
        },

        {
          text: 'The marginal $f_X(2)=0.40$, $f_X(4)=0.60$ gives $\\mu_X=(2)(0.4)+(4)(0.6)=3.2$.',
        },

        {
          text: 'The marginal $f_Y(1)=0.25$, $f_Y(3)=0.50$, $f_Y(5)=0.25$ gives $\\mu_Y=(1)(0.25)+(3)(0.5)+(5)(0.25)=3.0$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-joint-g-x2y-2xy',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'hard',

    citation: 'Walpole §4.1, Exercise 4.24',

    instance: {
      prompt:
        '$X$ and $Y$ (each taking values $0,1,2,3$) have joint distribution $f(1,0)=\\tfrac3{70}$, $f(2,0)=\\tfrac9{70}$, ' +
        '$f(3,0)=\\tfrac3{70}$, $f(0,1)=\\tfrac2{70}$, $f(1,1)=\\tfrac{18}{70}$, $f(2,1)=\\tfrac{18}{70}$, $f(3,1)=\\tfrac2{70}$, ' +
        '$f(0,2)=\\tfrac3{70}$, $f(1,2)=\\tfrac9{70}$, $f(2,2)=\\tfrac3{70}$ (all other cells are $0$). ' +
        '(a) Find $E(X^2Y-2XY)$. (b) Find $\\mu_X-\\mu_Y$.',

      parts: [
        { kind: 'numeric', label: 'E(X²Y − 2XY)', answer: -3 / 7, tol: 0.01 },

        { kind: 'numeric', label: 'μX − μY', answer: 0.5, tol: 0.01 },
      ],

      solution: [
        {
          text: 'By Theorem 4.6, $E(X^2Y-2XY)=E(X^2Y)-2E(XY)$. Direct enumeration gives $E(XY)=\\tfrac97$ and $E(X^2Y)=\\tfrac{15}{7}$.',
        },

        {
          text: '$E(X^2Y-2XY)=\\tfrac{15}{7}-\\tfrac{18}{7}=-\\tfrac37\\approx-0.4286$.',
        },

        {
          text: 'The marginals give $\\mu_X=1.5$ and $\\mu_Y=1.0$, so $\\mu_X-\\mu_Y=0.5$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-jacks-kings-hypergeometric-sum',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'medium',

    citation: 'Walpole §4.1, Exercise 4.25',

    instance: {
      prompt:
        'Three cards are drawn without replacement from the $12$ face cards ($4$ jacks, $4$ queens, $4$ kings) of ' +
        'an ordinary deck. Find the mean of the total number of jacks and kings drawn.',

      parts: [{ kind: 'numeric', answer: 2, tol: 0.01 }],

      solution: [
        {
          text: 'Let $J$ be the number of jacks and $K$ the number of kings drawn; each is hypergeometric with $N=12$, $K_{\\text{class}}=4$, $n=3$, so $E(J)=E(K)=n\\cdot\\tfrac{4}{12}=1$.',
        },

        {
          text: 'By Corollary 4.4, $E(J+K)=E(J)+E(K)=1+1=2$ — no need to build the joint distribution of $J$ and $K$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-dvd-component-mean',

    chapter: 'expectation',

    topic: 'Expected value',

    difficulty: 'easy',

    citation: 'Walpole §4.1, Exercise 4.27',

    instance: {
      prompt:
        'The time to failure, in hours, of a DVD player component has density $f(x)=\\dfrac{1}{2000}e^{-x/2000}$ ' +
        'for $x>0$. Find the mean number of hours to failure.',

      parts: [{ kind: 'numeric', answer: 2000, tol: 1 }],

      solution: [
        {
          text: 'This is an exponential density with parameter $\\theta=2000$, and the mean of an exponential density equals its parameter: $\\mu=E(X)=\\theta=2000$ hours.',
        },
      ],
    },
  }),

  // ---- 4.2 Variance and covariance of random variables ----

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
    id: 'ch04-book-profit-variance',

    chapter: 'expectation',

    topic: 'Variance and covariance',

    difficulty: 'medium',

    citation: 'Walpole §4.2, Exercise 4.33',

    instance: {
      prompt:
        'Using Definition 4.3, find the variance of the stock-gain random variable $X$ of Exercise 4.7: profit ' +
        'of $\\$4000$ with probability $0.3$, loss of $\\$1000$ with probability $0.7$.',

      parts: [{ kind: 'numeric', answer: 5250000, tol: 1 }],

      solution: [
        {
          text: 'From Exercise 4.7, $\\mu=E(X)=\\$500$.',
        },

        {
          text: '$E(X^2)=(4000)^2(0.3)+(-1000)^2(0.7)=4{,}800{,}000+700{,}000=5{,}500{,}000$.',
        },

        {
          text: '$\\sigma^2=E(X^2)-\\mu^2=5{,}500{,}000-250{,}000=\\$5{,}250{,}000$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-stddev-three-point',

    chapter: 'expectation',

    topic: 'Variance and covariance',

    difficulty: 'easy',

    citation: 'Walpole §4.2, Exercise 4.34',

    instance: {
      prompt:
        'A random variable $X$ has distribution $f(-2)=0.3$, $f(3)=0.2$, $f(5)=0.5$. Find the standard deviation ' +
        'of $X$.',

      parts: [{ kind: 'numeric', answer: Math.sqrt(9.25), tol: 0.005 }],

      solution: [
        {
          text: '$\\mu=(-2)(0.3)+(3)(0.2)+(5)(0.5)=-0.6+0.6+2.5=2.5$.',
        },

        {
          text: '$E(X^2)=(4)(0.3)+(9)(0.2)+(25)(0.5)=1.2+1.8+12.5=15.5$, so $\\sigma^2=15.5-6.25=9.25$.',
        },

        {
          text: '$\\sigma=\\sqrt{9.25}\\approx3.0414$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-errors-variance',

    chapter: 'expectation',

    topic: 'Variance and covariance',

    difficulty: 'medium',

    citation: 'Walpole §4.2, Exercise 4.35',

    instance: {
      prompt:
        'The number $X$ of errors per $100$ lines of software code has distribution $f(2)=0.01$, $f(3)=0.25$, ' +
        '$f(4)=0.4$, $f(5)=0.3$, $f(6)=0.04$. Using Theorem 4.2, find the variance of $X$.',

      parts: [{ kind: 'numeric', answer: 0.7379, tol: 0.001 }],

      solution: [
        {
          text: '$\\mu=(2)(0.01)+(3)(0.25)+(4)(0.4)+(5)(0.3)+(6)(0.04)=4.11$.',
        },

        {
          text: '$E(X^2)=(4)(0.01)+(9)(0.25)+(16)(0.4)+(25)(0.3)+(36)(0.04)=17.63$.',
        },

        {
          text: '$\\sigma^2=17.63-(4.11)^2=17.63-16.8921=0.7379$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-power-failures-mean-variance',

    chapter: 'expectation',

    topic: 'Variance and covariance',

    difficulty: 'easy',

    citation: 'Walpole §4.2, Exercise 4.36',

    instance: {
      prompt:
        'The probabilities are $0.4$, $0.3$, $0.2$, and $0.1$, respectively, that $0$, $1$, $2$, or $3$ power ' +
        'failures strike a subdivision in a given year. Find the mean and variance of the number of failures $X$.',

      parts: [
        { kind: 'numeric', label: 'E(X)', answer: 1, tol: 0.01 },

        { kind: 'numeric', label: 'Var(X)', answer: 1, tol: 0.01 },
      ],

      solution: [
        {
          text: '$\\mu=(0)(0.4)+(1)(0.3)+(2)(0.2)+(3)(0.1)=0.3+0.4+0.3=1.0$.',
        },

        {
          text: '$E(X^2)=(0)(0.4)+(1)(0.3)+(4)(0.2)+(9)(0.1)=0.3+0.8+0.9=2.0$, so $\\sigma^2=2.0-1.0=1.0$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-dealer-profit-variance',

    chapter: 'expectation',

    topic: 'Variance and covariance',

    difficulty: 'hard',

    citation: 'Walpole §4.2, Exercise 4.37',

    instance: {
      prompt:
        'A dealer\u2019s profit, in units of $\\$5000$, on a new automobile has density $f(x)=2(1-x)$ for $0<x<1$. ' +
        'Find the variance of $X$.',

      parts: [{ kind: 'numeric', answer: 1 / 18, tol: 0.002 }],

      solution: [
        {
          text: '$\\mu=E(X)=\\displaystyle\\int_0^1 x\\cdot2(1-x)\\,dx=\\tfrac13$ (Exercise 4.12), and $E(X^2)=\\tfrac16$ (Exercise 4.21).',
        },

        {
          text: '$\\sigma^2=\\tfrac16-\\left(\\tfrac13\\right)^2=\\tfrac16-\\tfrac19=\\tfrac{3}{18}-\\tfrac{2}{18}=\\tfrac{1}{18}\\approx0.0556$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-mailorder-variance',

    chapter: 'expectation',

    topic: 'Variance and covariance',

    difficulty: 'hard',

    citation: 'Walpole §4.2, Exercise 4.38',

    instance: {
      prompt:
        'The proportion $X$ of respondents to a mail-order solicitation has density $f(x)=\\dfrac{2(x+2)}{5}$ for ' +
        '$0<x<1$. Find the variance of $X$.',

      parts: [{ kind: 'numeric', answer: 11 / 30 - (8 / 15) ** 2, tol: 0.002 }],

      solution: [
        {
          text: '$\\mu=\\tfrac{8}{15}$ (Exercise 4.14), and $E(X^2)=\\displaystyle\\int_0^1 x^2\\cdot\\dfrac{2(x+2)}{5}\\,dx=\\dfrac25\\left[\\tfrac{x^4}{4}+\\tfrac{2x^3}{3}\\right]_0^1=\\dfrac{11}{30}$.',
        },

        {
          text: '$\\sigma^2=\\tfrac{11}{30}-\\left(\\tfrac{8}{15}\\right)^2\\approx0.3667-0.2844\\approx0.0822$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-vacuum-variance',

    chapter: 'expectation',

    topic: 'Variance and covariance',

    difficulty: 'medium',

    citation: 'Walpole §4.2, Exercise 4.39',

    instance: {
      prompt:
        'The total number of hours, in units of $100$ hours, that a family runs a vacuum cleaner over a year has ' +
        'density $f(x)=x$ for $0<x<1$, $f(x)=2-x$ for $1\\le x<2$. Find the variance of $X$.',

      parts: [{ kind: 'numeric', answer: 1 / 6, tol: 0.005 }],

      solution: [
        {
          text: '$\\mu=1$ (Exercise 4.13). $E(X^2)=\\displaystyle\\int_0^1x^3\\,dx+\\int_1^2x^2(2-x)\\,dx=\\tfrac14+\\tfrac{11}{12}=\\tfrac76$.',
        },

        {
          text: '$\\sigma^2=\\tfrac76-1^2=\\tfrac16$.',
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
    id: 'ch04-book-joint-3-39-covariance',

    chapter: 'expectation',

    topic: 'Variance and covariance',

    difficulty: 'hard',

    citation: 'Walpole §4.2, Exercise 4.44',

    instance: {
      prompt:
        'For the joint distribution $f(1,0)=\\tfrac3{70}$, $f(2,0)=\\tfrac9{70}$, $f(3,0)=\\tfrac3{70}$, $f(0,1)=\\tfrac2{70}$, ' +
        '$f(1,1)=\\tfrac{18}{70}$, $f(2,1)=\\tfrac{18}{70}$, $f(3,1)=\\tfrac2{70}$, $f(0,2)=\\tfrac3{70}$, $f(1,2)=\\tfrac9{70}$, ' +
        '$f(2,2)=\\tfrac3{70}$, find the covariance of $X$ and $Y$.',

      parts: [{ kind: 'numeric', answer: -3 / 14, tol: 0.01 }],

      solution: [
        {
          text: 'Direct enumeration over the nonzero cells gives $E(XY)=\\tfrac97$, $\\mu_X=1.5$, $\\mu_Y=1.0$.',
        },

        {
          text: 'By Theorem 4.4, $\\sigma_{XY}=E(XY)-\\mu_X\\mu_Y=\\tfrac97-1.5\\approx-0.2143=-\\tfrac{3}{14}$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-company-ab-variance-compare',

    chapter: 'expectation',

    topic: 'Variance and covariance',

    difficulty: 'easy',

    citation: 'IE0121 deck, Mean/variance worked example',

    instance: {
      prompt:
        'Two companies each send out an average of $2$ cars a day for official business. Company A\u2019s daily ' +
        'count has $f(1)=0.3$, $f(2)=0.4$, $f(3)=0.3$; company B\u2019s has $f(0)=0.2$, $f(1)=0.1$, $f(2)=0.3$, ' +
        '$f(3)=0.3$, $f(4)=0.1$. True or false: company B\u2019s variance is larger than company A\u2019s.',

      parts: [{ kind: 'tf', answer: true }],

      solution: [
        {
          text: 'Both distributions have mean $2$, so the means alone cannot distinguish them; the variance measures how far each spreads from that shared mean.',
        },

        {
          text: 'Company A: $E(X^2)=(1)(0.3)+(4)(0.4)+(9)(0.3)=4.6$, so $\\sigma_A^2=4.6-4=0.6$.',
        },

        {
          text: 'Company B: $E(X^2)=(1)(0.1)+(4)(0.3)+(9)(0.3)+(16)(0.1)=5.6$, so $\\sigma_B^2=5.6-4=1.6$.',
        },

        {
          text: '$1.6>0.6$, so the statement is true: company B\u2019s counts really do swing further from their common mean.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-unitsquare-covariance',

    chapter: 'expectation',

    topic: 'Variance and covariance',

    difficulty: 'hard',

    citation: 'Walpole §4.2, Review Exercise 4.80',

    instance: {
      prompt:
        '$X$ and $Y$ have joint density $f(x,y)=x+y$ for $0<x<1$, $0<y<1$, and $0$ elsewhere. Find the covariance ' +
        'of $X$ and $Y$.',

      parts: [{ kind: 'numeric', answer: -1 / 144, tol: 0.001 }],

      solution: [
        {
          text: 'By symmetry of $f$ in $x$ and $y$, $\\mu_X=\\mu_Y=\\tfrac{7}{12}$ (deck Example 4.13).',
        },

        {
          text: '$E(XY)=\\displaystyle\\int_0^1\\!\\!\\int_0^1 xy(x+y)\\,dx\\,dy=\\int_0^1\\!\\!\\int_0^1(x^2y+xy^2)\\,dx\\,dy=\\tfrac16+\\tfrac16=\\tfrac13$.',
        },

        {
          text: '$\\sigma_{XY}=\\tfrac13-\\left(\\tfrac{7}{12}\\right)^2=\\tfrac13-\\tfrac{49}{144}=\\tfrac{48-49}{144}=-\\tfrac{1}{144}\\approx-0.0069$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-cov-scaling-tf',

    chapter: 'expectation',

    topic: 'Variance and covariance',

    difficulty: 'easy',

    citation: 'Walpole §4.2, Review Exercise 4.87',

    instance: {
      prompt:
        'True or false: for any random variables $X$ and $Y$ and constants $a$, $b$, $\\text{Cov}(aX,bY)=ab\\,\\text{Cov}(X,Y)$.',

      parts: [{ kind: 'tf', answer: true }],

      solution: [
        {
          text: '$\\text{Cov}(aX,bY)=E[(aX-a\\mu_X)(bY-b\\mu_Y)]=ab\\,E[(X-\\mu_X)(Y-\\mu_Y)]=ab\\,\\text{Cov}(X,Y)$.',
        },

        {
          text: 'Each constant factors straight out of its own deviation, the same way a constant factors out of Corollary 4.2\u2019s $E(aX)=aE(X)$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-ordered-uniform-correlation',

    chapter: 'expectation',

    topic: 'Variance and covariance',

    difficulty: 'hard',

    citation: 'Walpole §4.2, Exercise 4.52',

    instance: {
      prompt:
        'Random variables $X$ and $Y$ have joint density $f(x,y)=2$ for $0<x\\le y<1$, and $0$ elsewhere. ' +
        'Determine the correlation coefficient between $X$ and $Y$.',

      parts: [{ kind: 'numeric', answer: 0.5, tol: 0.01 }],

      solution: [
        {
          text: 'Marginals: $f_X(x)=2(1-x)$ for $0<x<1$ (so $\\mu_X=\\tfrac13$, $\\sigma_X^2=\\tfrac{1}{18}$, matching Exercises 4.12 and 4.37), and $f_Y(y)=2y$ for $0<y<1$ (so $\\mu_Y=\\tfrac23$, $\\sigma_Y^2=\\tfrac{1}{18}$).',
        },

        {
          text: '$E(XY)=\\displaystyle\\int_0^1\\!\\!\\int_0^y 2xy\\,dx\\,dy=\\int_0^1 y^3\\,dy=\\tfrac14$, so $\\sigma_{XY}=\\tfrac14-\\left(\\tfrac13\\right)\\left(\\tfrac23\\right)=\\tfrac{1}{36}$.',
        },

        {
          text: '$\\rho_{XY}=\\dfrac{1/36}{\\sqrt{(1/18)(1/18)}}=\\dfrac{1/36}{1/18}=0.5$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-zero-cov-independence-tf',

    chapter: 'expectation',

    topic: 'Variance and covariance',

    difficulty: 'medium',

    citation: 'Walpole §4.5, Potential Misconceptions and Hazards',

    instance: {
      prompt:
        'True or false: if $\\sigma_{XY}=0$ for two random variables $X$ and $Y$, then $X$ and $Y$ must be ' +
        'statistically independent.',

      parts: [{ kind: 'tf', answer: false }],

      solution: [
        {
          text: 'Corollary 4.5 only runs one direction: independence forces $\\sigma_{XY}=0$. It never claims the converse.',
        },

        {
          text: 'Covariance only detects a *linear* tendency to move together, so two measurements tangled in a curved, nonlinear way can have $\\sigma_{XY}=0$ while remaining dependent — the statement is false.',
        },
      ],
    },
  }),

  // ---- 4.3 Means and variances of linear combinations of random variables ----

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
    id: 'ch04-book-exponential-linear-transform',

    chapter: 'expectation',

    topic: 'Linear combinations',

    difficulty: 'medium',

    citation: 'Walpole §4.2, Exercise 4.43',

    instance: {
      prompt:
        'The random variable $Y=3X-2$, where $X$ has density $f(x)=\\tfrac14e^{-x/4}$ for $x>0$. Find the mean ' +
        'and variance of $Y$.',

      parts: [
        { kind: 'numeric', label: 'μY', answer: 10, tol: 0.05 },

        { kind: 'numeric', label: 'σY²', answer: 144, tol: 1 },
      ],

      solution: [
        {
          text: '$X$ is exponential with $\\theta=4$, so $\\mu_X=4$ and $\\sigma_X^2=\\theta^2=16$.',
        },

        {
          text: 'By Theorem 4.5, $\\mu_Y=3\\mu_X-2=3(4)-2=10$.',
        },

        {
          text: 'By Corollary 4.7 and Corollary 4.8, $\\sigma_Y^2=3^2\\sigma_X^2=9(16)=144$ — the shift by $-2$ contributes nothing to the variance.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-errors-linear-transform',

    chapter: 'expectation',

    topic: 'Linear combinations',

    difficulty: 'medium',

    citation: 'Walpole §4.3, Exercise 4.53',

    instance: {
      prompt:
        'Referring to Exercise 4.35 ($X$ = errors per $100$ lines of code, $\\mu=4.11$, $\\sigma^2=0.7379$), find ' +
        'the mean and variance of $Z=3X-2$.',

      parts: [
        { kind: 'numeric', label: 'E(Z)', answer: 10.33, tol: 0.01 },

        { kind: 'numeric', label: 'Var(Z)', answer: 6.6411, tol: 0.01 },
      ],

      solution: [
        {
          text: 'By Theorem 4.5, $E(Z)=3(4.11)-2=12.33-2=10.33$.',
        },

        {
          text: 'By Corollary 4.7 and Corollary 4.8, $\\sigma_Z^2=3^2\\sigma_X^2=9(0.7379)\\approx6.6411$ — the subtracted constant leaves the spread untouched.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-powerfailures-linear-transform',

    chapter: 'expectation',

    topic: 'Linear combinations',

    difficulty: 'easy',

    citation: 'Walpole §4.3, Exercise 4.54',

    instance: {
      prompt:
        'Using Theorem 4.5 and Corollary 4.6, find the mean and variance of $Z=5X+3$, where $X$ is the ' +
        'power-failure count of Exercise 4.36 ($\\mu=1$, $\\sigma^2=1$).',

      parts: [
        { kind: 'numeric', label: 'E(Z)', answer: 8, tol: 0.01 },

        { kind: 'numeric', label: 'Var(Z)', answer: 25, tol: 0.01 },
      ],

      solution: [
        {
          text: '$E(Z)=5E(X)+3=5(1)+3=8$.',
        },

        {
          text: '$\\sigma_Z^2=5^2\\sigma_X^2=25(1)=25$ — squaring the multiplier, not the whole affine rule, is what scales the variance.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-milk-profit-expected',

    chapter: 'expectation',

    topic: 'Linear combinations',

    difficulty: 'hard',

    citation: 'Walpole §4.3, Exercise 4.55',

    instance: {
      prompt:
        'A grocery store buys $5$ cartons of skim milk at $\\$1.20$ each and retails them at $\\$1.65$ each. ' +
        'Unsold cartons are credited back at three-fourths of the wholesale price, $\\$0.90$ each. If the number ' +
        'sold, $X$, has $f(0)=\\tfrac1{15}$, $f(1)=\\tfrac2{15}$, $f(2)=\\tfrac2{15}$, $f(3)=\\tfrac3{15}$, ' +
        '$f(4)=\\tfrac4{15}$, $f(5)=\\tfrac3{15}$, find the expected profit.',

      parts: [{ kind: 'numeric', answer: 0.8, tol: 0.01 }],

      solution: [
        {
          text: 'Profit is $g(X)=1.65X+0.90(5-X)-5(1.20)=0.75X-1.5$, a linear function of $X$.',
        },

        {
          text: '$E(X)=(0)\\tfrac1{15}+(1)\\tfrac2{15}+(2)\\tfrac2{15}+(3)\\tfrac3{15}+(4)\\tfrac4{15}+(5)\\tfrac3{15}=\\tfrac{46}{15}\\approx3.0667$.',
        },

        {
          text: 'By Theorem 4.5, $E[g(X)]=0.75E(X)-1.5=0.75(3.0667)-1.5\\approx\\$0.80$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-discrete-g-quadratic-expansion',

    chapter: 'expectation',

    topic: 'Linear combinations',

    difficulty: 'medium',

    citation: 'Walpole §4.3, Exercise 4.57',

    instance: {
      prompt:
        'A random variable $X$ has distribution $f(-3)=\\tfrac16$, $f(6)=\\tfrac12$, $f(9)=\\tfrac13$. Find $E(X)$ ' +
        'and $E(X^2)$, and use these values to evaluate $E[(2X+1)^2]$.',

      parts: [
        { kind: 'numeric', label: 'E(X)', answer: 5.5, tol: 0.01 },

        { kind: 'numeric', label: 'E(X²)', answer: 46.5, tol: 0.01 },

        { kind: 'numeric', label: 'E[(2X+1)²]', answer: 209, tol: 0.5 },
      ],

      solution: [
        {
          text: '$E(X)=(-3)\\tfrac16+(6)\\tfrac12+(9)\\tfrac13=-0.5+3+3=5.5$.',
        },

        {
          text: '$E(X^2)=(9)\\tfrac16+(36)\\tfrac12+(81)\\tfrac13=1.5+18+27=46.5$.',
        },

        {
          text: 'By Theorem 4.6, $E[(2X+1)^2]=E(4X^2+4X+1)=4E(X^2)+4E(X)+1=4(46.5)+4(5.5)+1=186+22+1=209$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-recover-mean-from-moments',

    chapter: 'expectation',

    topic: 'Linear combinations',

    difficulty: 'hard',

    citation: 'Walpole §4.3, Exercise 4.59',

    instance: {
      prompt:
        'A random variable $X$ satisfies $E[(X-1)^2]=10$ and $E[(X-2)^2]=6$. Find $\\mu$ and $\\sigma^2$.',

      parts: [
        { kind: 'numeric', label: 'μ', answer: 3.5, tol: 0.01 },

        { kind: 'numeric', label: 'σ²', answer: 3.75, tol: 0.01 },
      ],

      solution: [
        {
          text: 'Expand both by Theorem 4.6: $E(X^2)-2\\mu+1=10$ and $E(X^2)-4\\mu+4=6$.',
        },

        {
          text: 'Subtracting the second from the first eliminates $E(X^2)$: $2\\mu-3=4$, so $\\mu=3.5$.',
        },

        {
          text: 'Then $E(X^2)=9+2\\mu=9+7=16$, and $\\sigma^2=E(X^2)-\\mu^2=16-12.25=3.75$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-independent-linear-variance',

    chapter: 'expectation',

    topic: 'Linear combinations',

    difficulty: 'easy',

    citation: 'Walpole §4.3, Exercise 4.62',

    instance: {
      prompt:
        '$X$ and $Y$ are independent random variables with $\\sigma_X^2=5$ and $\\sigma_Y^2=3$. Find the variance ' +
        'of $Z=-2X+4Y-3$.',

      parts: [{ kind: 'numeric', answer: 68, tol: 0 }],

      solution: [
        {
          text: 'The constant $-3$ does not affect the variance, and independence sends $\\sigma_{XY}$ to $0$ in Theorem 4.9.',
        },

        {
          text: '$\\sigma_Z^2=(-2)^2(5)+(4)^2(3)=20+48=68$ — note the squared coefficient makes the sign of $-2$ irrelevant here.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-dependent-linear-variance-trap',

    chapter: 'expectation',

    topic: 'Linear combinations',

    difficulty: 'medium',

    citation: 'Walpole §4.3, Exercise 4.63',

    instance: {
      prompt:
        'Repeat Exercise 4.62 ($\\sigma_X^2=5$, $\\sigma_Y^2=3$, $Z=-2X+4Y-3$) if $X$ and $Y$ are not independent ' +
        'and $\\sigma_{XY}=1$.',

      parts: [{ kind: 'numeric', answer: 52, tol: 0 }],

      solution: [
        {
          text: 'Now the cross term in Theorem 4.9 survives: $\\sigma_Z^2=(-2)^2(5)+(4)^2(3)+2(-2)(4)(1)$.',
        },

        {
          text: '$=20+48-16=52$ — smaller than the independent case\u2019s $68$, because here the cross term is negative even though $\\sigma_{XY}$ itself is positive, since $a$ and $b$ have opposite signs.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-dice-sum-diff-product',

    chapter: 'expectation',

    topic: 'Linear combinations',

    difficulty: 'easy',

    citation: 'Walpole §4.3, Exercise 4.65',

    instance: {
      prompt:
        'Let $X$ be the number on a red die and $Y$ the number on an independently tossed green die. Find ' +
        '(a) $E(X+Y)$, (b) $E(X-Y)$, (c) $E(XY)$.',

      parts: [
        { kind: 'numeric', label: 'E(X+Y)', answer: 7, tol: 0.01 },

        { kind: 'numeric', label: 'E(X−Y)', answer: 0, tol: 0.01 },

        { kind: 'numeric', label: 'E(XY)', answer: 12.25, tol: 0.01 },
      ],

      solution: [
        {
          text: 'Each die has $E(X)=E(Y)=3.5$. By Corollary 4.4, $E(X+Y)=3.5+3.5=7$ and $E(X-Y)=3.5-3.5=0$, whether or not the dice are independent.',
        },

        {
          text: 'The dice are independent, so by Theorem 4.8, $E(XY)=E(X)E(Y)=(3.5)(3.5)=12.25$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-dice-variance-combo',

    chapter: 'expectation',

    topic: 'Linear combinations',

    difficulty: 'hard',

    citation: 'Walpole §4.3, Exercise 4.66',

    instance: {
      prompt:
        'Let $X$ be the number on a green die and $Y$ the number on an independently tossed red die, each with ' +
        '$\\sigma^2=\\tfrac{35}{12}$. Find the variance of (a) $2X-Y$, (b) $X+3Y-5$.',

      parts: [
        { kind: 'numeric', label: 'Var(2X − Y)', answer: 175 / 12, tol: 0.02 },

        { kind: 'numeric', label: 'Var(X + 3Y − 5)', answer: 350 / 12, tol: 0.02 },
      ],

      solution: [
        {
          text: 'The dice are independent, so Corollary 4.9 applies: $\\sigma^2_{aX+bY}=a^2\\sigma_X^2+b^2\\sigma_Y^2$.',
        },

        {
          text: '$\\text{Var}(2X-Y)=(4+1)\\left(\\tfrac{35}{12}\\right)=\\tfrac{175}{12}\\approx14.58$.',
        },

        {
          text: 'The constant $-5$ in the second part changes nothing: $\\text{Var}(X+3Y-5)=(1+9)\\left(\\tfrac{35}{12}\\right)=\\tfrac{350}{12}\\approx29.17$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch04-book-dealer-profit-full-analysis',

    chapter: 'expectation',

    topic: 'Linear combinations',

    difficulty: 'hard',

    citation: 'Walpole §4.3, Review Exercise 4.91',

    instance: {
      prompt:
        'A dealer\u2019s profit, in units of $\\$5000$, on a new automobile is $X$ with density $f(x)=2(1-x)$ for ' +
        '$0\\le x\\le1$. (a) Find the variance of the dealer\u2019s profit in dollars. (b) Find the probability that ' +
        'the profit exceeds $\\$500$.',

      parts: [
        { kind: 'numeric', label: 'Var(profit in dollars)', answer: (25000000 * 1) / 18, tol: 100 },

        { kind: 'numeric', label: 'P(profit > $500)', answer: 0.81, tol: 0.005 },
      ],

      solution: [
        {
          text: 'From Exercise 4.37, $\\sigma_X^2=\\tfrac1{18}$ in units of $\\$5000$. Converting units multiplies variance by the square of the conversion factor (Corollary 4.8): $\\sigma^2_{\\$}=5000^2\\cdot\\tfrac1{18}\\approx\\$1{,}388{,}889$.',
        },

        {
          text: '$\\$500$ is $0.1$ of a unit, so $P(\\text{profit}>500)=P(X>0.1)=\\displaystyle\\int_{0.1}^1 2(1-x)\\,dx=\\left[2x-x^2\\right]_{0.1}^1$.',
        },

        {
          text: '$=(2-1)-(0.2-0.01)=1-0.19=0.81$.',
        },
      ],
    },
  }),
];
