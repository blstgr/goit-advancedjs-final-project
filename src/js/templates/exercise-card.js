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
  const favoriteAction = showRemoveFromFavorites
    ? `<button class="exercise-card__favorite-btn" type="button" data-remove-favorite="${escapeHtml(id)}" aria-label="Видалити з улюблених">
        <img src="/src/images/icon-trash.svg" alt="" />
      </button>`
    : '';

  return `
    <article class="exercise-card" data-exercise-id="${escapeHtml(id)}">
      <h3 class="exercise-card__name">${escapeHtml(name)}</h3>
      <ul class="exercise-card__meta">
        <li class="exercise-card__meta-item">Burned calories: <span>${escapeHtml(burnedCalories)}/3 min</span></li>
        <li class="exercise-card__meta-item">Body part: <span>${escapeHtml(bodyPart)}</span></li>
        <li class="exercise-card__meta-item">Target: <span>${escapeHtml(target)}</span></li>
      </ul>
      <div class="exercise-card__footer">
        <div class="rating" data-rating="${escapeHtml(rating)}"></div>
        <div class="exercise-card__actions">
          <button class="exercise-card__start-btn" type="button" data-open-exercise="${escapeHtml(id)}">Start</button>
          ${favoriteAction}
        </div>
      </div>
    </article>
  `.trim();
}
