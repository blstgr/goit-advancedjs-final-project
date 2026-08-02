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

  it('disables the prev/first buttons on page 1', () => {
    const html = createPaginationHtml(1, 10);
    const firstBtnMatch = html.match(/data-page="1"[^>]*disabled[^>]*>/);
    expect(firstBtnMatch).toBeTruthy();
  });

  it('disables the next/last buttons on the last page', () => {
    const html = createPaginationHtml(10, 10);
    expect(html).toContain(`data-page="11" disabled`);
    expect(html).toContain(`data-page="10" disabled`);
  });

  it('does not disable prev/next in the middle of the range', () => {
    const html = createPaginationHtml(5, 10);
    expect(html).not.toContain('disabled');
  });
});
