import { describe, it, expect, vi } from 'vitest';
import { initFilters } from './filters.js';

function renderFilters() {
  document.body.innerHTML = `
    <div data-filters>
      <button class="filters__btn is-active" data-filter="Muscles">Muscles</button>
      <button class="filters__btn" data-filter="Body parts">Body parts</button>
      <button class="filters__btn" data-filter="Equipment">Equipment</button>
    </div>
  `;
  return document.querySelector('[data-filters]');
}

describe('initFilters', () => {
  it('marks the clicked filter active and the rest inactive', () => {
    const filtersEl = renderFilters();
    initFilters(filtersEl);
    const buttons = filtersEl.querySelectorAll('.filters__btn');

    buttons[2].click();

    expect(buttons[0].classList.contains('is-active')).toBe(false);
    expect(buttons[2].classList.contains('is-active')).toBe(true);
  });

  it('sets aria-pressed on the clicked filter and clears it on the rest', () => {
    const filtersEl = renderFilters();
    initFilters(filtersEl);
    const buttons = filtersEl.querySelectorAll('.filters__btn');

    buttons[2].click();

    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[2].getAttribute('aria-pressed')).toBe('true');
  });

  it('dispatches a filterchange event with the selected filter name', () => {
    const filtersEl = renderFilters();
    initFilters(filtersEl);
    const buttons = filtersEl.querySelectorAll('.filters__btn');
    const handler = vi.fn();

    filtersEl.addEventListener('filterchange', handler);
    buttons[1].click();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].detail).toEqual({ filter: 'Body parts' });
  });
});
