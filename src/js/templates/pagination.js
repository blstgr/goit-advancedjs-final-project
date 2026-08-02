import { getPaginationRange } from '../pagination-range.js';

function chevron() {
  return '<img class="pagination__icon" src="/src/images/icon-chevron-left.svg" alt="" />';
}

export function createPaginationHtml(current, total) {
  if (total <= 1) return '';

  const range = getPaginationRange(current, total);
  const isFirst = current <= 1;
  const isLast = current >= total;

  const numbers = range
    .map((item) =>
      item === '...'
        ? '<span class="pagination__ellipsis">...</span>'
        : `<button class="pagination__num${item === current ? ' is-active' : ''}" type="button" data-page="${item}">${item}</button>`
    )
    .join('');

  return `
    <div class="pagination__arrows">
      <button class="pagination__jump-btn" type="button" data-page="1" ${isFirst ? 'disabled' : ''} aria-label="До першої сторінки">
        ${chevron()}${chevron()}
      </button>
      <button class="pagination__arrow-btn" type="button" data-page="${current - 1}" ${isFirst ? 'disabled' : ''} aria-label="Попередня сторінка">
        ${chevron()}
      </button>
    </div>
    <div class="pagination__numbers">${numbers}</div>
    <div class="pagination__arrows">
      <button class="pagination__arrow-btn pagination__arrow-btn--next" type="button" data-page="${current + 1}" ${isLast ? 'disabled' : ''} aria-label="Наступна сторінка">
        ${chevron()}
      </button>
      <button class="pagination__jump-btn pagination__jump-btn--end" type="button" data-page="${total}" ${isLast ? 'disabled' : ''} aria-label="До останньої сторінки">
        ${chevron()}${chevron()}
      </button>
    </div>
  `.trim();
}
