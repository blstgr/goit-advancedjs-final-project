export function initFilters(filtersEl) {
  const buttons = filtersEl.querySelectorAll('.filters__btn');

  filtersEl.addEventListener('click', (event) => {
    const btn = event.target.closest('.filters__btn');
    if (!btn || !filtersEl.contains(btn)) return;

    buttons.forEach((el) => el.classList.toggle('is-active', el === btn));

    filtersEl.dispatchEvent(
      new CustomEvent('filterchange', {
        bubbles: true,
        detail: { filter: btn.dataset.filter },
      })
    );
  });
}

export function initAllFilters() {
  document.querySelectorAll('[data-filters]').forEach(initFilters);
}
