<script lang="ts">
  import type { SolutionStep } from '../../engine/types';
  import MathMarkdown from './MathMarkdown.svelte';

  let { steps }: { steps: SolutionStep[] } = $props();
</script>

{#each steps as step}
  <p><MathMarkdown text={step.text} /></p>
{/each}
