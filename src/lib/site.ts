// Single source for navigation + the Phase-1 chapter list. Header, footer,
// the chapters index and the [slug] stub all build from this. Chapter slugs
// MUST match the engine's chapter tags ('intro', 'probability') — a mismatch
// fails the cross-check test and would 404 practice links in Plan 2b.
export type ChapterStatus = 'available' | 'coming-soon';

export type Chapter = {
  number: number;

  title: string;

  slug: string;

  topics: string[];

  status: ChapterStatus;
};

export type NavChild = {
  label: string;

  href: string;
};

export type NavItem = {
  label: string;

  href?: string;

  children?: NavChild[];
};

export const chapters: Chapter[] = [
  {
    number: 1,

    title: 'Introduction to Statistics & Data Analysis',

    slug: 'intro',

    topics: ['Descriptive statistics', 'Types of data', 'Populations and samples'],

    status: 'coming-soon',
  },

  {
    number: 2,

    title: 'Probability',

    slug: 'probability',

    topics: ['Counting techniques', 'Conditional probability', 'Bayes theorem'],

    status: 'coming-soon',
  },
];

export const modes: NavChild[] = [
  { label: 'Exam', href: 'exam' },

  { label: 'Worksheet', href: 'worksheet' },

  { label: 'Drill', href: 'drill' },
];

export const navItems: NavItem[] = [
  { label: 'Chapters', href: 'chapters' },

  { label: 'Practice', children: modes },
];
