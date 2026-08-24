import type { QuestionTemplate } from '../types';

import { generatedQuestion } from '../authoring';

import { factorial, invNormalCdf, normalCdf, round } from '../mathx';

import type { SeededRng } from '../rng';

/**
 * Build a multiple-choice part whose options are all distinct.
 *
 * The distractors in this chapter are misreadings of the normal table, so they
 * are computed from the same z values as the answer — which means that on
 * particular draws two of them collapse onto one number. A symmetric interval
 * (z1 = -z2) makes "area left of z2" and "area right of z1" identical; an
 * interval whose area is exactly 0.50 makes the complement identical to the
 * answer. Rendered, that is a question showing the same value twice and marking
 * a learner wrong for picking its twin.
 *
 * Callers pass candidates in preference order and get the first three that are
 * distinct from each other and from the answer, so a collision costs a weaker
 * distractor rather than a broken question. Pass more candidates than you need:
 * the last ones are only reached when an earlier pair collides. Rounding to
 * `dp` happens here because two values that differ in the ninth decimal are the
 * same option once they are on screen.
 */
function distinctChoices(
  answer: number,
  candidates: readonly number[],
  rng: SeededRng,
  dp = 4,
): { choices: string[]; answer: number } {
  const answerText = answer.toFixed(dp);

  const distractors: string[] = [];

  for (const candidate of candidates) {
    if (distractors.length === 3) break;

    const text = candidate.toFixed(dp);

    if (text === answerText || distractors.includes(text)) continue;

    distractors.push(text);
  }

  const index = rng.int(0, distractors.length);

  const choices = [...distractors];

  choices.splice(index, 0, answerText);

  return { choices, answer: index };
}

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

const exponentialProbabilityTemplate = generatedQuestion({
  id: 'ch06-gen-exponential-probability',

  chapter: 'continuous-distributions',

  topic: 'Exponential distribution',

  difficulty: 'easy',

  generate: (rng) => {
    // lambda is a rate ("per hour", "per year", ...), the deck's
    // parameterization -- not Walpole's mean beta.
    const lambda = round(rng.int(5, 30) / 100, 2);

    // ratio = lambda*t kept between 0.3 and 2.0, so e^{-ratio} (and its
    // complement) always lie between e^{-2}~0.135 and e^{-0.3}~0.741 --
    // never within rounding distance of 0 or 1.
    const ratio = rng.int(3, 20) / 10;

    const t = round(ratio / lambda, 2);

    const exponent = round(lambda * t, 4);

    const probMore = round(Math.exp(-exponent), 4);

    const probLess = round(1 - Math.exp(-exponent), 4);

    return {
      prompt:
        `The time to failure $T$, in years, of a component has an exponential distribution with rate ` +
        `$\\lambda=${lambda}$ failures per year. Find $P(T>${t})$ and $P(T<${t})$.`,

      params: { lambda, t },

      parts: [
        { kind: 'numeric', label: `P(T > ${t})`, answer: probMore, tol: 0.0005 },

        { kind: 'numeric', label: `P(T < ${t})`, answer: probLess, tol: 0.0005 },
      ],

      solution: [
        {
          text: `The exponential cdf is $F(t)=1-e^{-\\lambda t}$, so $P(T>${t})=e^{-\\lambda t}=e^{-${lambda}\\times${t}}=e^{-${exponent}}\\approx${probMore}$.`,
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
    const lambda = round(rng.int(5, 25) / 100, 2); // rate per hour

    // target = lambda*t kept between 0.2 and 1.5, so the shared answer
    // e^{-target} always lies between e^{-1.5}~0.223 and e^{-0.2}~0.819.
    const target = rng.int(2, 15) / 10;

    const t = round(target / lambda, 2);

    // t0 is an exact multiple of 1/lambda, chosen only so the "already
    // survived" point is concrete in the prompt -- the memoryless property
    // holds for any t0, which is exactly the point being demonstrated.
    const t0 = round(rng.int(1, 5) / lambda, 2);

    const exponent = round(lambda * t, 4);

    const answer = round(Math.exp(-exponent), 4);

    return {
      prompt:
        `A component's lifetime $T$, in hours, is exponential with rate $\\lambda=${lambda}$ failures per hour. ` +
        `Given that the component has already survived $${t0}$ hours, find the probability it survives at ` +
        `least $${t}$ more hours, i.e. $P(T>${t0}+${t}\\mid T>${t0})$.`,

      params: { lambda, t0, t },

      parts: [{ kind: 'numeric', answer, tol: 0.0005 }],

      solution: [
        {
          text: `The exponential distribution is memoryless: $P(T>t_0+t\\mid T>t_0)=P(T>t)$, regardless of how large $t_0$ is -- a quiet spell never makes the next failure "due".`,
        },

        {
          text: `So the answer is just $P(T>${t})=e^{-\\lambda t}=e^{-${lambda}\\times${t}}\\approx${answer}$ -- the ${t0} already-survived hours carry no information about what happens next.`,
        },
      ],
    };
  },
});

const exponentialSeriesSystemTemplate = generatedQuestion({
  id: 'ch06-gen-exponential-series-system',

  chapter: 'continuous-distributions',

  topic: 'Exponential distribution',

  difficulty: 'hard',

  generate: (rng) => {
    // Three independent components in series, each with its own rate --
    // scaled like the bank's own series-system item (rates ~0.0005-0.0020
    // per hour).
    const rate1 = round(rng.int(5, 20) / 10000, 4);

    const rate2 = round(rng.int(5, 20) / 10000, 4);

    const rate3 = round(rng.int(5, 20) / 10000, 4);

    const lambdaTotal = round(rate1 + rate2 + rate3, 4);

    const meanLife = round(1 / lambdaTotal, 1);

    // ratio = t/meanLife kept between 0.3 and 2.0, exactly as the other
    // exponential templates keep their survival probability material.
    const ratio = rng.int(3, 20) / 10;

    const t = round(meanLife * ratio, 1);

    const exponent = round(lambdaTotal * t, 4);

    const probability = round(Math.exp(-exponent), 4);

    return {
      prompt:
        `Three components are connected in series, so the system fails as soon as the first component fails. ` +
        `Their lives are independent and exponential with rates $\\lambda_1=${rate1}$, $\\lambda_2=${rate2}$, and ` +
        `$\\lambda_3=${rate3}$ per hour. Find the system's failure rate, the mean time to system failure, and ` +
        `$P(T>${t})$.`,

      params: { rate1, rate2, rate3, t },

      parts: [
        { kind: 'numeric', label: 'system failure rate', answer: lambdaTotal, tol: 0.00005 },

        { kind: 'numeric', label: 'mean time to failure', answer: meanLife, tol: 0.05 },

        { kind: 'numeric', label: `P(T > ${t})`, answer: probability, tol: 0.0005 },
      ],

      solution: [
        {
          text: `A series system survives only while every component survives, so the independent exponential rates simply add: $\\lambda=\\lambda_1+\\lambda_2+\\lambda_3=${rate1}+${rate2}+${rate3}=${lambdaTotal}$ per hour.`,
        },

        {
          text: `The mean time to system failure is $\\mu=1/\\lambda\\approx${meanLife}$ hours -- note this is below any single component's own mean life, since adding more series components can only shorten the system's life.`,
        },

        {
          text: `$P(T>${t})=e^{-\\lambda t}=e^{-${lambdaTotal}\\times${t}}\\approx${probability}$.`,
        },
      ],
    };
  },
});

const exponentialParallelRedundancyTemplate = generatedQuestion({
  id: 'ch06-gen-exponential-parallel-redundancy',

  chapter: 'continuous-distributions',

  topic: 'Exponential distribution',

  difficulty: 'hard',

  generate: (rng) => {
    const lambda = round(rng.int(5, 20) / 10000, 4); // rate per hour

    const meanLife = round(1 / lambda, 1);

    // ratio = t/meanLife kept between 0.3 and 2.0, so a single unit's
    // survival probability stays comfortably between e^{-2} and e^{-0.3}.
    const ratio = rng.int(3, 20) / 10;

    const t = round(meanLife * ratio, 1);

    const exponent = round(lambda * t, 4);

    const survivesOne = round(Math.exp(-exponent), 4);

    const stationSurvives = round(1 - (1 - survivesOne) ** 2, 4);

    return {
      prompt:
        `Two identical pumps are installed in parallel; the station fails only when both pumps have failed. ` +
        `Each pump has an independent exponential life with rate $\\lambda=${lambda}$ per hour. Find the ` +
        `probability that one pump survives $${t}$ hours, and the probability that the station is still ` +
        `operating after $${t}$ hours.`,

      params: { lambda, t },

      parts: [
        { kind: 'numeric', label: 'P(one pump survives)', answer: survivesOne, tol: 0.0005 },

        { kind: 'numeric', label: 'P(station survives)', answer: stationSurvives, tol: 0.0005 },
      ],

      solution: [
        {
          text: `A single pump survives $t$ hours with probability $P(T>${t})=e^{-\\lambda t}=e^{-${lambda}\\times${t}}\\approx${survivesOne}$.`,
        },

        {
          text: `The station fails only when *both* pumps have failed, and the pumps fail independently, so $P(\\text{station survives})=1-(1-${survivesOne})^2\\approx${stationSurvives}$ -- redundancy makes the parallel system more reliable than either pump alone.`,
        },
      ],
    };
  },
});

const exponentialMedianVsMeanTemplate = generatedQuestion({
  id: 'ch06-gen-exponential-median-vs-mean',

  chapter: 'continuous-distributions',

  topic: 'Exponential distribution',

  difficulty: 'medium',

  generate: (rng) => {
    const lambda = round(rng.int(5, 40) / 100, 2); // rate per hour

    const mean = round(1 / lambda, 4);

    const median = round(Math.LN2 / lambda, 4);

    return {
      prompt:
        `A component's lifetime $T$, in hours, is exponential with rate $\\lambda=${lambda}$ per hour. Find ` +
        `$E(T)$ and the median of $T$, and state whether the median is less than, equal to, or greater than ` +
        `the mean.`,

      params: { lambda },

      parts: [
        { kind: 'numeric', label: 'mean', answer: mean, tol: 0.0005 },

        { kind: 'numeric', label: 'median', answer: median, tol: 0.0005 },

        { kind: 'tf', label: 'median < mean', answer: true },
      ],

      solution: [
        {
          text: `The mean is $E(T)=1/\\lambda=${mean}$ hours.`,
        },

        {
          text: `The median $m$ solves $F(m)=1-e^{-\\lambda m}=0.5$, so $m=\\dfrac{\\ln 2}{\\lambda}\\approx${median}$ hours.`,
        },

        {
          text: `Since $\\ln 2\\approx0.693<1$, the median is always **less than** the mean: the exponential is right-skewed, so its long upper tail pulls the mean above the point that splits the probability in half.`,
        },
      ],
    };
  },
});

const exponentialPoissonEquivalenceTemplate = generatedQuestion({
  id: 'ch06-gen-exponential-poisson-equivalence',

  chapter: 'continuous-distributions',

  topic: 'Exponential distribution',

  difficulty: 'medium',

  generate: (rng) => {
    const lambda = rng.int(2, 8); // events per hour

    const tMinutes = rng.int(10, 50);

    const tHours = round(tMinutes / 60, 4);

    const exponent = round(lambda * tHours, 4);

    const probability = round(Math.exp(-exponent), 4);

    return {
      prompt:
        `Defects appear along a production line as a Poisson process at a mean rate of $\\lambda=${lambda}$ ` +
        `defects per hour. Let $T$ be the waiting time until the next defect. Find $P(T>${tMinutes}\\text{ min})$ ` +
        `two different ways: (a) directly, as an exponential survival probability, and (b) as the Poisson ` +
        `probability of zero defects during that time.`,

      params: { lambda, tMinutes },

      parts: [
        { kind: 'numeric', label: '(a) exponential survival', answer: probability, tol: 0.0005 },

        { kind: 'numeric', label: '(b) Poisson P(zero defects)', answer: probability, tol: 0.0005 },
      ],

      solution: [
        {
          text: `(a) $${tMinutes}$ minutes is $${tHours}$ hours, so $P(T>${tHours})=e^{-\\lambda t}=e^{-${lambda}\\times${tHours}}\\approx${probability}$.`,
        },

        {
          text: `(b) "No defect yet at time $t$" is exactly the Poisson event of zero occurrences by $t$: $p(0;\\lambda t)=e^{-\\lambda t}\\dfrac{(\\lambda t)^0}{0!}=e^{-\\lambda t}\\approx${probability}$ -- the same number, because "wait longer than $t$" and "zero events by $t$" are the same event.`,
        },
      ],
    };
  },
});

const normalSolveMeanFromTailTemplate = generatedQuestion({
  id: 'ch06-gen-normal-solve-mean-from-tail',

  chapter: 'continuous-distributions',

  topic: 'Applications of the normal distribution',

  difficulty: 'hard',

  generate: (rng) => {
    const sigma = rng.int(2, 10);

    const lowerLimit = rng.int(40, 100);

    // pct kept between 1 and 10 (a small "at most this fraction may fall
    // below the limit" tail), matching the deck's filling-process example.
    const pct = rng.int(1, 10);

    const p = pct / 100;

    const z = round(invNormalCdf(p), 2);

    const mu = round(lowerLimit - z * sigma, 2);

    return {
      prompt:
        `A filling process is normally distributed with a standard deviation of $\\sigma=${sigma}$. The lower ` +
        `specification limit is $${lowerLimit}$, and at most $${pct}\\%$ of containers may fall below it. Find ` +
        `the minimum acceptable mean fill $\\mu$.`,

      params: { sigma, lowerLimit, pct },

      parts: [
        { kind: 'numeric', label: 'z', answer: z, tol: 0.01 },

        { kind: 'numeric', label: 'mu', answer: mu, tol: 0.05 },
      ],

      solution: [
        {
          text: `We need the $z$ value leaving area $${p}$ to the left: from the standard normal curve, $z\\approx${z}$.`,
        },

        {
          text: `Since $z=\\dfrac{${lowerLimit}-\\mu}{${sigma}}$, rearranging gives $\\mu=${lowerLimit}-${z}(${sigma})\\approx${mu}$ -- the smallest mean that still keeps the tail below the limit at or under $${pct}\\%$.`,
        },
      ],
    };
  },
});

const normalSolveSigmaFromTailTemplate = generatedQuestion({
  id: 'ch06-gen-normal-solve-sigma-from-tail',

  chapter: 'continuous-distributions',

  topic: 'Applications of the normal distribution',

  difficulty: 'hard',

  generate: (rng) => {
    const mu = rng.int(30, 80);

    const upperLimit = rng.int(mu + 3, mu + 20);

    // pct kept between 5 and 25 (the fraction exceeding the upper limit),
    // matching the deck's cure-time example (10% of batches exceed 60 min).
    const pct = rng.int(5, 25);

    const p = pct / 100;

    const z = round(invNormalCdf(1 - p), 2);

    const sigma = round((upperLimit - mu) / z, 2);

    return {
      prompt:
        `A process quantity is normally distributed with a mean of $\\mu=${mu}$, and $${pct}\\%$ of readings ` +
        `exceed $${upperLimit}$. Find the standard deviation $\\sigma$.`,

      params: { mu, upperLimit, pct },

      parts: [
        { kind: 'numeric', label: 'z', answer: z, tol: 0.01 },

        { kind: 'numeric', label: 'sigma', answer: sigma, tol: 0.05 },
      ],

      solution: [
        {
          text: `$P(Z>z)=${p}$ means $P(Z<z)=${round(1 - p, 4)}$, so from the standard normal curve $z\\approx${z}$.`,
        },

        {
          text: `Since $z=\\dfrac{${upperLimit}-${mu}}{\\sigma}$, rearranging gives $\\sigma=\\dfrac{${upperLimit}-${mu}}{${z}}\\approx${sigma}$.`,
        },
      ],
    };
  },
});

const uniformConditionalTemplate = generatedQuestion({
  id: 'ch06-gen-uniform-conditional',

  chapter: 'continuous-distributions',

  topic: 'Continuous uniform',

  difficulty: 'medium',

  generate: (rng) => {
    const M = rng.int(20, 40);

    // b kept at least 12 below M so the remaining range M-b is comfortably
    // wide, and a kept at least 2 above b and 2 below M, so both P(X>a) and
    // P(X>b) stay well clear of 0.
    const b = rng.int(2, M - 12);

    const a = rng.int(b + 2, M - 2);

    const probability = round((M - a) / (M - b), 4);

    return {
      prompt:
        `A machine's cycle-start time $X$ is uniform on $[0,${M}]$. Given that the cycle has not started by ` +
        `time $${b}$, find the probability it still has not started by time $${a}$, i.e. $P(X>${a}\\mid X>${b})$.`,

      params: { M, a, b },

      parts: [
        { kind: 'numeric', answer: probability, tol: 0.0005 },

        { kind: 'tf', label: 'the uniform distribution has the memoryless property', answer: false },
      ],

      solution: [
        {
          text: `Both events are subsets of $[0,${M}]$, so $P(X>${a}\\mid X>${b})=\\dfrac{P(X>${a})}{P(X>${b})}=\\dfrac{${M}-${a}}{${M}-${b}}\\approx${probability}$.`,
        },

        {
          text: `This depends on both $${a}$ and $${b}$ individually, not just on the gap $${a}-${b}=${a - b}$ -- unlike the exponential distribution, the uniform distribution is **not** memoryless: how long the cycle has already waited changes what happens next.`,
        },
      ],
    };
  },
});

const uniformSumVarianceTemplate = generatedQuestion({
  id: 'ch06-gen-uniform-sum-variance',

  chapter: 'continuous-distributions',

  topic: 'Continuous uniform',

  difficulty: 'hard',

  generate: (rng) => {
    const w = rng.int(1, 5); // rounding resolution: one error is uniform on [-w/2, w/2]

    const n = rng.int(8, 25); // readings summed

    const oneVarianceExact = (w * w) / 12;

    const sumVarianceExact = n * oneVarianceExact;

    const oneVariance = round(oneVarianceExact, 4);

    const sumSd = round(Math.sqrt(sumVarianceExact), 4);

    return {
      prompt:
        `A data logger rounds each reading to the nearest $${w}$ unit, so each rounding error is uniform on ` +
        `$[-${w}/2,${w}/2]$ and errors are independent. $${n}$ readings are summed. Find the variance of a ` +
        `single rounding error and the standard deviation of the total accumulated error.`,

      params: { w, n },

      parts: [
        { kind: 'numeric', label: 'variance of one error', answer: oneVariance, tol: 0.0005 },

        { kind: 'numeric', label: 'sd of total error', answer: sumSd, tol: 0.005 },

        { kind: 'tf', label: 'the total standard deviation grows proportional to n', answer: false },
      ],

      solution: [
        {
          text: `A single error is uniform on an interval of width $${w}$, so $\\sigma^2=\\dfrac{${w}^2}{12}\\approx${oneVariance}$.`,
        },

        {
          text: `Independent errors have variances that add: $\\text{Var}(\\text{total})=${n}\\times${oneVariance}\\approx${round(sumVarianceExact, 4)}$, so $\\sigma_{\\text{total}}=\\sqrt{${round(sumVarianceExact, 4)}}\\approx${sumSd}$.`,
        },

        {
          text: `Because variances (not standard deviations) add, the total standard deviation grows as $\\sqrt{n}$, **not** proportionally to $n$.`,
        },
      ],
    };
  },
});

const normalDiffersFromMeanTemplate = generatedQuestion({
  id: 'ch06-gen-normal-differs-from-mean',

  chapter: 'continuous-distributions',

  topic: 'Normal distribution',

  difficulty: 'easy',

  generate: (rng) => {
    const mu = rng.int(20, 80);

    const sigma = rng.int(3, 15);

    // k kept between 0.5 and 2.8 sigma, so the two-tail probability
    // 2(1-Phi(k)) always lies between 2(1-Phi(2.8))~0.0051 and
    // 2(1-Phi(0.5))~0.617 -- never within rounding distance of 0.
    const k = round(rng.int(5, 28) / 10, 1);

    const probOutside = round(2 * (1 - normalCdf(k)), 4);

    return {
      prompt:
        `For a normal distribution with $\\mu=${mu}$ and $\\sigma=${sigma}$, find the fraction of observations ` +
        `that differ from the mean by more than $${k}\\sigma$, i.e. $P(|X-\\mu|>${k}\\sigma)$.`,

      params: { mu, sigma, k },

      parts: [
        { kind: 'numeric', answer: probOutside, tol: 0.0005 },

        { kind: 'tf', label: 'this fraction is the same for every mu and sigma', answer: true },
      ],

      solution: [
        {
          text: `Standardizing, $|X-\\mu|>${k}\\sigma$ is exactly $|Z|>${k}$, so $P=2(1-\\Phi(${k}))\\approx${probOutside}$.`,
        },

        {
          text: `The mean and standard deviation cancel out of this calculation entirely -- $k$ is already measured in units of $\\sigma$ -- so the answer is identical for every normal distribution, not just this one.`,
        },
      ],
    };
  },
});

const normalMiddlePercentTemplate = generatedQuestion({
  id: 'ch06-gen-normal-middle-percent',

  chapter: 'continuous-distributions',

  topic: 'Normal distribution',

  difficulty: 'hard',

  generate: (rng) => {
    // mu kept well above sigma's reach (mu >= 50, sigma <= 10, z <= ~2), so
    // x1 = mu - z*sigma never comes close to crossing 0.
    const mu = rng.int(50, 90);

    const sigma = rng.int(3, 10);

    const pct = rng.int(50, 95);

    const p = pct / 100;

    const z = round(invNormalCdf(0.5 + p / 2), 2);

    const x1 = round(mu - z * sigma, 2);

    const x2 = round(mu + z * sigma, 2);

    return {
      prompt:
        `A normal distribution has $\\mu=${mu}$ and $\\sigma=${sigma}$. Find the two values of $x$ that contain ` +
        `the middle $${pct}\\%$ of the area under the curve.`,

      params: { mu, sigma, pct },

      parts: [
        { kind: 'numeric', label: 'z', answer: z, tol: 0.01 },

        { kind: 'numeric', label: 'x1', answer: x1, tol: 0.05 },

        { kind: 'numeric', label: 'x2', answer: x2, tol: 0.05 },
      ],

      solution: [
        {
          text: `The middle $${pct}\\%$ leaves $${round((1 - p) / 2, 4)}$ in each tail, so we need $z$ with $\\Phi(z)=${round(0.5 + p / 2, 4)}$: $z\\approx${z}$.`,
        },

        {
          text: `By symmetry the two values are $x_{1,2}=\\mu\\mp z\\sigma$: $x_1\\approx${x1}$ and $x_2\\approx${x2}$.`,
        },
      ],
    };
  },
});

const normalApplicationEasyLatencyTemplate = generatedQuestion({
  id: 'ch06-gen-normal-application-easy-latency',

  chapter: 'continuous-distributions',

  topic: 'Applications of the normal distribution',

  difficulty: 'easy',

  generate: (rng) => {
    const mu = rng.int(100, 400); // ms

    const sigma = rng.int(10, 50);

    // |z| kept between 0.5 and 2.0, so P(X < x0) always lies strictly
    // between Phi(-2.0)~0.0228 and Phi(2.0)~0.9772.
    const sign = rng.bool() ? 1 : -1;

    const zTarget = (sign * rng.int(5, 20)) / 10;

    const x0 = Math.round(mu + zTarget * sigma);

    const z = round((x0 - mu) / sigma, 2);

    const probability = round(normalCdf(z), 4);

    return {
      prompt:
        `A web service's response time is normally distributed with $\\mu=${mu}$ ms and $\\sigma=${sigma}$ ms. ` +
        `Find the probability that a randomly sampled request takes less than $${x0}$ ms.`,

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

const normalApplicationTwoSidedMcqTemplate = generatedQuestion({
  id: 'ch06-gen-normal-application-two-sided-mcq',

  chapter: 'continuous-distributions',

  topic: 'Applications of the normal distribution',

  difficulty: 'medium',

  generate: (rng) => {
    const mu = rng.int(500, 2000); // hours

    const sigma = rng.int(50, 300);

    // z1, z2 kept at least 0.5 in magnitude and on opposite sides of 0, so
    // the interval probability stays comfortably material.
    const z1Target = -rng.int(5, 20) / 10;

    const z2Target = rng.int(5, 20) / 10;

    const x1 = Math.round(mu + z1Target * sigma);

    const x2 = Math.round(mu + z2Target * sigma);

    const z1 = round((x1 - mu) / sigma, 2);

    const z2 = round((x2 - mu) / sigma, 2);

    const probability = round(normalCdf(z2) - normalCdf(z1), 4);

    // Ordered by how instructive the mistake is. The last two are spares that
    // only get used when a symmetric draw collapses the first two together --
    // see distinctChoices.
    const { choices, answer } = distinctChoices(
      probability,
      [
        round(normalCdf(z2), 4), // read only the area left of x2

        round(1 - normalCdf(z1), 4), // read the area right of x1

        round(probability / 2, 4), // halved it, as if the interval were symmetric

        round(1 - probability, 4), // gave the two tails rather than the middle

        round(normalCdf(z1), 4), // read the x1 row and stopped
      ],
      rng,
    );

    return {
      prompt:
        `Component lifetimes are normally distributed with $\\mu=${mu}$ hours and $\\sigma=${sigma}$ hours. ` +
        `What is $P(${x1}<X<${x2})$?`,

      params: { mu, sigma, x1, x2 },

      parts: [{ kind: 'mcq', choices, answer }],

      solution: [
        {
          text: `Standardize both endpoints: $z_1=\\dfrac{${x1}-${mu}}{${sigma}}=${z1}$ and $z_2=\\dfrac{${x2}-${mu}}{${sigma}}=${z2}$.`,
        },

        {
          text: `$P(${x1}<X<${x2})=\\Phi(${z2})-\\Phi(${z1})\\approx${probability}$. (Using only $\\Phi(${z2})$ or only $1-\\Phi(${z1})$ keeps the wrong tail; halving the answer double-counts nothing but is simply not the identity.)`,
        },
      ],
    };
  },
});

const normalApproxLegitimacyTemplate = generatedQuestion({
  id: 'ch06-gen-normal-approx-binomial-legitimacy',

  chapter: 'continuous-distributions',

  topic: 'Normal approximation to the binomial',

  difficulty: 'easy',

  generate: (rng) => {
    const n = rng.int(20, 150);

    const p = round(rng.int(2, 50) / 100, 2); // deliberately wide, so the check sometimes fails

    const npVal = round(n * p, 2);

    const nq = round(n * (1 - p), 2);

    const legitimate = npVal >= 5 && nq >= 5;

    return {
      prompt:
        `A binomial experiment has $n=${n}$ trials with success probability $p=${p}$. Compute $np$ and ` +
        `$n(1-p)$, and state whether the normal approximation to the binomial is appropriate here.`,

      params: { n, p },

      parts: [
        { kind: 'numeric', label: 'np', answer: npVal, tol: 0.05 },

        { kind: 'numeric', label: 'n(1-p)', answer: nq, tol: 0.05 },

        { kind: 'tf', label: 'normal approximation is appropriate', answer: legitimate },
      ],

      solution: [
        {
          text: `$np=${n}\\times${p}=${npVal}$ and $n(1-p)=${n}\\times${round(1 - p, 4)}=${nq}$.`,
        },

        {
          text: legitimate
            ? `Both exceed 5, so the normal curve is a reasonable approximation to this binomial.`
            : `At least one of $np$, $n(1-p)$ falls short of 5, so the binomial is too skewed for the normal approximation to be trustworthy here -- use the exact binomial formula instead.`,
        },
      ],
    };
  },
});

const normalApproxCorrectionComparisonTemplate = generatedQuestion({
  id: 'ch06-gen-normal-approx-binomial-correction-comparison',

  chapter: 'continuous-distributions',

  topic: 'Normal approximation to the binomial',

  difficulty: 'medium',

  generate: (rng) => {
    const n = rng.int(60, 200);

    const p = round(rng.int(3, 7) / 10, 1);

    const mu = n * p;

    const sigma = Math.sqrt(n * p * (1 - p));

    const sign = rng.bool() ? 1 : -1;

    const zTarget = (sign * rng.int(5, 25)) / 10;

    const x0 = Math.min(n - 1, Math.max(1, Math.round(mu + 0.5 + zTarget * sigma)));

    const zCorrected = round((x0 - 0.5 - mu) / sigma, 2);

    const zUncorrected = round((x0 - mu) / sigma, 2);

    const probCorrected = round(normalCdf(zCorrected), 4);

    const probUncorrected = round(normalCdf(zUncorrected), 4);

    return {
      prompt:
        `Using the normal approximation to the binomial with $n=${n}$ and $p=${p}$, find $P(X<${x0})$ ` +
        `(a) with the continuity correction and (b) without it.`,

      params: { n, p, x0 },

      parts: [
        { kind: 'numeric', label: '(a) with correction', answer: probCorrected, tol: 0.0005 },

        { kind: 'numeric', label: '(b) without correction', answer: probUncorrected, tol: 0.0005 },
      ],

      solution: [
        {
          text: `$\\mu=np=${round(mu, 4)}$ and $\\sigma=\\sqrt{npq}=${round(sigma, 4)}$.`,
        },

        {
          text: `(a) With the correction, $z=\\dfrac{${x0}-0.5-${round(mu, 4)}}{${round(sigma, 4)}}\\approx${zCorrected}$, so $P\\approx${probCorrected}$.`,
        },

        {
          text: `(b) Skipping the correction uses $z=\\dfrac{${x0}-${round(mu, 4)}}{${round(sigma, 4)}}\\approx${zUncorrected}$ instead, giving $P\\approx${probUncorrected}$ -- a different, gradable answer, which is exactly why the correction is not optional here.`,
        },
      ],
    };
  },
});

const areasForwardLookupTemplate = generatedQuestion({
  id: 'ch06-gen-areas-forward-lookup',

  chapter: 'continuous-distributions',

  topic: 'Areas under the normal curve',

  difficulty: 'easy',

  generate: (rng) => {
    const z1 = -(rng.int(5, 25) / 10);

    const z2 = rng.int(5, 25) / 10;

    const area = round(normalCdf(z2) - normalCdf(z1), 4);

    // The last candidate can never collide with anything: z1 <= -0.5 and
    // z2 >= 0.5 hold it below 0.31, while every other value here sits above
    // 0.38. So three distinct distractors always survive, however the draw
    // falls -- see distinctChoices.
    const { choices, answer } = distinctChoices(
      area,
      [
        round(normalCdf(z2), 4), // read only the area left of z2

        round(1 - normalCdf(z1), 4), // read the area right of z1

        round(normalCdf(z2) + normalCdf(z1), 4), // added the two areas instead of subtracting

        round(1 - area, 4), // gave the two tails rather than the middle

        round(normalCdf(z1), 4), // read the z1 row and stopped
      ],
      rng,
    );

    return {
      prompt: `Given a standard normal distribution, find the area under the curve between $z=${z1}$ and $z=${z2}$.`,

      params: { z1, z2 },

      parts: [{ kind: 'mcq', choices, answer }],

      solution: [
        {
          text: `The area between two $z$ values is the difference of their areas to the left: $\\Phi(${z2})-\\Phi(${z1})\\approx${area}$.`,
        },
      ],
    };
  },
});

const areasSymmetryFactTemplate = generatedQuestion({
  id: 'ch06-gen-areas-symmetry-fact',

  chapter: 'continuous-distributions',

  topic: 'Areas under the normal curve',

  difficulty: 'easy',

  generate: (rng) => {
    // z kept between 0.5 and 2.8, so P(Z>z) always lies between roughly
    // Phi(-2.8)~0.0026 and Phi(-0.5)~0.309 -- never within rounding distance
    // of 0.
    const z = round(rng.int(5, 28) / 10, 1);

    const probRight = round(1 - normalCdf(z), 4);

    return {
      prompt: `Given a standard normal distribution, find $P(Z>${z})$, and state whether $P(Z<-${z})=P(Z>${z})$.`,

      params: { z },

      parts: [
        { kind: 'numeric', answer: probRight, tol: 0.0005 },

        { kind: 'tf', label: 'P(Z<-z) = P(Z>z)', answer: true },
      ],

      solution: [
        {
          text: `$P(Z>${z})=1-\\Phi(${z})\\approx${probRight}$.`,
        },

        {
          text: `The standard normal curve is symmetric about 0, so the area beyond $${z}$ on the right always equals the area beyond $-${z}$ on the left -- true for every $z$, not just this one.`,
        },
      ],
    };
  },
});

const areasInverseSymmetricTemplate = generatedQuestion({
  id: 'ch06-gen-areas-inverse-symmetric',

  chapter: 'continuous-distributions',

  topic: 'Areas under the normal curve',

  difficulty: 'medium',

  generate: (rng) => {
    const pct = rng.int(50, 95);

    const p = pct / 100;

    const k = round(invNormalCdf(0.5 + p / 2), 2);

    return {
      prompt: `Given a standard normal distribution, find the value of $k$ such that $P(-k<Z<k)=${p}$.`,

      params: { p },

      parts: [{ kind: 'numeric', answer: k, tol: 0.01 }],

      solution: [
        {
          text: `By symmetry, $P(-k<Z<k)=${p}$ leaves $${round((1 - p) / 2, 4)}$ in each tail, so $\\Phi(k)=${round(0.5 + p / 2, 4)}$: $k\\approx${k}$.`,
        },
      ],
    };
  },
});

const areasTwoStepTailTemplate = generatedQuestion({
  id: 'ch06-gen-areas-two-step-tail',

  chapter: 'continuous-distributions',

  topic: 'Areas under the normal curve',

  difficulty: 'hard',

  generate: (rng) => {
    const z0 = -(rng.int(5, 20) / 10); // -0.5..-2.0

    // k is chosen positive and at least 0.3, so it is always both comfortably
    // above z0 (which is negative) and comfortably away from 0.
    const k = round(rng.int(3, 20) / 10, 1);

    const p = round(normalCdf(k) - normalCdf(z0), 4);

    return {
      prompt: `Given a standard normal distribution and $P(${z0}<Z<k)=${p}$, find $k$.`,

      params: { z0, p },

      parts: [{ kind: 'numeric', answer: k, tol: 0.01 }],

      solution: [
        {
          text: `$P(Z<${z0})\\approx${round(normalCdf(z0), 4)}$, so $P(Z<k)=${p}+${round(normalCdf(z0), 4)}\\approx${round(p + normalCdf(z0), 4)}$.`,
        },

        {
          text: `Reading that area off the standard normal curve in reverse gives $k\\approx${k}$.`,
        },
      ],
    };
  },
});

const exponentialPoissonReverseTemplate = generatedQuestion({
  id: 'ch06-gen-exponential-poisson-reverse',

  chapter: 'continuous-distributions',

  topic: 'Exponential distribution',

  difficulty: 'medium',

  generate: (rng) => {
    const lambda = rng.int(2, 8); // arrivals per hour

    const k = rng.int(1, 3); // exact count asked about

    // lambda*t kept near k (within 40%), so the Poisson pmf at x = k stays
    // near its own peak and well clear of 0.
    const lambdaT = round(k * (rng.int(6, 14) / 10), 2);

    const t = round(lambdaT / lambda, 4);

    const meanWait = round(1 / lambda, 4);

    const poissonProb = round((Math.exp(-lambdaT) * lambdaT ** k) / factorial(k), 4);

    return {
      prompt:
        `Arrivals form a Poisson process with rate $\\lambda=${lambda}$ per hour, so the time between arrivals ` +
        `is exponential with mean $1/\\lambda$. Find that mean inter-arrival time, and the Poisson probability ` +
        `of exactly $${k}$ arrivals in $${t}$ hours.`,

      params: { lambda, k, t },

      parts: [
        { kind: 'numeric', label: 'mean inter-arrival time', answer: meanWait, tol: 0.0005 },

        { kind: 'numeric', label: `P(exactly ${k} arrivals)`, answer: poissonProb, tol: 0.0005 },
      ],

      solution: [
        {
          text: `The exponential inter-arrival mean is just $1/\\lambda=${meanWait}$ hours -- the Poisson rate and the exponential mean are two views of the same process.`,
        },

        {
          text: `Over $${t}$ hours, $\\lambda t=${lambdaT}$, so $P(X=${k})=e^{-\\lambda t}\\dfrac{(\\lambda t)^${k}}{${k}!}\\approx${poissonProb}$ -- this time the correspondence runs from the Poisson *count* back to the exponential *rate*, the reverse of asking for $P(T>t)$.`,
        },
      ],
    };
  },
});

export const ch06Generators: QuestionTemplate[] = [
  uniformProbabilityMeanVarianceTemplate,

  uniformWaitingTimeTemplate,

  uniformConditionalTemplate,

  uniformSumVarianceTemplate,

  normalTwoSidedTemplate,

  normalCurveInReverseTemplate,

  normalDiffersFromMeanTemplate,

  normalMiddlePercentTemplate,

  normalApplicationForwardTemplate,

  normalApplicationInverseTemplate,

  normalApplicationEasyLatencyTemplate,

  normalApplicationTwoSidedMcqTemplate,

  normalApproxBinomialSingleTemplate,

  normalApproxBinomialRangeTemplate,

  normalApproxLegitimacyTemplate,

  normalApproxCorrectionComparisonTemplate,

  areasForwardLookupTemplate,

  areasSymmetryFactTemplate,

  areasInverseSymmetricTemplate,

  areasTwoStepTailTemplate,

  exponentialProbabilityTemplate,

  exponentialMemorylessTemplate,

  exponentialSeriesSystemTemplate,

  exponentialParallelRedundancyTemplate,

  exponentialMedianVsMeanTemplate,

  exponentialPoissonEquivalenceTemplate,

  exponentialPoissonReverseTemplate,

  normalSolveMeanFromTailTemplate,

  normalSolveSigmaFromTailTemplate,
];
