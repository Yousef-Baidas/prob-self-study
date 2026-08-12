import type { QuestionTemplate } from '../types';

import { generatedQuestion } from '../authoring';

import { round } from '../mathx';

const meanDiscreteTemplate = generatedQuestion({
  id: 'ch04-gen-mean-discrete',

  chapter: 'expectation',

  topic: 'Expected value',

  difficulty: 'easy',

  generate: (rng) => {
    // Weights are at least 1, so no value of X quietly carries probability 0.
    const w0 = rng.int(1, 8);

    const w1 = rng.int(1, 8);

    const w2 = rng.int(1, 8);

    const w3 = rng.int(1, 8);

    const total = w0 + w1 + w2 + w3;

    const weighted = 0 * w0 + 1 * w1 + 2 * w2 + 3 * w3;

    const mu = round(weighted / total, 4);

    return {
      prompt:
        `A discrete random variable $X$ takes the values $x=0,1,2,3$ with $f(0)=\\dfrac{${w0}}{${total}}$, ` +
        `$f(1)=\\dfrac{${w1}}{${total}}$, $f(2)=\\dfrac{${w2}}{${total}}$ and $f(3)=\\dfrac{${w3}}{${total}}$. ` +
        `Find the mean $\\mu=E(X)$.`,

      params: { w0, w1, w2, w3 },

      parts: [{ kind: 'numeric', label: 'E(X)', answer: mu, tol: 0.0005 }],

      solution: [
        {
          text: `By Definition 4.1, $\\mu=E(X)=\\sum_x xf(x)$ — multiply each value by its own probability and add.`,
        },

        {
          text: `$\\mu=(0)\\dfrac{${w0}}{${total}}+(1)\\dfrac{${w1}}{${total}}+(2)\\dfrac{${w2}}{${total}}+(3)\\dfrac{${w3}}{${total}}=\\dfrac{${weighted}}{${total}}\\approx${mu}$.`,
        },

        {
          text: `Nothing requires $\\mu$ to be a value $X$ can actually take — it is a long-run average, like a salary that no single paycheque equals.`,
        },
      ],
    };
  },
});

const expectedCommissionTemplate = generatedQuestion({
  id: 'ch04-gen-expected-commission',

  chapter: 'expectation',

  topic: 'Expected value',

  difficulty: 'easy',

  generate: (rng) => {
    const p1Percent = rng.int(2, 8) * 10; // 20..80, always a whole percent

    const p2Percent = rng.int(2, 8) * 10;

    const c1 = rng.int(1, 4) * 500; // 500..2000

    const c2 = rng.int(1, 4) * 500;

    const p1 = p1Percent / 100;

    const p2 = p2Percent / 100;

    const answer = round(c1 * p1 + c2 * p2, 2);

    return {
      prompt:
        `A salesperson has two independent appointments today. At the first, he believes there is a ` +
        `${p1Percent} percent chance of closing a deal worth ${c1} dollars in commission. At the second, he ` +
        `believes there is a ${p2Percent} percent chance of closing a deal worth ${c2} dollars in commission. ` +
        `Find his expected total commission for the day, in dollars.`,

      params: { p1Percent, p2Percent, c1, c2 },

      parts: [{ kind: 'numeric', label: 'Expected commission (dollars)', answer, tol: 0.01 }],

      solution: [
        {
          text: `The total commission $X$ takes four values: $0$, ${c1}, ${c2} and ${c1 + c2} dollars, with probabilities built from the two independent chances.`,
        },

        {
          text: `$E(X)=(${c1})(${p1})+(${c2})(${p2})$ — each deal's own commission weighted by its own chance, since expectation is linear even before the two appointments are combined into one table.`,
        },

        {
          text: `$E(X)\\approx${answer}$ dollars.`,
        },
      ],
    };
  },
});

const nonlinearExpectationTemplate = generatedQuestion({
  id: 'ch04-gen-nonlinear-expectation',

  chapter: 'expectation',

  topic: 'Expected value',

  difficulty: 'medium',

  generate: (rng) => {
    const w0 = rng.int(1, 8);

    const w1 = rng.int(1, 8);

    const w2 = rng.int(1, 8);

    const w3 = rng.int(1, 8);

    const total = w0 + w1 + w2 + w3;

    const c = rng.int(1, 2); // g(X) = (X - c)^2, c strictly inside the support

    const weights = [w0, w1, w2, w3];

    const mu = round(weights.reduce((s, w, x) => s + x * w, 0) / total, 4);

    const eg = round(weights.reduce((s, w, x) => s + (x - c) ** 2 * w, 0) / total, 4);

    return {
      prompt:
        `A discrete random variable $X$ takes the values $x=0,1,2,3$ with $f(0)=\\dfrac{${w0}}{${total}}$, ` +
        `$f(1)=\\dfrac{${w1}}{${total}}$, $f(2)=\\dfrac{${w2}}{${total}}$ and $f(3)=\\dfrac{${w3}}{${total}}$. ` +
        `Let $g(X)=(X-${c})^2$. Find $E(X)$ and $E[g(X)]$.`,

      params: { w0, w1, w2, w3, c },

      parts: [
        { kind: 'numeric', label: 'E(X)', answer: mu, tol: 0.0005 },

        { kind: 'numeric', label: 'E[g(X)]', answer: eg, tol: 0.0005 },
      ],

      solution: [
        {
          text: `$E(X)=\\sum_x xf(x)\\approx${mu}$, by Definition 4.1.`,
        },

        {
          text: `By Theorem 4.1, $E[g(X)]=\\sum_x g(x)f(x)=\\sum_x(x-${c})^2 f(x)$ — plug every value into $g$ first, then weight by its own probability.`,
        },

        {
          text: `$E[g(X)]\\approx${eg}$.`,
        },

        {
          text: `Compare with $g(E(X))=(\\mu-${c})^2\\approx${round((mu - c) ** 2, 4)}$ — a different number in general. $E[g(X)]\\neq g(E(X))$ unless $g$ happens to be linear.`,
        },
      ],
    };
  },
});

const varianceComputationalTemplate = generatedQuestion({
  id: 'ch04-gen-variance-computational',

  chapter: 'expectation',

  topic: 'Variance and covariance',

  difficulty: 'medium',

  generate: (rng) => {
    const w0 = rng.int(1, 9);

    const w1 = rng.int(1, 9);

    const w2 = rng.int(1, 9);

    const w3 = rng.int(1, 9);

    const total = w0 + w1 + w2 + w3;

    const weights = [w0, w1, w2, w3];

    const mu = weights.reduce((s, w, x) => s + x * w, 0) / total;

    const ex2 = weights.reduce((s, w, x) => s + x * x * w, 0) / total;

    const variance = round(ex2 - mu * mu, 4);

    return {
      prompt:
        `A discrete random variable $X$ takes the values $x=0,1,2,3$ with $f(0)=\\dfrac{${w0}}{${total}}$, ` +
        `$f(1)=\\dfrac{${w1}}{${total}}$, $f(2)=\\dfrac{${w2}}{${total}}$ and $f(3)=\\dfrac{${w3}}{${total}}$. Using ` +
        `$\\sigma^2=E(X^2)-\\mu^2$, find the variance of $X$.`,

      params: { w0, w1, w2, w3 },

      parts: [{ kind: 'numeric', label: 'Var(X)', answer: variance, tol: 0.0005 }],

      solution: [
        {
          text: `First $\\mu=E(X)=\\sum_x xf(x)\\approx${round(mu, 4)}$.`,
        },

        {
          text: `Then $E(X^2)=\\sum_x x^2f(x)\\approx${round(ex2, 4)}$.`,
        },

        {
          text: `By Theorem 4.2, $\\sigma^2=E(X^2)-\\mu^2\\approx${round(ex2, 4)}-${round(mu * mu, 4)}\\approx${variance}$ — usually less arithmetic than expanding $\\sum_x(x-\\mu)^2f(x)$ directly.`,
        },
      ],
    };
  },
});

const covarianceJointTableTemplate = generatedQuestion({
  id: 'ch04-gen-covariance-joint-table',

  chapter: 'expectation',

  topic: 'Variance and covariance',

  difficulty: 'medium',

  generate: (rng) => {
    const w00 = rng.int(1, 9);

    const w01 = rng.int(1, 9);

    const w10 = rng.int(1, 9);

    const w11 = rng.int(1, 9);

    const total = w00 + w01 + w10 + w11;

    const muX = (w10 + w11) / total; // P(X = 1), since X in {0, 1}

    const muY = (w01 + w11) / total; // P(Y = 1)

    const exy = w11 / total; // only (1,1) contributes to E(XY)

    const cov = round(exy - muX * muY, 4);

    return {
      prompt:
        `Two measurements $X$ and $Y$, each taking the values $0$ and $1$, have the joint distribution ` +
        `$f(0,0)=\\dfrac{${w00}}{${total}}$, $f(0,1)=\\dfrac{${w01}}{${total}}$, $f(1,0)=\\dfrac{${w10}}{${total}}$ ` +
        `and $f(1,1)=\\dfrac{${w11}}{${total}}$. Find the covariance $\\sigma_{XY}=E(XY)-\\mu_X\\mu_Y$.`,

      params: { w00, w01, w10, w11 },

      parts: [{ kind: 'numeric', label: 'σXY', answer: cov, tol: 0.0005 }],

      solution: [
        {
          text: `Since $X$ and $Y$ only take $0$ and $1$, $E(XY)$ only picks up the one cell where both equal $1$: $E(XY)=f(1,1)=\\dfrac{${w11}}{${total}}\\approx${round(exy, 4)}$.`,
        },

        {
          text: `$\\mu_X=P(X=1)=\\dfrac{${w10 + w11}}{${total}}\\approx${round(muX, 4)}$ and $\\mu_Y=P(Y=1)=\\dfrac{${w01 + w11}}{${total}}\\approx${round(muY, 4)}$.`,
        },

        {
          text: `By Theorem 4.4, $\\sigma_{XY}=E(XY)-\\mu_X\\mu_Y\\approx${round(exy, 4)}-${round(muX * muY, 4)}\\approx${cov}$.`,
        },
      ],
    };
  },
});

const correlationCoefficientTemplate = generatedQuestion({
  id: 'ch04-gen-correlation-coefficient',

  chapter: 'expectation',

  topic: 'Variance and covariance',

  difficulty: 'hard',

  generate: (rng) => {
    // Every weight at least 1 keeps both g(0), g(1), h(0), h(1) strictly
    // inside (0, 1), so both variances below are guaranteed positive and
    // dividing by sigma_X * sigma_Y never risks a zero denominator.
    const v00 = rng.int(1, 9);

    const v01 = rng.int(1, 9);

    const v10 = rng.int(1, 9);

    const v11 = rng.int(1, 9);

    const total = v00 + v01 + v10 + v11;

    const muX = (v10 + v11) / total;

    const muY = (v01 + v11) / total;

    const exy = v11 / total;

    const cov = exy - muX * muY;

    // X, Y in {0, 1}, so X^2 = X and Y^2 = Y: Var(X) = E(X) - E(X)^2.
    const varX = muX - muX * muX;

    const varY = muY - muY * muY;

    const rho = round(cov / Math.sqrt(varX * varY), 4);

    return {
      prompt:
        `Two measurements $X$ and $Y$, each taking the values $0$ and $1$, have the joint distribution ` +
        `$f(0,0)=\\dfrac{${v00}}{${total}}$, $f(0,1)=\\dfrac{${v01}}{${total}}$, $f(1,0)=\\dfrac{${v10}}{${total}}$ ` +
        `and $f(1,1)=\\dfrac{${v11}}{${total}}$. Find the correlation coefficient $\\rho_{XY}=\\sigma_{XY}/(\\sigma_X\\sigma_Y)$.`,

      params: { v00, v01, v10, v11 },

      parts: [{ kind: 'numeric', label: 'ρXY', answer: rho, tol: 0.001 }],

      solution: [
        {
          text: `Since $X,Y\\in\\{0,1\\}$, $X^2=X$ and $Y^2=Y$, so $\\sigma_X^2=E(X)-E(X)^2$ and likewise for $Y$ — no separate $E(X^2)$ calculation is needed here.`,
        },

        {
          text: `$\\mu_X\\approx${round(muX, 4)}$, $\\sigma_X^2\\approx${round(varX, 4)}$; $\\mu_Y\\approx${round(muY, 4)}$, $\\sigma_Y^2\\approx${round(varY, 4)}$.`,
        },

        {
          text: `$\\sigma_{XY}=E(XY)-\\mu_X\\mu_Y\\approx${round(cov, 4)}$.`,
        },

        {
          text: `$\\rho_{XY}=\\dfrac{\\sigma_{XY}}{\\sigma_X\\sigma_Y}\\approx${rho}$ — unit-free, and guaranteed to land in $[-1,1]$ regardless of how the table was drawn.`,
        },
      ],
    };
  },
});

const linearMeanTemplate = generatedQuestion({
  id: 'ch04-gen-linear-mean',

  chapter: 'expectation',

  topic: 'Linear combinations',

  difficulty: 'easy',

  generate: (rng) => {
    const w0 = rng.int(1, 9);

    const w1 = rng.int(1, 9);

    const w2 = rng.int(1, 9);

    const w3 = rng.int(1, 9);

    const total = w0 + w1 + w2 + w3;

    const weights = [w0, w1, w2, w3];

    const mu = round(weights.reduce((s, w, x) => s + x * w, 0) / total, 4);

    const a = rng.int(2, 5);

    const b = rng.int(1, 6);

    const transformed = round(a * mu + b, 4);

    return {
      prompt:
        `A discrete random variable $X$ takes the values $x=0,1,2,3$ with $f(0)=\\dfrac{${w0}}{${total}}$, ` +
        `$f(1)=\\dfrac{${w1}}{${total}}$, $f(2)=\\dfrac{${w2}}{${total}}$ and $f(3)=\\dfrac{${w3}}{${total}}$. Find ` +
        `$E(X)$, and then use $E(aX+b)=aE(X)+b$ to find $E(${a}X+${b})$.`,

      params: { w0, w1, w2, w3, a, b },

      parts: [
        { kind: 'numeric', label: 'E(X)', answer: mu, tol: 0.0005 },

        { kind: 'numeric', label: `E(${a}X + ${b})`, answer: transformed, tol: 0.0005 },
      ],

      solution: [
        {
          text: `$E(X)=\\sum_x xf(x)\\approx${mu}$.`,
        },

        {
          text: `By Theorem 4.5, a linear rescaling of $X$ rescales its mean the same way: $E(${a}X+${b})=${a}E(X)+${b}$, with no need to rebuild the whole distribution of $${a}X+${b}$.`,
        },

        {
          text: `$E(${a}X+${b})=${a}(${mu})+${b}\\approx${transformed}$.`,
        },
      ],
    };
  },
});

const linearVarianceIndependentTemplate = generatedQuestion({
  id: 'ch04-gen-linear-variance-independent',

  chapter: 'expectation',

  topic: 'Linear combinations',

  difficulty: 'medium',

  generate: (rng) => {
    const vx = rng.int(2, 9);

    const vy = rng.int(2, 9);

    const a = rng.int(2, 5);

    const b = rng.int(2, 5);

    const c = rng.int(1, 9);

    const answer = a * a * vx + b * b * vy;

    return {
      prompt:
        `Independent random variables $X$ and $Y$ have variances $\\sigma_X^2=${vx}$ and $\\sigma_Y^2=${vy}$. Find ` +
        `the variance of $Z=${a}X+${b}Y+${c}$.`,

      params: { vx, vy, a, b, c },

      parts: [{ kind: 'numeric', label: 'Var(Z)', answer, tol: 0 }],

      solution: [
        {
          text: `Adding the constant $${c}$ does not change the variance at all (Corollary 4.7), so only the $${a}X+${b}Y$ part matters.`,
        },

        {
          text: `Because $X$ and $Y$ are independent, $\\sigma_{XY}=0$, and Theorem 4.9 collapses to Corollary 4.9: $\\sigma_Z^2=${a}^2\\sigma_X^2+${b}^2\\sigma_Y^2$.`,
        },

        {
          text: `$\\sigma_Z^2=(${a * a})(${vx})+(${b * b})(${vy})=${answer}$.`,
        },
      ],
    };
  },
});

const linearVarianceCovarianceTemplate = generatedQuestion({
  id: 'ch04-gen-linear-variance-covariance',

  chapter: 'expectation',

  topic: 'Linear combinations',

  difficulty: 'hard',

  generate: (rng) => {
    const sx = rng.int(2, 4);

    const sy = rng.int(2, 4);

    const vx = sx * sx;

    const vy = sy * sy;

    // |covariance| can never exceed sigma_X * sigma_Y (Definition 4.5's ratio
    // stays within [-1, 1]), so this is the largest magnitude a real
    // covariance could take for these two standard deviations.
    const absCov = rng.int(1, sx * sy);

    const a = rng.int(2, 5);

    const b = rng.int(2, 5);

    const c = rng.int(1, 9);

    // Z = aX - bY + c, so Cov(aX, -bY) = -ab*cov, and with cov negative this
    // term is a positive addition -- the variance below is a sum of three
    // nonnegative pieces, never at risk of coming out negative.
    const answer = a * a * vx + b * b * vy + 2 * a * b * absCov;

    return {
      prompt:
        `Random variables $X$ and $Y$ have standard deviations $\\sigma_X=${sx}$ and $\\sigma_Y=${sy}$, and ` +
        `covariance $\\sigma_{XY}=-${absCov}$. Find the variance of $Z=${a}X-${b}Y+${c}$.`,

      params: { sx, sy, absCov, a, b, c },

      parts: [{ kind: 'numeric', label: 'Var(Z)', answer, tol: 0 }],

      solution: [
        {
          text: `By Theorem 4.9 with $a=${a}$, $b=-${b}$: $\\sigma_Z^2=${a}^2\\sigma_X^2+${b}^2\\sigma_Y^2+2(${a})(-${b})\\sigma_{XY}$.`,
        },

        {
          text: `$\\sigma_X^2=${vx}$, $\\sigma_Y^2=${vy}$, and $2(${a})(-${b})(-${absCov})=${2 * a * b * absCov}$ — two negatives (the $-${b}$ coefficient and the negative covariance) multiply to a positive term.`,
        },

        {
          text: `$\\sigma_Z^2=${a * a * vx}+${b * b * vy}+${2 * a * b * absCov}=${answer}$.`,
        },
      ],
    };
  },
});

const chebyshevBoundTemplate = generatedQuestion({
  id: 'ch04-gen-chebyshev-bound',

  chapter: 'expectation',

  topic: "Chebyshev's theorem",

  difficulty: 'hard',

  generate: (rng) => {
    const mu = rng.int(10, 90);

    const sigma = rng.int(2, 9);

    const k = rng.pick([1.5, 2, 2.5, 3, 4]); // k > 1, so the bound is genuinely informative

    const lowerBound = round(1 - 1 / (k * k), 4);

    const upperBound = round(1 / (k * k), 4);

    return {
      prompt:
        `A random variable $X$ has mean $\\mu=${mu}$ and standard deviation $\\sigma=${sigma}$, with an unknown ` +
        `probability distribution. Using Chebyshev's theorem with $k=${k}$, find the guaranteed lower bound for ` +
        `$P(\\mu-k\\sigma<X<\\mu+k\\sigma)$ and the guaranteed upper bound for $P(|X-\\mu|\\ge k\\sigma)$.`,

      params: { mu, sigma, k },

      parts: [
        { kind: 'numeric', label: `P(μ − kσ < X < μ + kσ) ≥`, answer: lowerBound, tol: 0.0005 },

        { kind: 'numeric', label: 'P(|X − μ| ≥ kσ) ≤', answer: upperBound, tol: 0.0005 },
      ],

      solution: [
        {
          text: `Theorem 4.10 (Chebyshev) holds for *any* distribution: $P(\\mu-k\\sigma<X<\\mu+k\\sigma)\\ge1-\\dfrac{1}{k^2}$.`,
        },

        {
          text: `With $k=${k}$: $1-\\dfrac{1}{${k}^2}\\approx${lowerBound}$ — this is a floor, not the actual probability, which could be higher.`,
        },

        {
          text: `The complementary event has the mirror bound: $P(|X-\\mu|\\ge k\\sigma)\\le\\dfrac{1}{k^2}\\approx${upperBound}$.`,
        },

        {
          text: `Neither bound uses $\\mu=${mu}$ or $\\sigma=${sigma}$ directly — only $k$ matters, which is exactly why the theorem is called distribution-free.`,
        },
      ],
    };
  },
});

export const ch04Generators: QuestionTemplate[] = [
  meanDiscreteTemplate,

  expectedCommissionTemplate,

  nonlinearExpectationTemplate,

  varianceComputationalTemplate,

  covarianceJointTableTemplate,

  correlationCoefficientTemplate,

  linearMeanTemplate,

  linearVarianceIndependentTemplate,

  linearVarianceCovarianceTemplate,

  chebyshevBoundTemplate,
];
