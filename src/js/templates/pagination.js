import { getPaginationRange } from '../pagination-range.js';

export function createPaginationHtml(currentInput, totalInput) {
  const current = Number(currentInput);
  const total = Number(totalInput);

  if (total <= 1) return '';

  const range = getPaginationRange(current, total);

  return range
    .map((item) =>
      item === '...'
        ? '<span class="pagination__ellipsis">...</span>'
        : `<button class="pagination__num${item === current ? ' is-active' : ''}" type="button" data-page="${item}"${item === current ? ' aria-current="page"' : ''}>${item}</button>`
    )
    .join('');
}
