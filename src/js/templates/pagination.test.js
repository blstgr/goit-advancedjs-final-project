import { describe, it, expect } from 'vitest';
import { createPaginationHtml } from './pagination.js';

describe('createPaginationHtml', () => {
  it('renders nothing when there is one page or fewer', () => {
    expect(createPaginationHtml(1, 1)).toBe('');
    expect(createPaginationHtml(1, 0)).toBe('');
  });

  it('marks the current page number as active', () => {
    const html = createPaginationHtml(3, 10);
    expect(html).toContain('data-page="3">3</button>');
    expect(html).toMatch(/pagination__num is-active" type="button" data-page="3"/);
  });

  it('renders an ellipsis for gaps in the middle of a long range', () => {
    const html = createPaginationHtml(5, 10);
    expect(html).toContain('pagination__ellipsis');
  });

  it('renders every page as a plain number when they all fit, with no ellipsis', () => {
    const html = createPaginationHtml(1, 2);
    expect(html).not.toContain('pagination__ellipsis');
    expect(html).toContain('data-page="1"');
    expect(html).toContain('data-page="2"');
  });
});
