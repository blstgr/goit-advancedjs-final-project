import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initExerciseModal } from './exercise-modal.js';
import { initRatingPopup } from './rating-popup.js';
import iconTrash from '/src/images/icon-trash.svg';
import iconHeart from '/src/images/icon-heart.svg';

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
      <span data-modal-equipment></span>
      <span data-modal-popularity></span>
      <span data-modal-calories></span>
      <p data-modal-description></p>
      <div data-modal-video></div>
      <button data-modal-favorite-toggle data-favorited="false">
        <span data-modal-favorite-label>Add to favorites</span>
        <img data-modal-favorite-icon src="/src/images/icon-heart.svg" />
      </button>
      <button data-modal-give-rating>Give a rating</button>
    </div>
  `;
  return document.querySelector('[data-exercise-modal]');
}

const EXERCISE = {
  id: 'ex-1',
  name: 'Push-up',
  target: 'Pectorals',
  bodyPart: 'Chest',
  equipment: 'Body weight',
  popularity: '87%',
  burnedCalories: 8,
  rating: 4,
  description: 'A classic bodyweight exercise.',
  gifUrl: 'https://ftp.goit.study/img/power-pulse/gifs/push-up.gif',
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
    expect(root.querySelector('[data-modal-equipment]').textContent).toBe('Body weight');
    expect(root.querySelector('[data-modal-calories]').textContent).toBe('8');
  });

  it('renders the demonstration gif from the exercise data', () => {
    const modal = initExerciseModal(root, { storage });

    modal.open(EXERCISE);

    const img = root.querySelector('[data-modal-video] img');
    expect(img.getAttribute('src')).toBe(EXERCISE.gifUrl);
  });

  it('renders no media element when the exercise has no gifUrl', () => {
    const modal = initExerciseModal(root, { storage });

    modal.open({ ...EXERCISE, gifUrl: undefined });

    expect(root.querySelector('[data-modal-video] img')).toBeNull();
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

  it('calls onFavoriteChange so callers (e.g. the favorites grid) can refresh themselves', () => {
    const onFavoriteChange = vi.fn();
    const modal = initExerciseModal(root, { storage, onFavoriteChange });
    modal.open(EXERCISE);

    root.querySelector('[data-modal-favorite-toggle]').click();
    expect(onFavoriteChange).toHaveBeenCalledTimes(1);

    root.querySelector('[data-modal-favorite-toggle]').click();
    expect(onFavoriteChange).toHaveBeenCalledTimes(2);
  });

  it('swaps the icon from heart to trash when favorited, and back on un-favorite', () => {
    const modal = initExerciseModal(root, { storage });
    modal.open(EXERCISE);
    const icon = root.querySelector('[data-modal-favorite-icon]');
    const favoriteBtn = root.querySelector('[data-modal-favorite-toggle]');

    expect(icon.getAttribute('src')).toBe(iconHeart);

    favoriteBtn.click();
    expect(icon.getAttribute('src')).toBe(iconTrash);

    favoriteBtn.click();
    expect(icon.getAttribute('src')).toBe(iconHeart);
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

  it('opens the rating popup for the current exercise when "Give a rating" is clicked, passing the button as the focus-restore trigger', () => {
    const ratingPopup = { open: vi.fn(), close: vi.fn() };
    const modal = initExerciseModal(root, { storage, ratingPopup });
    modal.open(EXERCISE);

    const giveRatingBtn = root.querySelector('[data-modal-give-rating]');
    giveRatingBtn.click();

    expect(ratingPopup.open).toHaveBeenCalledWith(EXERCISE, giveRatingBtn);
  });

  it('returns focus to the "Give a rating" button once the rating popup completes and closes', async () => {
    document.body.insertAdjacentHTML(
      'beforeend',
      `
        <div class="modal" data-rating-popup>
          <div data-modal-backdrop></div>
          <button data-modal-close></button>
          <form data-rating-form novalidate>
            <span data-rating-value>0.0</span>
            <div data-rating-stars></div>
            <input name="email" type="email" required pattern="^\\w+(\\.\\w+)?@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$" />
            <textarea name="comment"></textarea>
            <button type="submit">Send</button>
            <p data-rating-message></p>
          </form>
        </div>
      `
    );
    const ratingPopupRoot = document.querySelector('[data-rating-popup]');
    const ratingPopup = initRatingPopup(ratingPopupRoot, { rate: vi.fn().mockResolvedValue({}) });
    const modal = initExerciseModal(root, { storage, ratingPopup });
    modal.open(EXERCISE);

    const giveRatingBtn = root.querySelector('[data-modal-give-rating]');
    giveRatingBtn.click();
    expect(ratingPopup.isOpen()).toBe(true);

    ratingPopupRoot.querySelectorAll('[data-rating-stars] button')[4].click();
    ratingPopupRoot.querySelector('input[name="email"]').value = 'student@goit.com';
    ratingPopupRoot
      .querySelector('[data-rating-form]')
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await Promise.resolve();
    await Promise.resolve();

    expect(ratingPopup.isOpen()).toBe(false);
    expect(document.activeElement).toBe(giveRatingBtn);
  });

  it('closes the rating popup when the exercise modal itself is closed', () => {
    const ratingPopup = { open: vi.fn(), close: vi.fn() };
    const modal = initExerciseModal(root, { storage, ratingPopup });
    modal.open(EXERCISE);

    modal.close();

    expect(ratingPopup.close).toHaveBeenCalled();
  });
});
