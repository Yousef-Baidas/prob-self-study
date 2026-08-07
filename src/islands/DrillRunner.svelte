<script lang="ts">
  import { onMount } from 'svelte';
  import { rollSeed } from '../lib/seed';
  import {
    checkDrillAnswer,
    nextDrillQuestion,
    startDrillRun,
    type DrillRunState,
    type ReadyDrillRun,
  } from '../run/drill';
  import { applyUrl, reconcileSetup, readStoredNumber, writeStored } from '../run/effects';
  import QuestionCard from '../components/practice/QuestionCard.svelte';
  import { route } from '../lib/routes';

  // The whole drill lifecycle — topic key, seeding, streak and accuracy — lives
  // in src/run/drill.ts. This island renders it and performs the effects it
  // returns; it holds no rules of its own.
  let run = $state<DrillRunState>({ status: 'idle' });

  const bestKey = (chapter: string, topic: string) => `prob-drill:best:${chapter}:${topic}`;
  const ready = () => run as ReadyDrillRun;

  function apply(next: DrillRunState) {
    run = next;
    if (next.status !== 'ready') return;
    applyUrl(next.url);
    if (next.storeBest !== undefined) {
      writeStored(bestKey(next.spec.chapter, next.spec.topic), String(next.storeBest));
    }
  }

  onMount(() => {
    const started = startDrillRun(window.location.search, {
      roll: rollSeed,
      readBest: (chapter, topic) => readStoredNumber(bestKey(chapter, topic)),
    });
    reconcileSetup('drill-setup', started.status);
    apply(started);
  });
</script>

{#if run.status === 'error'}
  <div class="drill-error">
    <p>
      {#if run.reason === 'topic'}That topic isn’t available for drilling yet.
      {:else if run.reason === 'difficulty'}That difficulty isn’t valid.
      {:else}No questions match this topic at that difficulty.{/if}
    </p>
    <a href={route('drill')}>Back to setup</a>
  </div>
{:else if run.status === 'ready'}
  <section class="drill">
    <header class="drill-stats" aria-live="polite">
      <span>Streak <strong>{run.streak}</strong></span>
      <span>Best <strong>{run.best}</strong></span>
      <span>Answered <strong>{run.answered}</strong></span>
      <span>Accuracy <strong>{run.accuracy}%</strong></span>
    </header>

    <QuestionCard
      instance={run.current.instance}
      bind:answers={run.answers}
      graded={run.checked ? run.graded : null}
      disabled={run.checked}
      showSolution={run.checked}
    />

    <nav class="drill-actions">
      {#if !run.checked}
        <button type="button" class="primary" onclick={() => apply(checkDrillAnswer(ready(), ready().answers))}>Check</button>
      {:else}
        <button type="button" class="primary" onclick={() => apply(nextDrillQuestion(ready()))}>Next question ›</button>
      {/if}
    </nav>
  </section>
{/if}

<style>
  .drill { max-width: 60ch; margin-inline: auto; display: flex; flex-direction: column; gap: var(--space-md); }
  .drill-stats {
    display: flex; flex-wrap: wrap; gap: var(--space-md);
    padding: var(--space-sm) var(--space-md); background: var(--color-surface);
    border: 1px solid var(--color-border); border-radius: var(--radius-md);
    color: var(--color-text-muted); font-size: var(--font-size-label);
  }
  .drill-stats strong { color: var(--color-text); font-size: var(--font-size-body); }
  .drill-actions { display: flex; justify-content: flex-end; }
  .drill-actions button.primary {
    padding: var(--space-sm) var(--space-lg); background: var(--color-accent); color: var(--color-accent-ink);
    border: 1px solid var(--color-accent); border-radius: var(--radius-pill); font: inherit;
    font-weight: var(--font-weight-semibold); cursor: pointer;
  }
  .drill-actions button.primary:hover { background: var(--color-accent-hover); border-color: var(--color-accent-hover); }
  .drill-error {
    display: flex; flex-direction: column; gap: var(--space-sm); align-items: flex-start;
    max-width: 48ch; margin-inline: auto; padding: var(--space-lg); background: var(--color-surface);
    border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text);
  }
  .drill-error p { color: var(--color-error); font-weight: var(--font-weight-semibold); }
</style>
