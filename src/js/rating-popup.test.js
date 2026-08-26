import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initRatingPopup } from './rating-popup.js';

function renderPopupMarkup() {
  document.body.innerHTML = `
    <div class="modal" data-rating-popup>
      <div data-modal-backdrop></div>
      <button data-modal-close></button>
      <form data-rating-form novalidate>
        <span data-rating-value>0.0</span>
        <div data-rating-stars></div>
        <input
          name="email"
          type="email"
          required
          pattern="^\\w+(\\.\\w+)?@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$"
        />
        <textarea name="comment"></textarea>
        <button type="submit">Send</button>
        <p data-rating-message></p>
      </form>
    </div>
  `;
  return document.querySelector('[data-rating-popup]');
}

function selectStar(root, value) {
  root.querySelectorAll('[data-rating-stars] button')[value - 1].click();
}

function submitForm(root) {
  root.querySelector('[data-rating-form]').dispatchEvent(
    new Event('submit', { bubbles: true, cancelable: true })
  );
}

const EXERCISE = { id: 'ex-1', name: 'Push-up' };

describe('initRatingPopup', () => {
  let root;

  beforeEach(() => {
    root = renderPopupMarkup();
  });

  it('renders 5 stars, unfilled, at 0.0 when opened', () => {
    const popup = initRatingPopup(root, { rate: vi.fn() });

    popup.open(EXERCISE);

    const stars = root.querySelectorAll('[data-rating-stars] button');
    expect(stars).toHaveLength(5);
    expect(root.querySelectorAll('[data-rating-stars] .is-filled')).toHaveLength(0);
    expect(root.querySelector('[data-rating-value]').textContent).toBe('0.0');
  });

  it('selecting a star updates the value label and fill state', () => {
    const popup = initRatingPopup(root, { rate: vi.fn() });
    popup.open(EXERCISE);

    selectStar(root, 3);

    expect(root.querySelector('[data-rating-value]').textContent).toBe('3.0');
    expect(root.querySelectorAll('[data-rating-stars] .is-filled')).toHaveLength(3);
  });

  it('does not submit when no star has been selected, even with a valid email', async () => {
    const rate = vi.fn();
    const popup = initRatingPopup(root, { rate });
    popup.open(EXERCISE);

    root.querySelector('input[name="email"]').value = 'student@goit.com';
    submitForm(root);
    await Promise.resolve();

    expect(rate).not.toHaveBeenCalled();
  });

  it('does not submit with an invalid email, even with a star selected', async () => {
    const rate = vi.fn();
    const popup = initRatingPopup(root, { rate });
    popup.open(EXERCISE);

    selectStar(root, 4);
    root.querySelector('input[name="email"]').value = 'not-an-email';
    submitForm(root);
    await Promise.resolve();

    expect(rate).not.toHaveBeenCalled();
  });

  it('submits the rating, email and comment, then closes the popup instead of showing a thank-you message', async () => {
    const rate = vi.fn().mockResolvedValue({});
    const onClose = vi.fn();
    const popup = initRatingPopup(root, { rate, onClose });
    popup.open(EXERCISE);

    selectStar(root, 5);
    root.querySelector('input[name="email"]').value = 'student@goit.com';
    root.querySelector('textarea[name="comment"]').value = 'Great exercise!';
    submitForm(root);
    await Promise.resolve();
    await Promise.resolve();

    expect(rate).toHaveBeenCalledWith('ex-1', {
      rate: 5,
      email: 'student@goit.com',
      comment: 'Great exercise!',
    });
    expect(popup.isOpen()).toBe(false);
    expect(onClose).toHaveBeenCalled();
  });

  it('shows an error message when the request fails', async () => {
    const rate = vi.fn().mockRejectedValue(new Error('network error'));
    const popup = initRatingPopup(root, { rate });
    popup.open(EXERCISE);

    selectStar(root, 2);
    root.querySelector('input[name="email"]').value = 'student@goit.com';
    submitForm(root);
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    expect(root.querySelector('[data-rating-message]').textContent).toContain('не так');
  });

  it('resets the star selection and message each time it is reopened', () => {
    const popup = initRatingPopup(root, { rate: vi.fn() });
    popup.open(EXERCISE);
    selectStar(root, 4);
    popup.close();

    popup.open(EXERCISE);

    expect(root.querySelector('[data-rating-value]').textContent).toBe('0.0');
    expect(root.querySelectorAll('[data-rating-stars] .is-filled')).toHaveLength(0);
  });
});
