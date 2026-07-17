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
  },
});
