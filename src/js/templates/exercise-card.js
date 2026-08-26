import iconTrash from '/src/images/icon-trash.svg';
import iconArrowRight from '/src/images/icon-arrow-right.svg';
import iconRunDark from '/src/images/icon-run-dark.svg';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function createExerciseCardHtml({
  id,
  name,
  bodyPart,
  target,
  burnedCalories,
  rating = 0,
  showRemoveFromFavorites = false,
}) {
  // On the favorites page the card drops the rating and shows a bare trash
  // icon next to the badge instead — a distinct variant, not just the
  // regular card with a button swapped in.
  const badgeExtra = showRemoveFromFavorites
    ? `<button class="exercise-card__favorite-btn" type="button" data-remove-favorite="${escapeHtml(id)}" aria-label="Видалити з улюблених">
        <img src="${iconTrash}" alt="" />
      </button>`
    : `<div class="rating rating--single exercise-card__rating" data-rating="${escapeHtml(rating)}"></div>`;

  return `
    <article
      class="exercise-card${showRemoveFromFavorites ? ' exercise-card--favorite' : ''}"
      data-exercise-id="${escapeHtml(id)}"
      data-open-exercise="${escapeHtml(id)}"
      tabindex="0"
      role="button"
    >
      <div class="exercise-card__top">
        <div class="exercise-card__badges">
          <span class="exercise-card__badge">Workout</span>
          ${badgeExtra}
        </div>
        <span class="exercise-card__start">
          Start
          <img class="exercise-card__start-icon" src="${iconArrowRight}" alt="" />
        </span>
      </div>
      <div class="exercise-card__title">
        <img class="exercise-card__icon" src="${iconRunDark}" alt="" />
        <h3 class="exercise-card__name">${escapeHtml(name)}</h3>
      </div>
      <ul class="exercise-card__meta">
        <li class="exercise-card__meta-item">Burned calories: <span>${escapeHtml(burnedCalories)} / 3 min</span></li>
        <li class="exercise-card__meta-item">Body part: <span>${escapeHtml(bodyPart)}</span></li>
        <li class="exercise-card__meta-item">Target: <span>${escapeHtml(target)}</span></li>
      </ul>
    </article>
  `.trim();
}
