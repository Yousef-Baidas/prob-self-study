<script lang="ts">
  import type { AnswerPart } from '../../engine/types';
  import type { GivenAnswer } from '../../engine/grade';
  import MathMarkdown from './MathMarkdown.svelte';

  let { part, value = $bindable(), disabled = false }:
    { part: AnswerPart; value: GivenAnswer; disabled?: boolean } = $props();

  const uid = $props.id();
</script>

{#if part.kind === 'numeric'}
  <span class="answer-numeric">
    <input type="number" step="any" bind:value {disabled} aria-label={part.label ?? 'answer'} />
    {#if part.unit}<span class="unit">{part.unit}</span>{/if}
  </span>
{:else if part.kind === 'mcq'}
  <ul class="answer-mcq">
    {#each part.choices as choice, i}
      <li>
        <label>
          <input type="radio" name={uid} value={i} bind:group={value} {disabled} />
          <MathMarkdown text={choice} />
        </label>
      </li>
    {/each}
  </ul>
{:else if part.kind === 'tf'}
  <span class="answer-tf">
    <label><input type="radio" name={uid} value={true} bind:group={value} {disabled} /> True</label>
    <label><input type="radio" name={uid} value={false} bind:group={value} {disabled} /> False</label>
  </span>
{:else if part.kind === 'short'}
  <input class="answer-short" type="text" bind:value {disabled} aria-label={part.label ?? 'answer'} />
{/if}

<style>
  .answer-numeric {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
  }

  input[type='number'],
  .answer-short {
    font: inherit;
    color: var(--color-text);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: var(--space-xs) var(--space-sm);
  }

  input[type='number']:focus-visible,
  .answer-short:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  .unit {
    color: var(--color-text-muted);
    font-size: var(--font-size-label);
  }

  .answer-mcq {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .answer-mcq label,
  .answer-tf label {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    color: var(--color-text);
  }

  .answer-tf {
    display: inline-flex;
    gap: var(--space-md);
  }

  input[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
