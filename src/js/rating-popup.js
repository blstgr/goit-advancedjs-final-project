import { createModal } from './modal.js';
import iconStar from '/src/images/icon-star.svg';
import iconStarFilled from '/src/images/icon-star-filled.svg';

const MAX_STARS = 5;

function createStarButton(value, onSelect) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'rating-input__star';
  btn.setAttribute('aria-label', `Оцінити на ${value} з ${MAX_STARS}`);

  const img = document.createElement('img');
  img.src = iconStar;
  img.alt = '';
  btn.appendChild(img);

  btn.addEventListener('click', () => onSelect(value));
  return btn;
}

export function initRatingPopup(root, { rate, onClose } = {}) {
  const modal = createModal(root, { onClose });
  let currentExercise = null;
  let selectedRating = 0;

  const starsEl = root.querySelector('[data-rating-stars]');
  const valueEl = root.querySelector('[data-rating-value]');
  const form = root.querySelector('[data-rating-form]');
  const messageEl = root.querySelector('[data-rating-message]');

  // Stars are built once and toggled in place (not rebuilt per click) so a keyboard user's focus stays on the star they just activated.
  const starButtons = [];
  if (starsEl) {
    for (let i = 1; i <= MAX_STARS; i += 1) {
      const btn = createStarButton(i, setRating);
      starsEl.appendChild(btn);
      starButtons.push(btn);
    }
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
    if (!currentExercise) return;

    const email = new FormData(form).get('email')?.toString().trim();
    const comment = new FormData(form).get('comment')?.toString().trim();

    try {
      await rate(currentExercise.id, { rate: selectedRating, email, comment });
      form.reset();
      setRating(0);
      modal.close();
    } catch {
      if (messageEl) messageEl.textContent = 'Щось пішло не так. Спробуйте ще раз.';
    }
  });

  function open(exercise) {
    currentExercise = exercise;
    if (messageEl) messageEl.textContent = '';
    form.reset();
    setRating(0);
    modal.open();
  }

  return { open, close: modal.close, isOpen: modal.isOpen };
}
