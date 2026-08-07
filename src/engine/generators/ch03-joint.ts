import type { QuestionTemplate } from '../types';

import type { SeededRng } from '../rng';

import { generatedQuestion } from '../authoring';

import { round } from '../mathx';

/**
 * The 3x2 joint table shared by the discrete generators below: X takes 0, 1, 2
 * and Y takes 0, 1. Every cell weight is at least 1, so no marginal is zero and
 * no conditional divides by zero.
 */
type JointTable = {
  w: number[][]; // w[x][y]

  total: number;

  gx: number[]; // row totals -- the unnormalised marginal of X

  hy: number[]; // column totals -- the unnormalised marginal of Y
};

const tableFrom = (w: number[][]): JointTable => ({
  w,

  total: w.flat().reduce((s, v) => s + v, 0),

  gx: w.map((row) => row[0] + row[1]),

  hy: [w[0][0] + w[1][0] + w[2][0], w[0][1] + w[1][1] + w[2][1]],
});

const drawJointTable = (rng: SeededRng): JointTable =>
  tableFrom([
    [rng.int(1, 6), rng.int(1, 6)],

    [rng.int(1, 6), rng.int(1, 6)],

    [rng.int(1, 6), rng.int(1, 6)],
  ]);

/** The joint table as a KaTeX array, so marginals read as row and column totals. */
const tableMath = ({ w, total }: JointTable) =>
  `\\begin{array}{c|cc} f(x,y) & y=0 & y=1 \\\\ \\hline ` +
  `x=0 & \\frac{${w[0][0]}}{${total}} & \\frac{${w[0][1]}}{${total}} \\\\ ` +
  `x=1 & \\frac{${w[1][0]}}{${total}} & \\frac{${w[1][1]}}{${total}} \\\\ ` +
  `x=2 & \\frac{${w[2][0]}}{${total}} & \\frac{${w[2][1]}}{${total}} \\end{array}`;

/** Flattened row-major, so tests can reshape without re-reading the prompt. */
const flatWeights = ({ w }: JointTable) => [w[0][0], w[0][1], w[1][0], w[1][1], w[2][0], w[2][1]];

const jointPmfConstantTemplate = generatedQuestion({
  id: 'ch03-gen-joint-pmf-constant',

  chapter: 'random-variables',

  topic: 'Joint distributions',

  difficulty: 'easy',

  generate: (rng) => {
    // At least 4, so the range prints as "1, 2, ..., n" without the ellipsis
    // spanning nothing -- "y = 1, 2, ..., 2" is a legal range but reads as a typo.
    const n = rng.int(4, 7);

    // sum over x = 1,2 and y = 1..n of (x + y) = 3n + 2 * n(n+1)/2 = n(n + 4)
    const total = n * (n + 4);

    const c = round(1 / total, 5);

    const corner = round((2 + n) / total, 4);

    return {
      prompt:
        `Two discrete random variables $X$ and $Y$ have joint probability distribution ` +
        `$f(x,y)=c(x+y)$ for $x=1,2$ and $y=1,2,\\dots,${n}$, and $f(x,y)=0$ elsewhere. Find the ` +
        `constant $c$, and then find $P(X=2,\\,Y=${n})$.`,

      params: { n },

      parts: [
        { kind: 'numeric', label: 'c', answer: c, tol: 0.0005 },

        { kind: 'numeric', label: `P(X = 2, Y = ${n})`, answer: corner, tol: 0.0005 },
      ],

      solution: [
        {
          text: `A joint pmf must satisfy $\\sum_x\\sum_y f(x,y)=1$, so sum $c(x+y)$ over both variables.`,
        },

        {
          text: `For each $y$ the two terms give $(1+y)+(2+y)=3+2y$, so the double sum is $c\\sum_{y=1}^{${n}}(3+2y)=c\\left(3\\cdot${n}+${n}(${n}+1)\\right)=c\\cdot${total}$.`,
        },

        {
          text: `Setting that to $1$ gives $c=\\dfrac{1}{${total}}\\approx${c}$.`,
        },

        {
          text: `Then $P(X=2,\\,Y=${n})=f(2,${n})=c(2+${n})=\\dfrac{${2 + n}}{${total}}\\approx${corner}$.`,
        },
      ],
    };
  },
});

const jointTableRegionTemplate = generatedQuestion({
  id: 'ch03-gen-joint-table-region',

  chapter: 'random-variables',

  topic: 'Joint distributions',

  difficulty: 'easy',

  generate: (rng) => {
    const t = drawJointTable(rng);

    const a = rng.int(0, 2);

    const b = rng.int(0, 1);

    const cell = round(t.w[a][b] / t.total, 4);

    // A = {(x, y) : x + y <= 1} picks out exactly (0,0), (0,1) and (1,0).
    const regionWeight = t.w[0][0] + t.w[0][1] + t.w[1][0];

    const region = round(regionWeight / t.total, 4);

    return {
      prompt:
        `The discrete random variables $X$ and $Y$ have the joint probability distribution ` +
        `$${tableMath(t)}$. Find $f(${a},${b})$ and $P[(X,Y)\\in A]$, where $A$ is the region ` +
        `$\\{(x,y)\\mid x+y\\le 1\\}$.`,

      params: { w: flatWeights(t), a, b },

      parts: [
        { kind: 'numeric', label: `f(${a}, ${b})`, answer: cell, tol: 0.0005 },

        { kind: 'numeric', label: 'P[(X, Y) in A]', answer: region, tol: 0.0005 },
      ],

      solution: [
        {
          text: `A joint pmf is read straight off the table: $f(${a},${b})=\\dfrac{${t.w[a][b]}}{${t.total}}\\approx${cell}$.`,
        },

        {
          text: `The region $x+y\\le1$ contains the pairs $(0,0)$, $(0,1)$ and $(1,0)$ — and no others, since every remaining pair has $x+y\\ge2$.`,
        },

        {
          text: `$P[(X,Y)\\in A]=f(0,0)+f(0,1)+f(1,0)=\\dfrac{${t.w[0][0]}+${t.w[0][1]}+${t.w[1][0]}}{${t.total}}=\\dfrac{${regionWeight}}{${t.total}}\\approx${region}$.`,
        },

        {
          text: `Probability over a region of the plane is just a sum of the cells inside it; the whole table sums to $\\dfrac{${t.total}}{${t.total}}=1$.`,
        },
      ],
    };
  },
});

const marginalDistributionTemplate = generatedQuestion({
  id: 'ch03-gen-marginal-distribution',

  chapter: 'random-variables',

  topic: 'Joint distributions',

  difficulty: 'medium',

  generate: (rng) => {
    const t = drawJointTable(rng);

    const a = rng.int(0, 2);

    const b = rng.int(0, 1);

    const g = round(t.gx[a] / t.total, 4);

    const h = round(t.hy[b] / t.total, 4);

    return {
      prompt:
        `The discrete random variables $X$ and $Y$ have the joint probability distribution ` +
        `$${tableMath(t)}$. Find the marginal distribution $g(${a})$ of $X$ and the marginal ` +
        `distribution $h(${b})$ of $Y$.`,

      params: { w: flatWeights(t), a, b },

      parts: [
        { kind: 'numeric', label: `g(${a})`, answer: g, tol: 0.0005 },

        { kind: 'numeric', label: `h(${b})`, answer: h, tol: 0.0005 },
      ],

      solution: [
        {
          text: `A marginal sums the other variable out: $g(x)=\\sum_y f(x,y)$ and $h(y)=\\sum_x f(x,y)$. In the table those are the row and column totals — which is where the name *marginal* comes from.`,
        },

        {
          text: `$g(${a})=f(${a},0)+f(${a},1)=\\dfrac{${t.w[a][0]}+${t.w[a][1]}}{${t.total}}=\\dfrac{${t.gx[a]}}{${t.total}}\\approx${g}$.`,
        },

        {
          text: `$h(${b})=f(0,${b})+f(1,${b})+f(2,${b})=\\dfrac{${t.w[0][b]}+${t.w[1][b]}+${t.w[2][b]}}{${t.total}}=\\dfrac{${t.hy[b]}}{${t.total}}\\approx${h}$.`,
        },

        {
          text: `Each marginal is itself a pmf: the three values of $g$ sum to $1$, and so do the two values of $h$.`,
        },
      ],
    };
  },
});

const conditionalDiscreteTemplate = generatedQuestion({
  id: 'ch03-gen-conditional-discrete',

  chapter: 'random-variables',

  topic: 'Joint distributions',

  difficulty: 'medium',

  generate: (rng) => {
    const t = drawJointTable(rng);

    const a = rng.int(0, 2);

    const b = rng.int(0, 1);

    const fXgivenY = round(t.w[a][b] / t.hy[b], 4);

    const fYgivenX = round(t.w[a][b] / t.gx[a], 4);

    return {
      prompt:
        `The discrete random variables $X$ and $Y$ have the joint probability distribution ` +
        `$${tableMath(t)}$. Find the conditional probability $f(${a}\\mid ${b})=P(X=${a}\\mid Y=${b})$, ` +
        `and then find $f(${b}\\mid ${a})=P(Y=${b}\\mid X=${a})$.`,

      params: { w: flatWeights(t), a, b },

      parts: [
        { kind: 'numeric', label: `f(${a} | ${b})`, answer: fXgivenY, tol: 0.0005 },

        { kind: 'numeric', label: `f(${b} | ${a})`, answer: fYgivenX, tol: 0.0005 },
      ],

      solution: [
        {
          text: `Conditioning divides the joint by the marginal of the variable being conditioned *on*: $f(x\\mid y)=\\dfrac{f(x,y)}{h(y)}$ and $f(y\\mid x)=\\dfrac{f(x,y)}{g(x)}$.`,
        },

        {
          text: `Conditioning on $Y=${b}$ uses the column total $h(${b})=\\dfrac{${t.hy[b]}}{${t.total}}$, so $f(${a}\\mid ${b})=\\dfrac{${t.w[a][b]}/${t.total}}{${t.hy[b]}/${t.total}}=\\dfrac{${t.w[a][b]}}{${t.hy[b]}}\\approx${fXgivenY}$.`,
        },

        {
          text: `Conditioning on $X=${a}$ uses the row total $g(${a})=\\dfrac{${t.gx[a]}}{${t.total}}$, so $f(${b}\\mid ${a})=\\dfrac{${t.w[a][b]}}{${t.gx[a]}}\\approx${fYgivenX}$.`,
        },

        {
          text: `The two differ: the numerator is the same cell, but the denominator is a different total. $f(x\\mid y)$ and $f(y\\mid x)$ are not interchangeable.`,
        },
      ],
    };
  },
});

const jointDensityConstantTemplate = generatedQuestion({
  id: 'ch03-gen-joint-density-constant',

  chapter: 'random-variables',

  topic: 'Joint distributions',

  difficulty: 'medium',

  generate: (rng) => {
    const A = rng.int(2, 4);

    const B = rng.int(2, 4);

    const p = rng.int(1, A - 1); // strictly inside the support in each coordinate,

    const q = rng.int(1, B - 1); // so the rectangle probability stays in (0, 1)

    // integral over the rectangle of c(x + y) is c * A*B*(A + B) / 2
    const denom = (A * B * (A + B)) / 2;

    const c = round(1 / denom, 5);

    const rect = round((p * q * (p + q)) / 2 / denom, 4);

    return {
      prompt:
        `The continuous random variables $X$ and $Y$ have joint density $f(x,y)=c(x+y)$ for ` +
        `$0<x<${A}$ and $0<y<${B}$, and $f(x,y)=0$ elsewhere. Find the constant $c$, and then find ` +
        `$P(0<X<${p},\\,0<Y<${q})$.`,

      params: { A, B, p, q },

      parts: [
        { kind: 'numeric', label: 'c', answer: c, tol: 0.0005 },

        { kind: 'numeric', label: `P(0 < X < ${p}, 0 < Y < ${q})`, answer: rect, tol: 0.0005 },
      ],

      solution: [
        {
          text: `A joint density must integrate to $1$ over the whole plane: $\\displaystyle\\int_0^{${B}}\\!\\!\\int_0^{${A}} c(x+y)\\,dx\\,dy=1$.`,
        },

        {
          text: `The inner integral is $c\\left(\\dfrac{${A ** 2}}{2}+${A}y\\right)$, and integrating that over $0<y<${B}$ gives $c\\cdot\\dfrac{${A}\\cdot${B}\\cdot(${A}+${B})}{2}=c\\cdot${denom}$.`,
        },

        {
          text: `So $c=\\dfrac{1}{${denom}}\\approx${c}$. As in the one-variable case, $c$ is a density and is not required to be below $1$.`,
        },

        {
          text: `The same integral over the smaller rectangle gives $P=c\\cdot\\dfrac{${p}\\cdot${q}\\cdot(${p}+${q})}{2}=\\dfrac{${(p * q * (p + q)) / 2}}{${denom}}\\approx${rect}$.`,
        },
      ],
    };
  },
});

const independenceCheckTemplate = generatedQuestion({
  id: 'ch03-gen-independence-check',

  chapter: 'random-variables',

  topic: 'Joint distributions',

  difficulty: 'hard',

  generate: (rng) => {
    // Start from a product table, which is exactly independent, then push one
    // cell up by delta. Writing R = sum(r) and C = sum(c), the discrepancy at
    // (0,0) works out to  T*w[0][0] - g(0)*h(0) = delta * (R - r0) * (C - c0),
    // which is strictly positive because the other rows and columns carry
    // weight. So dependence here is guaranteed by construction, not by luck.
    const r = [rng.int(1, 4), rng.int(1, 4), rng.int(1, 4)];

    const col = [rng.int(1, 4), rng.int(1, 4)];

    const delta = rng.int(1, 3);

    const t = tableFrom([
      [r[0] * col[0] + delta, r[0] * col[1]],

      [r[1] * col[0], r[1] * col[1]],

      [r[2] * col[0], r[2] * col[1]],
    ]);

    const joint = round(t.w[0][0] / t.total, 4);

    const product = round((t.gx[0] / t.total) * (t.hy[0] / t.total), 4);

    return {
      prompt:
        `The discrete random variables $X$ and $Y$ have the joint probability distribution ` +
        `$${tableMath(t)}$. To test whether $X$ and $Y$ are statistically independent, find $f(0,0)$ ` +
        `and find the product $g(0)\\,h(0)$ of the corresponding marginals.`,

      params: { w: flatWeights(t), r0: r[0], r1: r[1], r2: r[2], c0: col[0], c1: col[1], delta },

      parts: [
        { kind: 'numeric', label: 'f(0, 0)', answer: joint, tol: 0.0005 },

        { kind: 'numeric', label: 'g(0) h(0)', answer: product, tol: 0.0005 },
      ],

      solution: [
        {
          text: `$X$ and $Y$ are statistically independent exactly when $f(x,y)=g(x)h(y)$ at **every** point of their range. A single point where it fails settles the question.`,
        },

        {
          text: `From the table, $f(0,0)=\\dfrac{${t.w[0][0]}}{${t.total}}\\approx${joint}$.`,
        },

        {
          text: `The row total gives $g(0)=\\dfrac{${t.gx[0]}}{${t.total}}$ and the column total gives $h(0)=\\dfrac{${t.hy[0]}}{${t.total}}$, so $g(0)h(0)=\\dfrac{${t.gx[0]}\\cdot${t.hy[0]}}{${t.total}^2}\\approx${product}$.`,
        },

        {
          text: `The two numbers differ, so $f(0,0)\\neq g(0)h(0)$ and $X$ and $Y$ are **not** statistically independent. Note that finding a point where they *do* agree would prove nothing — independence is a claim about all points at once.`,
        },
      ],
    };
  },
});

const jointDensityMarginalTemplate = generatedQuestion({
  id: 'ch03-gen-joint-density-marginal',

  chapter: 'random-variables',

  topic: 'Joint distributions',

  difficulty: 'hard',

  generate: (rng) => {
    const A = rng.int(2, 4);

    const a = rng.int(2, 4);

    const x0 = rng.int(1, A - 1); // strictly inside 0 < x < A

    const y0 = round(rng.int(2, 8) / 10, 1); // strictly inside 0 < y < 1

    // integral of c*x*(1 + a*y^2) over the support is c * (A^2/2) * (1 + a/3)
    const c = round(6 / (A ** 2 * (3 + a)), 5);

    const g = round((2 * x0) / A ** 2, 4);

    const h = round((3 * (1 + a * y0 ** 2)) / (3 + a), 4);

    return {
      prompt:
        `The continuous random variables $X$ and $Y$ have joint density $f(x,y)=cx(1+${a}y^2)$ for ` +
        `$0<x<${A}$ and $0<y<1$, and $f(x,y)=0$ elsewhere. Find the constant $c$, then evaluate the ` +
        `marginal densities $g(${x0})$ and $h(${y0})$.`,

      params: { A, a, x0, y0 },

      parts: [
        { kind: 'numeric', label: 'c', answer: c, tol: 0.0005 },

        { kind: 'numeric', label: `g(${x0})`, answer: g, tol: 0.0005 },

        { kind: 'numeric', label: `h(${y0})`, answer: h, tol: 0.0005 },
      ],

      solution: [
        {
          text: `Normalise first: $\\displaystyle\\int_0^{1}\\!\\!\\int_0^{${A}} cx(1+${a}y^2)\\,dx\\,dy=c\\cdot\\dfrac{${A ** 2}}{2}\\cdot\\left(1+\\dfrac{${a}}{3}\\right)=c\\cdot\\dfrac{${A ** 2}(3+${a})}{6}=1$.`,
        },

        {
          text: `So $c=\\dfrac{6}{${A ** 2}\\cdot${3 + a}}\\approx${c}$.`,
        },

        {
          text: `$g(x)=\\displaystyle\\int_0^{1} cx(1+${a}y^2)\\,dy=cx\\left(1+\\dfrac{${a}}{3}\\right)=\\dfrac{2x}{${A ** 2}}$, so $g(${x0})=\\dfrac{${2 * x0}}{${A ** 2}}\\approx${g}$.`,
        },

        {
          text: `$h(y)=\\displaystyle\\int_0^{${A}} cx(1+${a}y^2)\\,dx=c\\dfrac{${A ** 2}}{2}(1+${a}y^2)=\\dfrac{3(1+${a}y^2)}{${3 + a}}$, so $h(${y0})\\approx${h}$.`,
        },

        {
          text: `Here $g(x)h(y)=\\dfrac{2x}{${A ** 2}}\\cdot\\dfrac{3(1+${a}y^2)}{${3 + a}}=cx(1+${a}y^2)=f(x,y)$, so these two variables **are** statistically independent — which is what a density factoring into a function of $x$ times a function of $y$ over a rectangular support always means.`,
        },
      ],
    };
  },
});

export const ch03JointGenerators: QuestionTemplate[] = [
  jointPmfConstantTemplate,

  jointTableRegionTemplate,

  marginalDistributionTemplate,

  conditionalDiscreteTemplate,

  jointDensityConstantTemplate,

  independenceCheckTemplate,

  jointDensityMarginalTemplate,
];
