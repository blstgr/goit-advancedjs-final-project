import { createModal } from './modal.js';
import { MAX_STARS } from './rating.js';
import iconStar from '/src/images/icon-star.svg';
import iconStarFilled from '/src/images/icon-star-filled.svg';

function starButtonHtml(value) {
  return `<button type="button" class="rating-input__star" data-star-value="${value}" aria-label="Оцінити на ${value} з ${MAX_STARS}"><img src="${iconStar}" alt="" /></button>`;
}

export function initRatingPopup(root, { rate, onClose } = {}) {
  const modal = createModal(root, { onClose });
  let currentExercise = null;
  let selectedRating = 0;

  // Bumped every time the popup is (re)opened, so a still-in-flight submit
  // from a previous session can tell (once it resolves) that it's stale and
  // must not reset/close what is now a different, newer session.
  let sessionToken = 0;
  let isSubmitting = false;

  const starsEl = root.querySelector('[data-rating-stars]');
  const valueEl = root.querySelector('[data-rating-value]');
  const form = root.querySelector('[data-rating-form]');
  const messageEl = root.querySelector('[data-rating-message]');

  // Stars are built once and toggled in place (not rebuilt per click) so a
  // keyboard user's focus stays on the star they just activated; one
  // delegated listener on starsEl (not one per star) handles selection.
  let starButtons = [];
  if (starsEl) {
    starsEl.innerHTML = Array.from({ length: MAX_STARS }, (_, i) => starButtonHtml(i + 1)).join('');
    starButtons = Array.from(starsEl.querySelectorAll('.rating-input__star'));

    starsEl.addEventListener('click', (event) => {
      const btn = event.target.closest('.rating-input__star');
      if (btn) setRating(Number(btn.dataset.starValue));
    });
  }

  function setRating(value) {
    selectedRating = value;
    if (valueEl) valueEl.textContent = value.toFixed(1);

    starButtons.forEach((btn, index) => {
      const isFilled = index + 1 <= value;
      btn.classList.toggle('is-filled', isFilled);
      btn.querySelector('img').src = isFilled ? iconStarFilled : iconStar;
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.checkValidity() || selectedRating === 0) {
      form.reportValidity();
      return;
    }
    if (!currentExercise || isSubmitting) return;

    const token = sessionToken;
    isSubmitting = true;

    const email = new FormData(form).get('email')?.toString().trim();
    const comment = new FormData(form).get('comment')?.toString().trim();

    try {
      await rate(currentExercise.id, { rate: selectedRating, email, comment });
      if (token !== sessionToken) return;
      form.reset();
      setRating(0);
      modal.close();
    } catch {
      if (token !== sessionToken) return;
      if (messageEl) messageEl.textContent = 'Щось пішло не так. Спробуйте ще раз.';
    } finally {
      if (token === sessionToken) isSubmitting = false;
    }
  });

  function open(exercise, trigger) {
    currentExercise = exercise;
    sessionToken += 1;
    isSubmitting = false;
    if (messageEl) messageEl.textContent = '';
    form.reset();
    setRating(0);
    modal.open(trigger);
  }

  return { open, close: modal.close, isOpen: modal.isOpen };
}
