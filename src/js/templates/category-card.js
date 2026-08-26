function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function createCategoryCardHtml({ name, filter, imageUrl }) {
  return `
    <button class="category-card" type="button" data-category-name="${escapeHtml(name)}">
      <img class="category-card__img" src="${escapeHtml(imageUrl)}" alt="${escapeHtml(name)}" loading="lazy" />
      <span class="category-card__overlay">
        <span class="category-card__name">${escapeHtml(name)}</span>
        <span class="category-card__filter">${escapeHtml(filter)}</span>
      </span>
    </button>
  `.trim();
}
