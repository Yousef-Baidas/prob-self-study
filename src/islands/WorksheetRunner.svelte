<script lang="ts">
  import { onMount } from 'svelte';
  import { parseSeed, rollSeed } from '../lib/seed';
  import { parseWorksheetSpec, buildWorksheetSession } from '../modes/worksheet';
  import type { WorksheetSession } from '../modes/worksheet';
  import QuestionCard from '../components/practice/QuestionCard.svelte';
  import SolutionSteps from '../components/practice/SolutionSteps.svelte';
  import { joinBase } from '../lib/withBase';

  let session = $state<WorksheetSession | null>(null);
  let error = $state<'chapter' | 'source' | 'topic' | 'empty' | null>(null);
  let printMode = $state<'questions' | 'both' | 'key'>('both');
  let copied = $state(false);

  function start(seed: number) {
    const params = new URLSearchParams(window.location.search);
    const raw = {
      chapter: params.get('chapter'),
      topic: params.get('topic'),
      source: params.get('source'),
      count: params.get('count'),
    };
    const parsed = parseWorksheetSpec(raw, seed);
    if (!parsed.ok) { error = parsed.reason; return; }
    const s = buildWorksheetSession(parsed.spec);
    if (s.delivered === 0) { error = 'empty'; return; }
    session = s;
  }

  function revealAll(open: boolean) {
    document
      .querySelectorAll<HTMLDetailsElement>('.worksheet-questions details.solution')
      .forEach((d) => (d.open = open));
  }

  function rollNew() {
    const seed = rollSeed();
    const url = new URL(window.location.href);
    url.searchParams.set('seed', String(seed));
    history.replaceState(null, '', url);
    session = null; error = null;
    start(seed);
  }

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      copied = true;
      setTimeout(() => { copied = false; }, 2000);
    }).catch(() => {});
  }

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('chapter')) return;
    const seed = parseSeed(params.get('seed')) ?? rollSeed();
    const url = new URL(window.location.href);
    url.searchParams.set('seed', String(seed));
    history.replaceState(null, '', url);
    document.getElementById('worksheet-setup')?.remove();
    start(seed);
  });
</script>

{#if error}
  <div class="ws-error">
    <p>
      {#if error === 'chapter'}That chapter isn’t available yet.
      {:else if error === 'topic'}That topic isn’t in this chapter.
      {:else if error === 'source'}That question source isn’t valid.
      {:else}No questions match this selection.{/if}
    </p>
    <a href={joinBase(import.meta.env.BASE_URL, 'worksheet')}>Back to setup</a>
  </div>
{:else if session}
  <section
    class="worksheet"
    class:print-questions-only={printMode === 'questions'}
    class:print-with-key={printMode === 'both'}
    class:print-key-only={printMode === 'key'}
  >
    <div class="ws-toolbar no-print">
      <button type="button" onclick={() => revealAll(true)}>Reveal all</button>
      <button type="button" onclick={() => revealAll(false)}>Collapse all</button>
      <label class="print-select">Print
        <select bind:value={printMode}>
          <option value="questions">Questions only</option>
          <option value="both">Questions + answer key</option>
          <option value="key">Answer key only</option>
        </select>
      </label>
      <button type="button" onclick={() => window.print()}>Print</button>
      <button type="button" onclick={rollNew}>New questions</button>
      <button type="button" onclick={copyLink}>{copied ? 'Copied!' : 'Copy link'}</button>
    </div>

    {#if session.capped && session.spec.source === 'book'}
      <p class="notice no-print">This selection has {session.delivered} book question{session.delivered === 1 ? '' : 's'}.</p>
    {/if}

    <ol class="worksheet-questions">
      {#each session.questions as q}
        <li><QuestionCard instance={q.instance} answerable={false} showSolution={true} solutionOpen={false} /></li>
      {/each}
    </ol>

    <section class="solution-bank">
      <h2>Solutions</h2>
      <ol>
        {#each session.questions as q}
          <li><SolutionSteps steps={q.instance.solution} /></li>
        {/each}
      </ol>
    </section>
  </section>
{/if}

<style>
  .worksheet { max-width: 60ch; margin-inline: auto; display: flex; flex-direction: column; gap: var(--space-lg); }
  .ws-toolbar { display: flex; flex-wrap: wrap; gap: var(--space-sm); align-items: center; }
  .ws-toolbar button {
    padding: var(--space-sm) var(--space-md); background: var(--color-surface); color: var(--color-text);
    border: 1px solid var(--color-border); border-radius: var(--radius-pill); font: inherit;
    font-weight: var(--font-weight-semibold); cursor: pointer;
  }
  .ws-toolbar button:hover { background: var(--color-surface-raised); border-color: var(--color-text-muted); }
  .print-select { display: inline-flex; align-items: center; gap: var(--space-xs); color: var(--color-text-muted); font-size: var(--font-size-label); }
  .print-select select { font: inherit; color: var(--color-text); background: var(--color-surface-raised); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: var(--space-xs) var(--space-sm); }
  ol.worksheet-questions { list-style: decimal; padding-left: var(--space-lg); display: flex; flex-direction: column; gap: var(--space-lg); }
  .notice { padding: var(--space-sm) var(--space-md); background: var(--color-accent-soft); border: 1px solid var(--color-border); border-radius: var(--radius-sm); color: var(--color-text); font-size: var(--font-size-label); }
  .solution-bank { border-top: 1px solid var(--color-border); padding-top: var(--space-lg); }
  .solution-bank h2 { font-size: var(--font-size-heading); margin-bottom: var(--space-md); }
  .solution-bank ol { list-style: decimal; padding-left: var(--space-lg); display: flex; flex-direction: column; gap: var(--space-lg); }
  .ws-error { display: flex; flex-direction: column; gap: var(--space-sm); align-items: flex-start; max-width: 48ch; margin-inline: auto; padding: var(--space-lg); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text); }
  .ws-error p { color: var(--color-error); font-weight: var(--font-weight-semibold); }
</style>
