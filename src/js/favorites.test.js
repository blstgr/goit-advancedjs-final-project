import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initFavoritesPage } from './favorites.js';
import { addFavorite } from './favorites-store.js';

function renderPage() {
  document.body.innerHTML = `
    <p data-empty hidden>No favorites yet.</p>
    <div data-grid></div>
  `;
  return {
    gridEl: document.querySelector('[data-grid]'),
    emptyEl: document.querySelector('[data-empty]'),
  };
}

const EXERCISE = {
  id: 'ex-1',
  name: 'Push-up',
  bodyPart: 'Chest',
  target: 'Pectorals',
  burnedCalories: 8,
  rating: 4,
};

describe('initFavoritesPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows the empty state when there are no favorites', () => {
    const { gridEl, emptyEl } = renderPage();
    initFavoritesPage({ gridEl, emptyEl, modalController: { open: vi.fn() } });

    expect(emptyEl.hidden).toBe(false);
    expect(gridEl.innerHTML).toBe('');
  });

  it('renders a card with a remove button for each favorited exercise', () => {
    addFavorite(EXERCISE);
    const { gridEl, emptyEl } = renderPage();
    initFavoritesPage({ gridEl, emptyEl, modalController: { open: vi.fn() } });

    expect(emptyEl.hidden).toBe(true);
    expect(gridEl.querySelector('[data-remove-favorite="ex-1"]')).toBeTruthy();
  });

  it('removes a favorite and re-renders back to the empty state', () => {
    addFavorite(EXERCISE);
    const { gridEl, emptyEl } = renderPage();
    initFavoritesPage({ gridEl, emptyEl, modalController: { open: vi.fn() } });

    gridEl.querySelector('[data-remove-favorite="ex-1"]').click();

    expect(emptyEl.hidden).toBe(false);
    expect(gridEl.querySelector('[data-exercise-id]')).toBeNull();
  });

  it('opens the modal with the matching favorited exercise on Start click', () => {
    addFavorite(EXERCISE);
    const { gridEl, emptyEl } = renderPage();
    const open = vi.fn();
    initFavoritesPage({ gridEl, emptyEl, modalController: { open } });

    gridEl.querySelector('[data-open-exercise="ex-1"]').click();

    expect(open).toHaveBeenCalledWith(EXERCISE);
  });
});
