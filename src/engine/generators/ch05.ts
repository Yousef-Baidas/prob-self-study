import type { QuestionTemplate } from '../types';

import { generatedQuestion } from '../authoring';

import { factorial, round } from '../mathx';

/**
 * Binomial coefficient computed by incremental multiply-divide rather than
 * `factorial(n)/(factorial(r)*factorial(n-r))`. `mathx.factorial` is naive and
 * overflows to `Infinity` well before n = 170, which several generators below
 * need (the binomial approximation to the hypergeometric draws N in the
 * thousands). This stays well-conditioned for any n as long as r itself is
 * small, which is all every call site below ever needs.
 */
const choose = (n: number, r: number): number => {
  if (r < 0 || r > n) return 0;

  let result = 1;

  for (let i = 0; i < r; i++) result = (result * (n - i)) / (i + 1);

  return result;
};

const binomialPmf = (n: number, p: number, x: number): number => choose(n, x) * p ** x * (1 - p) ** (n - x);

const hypergeometricPmf = (N: number, n: number, k: number, x: number): number =>
  (choose(k, x) * choose(N - k, n - x)) / choose(N, n);

const negativeBinomialPmf = (x: number, k: number, p: number): number => choose(x - 1, k - 1) * p ** k * (1 - p) ** (x - k);

const geometricPmf = (p: number, x: number): number => p * (1 - p) ** (x - 1);

const poissonPmf = (lambdaT: number, x: number): number => (Math.exp(-lambdaT) * lambdaT ** x) / factorial(x);

const binomialCdf = (n: number, p: number, x: number): number => {
  let s = 0;

  for (let i = 0; i <= x; i++) s += binomialPmf(n, p, i);

  return s;
};

const hypergeometricCdf = (N: number, n: number, k: number, x: number, lower: number): number => {
  let s = 0;

  for (let i = lower; i <= x; i++) s += hypergeometricPmf(N, n, k, i);

  return s;
};

const poissonCdf = (lambdaT: number, x: number): number => {
  let s = 0;

  for (let i = 0; i <= x; i++) s += poissonPmf(lambdaT, i);

  return s;
};

/**
 * Smallest n with 1-(1-p)^n >= target, found by direct search rather than the
 * closed form ceil(ln(1-target)/ln(1-p)): the closed form's ceiling can land
 * one integer short of the true answer for target/p combinations that put
 * the exact log ratio within float error of an integer boundary. The search
 * is cheap -- n never runs past a few hundred for the p, target pairs used
 * below -- and it is what the answer is actually defined to be.
 */
const smallestNForAtLeastOne = (p: number, target: number): number => {
  let n = 1;

  while (1 - (1 - p) ** n < target) n++;

  return n;
};

const binomialPmfMeanVarianceTemplate = generatedQuestion({
  id: 'ch05-gen-binomial-pmf-mean-variance',

  chapter: 'discrete-distributions',

  topic: 'Binomial and multinomial',

  difficulty: 'easy',

  generate: (rng) => {
    const n = rng.int(4, 8);

    const pTenths = rng.int(1, 9); // strictly inside (0, 1), so q is never 0 either

    const p = round(pTenths / 10, 1);

    const q = round(1 - p, 1);

    // x is windowed to within 1 of the rounded mean n*p rather than drawn
    // uniformly over [1, n-1]: away from the mean, b(x;n,p) can underflow
    // 4dp rounding (e.g. n=8, p=0.9, x=2 gives 2.27e-5, which rounds to 0
    // and would be gradable by a guess). The window is always non-empty
    // since round(n*p) itself lies in [0, n].
    const meanRound = Math.round(n * p);

    const x = rng.int(Math.max(0, meanRound - 1), Math.min(n, meanRound + 1));

    const pmf = round(binomialPmf(n, p, x), 4);

    const mean = round(n * p, 4);

    const variance = round(n * p * q, 4);

    return {
      prompt:
        `A manufacturing process produces items that are defective independently, each with probability ` +
        `$p=${p}$. In a random sample of $n=${n}$ items, let $X$ be the number of defective items. Find ` +
        `$P(X=${x})$, the mean of $X$, and the variance of $X$.`,

      params: { n, p, x },

      parts: [
        { kind: 'numeric', label: `P(X = ${x})`, answer: pmf, tol: 0.0005 },

        { kind: 'numeric', label: 'mean', answer: mean, tol: 0.0005 },

        { kind: 'numeric', label: 'variance', answer: variance, tol: 0.0005 },
      ],

      solution: [
        {
          text: `Each item is defective independently with the same chance $p$, and the sample size $n$ is fixed in advance — that is a Bernoulli process, so $X$ is binomial.`,
        },

        {
          text: `$P(X=${x})=\\binom{${n}}{${x}}(${p})^{${x}}(${q})^{${n - x}}\\approx${pmf}$.`,
        },

        {
          text: `The mean and variance of a binomial random variable are $\\mu=np=${n}\\cdot${p}=${mean}$ and $\\sigma^2=npq=${n}\\cdot${p}\\cdot${q}=${variance}$.`,
        },
      ],
    };
  },
});

const multinomialTripleTemplate = generatedQuestion({
  id: 'ch05-gen-multinomial-triple',

  chapter: 'discrete-distributions',

  topic: 'Binomial and multinomial',

  difficulty: 'hard',

  generate: (rng) => {
    // Weights sum to a fixed 12, so every probability is an exact twelfth
    // rather than a rounded decimal; w1 in [2,5] and w2 in [2, 9 - w1] keep
    // w1 + w2 <= 9, so w3 = 12 - w1 - w2 is always at least 3.
    const w1 = rng.int(2, 5);

    const w2 = rng.int(2, 9 - w1);

    const w3 = 12 - w1 - w2;

    const n = rng.int(5, 7);

    const x1 = rng.int(1, n - 3); // leaves at least 2 trials for x2 and x3

    const x2 = rng.int(1, n - x1 - 1); // leaves at least 1 trial for x3

    const x3 = n - x1 - x2;

    const coeff = factorial(n) / (factorial(x1) * factorial(x2) * factorial(x3));

    const p1 = w1 / 12;

    const p2 = w2 / 12;

    const p3 = w3 / 12;

    const answer = round(coeff * p1 ** x1 * p2 ** x2 * p3 ** x3, 4);

    return {
      prompt:
        `A randomly arriving vehicle uses lane 1, lane 2, or lane 3 with probabilities $p_1=\\dfrac{${w1}}{12}$, ` +
        `$p_2=\\dfrac{${w2}}{12}$, and $p_3=\\dfrac{${w3}}{12}$. Over $n=${n}$ independent arrivals, find the ` +
        `probability that lane 1 is used $x_1=${x1}$ times, lane 2 is used $x_2=${x2}$ times, and lane 3 is ` +
        `used $x_3=${x3}$ times.`,

      params: { w1, w2, w3, n, x1, x2, x3 },

      parts: [{ kind: 'numeric', answer, tol: 0.0005 }],

      solution: [
        {
          text: `Each arrival lands in one of three categories rather than two, so this is a multinomial experiment, not a binomial one.`,
        },

        {
          text: `The number of orderings giving $x_1=${x1}$, $x_2=${x2}$, $x_3=${x3}$ out of $n=${n}$ trials is $\\binom{${n}}{${x1},${x2},${x3}}=\\dfrac{${n}!}{${x1}!\\,${x2}!\\,${x3}!}=${coeff}$.`,
        },

        {
          text: `$f(${x1},${x2},${x3})=${coeff}\\left(\\dfrac{${w1}}{12}\\right)^{${x1}}\\left(\\dfrac{${w2}}{12}\\right)^{${x2}}\\left(\\dfrac{${w3}}{12}\\right)^{${x3}}\\approx${answer}$.`,
        },
      ],
    };
  },
});

const hypergeometricPmfTemplate = generatedQuestion({
  id: 'ch05-gen-hypergeometric-pmf',

  chapter: 'discrete-distributions',

  topic: 'Hypergeometric',

  difficulty: 'easy',

  generate: (rng) => {
    const total = rng.int(15, 25);

    const defective = rng.int(2, 5);

    const sample = rng.int(3, 5);

    // total >= 15 and defective <= 5 keeps total - defective >= 10, always
    // comfortably above sample <= 5, so the lower support bound is always 0
    // and every x below is well-posed without needing to check it per draw.
    const support = Math.min(defective, sample);

    // x is windowed to within 1 of the rounded mean sample*defective/total
    // rather than drawn uniformly up to the extreme support bound: at the
    // extreme (e.g. total=20, defective=5, sample=5, x=5) the mass can be
    // as small as 1/15504 ≈ 0.0001, inside tol. round(mean) always lies in
    // [0, support], so the clamped window is always non-empty.
    const meanRound = Math.round((sample * defective) / total);

    const x = rng.int(Math.max(0, meanRound - 1), Math.min(support, meanRound + 1));

    const answer = round(hypergeometricPmf(total, sample, defective, x), 4);

    return {
      prompt:
        `A shipment of ${total} electronic components contains ${defective} that are defective. A random ` +
        `sample of ${sample} components is drawn **without replacement**. Let $X$ be the number of defective ` +
        `components in the sample. Find $P(X=${x})$.`,

      params: { total, defective, sample, x },

      parts: [{ kind: 'numeric', answer, tol: 0.0005 }],

      solution: [
        {
          text: `Sampling without replacement from a finite lot is exactly what makes $X$ hypergeometric rather than binomial.`,
        },

        {
          text: `$P(X=${x})=h(${x};${total},${sample},${defective})=\\dfrac{\\binom{${defective}}{${x}}\\binom{${total - defective}}{${sample - x}}}{\\binom{${total}}{${sample}}}\\approx${answer}$.`,
        },
      ],
    };
  },
});

const hypergeometricMeanVarianceTemplate = generatedQuestion({
  id: 'ch05-gen-hypergeometric-mean-variance',

  chapter: 'discrete-distributions',

  topic: 'Hypergeometric',

  difficulty: 'medium',

  generate: (rng) => {
    const total = rng.int(20, 30);

    const defective = rng.int(3, 8);

    const sample = rng.int(4, 8);

    const mean = round((sample * defective) / total, 4);

    const k_over_N = defective / total;

    const variance = round(((total - sample) / (total - 1)) * sample * k_over_N * (1 - k_over_N), 4);

    return {
      prompt:
        `A batch of ${total} items contains ${defective} defective ones. A sample of ${sample} is drawn ` +
        `**without replacement**. Let $X$ be the number of defective items in the sample. Find the mean and ` +
        `the variance of $X$.`,

      params: { total, defective, sample },

      parts: [
        { kind: 'numeric', label: 'mean', answer: mean, tol: 0.0005 },

        { kind: 'numeric', label: 'variance', answer: variance, tol: 0.0005 },
      ],

      solution: [
        {
          text: `The mean of a hypergeometric random variable is $\\mu=\\dfrac{nk}{N}=\\dfrac{${sample}\\cdot${defective}}{${total}}\\approx${mean}$ — the same formula as a binomial mean with $p=k/N$.`,
        },

        {
          text: `The variance carries an extra factor: $\\sigma^2=\\dfrac{N-n}{N-1}\\cdot n\\cdot\\dfrac{k}{N}\\left(1-\\dfrac{k}{N}\\right)\\approx${variance}$. The factor $\\frac{N-n}{N-1}$ is the finite population correction — it has no counterpart in the binomial variance.`,
        },
      ],
    };
  },
});

const recognizeDistributionTemplate = generatedQuestion({
  id: 'ch05-gen-recognize-distribution',

  chapter: 'discrete-distributions',

  topic: 'Hypergeometric',

  difficulty: 'medium',

  generate: (rng) => {
    const defective = rng.int(3, 10);

    const sample = rng.int(4, 10);

    // total drawn after defective and sample, so the lot always genuinely
    // contains room for both -- no draw can ask to sample more items than
    // the batch (minus its defectives) can supply.
    const total = defective + sample + rng.int(10, 40);

    return {
      prompt:
        `A batch of ${total} items contains ${defective} defective ones. An inspector selects ${sample} items ` +
        `at random **without replacement** and counts how many of them are defective. Which distribution ` +
        `models this count?`,

      params: { total, defective, sample },

      parts: [
        {
          kind: 'mcq',

          choices: ['Binomial', 'Hypergeometric', 'Geometric', 'Poisson'],

          answer: 1,
        },
      ],

      solution: [
        {
          text: `The sample is drawn **without replacement** from a finite lot, so the chance of a defective item changes from draw to draw as the lot is depleted.`,
        },

        {
          text: `That dependence between draws is exactly what the binomial distribution cannot model — the binomial requires the same chance of success on every trial. Sampling without replacement from a finite population is the hypergeometric's defining feature.`,
        },

        {
          text: `Neither the geometric nor the Poisson applies here: this experiment has a fixed sample size, not a count of trials until a first success or a count of events over an interval.`,
        },
      ],
    };
  },
});

const binomialApproxHypergeometricTemplate = generatedQuestion({
  id: 'ch05-gen-binomial-approx-hypergeometric',

  chapter: 'discrete-distributions',

  topic: 'Hypergeometric',

  difficulty: 'hard',

  generate: (rng) => {
    // N a multiple of 20 keeps k = p0 * N an exact integer for every p0 in the
    // list below, whose denominators all divide 20.
    const N = rng.int(200, 300) * 20; // 4000..6000

    const p0 = rng.pick([0.1, 0.15, 0.2, 0.25, 0.3]);

    const k = Math.round(p0 * N);

    const n = rng.int(8, 12);

    // n / N never exceeds 12 / 4000 = 0.003, far under the 0.05 rule of thumb,
    // so the approximation this question asks for is always valid by
    // construction, not merely plausible.
    //
    // x is windowed to within 1 of the rounded mean n*p0 (equivalently
    // n*k/N) rather than drawn uniformly over [1, n-1]: away from the mean
    // both the exact and approximate probabilities can underflow 4dp
    // rounding simultaneously (e.g. N=5260, k=526, n=10, p0=0.1, x=9 gives
    // ~9e-9 for both). Staying near the mean keeps both material AND close,
    // which is what the approximation is meant to demonstrate.
    const meanRound = Math.round(n * p0);

    const x = rng.int(Math.max(0, meanRound - 1), Math.min(n, meanRound + 1));

    const exact = round(hypergeometricPmf(N, n, k, x), 4);

    const approx = round(binomialPmf(n, p0, x), 4);

    return {
      prompt:
        `A shipment of ${N} tires includes ${k} that are slightly blemished. A retailer buys ${n} tires at ` +
        `random from the shipment. Find the exact probability that exactly ${x} of the ${n} are blemished ` +
        `using the hypergeometric distribution, and then find the binomial approximation using $p=k/N$.`,

      params: { N, k, n, x, p0 },

      parts: [
        { kind: 'numeric', label: 'exact (hypergeometric)', answer: exact, tol: 0.0005 },

        { kind: 'numeric', label: 'approximate (binomial)', answer: approx, tol: 0.0005 },
      ],

      solution: [
        {
          text: `The exact model is hypergeometric, since the sample is drawn without replacement: $h(${x};${N},${n},${k})\\approx${exact}$.`,
        },

        {
          text: `Here $n/N=${n}/${N}\\approx${round(n / N, 4)}$, well under the $0.05$ rule of thumb, so removing tires from the shipment barely changes its composition — the binomial with $p=k/N=${p0}$ should track the exact value closely.`,
        },

        {
          text: `$b(${x};${n},${p0})\\approx${approx}$ — close to the exact value above, which is exactly what the approximation promises when $n/N$ is small.`,
        },
      ],
    };
  },
});

const geometricPmfTemplate = generatedQuestion({
  id: 'ch05-gen-geometric-pmf',

  chapter: 'discrete-distributions',

  topic: 'Geometric and negative binomial',

  difficulty: 'easy',

  generate: (rng) => {
    const m = rng.int(10, 50); // "1 in every m" -- keeps p a clean reciprocal

    const p = 1 / m; // kept unrounded so 1/p reconstructs m exactly, matching the mean below

    const x = rng.int(2, 6); // >= 2, so the question is genuinely about waiting, not an immediate success

    const pmf = round(geometricPmf(p, x), 5);

    const mean = m; // mu = 1/p = m exactly, since p = 1/m

    return {
      prompt:
        `On average, $1$ in every ${m} items produced is defective, independently of the others. Let $X$ be ` +
        `the number of items inspected up to and including the first defective one. Find $P(X=${x})$ and the ` +
        `mean of $X$.`,

      params: { m, x },

      parts: [
        { kind: 'numeric', label: `P(X = ${x})`, answer: pmf, tol: 0.00005 },

        { kind: 'numeric', label: 'mean', answer: mean, tol: 0.01 },
      ],

      solution: [
        {
          text: `$X$ counts **trials until the first success**, not successes among a fixed number of trials — that makes it geometric, with $p=1/${m}$.`,
        },

        {
          text: `$P(X=${x})=g(${x};p)=pq^{${x}-1}=\\dfrac{1}{${m}}\\left(1-\\dfrac{1}{${m}}\\right)^{${x - 1}}\\approx${pmf}$.`,
        },

        {
          text: `The mean of the geometric distribution is $\\mu=1/p=${m}$: on average it takes ${m} inspections to find the first defective item.`,
        },
      ],
    };
  },
});

const negativeBinomialPmfTemplate = generatedQuestion({
  id: 'ch05-gen-negative-binomial-pmf',

  chapter: 'discrete-distributions',

  topic: 'Geometric and negative binomial',

  difficulty: 'medium',

  generate: (rng) => {
    const pTenths = rng.int(3, 7); // keeps p away from the degenerate extremes

    const p = round(pTenths / 10, 1);

    const k = rng.int(2, 4);

    const x = rng.int(k, k + 4); // x >= k, since the kth success cannot land before trial k

    const answer = round(negativeBinomialPmf(x, k, p), 4);

    return {
      prompt:
        `A team wins each game it plays independently with probability $p=${p}$. Let $X$ be the number of ` +
        `games required for the team to win its $k=${k}$th game. Find $P(X=${x})$.`,

      params: { p, k, x },

      parts: [{ kind: 'numeric', answer, tol: 0.0005 }],

      solution: [
        {
          text: `$X$ counts trials until the $k$th success — a fixed number of successes, not a fixed number of trials — so $X$ is negative binomial, with support starting at $x=k=${k}$.`,
        },

        {
          text: `$P(X=${x})=b^*(${x};${k},${p})=\\binom{${x - 1}}{${k - 1}}(${p})^{${k}}(${round(1 - p, 1)})^{${x - k}}\\approx${answer}$.`,
        },

        {
          text: `The last game must be the $k$th win itself, so the binomial coefficient only orders the first $${x}-1=${x - 1}$ games, among which exactly $${k}-1=${k - 1}$ are wins.`,
        },
      ],
    };
  },
});

const poissonPmfTemplate = generatedQuestion({
  id: 'ch05-gen-poisson-pmf',

  chapter: 'discrete-distributions',

  topic: 'Poisson',

  difficulty: 'medium',

  generate: (rng) => {
    const lambda = rng.int(2, 6);

    const t = rng.int(1, 3);

    const lambdaT = lambda * t;

    // x is windowed tightly around the mean lambdaT rather than over the
    // full [0, lambdaT + 4] range: for larger lambdaT (up to 18 here), the
    // lower reaches of that range sit several standard deviations below the
    // mean (e.g. lambdaT=18, x=1 is > 4 sigma out) and the true probability
    // underflows 4dp rounding to 0.
    const x = rng.int(Math.max(0, Math.round(lambdaT) - 2), Math.round(lambdaT) + 3);

    const pmf = round(poissonPmf(lambdaT, x), 4);

    return {
      prompt:
        `Messages arrive at a server at an average rate of $\\lambda=${lambda}$ per minute. Over a period of ` +
        `$t=${t}$ minutes, let $X$ be the number of messages that arrive. Find $P(X=${x})$, and state the ` +
        `mean and the variance of $X$.`,

      params: { lambda, t, x },

      parts: [
        { kind: 'numeric', label: `P(X = ${x})`, answer: pmf, tol: 0.0005 },

        { kind: 'numeric', label: 'mean', answer: lambdaT, tol: 0.0005 },

        { kind: 'numeric', label: 'variance', answer: lambdaT, tol: 0.0005 },
      ],

      solution: [
        {
          text: `The parameter of the Poisson distribution is $\\lambda t$, the rate scaled to the interval actually asked about: $\\lambda t=${lambda}\\cdot${t}=${lambdaT}$.`,
        },

        {
          text: `$P(X=${x})=p(${x};${lambdaT})=\\dfrac{e^{-${lambdaT}}(${lambdaT})^{${x}}}{${x}!}\\approx${pmf}$.`,
        },

        {
          text: `Both the mean and the variance of a Poisson random variable equal $\\lambda t=${lambdaT}$ — not a coincidence of this example, but a property of the distribution.`,
        },
      ],
    };
  },
});

const poissonBinomialApproxTemplate = generatedQuestion({
  id: 'ch05-gen-poisson-binomial-approx',

  chapter: 'discrete-distributions',

  topic: 'Poisson',

  difficulty: 'hard',

  generate: (rng) => {
    const n = rng.int(200, 500);

    const pThousandths = rng.int(1, 5); // p <= 0.005, comfortably "close to 0"

    const p = round(pThousandths / 1000, 4);

    const mu = round(n * p, 4);

    // x is windowed around the mean mu = np rather than drawn uniformly
    // over [0, min(6, ceil(mu)+3)]: away from the mean, both the Poisson
    // approximation and the exact binomial can underflow 4dp rounding at
    // the same time (e.g. mu small, x drawn near the range's upper end),
    // which would make the comparison this question asks for vacuous.
    // Staying close to the mean keeps both material AND close, which is
    // exactly what the approximation is meant to demonstrate; mu <= 2.5
    // here keeps x small enough that x! never risks precision.
    const meanRound = Math.round(mu);

    const x = rng.int(Math.max(0, meanRound - 2), meanRound + 3);

    const approx = round(poissonPmf(mu, x), 4);

    const exact = round(binomialPmf(n, p, x), 4);

    return {
      prompt:
        `In a factory, an item is defective independently with probability $p=${p}$. Among $n=${n}$ items ` +
        `inspected, let $X$ be the number of defective items. Using the Poisson approximation with $\\mu=np$, ` +
        `find the approximate probability $P(X=${x})$, and compare it with the exact binomial probability.`,

      params: { n, p, x, mu },

      parts: [
        { kind: 'numeric', label: 'Poisson approximation', answer: approx, tol: 0.0005 },

        { kind: 'numeric', label: 'exact binomial', answer: exact, tol: 0.0005 },
      ],

      solution: [
        {
          text: `Here $n=${n}$ is large and $p=${p}$ is close to $0$, with $np=${mu}$ held to a moderate size — exactly the regime where $b(x;n,p)\\to p(x;\\mu)$.`,
        },

        {
          text: `$P(X=${x})\\approx p(${x};${mu})=\\dfrac{e^{-${mu}}(${mu})^{${x}}}{${x}!}\\approx${approx}$.`,
        },

        {
          text: `The exact value is $b(${x};${n},${p})\\approx${exact}$ — close to the Poisson approximation, without ever needing $\\binom{${n}}{${x}}$ computed directly.`,
        },
      ],
    };
  },
});

const uniformPmfMeanVarianceTemplate = generatedQuestion({
  id: 'ch05-gen-uniform-pmf-mean-variance',

  chapter: 'discrete-distributions',

  topic: 'Discrete uniform',

  difficulty: 'easy',

  generate: (rng) => {
    const k = rng.int(4, 6);

    const start = rng.int(2, 15);

    const step = rng.int(2, 6); // step >= 2 keeps the values distinct and the variance well clear of 0

    const values = Array.from({ length: k }, (_, i) => start + i * step);

    const idx = rng.int(0, k - 1);

    const chosen = values[idx];

    const mean = round(values.reduce((a, v) => a + v, 0) / k, 4);

    const variance = round(values.reduce((a, v) => a + (v - mean) ** 2, 0) / k, 4);

    const pmf = round(1 / k, 4);

    return {
      prompt:
        `A calibration rig applies one of the ${k} loads $\\{${values.join(', ')}\\}$ kN to a test fixture, each ` +
        `chosen with equal probability. Let $X$ be the applied load. Find $P(X=${chosen})$, the mean of $X$, ` +
        `and the variance of $X$.`,

      params: { k, start, step, chosen, mean, variance },

      parts: [
        { kind: 'numeric', label: `P(X = ${chosen})`, answer: pmf, tol: 0.0005 },

        { kind: 'numeric', label: 'mean', answer: mean, tol: 0.001 },

        { kind: 'numeric', label: 'variance', answer: variance, tol: 0.001 },
      ],

      solution: [
        {
          text: `Every one of the $k=${k}$ loads is equally likely, so $X$ is a discrete uniform random variable and $f(x;${k})=\\dfrac{1}{${k}}\\approx${pmf}$ for each value.`,
        },

        {
          text: `The mean is the plain average of the $k$ values: $\\mu=\\dfrac{1}{${k}}\\sum x_i\\approx${mean}$.`,
        },

        {
          text: `The variance is the average squared deviation from that mean: $\\sigma^2=\\dfrac{1}{${k}}\\sum (x_i-\\mu)^2\\approx${variance}$.`,
        },
      ],
    };
  },
});

const uniformConsecutiveIntegersTemplate = generatedQuestion({
  id: 'ch05-gen-uniform-consecutive-integers',

  chapter: 'discrete-distributions',

  topic: 'Discrete uniform',

  difficulty: 'medium',

  generate: (rng) => {
    const a = rng.int(1, 5);

    const N = rng.int(8, 20); // count of consecutive integers, so support is a .. a+N-1

    const b = a + N - 1;

    // c is at least 2 away from b so the favourable count b-c+1 is always >= 2,
    // keeping P(X >= c) = (b-c+1)/N comfortably above tol even at the largest N here.
    const c = rng.int(a + 1, b - 2);

    const mean = round((a + b) / 2, 4);

    const variance = round((N ** 2 - 1) / 12, 4);

    const favourable = b - c + 1;

    const tailProb = round(favourable / N, 4);

    return {
      prompt:
        `A robotic arm parks at one of $N=${N}$ equally likely index positions numbered ${a} through ${b}. ` +
        `Let $X$ be the parking index. Find the mean of $X$, the variance of $X$, and $P(X\\ge${c})$.`,

      params: { a, N, b, c, mean, variance },

      parts: [
        { kind: 'numeric', label: 'mean', answer: mean, tol: 0.001 },

        { kind: 'numeric', label: 'variance', answer: variance, tol: 0.001 },

        { kind: 'numeric', label: `P(X >= ${c})`, answer: tailProb, tol: 0.0005 },
      ],

      solution: [
        {
          text: `$X$ is discrete uniform on the consecutive integers ${a}, ${a + 1}, \\ldots, ${b}$ -- the special case where the mean is just the midpoint and the variance has a closed form in $N$.`,
        },

        {
          text: `$\\mu=\\dfrac{a+b}{2}=\\dfrac{${a}+${b}}{2}=${mean}$, and $\\sigma^2=\\dfrac{N^2-1}{12}=\\dfrac{${N}^2-1}{12}\\approx${variance}$.`,
        },

        {
          text: `Each of the $N=${N}$ positions carries probability $1/${N}$, and $${favourable}$ of them are at least ${c}$, so $P(X\\ge${c})=\\dfrac{${favourable}}{${N}}\\approx${tailProb}$.`,
        },
      ],
    };
  },
});

// Values of N for which (N^2 - 1)/12 lands on an exact integer: N odd and not
// a multiple of 3 makes N-1 and N+1 both even (one divisible by 4) and one of
// the three consecutive integers N-1, N, N+1 divisible by 3, so N^2-1 is
// always divisible by 24. This lets the question hand back a whole-number
// variance without rounding, so inverting it for N recovers N exactly.
const NICE_UNIFORM_N = [5, 7, 11, 13, 17, 19, 23, 25, 29, 31, 35, 37];

const uniformTailFromVarianceTemplate = generatedQuestion({
  id: 'ch05-gen-uniform-tail-from-variance',

  chapter: 'discrete-distributions',

  topic: 'Discrete uniform',

  difficulty: 'hard',

  generate: (rng) => {
    const N = rng.pick(NICE_UNIFORM_N);

    const variance = (N ** 2 - 1) / 12; // exact integer by construction, see NICE_UNIFORM_N

    // c stays at least 2 away from N so the favourable count is always >= 2,
    // the same margin uniformConsecutiveIntegersTemplate uses above.
    const c = rng.int(Math.ceil(N / 2), N - 2);

    const favourable = N - c + 1;

    const tailProb = round(favourable / N, 4);

    return {
      prompt:
        `A test coupon is drawn from a numbered set $1, 2, \\ldots, N$ with equal probability. The variance of ` +
        `the drawn number is $${variance}$. Find $N$, and then find $P(X\\ge${c})$.`,

      params: { N, variance, c },

      parts: [
        { kind: 'numeric', label: 'N', answer: N, tol: 0.5 },

        { kind: 'numeric', label: `P(X >= ${c})`, answer: tailProb, tol: 0.0005 },
      ],

      solution: [
        {
          text: `For $X$ uniform on $1,\\ldots,N$, $\\sigma^2=\\dfrac{N^2-1}{12}$. Setting this equal to $${variance}$ and solving gives $N^2=12(${variance})+1$, so $N=${N}$.`,
        },

        {
          text: `With $N=${N}$ confirmed, $${favourable}$ of the $${N}$ equally likely values are at least ${c}$, so $P(X\\ge${c})=\\dfrac{${favourable}}{${N}}\\approx${tailProb}$.`,
        },
      ],
    };
  },
});

const uniformDiscriminationTemplate = generatedQuestion({
  id: 'ch05-gen-uniform-discrimination',

  chapter: 'discrete-distributions',

  topic: 'Discrete uniform',

  difficulty: 'medium',

  generate: (rng) => {
    const N = rng.int(6, 30);

    const mean = round((1 + N) / 2, 4);

    return {
      prompt:
        `A quality inspector audits one of $N=${N}$ numbered inspection stations next, chosen completely at ` +
        `random with no station favoured over another. Which distribution models the chosen station number, ` +
        `and what is its mean?`,

      params: { N, mean },

      parts: [
        {
          kind: 'mcq',

          choices: ['Discrete uniform', 'Binomial', 'Hypergeometric', 'Poisson'],

          answer: 0,
        },

        { kind: 'numeric', label: 'mean', answer: mean, tol: 0.001 },
      ],

      solution: [
        {
          text: `Nothing here is a success/failure trial, a sample from a finite lot, or a count over an interval -- every station number from $1$ to $${N}$ is simply equally likely. That is the discrete uniform distribution.`,
        },

        {
          text: `Its mean is the midpoint of the range: $\\mu=\\dfrac{1+N}{2}=\\dfrac{1+${N}}{2}=${mean}$.`,
        },
      ],
    };
  },
});

const binomialCumulativeTemplate = generatedQuestion({
  id: 'ch05-gen-binomial-cumulative',

  chapter: 'discrete-distributions',

  topic: 'Binomial and multinomial',

  difficulty: 'medium',

  generate: (rng) => {
    const n = rng.int(6, 10);

    const p = rng.pick([0.3, 0.4, 0.5, 0.6, 0.7]);

    const meanRound = Math.round(n * p);

    const direction = rng.pick(['atMost', 'atLeast', 'between'] as const);

    let answer: number;

    let label: string;

    let math: string; // bare "P(...)" LaTeX, without the surrounding $...$

    if (direction === 'atMost') {
      const c = meanRound;

      answer = round(binomialCdf(n, p, c), 4);

      label = `P(X <= ${c})`;

      math = `P(X\\le${c})`;
    } else if (direction === 'atLeast') {
      const c = Math.max(1, meanRound);

      answer = round(1 - binomialCdf(n, p, c - 1), 4);

      label = `P(X >= ${c})`;

      math = `P(X\\ge${c})`;
    } else {
      const lo = Math.max(0, meanRound - 1);

      const hi = Math.min(n, meanRound + 1);

      answer = round(binomialCdf(n, p, hi) - binomialCdf(n, p, lo - 1), 4);

      label = `P(${lo} <= X <= ${hi})`;

      math = `P(${lo}\\le X\\le${hi})`;
    }

    return {
      prompt:
        `In a batch of $n=${n}$ circuit boards, each fails inspection independently with probability $p=${p}$. ` +
        `Let $X$ be the number of boards that fail. Find $${math}$.`,

      params: { n, p, meanRound },

      parts: [{ kind: 'numeric', label, answer, tol: 0.0005 }],

      solution: [
        {
          text: `Failures are independent with the same chance $p$ across a fixed $n=${n}$ boards -- a binomial count.`,
        },

        {
          text: `A cumulative probability is a sum of point probabilities, not a single $\\binom{n}{x}p^xq^{n-x}$ term: $${math}\\approx${answer}$.`,
        },
      ],
    };
  },
});

const binomialInverseNTemplate = generatedQuestion({
  id: 'ch05-gen-binomial-inverse-n',

  chapter: 'discrete-distributions',

  topic: 'Binomial and multinomial',

  difficulty: 'hard',

  generate: (rng) => {
    const p = rng.pick([0.01, 0.02, 0.03, 0.04, 0.05]);

    const target = rng.pick([0.9, 0.95, 0.99]);

    const n = smallestNForAtLeastOne(p, target);

    return {
      prompt:
        `A supplier's fasteners are defective independently with probability $p=${p}$. Find the smallest sample ` +
        `size $n$ for which the probability of finding at least one defective fastener is at least $${target}$.`,

      params: { p, target, n },

      parts: [{ kind: 'numeric', answer: n, tol: 0.5 }],

      solution: [
        {
          text: `"At least one defective" is easiest as the complement of "none defective": $P(X\\ge1)=1-(1-p)^n$.`,
        },

        {
          text: `Solving $1-(1-${p})^n\\ge${target}$ for the smallest integer $n$ gives $n=${n}$.`,
        },
      ],
    };
  },
});

const binomialDiscriminationTemplate = generatedQuestion({
  id: 'ch05-gen-binomial-discrimination',

  chapter: 'discrete-distributions',

  topic: 'Binomial and multinomial',

  difficulty: 'medium',

  generate: (rng) => {
    const n = rng.int(5, 9);

    const pTenths = rng.int(2, 8);

    const p = round(pTenths / 10, 1);

    const meanRound = Math.round(n * p);

    const x = rng.int(Math.max(0, meanRound - 1), Math.min(n, meanRound + 1));

    const pmf = round(binomialPmf(n, p, x), 4);

    return {
      prompt:
        `A packet is corrupted in transit with probability $p=${p}$, the same chance on every one of $n=${n}$ ` +
        `packets sent, independently of each other. Which distribution models the number of corrupted packets, ` +
        `and what is $P(X=${x})$?`,

      params: { n, p, x },

      parts: [
        {
          kind: 'mcq',

          choices: ['Discrete uniform', 'Binomial', 'Hypergeometric', 'Poisson'],

          answer: 1,
        },

        { kind: 'numeric', label: `P(X = ${x})`, answer: pmf, tol: 0.0005 },
      ],

      solution: [
        {
          text: `The number of packets $n$ is fixed in advance, each is corrupted or not with the same chance $p$, and packets are independent -- exactly a Bernoulli process, so this is binomial.`,
        },

        {
          text: `$P(X=${x})=\\binom{${n}}{${x}}(${p})^{${x}}(${round(1 - p, 1)})^{${n - x}}\\approx${pmf}$.`,
        },
      ],
    };
  },
});

const hypergeometricCumulativeTemplate = generatedQuestion({
  id: 'ch05-gen-hypergeometric-cumulative',

  chapter: 'discrete-distributions',

  topic: 'Hypergeometric',

  difficulty: 'medium',

  generate: (rng) => {
    const total = rng.int(20, 30);

    const defective = rng.int(3, 8);

    const sample = rng.int(4, 8);

    const lower = Math.max(0, sample - (total - defective));

    const upper = Math.min(sample, defective);

    const meanRound = Math.min(upper, Math.max(lower, Math.round((sample * defective) / total)));

    const direction = rng.pick(['atMost', 'atLeast'] as const);

    let answer: number;

    let label: string;

    let math: string; // bare "P(...)" LaTeX, without the surrounding $...$

    if (direction === 'atMost') {
      answer = round(hypergeometricCdf(total, sample, defective, meanRound, lower), 4);

      label = `P(X <= ${meanRound})`;

      math = `P(X\\le${meanRound})`;
    } else {
      answer = round(1 - hypergeometricCdf(total, sample, defective, meanRound - 1, lower), 4);

      label = `P(X >= ${meanRound})`;

      math = `P(X\\ge${meanRound})`;
    }

    return {
      prompt:
        `A batch of ${total} circuit breakers contains ${defective} that are miswired. An inspector draws ` +
        `${sample} breakers at random **without replacement**. Let $X$ be the number of miswired breakers in ` +
        `the sample. Find $${math}$.`,

      params: { total, defective, sample, meanRound },

      parts: [{ kind: 'numeric', label, answer, tol: 0.0005 }],

      solution: [
        {
          text: `Sampling without replacement from a finite lot makes $X$ hypergeometric, so a cumulative probability sums $h(x;${total},${sample},${defective})$ rather than a single term.`,
        },

        {
          text: `$${math}\\approx${answer}$.`,
        },
      ],
    };
  },
});

const hypergeometricApproxValidityTemplate = generatedQuestion({
  id: 'ch05-gen-hypergeometric-approx-validity',

  chapter: 'discrete-distributions',

  topic: 'Hypergeometric',

  difficulty: 'hard',

  generate: (rng) => {
    const N = rng.int(30, 150);

    const k = rng.int(3, Math.floor(N / 4));

    const n = rng.int(3, Math.min(20, N - k - 1));

    const lower = Math.max(0, n - (N - k));

    const upper = Math.min(n, k);

    const meanRoundRaw = Math.round((n * k) / N);

    const x = rng.int(Math.max(lower, meanRoundRaw - 1), Math.min(upper, meanRoundRaw + 1));

    const ratio = n / N;

    const valid = ratio <= 0.05;

    const exact = round(hypergeometricPmf(N, n, k, x), 4);

    const approx = round(binomialPmf(n, k / N, x), 4);

    return {
      prompt:
        `A shipment of $N=${N}$ gaskets contains $k=${k}$ that are undersized. An assembler draws $n=${n}$ ` +
        `gaskets at random without replacement. Find the exact probability that $X=${x}$ are undersized, find ` +
        `the binomial approximation using $p=k/N$, and state whether that approximation is legitimate here.`,

      params: { N, k, n, x, ratio },

      parts: [
        { kind: 'numeric', label: 'exact (hypergeometric)', answer: exact, tol: 0.0005 },

        { kind: 'numeric', label: 'approximate (binomial)', answer: approx, tol: 0.0005 },

        { kind: 'tf', label: 'approximation legitimate (n/N <= 0.05)', answer: valid },
      ],

      solution: [
        {
          text: `The exact model is hypergeometric: $h(${x};${N},${n},${k})\\approx${exact}$, and the binomial stand-in is $b(${x};${n},k/N)\\approx${approx}$.`,
        },

        {
          text: `Here $n/N=${n}/${N}\\approx${round(ratio, 4)}$, which is ${valid ? 'at most' : 'above'} the $0.05$ rule of thumb, so the binomial approximation is ${valid ? '' : 'not '}legitimate for this sample -- an approximation's validity condition has to be checked, not assumed.`,
        },
      ],
    };
  },
});

const geometricInverseNTemplate = generatedQuestion({
  id: 'ch05-gen-geometric-inverse-n',

  chapter: 'discrete-distributions',

  topic: 'Geometric and negative binomial',

  difficulty: 'hard',

  generate: (rng) => {
    const p = rng.pick([0.02, 0.03, 0.05, 0.08, 0.1, 0.12, 0.15]);

    const target = rng.pick([0.9, 0.95, 0.99]);

    const n = smallestNForAtLeastOne(p, target);

    return {
      prompt:
        `A nondestructive scan detects a subsurface flaw on any given pass with probability $p=${p}$, ` +
        `independently of previous passes. Find the smallest number of passes $n$ for which the probability of ` +
        `detecting the flaw within those $n$ passes is at least $${target}$.`,

      params: { p, target, n },

      parts: [{ kind: 'numeric', answer: n, tol: 0.5 }],

      solution: [
        {
          text: `$X$ counts passes until the first detection, so it is geometric, and $P(X\\le n)=1-(1-p)^n$ -- the chance of at least one success in the first $n$ passes.`,
        },

        {
          text: `Solving $1-(1-${p})^n\\ge${target}$ for the smallest integer $n$ gives $n=${n}$.`,
        },
      ],
    };
  },
});

const discriminationGeometricNegativeBinomialTemplate = generatedQuestion({
  id: 'ch05-gen-discrimination-geometric-negative-binomial',

  chapter: 'discrete-distributions',

  topic: 'Geometric and negative binomial',

  difficulty: 'medium',

  generate: (rng) => {
    const r = rng.int(1, 4);

    const p = rng.pick([0.2, 0.25, 0.3, 0.35, 0.4]);

    const x = rng.int(r, r + 4);

    const pmf = round(r === 1 ? geometricPmf(p, x) : negativeBinomialPmf(x, r, p), 4);

    const correctChoice = r === 1 ? 1 : 2; // choices[1] = 'Geometric', choices[2] = 'Negative binomial'

    return {
      prompt:
        `A technician must find ${r === 1 ? 'a single' : `$r=${r}$`} cracked turbine blade${r === 1 ? '' : 's'}; ` +
        `each blade inspected is cracked independently with probability $p=${p}$. Which distribution models the ` +
        `number of blades inspected until the ${r === 1 ? 'first' : `$r$th`} cracked blade is found, and what is ` +
        `$P(X=${x})$?`,

      params: { r, p, x },

      parts: [
        {
          kind: 'mcq',

          choices: ['Binomial', 'Geometric', 'Negative binomial', 'Poisson'],

          answer: correctChoice,
        },

        { kind: 'numeric', label: `P(X = ${x})`, answer: pmf, tol: 0.0005 },
      ],

      solution: [
        {
          text:
            r === 1
              ? `The number of trials is not fixed here -- $X$ counts trials up to and including the first success, which is exactly the geometric distribution.`
              : `The number of trials is not fixed here -- $X$ counts trials up to and including the $r$th success, which is exactly the negative binomial distribution (the geometric is its special case $r=1$).`,
        },

        {
          text:
            r === 1
              ? `$P(X=${x})=g(${x};${p})=(${p})(${round(1 - p, 2)})^{${x - 1}}\\approx${pmf}$.`
              : `$P(X=${x})=b^*(${x};${r},${p})=\\binom{${x - 1}}{${r - 1}}(${p})^{${r}}(${round(1 - p, 2)})^{${x - r}}\\approx${pmf}$.`,
        },
      ],
    };
  },
});

const poissonEasyTemplate = generatedQuestion({
  id: 'ch05-gen-poisson-easy',

  chapter: 'discrete-distributions',

  topic: 'Poisson',

  difficulty: 'easy',

  generate: (rng) => {
    const lambda = rng.int(2, 8);

    const x = rng.int(Math.max(0, lambda - 1), lambda + 2);

    const pmf = round(poissonPmf(lambda, x), 4);

    return {
      prompt:
        `Scratches appear on a coated lens at an average rate of $\\lambda=${lambda}$ per lens, following a ` +
        `Poisson process. Let $X$ be the number of scratches on a randomly chosen lens. Find $P(X=${x})$.`,

      params: { lambda, x },

      parts: [{ kind: 'numeric', label: `P(X = ${x})`, answer: pmf, tol: 0.0005 }],

      solution: [
        {
          text: `The rate is already given per lens, the interval this question asks about, so $\\lambda t=${lambda}$ directly.`,
        },

        {
          text: `$P(X=${x})=p(${x};${lambda})=\\dfrac{e^{-${lambda}}(${lambda})^{${x}}}{${x}!}\\approx${pmf}$.`,
        },
      ],
    };
  },
});

// intervalMinutes always divides 60, so ratePerHour = lambdaT * (60 / intervalMinutes)
// is an exact integer -- the rate quoted in the prompt is never a rounded decimal.
const RESCALE_INTERVALS = [10, 12, 15, 20, 30];

const poissonRescaledIntervalTemplate = generatedQuestion({
  id: 'ch05-gen-poisson-rescaled-interval',

  chapter: 'discrete-distributions',

  topic: 'Poisson',

  difficulty: 'hard',

  generate: (rng) => {
    const lambdaT = rng.int(2, 6);

    const intervalMinutes = rng.pick(RESCALE_INTERVALS);

    const ratePerHour = lambdaT * (60 / intervalMinutes);

    const x = rng.int(Math.max(0, lambdaT - 1), lambdaT + 2);

    const pmf = round(poissonPmf(lambdaT, x), 4);

    return {
      prompt:
        `Calls arrive at a help desk at an average rate of $\\lambda=${ratePerHour}$ per hour, following a ` +
        `Poisson process. Find the probability that exactly ${x} calls arrive during a ${intervalMinutes}-minute ` +
        `window.`,

      params: { lambdaT, intervalMinutes, ratePerHour, x },

      parts: [{ kind: 'numeric', label: `P(X = ${x})`, answer: pmf, tol: 0.0005 }],

      solution: [
        {
          text: `$\\lambda=${ratePerHour}$ is a rate per **hour**, but the question asks about a ${intervalMinutes}-minute window -- a fraction $${intervalMinutes}/60$ of an hour -- so it has to be rescaled before it is a mean.`,
        },

        {
          text: `$\\lambda t=${ratePerHour}\\cdot\\dfrac{${intervalMinutes}}{60}=${lambdaT}$, and $P(X=${x})=p(${x};${lambdaT})=\\dfrac{e^{-${lambdaT}}(${lambdaT})^{${x}}}{${x}!}\\approx${pmf}$.`,
        },
      ],
    };
  },
});

const poissonCumulativeTemplate = generatedQuestion({
  id: 'ch05-gen-poisson-cumulative',

  chapter: 'discrete-distributions',

  topic: 'Poisson',

  difficulty: 'medium',

  generate: (rng) => {
    const lambda = rng.int(3, 10);

    const meanRound = Math.round(lambda);

    const direction = rng.pick(['atMost', 'atLeast'] as const);

    let answer: number;

    let label: string;

    let math: string; // bare "P(...)" LaTeX, without the surrounding $...$

    if (direction === 'atMost') {
      answer = round(poissonCdf(lambda, meanRound), 4);

      label = `P(X <= ${meanRound})`;

      math = `P(X\\le${meanRound})`;
    } else {
      answer = round(1 - poissonCdf(lambda, meanRound - 1), 4);

      label = `P(X >= ${meanRound})`;

      math = `P(X\\ge${meanRound})`;
    }

    return {
      prompt:
        `Breakdowns on an assembly line occur at an average rate of $\\lambda=${lambda}$ per week, following a ` +
        `Poisson process. Let $X$ be the number of breakdowns in a given week. Find $${math}$.`,

      params: { lambda, meanRound },

      parts: [{ kind: 'numeric', label, answer, tol: 0.0005 }],

      solution: [
        {
          text: `A cumulative Poisson probability sums the point probabilities $p(x;${lambda})$ rather than evaluating one of them.`,
        },

        {
          text: `$${math}\\approx${answer}$.`,
        },
      ],
    };
  },
});

const poissonDiscriminationTemplate = generatedQuestion({
  id: 'ch05-gen-poisson-discrimination',

  chapter: 'discrete-distributions',

  topic: 'Poisson',

  difficulty: 'medium',

  generate: (rng) => {
    const lambda = rng.int(2, 7);

    const lengthMeters = rng.int(2, 5);

    const lambdaT = lambda * lengthMeters;

    const x = rng.int(Math.max(0, Math.round(lambdaT) - 2), Math.round(lambdaT) + 3);

    const pmf = round(poissonPmf(lambdaT, x), 4);

    return {
      prompt:
        `Flaws occur along a length of welded seam at an average rate of $\\lambda=${lambda}$ per metre, ` +
        `independently from one stretch of seam to the next. Which distribution models the number of flaws in ` +
        `a ${lengthMeters} m stretch of seam, and what is $P(X=${x})$?`,

      params: { lambda, lengthMeters, lambdaT, x },

      parts: [
        {
          kind: 'mcq',

          choices: ['Binomial', 'Hypergeometric', 'Geometric', 'Poisson'],

          answer: 3,
        },

        { kind: 'numeric', label: `P(X = ${x})`, answer: pmf, tol: 0.0005 },
      ],

      solution: [
        {
          text: `There is no fixed number of trials here, no sample drawn from a finite lot, and no stopping point -- just a count of rare, independent flaws over a fixed length. That is a Poisson count.`,
        },

        {
          text: `The rate has to be scaled to the length actually asked about: $\\lambda t=${lambda}\\cdot${lengthMeters}=${lambdaT}$, so $P(X=${x})=p(${x};${lambdaT})\\approx${pmf}$.`,
        },
      ],
    };
  },
});

const poissonApproxValidityTemplate = generatedQuestion({
  id: 'ch05-gen-poisson-approx-validity',

  chapter: 'discrete-distributions',

  topic: 'Poisson',

  difficulty: 'medium',

  generate: (rng) => {
    const mu = rng.int(2, 10);

    const valid = rng.bool();

    // Same target mean mu = n*p either way; only how it is split between n and
    // p changes, which is exactly what makes the approximation's validity
    // condition (n large, p small) a fact about the split, not about mu itself.
    const n = valid ? rng.int(200, 600) : rng.int(20, 80);

    const p = mu / n; // kept unrounded so n*p reconstructs mu exactly

    const meanRound = mu;

    const x = rng.int(Math.max(0, meanRound - 1), meanRound + 1);

    const approx = round(poissonPmf(mu, x), 4);

    const exact = round(binomialPmf(n, p, x), 4);

    const legit = p <= 0.05;

    return {
      prompt:
        `Among $n=${n}$ items inspected, each is defective independently with probability $p\\approx${round(p, 4)}$. ` +
        `Using $\\mu=np=${mu}$, find the Poisson approximation to $P(X=${x})$, find the exact binomial ` +
        `probability, and state whether the Poisson approximation is legitimate here.`,

      params: { mu, n, p, x, legit: legit ? 1 : 0 },

      parts: [
        { kind: 'numeric', label: 'Poisson approximation', answer: approx, tol: 0.0005 },

        { kind: 'numeric', label: 'exact binomial', answer: exact, tol: 0.0005 },

        { kind: 'tf', label: 'approximation legitimate (p <= 0.05)', answer: legit },
      ],

      solution: [
        {
          text: `$P(X=${x})\\approx p(${x};${mu})=\\dfrac{e^{-${mu}}(${mu})^{${x}}}{${x}!}\\approx${approx}$, against the exact $b(${x};${n},${round(p, 4)})\\approx${exact}$.`,
        },

        {
          text: `The Poisson approximation to the binomial needs $n$ large **and** $p$ small, not merely $np$ held fixed. Here $p\\approx${round(p, 4)}$, which is ${legit ? 'at most' : 'well above'} the usual $0.05$ cutoff, so the approximation is ${legit ? '' : 'not '}trustworthy in this case even though $\\mu=np=${mu}$ is the same either way.`,
        },
      ],
    };
  },
});

export const ch05Generators: QuestionTemplate[] = [
  binomialPmfMeanVarianceTemplate,

  multinomialTripleTemplate,

  binomialCumulativeTemplate,

  binomialInverseNTemplate,

  binomialDiscriminationTemplate,

  hypergeometricPmfTemplate,

  hypergeometricMeanVarianceTemplate,

  recognizeDistributionTemplate,

  binomialApproxHypergeometricTemplate,

  hypergeometricCumulativeTemplate,

  hypergeometricApproxValidityTemplate,

  geometricPmfTemplate,

  negativeBinomialPmfTemplate,

  geometricInverseNTemplate,

  discriminationGeometricNegativeBinomialTemplate,

  poissonPmfTemplate,

  poissonBinomialApproxTemplate,

  poissonEasyTemplate,

  poissonRescaledIntervalTemplate,

  poissonCumulativeTemplate,

  poissonDiscriminationTemplate,

  poissonApproxValidityTemplate,

  uniformPmfMeanVarianceTemplate,

  uniformConsecutiveIntegersTemplate,

  uniformTailFromVarianceTemplate,

  uniformDiscriminationTemplate,
];
