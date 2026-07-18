import { describe, it, expect } from 'vitest';
import { renderMathMarkdown } from '../../src/lib/mathMarkdown';

describe('renderMathMarkdown', () => {
  it('renders inline math via KaTeX', () => {
    const html = renderMathMarkdown('mean $\\bar{x}=3$.');
    expect(html).toContain('katex');
  });
  it('renders **bold**', () => {
    expect(renderMathMarkdown('a **b** c')).toContain('<strong>b</strong>');
  });
  it('escapes HTML in text segments', () => {
    expect(renderMathMarkdown('1 < 2 & 3')).toContain('1 &lt; 2 &amp; 3');
  });
  it('does not throw on malformed math', () => {
    expect(() => renderMathMarkdown('unbalanced $x + ')).not.toThrow();
  });
});
