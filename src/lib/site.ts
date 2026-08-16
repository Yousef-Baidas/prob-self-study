// Single source for navigation + the chapter list. Header, footer, the chapters
// index and the [slug] page all build from this. Chapter slugs MUST match the
// engine's chapter tags ('intro', 'probability', 'random-variables',
// 'expectation', 'discrete-distributions', 'continuous-distributions') — a
// mismatch fails the cross-check test and would 404 practice links.
//
// A chapter declares only what nothing else can know: its number, title and
// slug. Its topics come from the templates that exist for it, so the list can
// never quietly disagree with what practice actually serves.
//
// Whether a chapter has notes yet is deliberately NOT here. That question is
// answered by the notes directory (see chapterNotes.ts), and this module is
// reachable from the islands — importing the notes glob here would ship every
// chapter's prose into the client bundle as dead chunks.
import { topicsForChapter } from '../engine/registry';

/** The part of a chapter that is written down rather than worked out. */
export type ChapterIdentity = {
  number: number;

  title: string;

  slug: string;
};

export type Chapter = ChapterIdentity & {
  topics: string[];
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

const identities: ChapterIdentity[] = [
  {
    number: 1,

    title: 'Introduction to Statistics & Data Analysis',

    slug: 'intro',
  },

  {
    number: 2,

    title: 'Probability',

    slug: 'probability',
  },

  {
    number: 3,

    title: 'Random Variables and Probability Distributions',

    slug: 'random-variables',
  },

  {
    number: 4,

    title: 'Mathematical Expectation',

    slug: 'expectation',
  },

  {
    number: 5,

    title: 'Some Discrete Probability Distributions',

    slug: 'discrete-distributions',
  },

  {
    number: 6,

    title: 'Some Continuous Probability Distributions',

    slug: 'continuous-distributions',
  },
];

export const chapters: Chapter[] = identities.map((c) => ({
  ...c,

  topics: topicsForChapter(c.slug),
}));

export const modes: NavChild[] = [
  { label: 'Exam', href: 'exam' },

  { label: 'Worksheet', href: 'worksheet' },

  { label: 'Drill', href: 'drill' },
];

export const navItems: NavItem[] = [
  { label: 'Chapters', href: 'chapters' },

  { label: 'Practice', children: modes },
];
