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

  bookQuestion({
    id: 'ch05-book-bank-a1',

    chapter: 'discrete-distributions',

    topic: 'Discrete uniform',

    difficulty: 'easy',

    citation: 'Alshwawra Ch 5 bank, A1',

    instance: {
      prompt:
        'A CNC machining centre selects one of its 8 tool stations, numbered 1 through 8, uniformly at random for a trial cut. Let $X$ be the number of the selected station. Find the variance of $X$.',

      parts: [{ kind: 'mcq', choices: ['5.25', '4.50', '5.33', '2.29'], answer: 0 }],

      solution: [
        {
          text: '$X$ is discrete uniform on the consecutive integers $1,\\ldots,8$, so $\\sigma^2=\\dfrac{N^2-1}{12}$ with $N=8$.',
        },

        {
          text: '$\\sigma^2=\\dfrac{8^2-1}{12}=\\dfrac{63}{12}=5.25$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a2',

    chapter: 'discrete-distributions',

    topic: 'Discrete uniform',

    difficulty: 'easy',

    citation: 'Alshwawra Ch 5 bank, A2',

    instance: {
      prompt:
        'A resistance decade box selects one of the five resistances $12,15,18,22,27\\ \\text{k}\\Omega$ with equal probability for a calibration run. Find the variance of the selected resistance, in $\\text{k}\\Omega^2$.',

      parts: [{ kind: 'mcq', choices: ['5.27', '27.76', '34.70', '18.80'], answer: 1 }],

      solution: [
        {
          text: 'Each of the 5 resistances is equally likely, so this is a discrete uniform random variable over an arbitrary finite set, not consecutive integers -- the variance has to be computed directly rather than from the $(N^2-1)/12$ shortcut.',
        },

        {
          text: '$\\mu=\\dfrac{12+15+18+22+27}{5}=18.80$, and $E[X^2]=\\dfrac{12^2+15^2+18^2+22^2+27^2}{5}=381.20$.',
        },

        {
          text: '$\\sigma^2=E[X^2]-\\mu^2=381.20-18.80^2=27.76\\ \\text{k}\\Omega^2$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a3',

    chapter: 'discrete-distributions',

    topic: 'Discrete uniform',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A3',

    instance: {
      prompt:
        'An AGV is dispatched to one of $N$ docking bays, numbered 1 through $N$, with equal probability. The variance of the bay number is known to be 10. Find the probability that the AGV is sent to a bay numbered 9 or higher.',

      parts: [{ kind: 'mcq', choices: ['0.3636', '0.2500', '0.2727', '0.1818'], answer: 2 }],

      solution: [
        {
          text: '$X$ is discrete uniform on $1,\\ldots,N$, so $\\sigma^2=\\dfrac{N^2-1}{12}=10$ pins down $N$ before anything else can be computed.',
        },

        {
          text: '$N^2=121$, so $N=11$. Of the 11 equally likely bays, 3 are numbered 9 or higher.',
        },

        {
          text: '$P(X\\ge9)=\\dfrac{3}{11}\\approx0.2727$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a5',

    chapter: 'discrete-distributions',

    topic: 'Discrete uniform',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A5',

    instance: {
      prompt:
        'The last digit $X$ of a serial number stamped on a bearing is uniform on $\\{0,1,\\ldots,9\\}$. A sorting cost $C=5+2X$ (in JD) is incurred. Find the variance of $C$.',

      parts: [{ kind: 'mcq', choices: ['33.00', '8.25', '16.50', '66.00'], answer: 0 }],

      solution: [
        {
          text: '$X$ is discrete uniform on the 10 consecutive integers $0,\\ldots,9$, so $\\text{Var}(X)=\\dfrac{10^2-1}{12}=8.25$.',
        },

        {
          text: 'A linear transform scales variance by the square of its coefficient: $\\text{Var}(C)=\\text{Var}(5+2X)=2^2\\,\\text{Var}(X)=4(8.25)=33.00$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a6',

    chapter: 'discrete-distributions',

    topic: 'Discrete uniform',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A6',

    instance: {
      prompt:
        'A programmable signal generator outputs one of 16 equally likely phase steps numbered $0,1,\\ldots,15$. Given that the generated step number is at least 5, find the probability that it is an exact multiple of 3.',

      parts: [{ kind: 'mcq', choices: ['0.4545', '0.3636', '0.3125', '0.2500'], answer: 1 }],

      solution: [
        {
          text: 'Conditioning on "step $\\ge5$" restricts the sample space to $\\{5,6,\\ldots,15\\}$, 11 values, each still equally likely relative to one another.',
        },

        {
          text: 'Multiples of 3 in that restricted range are $6,9,12,15$ -- 4 of the 11 values, so $P(\\text{multiple of }3\\mid X\\ge5)=\\dfrac{4}{11}\\approx0.3636$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b1',

    chapter: 'discrete-distributions',

    topic: 'Discrete uniform',

    difficulty: 'easy',

    citation: 'Alshwawra Ch 5 bank, B1',

    instance: {
      prompt:
        'A robotic arm parks at one of 12 equally likely index positions numbered 1 through 12. Determine the standard deviation of the parking index.',

      parts: [{ kind: 'numeric', answer: 3.4521, tol: 0.001 }],

      solution: [
        {
          text: 'The parking index is discrete uniform on the 12 consecutive integers $1,\\ldots,12$, so $\\sigma^2=\\dfrac{12^2-1}{12}=11.9167$.',
        },

        {
          text: '$\\sigma=\\sqrt{11.9167}\\approx3.4521$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b2',

    chapter: 'discrete-distributions',

    topic: 'Discrete uniform',

    difficulty: 'easy',

    citation: 'Alshwawra Ch 5 bank, B2',

    instance: {
      prompt:
        'A calibration rig applies one of the loads $2,4,6,8,10,12$ kN, each equally likely. Determine the variance of the applied load.',

      parts: [{ kind: 'numeric', answer: 11.6667, tol: 0.001 }],

      solution: [
        {
          text: 'These 6 loads are equally spaced but the shortcut $(N^2-1)/12$ only applies to consecutive integers, so compute directly: $\\mu=\\dfrac{2+4+6+8+10+12}{6}=7$.',
        },

        {
          text: '$E[X^2]=\\dfrac{4+16+36+64+100+144}{6}=60.6667$, so $\\sigma^2=60.6667-7^2\\approx11.6667\\ \\text{kN}^2$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b4',

    chapter: 'discrete-distributions',

    topic: 'Discrete uniform',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, B4',

    instance: {
      prompt:
        'Two independent serial-number digits are each uniform on $\\{0,1,\\ldots,9\\}$. Determine the probability that the two digits sum to exactly 9.',

      parts: [{ kind: 'numeric', answer: 0.1, tol: 0.0005 }],

      solution: [
        {
          text: 'Each of the $10\\times10=100$ equally likely digit pairs is one outcome; count the ones summing to 9.',
        },

        {
          text: 'The pairs $(0,9),(1,8),\\ldots,(9,0)$ give 10 favourable outcomes, so $P(\\text{sum}=9)=\\dfrac{10}{100}=0.1000$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b5',

    chapter: 'discrete-distributions',

    topic: 'Discrete uniform',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, B5',

    instance: {
      prompt:
        'A pressure test selects one of the 15 settings $10,20,30,\\ldots,150$ kPa with equal probability. Determine the variance of the selected pressure.',

      parts: [{ kind: 'numeric', answer: 1866.67, tol: 0.5 }],

      solution: [
        {
          text: 'Write the pressure as $X=10K$ where $K$ is discrete uniform on the consecutive integers $1,\\ldots,15$, so $\\text{Var}(K)=\\dfrac{15^2-1}{12}=18.6667$.',
        },

        {
          text: 'Scaling by 10 scales variance by $10^2$: $\\text{Var}(X)=100(18.6667)\\approx1866.67\\ \\text{kPa}^2$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b6',

    chapter: 'discrete-distributions',

    topic: 'Discrete uniform',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, B6',

    instance: {
      prompt:
        'A random integer $X$ is drawn uniformly from 1 to 20 to index a test specimen. Determine $E[X^2]$.',

      parts: [{ kind: 'numeric', answer: 143.5, tol: 0.05 }],

      solution: [
        {
          text: 'For $X$ discrete uniform on $1,\\ldots,N$, the sum-of-squares identity gives $E[X^2]=\\dfrac{(N+1)(2N+1)}{6}$ directly, without first finding the mean and variance separately.',
        },

        {
          text: 'With $N=20$: $E[X^2]=\\dfrac{21\\cdot41}{6}=\\dfrac{861}{6}=143.50$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a7',

    chapter: 'discrete-distributions',

    topic: 'Binomial and multinomial',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A7',

    instance: {
      prompt:
        'In a robotic welding cell each weld is defective independently with probability $0.06$. For a frame containing 25 welds, find the probability that at least 3 welds are defective.',

      parts: [{ kind: 'mcq', choices: ['0.1273', '0.0598', '0.1871', '0.4473'], answer: 2 }],

      solution: [
        {
          text: 'Welds are independent with the same defect chance across a fixed count of 25 -- a binomial count with $n=25$, $p=0.06$.',
        },

        {
          text: '$P(X\\ge3)=1-P(X\\le2)=1-0.8129\\approx0.1871$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a8',

    chapter: 'discrete-distributions',

    topic: 'Binomial and multinomial',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, A8',

    instance: {
      prompt:
        'A supplier\'s pistons are defective independently with probability 0.02. Find the smallest sample size that gives at least a 95% chance of containing at least one defective piston.',

      parts: [{ kind: 'mcq', choices: ['148', '150', '119', '149'], answer: 3 }],

      solution: [
        {
          text: '"At least one defective" is the complement of "none defective": $P(X\\ge1)=1-(0.98)^n$.',
        },

        {
          text: 'Solving $1-(0.98)^n\\ge0.95$ for the smallest integer $n$ gives $n=149$ ($n=148$ falls just short).',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a9',

    chapter: 'discrete-distributions',

    topic: 'Binomial and multinomial',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A9',

    instance: {
      prompt:
        'For the number of out-of-tolerance shafts $X$ in a production run, $X$ follows a binomial distribution with mean 12 and variance 7.2. Find the probability that exactly 12 shafts are out of tolerance.',

      parts: [{ kind: 'mcq', choices: ['0.1474', '0.5785', '0.1360', '0.4000'], answer: 0 }],

      solution: [
        {
          text: 'The mean and variance of a binomial pin down $n$ and $p$ together: $np=12$ and $npq=7.2$, so $q=7.2/12=0.6$, hence $p=0.4$ and $n=12/0.4=30$.',
        },

        {
          text: '$P(X=12)=b(12;30,0.4)\\approx0.1474$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a10',

    chapter: 'discrete-distributions',

    topic: 'Binomial and multinomial',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, A10',

    instance: {
      prompt:
        'Each of 20 vibration sensors installed on a turbine fails during the first year independently with probability 0.10. Given that at least one sensor fails, find the probability that exactly two fail.',

      parts: [{ kind: 'mcq', choices: ['0.6769', '0.3246', '0.2852', '0.4689'], answer: 1 }],

      solution: [
        {
          text: 'This is a conditional probability, $P(X=2\\mid X\\ge1)=\\dfrac{P(X=2)}{P(X\\ge1)}=\\dfrac{P(X=2)}{1-P(X=0)}$, with $X$ binomial, $n=20$, $p=0.10$.',
        },

        {
          text: '$P(X=2)=0.2852$ and $P(X=0)=0.1216$, so $\\dfrac{0.2852}{1-0.1216}=\\dfrac{0.2852}{0.8784}\\approx0.3246$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a11',

    chapter: 'discrete-distributions',

    topic: 'Binomial and multinomial',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A11',

    instance: {
      prompt:
        'A lot is accepted if, out of 15 randomly tested pressure switches, at most one fails the burst test. Each switch fails independently with probability 0.10. Find the probability of accepting the lot.',

      parts: [{ kind: 'mcq', choices: ['0.3432', '0.8159', '0.5490', '0.2059'], answer: 2 }],

      solution: [
        {
          text: 'Accepting the lot means $X\\le1$ for $X$ binomial with $n=15$, $p=0.10$.',
        },

        {
          text: '$P(X\\le1)=P(X=0)+P(X=1)=0.2059+0.3432\\approx0.5490$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a12',

    chapter: 'discrete-distributions',

    topic: 'Binomial and multinomial',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A12',

    instance: {
      prompt:
        'The number of defective micro-switches in a tray of 50 is binomial with $p=0.04$. The total inspection cost is $C=200+150X$ JD, where $X$ is the number of defectives. Find the standard deviation of $C$, in JD.',

      parts: [{ kind: 'mcq', choices: ['300.00', '1.39', '212.13', '207.85'], answer: 3 }],

      solution: [
        {
          text: '$\\text{Var}(X)=npq=50(0.04)(0.96)=1.92$, so $\\sigma_X=\\sqrt{1.92}\\approx1.3856$.',
        },

        {
          text: 'A linear transform scales the standard deviation by the absolute value of its coefficient: $\\sigma_C=150\\,\\sigma_X\\approx207.85$ JD.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a13',

    chapter: 'discrete-distributions',

    topic: 'Binomial and multinomial',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, A13',

    instance: {
      prompt:
        'On each of 4 independent shifts, 10 castings are produced and each casting is defective with probability 0.05. Find the probability that exactly 2 of the 4 shifts produce no defective casting at all.',

      parts: [{ kind: 'mcq', choices: ['0.3463', '0.3585', '0.0135', '0.3750'], answer: 0 }],

      solution: [
        {
          text: 'This nests two binomial layers: within a shift, "no defective casting" among 10 castings has probability $P(\\text{clean shift})=(0.95)^{10}\\approx0.5987$.',
        },

        {
          text: 'Across the 4 shifts, the number of clean shifts is itself binomial with $n=4$, $p=0.5987$: $P(X=2)=\\binom{4}{2}(0.5987)^2(0.4013)^2\\approx0.3463$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a14',

    chapter: 'discrete-distributions',

    topic: 'Binomial and multinomial',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A14',

    instance: {
      prompt:
        'A cooling system contains 6 independent pumps, each operating successfully with probability 0.85. The system functions only if at least 4 pumps operate. Find the reliability of the system.',

      parts: [{ kind: 'mcq', choices: ['0.0473', '0.9527', '0.1762', '0.7765'], answer: 1 }],

      solution: [
        {
          text: 'Operating pumps among the 6 form a binomial count with $n=6$, $p=0.85$, and reliability is $P(X\\ge4)$.',
        },

        {
          text: '$P(X\\ge4)=P(4)+P(5)+P(6)\\approx0.9527$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a15',

    chapter: 'discrete-distributions',

    topic: 'Binomial and multinomial',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, A15',

    instance: {
      prompt:
        'For a batch of 10 injection-moulded parts, the number of parts with flash follows a binomial distribution in which $P(X=2)=P(X=3)$. Find the variance of $X$.',

      parts: [{ kind: 'mcq', choices: ['1.408', '0.273', '1.983', '2.727'], answer: 2 }],

      solution: [
        {
          text: 'Setting the two point probabilities equal, $\\binom{10}{2}p^2q^8=\\binom{10}{3}p^3q^7$, and cancelling common factors gives $45q=120p$, so $p=\\dfrac{45}{165}\\approx0.2727$.',
        },

        {
          text: 'With $n=10$ and that $p$: $\\sigma^2=npq=10(0.2727)(0.7273)\\approx1.983$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a16',

    chapter: 'discrete-distributions',

    topic: 'Binomial and multinomial',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A16',

    instance: {
      prompt:
        'The number of porous castings among 12 is binomial with $p=0.15$. Find the probability that the number of porous castings falls within one standard deviation of its mean.',

      parts: [{ kind: 'mcq', choices: ['0.5936', '0.9078', '0.6826', '0.7656'], answer: 3 }],

      solution: [
        {
          text: '$\\mu=np=1.8$ and $\\sigma=\\sqrt{npq}\\approx1.2369$, so "within one standard deviation" is the interval $(0.563,\\,3.037)$, which contains the integers $1,2,3$.',
        },

        {
          text: '$P(1\\le X\\le3)=P(1)+P(2)+P(3)\\approx0.7656$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b7',

    chapter: 'discrete-distributions',

    topic: 'Binomial and multinomial',

    difficulty: 'easy',

    citation: 'Alshwawra Ch 5 bank, B7',

    instance: {
      prompt:
        'Rivets are set incorrectly with probability 0.05, independently. For a panel with 30 rivets, determine the probability that at most 2 rivets are set incorrectly.',

      parts: [{ kind: 'numeric', answer: 0.8122, tol: 0.0005 }],

      solution: [
        {
          text: 'Rivets are independent with the same failure chance across a fixed $n=30$ -- a binomial count with $p=0.05$.',
        },

        {
          text: '$P(X\\le2)=P(0)+P(1)+P(2)\\approx0.8122$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b9',

    chapter: 'discrete-distributions',

    topic: 'Binomial and multinomial',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, B9',

    instance: {
      prompt:
        'In a batch of 18 machined pins, each pin is undersized independently with probability 0.25. Determine the probability that 6 or more pins are undersized.',

      parts: [{ kind: 'numeric', answer: 0.2825, tol: 0.0005 }],

      solution: [
        {
          text: '$X$ is binomial with $n=18$, $p=0.25$, and the question asks for the upper tail $P(X\\ge6)$.',
        },

        {
          text: '$P(X\\ge6)=1-P(X\\le5)\\approx1-0.7175=0.2825$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b10',

    chapter: 'discrete-distributions',

    topic: 'Binomial and multinomial',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, B10',

    instance: {
      prompt:
        'The number of rejected boards $X$ in a lot is binomial with $p=0.30$ and $\\text{Var}(X)=8.4$. Determine $P(X\\le10)$.',

      parts: [{ kind: 'numeric', answer: 0.3087, tol: 0.0005 }],

      solution: [
        {
          text: '$\\text{Var}(X)=npq=8.4$ with $p=0.30$ gives $n=\\dfrac{8.4}{(0.3)(0.7)}=40$.',
        },

        {
          text: 'With $n=40$, $p=0.30$: $P(X\\le10)\\approx0.3087$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b13',

    chapter: 'discrete-distributions',

    topic: 'Binomial and multinomial',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, B13',

    instance: {
      prompt:
        'The number of porous castings among 12 is binomial with $p=0.15$. Determine the probability that this number exceeds its mean by more than two standard deviations.',

      parts: [{ kind: 'numeric', answer: 0.0239, tol: 0.0005 }],

      solution: [
        {
          text: '$\\mu=1.8$, $\\sigma\\approx1.2369$, so "more than two standard deviations above the mean" means $X>1.8+2(1.2369)\\approx4.274$, i.e. $X\\ge5$.',
        },

        {
          text: '$P(X\\ge5)=1-P(X\\le4)\\approx0.0239$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b15',

    chapter: 'discrete-distributions',

    topic: 'Binomial and multinomial',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, B15',

    instance: {
      prompt:
        'Line A produces 10 units with a 0.10 defect rate and line B produces 15 units with a 0.05 defect rate, all independently. Determine the probability that the combined output of 25 units contains no defective unit.',

      parts: [{ kind: 'numeric', answer: 0.1615, tol: 0.0005 }],

      solution: [
        {
          text: '"No defective unit" across both lines requires both lines individually clean, and the lines are independent, so the two clean-line probabilities multiply.',
        },

        {
          text: '$P(\\text{no defect})=(0.90)^{10}(0.95)^{15}\\approx(0.3487)(0.4633)\\approx0.1615$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b16',

    chapter: 'discrete-distributions',

    topic: 'Binomial and multinomial',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, B16',

    instance: {
      prompt:
        'For 8 independently tested valves, the probability that none leaks is 0.1678. Determine the variance of the number of leaking valves.',

      parts: [{ kind: 'numeric', answer: 1.28, tol: 0.005 }],

      solution: [
        {
          text: '"None leaks" is $P(X=0)=q^8=0.1678$, so $q=(0.1678)^{1/8}\\approx0.80$ and $p=0.20$.',
        },

        {
          text: '$\\sigma^2=npq=8(0.20)(0.80)=1.2800$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a17',

    chapter: 'discrete-distributions',

    topic: 'Geometric and negative binomial',

    difficulty: 'easy',

    citation: 'Alshwawra Ch 5 bank, A17',

    instance: {
      prompt:
        'A gas-turbine igniter succeeds on any attempt with probability 0.35, independently of previous attempts. Find the probability that the first successful ignition occurs on the 4th attempt.',

      parts: [{ kind: 'mcq', choices: ['0.0961', '0.0625', '0.8215', '0.2746'], answer: 0 }],

      solution: [
        {
          text: '$X$ counts attempts up to and including the first success, so it is geometric with $p=0.35$.',
        },

        {
          text: '$P(X=4)=g(4;0.35)=(0.65)^3(0.35)\\approx0.0961$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a19',

    chapter: 'discrete-distributions',

    topic: 'Geometric and negative binomial',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A19',

    instance: {
      prompt:
        'The number of start-up cycles until a diesel generator first fails to start has a geometric distribution with mean 4 cycles. Find the variance of this number.',

      parts: [{ kind: 'mcq', choices: ['3.46', '4.00', '12.00', '16.00'], answer: 2 }],

      solution: [
        {
          text: 'For the geometric distribution $\\mu=1/p$, so $\\mu=4$ gives $p=0.25$.',
        },

        {
          text: '$\\sigma^2=\\dfrac{q}{p^2}=\\dfrac{0.75}{0.0625}=12.00$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a20',

    chapter: 'discrete-distributions',

    topic: 'Geometric and negative binomial',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A20',

    instance: {
      prompt:
        'An ultrasonic probe detects a given flaw on any single pass with constant probability $p$. The probability that the flaw is detected within the first 3 passes is 0.784. Find the expected number of passes needed for the first detection.',

      parts: [{ kind: 'mcq', choices: ['0.78', '1.50', '1.28', '2.50'], answer: 3 }],

      solution: [
        {
          text: '"Detected within the first 3 passes" is $P(X\\le3)=1-q^3=0.784$, so $q^3=0.216$ and $q=0.6$, giving $p=0.4$.',
        },

        {
          text: '$E[X]=1/p=1/0.4=2.50$ passes.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a22',

    chapter: 'discrete-distributions',

    topic: 'Geometric and negative binomial',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, A22',

    instance: {
      prompt:
        'Machine A jams on any cycle with probability 0.10 and machine B with probability 0.05, independently. Find the expected number of cycles until the first jam occurs on at least one of the two machines.',

      parts: [{ kind: 'mcq', choices: ['200.000', '6.897', '10.000', '6.667'], answer: 1 }],

      solution: [
        {
          text: '"At least one machine jams" on a cycle has probability $1-(1-0.10)(1-0.05)=1-0.855=0.145$, and the cycles are independent, so waiting for the first such cycle is geometric with that combined chance.',
        },

        {
          text: '$E[X]=1/0.145\\approx6.897$ cycles.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a24',

    chapter: 'discrete-distributions',

    topic: 'Geometric and negative binomial',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, A24',

    instance: {
      prompt:
        'A calibration routine converges on each independent run with probability 0.25. Given that the first two runs failed to converge, find the probability that convergence first occurs on exactly the 5th run.',

      parts: [{ kind: 'mcq', choices: ['0.0791', '0.5625', '0.2500', '0.1406'], answer: 3 }],

      solution: [
        {
          text: 'The geometric distribution is memoryless: given 2 failures already, the number of further runs until convergence still has the original geometric distribution, so $P(X=5\\mid X>2)=P(X=3)$ counted from the 3rd run onward.',
        },

        {
          text: '$P(X=3)=(0.75)^2(0.25)\\approx0.1406$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a26',

    chapter: 'discrete-distributions',

    topic: 'Geometric and negative binomial',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A26',

    instance: {
      prompt:
        'A technician must find 4 cracked turbine blades; each blade inspected is cracked independently with probability 0.25. Find the standard deviation of the number of blades inspected.',

      parts: [{ kind: 'mcq', choices: ['4.000', '6.928', '16.000', '48.000'], answer: 1 }],

      solution: [
        {
          text: 'The number of blades inspected until the 4th crack is negative binomial with $r=4$, $p=0.25$, so $\\sigma^2=\\dfrac{rq}{p^2}=\\dfrac{4(0.75)}{0.0625}=48$.',
        },

        {
          text: '$\\sigma=\\sqrt{48}\\approx6.928$ blades.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a27',

    chapter: 'discrete-distributions',

    topic: 'Geometric and negative binomial',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, A27',

    instance: {
      prompt:
        'The number of trials needed to obtain the $r$th successful hydraulic seal has a negative binomial distribution with $p=0.20$ and mean 25 trials. Find the probability that exactly $r$ trials are needed.',

      parts: [{ kind: 'mcq', choices: ['0.00128', '0.32768', '0.00032', '0.00160'], answer: 2 }],

      solution: [
        {
          text: 'For the negative binomial, $\\mu=r/p=25$ with $p=0.20$ gives $r=5$.',
        },

        {
          text: 'Needing exactly $r=5$ trials means every one of the first 5 trials is a success: $P(X=r)=p^r=(0.2)^5=0.00032$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a28',

    chapter: 'discrete-distributions',

    topic: 'Geometric and negative binomial',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A28',

    instance: {
      prompt:
        'Each casting is acceptable with probability 0.40. Find the probability that the 2nd acceptable casting is obtained on or before the 5th casting inspected.',

      parts: [{ kind: 'mcq', choices: ['0.1382', '0.3456', '0.6826', '0.6630'], answer: 3 }],

      solution: [
        {
          text: '"On or before the 5th" sums the negative binomial pmf with $r=2$, $p=0.4$ over $x=2,3,4,5$, rather than evaluating a single term.',
        },

        {
          text: '$P(X\\le5)=\\sum_{x=2}^{5}b^*(x;2,0.4)\\approx0.6630$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a31',

    chapter: 'discrete-distributions',

    topic: 'Geometric and negative binomial',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, A31',

    instance: {
      prompt:
        'Components are conforming independently with probability 0.30. Given that exactly 1 conforming component was found in the first 4 components tested, find the probability that the 3rd conforming component occurs exactly on the 10th component.',

      parts: [{ kind: 'mcq', choices: ['0.3087', '0.0908', '0.1080', '0.0800'], answer: 2 }],

      solution: [
        {
          text: 'Given 1 conforming component already, the 3rd conforming component needs exactly 2 more conforming components among the next 6, with the 2nd of those landing exactly on trial 10 -- a negative binomial count restarted from trial 5, $r=2$, $p=0.3$.',
        },

        {
          text: '$P(X=10\\mid\\text{1 in first 4})=\\binom{5}{1}(0.3)^2(0.7)^4\\approx0.1080$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b17',

    chapter: 'discrete-distributions',

    topic: 'Geometric and negative binomial',

    difficulty: 'easy',

    citation: 'Alshwawra Ch 5 bank, B17',

    instance: {
      prompt:
        'A nondestructive scan detects a subsurface void with probability 0.12 per pass, independently. Determine the probability that the first detection occurs on the 6th pass.',

      parts: [{ kind: 'numeric', answer: 0.0633, tol: 0.0005 }],

      solution: [
        {
          text: '$X$ counts passes up to and including the first detection -- geometric with $p=0.12$.',
        },

        {
          text: '$P(X=6)=(0.88)^5(0.12)\\approx0.0633$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b18',

    chapter: 'discrete-distributions',

    topic: 'Geometric and negative binomial',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, B18',

    instance: {
      prompt:
        'For the same scan (detection probability 0.12 per pass), determine the probability that more than 10 passes are required for the first detection.',

      parts: [{ kind: 'numeric', answer: 0.2785, tol: 0.0005 }],

      solution: [
        {
          text: '"More than 10 passes required" means the first 10 passes all miss: $P(X>10)=q^{10}$.',
        },

        {
          text: '$P(X>10)=(0.88)^{10}\\approx0.2785$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b19',

    chapter: 'discrete-distributions',

    topic: 'Geometric and negative binomial',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, B19',

    instance: {
      prompt:
        'A servo self-test passes with probability 0.15 on each independent attempt. Determine the smallest number of attempts $n$ for which $P(\\text{first pass occurs within }n\\text{ attempts})\\ge0.90$.',

      parts: [{ kind: 'numeric', answer: 15, tol: 0.5 }],

      solution: [
        {
          text: '$P(X\\le n)=1-(0.85)^n$ for a geometric count with $p=0.15$; solve $1-(0.85)^n\\ge0.90$ for the smallest integer $n$.',
        },

        {
          text: '$n=14$ gives $1-(0.85)^{14}\\approx0.897$, just short; $n=15$ gives $\\approx0.913$, so $n=15$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b20',

    chapter: 'discrete-distributions',

    topic: 'Geometric and negative binomial',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, B20',

    instance: {
      prompt:
        'Cycles to the first bearing seizure follow a geometric distribution with $p=0.08$ per cycle. Determine the variance of the number of cycles.',

      parts: [{ kind: 'numeric', answer: 143.75, tol: 0.5 }],

      solution: [
        {
          text: 'For the geometric distribution, $\\sigma^2=\\dfrac{q}{p^2}$.',
        },

        {
          text: '$\\sigma^2=\\dfrac{0.92}{0.08^2}=\\dfrac{0.92}{0.0064}\\approx143.75$ cycles$^2$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b22',

    chapter: 'discrete-distributions',

    topic: 'Geometric and negative binomial',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, B22',

    instance: {
      prompt:
        'Each trial of a fatigue rig costs 40 JD and there is a fixed setup cost of 100 JD. A trial produces a valid result with probability 0.25, independently. Determine the expected total cost until the first valid result.',

      parts: [{ kind: 'numeric', answer: 260, tol: 1 }],

      solution: [
        {
          text: 'The number of trials until the first valid result is geometric with $p=0.25$, so $E[X]=1/0.25=4$ trials.',
        },

        {
          text: 'Total cost is $C=100+40X$, and expectation is linear: $E[C]=100+40E[X]=100+40(4)=260.00$ JD.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b24',

    chapter: 'discrete-distributions',

    topic: 'Geometric and negative binomial',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, B24',

    instance: {
      prompt:
        'A pneumatic gripper secures a part with probability 0.40 per attempt, independently. Determine the probability that the first successful grip occurs on an odd-numbered attempt.',

      parts: [{ kind: 'numeric', answer: 0.625, tol: 0.001 }],

      solution: [
        {
          text: 'Summing the geometric pmf over odd $x=1,3,5,\\ldots$ is a geometric series in $q^2$: $\\sum_{k=1}^{\\infty}q^{2k-2}p=\\dfrac{p}{1-q^2}$.',
        },

        {
          text: 'With $p=0.4$, $q=0.6$: $\\dfrac{0.4}{1-0.36}=\\dfrac{0.4}{0.64}=0.6250$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b26',

    chapter: 'discrete-distributions',

    topic: 'Geometric and negative binomial',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, B26',

    instance: {
      prompt:
        'An inspector must find 6 mislabelled cartons; each carton is mislabelled independently with probability 0.40. Determine the variance of the number of cartons inspected.',

      parts: [{ kind: 'numeric', answer: 22.5, tol: 0.5 }],

      solution: [
        {
          text: 'The number of cartons inspected until the 6th mislabelled one is negative binomial, $r=6$, $p=0.40$, so $\\sigma^2=\\dfrac{rq}{p^2}$.',
        },

        {
          text: '$\\sigma^2=\\dfrac{6(0.6)}{0.16}=22.50$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b28',

    chapter: 'discrete-distributions',

    topic: 'Geometric and negative binomial',

    difficulty: 'easy',

    citation: 'Alshwawra Ch 5 bank, B28',

    instance: {
      prompt:
        'A machine produces a conforming part with probability 0.18, independently. Determine the expected number of parts that must be produced to obtain the 3rd conforming part.',

      parts: [{ kind: 'numeric', answer: 16.6667, tol: 0.005 }],

      solution: [
        {
          text: 'For the negative binomial distribution, $E[X]=r/p$.',
        },

        {
          text: 'With $r=3$, $p=0.18$: $E[X]=3/0.18\\approx16.6667$ parts.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b30',

    chapter: 'discrete-distributions',

    topic: 'Geometric and negative binomial',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, B30',

    instance: {
      prompt:
        'A robotic welder produces an acceptable weld with probability 0.85, independently. Determine the probability that the 5th acceptable weld is the 8th weld made.',

      parts: [{ kind: 'numeric', answer: 0.0524, tol: 0.0005 }],

      solution: [
        {
          text: '"5th acceptable weld is the 8th weld made" is exactly the negative binomial pmf with $r=5$, $p=0.85$, evaluated at $x=8$.',
        },

        {
          text: '$P(X=8)=\\binom{7}{4}(0.85)^5(0.15)^3\\approx0.0524$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a33',

    chapter: 'discrete-distributions',

    topic: 'Hypergeometric',

    difficulty: 'easy',

    citation: 'Alshwawra Ch 5 bank, A33',

    instance: {
      prompt:
        'A lot of 50 relays contains 6 defective units. An inspector selects 8 relays at random without replacement. Find the probability that exactly one defective relay is selected.',

      parts: [{ kind: 'mcq', choices: ['0.4283', '0.3923', '0.7584', '0.1972'], answer: 0 }],

      solution: [
        {
          text: 'Sampling without replacement from a finite lot of 50 makes this hypergeometric with $N=50$, $k=6$, $n=8$.',
        },

        {
          text: '$P(X=1)=h(1;50,8,6)=\\dfrac{\\binom{6}{1}\\binom{44}{7}}{\\binom{50}{8}}\\approx0.4283$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a34',

    chapter: 'discrete-distributions',

    topic: 'Hypergeometric',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A34',

    instance: {
      prompt:
        'A shipment of 40 pumps contains 4 that leak. Six pumps are chosen at random without replacement and the shipment is accepted only if none of them leaks. Find the probability of acceptance.',

      parts: [{ kind: 'mcq', choices: ['0.4925', '0.5075', '0.5314', '0.9003'], answer: 1 }],

      solution: [
        {
          text: 'Acceptance requires $X=0$ leaking pumps among the sample, with $X$ hypergeometric, $N=40$, $k=4$, $n=6$.',
        },

        {
          text: '$P(X=0)=\\dfrac{\\binom{4}{0}\\binom{36}{6}}{\\binom{40}{6}}\\approx0.5075$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a35',

    chapter: 'discrete-distributions',

    topic: 'Hypergeometric',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A35',

    instance: {
      prompt:
        'From a bin of 100 fasteners, 20 of which are undersized, 10 fasteners are drawn without replacement. Find the variance of the number of undersized fasteners drawn.',

      parts: [{ kind: 'mcq', choices: ['1.2060', '2.0000', '1.4545', '1.6000'], answer: 2 }],

      solution: [
        {
          text: 'This is hypergeometric with $N=100$, $k=20$, $n=10$; the variance carries the finite population correction $\\dfrac{N-n}{N-1}$ that the binomial variance lacks.',
        },

        {
          text: '$\\sigma^2=\\dfrac{100-10}{100-1}(10)\\dfrac{20}{100}\\left(1-\\dfrac{20}{100}\\right)\\approx1.4545$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a36',

    chapter: 'discrete-distributions',

    topic: 'Hypergeometric',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A36',

    instance: {
      prompt:
        'A tray of 25 optical connectors contains 5 with scratched ferrules. Six connectors are drawn at random without replacement. Find the probability that at least 2 of them are scratched.',

      parts: [{ kind: 'mcq', choices: ['0.0698', '0.2736', '0.3446', '0.3434'], answer: 3 }],

      solution: [
        {
          text: 'Hypergeometric with $N=25$, $k=5$, $n=6$; the upper tail is easiest as a complement, $P(X\\ge2)=1-P(X=0)-P(X=1)$.',
        },

        {
          text: '$P(X=0)\\approx0.2181$ and $P(X=1)\\approx0.4385$, so $P(X\\ge2)\\approx1-0.2181-0.4385=0.3434$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a37',

    chapter: 'discrete-distributions',

    topic: 'Hypergeometric',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, A37',

    instance: {
      prompt:
        'A lot of 500 bearings contains 25 that are out of specification. Twenty bearings are sampled without replacement. Find the exact probability that the sample contains no out-of-specification bearing.',

      parts: [{ kind: 'mcq', choices: ['0.3512', '0.3585', '0.7363', '0.3679'], answer: 0 }],

      solution: [
        {
          text: 'Exact model: hypergeometric with $N=500$, $k=25$, $n=20$, so $P(X=0)=\\dfrac{\\binom{25}{0}\\binom{475}{20}}{\\binom{500}{20}}\\approx0.3512$.',
        },

        {
          text: 'Since $n/N=20/500=0.04\\le0.05$, the binomial approximation with $p=k/N=0.05$ would also be legitimate here and gives a close $0.3585$ -- but the question asks for the exact value.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a39',

    chapter: 'discrete-distributions',

    topic: 'Hypergeometric',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A39',

    instance: {
      prompt:
        'A storage bin holds 12 bolts from supplier A and 8 from supplier B. Six bolts are drawn at random without replacement for a torque study. Find the probability that exactly 4 come from supplier A.',

      parts: [{ kind: 'mcq', choices: ['2.8607', '0.1192', '0.3576', '0.3110'], answer: 2 }],

      solution: [
        {
          text: 'The lot splits into two categories (supplier A, supplier B), $N=20$, so counting supplier-A bolts drawn without replacement is hypergeometric with $k=12$, $n=6$.',
        },

        {
          text: '$P(X=4)=\\dfrac{\\binom{12}{4}\\binom{8}{2}}{\\binom{20}{6}}\\approx0.3576$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a40',

    chapter: 'discrete-distributions',

    topic: 'Hypergeometric',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, A40',

    instance: {
      prompt:
        'Of 30 hydraulic hoses in a crate, 8 have marginal crimps. Five hoses are drawn without replacement. Given that at least one marginal hose is drawn, find the probability that exactly two are marginal.',

      parts: [{ kind: 'mcq', choices: ['0.3026', '0.7479', '0.8980', '0.3712'], answer: 3 }],

      solution: [
        {
          text: 'Conditional probability: $P(X=2\\mid X\\ge1)=\\dfrac{P(X=2)}{1-P(X=0)}$, with $X$ hypergeometric, $N=30$, $k=8$, $n=5$.',
        },

        {
          text: '$P(X=2)\\approx0.3026$ and $P(X=0)\\approx0.1848$, so $\\dfrac{0.3026}{1-0.1848}=\\dfrac{0.3026}{0.8152}\\approx0.3712$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a41',

    chapter: 'discrete-distributions',

    topic: 'Hypergeometric',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A41',

    instance: {
      prompt:
        'A pallet of 60 machined housings contains 9 that require rework at a cost of 80 JD each. Twelve housings are drawn at random without replacement for a customer audit. Find the expected rework cost of the audited housings, in JD.',

      parts: [{ kind: 'mcq', choices: ['144.00', '720.00', '117.15', '480.00'], answer: 0 }],

      solution: [
        {
          text: 'The number of rework-needing housings in the sample is hypergeometric with $N=60$, $k=9$, $n=12$, so $E[X]=\\dfrac{nk}{N}=\\dfrac{12(9)}{60}=1.8$.',
        },

        {
          text: 'Expected cost is linear in $X$: $E[\\text{cost}]=80\\,E[X]=80(1.8)=144.00$ JD.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b33',

    chapter: 'discrete-distributions',

    topic: 'Hypergeometric',

    difficulty: 'easy',

    citation: 'Alshwawra Ch 5 bank, B33',

    instance: {
      prompt:
        'A crate of 40 valves contains 5 that are out of tolerance. Six valves are drawn at random without replacement. Determine the probability that none is out of tolerance.',

      parts: [{ kind: 'numeric', answer: 0.4229, tol: 0.0005 }],

      solution: [
        {
          text: 'Hypergeometric, $N=40$, $k=5$, $n=6$: $P(X=0)=\\dfrac{\\binom{5}{0}\\binom{35}{6}}{\\binom{40}{6}}$.',
        },

        {
          text: '$P(X=0)\\approx0.4229$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b34',

    chapter: 'discrete-distributions',

    topic: 'Hypergeometric',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, B34',

    instance: {
      prompt:
        'Of 30 machined blocks, 12 were produced on the night shift. Eight blocks are drawn without replacement for an audit. Determine the variance of the number of night-shift blocks in the sample.',

      parts: [{ kind: 'numeric', answer: 1.4566, tol: 0.001 }],

      solution: [
        {
          text: 'Hypergeometric, $N=30$, $k=12$, $n=8$, so $\\sigma^2=\\dfrac{N-n}{N-1}\\,n\\,\\dfrac{k}{N}\\left(1-\\dfrac{k}{N}\\right)$.',
        },

        {
          text: '$\\sigma^2=\\dfrac{22}{29}(8)(0.4)(0.6)\\approx1.4566$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b36',

    chapter: 'discrete-distributions',

    topic: 'Hypergeometric',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, B36',

    instance: {
      prompt:
        'A lot of 100 encoders contains 10 defective units. Fifteen encoders are inspected without replacement and the lot is accepted if at most one is defective. Determine the probability of acceptance.',

      parts: [{ kind: 'numeric', answer: 0.5375, tol: 0.0005 }],

      solution: [
        {
          text: 'Hypergeometric, $N=100$, $k=10$, $n=15$; acceptance is $P(X\\le1)=P(X=0)+P(X=1)$.',
        },

        {
          text: '$P(X\\le1)\\approx0.5375$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b38',

    chapter: 'discrete-distributions',

    topic: 'Hypergeometric',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, B38',

    instance: {
      prompt:
        'A bin holds 15 bolts from supplier A and 10 from supplier B. Five bolts are drawn without replacement. Determine the probability that at least 3 come from supplier A.',

      parts: [{ kind: 'numeric', answer: 0.6988, tol: 0.001 }],

      solution: [
        {
          text: 'Hypergeometric, $N=25$, $k=15$ (supplier A), $n=5$; sum the pmf over $x=3,4,5$.',
        },

        {
          text: '$P(X\\ge3)=\\dfrac{\\binom{15}{3}\\binom{10}{2}+\\binom{15}{4}\\binom{10}{1}+\\binom{15}{5}\\binom{10}{0}}{\\binom{25}{5}}\\approx0.6988$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b39',

    chapter: 'discrete-distributions',

    topic: 'Hypergeometric',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, B39',

    instance: {
      prompt:
        'A lot of 200 heat exchangers contains 8 with tube leaks. Ten units are drawn without replacement. Determine the exact probability that the sample contains at least one leaking unit.',

      parts: [{ kind: 'numeric', answer: 0.3416, tol: 0.001 }],

      solution: [
        {
          text: 'Hypergeometric, $N=200$, $k=8$, $n=10$; "at least one" is the complement of "none".',
        },

        {
          text: '$P(X\\ge1)=1-\\dfrac{\\binom{8}{0}\\binom{192}{10}}{\\binom{200}{10}}\\approx0.3416$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b41',

    chapter: 'discrete-distributions',

    topic: 'Hypergeometric',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, B41',

    instance: {
      prompt:
        'A pallet of 80 housings contains 12 requiring rework at 45 JD each. Fifteen housings are drawn without replacement for an audit. Determine the expected rework cost among the audited housings.',

      parts: [{ kind: 'numeric', answer: 101.25, tol: 0.5 }],

      solution: [
        {
          text: '$E[X]=\\dfrac{nk}{N}=\\dfrac{15(12)}{80}=2.25$ for $X$ hypergeometric.',
        },

        {
          text: '$E[\\text{cost}]=45(2.25)=101.25$ JD.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a42',

    chapter: 'discrete-distributions',

    topic: 'Poisson',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A42',

    instance: {
      prompt:
        'Flaws occur along a submarine cable at an average rate of 2.5 per 100 m, following a Poisson process. Find the probability that a 200 m section contains at least 2 flaws.',

      parts: [{ kind: 'mcq', choices: ['0.0842', '0.9596', '0.7127', '0.8753'], answer: 1 }],

      solution: [
        {
          text: 'The rate has to be scaled to the 200 m section asked about: $\\lambda t=2.5\\times2=5$.',
        },

        {
          text: '$P(X\\ge2)=1-P(X=0)-P(X=1)=1-e^{-5}(1+5)\\approx0.9596$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a43',

    chapter: 'discrete-distributions',

    topic: 'Poisson',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, A43',

    instance: {
      prompt:
        'The number of contaminant particles on a wafer is Poisson distributed, and 5% of wafers are completely particle-free. Find the probability that a wafer carries 3 or more particles.',

      parts: [{ kind: 'mcq', choices: ['0.2240', '0.4241', '0.5759', '0.3518'], answer: 2 }],

      solution: [
        {
          text: '"Particle-free" is $P(X=0)=e^{-\\lambda t}=0.05$, which pins down the mean: $\\lambda t=-\\ln(0.05)\\approx2.9957$.',
        },

        {
          text: '$P(X\\ge3)=1-e^{-\\lambda t}\\left(1+\\lambda t+\\dfrac{(\\lambda t)^2}{2}\\right)\\approx1-0.4241=0.5759$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a44',

    chapter: 'discrete-distributions',

    topic: 'Poisson',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A44',

    instance: {
      prompt:
        'Two independent inspection lines report nonconformities at Poisson rates of 1.2 and 2.3 per hour respectively. Find the probability that the plant records exactly 3 nonconformities in a given hour.',

      parts: [{ kind: 'mcq', choices: ['0.0176', '0.2901', '0.5366', '0.2158'], answer: 3 }],

      solution: [
        {
          text: 'The sum of two independent Poisson counts is itself Poisson, with rates adding: $\\lambda t=1.2+2.3=3.5$.',
        },

        {
          text: '$P(X=3)=p(3;3.5)\\approx0.2158$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a45',

    chapter: 'discrete-distributions',

    topic: 'Poisson',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, A45',

    instance: {
      prompt:
        'Maintenance calls arrive at a Poisson rate of 6 per hour, and each call independently turns out to be an emergency with probability 0.20. Find the probability that exactly 2 emergency calls arrive in a 2-hour window.',

      parts: [{ kind: 'mcq', choices: ['0.2613', '0.0004', '0.2169', '0.2835'], answer: 0 }],

      solution: [
        {
          text: 'Thinning a Poisson process by an independent classification probability leaves a Poisson process for the classified events, with rate $6\\times0.20=1.2$ per hour.',
        },

        {
          text: 'Over 2 hours, $\\lambda t=1.2\\times2=2.4$, so $P(X=2)=p(2;2.4)\\approx0.2613$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a46',

    chapter: 'discrete-distributions',

    topic: 'Poisson',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A46',

    instance: {
      prompt:
        'A control board contains 1000 solder joints, each defective independently with probability 0.002. Using the Poisson approximation, find the probability that a board has 3 or more defective joints.',

      parts: [{ kind: 'mcq', choices: ['0.1806', '0.3233', '0.1429', '0.1804'], answer: 1 }],

      solution: [
        {
          text: '$n=1000$ is large and $p=0.002$ is small, exactly the regime where the binomial count is well approximated by Poisson with $\\mu=np=2$.',
        },

        {
          text: '$P(X\\ge3)\\approx1-e^{-2}(1+2+2)\\approx0.3233$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a47',

    chapter: 'discrete-distributions',

    topic: 'Poisson',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, A47',

    instance: {
      prompt:
        'Machine breakdowns follow a Poisson process with a mean of 1.5 per week. Given that at least one breakdown occurs in a given week, find the probability that two or more occur.',

      parts: [{ kind: 'mcq', choices: ['0.4308', '0.1912', '0.5692', '0.4422'], answer: 2 }],

      solution: [
        {
          text: 'Conditional probability: $P(X\\ge2\\mid X\\ge1)=\\dfrac{P(X\\ge2)}{P(X\\ge1)}=\\dfrac{1-e^{-1.5}(1+1.5)}{1-e^{-1.5}}$.',
        },

        {
          text: '$=\\dfrac{0.4422}{0.7769}\\approx0.5692$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a48',

    chapter: 'discrete-distributions',

    topic: 'Poisson',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, A48',

    instance: {
      prompt:
        'Surface blemishes appear on rolled aluminium sheet at a Poisson rate of 0.8 per $\\text{m}^2$. Find the probability that a panel measuring 2.5 m by 1.6 m carries exactly 4 blemishes.',

      parts: [{ kind: 'mcq', choices: ['0.0077', '0.7806', '0.1954', '0.1781'], answer: 3 }],

      solution: [
        {
          text: 'The rate is per unit area, so it scales with the panel area, $2.5\\times1.6=4\\ \\text{m}^2$: $\\lambda t=0.8\\times4=3.2$.',
        },

        {
          text: '$P(X=4)=p(4;3.2)\\approx0.1781$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a49',

    chapter: 'discrete-distributions',

    topic: 'Poisson',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, A49',

    instance: {
      prompt:
        'The number of packet losses per minute follows a Poisson distribution. Given $P(X=2)=3P(X=1)$, find the probability that a given minute records at most 2 losses.',

      parts: [{ kind: 'mcq', choices: ['0.0620', '0.4232', '0.0446', '0.9380'], answer: 0 }],

      solution: [
        {
          text: 'Writing out both point probabilities, $\\dfrac{e^{-\\lambda}\\lambda^2}{2}=3\\,e^{-\\lambda}\\lambda$ simplifies to $\\lambda/2=3$, so $\\lambda=6$.',
        },

        {
          text: '$P(X\\le2)=e^{-6}\\left(1+6+\\dfrac{36}{2}\\right)=25e^{-6}\\approx0.0620$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-a50',

    chapter: 'discrete-distributions',

    topic: 'Poisson',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, A50',

    instance: {
      prompt:
        'Vehicles arrive at a weighbridge as a Poisson process with rate 4 per hour. Given that exactly 6 vehicles arrived during a 2-hour period, find the probability that exactly 2 of them arrived during the first hour.',

      parts: [{ kind: 'mcq', choices: ['0.0107', '0.2344', '0.1465', '0.2966'], answer: 1 }],

      solution: [
        {
          text: 'A classic Poisson-process fact: conditional on the total count over an interval, the arrival times split between two equal sub-intervals as an ordinary binomial -- here $\\text{Binomial}(6,0.5)$, since each of the two hours is equally likely to hold any given arrival.',
        },

        {
          text: '$P(X=2)=\\binom{6}{2}(0.5)^6=\\dfrac{15}{64}\\approx0.2344$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b42',

    chapter: 'discrete-distributions',

    topic: 'Poisson',

    difficulty: 'easy',

    citation: 'Alshwawra Ch 5 bank, B42',

    instance: {
      prompt:
        'Machine stoppages occur as a Poisson process at 3.6 per hour. Determine the probability of exactly 5 stoppages in a one-hour period.',

      parts: [{ kind: 'numeric', answer: 0.1377, tol: 0.0005 }],

      solution: [
        {
          text: 'The rate is already given per the one-hour interval asked about, so $\\lambda t=3.6$ directly.',
        },

        {
          text: '$P(X=5)=p(5;3.6)=\\dfrac{e^{-3.6}(3.6)^5}{5!}\\approx0.1377$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b44',

    chapter: 'discrete-distributions',

    topic: 'Poisson',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, B44',

    instance: {
      prompt:
        'Cracks appear in concrete panels as a Poisson process, and 60% of panels contain at least one crack. Determine the expected number of cracks in an area of 5 panels.',

      parts: [{ kind: 'numeric', answer: 4.5815, tol: 0.01 }],

      solution: [
        {
          text: '"At least one crack" has probability $1-e^{-\\lambda}=0.60$ per panel, so $e^{-\\lambda}=0.40$ and $\\lambda=-\\ln(0.40)\\approx0.9163$ cracks per panel.',
        },

        {
          text: 'Over 5 panels the mean scales directly: $5\\lambda\\approx4.5815$ cracks.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b45',

    chapter: 'discrete-distributions',

    topic: 'Poisson',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, B45',

    instance: {
      prompt:
        'A circuit board carries 2000 solder joints, each defective independently with probability 0.0015. Using the Poisson approximation, determine the probability of exactly 2 defective joints.',

      parts: [{ kind: 'numeric', answer: 0.224, tol: 0.0005 }],

      solution: [
        {
          text: '$n=2000$ is large and $p=0.0015$ is small, so the Poisson approximation with $\\mu=np=3$ applies.',
        },

        {
          text: '$P(X=2)\\approx p(2;3)=\\dfrac{e^{-3}3^2}{2!}\\approx0.2240$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b47',

    chapter: 'discrete-distributions',

    topic: 'Poisson',

    difficulty: 'medium',

    citation: 'Alshwawra Ch 5 bank, B47',

    instance: {
      prompt:
        'Surface defects occur on a panel at a Poisson rate of 5 per panel, and each defect is independently classified as critical with probability 0.30. Determine the probability that a panel has no critical defect.',

      parts: [{ kind: 'numeric', answer: 0.2231, tol: 0.0005 }],

      solution: [
        {
          text: 'Thinning the Poisson process by the classification probability gives a Poisson rate of critical defects of $5\\times0.30=1.5$ per panel.',
        },

        {
          text: '$P(X=0)=e^{-1.5}\\approx0.2231$.',
        },

      ],
    },
  }),

  bookQuestion({
    id: 'ch05-book-bank-b49',

    chapter: 'discrete-distributions',

    topic: 'Poisson',

    difficulty: 'hard',

    citation: 'Alshwawra Ch 5 bank, B49',

    instance: {
      prompt:
        'The number of alarms per shift follows a Poisson distribution. Given $P(X=3)=P(X=2)$, determine the probability that a shift records 4 or more alarms.',

      parts: [{ kind: 'numeric', answer: 0.3528, tol: 0.001 }],

      solution: [
        {
          text: 'Setting the two point probabilities equal, $\\dfrac{e^{-\\lambda}\\lambda^3}{6}=\\dfrac{e^{-\\lambda}\\lambda^2}{2}$, gives $\\lambda/3=1$, so $\\lambda=3$.',
        },

        {
          text: '$P(X\\ge4)=1-P(X\\le3)=1-13e^{-3}\\approx0.3528$.',
        },

      ],
    },
  }),
];
