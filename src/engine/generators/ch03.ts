import type { QuestionTemplate } from '../types';

import type { SeededRng } from '../rng';

import { generatedQuestion } from '../authoring';

import { ch03JointGenerators } from './ch03-joint';

import { nCr, round } from '../mathx';

/** Fisher-Yates over the first `k` slots -- a local shuffle, since `SeededRng`
 * only exposes `pick` (with replacement) and no chapter file may add to it. */
const pickDistinctIndices = (rng: SeededRng, size: number, k: number): number[] => {
  const idx = Array.from({ length: size }, (_, i) => i);

  for (let i = size - 1; i > 0; i--) {
    const j = rng.int(0, i);

    [idx[i], idx[j]] = [idx[j], idx[i]];
  }

  return idx.slice(0, k);
};

const sampleSpaceValuesTemplate = generatedQuestion({
  id: 'ch03-gen-sample-space-values',

  chapter: 'random-variables',

  topic: 'Random variables',

  difficulty: 'easy',

  generate: (rng) => {
    const n = rng.int(3, 6);

    const r = rng.int(1, n - 1); // strictly inside, so neither count is degenerate

    const points = 2 ** n;

    const mapped = nCr(n, r);

    return {
      prompt:
        `${n} electronic components are tested one after another, each recorded as $N$ (nondefective) ` +
        `or $D$ (defective). Let $X$ be the number of defectives. How many sample points does $S$ ` +
        `contain, and how many of them are assigned the value $X=${r}$?`,

      params: { n, r },

      parts: [
        { kind: 'numeric', label: 'Sample points in S', answer: points, tol: 0 },

        { kind: 'numeric', label: `Sample points with X = ${r}`, answer: mapped, tol: 0 },
      ],

      solution: [
        {
          text: `Each of the ${n} components is recorded two ways, so by the multiplication rule $|S|=2^{${n}}=${points}$.`,
        },

        {
          text: `$X=${r}$ means choosing which ${r} of the ${n} positions hold a $D$: $\\binom{${n}}{${r}}=${mapped}$.`,
        },

        {
          text: `A value of $X$ is not an outcome — it names the event $\\{X=${r}\\}$, a subset of $S$ with ${mapped} points.`,
        },
      ],
    };
  },
});

const classifyDiscreteContinuousTemplate = generatedQuestion({
  id: 'ch03-gen-classify-discrete-continuous',

  chapter: 'random-variables',

  topic: 'Random variables',

  difficulty: 'easy',

  generate: (rng) => {
    // Tagged by hand once, so no draw can invent a wrong classification --
    // the randomness only picks which four of the eight appear.
    const pool: { name: string; discrete: boolean }[] = [
      { name: 'the number of typos on a printed page', discrete: true },

      { name: 'the download speed of a network link, in Mbps', discrete: false },

      { name: 'the number of failed login attempts before a lockout', discrete: true },

      { name: 'the volume of coffee poured into a cup, in millilitres', discrete: false },

      { name: 'the number of cars passing a sensor in an hour', discrete: true },

      { name: 'the shelf life of a carton of milk, in days', discrete: false },

      { name: 'the number of characters in a text message', discrete: true },

      { name: 'the reaction time of a sprinter, in seconds', discrete: false },
    ];

    const picked = pickDistinctIndices(rng, pool.length, 4).map((i) => pool[i]);

    const discreteCount = picked.filter((p) => p.discrete).length;

    const list = picked.map((p, i) => `${i + 1}. ${p.name}`).join('; ');

    return {
      prompt:
        `Classify each of the following as **discrete** (counted) or **continuous** (measured): ${list}. ` +
        `How many of the four are discrete?`,

      params: { picked: picked.map((p) => (p.discrete ? 1 : 0)) },

      parts: [{ kind: 'mcq', choices: ['0', '1', '2', '3', '4'], answer: discreteCount }],

      solution: [
        {
          text: picked
            .map(
              (p) =>
                `*${p.name}* is **${p.discrete ? 'discrete' : 'continuous'}**, since it is ${p.discrete ? 'counted' : 'measured'}.`,
            )
            .join(' '),
        },

        {
          text: `That makes ${discreteCount} of the four discrete.`,
        },
      ],
    };
  },
});

const geometricWaitingTemplate = generatedQuestion({
  id: 'ch03-gen-geometric-waiting',

  chapter: 'random-variables',

  topic: 'Random variables',

  difficulty: 'medium',

  generate: (rng) => {
    const pTenths = rng.int(3, 7); // P(tail) = pTenths / 10, kept away from 0 and 1

    const p = pTenths / 10;

    const k = rng.int(1, 4);

    const atK = round(p * (1 - p) ** (k - 1), 4);

    const upToK = round(1 - (1 - p) ** k, 4);

    return {
      prompt:
        `A biased coin, with $P(\\text{tail})=${p}$ on each toss, is tossed repeatedly until the first ` +
        `tail appears. Let $X$ be the toss number on which the first tail occurs. Find $P(X=${k})$ and ` +
        `$P(X\\le${k})$.`,

      params: { p, k },

      parts: [
        { kind: 'numeric', label: `P(X = ${k})`, answer: atK, tol: 0.0005 },

        { kind: 'numeric', label: `P(X <= ${k})`, answer: upToK, tol: 0.0005 },

        { kind: 'tf', label: 'The sample space of X is finite', answer: false },
      ],

      solution: [
        {
          text: `$X=${k}$ means the first $${k - 1}$ tosses land heads and the ${k}th lands tails: $P(X=${k})=(1-${p})^{${k - 1}}\\cdot${p}\\approx${atK}$.`,
        },

        {
          text: `$P(X\\le${k})=1-P(X>${k})=1-(1-${p})^{${k}}\\approx${upToK}$ — the complement is cheaper than summing the geometric run directly.`,
        },

        {
          text: `Nothing stops the coin from landing heads every time, so $X$ can in principle take any positive integer value: its range is **countably infinite**, not finite.`,
        },
      ],
    };
  },
});

const pmfConstantTemplate = generatedQuestion({
  id: 'ch03-gen-pmf-constant',

  chapter: 'random-variables',

  topic: 'Discrete distributions',

  difficulty: 'easy',

  generate: (rng) => {
    const n = rng.int(4, 8);

    const total = (n * (n + 1)) / 2; // sum of 1..n

    const c = round(1 / total, 5);

    const pLargest = round(n / total, 4);

    return {
      prompt:
        `A discrete random variable $X$ takes the values $x=1,2,\\dots,${n}$ with $f(x)=cx$. Find the ` +
        `constant $c$ that makes $f$ a probability mass function, and then find $P(X=${n})$.`,

      params: { n },

      parts: [
        { kind: 'numeric', label: 'c', answer: c, tol: 0.0005 },

        { kind: 'numeric', label: `P(X = ${n})`, answer: pLargest, tol: 0.0005 },
      ],

      solution: [
        {
          text: `A pmf must satisfy $\\sum_x f(x)=1$, so $c(1+2+\\cdots+${n})=1$.`,
        },

        {
          text: `The sum is $\\dfrac{${n}(${n}+1)}{2}=${total}$, so $c=\\dfrac{1}{${total}}\\approx${c}$.`,
        },

        {
          text: `Then $P(X=${n})=c\\cdot${n}=\\dfrac{${n}}{${total}}\\approx${pLargest}$.`,
        },
      ],
    };
  },
});

const hypergeometricPmfTemplate = generatedQuestion({
  id: 'ch03-gen-hypergeometric-pmf',

  chapter: 'random-variables',

  topic: 'Discrete distributions',

  difficulty: 'medium',

  generate: (rng) => {
    const total = rng.int(15, 20);

    const defective = rng.int(2, 4);

    const bought = rng.int(2, 3);

    const x = rng.int(1, Math.min(defective, bought)); // x defectives must be available and purchasable

    const favourable = nCr(defective, x) * nCr(total - defective, bought - x);

    const answer = round(favourable / nCr(total, bought), 4);

    return {
      prompt:
        `A shipment of ${total} similar laptop computers to a retail outlet contains ${defective} that ` +
        `are defective. A school makes a random purchase of ${bought} of these computers. Let $X$ be the ` +
        `number of defective computers purchased. Find $P(X=${x})$.`,

      params: { total, defective, bought, x },

      parts: [{ kind: 'numeric', answer, tol: 0.0005 }],

      solution: [
        {
          text: `Choose the ${x} defective from the ${defective} available and the rest from the ${total - defective} good ones, over all purchases of ${bought}:`,
        },

        {
          text: `$P(X=${x})=\\dfrac{\\binom{${defective}}{${x}}\\binom{${total - defective}}{${bought - x}}}{\\binom{${total}}{${bought}}}=\\dfrac{${favourable}}{${nCr(total, bought)}}\\approx${answer}$.`,
        },
      ],
    };
  },
});

const discreteCdfTemplate = generatedQuestion({
  id: 'ch03-gen-discrete-cdf',

  chapter: 'random-variables',

  topic: 'Discrete distributions',

  difficulty: 'medium',

  generate: (rng) => {
    // Weights are at least 1, so no value of X quietly carries probability 0
    // and every step of F is a genuine jump.
    const w0 = rng.int(1, 6);

    const w1 = rng.int(1, 6);

    const w2 = rng.int(1, 6);

    const w3 = rng.int(1, 6);

    const total = w0 + w1 + w2 + w3;

    const k = rng.int(1, 2); // strictly inside 0..3, so both parts stay in (0, 1)

    const upTo = k === 1 ? w0 + w1 : w0 + w1 + w2;

    const cdf = round(upTo / total, 4);

    const above = round((total - upTo) / total, 4);

    return {
      prompt:
        `A discrete random variable $X$ takes the values $0,1,2,3$ with $f(0)=\\dfrac{${w0}}{${total}}$, ` +
        `$f(1)=\\dfrac{${w1}}{${total}}$, $f(2)=\\dfrac{${w2}}{${total}}$ and $f(3)=\\dfrac{${w3}}{${total}}$. ` +
        `Find $F(${k})$ and $P(X>${k})$.`,

      params: { w0, w1, w2, w3, k },

      parts: [
        { kind: 'numeric', label: `F(${k})`, answer: cdf, tol: 0.0005 },

        { kind: 'numeric', label: `P(X > ${k})`, answer: above, tol: 0.0005 },
      ],

      solution: [
        {
          text: `The CDF accumulates: $F(${k})=P(X\\le${k})=\\sum_{t\\le${k}}f(t)=\\dfrac{${upTo}}{${total}}\\approx${cdf}$.`,
        },

        {
          text: `$P(X>${k})$ is the complement of $P(X\\le${k})$: $1-\\dfrac{${upTo}}{${total}}=\\dfrac{${total - upTo}}{${total}}\\approx${above}$.`,
        },

        {
          text: `Note $P(X>${k})\\neq P(X\\ge${k})$ — for a discrete variable the endpoint is worth $f(${k})$.`,
        },
      ],
    };
  },
});

const cdfToPmfTemplate = generatedQuestion({
  id: 'ch03-gen-cdf-to-pmf',

  chapter: 'random-variables',

  topic: 'Discrete distributions',

  difficulty: 'hard',

  generate: (rng) => {
    const w = [rng.int(1, 5), rng.int(1, 5), rng.int(1, 5), rng.int(1, 5), rng.int(1, 5)];

    const total = w.reduce((s, x) => s + x, 0);

    const cum = w.reduce<number[]>((acc, x) => [...acc, (acc[acc.length - 1] ?? 0) + x], []);

    const a = rng.int(0, 1);

    const b = rng.int(2, 4); // a < b always, so the interval is non-empty

    const fAtA = round(w[a] / total, 4);

    const fAtB = round(w[b] / total, 4);

    const between = round((cum[b] - cum[a]) / total, 4);

    return {
      prompt:
        `The cumulative distribution function of a discrete random variable $X$ taking the values ` +
        `$0,1,2,3,4$ is $F(0)=\\dfrac{${cum[0]}}{${total}}$, $F(1)=\\dfrac{${cum[1]}}{${total}}$, ` +
        `$F(2)=\\dfrac{${cum[2]}}{${total}}$, $F(3)=\\dfrac{${cum[3]}}{${total}}$ and $F(4)=1$. ` +
        `Find $f(${a})$, $f(${b})$ and $P(${a}<X\\le${b})$.`,

      params: { w0: w[0], w1: w[1], w2: w[2], w3: w[3], w4: w[4], a, b },

      parts: [
        { kind: 'numeric', label: `f(${a})`, answer: fAtA, tol: 0.0005 },

        { kind: 'numeric', label: `f(${b})`, answer: fAtB, tol: 0.0005 },

        { kind: 'numeric', label: `P(${a} < X <= ${b})`, answer: between, tol: 0.0005 },
      ],

      solution: [
        {
          text: `The pmf is the jump height of $F$: $f(x)=F(x)-F(x-1)$, reading $F(-1)=0$.`,
        },

        {
          text: `$f(${a})=\\dfrac{${cum[a]}}{${total}}-\\dfrac{${a === 0 ? 0 : cum[a - 1]}}{${total}}=\\dfrac{${w[a]}}{${total}}\\approx${fAtA}$.`,
        },

        {
          text: `$f(${b})=\\dfrac{${cum[b]}}{${total}}-\\dfrac{${cum[b - 1]}}{${total}}=\\dfrac{${w[b]}}{${total}}\\approx${fAtB}$.`,
        },

        {
          text: `Between two values, $P(${a}<X\\le${b})=F(${b})-F(${a})=\\dfrac{${cum[b] - cum[a]}}{${total}}\\approx${between}$.`,
        },
      ],
    };
  },
});

const validPmfCheckTemplate = generatedQuestion({
  id: 'ch03-gen-valid-pmf-check',

  chapter: 'random-variables',

  topic: 'Discrete distributions',

  difficulty: 'easy',

  generate: (rng) => {
    const n = rng.int(3, 5);

    const a = rng.int(0, 2);

    // sum_{x=0}^{n} (x + a) = (n+1)*a + n(n+1)/2 -- the only k that normalises f.
    const trueK = (n + 1) * a + (n * (n + 1)) / 2;

    const isValid = rng.bool();

    const shownK = isValid ? trueK : trueK + rng.int(1, 4);

    return {
      prompt:
        `A discrete random variable $X$ takes the values $x=0,1,\\dots,${n}$ with proposed mass function ` +
        `$f(x)=\\dfrac{x+${a}}{${shownK}}$. Find the constant $k$ that actually makes $f$ a pmf, and decide ` +
        `whether the proposed $f$ (with $k=${shownK}$) is valid.`,

      params: { n, a, shownK, trueK, isValid: isValid ? 1 : 0 },

      parts: [
        { kind: 'numeric', label: 'correct k', answer: trueK, tol: 0 },

        { kind: 'tf', label: `f is a valid pmf with k = ${shownK}`, answer: isValid },
      ],

      solution: [
        {
          text: `A pmf must satisfy $\\sum_x f(x)=1$: $\\sum_{x=0}^{${n}}\\dfrac{x+${a}}{k}=\\dfrac{1}{k}\\left(${a}\\cdot(${n}+1)+\\dfrac{${n}(${n}+1)}{2}\\right)=1$.`,
        },

        {
          text: `That forces $k=${trueK}$.`,
        },

        {
          text: isValid
            ? `Since the proposed constant is exactly $${shownK}$, $f$ **is** a valid pmf.`
            : `The proposed constant $${shownK}\\neq${trueK}$, so the values sum to $\\dfrac{${trueK}}{${shownK}}\\neq1$ and $f$ is **not** a valid pmf.`,
        },
      ],
    };
  },
});

const cacheHitBinomialTemplate = generatedQuestion({
  id: 'ch03-gen-cache-hit-binomial',

  chapter: 'random-variables',

  topic: 'Discrete distributions',

  difficulty: 'medium',

  generate: (rng) => {
    const n = rng.int(4, 6);

    const pPct = rng.int(85, 98); // P(cache hit) as a percentage, kept comfortably below 100

    const p = pPct / 100;

    const allHit = round(p ** n, 4);

    const atLeastOneMiss = round(1 - allHit, 4);

    return {
      prompt:
        `A content cache serves each request with probability $${p}$ of a hit, independently of every ` +
        `other request. Let $Y$ be the number of hits among $${n}$ consecutive requests, so ` +
        `$f(y)=\\binom{${n}}{y}(${p})^{y}(1-${p})^{${n}-y}$ for $y=0,1,\\dots,${n}$. Find $P(Y=${n})$, the ` +
        `chance every request hits, and the chance at least one request misses.`,

      params: { n, p },

      parts: [
        { kind: 'numeric', label: `P(Y = ${n})`, answer: allHit, tol: 0.0005 },

        { kind: 'numeric', label: 'P(at least one miss)', answer: atLeastOneMiss, tol: 0.0005 },
      ],

      solution: [
        {
          text: `$Y=${n}$ needs every one of the $${n}$ requests to hit: $f(${n})=\\binom{${n}}{${n}}(${p})^{${n}}(1-${p})^0=(${p})^{${n}}\\approx${allHit}$.`,
        },

        {
          text: `"At least one miss" is the complement of "all hit": $1-${allHit}\\approx${atLeastOneMiss}$ — cheaper than summing $f(0)$ through $f(${n - 1})$.`,
        },
      ],
    };
  },
});

const densityConstantTemplate = generatedQuestion({
  id: 'ch03-gen-density-constant',

  chapter: 'random-variables',

  topic: 'Continuous distributions',

  difficulty: 'easy',

  generate: (rng) => {
    const b = rng.int(2, 6);

    const m = rng.int(1, b - 1); // strictly inside (0, b), so the tail probability is in (0, 1)

    const c = round(2 / b ** 2, 5);

    const tail = round(1 - m ** 2 / b ** 2, 4);

    return {
      prompt:
        `A continuous random variable $X$ has density $f(x)=cx$ for $0<x<${b}$ and $f(x)=0$ elsewhere. ` +
        `Find the constant $c$, and then find $P(X>${m})$.`,

      params: { b, m },

      parts: [
        { kind: 'numeric', label: 'c', answer: c, tol: 0.0005 },

        { kind: 'numeric', label: `P(X > ${m})`, answer: tail, tol: 0.0005 },
      ],

      solution: [
        {
          text: `A density must integrate to $1$: $\\displaystyle\\int_0^{${b}} cx\\,dx=\\dfrac{c x^2}{2}\\bigg|_0^{${b}}=\\dfrac{c\\cdot${b ** 2}}{2}=1$.`,
        },

        {
          text: `So $c=\\dfrac{2}{${b ** 2}}\\approx${c}$. (Note $c$ is a density, not a probability — it need not be below $1$.)`,
        },

        {
          text: `$P(X>${m})=\\displaystyle\\int_{${m}}^{${b}} cx\\,dx=1-\\dfrac{${m ** 2}}{${b ** 2}}\\approx${tail}$.`,
        },
      ],
    };
  },
});

const densityIntervalTemplate = generatedQuestion({
  id: 'ch03-gen-density-interval',

  chapter: 'random-variables',

  topic: 'Continuous distributions',

  difficulty: 'medium',

  generate: (rng) => {
    const a = rng.int(1, 2);

    const b = a + rng.int(2, 3); // width >= 2, so an integer point sits strictly inside

    const d = rng.int(a + 1, b - 1);

    const k = round((b ** 3 - a ** 3) / 3, 4);

    const upTo = round((d ** 3 - a ** 3) / (b ** 3 - a ** 3), 4);

    return {
      prompt:
        `A continuous random variable $X$ has density $f(x)=\\dfrac{x^2}{k}$ for $${a}<x<${b}$ and ` +
        `$f(x)=0$ elsewhere. Find the constant $k$ that makes $f$ a density, and then find $P(X\\le${d})$.`,

      params: { a, b, d },

      parts: [
        { kind: 'numeric', label: 'k', answer: k, tol: 0.0005 },

        { kind: 'numeric', label: `P(X <= ${d})`, answer: upTo, tol: 0.0005 },
      ],

      solution: [
        {
          text: `$\\displaystyle\\int_{${a}}^{${b}}\\dfrac{x^2}{k}\\,dx=\\dfrac{x^3}{3k}\\bigg|_{${a}}^{${b}}=\\dfrac{${b ** 3}-${a ** 3}}{3k}=1$, so $k=\\dfrac{${b ** 3 - a ** 3}}{3}\\approx${k}$.`,
        },

        {
          text: `$P(X\\le${d})=\\displaystyle\\int_{${a}}^{${d}}\\dfrac{x^2}{k}\\,dx=\\dfrac{${d ** 3}-${a ** 3}}{${b ** 3 - a ** 3}}\\approx${upTo}$.`,
        },

        {
          text: `$X$ is continuous, so $P(X\\le${d})=P(X<${d})$ — the endpoint carries no probability.`,
        },
      ],
    };
  },
});

const validDensityCheckTemplate = generatedQuestion({
  id: 'ch03-gen-valid-density-check',

  chapter: 'random-variables',

  topic: 'Continuous distributions',

  difficulty: 'easy',

  generate: (rng) => {
    const a = rng.int(2, 5);

    // integral of k x^2 over (0, a) is k a^3 / 3, so k = 3 / a^3 is the only normalising constant.
    const trueK = round(3 / a ** 3, 5);

    const isValid = rng.bool();

    const factor = rng.pick([0.5, 1.5, 2]); // never 1, so an invalid draw never accidentally matches

    const shownK = isValid ? trueK : round(trueK * factor, 5);

    return {
      prompt:
        `The shelf life, in days, of a perishable component is a continuous random variable $X$ with ` +
        `proposed density $f(x)=kx^2$ for $0<x<${a}$ and $f(x)=0$ elsewhere. Find the constant $k$ that ` +
        `actually makes $f$ a density, and decide whether the proposed value $k=${shownK}$ is valid.`,

      params: { a, shownK, trueK, isValid: isValid ? 1 : 0 },

      parts: [
        { kind: 'numeric', label: 'correct k', answer: trueK, tol: 0.0005 },

        { kind: 'tf', label: `f is a valid density with k = ${shownK}`, answer: isValid },
      ],

      solution: [
        {
          text: `A density must integrate to $1$: $\\displaystyle\\int_0^{${a}} kx^2\\,dx=\\dfrac{k\\cdot${a}^3}{3}=1$, so $k=\\dfrac{3}{${a}^3}\\approx${trueK}$.`,
        },

        {
          text: isValid
            ? `The proposed $k=${shownK}$ matches this value, so $f$ **is** a valid density.`
            : `The proposed $k=${shownK}$ does not match $${trueK}$, so $\\int_0^{${a}} f(x)\\,dx\\neq1$ and $f$ is **not** a valid density.`,
        },
      ],
    };
  },
});

const latencyCdfInverseTemplate = generatedQuestion({
  id: 'ch03-gen-latency-cdf-inverse',

  chapter: 'random-variables',

  topic: 'Continuous distributions',

  difficulty: 'medium',

  generate: (rng) => {
    const a = rng.int(1, 3) * 10; // lower bound of latency, ms

    const width = rng.int(2, 5) * 10;

    const b = a + width;

    const pTenths = rng.int(2, 8); // target probability strictly inside (0, 1)

    const p = pTenths / 10;

    const density = round(1 / width, 4);

    const xp = round(a + p * width, 2);

    return {
      prompt:
        `The response time $X$ of a web request, in milliseconds, is uniformly distributed on ` +
        `$(${a},${b})$, so $F(x)=\\dfrac{x-${a}}{${width}}$ for $${a}<x<${b}$. Find the density $f(x)$, and ` +
        `find the response time $x_p$ such that $F(x_p)=${p}$.`,

      params: { a, b, p },

      parts: [
        { kind: 'numeric', label: 'f(x)', answer: density, tol: 0.0005 },

        { kind: 'numeric', label: `x with F(x) = ${p}`, answer: xp, tol: 0.01 },
      ],

      solution: [
        {
          text: `A uniform density is constant on its support: $f(x)=\\dfrac{1}{${b}-${a}}=\\dfrac{1}{${width}}\\approx${density}$.`,
        },

        {
          text: `Solving $F(x_p)=${p}$ for $x_p$: $\\dfrac{x_p-${a}}{${width}}=${p}\\implies x_p=${a}+${p}\\cdot${width}=${xp}$.`,
        },
      ],
    };
  },
});

const continuousCdfTemplate = generatedQuestion({
  id: 'ch03-gen-continuous-cdf',

  chapter: 'random-variables',

  topic: 'Continuous distributions',

  difficulty: 'hard',

  generate: (rng) => {
    const b = rng.int(3, 6); // >= 3 so two distinct interior integers exist

    const m = rng.int(1, b - 1);

    const p = rng.int(1, b - 2);

    const q = rng.int(p + 1, b - 1); // p < q < b keeps the interval strictly inside the support

    const c = round(2 / b ** 2, 5);

    const cdfAtM = round(m ** 2 / b ** 2, 4);

    const between = round((q ** 2 - p ** 2) / b ** 2, 4);

    return {
      prompt:
        `A continuous random variable $X$ has density $f(x)=cx$ for $0<x<${b}$ and $f(x)=0$ elsewhere. ` +
        `Find $c$, evaluate the cumulative distribution function at $F(${m})$, and use $F$ to find ` +
        `$P(${p}<X<${q})$.`,

      params: { b, m, p, q },

      parts: [
        { kind: 'numeric', label: 'c', answer: c, tol: 0.0005 },

        { kind: 'numeric', label: `F(${m})`, answer: cdfAtM, tol: 0.0005 },

        { kind: 'numeric', label: `P(${p} < X < ${q})`, answer: between, tol: 0.0005 },
      ],

      solution: [
        {
          text: `$\\displaystyle\\int_0^{${b}} cx\\,dx=\\dfrac{c\\cdot${b ** 2}}{2}=1$, so $c=\\dfrac{2}{${b ** 2}}\\approx${c}$.`,
        },

        {
          text: `$F(x)=\\displaystyle\\int_0^{x} ct\\,dt=\\dfrac{x^2}{${b ** 2}}$ on $[0,${b}]$, so $F(${m})=\\dfrac{${m ** 2}}{${b ** 2}}\\approx${cdfAtM}$.`,
        },

        {
          text: `$P(${p}<X<${q})=F(${q})-F(${p})=\\dfrac{${q ** 2}-${p ** 2}}{${b ** 2}}\\approx${between}$.`,
        },

        {
          text: `Differentiating back recovers the density: $\\dfrac{d}{dx}\\dfrac{x^2}{${b ** 2}}=\\dfrac{2x}{${b ** 2}}=cx$.`,
        },
      ],
    };
  },
});

const urnMassFunctionTemplate = generatedQuestion({
  id: 'ch03-gen-urn-mass-function',

  chapter: 'random-variables',

  topic: 'Random variables',

  difficulty: 'hard',

  generate: (rng) => {
    // N >= 8, R in [2,4] and n in [2,3]: since R <= 4 forces the good count
    // W = N - R >= 4, and n <= 3 <= W always, f(0) is guaranteed positive --
    // no draw can leave the "no defectives" case with zero probability, so
    // every part below is well-posed without rejection sampling.
    const N = rng.int(8, 10);

    const R = rng.int(2, 4);

    const W = N - R;

    const n = rng.int(2, 3);

    const xMax = Math.min(R, n);

    const f0 = round(nCr(W, n) / nCr(N, n), 4);

    const fMax = round((nCr(R, xMax) * nCr(W, n - xMax)) / nCr(N, n), 4);

    const atLeastOne = round(1 - f0, 4);

    return {
      prompt:
        `A box contains ${N} similar resistors, of which ${R} are defective. A random sample of ${n} ` +
        `resistors is drawn without replacement. Let $X$ be the number of defective resistors in the ` +
        `sample. Derive $f(0)$ and $f(${xMax})$ directly from the counting rule (do not assume a table), ` +
        `and then find $P(X\\ge1)$.`,

      params: { N, R, n },

      parts: [
        { kind: 'numeric', label: 'f(0)', answer: f0, tol: 0.0005 },

        { kind: 'numeric', label: `f(${xMax})`, answer: fMax, tol: 0.0005 },

        { kind: 'numeric', label: 'P(X >= 1)', answer: atLeastOne, tol: 0.0005 },
      ],

      solution: [
        {
          text: `The sample space of $\\binom{${N}}{${n}}=${nCr(N, n)}$ equally likely samples has to be counted from the experiment, not read off a supplied table.`,
        },

        {
          text: `$X=0$ means all ${n} resistors come from the $${W}$ good ones: $f(0)=\\dfrac{\\binom{${R}}{0}\\binom{${W}}{${n}}}{\\binom{${N}}{${n}}}=\\dfrac{${nCr(W, n)}}{${nCr(N, n)}}\\approx${f0}$.`,
        },

        {
          text: `$X=${xMax}$ is the largest count possible here — either all defectives are used (if $${R}\\le${n}$) or the sample is full of defectives (if $${n}\\le${R}$): $f(${xMax})=\\dfrac{\\binom{${R}}{${xMax}}\\binom{${W}}{${n - xMax}}}{\\binom{${N}}{${n}}}=\\dfrac{${nCr(R, xMax) * nCr(W, n - xMax)}}{${nCr(N, n)}}\\approx${fMax}$.`,
        },

        {
          text: `$P(X\\ge1)$ is the complement of $f(0)$, cheaper than summing every other value: $1-${f0}\\approx${atLeastOne}$.`,
        },
      ],
    };
  },
});

const piecewiseDensityTemplate = generatedQuestion({
  id: 'ch03-gen-piecewise-density',

  chapter: 'random-variables',

  topic: 'Continuous distributions',

  difficulty: 'hard',

  generate: (rng) => {
    const a = rng.int(2, 4);

    const m1 = rng.int(1, a - 1); // strictly inside the rising piece (0, a)

    const m2 = rng.int(a + 1, 2 * a - 1); // strictly inside the falling piece (a, 2a)

    // f(x) = x/a^2 on (0,a), f(x) = (2a-x)/a^2 on (a,2a): each piece is a
    // right triangle of base a and height 1/a, so the two areas are 1/2
    // each and the total is exactly 1 for every a -- c = 1/a^2 always
    // normalises correctly, no solving needed at draw time.
    const c = round(1 / a ** 2, 5);

    // Splitting P(m1 < X < m2) at the peak x = a: the rising piece from m1
    // to a, plus the falling piece from a to m2.
    const risingPiece = (c * (a * a - m1 * m1)) / 2;

    const fallingPiece = c * (2 * a * m2 - (m2 * m2) / 2 - (2 * a * a - (a * a) / 2));

    const answer = round(risingPiece + fallingPiece, 4);

    return {
      prompt:
        `A continuous random variable $X$ has density $f(x)=\\dfrac{x}{${a}^2}$ for $0<x<${a}$, ` +
        `$f(x)=\\dfrac{2\\cdot${a}-x}{${a}^2}$ for $${a}<x<2\\cdot${a}$, and $f(x)=0$ elsewhere. Verify the ` +
        `constant of proportionality is $c=\\dfrac{1}{${a}^2}$, and find $P(${m1}<X<${m2})$.`,

      params: { a, m1, m2 },

      parts: [
        { kind: 'numeric', label: 'c', answer: c, tol: 0.0005 },

        { kind: 'numeric', label: `P(${m1} < X < ${m2})`, answer, tol: 0.0005 },
      ],

      solution: [
        {
          text: `Each piece is a triangle of base ${a} and peak height $${a}/${a}^2=1/${a}$, so each has area $\\tfrac12$; the two pieces together give total area $1$ for any $c=1/${a}^2$ — that is what makes $f$ a density.`,
        },

        {
          text: `$${m1}<${a}<${m2}$, so the interval straddles the peak. Split the integral at $x=${a}$: $P(${m1}<X<${m2})=\\displaystyle\\int_{${m1}}^{${a}}\\dfrac{x}{${a}^2}\\,dx+\\int_{${a}}^{${m2}}\\dfrac{2\\cdot${a}-x}{${a}^2}\\,dx$.`,
        },

        {
          text: `The rising piece contributes $\\dfrac{${a}^2-${m1}^2}{2\\cdot${a}^2}\\approx${round(risingPiece, 4)}$.`,
        },

        {
          text: `The falling piece contributes $\\approx${round(fallingPiece, 4)}$, so the total is $P(${m1}<X<${m2})\\approx${answer}$.`,
        },
      ],
    };
  },
});

export const ch03Generators: QuestionTemplate[] = [
  sampleSpaceValuesTemplate,

  classifyDiscreteContinuousTemplate,

  geometricWaitingTemplate,

  pmfConstantTemplate,

  validPmfCheckTemplate,

  cacheHitBinomialTemplate,

  hypergeometricPmfTemplate,

  discreteCdfTemplate,

  cdfToPmfTemplate,

  densityConstantTemplate,

  validDensityCheckTemplate,

  densityIntervalTemplate,

  latencyCdfInverseTemplate,

  continuousCdfTemplate,

  urnMassFunctionTemplate,

  piecewiseDensityTemplate,

  // Section 3.4 lives in its own file -- same chapter, same export.
  ...ch03JointGenerators,
];
