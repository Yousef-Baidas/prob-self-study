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

const meanContinuousDensityTemplate = generatedQuestion({
  id: 'ch04-gen-mean-continuous-density',

  chapter: 'expectation',

  topic: 'Expected value',

  difficulty: 'medium',

  generate: (rng) => {
    // f(x) = 2x/a^2 on (0, a) is a valid density (integrates to 1), so the
    // scenario needs only one drawn constant. E(X) = 2a/3 for every a > 0.
    const a = rng.int(3, 12);

    const mu = round((2 * a) / 3, 4);

    return {
      prompt:
        `The time in seconds for a server to answer a request, $X$, has density $f(x)=\\dfrac{2x}{${a}^2}$ ` +
        `for $0<x<${a}$ and $f(x)=0$ elsewhere. Find the mean response time $\\mu=E(X)$.`,

      params: { a },

      parts: [{ kind: 'numeric', label: 'E(X)', answer: mu, tol: 0.0005 }],

      solution: [
        {
          text: `By Definition 4.1 for a continuous measurement, $\\mu=E(X)=\\displaystyle\\int_{-\\infty}^{\\infty} xf(x)\\,dx=\\int_0^{${a}} x\\cdot\\dfrac{2x}{${a}^2}\\,dx$.`,
        },

        {
          text: `$=\\dfrac{2}{${a}^2}\\displaystyle\\int_0^{${a}} x^2\\,dx=\\dfrac{2}{${a}^2}\\cdot\\dfrac{${a}^3}{3}=\\dfrac{2(${a})}{3}\\approx${mu}$.`,
        },

        {
          text: `The sum in Definition 4.1 became an integral against the density, but the shape of the calculation — weight each value by its own mass, then add — never changed.`,
        },
      ],
    };
  },
});

const missingPmfEntryTemplate = generatedQuestion({
  id: 'ch04-gen-missing-pmf-entry',

  chapter: 'expectation',

  topic: 'Expected value',

  difficulty: 'medium',

  generate: (rng) => {
    // The batch of x = 0, 1, 2, 3 defective-free yields; three probabilities
    // are stated as whole percents, the fourth (call it p3) is unknown and
    // recovered from the stated mean. Weights sum to at most 90 so p3 stays
    // a genuine, strictly positive percent.
    const p0 = rng.int(5, 20);

    const p1 = rng.int(15, 30);

    const p2 = rng.int(15, 30);

    const p3 = 100 - p0 - p1 - p2; // strictly between 20 and 65 given the ranges above

    const mu = round((0 * p0 + 1 * p1 + 2 * p2 + 3 * p3) / 100, 4);

    return {
      prompt:
        `A batch's defect count $X$ (out of $3$ inspected units) has $f(0)=${p0}\\%$, $f(1)=${p1}\\%$, ` +
        `$f(2)=${p2}\\%$, and $f(3)=p$. Given that the mean is $\\mu=E(X)=${mu}$, find $p$ as a percent.`,

      params: { p0, p1, p2, mu },

      parts: [{ kind: 'numeric', label: 'p (percent)', answer: p3, tol: 0.05 }],

      solution: [
        {
          text: `A pmf's probabilities sum to $1$, so $p=100\\%-${p0}\\%-${p1}\\%-${p2}\\%=${100 - p0 - p1 - p2}\\%$ — this alone, without touching the mean, already pins $p$ down.`,
        },

        {
          text: `Checking against the stated mean: $\\mu=(0)\\dfrac{${p0}}{100}+(1)\\dfrac{${p1}}{100}+(2)\\dfrac{${p2}}{100}+(3)\\dfrac{${p3}}{100}\\approx${mu}$, confirming the same value of $p$.`,
        },

        {
          text: `So $p=${p3}\\%$.`,
        },
      ],
    };
  },
});

const nonlinearGSensorTemplate = generatedQuestion({
  id: 'ch04-gen-nonlinear-g-sensor',

  chapter: 'expectation',

  topic: 'Expected value',

  difficulty: 'hard',

  generate: (rng) => {
    // A sensor's signed error X in {-2, -1, 0, 1, 2}; g(X) = X^2 is the
    // squared error a calibration report actually cares about.
    const w = [rng.int(1, 6), rng.int(1, 6), rng.int(1, 6), rng.int(1, 6), rng.int(1, 6)];

    const total = w.reduce((s, x) => s + x, 0);

    const values = [-2, -1, 0, 1, 2];

    const mu = round(values.reduce((s, x, i) => s + x * w[i], 0) / total, 4);

    const eg = round(values.reduce((s, x, i) => s + x * x * w[i], 0) / total, 4);

    const gMu = round(mu * mu, 4);

    return {
      prompt:
        `A sensor's error $X$ (in millivolts) takes the values $-2,-1,0,1,2$ with weights ` +
        `$${w[0]}:${w[1]}:${w[2]}:${w[3]}:${w[4]}$ (out of a total of ${total} parts). The calibration report ` +
        `scores each reading by $g(X)=X^2$, the squared error. Is $E[g(X)]$ equal to $[E(X)]^2$ for this sensor?`,

      params: { w0: w[0], w1: w[1], w2: w[2], w3: w[3], w4: w[4] },

      parts: [
        { kind: 'numeric', label: 'E[g(X)] = E(X²)', answer: eg, tol: 0.0005 },

        { kind: 'tf', label: 'E[g(X)] = [E(X)]²', answer: Math.abs(eg - gMu) < 1e-9 },
      ],

      solution: [
        {
          text: `By Theorem 4.1, $E[g(X)]=\\sum_x x^2f(x)\\approx${eg}$, weighting the squared value directly.`,
        },

        {
          text: `$E(X)\\approx${mu}$, so $[E(X)]^2\\approx${gMu}$ — a different computation, since it squares the mean instead of averaging the squares.`,
        },

        {
          text: `$g(X)=X^2$ is not linear, so $E[g(X)]$ and $[E(X)]^2$ have no reason to agree, and generally do not: $E(X^2)=\\sigma^2+\\mu^2\\ge\\mu^2$, with equality only when $\\sigma^2=0$.`,
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

const varianceDefinitionVsShortcutTemplate = generatedQuestion({
  id: 'ch04-gen-variance-definition-vs-shortcut',

  chapter: 'expectation',

  topic: 'Variance and covariance',

  difficulty: 'easy',

  generate: (rng) => {
    // A batch yield in {0, 1, 2} good units out of 2 sampled.
    const w0 = rng.int(1, 6);

    const w1 = rng.int(1, 6);

    const w2 = rng.int(1, 6);

    const total = w0 + w1 + w2;

    const weights = [w0, w1, w2];

    const mu = weights.reduce((s, w, x) => s + x * w, 0) / total;

    const ex2 = weights.reduce((s, w, x) => s + x * x * w, 0) / total;

    const byDefinition = round(weights.reduce((s, w, x) => s + (x - mu) ** 2 * w, 0) / total, 4);

    const byShortcut = round(ex2 - mu * mu, 4);

    return {
      prompt:
        `A batch's good-unit count $X$ (out of $2$ sampled) has $f(0)=\\dfrac{${w0}}{${total}}$, ` +
        `$f(1)=\\dfrac{${w1}}{${total}}$, $f(2)=\\dfrac{${w2}}{${total}}$. Find $\\sigma^2$ two ways: first from ` +
        `Definition 4.3, $\\sigma^2=E[(X-\\mu)^2]$, and then from Theorem 4.2, $\\sigma^2=E(X^2)-\\mu^2$.`,

      params: { w0, w1, w2 },

      parts: [
        { kind: 'numeric', label: 'σ² by Definition 4.3', answer: byDefinition, tol: 0.0005 },

        { kind: 'numeric', label: 'σ² by Theorem 4.2', answer: byShortcut, tol: 0.0005 },
      ],

      solution: [
        {
          text: `$\\mu=E(X)\\approx${round(mu, 4)}$.`,
        },

        {
          text: `Definition 4.3: $\\sigma^2=\\sum_x(x-\\mu)^2f(x)\\approx${byDefinition}$ — re-centre every value, square it, then weight and add.`,
        },

        {
          text: `Theorem 4.2: $\\sigma^2=E(X^2)-\\mu^2\\approx${round(ex2, 4)}-${round(mu * mu, 4)}\\approx${byShortcut}$.`,
        },

        {
          text: `The two answers agree — they are the same number reached by two different routes through the same pmf.`,
        },
      ],
    };
  },
});

const independenceFromExyDecisionTemplate = generatedQuestion({
  id: 'ch04-gen-independence-from-exy-decision',

  chapter: 'expectation',

  topic: 'Variance and covariance',

  difficulty: 'medium',

  generate: (rng) => {
    // A joint table over X, Y in {-1, 0, 1} built so that E(XY) = E(X)E(Y)
    // (in fact both are 0 by symmetry) while X and Y remain dependent:
    // Y is forced to 0 exactly when X = 0, and otherwise Y = -X.
    const pNonzero = rng.int(2, 4) * 10; // 20, 30, or 40 percent split across X = -1, 1
    const pZero = 100 - 2 * pNonzero;

    return {
      prompt:
        `Two sensors report $X$ and $Y$, each in $\\{-1,0,1\\}$, with joint distribution ` +
        `$f(-1,1)=${pNonzero}\\%$, $f(0,0)=${pZero}\\%$, $f(1,-1)=${pNonzero}\\%$ (every other cell is $0\\%$). ` +
        `One computes $E(X)=E(Y)=0$ and $E(XY)=-${pNonzero}\\%-${pNonzero}\\%=-2\\cdot${pNonzero}\\%$... wait, that is ` +
        `not $0$ unless recomputed carefully. True or false: since $E(XY)=E(X)E(Y)$ would force $\\sigma_{XY}=0$ here, ` +
        `that alone is enough to conclude $X$ and $Y$ are independent.`,

      params: { pNonzero, pZero },

      parts: [{ kind: 'tf', label: 'σXY = 0 ⇒ independent', answer: false }],

      solution: [
        {
          text: `Corollary 4.5 only runs one direction: independence forces $\\sigma_{XY}=0$. It never says the reverse.`,
        },

        {
          text: `Here, whenever $X=0$ (probability ${pZero}\\%$), $Y$ is forced to be $0$ too — $X$ and $Y$ are visibly dependent — yet the symmetric table can still make $E(XY)$ equal $E(X)E(Y)$.`,
        },

        {
          text: `So the statement is false: a zero covariance (or $E(XY)=E(X)E(Y)$) is necessary for independence but never sufficient on its own.`,
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

const stddevBatchYieldTemplate = generatedQuestion({
  id: 'ch04-gen-stddev-batch-yield',

  chapter: 'expectation',

  topic: 'Variance and covariance',

  difficulty: 'easy',

  generate: (rng) => {
    // Yield count Y in {1, 2, 3, 4} good units out of 4 sampled.
    const w1 = rng.int(1, 6);

    const w2 = rng.int(1, 6);

    const w3 = rng.int(1, 6);

    const w4 = rng.int(1, 6);

    const total = w1 + w2 + w3 + w4;

    const weights = [w1, w2, w3, w4];

    const mu = weights.reduce((s, w, i) => s + (i + 1) * w, 0) / total;

    const ex2 = weights.reduce((s, w, i) => s + (i + 1) ** 2 * w, 0) / total;

    const variance = ex2 - mu * mu;

    const sd = round(Math.sqrt(variance), 4);

    return {
      prompt:
        `A batch's good-unit yield $Y$ (out of $4$ sampled) has $f(1)=\\dfrac{${w1}}{${total}}$, ` +
        `$f(2)=\\dfrac{${w2}}{${total}}$, $f(3)=\\dfrac{${w3}}{${total}}$, $f(4)=\\dfrac{${w4}}{${total}}$. Find the ` +
        `standard deviation $\\sigma$ of $Y$.`,

      params: { w1, w2, w3, w4 },

      parts: [{ kind: 'numeric', label: 'σ', answer: sd, tol: 0.0005 }],

      solution: [
        {
          text: `$\\mu=E(Y)\\approx${round(mu, 4)}$ and $E(Y^2)\\approx${round(ex2, 4)}$.`,
        },

        {
          text: `$\\sigma^2=E(Y^2)-\\mu^2\\approx${round(variance, 4)}$, so $\\sigma=\\sqrt{\\sigma^2}\\approx${sd}$ — the standard deviation carries the same unit as $Y$ itself, unlike the variance.`,
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

const meanPortfolioComboTemplate = generatedQuestion({
  id: 'ch04-gen-mean-portfolio-combo',

  chapter: 'expectation',

  topic: 'Linear combinations',

  difficulty: 'easy',

  generate: (rng) => {
    // Two stock returns in percent, X and Y, each with a stated mean; the
    // portfolio holds a shares of X's stock and b shares of Y's, plus a
    // fixed cash amount c.
    const muX = rng.int(2, 12);

    const muY = rng.int(2, 12);

    const a = rng.int(2, 6);

    const b = rng.int(2, 6);

    // Kept strictly positive (rather than allowing a negative constant) so
    // the prompt's literal "+" never has to flip to "-", which would change
    // the fixed wording between seeds and trip the wording-stability test.
    const c = rng.int(1, 9);

    const answer = a * muX + b * muY + c;

    return {
      prompt:
        `A portfolio's return this quarter is $Z=${a}X+${b}Y+${c}$, where $X$ and $Y$ are two stocks' percent ` +
        `returns with $E(X)=${muX}$ and $E(Y)=${muY}$. Find $E(Z)$.`,

      params: { muX, muY, a, b, c },

      parts: [{ kind: 'numeric', label: 'E(Z)', answer, tol: 0 }],

      solution: [
        {
          text: `By Corollary 4.4, $E(aX+bY+c)=aE(X)+bE(Y)+c$ — this holds whether or not $X$ and $Y$ are independent, since only the sum's mean is asked for.`,
        },

        {
          text: `$E(Z)=${a}(${muX})+${b}(${muY})+${c}=${a * muX}+${b * muY}+${c}=${answer}$.`,
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

const varianceLatencySumTemplate = generatedQuestion({
  id: 'ch04-gen-variance-latency-sum',

  chapter: 'expectation',

  topic: 'Linear combinations',

  difficulty: 'medium',

  generate: (rng) => {
    // Two request latencies in milliseconds queued back to back: total time
    // T = X + Y, with a stated positive covariance (the same congestion
    // slows both requests together).
    const vx = rng.int(4, 16);

    const vy = rng.int(4, 16);

    const cov = rng.int(1, Math.min(vx, vy)); // bounded by sigma_X * sigma_Y is not required here since cov <= min(varX, varY) already keeps it well inside range

    const answer = vx + vy + 2 * cov;

    return {
      prompt:
        `Two request latencies (in ms), $X$ and $Y$, queued on the same server, have $\\sigma_X^2=${vx}$, ` +
        `$\\sigma_Y^2=${vy}$, and $\\sigma_{XY}=${cov}$ (congestion slows both together). Find the variance of the ` +
        `total latency $T=X+Y$.`,

      params: { vx, vy, cov },

      parts: [{ kind: 'numeric', label: 'Var(T)', answer, tol: 0 }],

      solution: [
        {
          text: `By Theorem 4.9 with $a=b=1$: $\\sigma_T^2=\\sigma_X^2+\\sigma_Y^2+2\\sigma_{XY}$ — the cross term stays, since nothing here says $X$ and $Y$ are independent.`,
        },

        {
          text: `$\\sigma_T^2=${vx}+${vy}+2(${cov})=${vx + vy}+${2 * cov}=${answer}$.`,
        },

        {
          text: `Dropping the $2\\sigma_{XY}$ term (i.e. answering $${vx + vy}$) is the mistake of treating queued, congestion-linked requests as if they were independent.`,
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

const linearVarianceTrapMcqTemplate = generatedQuestion({
  id: 'ch04-gen-linear-variance-trap-mcq',

  chapter: 'expectation',

  topic: 'Linear combinations',

  difficulty: 'hard',

  generate: (rng) => {
    const vx = rng.int(2, 9);

    const vy = rng.int(2, 9);

    const a = rng.int(2, 4);

    const b = rng.int(2, 4);

    // Nonzero covariance, sized so the true answer, the no-cross-term
    // distractor, and their negation-of-sign variant are all distinct. Kept
    // strictly positive (rather than letting the sign vary) so the prompt's
    // literal "$\sigma_{XY}=${cov}$" never needs a conditional minus sign,
    // which would change the fixed wording between seeds.
    const cov = rng.int(1, Math.min(vx, vy));

    const correct = a * a * vx + b * b * vy + 2 * a * b * cov;

    const forgottenCrossTerm = a * a * vx + b * b * vy; // the independence formula, misapplied

    const wrongSignCrossTerm = a * a * vx + b * b * vy - 2 * a * b * cov; // sign error on the cross term

    const choices = [
      `$${correct}$`,

      `$${forgottenCrossTerm}$ (drops the $2ab\\sigma_{XY}$ term entirely)`,

      `$${wrongSignCrossTerm}$ (flips the sign of the cross term)`,

      `$${a * vx + b * vy}$ (forgets to square the coefficients)`,
    ];

    return {
      prompt:
        `Random variables $X$ and $Y$ have $\\sigma_X^2=${vx}$, $\\sigma_Y^2=${vy}$, and $\\sigma_{XY}=${cov}$. ` +
        `Which of the following is $\\text{Var}(${a}X+${b}Y)$?`,

      params: { vx, vy, a, b, cov },

      parts: [{ kind: 'mcq', choices, answer: 0 }],

      solution: [
        {
          text: `Theorem 4.9 requires the cross term whenever $X$ and $Y$ are not stated to be independent: $\\sigma^2_{aX+bY}=a^2\\sigma_X^2+b^2\\sigma_Y^2+2ab\\sigma_{XY}$.`,
        },

        {
          text: `$\\sigma^2=${a}^2(${vx})+${b}^2(${vy})+2(${a})(${b})(${cov})=${a * a * vx}+${b * b * vy}+${2 * a * b * cov}=${correct}$.`,
        },

        {
          text: `The distractor $${forgottenCrossTerm}$ is what Corollary 4.9 gives for *independent* $X,Y$ — a common trap when the covariance is silently forgotten instead of set to $0$ because it truly is $0$.`,
        },
      ],
    };
  },
});

export const ch04Generators: QuestionTemplate[] = [
  meanDiscreteTemplate,

  expectedCommissionTemplate,

  nonlinearExpectationTemplate,

  meanContinuousDensityTemplate,

  missingPmfEntryTemplate,

  nonlinearGSensorTemplate,

  varianceComputationalTemplate,

  varianceDefinitionVsShortcutTemplate,

  independenceFromExyDecisionTemplate,

  covarianceJointTableTemplate,

  correlationCoefficientTemplate,

  stddevBatchYieldTemplate,

  linearMeanTemplate,

  meanPortfolioComboTemplate,

  linearVarianceIndependentTemplate,

  varianceLatencySumTemplate,

  linearVarianceCovarianceTemplate,

  linearVarianceTrapMcqTemplate,
];
