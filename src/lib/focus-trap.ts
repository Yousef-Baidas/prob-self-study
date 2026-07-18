// Hand-rolled focus-trap helpers for the mobile nav drawer (WAI-ARIA APG
// modal-dialog pattern). No library dependency — a single non-nested dialog
// doesn't need one. `nextTrapIndex` is the pure tab-cycling wrap math
// (unit-tested); `getFocusableElements` touches the DOM (not unit-tested —
// no jsdom in this stack, src/lib/ stays framework-free).

// Next focusable index when Tab (shift=false) / Shift+Tab (shift=true) is
// pressed, wrapping at both ends so focus never escapes or gets stuck.
export function nextTrapIndex(count: number, current: number, shift: boolean): number {
  const delta = shift ? -1 : 1;

  return (current + delta + count) % count;
}

// Every tabbable element inside `container`, in DOM order — the pool
// nextTrapIndex cycles over.
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}
