import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

import mdx from '@astrojs/mdx';

import remarkMath from 'remark-math';

import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://yousef-baidas.github.io',

  base: '/prob-self-study/',

  integrations: [mdx(), svelte()],

  markdown: {
    remarkPlugins: [remarkMath],

    rehypePlugins: [rehypeKatex],

    // Two themes, no default colour. Shiki then emits every token's light and
    // dark colour as the CSS custom properties --shiki-light / --shiki-dark,
    // and ChapterNotes.astro picks between them off :root[data-theme]. Baking
    // one theme in instead would leave code blocks lit the wrong way round for
    // half the site's readers.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },

      defaultColor: false,

      wrap: true,
    },
  },
});
