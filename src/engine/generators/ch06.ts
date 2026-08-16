import type { QuestionTemplate } from '../types';

import { generatedQuestion } from '../authoring';

import { factorial, invNormalCdf, normalCdf, round } from '../mathx';

/** p(x; λ), the Poisson pmf — used below only to compute gamma/chi-squared
 * CDFs through their exact relationship to the Poisson tail (Walpole 9e
 * §6.6, Example 6.18), never to model a Poisson question directly (that is
 * Chapter 5's territory). */
const poissonPmf = (lambda: number, x: number): number => (Math.exp(-lambda) * lambda ** x) / factorial(x);

/**
 * P(Gamma(alpha, beta) <= x) for a positive integer `alpha`, via the
 * gamma-Poisson relationship: the time until the `alpha`th Poisson event has
 * already happened by time x exactly when a Poisson(x/beta) count has
 * reached at least `alpha`. Verified against Walpole 9e Example 6.18
 * (alpha=2, beta=1/5, x=1 gives 0.9596, matching the book's 0.96).
 */
const gammaCdfIntegerAlpha = (alpha: number, beta: number, x: number): number => {
  const lambda = x / beta;

  let tailBelow = 0;

  for (let k = 0; k < alpha; k++) tailBelow += poissonPmf(lambda, k);

  return 1 - tailBelow;
};

const uniformProbabilityMeanVarianceTemplate = generatedQuestion({
  id: 'ch06-gen-uniform-probability-mean-variance',

  chapter: 'continuous-distributions',

  topic: 'Continuous uniform',

  difficulty: 'easy',

  generate: (rng) => {
    const A = rng.int(0, 5);

    const width = rng.int(8, 14);

    const B = A + width;

    // c, d kept at least 2 apart and at least 1 inside each bound, so
    // P(c < X < d) = (d-c)/(B-A) never drops below 2/14 ~ 0.143 -- comfortably
    // material regardless of where A, B, c, d land.
    const c = rng.int(A + 1, B - 3);

    const d = rng.int(c + 2, B - 1);

    const probability = round((d - c) / (B - A), 4);

    const mean = round((A + B) / 2, 4);

    const variance = round((B - A) ** 2 / 12, 4);

    return {
      prompt:
        `A random variable $X$ has a continuous uniform distribution on the interval $[${A},${B}]$. Find ` +
        `$P(${c}<X<${d})$, the mean of $X$, and the variance of $X$.`,

      params: { A, B, c, d },

      parts: [
        { kind: 'numeric', label: `P(${c} < X < ${d})`, answer: probability, tol: 0.0005 },

        { kind: 'numeric', label: 'mean', answer: mean, tol: 0.0005 },

        { kind: 'numeric', label: 'variance', answer: variance, tol: 0.0005 },
      ],

      solution: [
        {
          text: `The density is flat, $f(x)=\\dfrac{1}{B-A}=\\dfrac{1}{${B - A}}$ on $[${A},${B}]$, so probability over a sub-interval is just its length divided by the total length.`,
        },

        {
          text: `$P(${c}<X<${d})=\\dfrac{${d}-${c}}{${B}-${A}}=\\dfrac{${d - c}}{${B - A}}\\approx${probability}$.`,
        },

        {
          text: `By Theorem 6.1, $\\mu=\\dfrac{A+B}{2}=${mean}$ and $\\sigma^2=\\dfrac{(B-A)^2}{12}=${variance}$.`,
        },
      ],
    };
  },
});

const uniformWaitingTimeTemplate = generatedQuestion({
  id: 'ch06-gen-uniform-waiting-time',

  chapter: 'continuous-distributions',

  topic: 'Continuous uniform',

  difficulty: 'medium',

  generate: (rng) => {
    const m = rng.int(10, 20); // minutes between buses

    // t1, t2 each kept at least 2 minutes from both ends of [0, m], so both
    // probabilities below are always at least 2/m >= 0.1 -- never a rounding
    // accident away from the answer being trivially 0.
    const t1 = rng.int(2, m - 2);

    const t2 = rng.int(2, m - 2);

    const probShort = round(t1 / m, 4);

    const probLong = round((m - t2) / m, 4);

    return {
      prompt:
        `A bus arrives at a certain stop every $${m}$ minutes, and a rider arrives at a random time. Let $X$, ` +
        `uniform on $[0,${m}]$, be the number of minutes the rider must wait for the next bus. Find ` +
        `$P(X\\le${t1})$ and $P(X\\ge${t2})$.`,

      params: { m, t1, t2 },

      parts: [
        { kind: 'numeric', label: `P(X <= ${t1})`, answer: probShort, tol: 0.0005 },

        { kind: 'numeric', label: `P(X >= ${t2})`, answer: probLong, tol: 0.0005 },
      ],

      solution: [
        {
          text: `The wait $X$ is uniform on $[0,${m}]$ because the rider's arrival time relative to the bus schedule is equally likely anywhere in that window.`,
        },

        {
          text: `$P(X\\le${t1})=\\dfrac{${t1}-0}{${m}}\\approx${probShort}$.`,
        },

        {
          text: `$P(X\\ge${t2})=\\dfrac{${m}-${t2}}{${m}}\\approx${probLong}$.`,
        },
      ],
    };
  },
});

const normalTwoSidedTemplate = generatedQuestion({
  id: 'ch06-gen-normal-two-sided-area',

  chapter: 'continuous-distributions',

  topic: 'Normal distribution',

  difficulty: 'easy',

  generate: (rng) => {
    const mu = rng.int(20, 80);

    const sigma = rng.int(4, 15);

    // Target z magnitudes of at least 0.4 keep the resulting interval well
    // short of the whole line -- P(z1 < Z < z2) never drops below roughly
    // Phi(0.4) - Phi(-0.4) ~ 0.31, comfortably material.
    const z1Target = -rng.int(4, 25) / 10;

    const z2Target = rng.int(4, 25) / 10;

    // x1, x2 are rounded to whole numbers, exactly as Walpole's own worked
    // examples state them, then z is recomputed from the rounded x -- the
    // same "read x off the problem, then compute z" order the book uses.
    const x1 = Math.round(mu + z1Target * sigma);

    const x2 = Math.round(mu + z2Target * sigma);

    const z1 = round((x1 - mu) / sigma, 2);

    const z2 = round((x2 - mu) / sigma, 2);

    const probability = round(normalCdf(z2) - normalCdf(z1), 4);

    return {
      prompt:
        `A random variable $X$ has a normal distribution with $\\mu=${mu}$ and $\\sigma=${sigma}$. Find ` +
        `$P(${x1}<X<${x2})$.`,

      params: { mu, sigma, x1, x2 },

      parts: [{ kind: 'numeric', answer: probability, tol: 0.0005 }],

      solution: [
        {
          text: `Standardize both endpoints: $z_1=\\dfrac{${x1}-${mu}}{${sigma}}=${z1}$ and $z_2=\\dfrac{${x2}-${mu}}{${sigma}}=${z2}$.`,
        },

        {
          text: `$P(${x1}<X<${x2})=P(${z1}<Z<${z2})=\\Phi(${z2})-\\Phi(${z1})\\approx${probability}$.`,
        },
      ],
    };
  },
});

const normalCurveInReverseTemplate = generatedQuestion({
  id: 'ch06-gen-normal-curve-in-reverse',

  chapter: 'continuous-distributions',

  topic: 'Normal distribution',

  difficulty: 'medium',

  generate: (rng) => {
    // p1 kept below 0.45 and p2 above 0.55, so both k values below stay at
    // least invNormalCdf(0.55) ~ 0.126 away from 0 -- never a value that
    // rounds to the degenerate "z = 0" guess.
    const p1 = round(rng.int(5, 45) / 100, 2);

    const p2 = round(rng.int(55, 95) / 100, 2);

    const k1 = round(invNormalCdf(1 - p1), 2);

    const k2 = round(invNormalCdf(p2), 2);

    return {
      prompt:
        `Given a standard normal distribution, find the value of $k$ such that (a) $P(Z>k)=${p1}$ and (b) ` +
        `$P(Z<k)=${p2}$.`,

      params: { p1, p2 },

      parts: [
        { kind: 'numeric', label: '(a) k', answer: k1, tol: 0.01 },

        { kind: 'numeric', label: '(b) k', answer: k2, tol: 0.01 },
      ],

      solution: [
        {
          text: `(a) $P(Z>k)=${p1}$ means $P(Z<k)=1-${p1}=${round(1 - p1, 2)}$, so $k$ is the value whose area to the left is $${round(1 - p1, 2)}$: $k\\approx${k1}$.`,
        },

        {
          text: `(b) $P(Z<k)=${p2}$ directly gives $k\\approx${k2}$, read from the standard normal curve in reverse.`,
        },
      ],
    };
  },
});

const normalApplicationForwardTemplate = generatedQuestion({
  id: 'ch06-gen-normal-application-forward',

  chapter: 'continuous-distributions',

  topic: 'Applications of the normal distribution',

  difficulty: 'medium',

  generate: (rng) => {
    const mu = round(rng.int(20, 60) / 10, 1); // years

    const sigma = round(rng.int(3, 12) / 10, 1); // years

    // |z| kept between 0.4 and 2.5, so P(X < x0) always lands strictly
    // between Phi(-2.5) ~ 0.0062 and Phi(2.5) ~ 0.9938 -- never within 2*tol
    // of 0.
    const sign = rng.bool() ? 1 : -1;

    const zTarget = (sign * rng.int(4, 25)) / 10;

    const x0 = round(mu + zTarget * sigma, 2);

    const z = round((x0 - mu) / sigma, 2);

    const probability = round(normalCdf(z), 4);

    return {
      prompt:
        `A certain type of storage battery lasts, on average, $\\mu=${mu}$ years with a standard deviation of ` +
        `$\\sigma=${sigma}$ year. Battery life is normally distributed. Find the probability that a given ` +
        `battery lasts less than $${x0}$ years.`,

      params: { mu, sigma, x0 },

      parts: [{ kind: 'numeric', answer: probability, tol: 0.0005 }],

      solution: [
        {
          text: `$z=\\dfrac{${x0}-${mu}}{${sigma}}=${z}$.`,
        },

        {
          text: `$P(X<${x0})=P(Z<${z})\\approx${probability}$.`,
        },
      ],
    };
  },
});

const normalApplicationInverseTemplate = generatedQuestion({
  id: 'ch06-gen-normal-application-inverse',

  chapter: 'continuous-distributions',

  topic: 'Applications of the normal distribution',

  difficulty: 'hard',

  generate: (rng) => {
    const mu = rng.int(50, 90); // an exam average

    const sigma = rng.int(4, 10);

    // Percentages excluded from the 45-55 band, so |p - 0.5| >= 0.06 and the
    // resulting z is always at least invNormalCdf(0.56) ~ 0.15 in magnitude
    // -- x0 is never within rounding distance of mu itself for this reason,
    // though mu >= 50 already keeps x0 far from 0 regardless.
    const pctPool = [...Array(40).keys()].map((i) => i + 5).concat([...Array(40).keys()].map((i) => i + 56));

    const pct = rng.pick(pctPool); // 5..44 or 56..95, i.e. the area to the LEFT

    const p = pct / 100;

    const topGrade = p > 0.5; // area mostly to the left -> "at most" cutoff reads as a high grade boundary

    const z = round(invNormalCdf(p), 2);

    const x0 = round(sigma * z + mu, 2);

    return {
      prompt:
        `Exam scores are normally distributed with $\\mu=${mu}$ and $\\sigma=${sigma}$. Find the score $x_0$ ` +
        `that has $${pct}\\%$ of the area under the curve to its left.`,

      params: { mu, sigma, pct },

      parts: [
        { kind: 'numeric', label: 'z', answer: z, tol: 0.01 },

        { kind: 'numeric', label: 'x0', answer: x0, tol: 0.05 },
      ],

      solution: [
        {
          text: `We need the $z$ value leaving area $${p}$ to the left: $z\\approx${z}$ ${topGrade ? '(above the mean, since more than half the area is to the left)' : '(below the mean, since less than half the area is to the left)'}.`,
        },

        {
          text: `Rearranging $z=\\dfrac{x-\\mu}{\\sigma}$ gives $x_0=\\sigma z+\\mu=${sigma}(${z})+${mu}\\approx${x0}$.`,
        },
      ],
    };
  },
});

const normalApproxBinomialSingleTemplate = generatedQuestion({
  id: 'ch06-gen-normal-approx-binomial-single',

  chapter: 'continuous-distributions',

  topic: 'Normal approximation to the binomial',

  difficulty: 'medium',

  generate: (rng) => {
    const n = rng.int(60, 200);

    const p = round(rng.int(3, 7) / 10, 1); // 0.3..0.7, keeps both np and n(1-p) comfortably >= 5

    const mu = n * p;

    const sigma = Math.sqrt(n * p * (1 - p));

    // z kept between 0.5 and 2.5 in magnitude, so the resulting probability
    // stays strictly between Phi(-2.5) ~ 0.0062 and Phi(2.5) ~ 0.9938.
    const sign = rng.bool() ? 1 : -1;

    const zTarget = (sign * rng.int(5, 25)) / 10;

    // Continuity correction: P(X < x0) uses the boundary x0 - 0.5, so x0 is
    // solved for from the target z accordingly, then clamped to a valid
    // count.
    const x0 = Math.min(n - 1, Math.max(1, Math.round(mu + 0.5 + zTarget * sigma)));

    const z = round((x0 - 0.5 - mu) / sigma, 2);

    const probability = round(normalCdf(z), 4);

    return {
      prompt:
        `The probability that a patient recovers from a certain condition is $p=${p}$. Of $n=${n}$ patients ` +
        `known to have the condition, let $X$ be the number who recover. Using the normal approximation with ` +
        `the continuity correction, find $P(X<${x0})$.`,

      params: { n, p, x0 },

      parts: [{ kind: 'numeric', answer: probability, tol: 0.0005 }],

      solution: [
        {
          text: `$n=${n}$ is large enough for the normal approximation: $\\mu=np=${round(mu, 4)}$ and $\\sigma=\\sqrt{npq}=${round(sigma, 4)}$.`,
        },

        {
          text: `The continuity correction replaces the discrete cutoff $${x0}$ with $${x0}-0.5=${x0 - 0.5}$: $z=\\dfrac{${x0 - 0.5}-${round(mu, 4)}}{${round(sigma, 4)}}\\approx${z}$.`,
        },

        {
          text: `$P(X<${x0})\\approx P(Z<${z})\\approx${probability}$.`,
        },
      ],
    };
  },
});

const normalApproxBinomialRangeTemplate = generatedQuestion({
  id: 'ch06-gen-normal-approx-binomial-range',

  chapter: 'continuous-distributions',

  topic: 'Normal approximation to the binomial',

  difficulty: 'hard',

  generate: (rng) => {
    const n = rng.int(80, 250);

    const p = round(rng.int(15, 35) / 100, 2); // keeps np, n(1-p) >= 5 given n >= 80

    const mu = n * p;

    const sigma = Math.sqrt(n * p * (1 - p));

    // zLo and zHi are both positive and kept at least 0.8 apart, so the
    // interval's probability mass -- even at the closest pairing
    // (zLo=1.2, zHi=2.0, giving Phi(2.0)-Phi(1.2) ~ 0.092) -- stays well
    // clear of 0.
    const zLo = 0.4 + rng.int(0, 8) / 10; // 0.4..1.2

    const zHi = zLo + 0.8 + rng.int(0, 12) / 10; // adds 0.8..2.0 more

    const x1 = Math.max(1, Math.round(mu + 0.5 + zLo * sigma));

    const x2 = Math.min(n - 1, Math.round(mu - 0.5 + zHi * sigma));

    const zLoActual = round((x1 - 0.5 - mu) / sigma, 2);

    const zHiActual = round((x2 + 0.5 - mu) / sigma, 2);

    const probability = round(normalCdf(zHiActual) - normalCdf(zLoActual), 4);

    return {
      prompt:
        `A multiple-choice quiz has $n=${n}$ questions, each answered by pure guesswork with probability of a ` +
        `correct guess $p=${p}$. Let $X$ be the number of correct guesses. Using the normal approximation with ` +
        `the continuity correction, find $P(${x1}\\le X\\le${x2})$.`,

      params: { n, p, x1, x2 },

      parts: [{ kind: 'numeric', answer: probability, tol: 0.0005 }],

      solution: [
        {
          text: `$\\mu=np=${round(mu, 4)}$ and $\\sigma=\\sqrt{npq}=${round(sigma, 4)}$.`,
        },

        {
          text: `The continuity correction widens the interval to $[${x1}-0.5,\\,${x2}+0.5]$, giving $z_1=${zLoActual}$ and $z_2=${zHiActual}$.`,
        },

        {
          text: `$P(${x1}\\le X\\le${x2})\\approx P(${zLoActual}<Z<${zHiActual})=\\Phi(${zHiActual})-\\Phi(${zLoActual})\\approx${probability}$.`,
        },
      ],
    };
  },
});

const gammaMeanVarianceTemplate = generatedQuestion({
  id: 'ch06-gen-gamma-mean-variance',

  chapter: 'continuous-distributions',

  topic: 'Gamma distribution',

  difficulty: 'easy',

  generate: (rng) => {
    const alpha = rng.int(2, 8);

    const beta = rng.int(2, 10);

    const mean = alpha * beta;

    const variance = alpha * beta * beta;

    return {
      prompt:
        `A random variable $X$ has a gamma distribution with $\\alpha=${alpha}$ and $\\beta=${beta}$. Find the ` +
        `mean and the variance of $X$.`,

      params: { alpha, beta },

      parts: [
        { kind: 'numeric', label: 'mean', answer: mean, tol: 0.0005 },

        { kind: 'numeric', label: 'variance', answer: variance, tol: 0.0005 },
      ],

      solution: [
        {
          text: `The mean and variance of the gamma distribution are $\\mu=\\alpha\\beta=${alpha}\\cdot${beta}=${mean}$ and $\\sigma^2=\\alpha\\beta^2=${alpha}\\cdot${beta}^2=${variance}$.`,
        },
      ],
    };
  },
});

const gammaPoissonCdfTemplate = generatedQuestion({
  id: 'ch06-gen-gamma-poisson-cdf',

  chapter: 'continuous-distributions',

  topic: 'Gamma distribution',

  difficulty: 'hard',

  generate: (rng) => {
    const alpha = rng.int(2, 5); // the number of Poisson events being waited for

    const beta = rng.int(2, 6);

    // The Poisson rate x/beta is windowed to within 0.8 standard deviations
    // of alpha (its value when x = alpha*beta exactly), which by the normal
    // approximation to the Poisson keeps P(Poisson >= alpha) roughly between
    // Phi(-0.8) ~ 0.21 and Phi(0.8) ~ 0.79 -- comfortably away from 0 or 1.
    const sd = Math.sqrt(alpha);

    const offsetSteps = rng.int(-8, 8); // -0.8..0.8 standard deviations

    const lambdaTarget = Math.max(0.5, alpha + (offsetSteps / 10) * sd);

    const x = round(lambdaTarget * beta, 2);

    const lambda = x / beta;

    const probability = round(gammaCdfIntegerAlpha(alpha, beta, x), 4);

    return {
      prompt:
        `Calls arrive at a switchboard following a Poisson process at a rate matching $\\beta=${beta}$ minutes ` +
        `between calls on average. Let $X$ be the time, in minutes, until the $\\alpha=${alpha}$th call arrives ` +
        `-- a gamma random variable with $\\alpha=${alpha}$ and $\\beta=${beta}$. Find $P(X\\le${x})$.`,

      params: { alpha, beta, x },

      parts: [{ kind: 'numeric', answer: probability, tol: 0.0005 }],

      solution: [
        {
          text: `Time until the $\\alpha$th Poisson event has already elapsed by time $x$ exactly when a Poisson count over $[0,x]$ has reached at least $\\alpha$: $P(X\\le x)=P(\\text{Poisson}(x/\\beta)\\ge\\alpha)$.`,
        },

        {
          text: `Here $x/\\beta=${x}/${beta}=${round(lambda, 4)}$, so $P(X\\le${x})=1-\\sum_{k=0}^{${alpha - 1}}p(k;${round(lambda, 4)})\\approx${probability}$.`,
        },
      ],
    };
  },
});

const exponentialProbabilityTemplate = generatedQuestion({
  id: 'ch06-gen-exponential-probability',

  chapter: 'continuous-distributions',

  topic: 'Exponential distribution',

  difficulty: 'easy',

  generate: (rng) => {
    const beta = rng.int(3, 10); // mean life

    // ratio = t/beta kept between 0.3 and 2.0, so e^{-ratio} (and its
    // complement) always lie between e^{-2}~0.135 and e^{-0.3}~0.741 --
    // never within rounding distance of 0 or 1.
    const ratio = rng.int(3, 20) / 10;

    const t = round(beta * ratio, 2);

    const probMore = round(Math.exp(-t / beta), 4);

    const probLess = round(1 - Math.exp(-t / beta), 4);

    return {
      prompt:
        `The time to failure $T$, in years, of a component has an exponential distribution with mean ` +
        `$\\beta=${beta}$. Find $P(T>${t})$ and $P(T<${t})$.`,

      params: { beta, t },

      parts: [
        { kind: 'numeric', label: `P(T > ${t})`, answer: probMore, tol: 0.0005 },

        { kind: 'numeric', label: `P(T < ${t})`, answer: probLess, tol: 0.0005 },
      ],

      solution: [
        {
          text: `The exponential cdf is $F(t)=1-e^{-t/\\beta}$, so $P(T>${t})=e^{-${t}/${beta}}\\approx${probMore}$.`,
        },

        {
          text: `$P(T<${t})=1-P(T>${t})\\approx${probLess}$.`,
        },
      ],
    };
  },
});

const exponentialMemorylessTemplate = generatedQuestion({
  id: 'ch06-gen-exponential-memoryless',

  chapter: 'continuous-distributions',

  topic: 'Exponential distribution',

  difficulty: 'medium',

  generate: (rng) => {
    const beta = rng.int(4, 12);

    // target = t/beta kept between 0.2 and 1.5, so the shared answer
    // e^{-target} always lies between e^{-1.5}~0.223 and e^{-0.2}~0.819.
    const target = rng.int(2, 15) / 10;

    const t = round(beta * target, 2);

    // t0 is an exact multiple of beta, chosen only so the "already survived"
    // point is concrete in the prompt -- the memoryless property holds for
    // any t0, which is exactly the point being demonstrated.
    const t0 = beta * rng.int(1, 5);

    const answer = round(Math.exp(-t / beta), 4);

    return {
      prompt:
        `A component's lifetime $T$, in years, is exponential with mean $\\beta=${beta}$. Given that the ` +
        `component has already survived $${t0}$ years, find the probability it survives at least $${t}$ more ` +
        `years, i.e. $P(T>${t0}+${t}\\mid T>${t0})$.`,

      params: { beta, t0, t },

      parts: [{ kind: 'numeric', answer, tol: 0.0005 }],

      solution: [
        {
          text: `The exponential distribution is memoryless: $P(T>t_0+t\\mid T>t_0)=P(T>t)$, regardless of how large $t_0$ is.`,
        },

        {
          text: `So the answer is just $P(T>${t})=e^{-${t}/${beta}}\\approx${answer}$ -- the ${t0} already-survived years carry no information about what happens next.`,
        },
      ],
    };
  },
});

const chiSquaredMeanVarianceTemplate = generatedQuestion({
  id: 'ch06-gen-chi-squared-mean-variance',

  chapter: 'continuous-distributions',

  topic: 'Chi-squared distribution',

  difficulty: 'easy',

  generate: (rng) => {
    const v = rng.int(3, 20);

    const mean = v;

    const variance = 2 * v;

    return {
      prompt: `A random variable $X$ has a chi-squared distribution with $v=${v}$ degrees of freedom. Find the mean and the variance of $X$.`,

      params: { v },

      parts: [
        { kind: 'numeric', label: 'mean', answer: mean, tol: 0.0005 },

        { kind: 'numeric', label: 'variance', answer: variance, tol: 0.0005 },
      ],

      solution: [
        {
          text: `By Theorem 6.5, the chi-squared distribution has $\\mu=v=${v}$ and $\\sigma^2=2v=${variance}$.`,
        },
      ],
    };
  },
});

const chiSquaredGammaLinkTemplate = generatedQuestion({
  id: 'ch06-gen-chi-squared-gamma-link',

  chapter: 'continuous-distributions',

  topic: 'Chi-squared distribution',

  difficulty: 'hard',

  generate: (rng) => {
    // v is drawn even so that alpha = v/2 is a positive integer, letting the
    // same gamma-Poisson relationship used above compute the cdf exactly.
    const v = rng.pick([4, 6, 8, 10, 12, 14, 16]);

    const alpha = v / 2;

    const beta = 2;

    // Same windowing rationale as the gamma cdf template above: x/beta
    // stays within 0.8 standard deviations of alpha, keeping
    // P(chi-squared <= x) away from both 0 and 1.
    const sd = Math.sqrt(alpha);

    const offsetSteps = rng.int(-8, 8);

    const lambdaTarget = Math.max(0.5, alpha + (offsetSteps / 10) * sd);

    const x = round(lambdaTarget * beta, 2);

    const probability = round(gammaCdfIntegerAlpha(alpha, beta, x), 4);

    return {
      prompt:
        `A chi-squared random variable with $v=${v}$ degrees of freedom is the special case of the gamma ` +
        `distribution with $\\alpha=v/2=${alpha}$ and $\\beta=2$. Using that relationship, find $P(X\\le${x})$.`,

      params: { v, alpha, beta, x },

      parts: [{ kind: 'numeric', answer: probability, tol: 0.0005 }],

      solution: [
        {
          text: `With $v$ even, $\\alpha=v/2=${alpha}$ is a positive integer, so $P(X\\le x)$ can be computed exactly through the gamma-Poisson relationship rather than the incomplete gamma table.`,
        },

        {
          text: `$P(X\\le${x})=P(\\text{Poisson}(${x}/2)\\ge${alpha})\\approx${probability}$.`,
        },
      ],
    };
  },
});

const weibullCdfTemplate = generatedQuestion({
  id: 'ch06-gen-weibull-cdf',

  chapter: 'continuous-distributions',

  topic: 'Weibull distribution',

  difficulty: 'medium',

  generate: (rng) => {
    const betaShape = rng.pick([1, 2, 3]);

    const tBase = rng.int(2, 10);

    // target = alpha * tBase^betaShape is chosen directly, then alpha is
    // solved backward -- so the exponent hits target exactly (no rounding
    // drift), and target in [0.3, 2.0] keeps F(t) between
    // 1-e^{-0.3}~0.259 and 1-e^{-2}~0.865.
    const target = rng.int(3, 20) / 10;

    const alpha = target / tBase ** betaShape;

    const probability = round(1 - Math.exp(-target), 4);

    return {
      prompt:
        `The length of life $X$, in hours, of an item has a Weibull distribution with $\\alpha\\approx${round(alpha, 6)}$ ` +
        `and $\\beta=${betaShape}$. What is the probability that it fails before $${tBase}$ hours of usage?`,

      params: { alpha, betaShape, tBase },

      parts: [{ kind: 'numeric', answer: probability, tol: 0.0005 }],

      solution: [
        {
          text: `The Weibull cdf is $F(t)=1-e^{-\\alpha t^{\\beta}}$, so $P(X<${tBase})=1-e^{-${round(alpha, 6)}(${tBase})^{${betaShape}}}=1-e^{-${target}}\\approx${probability}$.`,
        },
      ],
    };
  },
});

const weibullFailureRateTemplate = generatedQuestion({
  id: 'ch06-gen-weibull-failure-rate',

  chapter: 'continuous-distributions',

  topic: 'Weibull distribution',

  difficulty: 'medium',

  generate: (rng) => {
    const betaShape = rng.pick([0.5, 0.75, 1, 1.5, 2, 3]);

    const t0 = rng.int(2, 10);

    // Same backward-solve trick as the cdf template: target in [0.1, 3] is
    // chosen first, then alpha is solved so Z(t0) hits target exactly,
    // keeping the failure rate answer always at least 0.1 -- far clear of 0.
    const target = rng.int(1, 30) / 10;

    const alpha = target / (betaShape * t0 ** (betaShape - 1));

    const classification =
      betaShape > 1 ? 'increasing -- the component wears over time'
      : betaShape < 1 ? 'decreasing -- the component strengthens over time'
      : 'constant -- the memoryless, exponential case';

    const choices = [
      'increasing -- the component wears over time',
      'decreasing -- the component strengthens over time',
      'constant -- the memoryless, exponential case',
    ];

    return {
      prompt:
        `A component's lifetime follows a Weibull distribution with $\\alpha\\approx${round(alpha, 6)}$ and ` +
        `$\\beta=${betaShape}$. Find the failure rate $Z(${t0})$, and state whether the failure rate is ` +
        `increasing, decreasing, or constant over time.`,

      params: { alpha, betaShape, t0 },

      parts: [
        { kind: 'numeric', label: `Z(${t0})`, answer: round(target, 4), tol: 0.0005 },

        { kind: 'mcq', label: 'behaviour over time', choices, answer: choices.indexOf(classification) },
      ],

      solution: [
        {
          text: `The Weibull failure rate is $Z(t)=\\alpha\\beta t^{\\beta-1}$, so $Z(${t0})=${round(alpha, 6)}\\cdot${betaShape}\\cdot(${t0})^{${betaShape}-1}\\approx${round(target, 4)}$.`,
        },

        {
          text: `Since $\\beta${betaShape > 1 ? '>1' : betaShape < 1 ? '<1' : '=1'}$, the failure rate is **${classification}**.`,
        },
      ],
    };
  },
});

export const ch06Generators: QuestionTemplate[] = [
  uniformProbabilityMeanVarianceTemplate,

  uniformWaitingTimeTemplate,

  normalTwoSidedTemplate,

  normalCurveInReverseTemplate,

  normalApplicationForwardTemplate,

  normalApplicationInverseTemplate,

  normalApproxBinomialSingleTemplate,

  normalApproxBinomialRangeTemplate,

  gammaMeanVarianceTemplate,

  gammaPoissonCdfTemplate,

  exponentialProbabilityTemplate,

  exponentialMemorylessTemplate,

  chiSquaredMeanVarianceTemplate,

  chiSquaredGammaLinkTemplate,

  weibullCdfTemplate,

  weibullFailureRateTemplate,
];
