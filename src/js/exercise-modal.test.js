import { describe, it, expect, beforeEach } from 'vitest';
import { initExerciseModal } from './exercise-modal.js';

function createMemoryStorage() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, value),
  };
}

function renderModalMarkup() {
  document.body.innerHTML = `
    <div class="modal" data-exercise-modal>
      <div data-modal-backdrop></div>
      <button data-modal-close></button>
      <h2 data-modal-name></h2>
      <div data-modal-rating></div>
      <span data-modal-target></span>
      <span data-modal-bodypart></span>
      <span data-modal-popularity></span>
      <span data-modal-calories></span>
      <p data-modal-description></p>
      <button data-modal-favorite-toggle data-favorited="false">
        <span data-modal-favorite-label>Add to favorites</span>
      </button>
    </div>
  `;
  return document.querySelector('[data-exercise-modal]');
}

const EXERCISE = {
  id: 'ex-1',
  name: 'Push-up',
  target: 'Pectorals',
  bodyPart: 'Chest',
  popularity: '87%',
  burnedCalories: 8,
  rating: 4,
  description: 'A classic bodyweight exercise.',
};

describe('initExerciseModal', () => {
  let root;
  let storage;

  beforeEach(() => {
    root = renderModalMarkup();
    storage = createMemoryStorage();
  });

  it('opens and populates the exercise details', () => {
    const modal = initExerciseModal(root, { storage });

    modal.open(EXERCISE);

    expect(modal.isOpen()).toBe(true);
    expect(root.querySelector('[data-modal-name]').textContent).toBe('Push-up');
    expect(root.querySelector('[data-modal-target]').textContent).toBe('Pectorals');
    expect(root.querySelector('[data-modal-calories]').textContent).toBe('8');
  });

  it('starts the favorite button in the "Add to favorites" state', () => {
    const modal = initExerciseModal(root, { storage });

    modal.open(EXERCISE);

    expect(root.querySelector('[data-modal-favorite-label]').textContent).toBe(
      'Add to favorites'
    );
  });

  it('switches to "Remove from favorites" and persists to storage on click', () => {
    const modal = initExerciseModal(root, { storage });
    modal.open(EXERCISE);

    root.querySelector('[data-modal-favorite-toggle]').click();

    expect(root.querySelector('[data-modal-favorite-label]').textContent).toBe(
      'Remove from favorites'
    );
    expect(JSON.parse(storage.getItem('yourEnergyFavorites'))).toEqual([EXERCISE]);
  });

  it('toggles back to "Add to favorites" on a second click', () => {
    const modal = initExerciseModal(root, { storage });
    modal.open(EXERCISE);

    const favoriteBtn = root.querySelector('[data-modal-favorite-toggle]');
    favoriteBtn.click();
    favoriteBtn.click();

    expect(root.querySelector('[data-modal-favorite-label]').textContent).toBe(
      'Add to favorites'
    );
    expect(JSON.parse(storage.getItem('yourEnergyFavorites'))).toEqual([]);
  });

  it('reflects an already-favorited exercise when reopened', () => {
    const modal = initExerciseModal(root, { storage });
    modal.open(EXERCISE);
    root.querySelector('[data-modal-favorite-toggle]').click();
    modal.close();

    modal.open(EXERCISE);

    expect(root.querySelector('[data-modal-favorite-label]').textContent).toBe(
      'Remove from favorites'
    );
  });
});
