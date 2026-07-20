<script lang="ts">
  import { onMount } from 'svelte';
  import { rollSeed } from '../lib/seed';
  import {
    gotoExamQuestion,
    rerollExam,
    retryExam,
    startExamRun,
    submitExam,
    type ExamRunState,
    type ReadyExamRun,
  } from '../run/exam';
  import QuestionCard from '../components/practice/QuestionCard.svelte';
  import { joinBase } from '../lib/withBase';
  import { applyUrl, reconcileSetup, writeStored } from '../run/effects';

  // No props: the site is statically generated, so Astro cannot pass query
  // params in. Everything from "a URL arrived" to "here is what to render"
  // lives in src/run/exam.ts; this island renders the result and performs the
  // effects that module hands back.
  let run = $state<ExamRunState>({ status: 'idle' });
  let copied = $state(false);

  function apply(next: ExamRunState) {
    run = next;
    if (next.status !== 'ready') return;
    applyUrl(next.url);
    if (next.storeScore) {
      const { chapter, score, total, seed } = next.storeScore;
      writeStored(`prob-exam:lastScore:${chapter}`, JSON.stringify({ score, total, seed, at: Date.now() }));
    }
  }

  const atFirst = $derived(run.status === 'ready' && run.index === 0);
  const atLast = $derived(
    run.status === 'ready' && run.index === run.session.questions.length - 1,
  );

  const ready = () => run as ReadyExamRun;

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      copied = true;
      setTimeout(() => { copied = false; }, 2000);
    }).catch(() => {});
  }

  onMount(() => {
    const started = startExamRun(window.location.search, { roll: rollSeed });
    reconcileSetup('exam-setup', started.status);
    apply(started);
  });
</script>

{#snippet cappedNotice(delivered: number)}
  <p class="notice">This chapter has {delivered} book question{delivered === 1 ? '' : 's'}.</p>
{/snippet}

{#if run.status === 'error'}
  <div class="exam-error">
    <p>
      {#if run.reason === 'chapter'}That chapter isn’t available yet.
      {:else if run.reason === 'source'}That question source isn’t valid.
      {:else}No questions match this selection.{/if}
    </p>
    <a href={joinBase(import.meta.env.BASE_URL, 'exam')}>Back to setup</a>
  </div>
{:else if run.status === 'ready'}
  {@const capped = run.session.capped && run.session.spec.source === 'book'}
  {#if run.phase === 'attempt'}
    <section class="exam-run">
      {#if capped}{@render cappedNotice(run.session.delivered)}{/if}
      <div class="exam-live" aria-live="polite">
        <p class="progress">Question {run.index + 1} / {run.session.questions.length}</p>

        <QuestionCard
          instance={run.session.questions[run.index].instance}
          bind:answers={run.answers[run.index]}
        />
      </div>

      <nav class="pager">
        <button type="button" onclick={() => apply(gotoExamQuestion(ready(), ready().index - 1))} disabled={atFirst}>‹ Prev</button>
        {#if atLast}
          <button type="button" class="submit" onclick={() => apply(submitExam(ready()))}>Submit</button>
        {:else}
          <button type="button" onclick={() => apply(gotoExamQuestion(ready(), ready().index + 1))}>Next ›</button>
        {/if}
      </nav>
    </section>
  {:else if run.result}
    <section class="exam-review">
      <header class="score"><strong>Score: {run.result.score} / {run.result.total}</strong></header>
      {#if capped}{@render cappedNotice(run.session.delivered)}{/if}
      <ol class="review-list">
        {#each run.session.questions as q, i}
          <li>
            <QuestionCard
              instance={q.instance}
              bind:answers={run.answers[i]}
              graded={run.result.perQuestion[i].parts}
              disabled={true}
              showSolution={true}
            />
          </li>
        {/each}
      </ol>
      <div class="review-actions">
        <button type="button" onclick={() => apply(retryExam(ready()))}>Retry (same seed)</button>
        <button type="button" onclick={() => apply(rerollExam(ready(), rollSeed))}>New questions</button>
        <button type="button" onclick={copyLink}>{copied ? 'Copied!' : 'Copy share link'}</button>
      </div>
    </section>
  {/if}
{/if}

<style>
  .exam-error {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    align-items: flex-start;
    max-width: 48ch;
    margin-inline: auto;
    padding: var(--space-lg);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text);
  }

  .exam-error p {
    color: var(--color-error);
    font-weight: var(--font-weight-semibold);
  }

  .exam-run,
  .exam-review {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    max-width: 60ch;
    margin-inline: auto;
  }

  .exam-live {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .notice {
    padding: var(--space-sm) var(--space-md);
    background: var(--color-accent-soft);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text);
    font-size: var(--font-size-label);
  }

  .progress {
    color: var(--color-text-muted);
    font-size: var(--font-size-label);
  }

  nav.pager {
    display: flex;
    justify-content: space-between;
    gap: var(--space-md);
  }

  nav.pager button {
    padding: var(--space-sm) var(--space-lg);
    background: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
    font: inherit;
    font-weight: var(--font-weight-semibold);
    cursor: pointer;
  }

  nav.pager button:hover:not(:disabled) {
    background: var(--color-surface-raised);
    border-color: var(--color-text-muted);
  }

  nav.pager button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  nav.pager button.submit {
    background: var(--color-accent);
    color: var(--color-accent-ink);
    border-color: var(--color-accent);
  }

  nav.pager button.submit:hover {
    background: var(--color-accent-hover);
    border-color: var(--color-accent-hover);
  }

  header.score {
    padding: var(--space-md) var(--space-lg);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text);
    font-size: var(--font-size-heading);
  }

  ol.review-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    padding-left: var(--space-lg);
  }

  ol.review-list li {
    padding-left: var(--space-xs);
  }

  .review-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
  }

  .review-actions button {
    padding: var(--space-sm) var(--space-lg);
    background: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
    font: inherit;
    font-weight: var(--font-weight-semibold);
    cursor: pointer;
  }

  .review-actions button:hover {
    background: var(--color-surface-raised);
    border-color: var(--color-text-muted);
  }
</style>
