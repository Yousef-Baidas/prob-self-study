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

export const ch05Generators: QuestionTemplate[] = [
  binomialPmfMeanVarianceTemplate,

  multinomialTripleTemplate,

  hypergeometricPmfTemplate,

  hypergeometricMeanVarianceTemplate,

  recognizeDistributionTemplate,

  binomialApproxHypergeometricTemplate,

  geometricPmfTemplate,

  negativeBinomialPmfTemplate,

  poissonPmfTemplate,

  poissonBinomialApproxTemplate,
];
