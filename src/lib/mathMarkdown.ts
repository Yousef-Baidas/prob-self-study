import katex from 'katex';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderText(seg: string): string {
  return escapeHtml(seg).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/** Renders the Ch1–2 surface: inline `$…$` (KaTeX) + `**bold**`. No display math/lists/tables.
 *  Extension point: to support `$$…$$`, add a display-math branch before the inline split. */
export function renderMathMarkdown(src: string): string {
  return src
    .split(/(\$[^$]+\$)/g)
    .map((seg) =>
      seg.length >= 2 && seg.startsWith('$') && seg.endsWith('$')
        ? katex.renderToString(seg.slice(1, -1), { throwOnError: false, displayMode: false })
        : renderText(seg),
    )
    .join('');
}
