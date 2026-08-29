import { getFavorites, removeFavorite } from './favorites-store.js';
import { createExerciseCardHtml } from './templates/exercise-card.js';
import { renderRating } from './rating.js';
import { bindCardKeyboardActivation } from './bind-card-keyboard-activation.js';

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

  bindCardKeyboardActivation(gridEl);

  render();

  return { render };
}
