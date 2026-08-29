import iconStar from '/src/images/icon-star.svg';
import iconStarFilled from '/src/images/icon-star-filled.svg';

export const MAX_STARS = 5;

function createStarImg(isFilled) {
  const img = document.createElement('img');
  img.className = `rating__star${isFilled ? ' is-filled' : ''}`;
  img.src = isFilled ? iconStarFilled : iconStar;
  img.alt = '';
  return img;
}

export function renderRating(el) {
  const value = Number(el.dataset.rating) || 0;
  const roundedValue = Math.round(value);
  const isSingleStar = el.classList.contains('rating--single');

  el.innerHTML = '';
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', `Рейтинг ${value.toFixed(1)} з ${MAX_STARS}`);

  const label = document.createElement('span');
  label.className = 'rating__value';
  label.textContent = value.toFixed(1);
  el.appendChild(label);

  if (isSingleStar) {
    el.appendChild(createStarImg(true));
    return;
  }

  const starsWrap = document.createElement('span');
  starsWrap.className = 'rating__stars';

  for (let i = 0; i < MAX_STARS; i += 1) {
    starsWrap.appendChild(createStarImg(i < roundedValue));
  }

  el.appendChild(starsWrap);
}

export function initAllRatings() {
  document.querySelectorAll('[data-rating]').forEach(renderRating);
}
