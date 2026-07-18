<script lang="ts">
  import type { QuestionInstance } from '../../engine/types';
  import type { GivenAnswer } from '../../engine/grade';
  import MathMarkdown from './MathMarkdown.svelte';
  import AnswerInput from './AnswerInput.svelte';

  let { instance, answers = $bindable(), graded = null, disabled = false, showSolution = false }:
    { instance: QuestionInstance; answers: GivenAnswer[]; graded?: (boolean | null)[] | null; disabled?: boolean; showSolution?: boolean } = $props();

  const mark = (v: boolean | null) => (v === true ? '✓' : v === false ? '✗' : '—');
</script>

<article class="question-card">
  <p class="prompt"><MathMarkdown text={instance.prompt} /></p>

  {#each instance.parts as part, i}
    <div class="part">
      {#if part.label}<span class="part-label"><MathMarkdown text={part.label} /></span>{/if}
      <AnswerInput {part} bind:value={answers[i]} {disabled} />
      {#if graded}<span class="mark" class:ok={graded[i] === true} class:bad={graded[i] === false}>{mark(graded[i])}</span>{/if}
    </div>
  {/each}

  {#if showSolution}
    <details class="solution" open>
      <summary>Worked solution</summary>
      {#each instance.solution as step}
        <p><MathMarkdown text={step.text} /></p>
      {/each}
    </details>
  {/if}
</article>

<style>
  .question-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    padding: var(--space-lg);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
  }

  .prompt {
    font-size: var(--font-size-heading);
    line-height: var(--line-height-snug);
    color: var(--color-text);
  }

  .part {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .part-label {
    color: var(--color-text-muted);
    font-size: var(--font-size-label);
  }

  .mark {
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-body);
  }

  .mark.ok {
    color: var(--color-success);
  }

  .mark.bad {
    color: var(--color-error);
  }

  .solution {
    padding-top: var(--space-md);
    border-top: 1px solid var(--color-border);
    color: var(--color-text);
  }

  .solution summary {
    cursor: pointer;
    font-weight: var(--font-weight-semibold);
    color: var(--color-accent);
  }
</style>
