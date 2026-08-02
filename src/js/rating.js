const STAR_PATH =
  'M5.53268 0.690983C5.83204 -0.230327 7.13545 -0.230328 7.4348 0.690982L8.27985 3.29179C8.41373 3.70382 8.79768 3.98278 9.23091 3.98278H11.9656C12.9343 3.98278 13.3371 5.22239 12.5534 5.7918L10.341 7.39919C9.99048 7.65383 9.84382 8.1052 9.9777 8.51722L10.8228 11.118C11.1221 12.0393 10.0676 12.8055 9.28391 12.2361L7.07153 10.6287C6.72104 10.374 6.24644 10.374 5.89596 10.6287L3.68357 12.2361C2.89986 12.8055 1.84538 12.0393 2.14473 11.118L2.98978 8.51722C3.12366 8.1052 2.977 7.65383 2.62651 7.39919L0.414132 5.7918C-0.369582 5.22239 0.0331929 3.98278 1.00192 3.98278H3.73657C4.1698 3.98278 4.55375 3.70382 4.68763 3.2918L5.53268 0.690983Z';
const MAX_STARS = 5;

function createStarSvg(isFilled) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');

  svg.setAttribute('viewBox', '0 0 13 13');
  svg.setAttribute('class', `rating__star${isFilled ? ' is-filled' : ''}`);
  svg.setAttribute('aria-hidden', 'true');

  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', STAR_PATH);
  path.setAttribute('fill', 'currentColor');
  svg.appendChild(path);

  return svg;
}

export function renderRating(el) {
  const value = Number(el.dataset.rating) || 0;
  const roundedValue = Math.round(value);

  el.innerHTML = '';
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', `Рейтинг ${value.toFixed(1)} з ${MAX_STARS}`);

  const label = document.createElement('span');
  label.className = 'rating__value';
  label.textContent = value.toFixed(1);
  el.appendChild(label);

  const starsWrap = document.createElement('span');
  starsWrap.className = 'rating__stars';

  for (let i = 0; i < MAX_STARS; i += 1) {
    starsWrap.appendChild(createStarSvg(i < roundedValue));
  }

  el.appendChild(starsWrap);
}

export function initAllRatings() {
  document.querySelectorAll('[data-rating]').forEach(renderRating);
}
