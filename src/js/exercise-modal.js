import { createModal } from './modal.js';
import { isFavorite, toggleFavorite } from './favorites-store.js';
import { renderRating } from './rating.js';

function setFavoriteButtonState(root, favorited) {
  const btn = root.querySelector('[data-modal-favorite-toggle]');
  const label = root.querySelector('[data-modal-favorite-label]');

  if (!btn || !label) return;

  btn.dataset.favorited = String(favorited);
  label.textContent = favorited ? 'Remove from favorites' : 'Add to favorites';
}

export function initExerciseModal(root, { storage = window.localStorage } = {}) {
  const modal = createModal(root);
  let currentExercise = null;

  const favoriteBtn = root.querySelector('[data-modal-favorite-toggle]');
  favoriteBtn?.addEventListener('click', () => {
    if (!currentExercise) return;
    toggleFavorite(currentExercise, storage);
    setFavoriteButtonState(root, isFavorite(currentExercise.id, storage));
  });

  function renderMedia(exercise) {
    const mediaEl = root.querySelector('[data-modal-video]');
    if (!mediaEl) return;

    mediaEl.innerHTML = exercise.gifUrl
      ? `<img class="modal__media-img" src="${exercise.gifUrl}" alt="Демонстрація виконання вправи ${exercise.name}" loading="lazy" />`
      : '';
  }

  function renderExercise(exercise) {
    currentExercise = exercise;

    root.querySelector('[data-modal-name]').textContent = exercise.name;
    root.querySelector('[data-modal-target]').textContent = exercise.target;
    root.querySelector('[data-modal-bodypart]').textContent = exercise.bodyPart;
    root.querySelector('[data-modal-popularity]').textContent = exercise.popularity ?? '—';
    root.querySelector('[data-modal-calories]').textContent = exercise.burnedCalories;
    root.querySelector('[data-modal-description]').textContent = exercise.description ?? '';
    renderMedia(exercise);

    const ratingEl = root.querySelector('[data-modal-rating]');
    ratingEl.dataset.rating = String(exercise.rating ?? 0);
    renderRating(ratingEl);

    setFavoriteButtonState(root, isFavorite(exercise.id, storage));
  }

  function open(exercise) {
    renderExercise(exercise);
    modal.open();
  }

  return { open, close: modal.close, isOpen: modal.isOpen };
}
