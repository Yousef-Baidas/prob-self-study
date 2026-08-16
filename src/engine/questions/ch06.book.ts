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

    citation: 'Walpole Example 6.17 (reparameterized to rate $\\lambda$)',

    instance: {
      prompt:
        'A system component has time to failure $T$ modeled by an exponential distribution with rate ' +
        '$\\lambda=0.2$ failures per year. If 5 of these components are installed in different systems, what ' +
        'is the probability that at least 2 are still functioning at the end of 8 years?',

      // The book rounds P(T>8)=e^{-1.6} to 0.2 before entering the binomial
      // table; carrying the exact value instead gives 0.2666. The tolerance
      // admits both paths.
      parts: [{ kind: 'numeric', answer: 0.2627, tol: 0.005 }],

      solution: [
        {
          text: 'A single component survives past 8 years with probability $P(T>8)=e^{-\\lambda t}=e^{-0.2\\times8}=e^{-1.6}\\approx0.2$.',
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

    citation: 'Walpole Example 6.21 (reparameterized to rate $\\lambda$)',

    instance: {
      prompt:
        'The time $Y$, in years, before a washing machine needs a major repair is exponential with rate ' +
        '$\\lambda=0.25$ repairs per year. What is $P(Y>6)$, the probability it goes at least 6 years without ' +
        'a major repair?',

      parts: [{ kind: 'numeric', answer: 0.2231, tol: 0.0005 }],

      solution: [
        {
          text: 'The exponential cdf is $F(y)=1-e^{-\\lambda y}$, so $P(Y>6)=1-F(6)=e^{-0.25\\times6}=e^{-1.5}\\approx0.2231$.',
        },
      ],
    },
  }),

  // -- Alshwawra IE0121 Exam Bank (Ch. 6), Part A: 25 multiple-choice items --

  bookQuestion({
    id: 'ch06-book-bank-a1',

    chapter: 'continuous-distributions',

    topic: 'Continuous uniform',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q1',

    instance: {
      prompt:
        'A robotic indexer starts its cycle at a time $X$ that is uniformly distributed on the interval ' +
        '$[0,30]$ seconds following a trigger pulse. Given that the cycle has not started during the first ' +
        '10 seconds, the probability that it still has not started at 25 seconds is:',

      parts: [{ kind: 'mcq', choices: ['0.1667', '0.2000', '0.2500', '0.7500'], answer: 2 }],

      solution: [
        {
          text: '$P(X>25\\mid X>10)=\\dfrac{30-25}{30-10}=0.2500$.',
        },

        {
          text: '(0.1667 = 5/30 ignores the conditioning — it treats the 10-second head start as if it were never known.)',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a2',

    chapter: 'continuous-distributions',

    topic: 'Continuous uniform',

    difficulty: 'easy',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q2',

    instance: {
      prompt:
        'A cutting operation produces rod lengths uniformly distributed on $[9.95,10.05]$ cm. The drawing ' +
        'specification is 9.97 cm to 10.04 cm. The fraction of rods scrapped is:',

      parts: [{ kind: 'mcq', choices: ['0.3000', '0.1000', '0.3500', '0.7000'], answer: 0 }],

      solution: [
        {
          text: '$P(\\text{in spec})=\\dfrac{10.04-9.97}{10.05-9.95}=0.700$, so the scrapped fraction is $1-0.700=0.3000$.',
        },

        {
          text: '(0.7000 is the conforming fraction, not the scrapped one.)',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a3',

    chapter: 'continuous-distributions',

    topic: 'Continuous uniform',

    difficulty: 'hard',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q3',

    instance: {
      prompt:
        'A quantiser error $X$ is uniform on $[A,B]$ with mean 12 and variance 3. The probability $P(X<10)$ is:',

      parts: [{ kind: 'mcq', choices: ['0.1667', '0.0833', '0.3333', '0.5000'], answer: 0 }],

      solution: [
        {
          text: '$\\dfrac{(B-A)^2}{12}=3\\Rightarrow B-A=6$; with $\\dfrac{A+B}{2}=12$, $A=9$ and $B=15$.',
        },

        {
          text: '$P(X<10)=\\dfrac{10-9}{15-9}=\\dfrac16\\approx0.1667$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a4',

    chapter: 'continuous-distributions',

    topic: 'Continuous uniform',

    difficulty: 'easy',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q4',

    instance: {
      prompt:
        'A load is applied at a position $X$ (in m from one support) that is uniform on $[2,10]$. Using the ' +
        'cumulative distribution function of the uniform distribution, the value of $F(7)$ is:',

      parts: [{ kind: 'mcq', choices: ['0.3750', '0.6250', '0.5000', '0.7000'], answer: 1 }],

      solution: [
        {
          text: '$F(x)=\\dfrac{x-A}{B-A}$, so $F(7)=\\dfrac{7-2}{10-2}=0.6250$.',
        },

        {
          text: '(0.3750 is $P(4<X<7)$; 0.7000 is $x/10$, using the wrong denominator.)',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a5',

    chapter: 'continuous-distributions',

    topic: 'Continuous uniform',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q5',

    instance: {
      prompt:
        'The supply voltage $X$ delivered to a test bench is uniform on $[110,130]$ volts. A device ' +
        'malfunctions if the voltage is below 115 V or above 127 V. The probability of malfunction is:',

      parts: [{ kind: 'mcq', choices: ['0.1500', '0.2500', '0.6000', '0.4000'], answer: 3 }],

      solution: [
        {
          text: '$P=\\dfrac{115-110}{20}+\\dfrac{130-127}{20}=0.25+0.15=0.4000$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a6',

    chapter: 'continuous-distributions',

    topic: 'Continuous uniform',

    difficulty: 'hard',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q6',

    instance: {
      prompt:
        "A sensor's response time $X$ is uniform on $[A,B]$, and calibration shows $P(X<5)=0.25$ and " +
        '$P(X<9)=0.75$ (times in ms). The variance of $X$ is:',

      parts: [{ kind: 'mcq', choices: ['2.3094', '5.3333', '5.0000', '7.0000'], answer: 1 }],

      solution: [
        {
          text: 'The two quartiles are 4 ms apart and span half the range, so $B-A=8$, $A=3$, $B=11$.',
        },

        {
          text: '$\\sigma^2=\\dfrac{8^2}{12}\\approx5.3333$ ms$^2$. (2.3094 is $\\sigma$, not $\\sigma^2$; 7.000 is the mean.)',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a7',

    chapter: 'continuous-distributions',

    topic: 'Continuous uniform',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q7',

    instance: {
      prompt:
        'A data logger rounds each reading to the nearest unit, so each rounding error is uniform on ' +
        '$[-0.5,0.5]$ and errors are independent. Twelve readings are summed. The standard deviation of the ' +
        'total accumulated rounding error is:',

      parts: [{ kind: 'mcq', choices: ['0.2887', '3.4641', '1.0000', '12.0000'], answer: 2 }],

      solution: [
        {
          text: 'Each error has variance $1^2/12=1/12$; the total variance is $12(1/12)=1$, so $\\sigma=1.0000$.',
        },

        {
          text: '(0.2887 is the standard deviation of a *single* error, not the sum.)',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a8',

    chapter: 'continuous-distributions',

    topic: 'Exponential distribution',

    difficulty: 'easy',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q8',

    instance: {
      prompt:
        'Failures of a pump occur as a Poisson process at a rate of $\\lambda=0.125$ failures per hour, so the ' +
        'time $X$ between failures is exponential. The probability that the pump operates for more than 12 ' +
        'hours without failing is:',

      parts: [{ kind: 'mcq', choices: ['0.1353', '0.2231', '0.3679', '0.7769'], answer: 1 }],

      solution: [
        {
          text: '$P(X>12)=e^{-\\lambda x}=e^{-0.125\\times12}=e^{-1.5}\\approx0.2231$.',
        },

        {
          text: '(0.7769 is $P(X\\le12)$, the complement.)',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a9',

    chapter: 'continuous-distributions',

    topic: 'Exponential distribution',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q9',

    instance: {
      prompt:
        'The life of a relay is exponential with $\\lambda=0.0001$ per cycle. Given that a relay has already ' +
        'survived 10 000 cycles, the probability that it survives beyond 25 000 cycles is:',

      parts: [{ kind: 'mcq', choices: ['0.2231', '0.0498', '0.0821', '0.2865'], answer: 0 }],

      solution: [
        {
          text: 'By the lack-of-memory property, $P(X>25\\,000\\mid X>10\\,000)=P(X>15\\,000)=e^{-0.0001\\times15\\,000}=e^{-1.5}\\approx0.2231$.',
        },

        {
          text: '(0.0821 = $e^{-2.5}$ ignores the memoryless property and instead computes $P(X>25\\,000)$ unconditionally.)',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a10',

    chapter: 'continuous-distributions',

    topic: 'Exponential distribution',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q10',

    instance: {
      prompt:
        'A bearing has an exponential life with $\\lambda=0.0005$ per hour. The manufacturer wants a warranty ' +
        'period such that no more than 5% of bearings fail within it. The warranty period should be about:',

      parts: [{ kind: 'mcq', choices: ['205.2 h', '102.6 h', '1000.0 h', '1900.0 h'], answer: 1 }],

      solution: [
        {
          text: 'Require $e^{-0.0005t}=0.95\\Rightarrow t=-\\dfrac{\\ln(0.95)}{0.0005}\\approx102.6$ h.',
        },

        {
          text: '(1900 h wrongly takes 95% of the mean life $1/\\lambda=2000$ h, rather than solving the exponential equation.)',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a11',

    chapter: 'continuous-distributions',

    topic: 'Exponential distribution',

    difficulty: 'hard',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q11',

    instance: {
      prompt:
        'Three components are connected in series, so the system fails when the first component fails. Their ' +
        'lives are independent and exponential with rates 0.0020, 0.0010 and 0.0005 per hour. The mean time ' +
        'to system failure is:',

      parts: [{ kind: 'mcq', choices: ['500.0 h', '1166.7 h', '3500.0 h', '285.7 h'], answer: 3 }],

      solution: [
        {
          text: 'For components in series, independent exponential rates add: $\\lambda=0.0020+0.0010+0.0005=0.0035$ per hour, so $\\mu=1/\\lambda=285.7$ h.',
        },

        {
          text: '(1166.7 h is the *average of the three individual means* — wrong, because the series system fails at the first failure, not the average one.)',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a12',

    chapter: 'continuous-distributions',

    topic: 'Exponential distribution',

    difficulty: 'hard',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q12',

    instance: {
      prompt:
        'Two identical pumps are installed in parallel; the station fails only when both pumps have failed. ' +
        'Each pump has an exponential life with $\\lambda=0.001$ per hour, and they fail independently. The ' +
        'probability that the station is still operating after 1000 hours is:',

      parts: [{ kind: 'mcq', choices: ['0.1353', '0.6004', '0.3679', '0.8647'], answer: 1 }],

      solution: [
        {
          text: 'Each pump survives with probability $e^{-1}=0.3679$. $P(\\text{station survives})=1-(1-0.3679)^2=1-0.3996=0.6004$.',
        },

        {
          text: '(0.3679 is just one pump alone, ignoring the redundancy.)',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a13',

    chapter: 'continuous-distributions',

    topic: 'Exponential distribution',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q13',

    instance: {
      prompt:
        'For any component whose life is exponentially distributed with parameter $\\lambda$, the probability ' +
        'that it fails before reaching its own mean life $1/\\lambda$ is:',

      parts: [{ kind: 'mcq', choices: ['0.6321', '0.3679', '0.5000', '0.6065'], answer: 0 }],

      solution: [
        {
          text: '$P(X<1/\\lambda)=1-e^{-\\lambda\\cdot1/\\lambda}=1-e^{-1}=0.6321$, whatever the value of $\\lambda$.',
        },

        {
          text: '(0.5000 assumes the mean equals the median, which is false for a skewed distribution — the exponential median is $\\ln2/\\lambda<1/\\lambda$.)',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a14',

    chapter: 'continuous-distributions',

    topic: 'Exponential distribution',

    difficulty: 'hard',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q14',

    instance: {
      prompt:
        'A machine stops when either the drive belt or the controller fails, whichever occurs first. The two ' +
        'lives are independent and exponential with rates $1/400$ and $1/600$ per hour. The probability that ' +
        'the machine runs for more than 300 hours is:',

      parts: [{ kind: 'mcq', choices: ['0.1889', '0.4724', '0.6065', '0.2865'], answer: 3 }],

      solution: [
        {
          text: 'For the minimum of independent exponentials the rates add: $\\lambda=1/400+1/600=1/240$.',
        },

        {
          text: '$P(T>300)=e^{-300/240}=e^{-1.25}\\approx0.2865$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a15',

    chapter: 'continuous-distributions',

    topic: 'Exponential distribution',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q15',

    instance: {
      prompt:
        'Weld defects appear along a production line as a Poisson process at a mean rate of 3 defects per ' +
        'hour. The probability that the time until the next defect exceeds 40 minutes is:',

      parts: [{ kind: 'mcq', choices: ['0.2231', '0.1353', '0.3679', '0.8647'], answer: 1 }],

      solution: [
        {
          text: 'The waiting time is exponential with $\\lambda=3$ per hour, and 40 min $=2/3$ h.',
        },

        {
          text: '$P(X>2/3)=e^{-3\\times2/3}=e^{-2}\\approx0.1353$ — the same value as the Poisson probability of zero defects in $2/3$ h.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a16',

    chapter: 'continuous-distributions',

    topic: 'Exponential distribution',

    difficulty: 'easy',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q16',

    instance: {
      prompt:
        'Parts arrive at an automated inspection booth as a Poisson process with $\\lambda=0.4$ arrivals per ' +
        'minute. The variance of the waiting time between successive arrivals is:',

      parts: [{ kind: 'mcq', choices: ['0.16 min$^2$', '0.40 min$^2$', '6.25 min$^2$', '2.50 min$^2$'], answer: 2 }],

      solution: [
        {
          text: 'For the exponential, $\\sigma^2=1/\\lambda^2=1/0.4^2=6.25$ min$^2$.',
        },

        {
          text: '(2.50 is the mean, which numerically also equals the standard deviation but not the variance; 0.16 is $\\lambda^2$.)',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a17',

    chapter: 'continuous-distributions',

    topic: 'Areas under the normal curve',

    difficulty: 'easy',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q17',

    instance: {
      prompt: 'Given a standard normal distribution, the value of $k$ for which $P(Z>k)=0.0322$ is:',

      parts: [{ kind: 'mcq', choices: ['1.85', '1.52', '2.14', '2.37'], answer: 0 }],

      solution: [
        {
          text: '$P(Z<k)=1-0.0322=0.9678$; from Table A.3, $k=1.85$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a18',

    chapter: 'continuous-distributions',

    topic: 'Applications of the normal distribution',

    difficulty: 'easy',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q18',

    instance: {
      prompt:
        'The tensile strength of a wire is normally distributed with mean 80 MPa and standard deviation 5 ' +
        'MPa. The probability that a randomly selected wire has a strength between 72 and 88 MPa is:',

      parts: [{ kind: 'mcq', choices: ['0.1096', '0.4452', '0.9452', '0.8904'], answer: 3 }],

      solution: [
        {
          text: '$z_1=\\dfrac{72-80}{5}=-1.60$ and $z_2=\\dfrac{88-80}{5}=1.60$.',
        },

        {
          text: '$P=0.9452-0.0548=0.8904$. (0.9452 is only the left-tail area, $P(Z<1.60)$.)',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a19',

    chapter: 'continuous-distributions',

    topic: 'Applications of the normal distribution',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q19',

    instance: {
      prompt:
        'A shaft diameter is normal with mean 2.500 mm and standard deviation 0.020 mm. The specification is ' +
        '2.460 mm to 2.530 mm. The fraction of shafts that will be scrapped is:',

      parts: [{ kind: 'mcq', choices: ['0.0228', '0.0668', '0.0896', '0.9104'], answer: 2 }],

      solution: [
        {
          text: '$z_1=-2.00$ and $z_2=1.50$; $P(\\text{in spec})=0.9332-0.0228=0.9104$, so the scrapped fraction is $1-0.9104=0.0896$.',
        },

        {
          text: '(0.0668 uses only the upper tail, $1-0.9332$, and misses the lower-tail contribution.)',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a20',

    chapter: 'continuous-distributions',

    topic: 'Applications of the normal distribution',

    difficulty: 'hard',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q20',

    instance: {
      prompt:
        'A filling process has a standard deviation of 2 mL and is normally distributed. The lower ' +
        'specification limit is 50 mL, and at most 1% of containers may fall below it. The mean fill volume ' +
        'must be at least:',

      parts: [{ kind: 'mcq', choices: ['52.33 mL', '53.29 mL', '54.00 mL', '54.66 mL'], answer: 3 }],

      solution: [
        {
          text: 'From Table A.3, $P(Z<-2.33)=0.0099\\approx0.01$, so $\\mu-2.33(2)=50\\Rightarrow\\mu=54.66$ mL.',
        },

        {
          text: '(52.33 mL wrongly adds $z$ itself instead of $z\\sigma$.)',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a21',

    chapter: 'continuous-distributions',

    topic: 'Applications of the normal distribution',

    difficulty: 'hard',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q21',

    instance: {
      prompt:
        'A normally distributed cure time has a mean of 52 minutes, and 10% of batches exceed 60 minutes. ' +
        'The standard deviation of the cure time is:',

      parts: [{ kind: 'mcq', choices: ['4.85 min', '6.85 min', '8.00 min', '6.25 min'], answer: 3 }],

      solution: [
        {
          text: '$P(Z<1.28)=0.8997\\approx0.90$, so $1.28\\sigma=60-52=8\\Rightarrow\\sigma=6.25$ min.',
        },

        {
          text: '(8.00 min is the raw deviation $60-52$, left un-divided by $z$.)',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a22',

    chapter: 'continuous-distributions',

    topic: 'Applications of the normal distribution',

    difficulty: 'hard',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q22',

    instance: {
      prompt:
        'For a normally distributed hardness reading it is known that $P(X<40)=0.0228$ and $P(X>55)=0.1587$ ' +
        '(readings in HRC). The standard deviation of $X$ is:',

      parts: [{ kind: 'mcq', choices: ['5.00 HRC', '3.75 HRC', '7.50 HRC', '15.00 HRC'], answer: 0 }],

      solution: [
        {
          text: '$z=-2.00$ and $z=+1.00$, so $\\mu-2\\sigma=40$ and $\\mu+\\sigma=55$. Subtracting gives $3\\sigma=15\\Rightarrow\\sigma=5.00$ HRC (and $\\mu=50.00$ HRC).',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a23',

    chapter: 'continuous-distributions',

    topic: 'Applications of the normal distribution',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q23',

    instance: {
      prompt:
        'A gauge rejects every part whose dimension falls outside $10.00\\pm0.05$ mm. The dimension is normal ' +
        'and centred at 10.00 mm. The largest standard deviation for which the specification still covers 95% ' +
        'of the parts is:',

      parts: [{ kind: 'mcq', choices: ['0.01942 mm', '0.02500 mm', '0.02551 mm', '0.03030 mm'], answer: 2 }],

      solution: [
        {
          text: '$P(-1.96<Z<1.96)=0.95$, so $1.96\\sigma=0.05\\Rightarrow\\sigma=0.02551$ mm.',
        },

        {
          text: '(0.01942 mm corresponds to 99% coverage instead, which uses $z=2.575$.)',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a24',

    chapter: 'continuous-distributions',

    topic: 'Applications of the normal distribution',

    difficulty: 'hard',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q24',

    instance: {
      prompt:
        'The tensile strength of a wire is normal with mean 80 MPa and standard deviation 5 MPa. Given that a ' +
        'wire has already passed an 85 MPa proof test, the probability that its strength exceeds 90 MPa is:',

      parts: [{ kind: 'mcq', choices: ['0.0228', '0.1587', '0.1437', '0.2266'], answer: 2 }],

      solution: [
        {
          text: '$P(X>90\\mid X>85)=\\dfrac{P(X>90)}{P(X>85)}=\\dfrac{0.0228}{0.1587}\\approx0.1437$.',
        },

        {
          text: '(0.0228 is the unconditional $P(X>90)$, ignoring the information that the wire already passed the 85 MPa test.)',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-a25',

    chapter: 'continuous-distributions',

    topic: 'Normal approximation to the binomial',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part A Q25',

    instance: {
      prompt:
        'In a lot of 400 independently produced connectors, each is defective with probability 0.05. Using ' +
        'the normal approximation to the binomial with a continuity correction, the probability of finding 30 ' +
        'or more defectives is:',

      parts: [{ kind: 'mcq', choices: ['0.0146', '0.0110', '0.0207', '0.0287'], answer: 0 }],

      solution: [
        {
          text: '$\\mu=np=20$ and $\\sigma=\\sqrt{np(1-p)}=\\sqrt{400\\times0.05\\times0.95}\\approx4.36$; both $np$ and $n(1-p)$ exceed 5.',
        },

        {
          text: '$z=\\dfrac{29.5-20}{4.36}\\approx2.18$, so $P=1-0.9854=0.0146$. (0.0110 omits the continuity correction.)',
        },
      ],
    },
  }),

  // -- Alshwawra IE0121 Exam Bank (Ch. 6), Part B: 25 short-answer items --

  bookQuestion({
    id: 'ch06-book-bank-b1',

    chapter: 'continuous-distributions',

    topic: 'Continuous uniform',

    difficulty: 'easy',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q1',

    instance: {
      prompt:
        'A robotic indexer starts its cycle at a time $X$ uniformly distributed on $[0,30]$ seconds following ' +
        'a trigger pulse. Find (a) the density function $f(x;A,B)$, (b) $E(X)$ and $\\text{Var}(X)$, (c) the ' +
        'standard deviation of $X$, and (d) the probability that the cycle has still not started at 25 s, ' +
        'given that it had not started at 10 s.',

      parts: [
        { kind: 'short', label: '(a) f(x; A, B)', answer: 'f(x) = 1/30 for 0 <= x <= 30, and 0 elsewhere' },

        { kind: 'numeric', label: '(b) E(X)', answer: 15, tol: 0.005 },

        { kind: 'numeric', label: '(b) Var(X)', answer: 75, tol: 0.005 },

        { kind: 'numeric', label: '(c) standard deviation', answer: 8.66, tol: 0.005 },

        { kind: 'numeric', label: '(d) P(X > 25 | X > 10)', answer: 0.25, tol: 0.0005 },
      ],

      solution: [
        { text: '(a) $f(x)=1/(B-A)=1/30$ for $0\\le x\\le30$, and 0 elsewhere.' },

        { text: '(b) $\\mu=(0+30)/2=15.00$ s; $\\sigma^2=(30-0)^2/12=75.00$ s$^2$.' },

        { text: '(c) $\\sigma=8.660$ s.' },

        { text: '(d) $P(X>25\\mid X>10)=(30-25)/(30-10)=0.2500$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b2',

    chapter: 'continuous-distributions',

    topic: 'Continuous uniform',

    difficulty: 'easy',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q2',

    instance: {
      prompt:
        'A cutting operation produces rod lengths uniform on $[9.95,10.05]$ cm, and the drawing specification ' +
        'is 9.97 cm to 10.04 cm. Find (a) the probability that a rod conforms, (b) the fraction scrapped, and ' +
        '(c) the expected number of scrapped rods in a production run of 2500.',

      parts: [
        { kind: 'numeric', label: '(a) P(conforms)', answer: 0.7, tol: 0.0005 },

        { kind: 'numeric', label: '(b) fraction scrapped', answer: 0.3, tol: 0.0005 },

        { kind: 'numeric', label: '(c) expected scrapped rods', answer: 750, tol: 0.5 },
      ],

      solution: [
        { text: '(a) $P(9.97<X<10.04)=0.07/0.10=0.7000$.' },

        { text: '(b) Fraction scrapped $=1-0.7000=0.3000$.' },

        { text: '(c) $2500(0.3000)=750$ rods.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b3',

    chapter: 'continuous-distributions',

    topic: 'Continuous uniform',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q3',

    instance: {
      prompt:
        "A sensor's response time $X$ is uniform on $[A,B]$, and calibration gives $P(X<5)=0.25$ and " +
        '$P(X<9)=0.75$, with times in ms. Find (a) $A$ and $B$, (b) $E(X)$ and $\\text{Var}(X)$, and (c) ' +
        '$P(X>10)$.',

      parts: [
        { kind: 'numeric', label: '(a) A', answer: 3, tol: 0.05 },

        { kind: 'numeric', label: '(a) B', answer: 11, tol: 0.05 },

        { kind: 'numeric', label: '(b) E(X)', answer: 7, tol: 0.005 },

        { kind: 'numeric', label: '(b) Var(X)', answer: 5.3333, tol: 0.001 },

        { kind: 'numeric', label: '(c) P(X > 10)', answer: 0.125, tol: 0.0005 },
      ],

      solution: [
        { text: '(a) The quartiles are 4 ms apart and enclose half the range, so $B-A=8$; then $A=3$ ms and $B=11$ ms.' },

        { text: '(b) $\\mu=7.000$ ms; $\\sigma^2=8^2/12=5.3333$ ms$^2$ ($\\sigma=2.3094$ ms).' },

        { text: '(c) $P(X>10)=(11-10)/8=0.1250$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b4',

    chapter: 'continuous-distributions',

    topic: 'Continuous uniform',

    difficulty: 'easy',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q4',

    instance: {
      prompt:
        'A load is applied at a position $X$ (in m from one support) that is uniform on $[2,10]$. Find (a) ' +
        'the cumulative distribution function $F(x)$ for all $x$, (b) $F(7)$, (c) $P(4<X<7)$ using $F$, and ' +
        '(d) the median position.',

      parts: [
        {
          kind: 'short',

          label: '(a) F(x)',

          answer: 'F(x) = 0 for x < 2; F(x) = (x-2)/8 for 2 <= x < 10; F(x) = 1 for x >= 10',
        },

        { kind: 'numeric', label: '(b) F(7)', answer: 0.625, tol: 0.0005 },

        { kind: 'numeric', label: '(c) P(4 < X < 7)', answer: 0.375, tol: 0.0005 },

        { kind: 'numeric', label: '(d) median', answer: 6, tol: 0.005 },
      ],

      solution: [
        { text: '(a) $F(x)=0$ for $x<2$; $F(x)=(x-2)/8$ for $2\\le x<10$; $F(x)=1$ for $x\\ge10$.' },

        { text: '(b) $F(7)=(7-2)/8=0.6250$.' },

        { text: '(c) $P(4<X<7)=F(7)-F(4)=0.6250-0.2500=0.3750$.' },

        { text: '(d) $F(m)=0.5\\Rightarrow m=6.000$ m — equal to the mean, by symmetry.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b5',

    chapter: 'continuous-distributions',

    topic: 'Continuous uniform',

    difficulty: 'easy',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q5',

    instance: {
      prompt:
        'The supply voltage on a test bench is uniform on $[110,130]$ V. A device malfunctions below 115 V ' +
        'or above 127 V. Find (a) the probability of malfunction for one device, (b) the expected number of ' +
        'malfunctions among 50 independent devices, and (c) the mean and variance of the supply voltage.',

      parts: [
        { kind: 'numeric', label: '(a) P(malfunction)', answer: 0.4, tol: 0.0005 },

        { kind: 'numeric', label: '(b) expected malfunctions', answer: 20, tol: 0.5 },

        { kind: 'numeric', label: '(c) mean', answer: 120, tol: 0.05 },

        { kind: 'numeric', label: '(c) variance', answer: 33.333, tol: 0.01 },
      ],

      solution: [
        { text: '(a) $P=5/20+3/20=0.4000$.' },

        { text: '(b) $50(0.4000)=20$ devices.' },

        { text: '(c) $\\mu=(110+130)/2=120.0$ V; $\\sigma^2=(130-110)^2/12=33.333$ V$^2$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b6',

    chapter: 'continuous-distributions',

    topic: 'Continuous uniform',

    difficulty: 'easy',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q6',

    instance: {
      prompt:
        'A conference room can be reserved for no more than 6 hours, and the length $X$ of a booking is ' +
        'uniform on $[0,6]$. Find (a) the density function, (b) $P(X\\ge4)$, (c) $E(X)$ and $\\text{Var}(X)$, ' +
        'and (d) $P(X\\ge5\\mid X\\ge3)$.',

      parts: [
        { kind: 'short', label: '(a) density', answer: 'f(x) = 1/6 for 0 <= x <= 6, and 0 elsewhere' },

        { kind: 'numeric', label: '(b) P(X >= 4)', answer: 0.3333, tol: 0.0005 },

        { kind: 'numeric', label: '(c) E(X)', answer: 3, tol: 0.005 },

        { kind: 'numeric', label: '(c) Var(X)', answer: 3, tol: 0.005 },

        { kind: 'numeric', label: '(d) P(X >= 5 | X >= 3)', answer: 0.3333, tol: 0.0005 },
      ],

      solution: [
        { text: '(a) $f(x)=1/6$ for $0\\le x\\le6$, and 0 elsewhere.' },

        { text: '(b) $P(X\\ge4)=(6-4)/6=0.3333$.' },

        { text: '(c) $\\mu=3.000$ h; $\\sigma^2=6^2/12=3.000$ h$^2$.' },

        { text: '(d) $P(X\\ge5\\mid X\\ge3)=(6-5)/(6-3)=0.3333$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b7',

    chapter: 'continuous-distributions',

    topic: 'Continuous uniform',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q7',

    instance: {
      prompt:
        'A data logger rounds every reading to the nearest unit, so each rounding error is uniform on ' +
        '$[-0.5,0.5]$ and errors are independent. Twelve readings are added. Find (a) the mean and variance of ' +
        'one rounding error, (b) the mean and standard deviation of the total error in the sum, and (c) ' +
        'explain in one line why the total error grows more slowly than the number of readings.',

      parts: [
        { kind: 'numeric', label: '(a) variance of one error', answer: 0.08333, tol: 0.0005 },

        { kind: 'numeric', label: '(b) standard deviation of total error', answer: 1, tol: 0.005 },

        {
          kind: 'short',

          label: '(c) why the total error grows sub-linearly',

          answer: 'Variances of independent errors add, so the total standard deviation grows as sqrt(n), not as n.',
        },
      ],

      solution: [
        { text: '(a) $\\mu=0$; $\\sigma^2=1^2/12=0.08333$.' },

        { text: '(b) $E(\\text{total})=0$; $\\text{Var}(\\text{total})=12(0.08333)=1.000$, so $\\sigma=1.000$.' },

        { text: '(c) Variances add, so $\\sigma$ grows as $\\sqrt{n}$, not as $n$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b8',

    chapter: 'continuous-distributions',

    topic: 'Exponential distribution',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q8',

    instance: {
      prompt:
        'Failures of a pump occur as a Poisson process at $\\lambda=0.125$ failures per hour, so the time $X$ ' +
        'between failures is exponential. Find (a) the density function and the mean and variance of $X$, (b) ' +
        '$P(X>12)$, (c) $P(4<X<12)$, and (d) the median time between failures, and state why it is smaller ' +
        'than the mean.',

      parts: [
        { kind: 'numeric', label: '(a) mean', answer: 8, tol: 0.005 },

        { kind: 'numeric', label: '(a) variance', answer: 64, tol: 0.05 },

        { kind: 'numeric', label: '(b) P(X > 12)', answer: 0.2231, tol: 0.0005 },

        { kind: 'numeric', label: '(c) P(4 < X < 12)', answer: 0.3834, tol: 0.0005 },

        { kind: 'numeric', label: '(d) median', answer: 5.545, tol: 0.005 },

        {
          kind: 'short',

          label: '(d) why the median is smaller than the mean',

          answer: 'The exponential is right-skewed, so the long upper tail pulls the mean above the median.',
        },
      ],

      solution: [
        { text: '(a) $f(x)=0.125e^{-0.125x}$ for $x\\ge0$; $\\mu=1/\\lambda=8.000$ h; $\\sigma^2=1/\\lambda^2=64.00$ h$^2$.' },

        { text: '(b) $P(X>12)=e^{-1.5}=0.2231$.' },

        { text: '(c) $P(4<X<12)=e^{-0.5}-e^{-1.5}=0.6065-0.2231=0.3834$.' },

        {
          text: '(d) Median $=\\ln2/\\lambda=0.6931/0.125=5.545$ h; the exponential is right-skewed, so the long upper tail pulls the mean above the median.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b9',

    chapter: 'continuous-distributions',

    topic: 'Exponential distribution',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q9',

    instance: {
      prompt:
        'Detections at a Geiger counter occur as a Poisson process with $\\lambda=0.5$ detections per hour. ' +
        'Find (a) $P(X<2)$, (b) $P(X<5\\mid X>3)$, and (c) state which property of the exponential ' +
        'distribution the comparison of (a) and (b) illustrates, and what it means physically for the counter.',

      parts: [
        { kind: 'numeric', label: '(a) P(X < 2)', answer: 0.6321, tol: 0.0005 },

        { kind: 'numeric', label: '(b) P(X < 5 | X > 3)', answer: 0.6321, tol: 0.0005 },

        {
          kind: 'short',

          label: '(c) which property, and what it means',

          answer:
            'The lack-of-memory property, P(X < t1+t2 | X > t1) = P(X < t2): a quiet spell does not make a detection "due" -- the probability depends only on the length of the interval, not on the detection history.',
        },
      ],

      solution: [
        { text: '(a) $P(X<2)=1-e^{-0.5\\times2}=1-e^{-1}=0.6321$.' },

        { text: '(b) $P(X<3+2\\mid X>3)=P(X<2)=0.6321$.' },

        {
          text: '(c) The lack-of-memory property, $P(X<t_1+t_2\\mid X>t_1)=P(X<t_2)$. A quiet spell does not make a detection "due": the probability depends only on the length of the interval, not on the detection history.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b10',

    chapter: 'continuous-distributions',

    topic: 'Exponential distribution',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q10',

    instance: {
      prompt:
        'A bearing has an exponential life with $\\lambda=0.0005$ per hour. Find (a) the mean and standard ' +
        'deviation of the life, (b) the warranty period for which only 10% of bearings fail, and (c) the ' +
        'probability that a bearing survives twice its mean life.',

      parts: [
        { kind: 'numeric', label: '(a) mean', answer: 2000, tol: 1 },

        { kind: 'numeric', label: '(a) standard deviation', answer: 2000, tol: 1 },

        { kind: 'numeric', label: '(b) warranty period', answer: 210.7, tol: 0.5 },

        { kind: 'numeric', label: '(c) P(survives twice its mean life)', answer: 0.1353, tol: 0.0005 },
      ],

      solution: [
        { text: '(a) $\\mu=1/\\lambda=2000$ h; $\\sigma=1/\\lambda=2000$ h — the mean and standard deviation are equal.' },

        { text: '(b) $e^{-0.0005t}=0.90\\Rightarrow t=-\\ln(0.90)/0.0005\\approx210.7$ h.' },

        { text: '(c) $P(X>4000)=e^{-2}=0.1353$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b11',

    chapter: 'continuous-distributions',

    topic: 'Exponential distribution',

    difficulty: 'hard',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q11',

    instance: {
      prompt:
        'Three components in series have independent exponential lives with rates 0.0020, 0.0010 and 0.0005 ' +
        'per hour; the system fails at the first component failure. Find (a) the system failure rate, (b) the ' +
        'mean time to system failure, and (c) the probability that the system runs beyond 200 hours.',

      parts: [
        { kind: 'numeric', label: '(a) system failure rate', answer: 0.0035, tol: 0.00005 },

        { kind: 'numeric', label: '(b) mean time to failure', answer: 285.7, tol: 0.5 },

        { kind: 'numeric', label: '(c) P(T > 200)', answer: 0.4966, tol: 0.0005 },
      ],

      solution: [
        { text: '(a) $\\lambda=0.0020+0.0010+0.0005=0.00350$ per hour.' },

        { text: '(b) $\\mu=1/\\lambda=285.7$ h — note this is below the shortest individual mean of 500 h.' },

        { text: '(c) $P(T>200)=e^{-0.0035\\times200}=e^{-0.70}=0.4966$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b12',

    chapter: 'continuous-distributions',

    topic: 'Exponential distribution',

    difficulty: 'hard',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q12',

    instance: {
      prompt:
        'Two identical pumps operate in parallel; the station fails only when both have failed. Each has an ' +
        'independent exponential life with $\\lambda=0.001$ per hour. Find (a) the probability that one pump ' +
        'survives 1000 hours, (b) the probability that the station survives 1000 hours, and (c) the ' +
        'probability that the station has failed by 2000 hours.',

      parts: [
        { kind: 'numeric', label: '(a) P(one pump survives 1000 h)', answer: 0.3679, tol: 0.0005 },

        { kind: 'numeric', label: '(b) P(station survives 1000 h)', answer: 0.6004, tol: 0.0005 },

        { kind: 'numeric', label: '(c) P(station has failed by 2000 h)', answer: 0.7477, tol: 0.0005 },
      ],

      solution: [
        { text: '(a) $P=e^{-0.001\\times1000}=e^{-1}=0.3679$.' },

        { text: '(b) $P=1-(1-0.3679)^2=1-0.3996=0.6004$.' },

        { text: '(c) Each pump fails by 2000 h with probability $1-e^{-2}=0.8647$; $P(\\text{both failed})=0.8647^2=0.7477$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b13',

    chapter: 'continuous-distributions',

    topic: 'Exponential distribution',

    difficulty: 'hard',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q13',

    instance: {
      prompt:
        'Surface flaws occur along a coated strip as a Poisson process at $\\lambda=0.05$ flaws per metre. Let ' +
        '$X$ be the distance to the next flaw. Find (a) the distribution, mean and standard deviation of $X$, ' +
        '(b) $P(X>30)$, and (c) the probability that at least one flaw occurs in the next 10 m, obtained in ' +
        'two different ways.',

      parts: [
        { kind: 'numeric', label: '(a) mean', answer: 20, tol: 0.05 },

        { kind: 'numeric', label: '(a) standard deviation', answer: 20, tol: 0.05 },

        { kind: 'numeric', label: '(b) P(X > 30)', answer: 0.2231, tol: 0.0005 },

        { kind: 'numeric', label: '(c) P(at least one flaw in next 10 m), via exponential', answer: 0.3935, tol: 0.0005 },

        { kind: 'numeric', label: '(c) P(at least one flaw in next 10 m), via Poisson', answer: 0.3935, tol: 0.0005 },
      ],

      solution: [
        { text: '(a) $X$ is exponential with $\\lambda=0.05$ per m, so $\\mu=\\sigma=1/\\lambda=20.0$ m.' },

        { text: '(b) $P(X>30)=e^{-0.05\\times30}=e^{-1.5}=0.2231$.' },

        {
          text: '(c) Exponential: $P(X\\le10)=1-e^{-0.5}=0.3935$. Poisson: $1-P(\\text{no flaw in 10 m})=1-e^{-0.5}=0.3935$ — the same result, because "a flaw within 10 m" and "not zero flaws in 10 m" describe the same event.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b14',

    chapter: 'continuous-distributions',

    topic: 'Exponential distribution',

    difficulty: 'hard',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q14',

    instance: {
      prompt:
        'A machine stops when either the drive belt or the controller fails, whichever comes first. The lives ' +
        'are independent and exponential with rates $1/400$ and $1/600$ per hour. Find (a) the mean time to a ' +
        'stoppage, (b) $P(T>300)$, and (c) the probability that the belt is the component that caused the ' +
        'stoppage.',

      parts: [
        { kind: 'numeric', label: '(a) mean time to a stoppage', answer: 240, tol: 0.5 },

        { kind: 'numeric', label: '(b) P(T > 300)', answer: 0.2865, tol: 0.0005 },

        { kind: 'numeric', label: '(c) P(belt caused the stoppage)', answer: 0.6, tol: 0.0005 },
      ],

      solution: [
        { text: '(a) $\\lambda=1/400+1/600=1/240$, so $\\mu=240.0$ h.' },

        { text: '(b) $P(T>300)=e^{-300/240}=e^{-1.25}=0.2865$.' },

        { text: '(c) $P(\\text{belt first})=\\lambda_{\\text{belt}}/\\lambda_{\\text{total}}=(1/400)/(1/240)=0.6000$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b15',

    chapter: 'continuous-distributions',

    topic: 'Exponential distribution',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q15',

    instance: {
      prompt:
        'Parts arrive at an automated inspection booth as a Poisson process at a rate of 3 arrivals per ' +
        'minute. Let $Y$ be the time between successive arrivals. Find (a) $E(Y)$ and $V(Y)$, (b) $P(Y\\le1)$, ' +
        'and (c) if the inspector takes 0.5 minute to handle one part, the probability that no new part is ' +
        'waiting when that inspection is finished.',

      parts: [
        { kind: 'numeric', label: '(a) E(Y)', answer: 0.3333, tol: 0.0005 },

        { kind: 'numeric', label: '(a) V(Y)', answer: 0.1111, tol: 0.0005 },

        { kind: 'numeric', label: '(b) P(Y <= 1)', answer: 0.9502, tol: 0.0005 },

        { kind: 'numeric', label: '(c) P(no new part waiting)', answer: 0.2231, tol: 0.0005 },
      ],

      solution: [
        { text: '(a) $E(Y)=1/\\lambda=0.3333$ min; $V(Y)=1/\\lambda^2=0.1111$ min$^2$.' },

        { text: '(b) $P(Y\\le1)=1-e^{-3}=0.9502$.' },

        { text: '(c) $P(Y>0.5)=e^{-1.5}=0.2231$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b16',

    chapter: 'continuous-distributions',

    topic: 'Exponential distribution',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q16',

    instance: {
      prompt:
        'User log-ons to a server form a Poisson process with $\\lambda=15$ log-ons per hour. Find (a) the ' +
        'mean and standard deviation of the time until the next log-on, in minutes, (b) the length of ' +
        'interval $x$ for which the probability of no log-on during the interval is 0.90, and (c) $P(\\text{no ' +
        'log-on in the next 6 minutes})$.',

      parts: [
        { kind: 'numeric', label: '(a) mean (min)', answer: 4, tol: 0.05 },

        { kind: 'numeric', label: '(a) standard deviation (min)', answer: 4, tol: 0.05 },

        { kind: 'numeric', label: '(b) x (min)', answer: 0.4214, tol: 0.005 },

        { kind: 'numeric', label: '(c) P(no log-on in next 6 min)', answer: 0.2231, tol: 0.0005 },
      ],

      solution: [
        { text: '(a) $\\mu=\\sigma=1/15$ h $=4.000$ min.' },

        { text: '(b) $e^{-15x}=0.90\\Rightarrow x=-\\ln(0.90)/15\\approx0.007024$ h $=0.4214$ min ($\\approx25.3$ s).' },

        { text: '(c) 6 min $=0.1$ h; $P=e^{-15\\times0.1}=e^{-1.5}=0.2231$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b17',

    chapter: 'continuous-distributions',

    topic: 'Areas under the normal curve',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q17',

    instance: {
      prompt:
        'Using Table A.3 for the standard normal distribution, find (a) the value of $k$ such that ' +
        '$P(Z>k)=0.0322$, (b) the value of $k$ such that $P(k<Z<-0.18)=0.4197$, and (c) the area under the ' +
        'curve between $z=-1.97$ and $z=0.86$.',

      parts: [
        { kind: 'numeric', label: '(a) k', answer: 1.85, tol: 0.01 },

        { kind: 'numeric', label: '(b) k', answer: -2.37, tol: 0.01 },

        { kind: 'numeric', label: '(c) area', answer: 0.7807, tol: 0.0005 },
      ],

      solution: [
        { text: '(a) $P(Z<k)=1-0.0322=0.9678\\Rightarrow k=1.85$.' },

        { text: '(b) $P(Z<-0.18)=0.4286$, so $P(Z<k)=0.4286-0.4197=0.0089\\Rightarrow k=-2.37$.' },

        { text: '(c) $P(-1.97<Z<0.86)=0.8051-0.0244=0.7807$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b18',

    chapter: 'continuous-distributions',

    topic: 'Applications of the normal distribution',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q18',

    instance: {
      prompt:
        'The tensile strength of a wire is normal with mean 80 MPa and standard deviation 5 MPa. Using Table ' +
        'A.3, find (a) $P(72<X<88)$, (b) $P(X>90)$, and (c) the strength exceeded by only the strongest 5% of ' +
        'wires.',

      parts: [
        { kind: 'numeric', label: '(a) P(72 < X < 88)', answer: 0.8904, tol: 0.0005 },

        { kind: 'numeric', label: '(b) P(X > 90)', answer: 0.0228, tol: 0.0005 },

        { kind: 'numeric', label: '(c) strength at top 5%', answer: 88.23, tol: 0.05 },
      ],

      solution: [
        { text: '(a) $z=-1.60$ and $+1.60$; $P=0.9452-0.0548=0.8904$.' },

        { text: '(b) $z=2.00$; $P=1-0.9772=0.0228$.' },

        { text: '(c) $z=1.645\\Rightarrow x=80+1.645(5)=88.23$ MPa.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b19',

    chapter: 'continuous-distributions',

    topic: 'Applications of the normal distribution',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q19',

    instance: {
      prompt:
        'A shaft diameter is normal with mean 2.500 mm and standard deviation 0.020 mm; the specification is ' +
        '2.460 to 2.530 mm. Find (a) the proportion conforming, (b) the number scrapped, on average, per ' +
        '10 000 shafts, and (c) identify which limit contributes more of the scrap, with numbers.',

      parts: [
        { kind: 'numeric', label: '(a) proportion conforming', answer: 0.9104, tol: 0.0005 },

        { kind: 'numeric', label: '(b) scrapped per 10 000', answer: 896, tol: 1 },

        {
          kind: 'short',

          label: '(c) which limit contributes more scrap',

          answer:
            'The upper limit dominates: upper tail 0.0668 versus lower tail 0.0228, about 75% of all scrap.',
        },
      ],

      solution: [
        { text: '(a) $z=-2.00$ and $+1.50$; $P=0.9332-0.0228=0.9104$.' },

        { text: '(b) Scrap fraction $=1-0.9104=0.0896$, so about 896 shafts per 10 000.' },

        {
          text: '(c) Upper tail $=1-0.9332=0.0668$; lower tail $=0.0228$. The upper limit dominates, contributing about 75% of all scrap.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b20',

    chapter: 'continuous-distributions',

    topic: 'Applications of the normal distribution',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q20',

    instance: {
      prompt:
        'A filling process is normal with a standard deviation of 2 mL. The lower specification limit is 50 ' +
        'mL, and at most 1% of containers may fall below it. Find (a) the required $z$ value from Table A.3, ' +
        '(b) the minimum mean fill, and (c) the resulting proportion above 58 mL at that mean.',

      parts: [
        { kind: 'numeric', label: '(a) z', answer: -2.33, tol: 0.01 },

        { kind: 'numeric', label: '(b) minimum mean fill', answer: 54.66, tol: 0.05 },

        { kind: 'numeric', label: '(c) proportion above 58 mL', answer: 0.0475, tol: 0.0005 },
      ],

      solution: [
        { text: '(a) $P(Z<-2.33)=0.0099\\approx0.01$, so $z=-2.33$.' },

        { text: '(b) $\\mu-2.33(2)=50\\Rightarrow\\mu=54.66$ mL.' },

        { text: '(c) $z=(58-54.66)/2=1.67$; $P=1-0.9525=0.0475$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b21',

    chapter: 'continuous-distributions',

    topic: 'Applications of the normal distribution',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q21',

    instance: {
      prompt:
        'A cure time is normal with a mean of 52 minutes, and 10% of batches exceed 60 minutes. Find (a) the ' +
        'standard deviation, (b) $P(X<45)$, and (c) the interquartile range of the cure time.',

      parts: [
        { kind: 'numeric', label: '(a) standard deviation', answer: 6.25, tol: 0.01 },

        { kind: 'numeric', label: '(b) P(X < 45)', answer: 0.1314, tol: 0.0005 },

        { kind: 'numeric', label: '(c) interquartile range', answer: 8.375, tol: 0.01 },
      ],

      solution: [
        { text: '(a) $P(Z<1.28)=0.8997\\approx0.90$, so $1.28\\sigma=8\\Rightarrow\\sigma=6.25$ min.' },

        { text: '(b) $z=(45-52)/6.25=-1.12$; $P=0.1314$.' },

        { text: '(c) Quartiles at $z=\\pm0.67$, so $\\text{IQR}=2(0.67)(6.25)=8.375$ min.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b22',

    chapter: 'continuous-distributions',

    topic: 'Applications of the normal distribution',

    difficulty: 'hard',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q22',

    instance: {
      prompt:
        'For a normally distributed hardness reading, $P(X<40)=0.0228$ and $P(X>55)=0.1587$ (in HRC). Find ' +
        '(a) the two $z$ values, (b) $\\mu$ and $\\sigma$, and (c) $P(45<X<60)$.',

      parts: [
        { kind: 'numeric', label: '(a) z1', answer: -2, tol: 0.01 },

        { kind: 'numeric', label: '(a) z2', answer: 1, tol: 0.01 },

        { kind: 'numeric', label: '(b) mu', answer: 50, tol: 0.05 },

        { kind: 'numeric', label: '(b) sigma', answer: 5, tol: 0.05 },

        { kind: 'numeric', label: '(c) P(45 < X < 60)', answer: 0.8185, tol: 0.0005 },
      ],

      solution: [
        { text: '(a) $z=-2.00$ (area 0.0228) and $z=+1.00$ (area 0.8413).' },

        { text: '(b) $\\mu-2\\sigma=40$ and $\\mu+\\sigma=55\\Rightarrow3\\sigma=15$, $\\sigma=5.00$ HRC and $\\mu=50.00$ HRC.' },

        { text: '(c) $z=-1.00$ and $+2.00$; $P=0.9772-0.1587=0.8185$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b23',

    chapter: 'continuous-distributions',

    topic: 'Applications of the normal distribution',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q23',

    instance: {
      prompt:
        'Gauges reject all components whose dimension is not within $1.50\\pm d$ mm. The dimension is normal ' +
        'with mean 1.50 mm and standard deviation 0.20 mm. Find (a) the value of $d$ for which the ' +
        'specifications cover 95% of the measurements, (b) the value of $d$ for 99% coverage, and (c) the ' +
        'proportion rejected if $d$ is fixed at 0.30 mm.',

      parts: [
        { kind: 'numeric', label: '(a) d for 95%', answer: 0.392, tol: 0.001 },

        { kind: 'numeric', label: '(b) d for 99%', answer: 0.515, tol: 0.001 },

        { kind: 'numeric', label: '(c) proportion rejected at d = 0.30', answer: 0.1336, tol: 0.0005 },
      ],

      solution: [
        { text: '(a) $P(-1.96<Z<1.96)=0.95$, so $d=1.96(0.20)=0.392$ mm.' },

        { text: '(b) $z=2.575$, so $d=2.575(0.20)=0.515$ mm.' },

        { text: '(c) $z=0.30/0.20=1.50$; rejected $=2(1-0.9332)=0.1336$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b24',

    chapter: 'continuous-distributions',

    topic: 'Applications of the normal distribution',

    difficulty: 'hard',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q24',

    instance: {
      prompt:
        'A concrete cube strength is normal with mean 70 MPa and standard deviation 10 MPa. Find (a) ' +
        '$P(X>75)$, (b) $P(X>85)$, and (c) the probability that a cube exceeds 85 MPa given that it has ' +
        'already passed a 75 MPa screening test.',

      parts: [
        { kind: 'numeric', label: '(a) P(X > 75)', answer: 0.3085, tol: 0.0005 },

        { kind: 'numeric', label: '(b) P(X > 85)', answer: 0.0668, tol: 0.0005 },

        { kind: 'numeric', label: '(c) P(X > 85 | X > 75)', answer: 0.2165, tol: 0.0005 },
      ],

      solution: [
        { text: '(a) $z=0.50$; $P=1-0.6915=0.3085$.' },

        { text: '(b) $z=1.50$; $P=1-0.9332=0.0668$.' },

        { text: '(c) $0.0668/0.3085=0.2165$.' },
      ],
    },
  }),

  bookQuestion({
    id: 'ch06-book-bank-b25',

    chapter: 'continuous-distributions',

    topic: 'Normal approximation to the binomial',

    difficulty: 'medium',

    citation: 'Alshwawra IE0121 Exam Bank, Part B Q25',

    instance: {
      prompt:
        'Each of 100 independently produced fasteners is out of tolerance with probability 0.40. Find (a) ' +
        'the numerical check that justifies the normal approximation, (b) the mean and standard deviation of ' +
        'the count, and (c) $P(35\\le X\\le45)$ using the normal approximation with a continuity correction.',

      parts: [
        {
          kind: 'short',

          label: '(a) numerical check',

          answer: 'np = 40 and n(1-p) = 60, both greater than 5, so the normal approximation is appropriate.',
        },

        { kind: 'numeric', label: '(b) mean', answer: 40, tol: 0.05 },

        { kind: 'numeric', label: '(b) standard deviation', answer: 4.899, tol: 0.01 },

        { kind: 'numeric', label: '(c) P(35 <= X <= 45)', answer: 0.7372, tol: 0.0005 },
      ],

      solution: [
        { text: '(a) $np=40$ and $n(1-p)=60$, both greater than 5, so the approximation is appropriate.' },

        { text: '(b) $\\mu=np=40.0$; $\\sigma=\\sqrt{np(1-p)}=\\sqrt{24}=4.899$.' },

        { text: '(c) $z=(34.5-40)/4.899=-1.12$ and $(45.5-40)/4.899=+1.12$; $P=0.8686-0.1314=0.7372$.' },
      ],
    },
  }),
];
