/**
 * Computes which page numbers (and where to place "..." gaps) a pagination
 * control should render for a given current page / total page count.
 * Pure and DOM-free so it can be unit tested directly.
 */
export function getPaginationRange(current, total, maxVisible = 5) {
  if (total <= 0) return [];
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, current - half);
  let end = start + maxVisible - 1;

  if (end > total) {
    end = total;
    start = end - maxVisible + 1;
  }

  const range = [];
  if (start > 1) {
    range.push(1);
    if (start > 2) range.push('...');
  }

  for (let page = start; page <= end; page += 1) {
    range.push(page);
  }

  if (end < total) {
    if (end < total - 1) range.push('...');
    range.push(total);
  }

  return range;
}
