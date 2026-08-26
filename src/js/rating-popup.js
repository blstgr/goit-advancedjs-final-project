import { createModal } from './modal.js';

const MAX_STARS = 5;

function createStarButton(value, isFilled, onSelect) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `rating-input__star${isFilled ? ' is-filled' : ''}`;
  btn.setAttribute('aria-label', `Оцінити на ${value} з ${MAX_STARS}`);

  const img = document.createElement('img');
  img.src = isFilled ? '/src/images/icon-star-filled.svg' : '/src/images/icon-star.svg';
  img.alt = '';
  btn.appendChild(img);

  btn.addEventListener('click', () => onSelect(value));
  return btn;
}

export function initRatingPopup(root, { rate, onClose }) {
  const modal = createModal(root, { onClose });
  let currentExercise = null;
  let selectedRating = 0;

  const starsEl = root.querySelector('[data-rating-stars]');
  const valueEl = root.querySelector('[data-rating-value]');
  const form = root.querySelector('[data-rating-form]');
  const messageEl = root.querySelector('[data-rating-message]');

  function setRating(value) {
    selectedRating = value;
    if (valueEl) valueEl.textContent = value.toFixed(1);

    starsEl.innerHTML = '';
    for (let i = 1; i <= MAX_STARS; i += 1) {
      starsEl.appendChild(createStarButton(i, i <= value, setRating));
    }
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
