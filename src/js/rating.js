import iconStar from '/src/images/icon-star.svg';
import iconStarFilled from '/src/images/icon-star-filled.svg';

export const MAX_STARS = 5;

function starImgHtml(isFilled) {
  return `<img class="rating__star${isFilled ? ' is-filled' : ''}" src="${isFilled ? iconStarFilled : iconStar}" alt="" />`;
}

export function renderRating(el) {
  const value = Number(el.dataset.rating) || 0;
  const roundedValue = Math.round(value);
  const isSingleStar = el.classList.contains('rating--single');

  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', `Рейтинг ${value.toFixed(1)} з ${MAX_STARS}`);

  const labelHtml = `<span class="rating__value">${value.toFixed(1)}</span>`;

  if (isSingleStar) {
    el.innerHTML = labelHtml + starImgHtml(true);
    return;
  }

  const starsHtml = Array.from({ length: MAX_STARS }, (_, i) => starImgHtml(i < roundedValue)).join('');
  el.innerHTML = `${labelHtml}<span class="rating__stars">${starsHtml}</span>`;
}

export function initAllRatings() {
  document.querySelectorAll('[data-rating]').forEach(renderRating);
}
