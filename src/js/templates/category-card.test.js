import { describe, it, expect } from 'vitest';
import { createCategoryCardHtml } from './category-card.js';

describe('createCategoryCardHtml', () => {
  it('renders the name, filter and image into the card markup', () => {
    const html = createCategoryCardHtml({
      name: 'Abs',
      filter: 'Muscles',
      imageUrl: '/src/images/categories/abs.jpg',
    });

    expect(html).toContain('Abs');
    expect(html).toContain('Muscles');
    expect(html).toContain('/src/images/categories/abs.jpg');
    expect(html).toContain('data-category-name="Abs"');
  });

  it('escapes HTML-sensitive characters so injected data cannot break out of markup', () => {
    const html = createCategoryCardHtml({
      name: '<script>alert(1)</script>',
      filter: 'Muscles',
      imageUrl: 'x.jpg',
    });

    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
});
