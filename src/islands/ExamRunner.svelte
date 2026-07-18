<script lang="ts">
  import { onMount } from 'svelte';
  import { parseSeed, rollSeed } from '../lib/seed';
  import { parseExamSpec, buildExamSession, gradeExamSession } from '../modes/exam';
  import type { ExamSession, ExamResult } from '../modes/types';
  import type { GivenAnswer } from '../engine/grade';
  import QuestionCard from '../components/practice/QuestionCard.svelte';
  import { joinBase } from '../lib/withBase';

  // No props: the site is statically generated, so Astro cannot pass query params in.
  // The island reads the run spec from the URL at mount.
  let raw = $state<{ chapter: string | null; source: string | null; count: string | null }>({ chapter: null, source: null, count: null });
  let session = $state<ExamSession | null>(null);
  let error = $state<'chapter' | 'source' | 'empty' | null>(null);
  let index = $state(0);
  let answers = $state<GivenAnswer[][]>([]);
  let phase = $state<'attempt' | 'graded'>('attempt');
  let result = $state<ExamResult | null>(null);
  let copied = $state(false);

  function start(seed: number) {
    const parsed = parseExamSpec(raw, seed);
    if (!parsed.ok) { error = parsed.reason; return; }
    const s = buildExamSession(parsed.spec);
    if (s.delivered === 0) { error = 'empty'; return; }
    session = s;
    index = 0;
    answers = s.questions.map((q) => q.instance.parts.map(() => null));
  }

  function saveLastScore(chapter: string, score: number, total: number, seed: number) {
    try {
      localStorage.setItem(`prob-exam:lastScore:${chapter}`, JSON.stringify({ score, total, seed, at: Date.now() }));
    } catch { /* private mode: skip persistence */ }
  }

  function submit() {
    if (!session) return;
    result = gradeExamSession(session, answers);
    phase = 'graded';
    saveLastScore(session.spec.chapter, result.score, result.total, session.spec.seed);
  }

  function retrySame() {
    if (!session) return;
    answers = session.questions.map((q) => q.instance.parts.map(() => null));
    index = 0; result = null; phase = 'attempt';
  }

  function rollNew() {
    const seed = rollSeed();
    const url = new URL(window.location.href);
    url.searchParams.set('seed', String(seed));
    history.replaceState(null, '', url);
    result = null; phase = 'attempt';
    start(seed); // rebuild with the fresh seed
  }

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      copied = true;
      setTimeout(() => { copied = false; }, 2000);
    }).catch(() => {});
  }

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('chapter')) return; // no run requested → static setup stays visible, island idle
    raw = { chapter: params.get('chapter'), source: params.get('source'), count: params.get('count') };
    const seed = parseSeed(params.get('seed')) ?? rollSeed();
    // write the resolved seed back so the URL is shareable/reproducible
    const url = new URL(window.location.href);
    url.searchParams.set('seed', String(seed));
    history.replaceState(null, '', url);
    // ensure the static setup form is gone once we take over
    document.getElementById('exam-setup')?.remove();
    start(seed);
  });

  const atFirst = $derived(index === 0);
  const atLast = $derived(!!session && index === session.questions.length - 1);
</script>

{#if error}
  <div class="exam-error">
    <p>
      {#if error === 'chapter'}That chapter isn’t available yet.
      {:else if error === 'source'}That question source isn’t valid.
      {:else}No questions match this selection.{/if}
    </p>
    <a href={joinBase(import.meta.env.BASE_URL, 'exam')}>Back to setup</a>
  </div>
{:else if session}
  {#if phase === 'attempt'}
    <section class="exam-run">
      {#if session.capped && session.spec.source === 'book'}
        <p class="notice">This chapter has {session.delivered} book question{session.delivered === 1 ? '' : 's'}.</p>
      {/if}
      <div class="exam-live" aria-live="polite">
        <p class="progress">Question {index + 1} / {session.questions.length}</p>

        <QuestionCard instance={session.questions[index].instance} bind:answers={answers[index]} />
      </div>

      <nav class="pager">
        <button type="button" onclick={() => (index -= 1)} disabled={atFirst}>‹ Prev</button>
        {#if atLast}
          <button type="button" class="submit" onclick={submit}>Submit</button>
        {:else}
          <button type="button" onclick={() => (index += 1)}>Next ›</button>
        {/if}
      </nav>
    </section>
  {:else if phase === 'graded' && session && result}
    <section class="exam-review">
      <header class="score"><strong>Score: {result.score} / {result.total}</strong></header>
      {#if session.capped && session.spec.source === 'book'}
        <p class="notice">This chapter has {session.delivered} book question{session.delivered === 1 ? '' : 's'}.</p>
      {/if}
      <ol class="review-list">
        {#each session.questions as q, i}
          <li>
            <QuestionCard
              instance={q.instance}
              bind:answers={answers[i]}
              graded={result.perQuestion[i].parts}
              disabled={true}
              showSolution={true}
            />
          </li>
        {/each}
      </ol>
      <div class="review-actions">
        <button type="button" onclick={retrySame}>Retry (same seed)</button>
        <button type="button" onclick={rollNew}>New questions</button>
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
