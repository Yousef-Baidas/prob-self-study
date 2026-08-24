import type { QuestionTemplate } from '../types';

import { bookQuestion } from '../authoring';

export const ch01Book: QuestionTemplate[] = [
  bookQuestion({
    id: 'ch01-book-classify',

    chapter: 'intro',

    topic: 'Types of data',

    difficulty: 'easy',

    citation: 'Walpole §1.1 (concept)',

    instance: {
      prompt: 'Which of the following is a **discrete quantitative** variable?',

      parts: [
        {
          kind: 'mcq',

          choices: [
            'The height of a student (cm)',

            'The number of defective items in a batch',

            'Eye colour',

            'The temperature of a reactor (°C)',
          ],

          answer: 1,
        },
      ],

      solution: [
        {
          text: 'Counts (number of defective items) are **discrete quantitative**. Height and temperature are continuous; eye colour is qualitative.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-sample-vs-pop',

    chapter: 'intro',

    topic: 'Populations and samples',

    difficulty: 'easy',

    citation: 'Walpole §1.2 (concept)',

    instance: {
      prompt:
        'True or false: a **statistic** is computed from a sample, while a **parameter** describes a population.',

      parts: [{ kind: 'tf', answer: true }],

      solution: [
        {
          text: 'True. A parameter (e.g. $\\mu$) describes the whole population; a statistic (e.g. $\\bar{x}$) is computed from a sample and estimates it.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-drying-time-size',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'easy',

    citation: 'Walpole Ex. 1.1(a)',

    instance: {
      prompt:
        'The drying time (hours) of a certain brand of latex paint was recorded for 15 specimens: **3.4, 2.5, 4.8, 2.9, 3.6, 2.8, 3.3, 5.6, 3.7, 2.8, 4.4, 4.0, 5.2, 3.0, 4.8**. What is the sample size?',

      parts: [{ kind: 'numeric', answer: 15, tol: 0 }],

      solution: [
        {
          text: 'Count the listed values: there are $15$ drying-time measurements, so $n=15$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-drying-time-mean-median',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'easy',

    citation: 'Walpole Ex. 1.1(b,c)',

    instance: {
      prompt:
        'For the drying-time data of Ex. 1.1 (**3.4, 2.5, 4.8, 2.9, 3.6, 2.8, 3.3, 5.6, 3.7, 2.8, 4.4, 4.0, 5.2, 3.0, 4.8**), find the sample mean and the sample median.',

      parts: [
        { kind: 'numeric', label: 'Mean', answer: 3.787, tol: 0.01 },

        { kind: 'numeric', label: 'Median', answer: 3.6, tol: 0.01 },
      ],

      solution: [
        {
          text: 'Mean $=\\dfrac{\\sum x_i}{15}=\\dfrac{56.8}{15}=3.787$.',
        },

        {
          text: 'Sorting the 15 values, the 8th (middle) value is the median: $\\tilde{x}=3.6$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-drying-time-trimmed20',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.1(e)',

    instance: {
      prompt:
        'For the drying-time data of Ex. 1.1, compute the $20\\%$ trimmed mean.',

      parts: [{ kind: 'numeric', answer: 3.678, tol: 0.01 }],

      solution: [
        {
          text: '$20\\%$ of $n=15$ is $3$, so drop the $3$ smallest and $3$ largest sorted values, leaving $9$, and average them.',
        },

        {
          text: '$\\bar{x}_{\\mathrm{tr}(20)}=3.678$, close to both the mean ($3.787$) and the median ($3.6$), indicating no strong outliers.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-fiber-absorbency-mean-median',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.2(a)',

    instance: {
      prompt:
        'A random sample of 20 pieces of cotton fiber gave the following water-absorbency values: **18.71, 21.41, 20.72, 21.81, 19.29, 22.43, 20.17, 23.71, 19.44, 20.50, 18.92, 20.33, 23.00, 22.85, 19.25, 21.77, 22.11, 19.77, 18.04, 21.12**. Find the sample mean and sample median.',

      parts: [
        { kind: 'numeric', label: 'Mean', answer: 20.77, tol: 0.02 },

        { kind: 'numeric', label: 'Median', answer: 20.61, tol: 0.02 },
      ],

      solution: [
        {
          text: 'Mean $=\\dfrac{\\sum x_i}{20}=20.77$.',
        },

        {
          text: 'Averaging the two middle sorted values gives the median, $\\tilde{x}=20.61$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-fiber-absorbency-trimmed10',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.2(b)',

    instance: {
      prompt:
        'For the water-absorbency data of Ex. 1.2, compute the $10\\%$ trimmed mean.',

      parts: [{ kind: 'numeric', answer: 20.74, tol: 0.02 }],

      solution: [
        {
          text: '$10\\%$ of $n=20$ is $2$, so drop the $2$ smallest and $2$ largest sorted values before averaging the remaining $16$.',
        },

        {
          text: '$\\bar{x}_{\\mathrm{tr}(10)}=20.74$ — very close to the mean and median, so there is no strong evidence of outliers.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-tensile-means',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.3(c)',

    instance: {
      prompt:
        'Twenty polymer specimens for aircraft evacuation systems were split into two groups of 10: no aging (**227, 222, 218, 217, 225, 218, 216, 229, 228, 221**) and an accelerated-aging batch (**219, 214, 215, 211, 209, 218, 203, 204, 201, 205**), both measured for tensile strength (psi). Find the sample mean of each group, and state whether aging appears to reduce tensile strength.',

      parts: [
        { kind: 'numeric', label: 'Mean, no aging', answer: 222.1, tol: 0.05 },

        { kind: 'numeric', label: 'Mean, aging', answer: 209.9, tol: 0.05 },

        {
          kind: 'tf',
          label: 'Aging reduced the mean tensile strength',
          answer: true,
        },
      ],

      solution: [
        {
          text: 'No aging: $\\bar{x}=222.10$ psi. Aging: $\\bar{x}=209.90$ psi.',
        },

        {
          text: 'The aged specimens average about $12$ psi lower, so the accelerated-aging process appears to have reduced tensile strength.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-tensile-medians',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.3(d)',

    instance: {
      prompt:
        'For the tensile-strength data of Ex. 1.3 (no aging: **227, 222, 218, 217, 225, 218, 216, 229, 228, 221**; aging: **219, 214, 215, 211, 209, 218, 203, 204, 201, 205**), find the sample median of each group.',

      parts: [
        {
          kind: 'numeric',
          label: 'Median, no aging',
          answer: 221.5,
          tol: 0.05,
        },

        { kind: 'numeric', label: 'Median, aging', answer: 210, tol: 0.05 },
      ],

      solution: [
        {
          text: 'No aging: average the two middle sorted values, $\\tilde{x}=221.5$.',
        },

        {
          text: "Aging: average the two middle sorted values, $\\tilde{x}=210.0$ — close to that group's mean of $209.9$, so mean and median tell a consistent story here.",
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-flexibility-company-a',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'easy',

    citation: 'Walpole Ex. 1.4(a) — Company A',

    instance: {
      prompt:
        'Ten steel-rod springs from Company A were tested for flexibility: **9.3, 8.8, 6.8, 8.7, 8.5, 6.7, 8.0, 6.5, 9.2, 7.0**. Find the sample mean and median.',

      parts: [
        { kind: 'numeric', label: 'Mean', answer: 7.95, tol: 0.01 },

        { kind: 'numeric', label: 'Median', answer: 8.25, tol: 0.01 },
      ],

      solution: [
        {
          text: 'Mean $=\\dfrac{79.5}{10}=7.95$.',
        },

        {
          text: 'The two middle sorted values average to a median of $8.25$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-flexibility-company-b',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'easy',

    citation: 'Walpole Ex. 1.4(a) — Company B',

    instance: {
      prompt:
        'Ten steel-rod springs from Company B were tested for flexibility: **11.0, 9.8, 9.9, 10.2, 10.1, 9.7, 11.0, 11.1, 10.2, 9.6**. Find the sample mean and median.',

      parts: [
        { kind: 'numeric', label: 'Mean', answer: 10.26, tol: 0.01 },

        { kind: 'numeric', label: 'Median', answer: 10.15, tol: 0.01 },
      ],

      solution: [
        {
          text: 'Mean $=\\dfrac{102.6}{10}=10.26$.',
        },

        {
          text: "The two middle sorted values average to a median of $10.15$ — noticeably higher than Company A's.",
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-cholesterol-control',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'hard',

    citation: 'Walpole Ex. 1.5(b) — control group',

    instance: {
      prompt:
        "In a cholesterol-reduction study, the control group's reduction values (mg/dL) were: **7, 3, -4, 14, 2, 5, 22, -7, 9, 5**. Compute the mean, median, and $10\\%$ trimmed mean.",

      parts: [
        { kind: 'numeric', label: 'Mean', answer: 5.6, tol: 0.02 },

        { kind: 'numeric', label: 'Median', answer: 5, tol: 0.02 },

        { kind: 'numeric', label: '10% trimmed mean', answer: 5.13, tol: 0.02 },
      ],

      solution: [
        {
          text: 'Mean $=\\dfrac{56}{10}=5.6$.',
        },

        {
          text: 'Median $=5.0$ (average of the two middle sorted values).',
        },

        {
          text: 'Dropping the smallest and largest value and averaging the rest gives $\\bar{x}_{\\mathrm{tr}(10)}=5.13$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-cholesterol-treatment',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'hard',

    citation: 'Walpole Ex. 1.5(b,c) — treatment group',

    instance: {
      prompt:
        "In the same study, the treatment group's reduction values (mg/dL) were: **-6, 5, 9, 4, 4, 12, 37, 5, 3, 3**. Compute the mean, median, and $10\\%$ trimmed mean, then state whether the value $37$ exerts strong leverage on the mean.",

      parts: [
        { kind: 'numeric', label: 'Mean', answer: 7.6, tol: 0.02 },

        { kind: 'numeric', label: 'Median', answer: 4.5, tol: 0.02 },

        { kind: 'numeric', label: '10% trimmed mean', answer: 5.63, tol: 0.02 },

        {
          kind: 'tf',
          label: 'The value 37 pulls the mean well above the median',
          answer: true,
        },
      ],

      solution: [
        {
          text: 'Mean $=\\dfrac{76}{10}=7.6$, but median $=4.5$ and $\\bar{x}_{\\mathrm{tr}(10)}=5.63$ — both far closer to the bulk of the data.',
        },

        {
          text: 'The single extreme value $37$ inflates the mean well above the median, exactly the leverage effect trimming is designed to resist.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-curing-temp-means',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'easy',

    citation: 'Walpole Ex. 1.6(b)',

    instance: {
      prompt:
        'Silicone-rubber tensile strength (MPa) was measured at two curing temperatures. $20°C$: **2.07, 2.14, 2.22, 2.03, 2.21, 2.03, 2.05, 2.18, 2.09, 2.14, 2.11, 2.02**. $45°C$: **2.52, 2.15, 2.49, 2.03, 2.37, 2.05, 1.99, 2.42, 2.08, 2.42, 2.29, 2.01**. Find the sample mean at each temperature.',

      parts: [
        { kind: 'numeric', label: 'Mean at 20°C', answer: 2.11, tol: 0.01 },

        { kind: 'numeric', label: 'Mean at 45°C', answer: 2.24, tol: 0.01 },
      ],

      solution: [
        {
          text: 'Mean at $20°C$: $\\bar{x}=2.11$ MPa.',
        },

        {
          text: 'Mean at $45°C$: $\\bar{x}=2.24$ MPa — higher curing temperature is associated with higher average tensile strength here.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-drying-time-variance',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.7',

    instance: {
      prompt:
        'Using the drying-time data of Ex. 1.1 (**3.4, 2.5, 4.8, 2.9, 3.6, 2.8, 3.3, 5.6, 3.7, 2.8, 4.4, 4.0, 5.2, 3.0, 4.8**), compute the sample variance and sample standard deviation.',

      parts: [
        { kind: 'numeric', label: 'Sample variance', answer: 0.943, tol: 0.01 },

        {
          kind: 'numeric',
          label: 'Sample standard deviation',
          answer: 0.971,
          tol: 0.01,
        },
      ],

      solution: [
        {
          text: '$s^2=\\dfrac{\\sum(x_i-\\bar{x})^2}{n-1}=0.943$.',
        },

        {
          text: '$s=\\sqrt{0.943}=0.971$ hours.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-fiber-absorbency-variance',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.8',

    instance: {
      prompt:
        'Using the water-absorbency data of Ex. 1.2, compute the sample variance and sample standard deviation.',

      parts: [
        { kind: 'numeric', label: 'Sample variance', answer: 2.53, tol: 0.02 },

        {
          kind: 'numeric',
          label: 'Sample standard deviation',
          answer: 1.59,
          tol: 0.02,
        },
      ],

      solution: [
        {
          text: '$s^2=2.53$.',
        },

        {
          text: '$s=\\sqrt{2.53}=1.59$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-tensile-variance-noaging',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.9(a) — no aging',

    instance: {
      prompt:
        'For the no-aging tensile-strength data of Ex. 1.3 (**227, 222, 218, 217, 225, 218, 216, 229, 228, 221**), compute the sample variance and standard deviation.',

      parts: [
        { kind: 'numeric', label: 'Sample variance', answer: 23.66, tol: 0.02 },

        {
          kind: 'numeric',
          label: 'Sample standard deviation',
          answer: 4.86,
          tol: 0.02,
        },
      ],

      solution: [
        {
          text: '$s^2=23.66$ psi$^2$.',
        },

        {
          text: '$s=\\sqrt{23.66}=4.86$ psi.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-tensile-variance-aging',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.9(a,b) — aging',

    instance: {
      prompt:
        'For the aged tensile-strength data of Ex. 1.3 (**219, 214, 215, 211, 209, 218, 203, 204, 201, 205**), compute the sample variance and standard deviation, then state whether aging appears to have increased variability relative to the no-aging group ($s^2=23.66$).',

      parts: [
        { kind: 'numeric', label: 'Sample variance', answer: 42.1, tol: 0.02 },

        {
          kind: 'numeric',
          label: 'Sample standard deviation',
          answer: 6.49,
          tol: 0.02,
        },

        {
          kind: 'tf',
          label: 'Aging increased the variability in tensile strength',
          answer: true,
        },
      ],

      solution: [
        {
          text: '$s^2=42.10$ psi$^2$, $s=\\sqrt{42.10}=6.49$ psi.',
        },

        {
          text: 'Since $42.10>23.66$, the aged group is more variable than the unaged group, not just lower on average.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-flexibility-company-a-variance',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.10 — Company A',

    instance: {
      prompt:
        'For the Company A flexibility data of Ex. 1.4 (**9.3, 8.8, 6.8, 8.7, 8.5, 6.7, 8.0, 6.5, 9.2, 7.0**), find the sample mean and sample variance.',

      parts: [
        { kind: 'numeric', label: 'Mean', answer: 7.95, tol: 0.01 },

        { kind: 'numeric', label: 'Variance', answer: 1.21, tol: 0.02 },
      ],

      solution: [
        {
          text: 'Mean $=7.95$.',
        },

        {
          text: 'Variance $s^2=1.21$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-flexibility-company-b-variance',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.10 — Company B',

    instance: {
      prompt:
        "For the Company B flexibility data of Ex. 1.4 (**11.0, 9.8, 9.9, 10.2, 10.1, 9.7, 11.0, 11.1, 10.2, 9.6**), find the sample mean and sample variance, then state whether Company B's springs appear less variable than Company A's ($s^2=1.21$).",

      parts: [
        { kind: 'numeric', label: 'Mean', answer: 10.26, tol: 0.01 },

        { kind: 'numeric', label: 'Variance', answer: 0.32, tol: 0.02 },

        {
          kind: 'tf',
          label: 'Company B is less variable than Company A',
          answer: true,
        },
      ],

      solution: [
        {
          text: 'Mean $=10.26$, variance $s^2=0.32$.',
        },

        {
          text: "Since $0.32<1.21$, Company B's flexibility values are considerably less spread out than Company A's.",
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-cholesterol-control-variance',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.11 — control',

    instance: {
      prompt:
        'For the control-group data of Ex. 1.5 (**7, 3, -4, 14, 2, 5, 22, -7, 9, 5**), compute the sample variance and standard deviation.',

      parts: [
        { kind: 'numeric', label: 'Variance', answer: 69.38, tol: 0.05 },

        {
          kind: 'numeric',
          label: 'Standard deviation',
          answer: 8.33,
          tol: 0.05,
        },
      ],

      solution: [
        {
          text: '$s^2=69.38$.',
        },

        {
          text: '$s=\\sqrt{69.38}=8.33$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-cholesterol-treatment-variance',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'hard',

    citation: 'Walpole Ex. 1.11 — treatment',

    instance: {
      prompt:
        "For the treatment-group data of Ex. 1.5 (**-6, 5, 9, 4, 4, 12, 37, 5, 3, 3**), compute the sample variance and standard deviation, and compare with the control group's ($s^2=69.38$).",

      parts: [
        { kind: 'numeric', label: 'Variance', answer: 128.04, tol: 0.05 },

        {
          kind: 'numeric',
          label: 'Standard deviation',
          answer: 11.32,
          tol: 0.05,
        },

        {
          kind: 'tf',
          label: 'The treatment group is more variable than the control group',
          answer: true,
        },
      ],

      solution: [
        {
          text: '$s^2=128.04$, $s=11.32$.',
        },

        {
          text: 'Since $128.04>69.38$, the treatment group — driven largely by the outlier $37$ — is substantially more variable than the control group.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-curing-temp-sd',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.12',

    instance: {
      prompt:
        'For the curing-temperature tensile-strength data of Ex. 1.6, compute the sample standard deviation at each temperature, and state whether the higher curing temperature ($45°C$) is associated with greater variability.',

      parts: [
        { kind: 'numeric', label: 'SD at 20°C', answer: 0.07, tol: 0.01 },

        { kind: 'numeric', label: 'SD at 45°C', answer: 0.2, tol: 0.01 },

        {
          kind: 'tf',
          label:
            'Higher curing temperature is associated with greater variability',
          answer: true,
        },
      ],

      solution: [
        {
          text: '$s_{20°C}=0.07$ MPa.',
        },

        {
          text: '$s_{45°C}=0.20$ MPa — roughly $3\\times$ as variable as the $20°C$ batch.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-battery-lifetime',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'easy',

    citation: 'Walpole Ex. 1.13',

    instance: {
      prompt:
        'A sample of battery lifetimes (hours) is: **123, 116, 122, 110, 175, 126, 125, 111, 118, 117**. Find the sample mean and median, and state whether $175$ is an extreme observation that pulls the mean above the median.',

      parts: [
        { kind: 'numeric', label: 'Mean', answer: 124.3, tol: 0.05 },

        { kind: 'numeric', label: 'Median', answer: 120, tol: 0.05 },

        {
          kind: 'tf',
          label: '175 pulls the mean above the median',
          answer: true,
        },
      ],

      solution: [
        {
          text: 'Mean $=124.3$ hours, median $=120$ hours.',
        },

        {
          text: 'The single large value $175$ is well clear of the rest of the sample, and it pulls the mean $4.3$ hours above the more representative median.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-tire-diameter-location',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'easy',

    citation: 'Walpole Ex. 1.14(a)',

    instance: {
      prompt:
        'Inner diameters (mm) for a sample of tires (target $570$ mm) are: **572, 572, 573, 568, 569, 575, 565, 570**. Find the sample mean and median.',

      parts: [
        { kind: 'numeric', label: 'Mean', answer: 570.5, tol: 0.02 },

        { kind: 'numeric', label: 'Median', answer: 571, tol: 0.02 },
      ],

      solution: [
        {
          text: 'Mean $=\\dfrac{4564}{8}=570.5$ mm.',
        },

        {
          text: 'Median (average of the two middle sorted values) $=571.0$ mm.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-tire-diameter-variability',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.14(b)',

    instance: {
      prompt:
        'For the tire-diameter data of Ex. 1.14 (**572, 572, 573, 568, 569, 575, 565, 570**), compute the sample variance, standard deviation, and range.',

      parts: [
        { kind: 'numeric', label: 'Variance', answer: 10, tol: 0.05 },

        {
          kind: 'numeric',
          label: 'Standard deviation',
          answer: 3.16,
          tol: 0.02,
        },

        { kind: 'numeric', label: 'Range', answer: 10, tol: 0.02 },
      ],

      solution: [
        {
          text: '$s^2=10.00$ mm$^2$.',
        },

        {
          text: '$s=\\sqrt{10}=3.16$ mm.',
        },

        {
          text: 'Range $=575-565=10$ mm.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-smokers-means',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.17(a)',

    instance: {
      prompt:
        'Time to fall asleep (minutes) was recorded for smokers (**69.3, 56.0, 22.1, 47.6, 53.2, 48.1, 52.7, 34.4, 60.2, 43.8, 23.2, 13.8**) and nonsmokers (**28.6, 25.1, 26.4, 34.9, 29.8, 28.4, 38.5, 30.2, 30.6, 31.8, 41.6, 21.1, 36.0, 37.9, 13.9**). Find the sample mean for each group, and state whether smokers appear to take longer to fall asleep on average.',

      parts: [
        { kind: 'numeric', label: 'Mean, smokers', answer: 43.7, tol: 0.05 },

        {
          kind: 'numeric',
          label: 'Mean, nonsmokers',
          answer: 30.32,
          tol: 0.05,
        },

        {
          kind: 'tf',
          label: 'Smokers take longer, on average, to fall asleep',
          answer: true,
        },
      ],

      solution: [
        {
          text: 'Smokers: $\\bar{x}=43.70$ minutes. Nonsmokers: $\\bar{x}=30.32$ minutes.',
        },

        {
          text: 'Smokers average over $13$ minutes longer than nonsmokers to fall asleep in this sample.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-smokers-sds',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.17(b)',

    instance: {
      prompt:
        'For the sleep-onset data of Ex. 1.17, find the sample standard deviation for smokers and nonsmokers, and state which group is more variable.',

      parts: [
        { kind: 'numeric', label: 'SD, smokers', answer: 16.93, tol: 0.05 },

        { kind: 'numeric', label: 'SD, nonsmokers', answer: 7.13, tol: 0.05 },

        {
          kind: 'mcq',
          label: 'More variable group',
          choices: ['Smokers', 'Nonsmokers'],
          answer: 0,
        },
      ],

      solution: [
        {
          text: 'Smokers: $s=16.93$ minutes. Nonsmokers: $s=7.13$ minutes.',
        },

        {
          text: 'Smokers are more than twice as variable as nonsmokers in time to fall asleep.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-fuel-pumps-location',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.19 (extension)',

    instance: {
      prompt:
        'The lifetimes (years) of 30 fuel pumps are: **2.0, 3.0, 0.3, 3.3, 1.3, 0.4, 0.2, 6.0, 5.5, 6.5, 0.2, 2.3, 1.5, 4.0, 5.9, 1.8, 4.7, 0.7, 4.5, 0.3, 1.5, 0.5, 2.5, 5.0, 1.0, 6.0, 5.6, 6.0, 1.2, 0.2**. Find the sample mean and median.',

      parts: [
        { kind: 'numeric', label: 'Mean', answer: 2.8, tol: 0.02 },

        { kind: 'numeric', label: 'Median', answer: 2.15, tol: 0.02 },
      ],

      solution: [
        {
          text: 'Mean $=2.80$ years.',
        },

        {
          text: 'Median (average of the 15th and 16th sorted values) $=2.15$ years — below the mean, consistent with the long right tail toward $6$+ years.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-fuel-pumps-variability',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'hard',

    citation: 'Walpole Ex. 1.19 (extension)',

    instance: {
      prompt:
        'For the fuel-pump lifetime data of Ex. 1.19, compute the sample variance and sample standard deviation.',

      parts: [
        { kind: 'numeric', label: 'Variance', answer: 4.96, tol: 0.05 },

        {
          kind: 'numeric',
          label: 'Standard deviation',
          answer: 2.23,
          tol: 0.02,
        },
      ],

      solution: [
        {
          text: '$s^2=4.96$ years$^2$.',
        },

        {
          text: '$s=\\sqrt{4.96}=2.23$ years.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-fruit-flies-location',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.20 (extension)',

    instance: {
      prompt:
        'The lifespans (seconds) of 50 fruit flies subject to a spray are recorded (see Ex. 1.20 for the full data set). The sample mean is $12.32$ seconds. Find the sample median.',

      parts: [{ kind: 'numeric', answer: 10.5, tol: 0.02 }],

      solution: [
        {
          text: 'Averaging the two middle sorted values of the 50 lifespans gives median $=10.5$ seconds, noticeably below the mean of $12.32$ — a right-skewed sample, as expected for lifetime data.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-fruit-flies-quartiles',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'hard',

    citation: 'Walpole Ex. 1.20 (extension)',

    instance: {
      prompt:
        'For the fruit-fly lifespan data of Ex. 1.20 (50 observations), find $Q_1$, $Q_3$, and the interquartile range.',

      parts: [
        { kind: 'numeric', label: 'Q1', answer: 7, tol: 0.05 },

        { kind: 'numeric', label: 'Q3', answer: 16, tol: 0.05 },

        { kind: 'numeric', label: 'IQR', answer: 9, tol: 0.05 },
      ],

      solution: [
        {
          text: 'Using $L_k=k(n+1)/4$ on the sorted 50 values: $Q_1=7$, $Q_3=16$.',
        },

        {
          text: '$IQR=Q_3-Q_1=16-7=9$ seconds.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-power-failures',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'hard',

    citation: 'Walpole Ex. 1.21',

    instance: {
      prompt:
        'The lengths (minutes) of 45 power failures are recorded (see Ex. 1.21). Find the sample mean, sample median, and sample standard deviation of the power-failure times.',

      parts: [
        { kind: 'numeric', label: 'Mean', answer: 74.02, tol: 0.05 },

        { kind: 'numeric', label: 'Median', answer: 78, tol: 0.05 },

        {
          kind: 'numeric',
          label: 'Standard deviation',
          answer: 39.26,
          tol: 0.05,
        },
      ],

      solution: [
        {
          text: 'Mean $\\bar{x}=74.02$ minutes.',
        },

        {
          text: 'Median $\\tilde{x}=78$ minutes — slightly above the mean.',
        },

        {
          text: 'Standard deviation $s=39.26$ minutes, reflecting the wide spread from a few minutes to over two hours.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-rivet-heads',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.22(a)',

    instance: {
      prompt:
        'The diameters (1/100 inch) of 36 rivet heads are recorded (see Ex. 1.22). Compute the sample mean and sample standard deviation.',

      parts: [
        { kind: 'numeric', label: 'Mean', answer: 6.73, tol: 0.01 },

        {
          kind: 'numeric',
          label: 'Standard deviation',
          answer: 0.05,
          tol: 0.005,
        },
      ],

      solution: [
        {
          text: 'Mean $=6.73$ (hundredths of an inch).',
        },

        {
          text: 'Standard deviation $s=0.05$ — a tightly controlled process, as expected for a manufactured part.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-emissions-means',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.23(b,c)',

    instance: {
      prompt:
        'Hydrocarbon emissions (ppm) were sampled for 20 cars each from 1980 and 1990 model years. The 1980 sample mean is $395.10$ ppm with standard deviation $281.07$ ppm; the 1990 sample mean is $160.15$ ppm with standard deviation $119.39$ ppm. Does the data indicate that variability in emissions decreased from 1980 to 1990, as well as the average level?',

      parts: [
        {
          kind: 'tf',
          label: 'Average emissions decreased from 1980 to 1990',
          answer: true,
        },

        {
          kind: 'tf',
          label: 'Variability in emissions decreased from 1980 to 1990',
          answer: true,
        },
      ],

      solution: [
        {
          text: 'The 1990 mean ($160.15$) is far below the 1980 mean ($395.10$), so average emissions dropped substantially.',
        },

        {
          text: 'The 1990 standard deviation ($119.39$) is also far below the 1980 figure ($281.07$): 1980 included some very large emissions values that 1990 no longer has, so variability decreased too.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-staff-salaries',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.24(a)',

    instance: {
      prompt:
        'Staff salaries (dollars per pupil, in thousands) were recorded for 30 schools (see Ex. 1.24). Compute the sample mean and sample standard deviation.',

      parts: [
        { kind: 'numeric', label: 'Mean', answer: 2.9, tol: 0.02 },

        {
          kind: 'numeric',
          label: 'Standard deviation',
          answer: 0.54,
          tol: 0.02,
        },
      ],

      solution: [
        {
          text: 'Mean $\\bar{x}=2.90$ (thousand dollars per pupil).',
        },

        {
          text: 'Standard deviation $s=0.54$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-upper-income-pct',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'hard',

    citation: 'Walpole Ex. 1.25(a,b,d)',

    instance: {
      prompt:
        'The percentage of families in the upper income level was recorded for the same 30 schools of Ex. 1.24 (see Ex. 1.25). Compute the sample mean, sample median, and $10\\%$ trimmed mean, and comment on whether the mean is pulled noticeably away from the median.',

      parts: [
        { kind: 'numeric', label: 'Mean', answer: 33.31, tol: 0.05 },

        { kind: 'numeric', label: 'Median', answer: 26.35, tol: 0.05 },

        {
          kind: 'numeric',
          label: '10% trimmed mean',
          answer: 30.97,
          tol: 0.05,
        },
      ],

      solution: [
        {
          text: 'Mean $=33.31\\%$, well above the median of $26.35\\%$.',
        },

        {
          text: 'The $10\\%$ trimmed mean, $30.97\\%$, sits between the two, closer to the median — a sign that a few schools with unusually high upper-income percentages are pulling the untrimmed mean upward.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-lamp-lifetimes-quartiles',

    chapter: 'intro',

    topic: 'Descriptive statistics',

    difficulty: 'hard',

    citation: 'Walpole Ex. 1.30',

    instance: {
      prompt:
        'Lifetimes (hours) of fifty 40-watt, 110-volt incandescent lamps were recorded from forced-life tests (see Ex. 1.30). Find the sample median, $Q_1$, $Q_3$, and the IQR — the quantities needed to draw the box plot.',

      parts: [
        { kind: 'numeric', label: 'Median', answer: 1009, tol: 1 },

        { kind: 'numeric', label: 'Q1', answer: 922.25, tol: 1 },

        { kind: 'numeric', label: 'Q3', answer: 1156.25, tol: 1 },

        { kind: 'numeric', label: 'IQR', answer: 234, tol: 1 },
      ],

      solution: [
        {
          text: 'Median $=1009$ hours.',
        },

        {
          text: '$Q_1=922.25$ hours and $Q_3=1156.25$ hours, using $L_k=k(n+1)/4$ on the 50 sorted values.',
        },

        {
          text: "$IQR=1156.25-922.25=234.00$ hours — the box plot's box spans this range around the median.",
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-nitrogen-experiment',

    chapter: 'intro',

    topic: 'Study design',

    difficulty: 'easy',

    citation: 'Walpole Example 1.2',

    instance: {
      prompt:
        'Two samples of 10 northern red oak seedlings were planted in a greenhouse; seedlings were randomly assigned to a nitrogen treatment or a no-nitrogen treatment, with all other environmental conditions held constant. Classify this study.',

      parts: [
        {
          kind: 'mcq',
          choices: [
            'Designed experiment',
            'Observational study',
            'Retrospective study',
          ],
          answer: 0,
        },
      ],

      solution: [
        {
          text: 'The treatment (nitrogen vs. no nitrogen) is assigned to the seedlings at random, which is the defining feature of a designed experiment.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-corrosion-treatments',

    chapter: 'intro',

    topic: 'Study design',

    difficulty: 'medium',

    citation: 'Walpole Example 1.3',

    instance: {
      prompt:
        'A corrosion study used two coating levels (uncoated, chemical corrosion coating) crossed with two humidity levels (20%, 80%), giving four treatment combinations. Two aluminum specimens were randomly assigned to each combination. (a) How many experimental units (specimens) were used in total? (b) Classify the study.',

      parts: [
        { kind: 'numeric', label: 'Total specimens', answer: 8, tol: 0 },

        {
          kind: 'mcq',
          label: 'Study type',
          choices: [
            'Designed experiment',
            'Observational study',
            'Retrospective study',
          ],
          answer: 0,
        },
      ],

      solution: [
        {
          text: '$4$ treatment combinations $\\times\\,2$ specimens each $=8$ specimens.',
        },

        {
          text: 'Treatment combinations are randomly assigned to specimens, so this is a designed experiment.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-curing-temp-design',

    chapter: 'intro',

    topic: 'Study design',

    difficulty: 'medium',

    citation: 'Walpole discussion of Ex. 1.6 (§1.7)',

    instance: {
      prompt:
        '24 specimens of silicone rubber are selected and 12 are randomly assigned to each of two carefully controlled curing temperatures. (a) Classify the study. (b) Can any difference found in mean tensile strength be attributed to curing temperature?',

      parts: [
        {
          kind: 'mcq',
          label: 'Study type',
          choices: [
            'Designed experiment',
            'Observational study',
            'Retrospective study',
          ],
          answer: 0,
        },

        {
          kind: 'tf',
          label:
            'A tensile-strength difference can be attributed to curing temperature',
          answer: true,
        },
      ],

      solution: [
        {
          text: 'Curing temperature is a factor deliberately controlled and randomly assigned to specimens, so this is a designed experiment.',
        },

        {
          text: 'Random assignment balances nuisance factors across the two temperature groups, so an observed difference can be attributed to curing temperature itself.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-cholesterol-sodium',

    chapter: 'intro',

    topic: 'Study design',

    difficulty: 'medium',

    citation: 'Walpole §1.7 ("What If Factors Are Not Controlled?")',

    instance: {
      prompt:
        "A group of individuals is monitored over time for both blood cholesterol and blood sodium, with no control over anyone's sodium level. (a) Classify the study. (b) Does it support a causal conclusion about sodium's effect on cholesterol?",

      parts: [
        {
          kind: 'mcq',
          label: 'Study type',
          choices: [
            'Designed experiment',
            'Observational study',
            'Retrospective study',
          ],
          answer: 1,
        },

        { kind: 'tf', label: 'Supports a causal conclusion', answer: false },
      ],

      solution: [
        {
          text: 'Sodium level is only observed, never assigned, so this is an observational study.',
        },

        {
          text: 'Without random assignment, other uncontrolled factors (diet, exercise, and so on) could explain any association, so no causal claim is justified.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-power-consumption',

    chapter: 'intro',

    topic: 'Study design',

    difficulty: 'easy',

    citation: 'Walpole §1.7',

    instance: {
      prompt:
        'A study monitors ambient temperature and the electric power consumed by a chemical plant over time; temperature cannot be controlled by the analyst. Classify this study.',

      parts: [
        {
          kind: 'mcq',
          choices: [
            'Designed experiment',
            'Observational study',
            'Retrospective study',
          ],
          answer: 1,
        },
      ],

      solution: [
        {
          text: 'The factor of interest (temperature) is only measured, never assigned, so this is an observational study.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-staff-salary-retrospective',

    chapter: 'intro',

    topic: 'Study design',

    difficulty: 'medium',

    citation: 'Walpole §1.7 (staff-salary data, Exercise 1.24)',

    instance: {
      prompt:
        'An analyst uses historical staff-salary records, collected years earlier for another purpose, to study salary patterns across schools, with no random assignment or experimental control involved. (a) Classify the study. (b) Does it support a causal conclusion?',

      parts: [
        {
          kind: 'mcq',
          label: 'Study type',
          choices: [
            'Designed experiment',
            'Observational study',
            'Retrospective study',
          ],
          answer: 2,
        },

        { kind: 'tf', label: 'Supports a causal conclusion', answer: false },
      ],

      solution: [
        {
          text: 'The data are purely historical and were not collected under any random assignment, so this is a retrospective study.',
        },

        {
          text: 'Retrospective data offer no control over confounding factors, so no causal claim about salary determinants is justified.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-bearing-wear-load',

    chapter: 'intro',

    topic: 'Study design',

    difficulty: 'medium',

    citation: 'Walpole Exercise 1.27',

    instance: {
      prompt:
        'A designed experiment studies bearing wear $y$ as a function of load $x$. Three load levels (700, 1000, 1300 lb) are used, and four specimens are randomly assigned to each level. (a) How many experimental units are used in total? (b) Classify the study.',

      parts: [
        { kind: 'numeric', label: 'Total specimens', answer: 12, tol: 0 },

        {
          kind: 'mcq',
          label: 'Study type',
          choices: [
            'Designed experiment',
            'Observational study',
            'Retrospective study',
          ],
          answer: 0,
        },
      ],

      solution: [
        {
          text: '$3$ load levels $\\times\\,4$ specimens each $=12$ specimens.',
        },

        {
          text: 'Load level is deliberately set and randomly assigned to specimens, so this is a designed experiment.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-yield-continuous',

    chapter: 'intro',

    topic: 'Types of data',

    difficulty: 'easy',

    citation: 'Walpole §1.5',

    instance: {
      prompt:
        'A chemical engineer records the yield of a reaction in grams per pound of input, measured on a continuum. What kind of variable is yield here?',

      parts: [
        {
          kind: 'mcq',
          choices: [
            'Qualitative (categorical)',
            'Discrete quantitative',
            'Continuous quantitative',
          ],
          answer: 2,
        },
      ],

      solution: [
        {
          text: 'Yield can take any value on a continuum (not just counted values), so it is continuous quantitative data.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-binary-response',

    chapter: 'intro',

    topic: 'Types of data',

    difficulty: 'easy',

    citation: 'Walpole §1.5',

    instance: {
      prompt:
        'A toxicologist conducting a combination-drug experiment records, for each patient, whether the patient responds to the drug or does not. As the book treats it — coded 1 for a response and 0 otherwise — what kind of variable is this?',

      parts: [
        {
          kind: 'mcq',
          choices: [
            'Continuous quantitative',
            'Discrete quantitative (coded 0/1)',
            'A third, unrelated category',
          ],
          answer: 1,
        },
      ],

      solution: [
        {
          text: 'Binary outcomes take only the values 0 and 1 — a special case of discrete quantitative (count) data — which is exactly what lets the sample proportion be computed as an ordinary sample mean.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-sample-proportion',

    chapter: 'intro',

    topic: 'Types of data',

    difficulty: 'easy',

    citation: 'Walpole §1.5',

    instance: {
      prompt:
        'In a biomedical study, 50 patients with a stomach ailment were given a drug; 20 of them experienced improvement. Find the sample proportion of patients for whom the drug was successful.',

      parts: [{ kind: 'numeric', answer: 0.4, tol: 0.01 }],

      solution: [
        {
          text: 'Sample proportion $=x/n=20/50=0.4$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-tire-blemish-proportions',

    chapter: 'intro',

    topic: 'Types of data',

    difficulty: 'medium',

    citation: 'Walpole §1.5',

    instance: {
      prompt:
        'A tire manufacturer samples 5000 tires and finds 100 blemished. After a process change, a second sample of 5000 tires has 90 blemished. Find the sample proportion of blemished tires before and after the change.',

      parts: [
        {
          kind: 'numeric',
          label: 'Proportion before',
          answer: 0.02,
          tol: 0.001,
        },

        {
          kind: 'numeric',
          label: 'Proportion after',
          answer: 0.018,
          tol: 0.001,
        },
      ],

      solution: [
        {
          text: 'Before: $100/5000=0.02$.',
        },

        {
          text: 'After: $90/5000=0.018$ — whether this small drop is a real improvement, rather than sampling noise, is exactly the kind of question inferential statistics (not descriptive statistics alone) is built to answer.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-count-data',

    chapter: 'intro',

    topic: 'Types of data',

    difficulty: 'easy',

    citation: 'Walpole §1.5',

    instance: {
      prompt:
        'An engineer studies the number of radioactive particles passing through a counter in one millisecond. What kind of variable is this count?',

      parts: [
        {
          kind: 'mcq',
          choices: [
            'Qualitative (categorical)',
            'Discrete quantitative',
            'Continuous quantitative',
          ],
          answer: 1,
        },
      ],

      solution: [
        {
          text: 'A count of particles can only take whole-number values, so it is discrete quantitative data.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-proportion-as-mean',

    chapter: 'intro',

    topic: 'Types of data',

    difficulty: 'medium',

    citation: 'Walpole §1.5',

    instance: {
      prompt:
        'Binary outcomes are coded $1$ for success and $0$ for failure. True or false: the sample proportion of successes equals the sample mean of these $0/1$-coded values.',

      parts: [{ kind: 'tf', answer: true }],

      solution: [
        {
          text: '$\\dfrac{x_1+x_2+\\cdots+x_n}{n}$ counts successes divided by $n$ whether you call it "the mean of the 0s and 1s" or "the sample proportion" — they are the same number by construction.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-coating-qualitative',

    chapter: 'intro',

    topic: 'Types of data',

    difficulty: 'easy',

    citation: 'Walpole Example 1.3',

    instance: {
      prompt:
        'In the aluminum corrosion study, one factor is the type of coating applied: "chemical corrosion coating" or "uncoated." What kind of variable is coating type?',

      parts: [
        {
          kind: 'mcq',
          choices: [
            'Qualitative (categorical)',
            'Discrete quantitative',
            'Continuous quantitative',
          ],
          answer: 0,
        },
      ],

      solution: [
        {
          text: 'Coating type names a category rather than a count or measurement, so it is qualitative data.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-defective-items-population',

    chapter: 'intro',

    topic: 'Populations and samples',

    difficulty: 'medium',

    citation: 'Walpole Example 1.1',

    instance: {
      prompt:
        'An engineer samples 100 items from a manufacturing process and finds 10 defective. (a) Does the set of 100 items represent the population or a sample? (b) Find the sample proportion defective.',

      parts: [
        {
          kind: 'mcq',
          label: 'The 100 items are a',
          choices: ['Population', 'Sample'],
          answer: 1,
        },

        {
          kind: 'numeric',
          label: 'Sample proportion defective',
          answer: 0.1,
          tol: 0.005,
        },
      ],

      solution: [
        {
          text: 'The 100 items are a sample; the population is conceptually all possible items the process could produce.',
        },

        {
          text: 'Sample proportion defective $=10/100=0.10$.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-computer-boards-population',

    chapter: 'intro',

    topic: 'Populations and samples',

    difficulty: 'easy',

    citation: 'Walpole §1.1',

    instance: {
      prompt:
        'A manufacturer samples 50 computer boards from an ongoing production process to look for defects. What is the population in this study?',

      parts: [
        {
          kind: 'mcq',
          choices: [
            'The 50 sampled boards',
            'All computer boards manufactured by the firm over the relevant period',
            'The engineers who inspect the boards',
            'The defect-detection equipment used',
          ],
          answer: 1,
        },
      ],

      solution: [
        {
          text: 'The population is the entire collection the sample is meant to represent — here, all boards the firm has manufactured over the period in question, not just the 50 inspected.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-srs-definition',

    chapter: 'intro',

    topic: 'Populations and samples',

    difficulty: 'easy',

    citation: 'Walpole §1.2',

    instance: {
      prompt:
        'True or false: under simple random sampling, every sample of a given size has the same chance of being selected as any other sample of that size.',

      parts: [{ kind: 'tf', answer: true }],

      solution: [
        {
          text: "That equal-chance property is precisely the book's definition of simple random sampling.",
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-biased-sample',

    chapter: 'intro',

    topic: 'Populations and samples',

    difficulty: 'hard',

    citation: 'Walpole §1.2',

    instance: {
      prompt:
        'A political-preference survey draws 1000 families, but nearly all of them turn out to live in urban settings, even though the inferences are meant to describe the whole state, urban and rural alike. Why is this sample described as biased?',

      parts: [
        {
          kind: 'mcq',
          choices: [
            'It is too large for a state-level survey',
            'It confines the sample to a narrower population (urban) than the one the inferences are meant to cover',
            'Families are not a valid sampling unit',
            'It was not collected using a table of random numbers',
          ],
          answer: 1,
        },
      ],

      solution: [
        {
          text: 'Random sampling was not achieved: the realized sample effectively represents only the urban population, so conclusions drawn from it cannot safely be extended to the state as a whole, including its rural population.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-stratified-referendum',

    chapter: 'intro',

    topic: 'Populations and samples',

    difficulty: 'medium',

    citation: 'Walpole §1.2',

    instance: {
      prompt:
        'A city, subdivided into several ethnic groups that form natural strata, is surveyed about a bond referendum by drawing a separate random sample of families from each ethnic group. Which sampling method is this?',

      parts: [
        {
          kind: 'mcq',
          choices: [
            'Simple random sampling',
            'Stratified random sampling',
            'Cluster sampling',
            'Convenience sampling',
          ],
          answer: 1,
        },
      ],

      solution: [
        {
          text: 'Selecting a random sample independently within each of several homogeneous subgroups (strata) is stratified random sampling — it guarantees no stratum is over- or under-represented.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-parameter-vs-statistic',

    chapter: 'intro',

    topic: 'Populations and samples',

    difficulty: 'easy',

    citation: 'Walpole §1.3',

    instance: {
      prompt:
        'True or false: the sample mean $\\bar{x}$ is a statistic used to estimate the population mean $\\mu$, a parameter.',

      parts: [{ kind: 'tf', answer: true }],

      solution: [
        {
          text: '$\\bar{x}$ is computed from the sample (a statistic); $\\mu$ is a fixed but generally unknown feature of the whole population (a parameter) that $\\bar{x}$ is used to estimate.',
        },
      ],
    },
  }),

  bookQuestion({
    id: 'ch01-book-coin-pvalue',

    chapter: 'intro',

    topic: 'Populations and samples',

    difficulty: 'medium',

    citation: 'Walpole Ex. 1.15',

    instance: {
      prompt:
        'Five independent tosses of a coin assumed fair (the population model) result in HHHHH. (a) Under the fair-coin model, this exact sample outcome has probability $(1/2)^5$ — compute it. (b) Is this small probability evidence, drawn from the sample, that the population process (the coin) is not fair?',

      parts: [
        {
          kind: 'numeric',
          label: 'P(HHHHH | fair coin)',
          answer: 0.03125,
          tol: 0.0005,
        },

        {
          kind: 'tf',
          label: 'This is evidence against a fair coin',
          answer: true,
        },
      ],

      solution: [
        {
          text: '$(1/2)^5=0.03125$.',
        },

        {
          text: 'A sample outcome this unlikely under the assumed population model (fair coin) counts as evidence against that model — the same P-value logic used throughout the rest of the book.',
        },
      ],
    },
  }),
];
