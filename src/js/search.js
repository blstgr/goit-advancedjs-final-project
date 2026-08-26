export function initSearch(form) {
  const input = form.querySelector('[data-search-input]');
  const clearBtn = form.querySelector('[data-search-clear]');

  if (!input || !clearBtn) return;

  const syncState = () => {
    form.classList.toggle('search--has-value', input.value.length > 0);
  };

  input.addEventListener('input', syncState);

  clearBtn.addEventListener('click', () => {
    input.value = '';
    syncState();
    input.focus();
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });

  syncState();
}

export function initAllSearchForms() {
  document.querySelectorAll('[data-search-form]').forEach(initSearch);
}
