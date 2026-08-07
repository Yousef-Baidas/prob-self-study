import type { QuestionTemplate } from '../types';

import { generatedQuestion } from '../authoring';

import { ch03JointGenerators } from './ch03-joint';

import { nCr, round } from '../mathx';

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

export const ch03Generators: QuestionTemplate[] = [
  sampleSpaceValuesTemplate,

  pmfConstantTemplate,

  hypergeometricPmfTemplate,

  discreteCdfTemplate,

  cdfToPmfTemplate,

  densityConstantTemplate,

  densityIntervalTemplate,

  continuousCdfTemplate,

  // Section 3.4 lives in its own file -- same chapter, same export.
  ...ch03JointGenerators,
];
