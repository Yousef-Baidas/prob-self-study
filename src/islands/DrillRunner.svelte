<script lang="ts">
  import { onMount } from 'svelte';
  import { parseSeed, rollSeed } from '../lib/seed';
  import { parseDrillSpec, buildDrillQuestion, drillPool } from '../modes/drill';
  import type { DrillSpec, DrillQuestion } from '../modes/drill';
  import { gradeInstance, type GivenAnswer } from '../engine/grade';
  import QuestionCard from '../components/practice/QuestionCard.svelte';
  import { joinBase } from '../lib/withBase';

  let spec = $state<DrillSpec | null>(null);
  let index = $state(0);
  let current = $state<DrillQuestion | null>(null);
  let answers = $state<GivenAnswer[]>([]);
  let graded = $state<(boolean | null)[] | null>(null);
  let checked = $state(false);
  let error = $state<'topic' | 'empty' | null>(null);

  let streak = $state(0);
  let best = $state(0);
  let answered = $state(0);
  let correctCount = $state(0);
  const accuracy = $derived(answered === 0 ? 0 : Math.round((correctCount / answered) * 100));

  function bestKey(): string {
    return spec ? `prob-drill:best:${spec.chapter}:${spec.topic}` : '';
  }
  function loadBest() {
    try { best = Number(localStorage.getItem(bestKey())) || 0; } catch { best = 0; }
  }
  function saveBest() {
    try { localStorage.setItem(bestKey(), String(best)); } catch { /* private mode */ }
  }

  function loadQuestion(i: number) {
    if (!spec) return;
    const q = buildDrillQuestion(spec.chapter, spec.topic, spec.seed, i);
    current = q;
    answers = q.instance.parts.map(() => null);
    graded = null;
    checked = false;
  }

  function start(s: DrillSpec) {
    if (drillPool(s.chapter, s.topic).length === 0) { error = 'empty'; return; }
    spec = s;
    index = 0;
    loadBest();
    loadQuestion(0);
  }

  function check() {
    if (!current || checked) return;
    const g = gradeInstance(current.instance, answers);
    graded = g.parts;
    checked = true;
    answered += 1;
    if (g.correct) {
      correctCount += 1;
      streak += 1;
      if (streak > best) { best = streak; saveBest(); }
    } else {
      streak = 0;
    }
  }

  function next() {
    index += 1;
    loadQuestion(index);
  }

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    let chapter = params.get('chapter');
    let topic = params.get('topic');
    const tk = params.get('tk');
    if (tk && (!chapter || !topic)) {
      const [c, t] = tk.split('::');
      chapter = c ?? null;
      topic = t ?? null;
    }
    if (!chapter || !topic) {
      // A run was requested via the URL but couldn't be resolved into a
      // chapter+topic (e.g. a malformed/hand-edited tk). drill.astro already
      // hid the setup panel, so show the error panel instead of a blank page.
      // With no params at all, nothing was requested → the static setup stays.
      if (tk || params.has('chapter') || params.has('topic')) {
        error = 'topic';
        document.getElementById('drill-setup')?.remove();
      }
      return;
    }
    const seed = parseSeed(params.get('seed')) ?? rollSeed();
    const parsed = parseDrillSpec({ chapter, topic }, seed);
    if (!parsed.ok) { error = parsed.reason; document.getElementById('drill-setup')?.remove(); return; }
    const url = new URL(window.location.href);
    url.searchParams.delete('tk');
    url.searchParams.set('chapter', chapter);
    url.searchParams.set('topic', topic);
    url.searchParams.set('seed', String(seed));
    history.replaceState(null, '', url);
    document.getElementById('drill-setup')?.remove();
    start(parsed.spec);
  });
</script>

{#if error}
  <div class="drill-error">
    <p>{error === 'topic' ? 'That topic isn’t available for drilling yet.' : 'No questions match this topic.'}</p>
    <a href={joinBase(import.meta.env.BASE_URL, 'drill')}>Back to setup</a>
  </div>
{:else if spec && current}
  <section class="drill">
    <header class="drill-stats" aria-live="polite">
      <span>Streak <strong>{streak}</strong></span>
      <span>Best <strong>{best}</strong></span>
      <span>Answered <strong>{answered}</strong></span>
      <span>Accuracy <strong>{accuracy}%</strong></span>
    </header>

    <QuestionCard
      instance={current.instance}
      bind:answers
      graded={checked ? graded : null}
      disabled={checked}
      showSolution={checked}
    />

    <nav class="drill-actions">
      {#if !checked}
        <button type="button" class="primary" onclick={check}>Check</button>
      {:else}
        <button type="button" class="primary" onclick={next}>Next question ›</button>
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
