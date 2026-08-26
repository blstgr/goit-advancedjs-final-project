import { describe, it, expect } from 'vitest';
import { renderRating } from './rating.js';

function renderInto(rating) {
  document.body.innerHTML = `<div data-rating="${rating}"></div>`;
  const el = document.querySelector('[data-rating]');
  renderRating(el);
  return el;
}

describe('renderRating', () => {
  it('renders 5 stars with none filled for a rating of 0', () => {
    const el = renderInto(0);
    const stars = el.querySelectorAll('.rating__star');

    expect(stars).toHaveLength(5);
    expect(el.querySelectorAll('.rating__star.is-filled')).toHaveLength(0);
  });

  it('fills 4 stars for a rating of 4.0', () => {
    const el = renderInto(4);

    expect(el.querySelectorAll('.rating__star.is-filled')).toHaveLength(4);
  });

  it('rounds a fractional rating to the nearest whole star', () => {
    const el = renderInto(4.6);

    expect(el.querySelectorAll('.rating__star.is-filled')).toHaveLength(5);
  });

  it('shows the numeric value formatted to one decimal', () => {
    const el = renderInto(4);

    expect(el.querySelector('.rating__value').textContent).toBe('4.0');
  });

  it('sets an accessible label describing the rating', () => {
    const el = renderInto(3);

    expect(el.getAttribute('aria-label')).toBe('Рейтинг 3.0 з 5');
  });

  it('renders a single filled star (no 5-star row) when the rating--single modifier is present', () => {
    document.body.innerHTML = `<div class="rating rating--single" data-rating="3.7"></div>`;
    const el = document.querySelector('[data-rating]');
    renderRating(el);

    const stars = el.querySelectorAll('.rating__star');
    expect(stars).toHaveLength(1);
    expect(stars[0].classList.contains('is-filled')).toBe(true);
    expect(el.querySelector('.rating__value').textContent).toBe('3.7');
  });
});
