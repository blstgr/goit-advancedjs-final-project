import { getFavorites, removeFavorite } from './favorites-store.js';
import { createExerciseCardHtml } from './templates/exercise-card.js';
import { renderRating } from './rating.js';

export function initFavoritesPage({ gridEl, emptyEl, modalController }) {
  function render() {
    const favorites = getFavorites();

    emptyEl.hidden = favorites.length > 0;
    gridEl.innerHTML = favorites
      .map((exercise) => createExerciseCardHtml({ ...exercise, showRemoveFromFavorites: true }))
      .join('');
    gridEl.querySelectorAll('[data-rating]').forEach(renderRating);
  }

  gridEl.addEventListener('click', (event) => {
    const removeBtn = event.target.closest('[data-remove-favorite]');
    if (removeBtn) {
      removeFavorite(removeBtn.dataset.removeFavorite);
      render();
      return;
    }

    const openBtn = event.target.closest('[data-open-exercise]');
    if (openBtn) {
      const exercise = getFavorites().find((ex) => ex.id === openBtn.dataset.openExercise);
      if (exercise) modalController.open(exercise);
    }
  });

  // The exercise card is a non-native `role="button"` (it can't be a real
  // <button> — it contains the nested remove-favorite button, and buttons
  // can't nest), so Enter/Space activation has to be wired manually.
  gridEl.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (event.target.closest('[data-remove-favorite]')) return;
    const trigger = event.target.closest('[data-open-exercise]');
    if (!trigger) return;

    event.preventDefault();
    trigger.click();
  });

  render();

  return { render };
}
