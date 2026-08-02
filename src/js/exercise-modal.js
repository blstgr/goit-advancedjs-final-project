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

  function renderExercise(exercise) {
    currentExercise = exercise;

    root.querySelector('[data-modal-name]').textContent = exercise.name;
    root.querySelector('[data-modal-target]').textContent = exercise.target;
    root.querySelector('[data-modal-bodypart]').textContent = exercise.bodyPart;
    root.querySelector('[data-modal-popularity]').textContent = exercise.popularity ?? '—';
    root.querySelector('[data-modal-calories]').textContent = exercise.burnedCalories;
    root.querySelector('[data-modal-description]').textContent = exercise.description ?? '';

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

/**
 * Wires every [data-open-exercise] trigger on the page to open the modal.
 * `getExerciseById` is injected so this can start with an in-memory sample
 * dataset today and swap in a real `GET /exercises/{id}` call later without
 * touching this wiring.
 */
export function initExerciseModalDelegation(modalController, getExerciseById) {
  document.addEventListener('click', async (event) => {
    const trigger = event.target.closest('[data-open-exercise]');
    if (!trigger) return;

    const exercise = await getExerciseById(trigger.dataset.openExercise);
    if (exercise) modalController.open(exercise);
  });
}
