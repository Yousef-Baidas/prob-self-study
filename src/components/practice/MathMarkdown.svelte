<script lang="ts">
  import 'katex/dist/katex.min.css';
  import { renderMathMarkdown } from '../../lib/mathMarkdown';

  let { text }: { text: string } = $props();
  const html = $derived(renderMathMarkdown(text));
</script>

<span class="mathmd">{@html html}</span>
